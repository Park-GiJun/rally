package com.gijun.rally.activity.infrastructure.adapter.out.activity.persistence

import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface ActivityJpaRepository : JpaRepository<ActivityJpaEntity, Long> {
    fun findByActorId(actorId: Long, pageable: Pageable): List<ActivityJpaEntity>
    fun findByGroupId(groupId: Long, pageable: Pageable): List<ActivityJpaEntity>
}
