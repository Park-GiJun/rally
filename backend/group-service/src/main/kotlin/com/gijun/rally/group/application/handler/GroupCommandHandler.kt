package com.gijun.rally.group.application.handler

import com.gijun.rally.group.application.dto.command.CreateGroupCommand
import com.gijun.rally.group.application.dto.command.DeleteGroupCommand
import com.gijun.rally.group.application.dto.command.UpdateGroupCommand
import com.gijun.rally.group.application.dto.result.GroupResult
import com.gijun.rally.group.application.port.`in`.CreateGroupUseCase
import com.gijun.rally.group.application.port.`in`.DeleteGroupUseCase
import com.gijun.rally.group.application.port.`in`.UpdateGroupUseCase
import com.gijun.rally.group.application.port.out.DeleteGroupPort
import com.gijun.rally.group.application.port.out.DeleteMembershipPort
import com.gijun.rally.group.application.port.out.LoadGroupPort
import com.gijun.rally.group.application.port.out.SaveGroupPort
import com.gijun.rally.group.application.port.out.SaveMembershipPort
import com.gijun.rally.group.domain.enums.GroupVisibility
import com.gijun.rally.group.domain.exception.GroupException
import com.gijun.rally.group.domain.model.GroupModel
import com.gijun.rally.group.domain.model.MembershipModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/**
 * Group 애그리거트 Command 핸들러. 그룹 생성·수정·삭제 등 쓰기 유스케이스를 한곳에 모은다.
 * 좁은 port.in 인터페이스(1 usecase=1 함수)는 유지하고, 구현만 애그리거트 단위로 묶는다.
 */
@Service
@Transactional
class GroupCommandHandler(
    private val saveGroupPort: SaveGroupPort,
    private val loadGroupPort: LoadGroupPort,
    private val deleteGroupPort: DeleteGroupPort,
    private val saveMembershipPort: SaveMembershipPort,
    private val deleteMembershipPort: DeleteMembershipPort,
) : CreateGroupUseCase, UpdateGroupUseCase, DeleteGroupUseCase {

    override fun createGroup(command: CreateGroupCommand): GroupResult {
        val now = Instant.now()
        val group = GroupModel.create(
            name = command.groupName,
            description = command.description,
            ownerId = command.ownerId,
            now = now,
            visibility = command.visibility ?: GroupVisibility.PRIVATE,
        )
        val saved = saveGroupPort.save(group)

        // 생성자에게 owner 멤버십을 함께 부여한다(같은 트랜잭션 경계).
        val ownerMembership = MembershipModel.owner(
            groupId = requireNotNull(saved.id) { "영속된 Group 만 멤버십을 가질 수 있다." },
            userId = command.ownerId,
            now = now,
        )
        saveMembershipPort.save(ownerMembership)

        return GroupResult.from(saved)
    }

    override fun updateGroup(command: UpdateGroupCommand): GroupResult {
        val group = requireOwnedGroup(command.groupId, command.requesterId)

        val now = Instant.now()
        var updated = group
        command.name?.let { updated = updated.rename(it, now) }
        // null = 미변경, 그 외(빈 문자열 포함) = 설명 변경/제거. 도메인 describe 가 blank→null 처리.
        if (command.description != null) updated = updated.describe(command.description, now)
        command.visibility?.let { updated = updated.changeVisibility(it, now) }

        return GroupResult.from(saveGroupPort.save(updated))
    }

    override fun deleteGroup(command: DeleteGroupCommand) {
        requireOwnedGroup(command.groupId, command.requesterId)

        // 연관 멤버십을 먼저 정리한 뒤 그룹을 삭제한다(같은 트랜잭션).
        // (가입 신청 영속이 도입되면 여기서 함께 정리한다.)
        deleteMembershipPort.deleteByGroupId(command.groupId)
        deleteGroupPort.deleteById(command.groupId)
    }

    /** 그룹을 조회하고 요청자가 owner 인지 검증한다. 아니면 도메인 예외. */
    private fun requireOwnedGroup(groupId: Long, requesterId: Long): GroupModel {
        val group = loadGroupPort.findById(groupId)
            ?: throw GroupException.GroupNotFound(groupId)
        if (!group.isOwnedBy(requesterId)) {
            throw GroupException.NotGroupOwner(groupId, requesterId)
        }
        return group
    }
}
