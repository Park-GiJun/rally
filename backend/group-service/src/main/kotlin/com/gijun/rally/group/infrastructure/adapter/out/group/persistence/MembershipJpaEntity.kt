package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import com.gijun.rally.group.domain.enums.GroupRole
import com.gijun.rally.group.domain.model.MembershipModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.time.Instant

/**
 * 영속 엔티티. 도메인 [MembershipModel] 와 분리한다.
 * (groupId, userId) 는 멤버십의 정체성이므로 유니크 제약으로 중복 가입을 막는다.
 */
@Entity
@Table(
    name = "memberships",
    uniqueConstraints = [UniqueConstraint(name = "uk_membership_group_user", columnNames = ["groupId", "userId"])],
)
class MembershipJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var groupId: Long,

    @Column(nullable = false)
    var userId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: GroupRole,

    @Column(nullable = false)
    var joinedAt: Instant,
) {
    fun toDomain(): MembershipModel =
        MembershipModel(
            id = id,
            groupId = groupId,
            userId = userId,
            role = role,
            joinedAt = joinedAt,
        )

    companion object {
        fun fromDomain(membershipModel: MembershipModel): MembershipJpaEntity =
            MembershipJpaEntity(
                id = membershipModel.id,
                groupId = membershipModel.groupId,
                userId = membershipModel.userId,
                role = membershipModel.role,
                joinedAt = membershipModel.joinedAt,
            )
    }
}
