package com.gijun.rally.user.infrastructure.adapter.out.user.persistence

import com.gijun.rally.user.domain.enums.UserRole
import com.gijun.rally.user.domain.model.UserModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/** 영속 엔티티. 도메인 [UserModel] 와 분리해 JPA 세부사항이 도메인으로 새지 않게 한다. */
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
    fun toDomain(): UserModel =
        UserModel(
            id = id,
            email = email,
            passwordHash = passwordHash,
            nickname = nickname,
            role = role,
            createdAt = createdAt,
        )

    companion object {
        fun fromDomain(userModel: UserModel): UserJpaEntity =
            UserJpaEntity(
                id = userModel.id,
                email = userModel.email,
                passwordHash = userModel.passwordHash,
                nickname = userModel.nickname,
                role = userModel.role,
                createdAt = userModel.createdAt,
            )
    }
}
