package com.gijun.rally.user.infrastructure.adapter.out.user.persistence

import com.gijun.rally.user.application.user.port.out.LoadUserPort
import com.gijun.rally.user.application.user.port.out.SaveUserPort
import com.gijun.rally.user.domain.model.User
import org.springframework.stereotype.Component

/** SaveUserPort / LoadUserPort 의 JPA 구현. 도메인 ↔ 엔티티 변환 경계. */
@Component
class UserPersistenceAdapter(
    private val repository: UserJpaRepository,
) : SaveUserPort, LoadUserPort {

    override fun save(user: User): User =
        repository.save(UserJpaEntity.fromDomain(user)).toDomain()

    override fun findById(id: Long): User? =
        repository.findById(id).map { it.toDomain() }.orElse(null)

    override fun findByEmail(email: String): User? =
        repository.findByEmail(email)?.toDomain()

    override fun existsByEmail(email: String): Boolean =
        repository.existsByEmail(email)
}
