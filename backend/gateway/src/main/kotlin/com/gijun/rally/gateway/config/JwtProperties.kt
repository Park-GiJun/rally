package com.gijun.rally.gateway.config

import com.gijun.rally.shared.security.JwtTokenValidator
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

/**
 * jwt.secret / jwt.issuer 는 user-service 와 **반드시 동일** 해야 한다(발급=user-service, 검증=gateway).
 * 값은 환경변수(JWT_SECRET 등)로 주입하며 repo 에는 dev 기본값만 둔다.
 */
@ConfigurationProperties(prefix = "jwt")
data class JwtProperties(
    val secret: String,
    val issuer: String,
)

@Configuration
class JwtConfig {
    @Bean
    fun jwtTokenValidator(props: JwtProperties): JwtTokenValidator =
        JwtTokenValidator(secret = props.secret, issuer = props.issuer)
}
