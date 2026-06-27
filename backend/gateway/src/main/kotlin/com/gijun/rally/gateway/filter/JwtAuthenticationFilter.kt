package com.gijun.rally.gateway.filter

import com.gijun.rally.shared.security.AuthHeaders
import com.gijun.rally.shared.security.JwtTokenValidator
import org.springframework.core.Ordered
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import reactor.core.publisher.Mono

/**
 * rally 의 단일 인증 지점.
 *
 * 1. 공개 경로(/api/auth, /actuator 이하)는 검증 없이 통과시키되, 클라이언트가 위조한 X-User 헤더는 항상 제거한다.
 * 2. 그 외 경로는 Authorization: Bearer 를 검증하고, 성공 시 신원을 X-User-* 헤더로 덮어써 백엔드에 전파한다.
 * 3. 검증 실패 시 401 로 끊는다 — 백엔드는 헤더 신뢰만 하면 된다.
 */
@Component
class JwtAuthenticationFilter(
    private val validator: JwtTokenValidator,
) : GlobalFilter, Ordered {

    private val publicPathPrefixes = listOf("/api/auth/", "/actuator/")

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val path = request.uri.path

        // 어떤 경우에도 클라이언트가 보낸 X-User-* 는 신뢰하지 않는다.
        val sanitized = stripIdentityHeaders(request)

        if (isPublicPath(path)) {
            return chain.filter(exchange.mutate().request(sanitized).build())
        }

        val token = bearerToken(request)
            ?: return unauthorized(exchange, "토큰이 없습니다.")
        val claims = validator.validate(token)
            ?: return unauthorized(exchange, "유효하지 않은 토큰입니다.")

        val authenticated = sanitized.mutate()
            .header(AuthHeaders.USER_ID, claims.userId)
            .header(AuthHeaders.USER_EMAIL, claims.email)
            .header(AuthHeaders.USER_ROLE, claims.role)
            .build()

        return chain.filter(exchange.mutate().request(authenticated).build())
    }

    private fun isPublicPath(path: String): Boolean =
        publicPathPrefixes.any { path.startsWith(it) }

    private fun bearerToken(request: ServerHttpRequest): String? {
        val header = request.headers.getFirst(HttpHeaders.AUTHORIZATION) ?: return null
        return if (header.startsWith("Bearer ", ignoreCase = true)) header.substring(7).trim() else null
    }

    private fun stripIdentityHeaders(request: ServerHttpRequest): ServerHttpRequest =
        request.mutate().headers { headers ->
            headers.remove(AuthHeaders.USER_ID)
            headers.remove(AuthHeaders.USER_EMAIL)
            headers.remove(AuthHeaders.USER_ROLE)
        }.build()

    private fun unauthorized(exchange: ServerWebExchange, message: String): Mono<Void> {
        val response = exchange.response
        response.statusCode = HttpStatus.UNAUTHORIZED
        response.headers.add("Content-Type", "application/json; charset=UTF-8")
        val body = """{"success":false,"error":{"code":"UNAUTHORIZED","message":"$message"}}"""
        val buffer = response.bufferFactory().wrap(body.toByteArray(Charsets.UTF_8))
        return response.writeWith(Mono.just(buffer))
    }

    // 라우팅 전에 가장 먼저 동작하도록 높은 우선순위.
    override fun getOrder(): Int = -100
}
