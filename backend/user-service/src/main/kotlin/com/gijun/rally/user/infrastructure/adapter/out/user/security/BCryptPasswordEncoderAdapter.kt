package com.gijun.rally.user.infrastructure.adapter.out.user.security

import com.gijun.rally.user.application.user.port.out.security.PasswordEncoderPort
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

/** PasswordEncoderPort 의 BCrypt 구현(spring-security-crypto, 필터 체인 없음). */
@Component
class BCryptPasswordEncoderAdapter : PasswordEncoderPort {

    private val encoder = BCryptPasswordEncoder()

    override fun encode(rawPassword: String): String =
        // BCrypt 는 null 을 반환하지 않지만, -Xjsr305=strict 로 Spring API 가 nullable 로 잡혀 단언.
        requireNotNull(encoder.encode(rawPassword)) { "비밀번호 인코딩 결과는 null 일 수 없다." }

    override fun matches(rawPassword: String, encodedPassword: String): Boolean =
        encoder.matches(rawPassword, encodedPassword)
}
