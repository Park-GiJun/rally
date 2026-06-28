package com.gijun.rally.group.domain.model

import com.gijun.rally.group.domain.enums.GroupRole
import java.time.Instant

/**
 * 그룹–사용자 멤버십. (groupId, userId) 한 쌍이 곧 멤버십의 정체성이다.
 *
 * @property id 영속 전에는 null.
 * @property role owner/member. 그룹당 owner 는 1명.
 */
data class MembershipModel(
    val id: Long?,
    val groupId: Long,
    val userId: Long,
    val role: GroupRole,
    val joinedAt: Instant,
) {
    val isOwner: Boolean get() = role == GroupRole.OWNER

    /** 역할 변경(승격·강등). 소유권 이전 등 정책 검증은 application 레이어가 책임진다. */
    fun changeRole(newRole: GroupRole): MembershipModel = copy(role = newRole)

    companion object {
        /** 그룹 생성자의 owner 멤버십. */
        fun owner(groupId: Long, userId: Long, now: Instant): MembershipModel =
            MembershipModel(id = null, groupId = groupId, userId = userId, role = GroupRole.OWNER, joinedAt = now)

        /** 초대 수락·가입으로 합류한 일반 member 멤버십. */
        fun member(groupId: Long, userId: Long, now: Instant): MembershipModel =
            MembershipModel(id = null, groupId = groupId, userId = userId, role = GroupRole.MEMBER, joinedAt = now)
    }
}
