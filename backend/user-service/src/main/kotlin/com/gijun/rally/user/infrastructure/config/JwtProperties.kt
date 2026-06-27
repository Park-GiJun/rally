package com.gijun.rally.user.infrastructure.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * 발급용 JWT 설정. secret/issuer 는 **gateway 와 동일** 해야 검증이 통과한다.
 * 운영 값은 환경변수(JWT_SECRET 등)로 주입한다.
 */
@ConfigurationProperties(prefix = "jwt")
data class JwtProperties(
    val secret: String,
    val issuer: String,
    val accessTokenValidityMinutes: Long = 60 * 24,
)
