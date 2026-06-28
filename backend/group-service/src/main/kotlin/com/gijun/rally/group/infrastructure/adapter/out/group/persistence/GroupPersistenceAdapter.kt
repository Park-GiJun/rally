package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import com.gijun.rally.group.application.port.out.SaveGroupPort
import com.gijun.rally.group.domain.model.GroupModel
import org.springframework.stereotype.Component

/** SaveGroupPort 의 JPA 구현. 도메인 ↔ 엔티티 변환 경계. */
@Component
class GroupPersistenceAdapter(
    private val repository: GroupJpaRepository,
) : SaveGroupPort {

    override fun save(groupModel: GroupModel): GroupModel =
        repository.save(GroupJpaEntity.fromDomain(groupModel)).toDomain()
}
