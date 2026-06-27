package com.gijun.rally.user.infrastructure.adapter.out.user.persistence

import com.gijun.rally.user.domain.enums.UserRole
import com.gijun.rally.user.domain.model.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/** 영속 엔티티. 도메인 [User] 와 분리해 JPA 세부사항이 도메인으로 새지 않게 한다. */
@Entity
@Table(name = "users")
class UserJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(nullable = false)
    var passwordHash: String,

    @Column(nullable = false)
    var nickname: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var role: UserRole,

    @Column(nullable = false)
    var createdAt: Instant,
) {
    fun toDomain(): User =
        User(
            id = id,
            email = email,
            passwordHash = passwordHash,
            nickname = nickname,
            role = role,
            createdAt = createdAt,
        )

    companion object {
        fun fromDomain(user: User): UserJpaEntity =
            UserJpaEntity(
                id = user.id,
                email = user.email,
                passwordHash = user.passwordHash,
                nickname = user.nickname,
                role = user.role,
                createdAt = user.createdAt,
            )
    }
}
