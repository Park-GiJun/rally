package com.gijun.rally.user.domain.model

import com.gijun.rally.user.domain.enums.UserRole
import java.time.Instant

/**
 * 순수 도메인 모델. JPA/Spring 을 모른다(영속성 엔티티는 infrastructure 의 별도 타입).
 *
 * @property id 영속 전에는 null.
 * @property passwordHash 평문은 도메인에 절대 들어오지 않는다 — 항상 해시만 보관.
 */
data class UserModel(
    val id: Long?,
    val email: String,
    val passwordHash: String,
    val nickname: String,
    val role: UserRole,
    val createdAt: Instant,
) {
    companion object {
        /** 신규 가입자 생성(아직 미영속). */
        fun newUser(email: String, passwordHash: String, nickname: String, now: Instant): UserModel =
            UserModel(
                id = null,
                email = email,
                passwordHash = passwordHash,
                nickname = nickname,
                role = UserRole.USER,
                createdAt = now,
            )
    }
}
