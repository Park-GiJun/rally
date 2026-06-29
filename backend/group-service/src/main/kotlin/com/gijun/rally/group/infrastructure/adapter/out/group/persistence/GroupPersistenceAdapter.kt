package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import com.gijun.rally.group.application.port.out.DeleteGroupPort
import com.gijun.rally.group.application.port.out.LoadGroupPort
import com.gijun.rally.group.application.port.out.SaveGroupPort
import com.gijun.rally.group.domain.model.GroupModel
import org.springframework.stereotype.Component

/** 그룹 영속 포트(저장/조회/삭제)의 JPA 구현. 도메인 ↔ 엔티티 변환 경계. */
@Component
class GroupPersistenceAdapter(
    private val repository: GroupJpaRepository,
) : SaveGroupPort, LoadGroupPort, DeleteGroupPort {

    override fun save(groupModel: GroupModel): GroupModel =
        repository.save(GroupJpaEntity.fromDomain(groupModel)).toDomain()

    override fun findById(groupId: Long): GroupModel? =
        repository.findById(groupId).map { it.toDomain() }.orElse(null)

    override fun deleteById(groupId: Long) =
        repository.deleteById(groupId)
}
