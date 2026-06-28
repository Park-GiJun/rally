package com.gijun.rally.group.application.handler

import com.gijun.rally.group.application.dto.command.CreateGroupCommand
import com.gijun.rally.group.application.dto.result.GroupResult
import com.gijun.rally.group.application.port.`in`.CreateGroupUseCase
import com.gijun.rally.group.application.port.out.SaveGroupPort
import com.gijun.rally.group.application.port.out.SaveMembershipPort
import com.gijun.rally.group.domain.enums.GroupVisibility
import com.gijun.rally.group.domain.model.GroupModel
import com.gijun.rally.group.domain.model.MembershipModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/**
 * Group 애그리거트 Command 핸들러. 그룹 생성·수정 등 쓰기 유스케이스를 한곳에 모은다.
 * 좁은 port.in 인터페이스(1 usecase=1 함수)는 유지하고, 구현만 애그리거트 단위로 묶는다.
 */
@Service
@Transactional
class GroupCommandHandler(
    private val saveGroupPort: SaveGroupPort,
    private val saveMembershipPort: SaveMembershipPort,
) : CreateGroupUseCase {

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
}
