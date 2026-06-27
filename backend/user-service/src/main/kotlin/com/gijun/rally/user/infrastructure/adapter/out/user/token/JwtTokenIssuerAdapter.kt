package com.gijun.rally.user.infrastructure.adapter.out.user.token

import com.gijun.rally.user.application.user.port.out.TokenIssuerPort
import com.gijun.rally.user.domain.model.User
import com.gijun.rally.user.infrastructure.config.JwtProperties
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.Instant
import java.util.Date

/** TokenIssuerPort 의 jjwt 구현. shared 의 JwtTokenValidator 와 동일한 secret/issuer 로 서명한다. */
@Component
class JwtTokenIssuerAdapter(
    props: JwtProperties,
) : TokenIssuerPort {

    private val key = Keys.hmacShaKeyFor(props.secret.toByteArray(Charsets.UTF_8))
    private val issuer = props.issuer
    private val validity = Duration.ofMinutes(props.accessTokenValidityMinutes)

    override fun issue(user: User): String {
        val userId = requireNotNull(user.id) { "영속된 User 만 토큰을 발급받을 수 있다." }
        val now = Instant.now()
        return Jwts.builder()
            .issuer(issuer)
            .subject(userId.toString())
            .claim("email", user.email)
            .claim("role", user.role.name)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(validity)))
            .signWith(key)
            .compact()
    }
}
