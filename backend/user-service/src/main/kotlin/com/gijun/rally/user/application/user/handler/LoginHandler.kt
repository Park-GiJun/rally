package com.gijun.rally.user.application.user.handler

import com.gijun.rally.user.application.user.dto.LoginCommand
import com.gijun.rally.user.application.user.dto.TokenResult
import com.gijun.rally.user.application.user.port.`in`.LoginUseCase
import com.gijun.rally.user.application.user.port.out.LoadUserPort
import com.gijun.rally.user.application.user.port.out.PasswordEncoderPort
import com.gijun.rally.user.application.user.port.out.TokenIssuerPort
import com.gijun.rally.user.domain.exception.UserException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** 로그인 핸들러. 자격 검증 후 JWT 를 발급한다(쓰기 없음 → readOnly). */
@Service
class LoginHandler(
    private val loadUserPort: LoadUserPort,
    private val passwordEncoder: PasswordEncoderPort,
    private val tokenIssuer: TokenIssuerPort,
) : LoginUseCase {

    @Transactional(readOnly = true)
    override fun login(command: LoginCommand): TokenResult {
        val user = loadUserPort.findByEmail(command.email)
            ?: throw UserException.InvalidCredentials()
        if (!passwordEncoder.matches(command.password, user.passwordHash)) {
            throw UserException.InvalidCredentials()
        }
        return TokenResult(accessToken = tokenIssuer.issue(user))
    }
}
