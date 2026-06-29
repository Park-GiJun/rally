package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import com.gijun.rally.group.application.port.out.DeleteMembershipPort
import com.gijun.rally.group.application.port.out.SaveMembershipPort
import com.gijun.rally.group.domain.model.MembershipModel
import org.springframework.stereotype.Component

/** 멤버십 영속 포트(저장/삭제)의 JPA 구현. 도메인 ↔ 엔티티 변환 경계. */
@Component
class MembershipPersistenceAdapter(
    private val repository: MembershipJpaRepository,
) : SaveMembershipPort, DeleteMembershipPort {

    override fun save(membershipModel: MembershipModel): MembershipModel =
        repository.save(MembershipJpaEntity.fromDomain(membershipModel)).toDomain()

    override fun deleteByGroupId(groupId: Long) =
        repository.deleteByGroupId(groupId)
}
