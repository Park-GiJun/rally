package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface MembershipJpaRepository : JpaRepository<MembershipJpaEntity, Long>
