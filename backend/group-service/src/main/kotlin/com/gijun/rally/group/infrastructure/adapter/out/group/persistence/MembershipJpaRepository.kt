package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface MembershipJpaRepository : JpaRepository<MembershipJpaEntity, Long> {
    /** 그룹 삭제 시 해당 그룹의 모든 멤버십을 일괄 삭제(파생 삭제 쿼리). */
    fun deleteByGroupId(groupId: Long)
}
