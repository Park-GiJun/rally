package com.gijun.rally.user.application.user.handler

import com.gijun.rally.user.application.user.dto.command.LoginCommand
import com.gijun.rally.user.application.user.dto.command.RegisterUserCommand
import com.gijun.rally.user.application.user.dto.result.TokenResult
import com.gijun.rally.user.application.user.dto.result.UserResult
import com.gijun.rally.user.application.user.port.`in`.LoginUseCase
import com.gijun.rally.user.application.user.port.`in`.RegisterUserUseCase
import com.gijun.rally.user.application.user.port.out.LoadUserPort
import com.gijun.rally.user.application.user.port.out.PasswordEncoderPort
import com.gijun.rally.user.application.user.port.out.SaveUserPort
import com.gijun.rally.user.application.user.port.out.TokenIssuerPort
import com.gijun.rally.user.domain.exception.UserException
import com.gijun.rally.user.domain.model.UserModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/**
 * User 애그리거트 Command 핸들러. 회원가입·로그인 등 쓰기/인증 유스케이스를 한곳에 모은다.
 * 좁은 port.in 인터페이스(1 usecase=1 함수)는 그대로 유지하고, 구현만 애그리거트 단위로 묶었다.
 */
@Service
@Transactional
class UserCommandHandler(
    private val loadUserPort: LoadUserPort,
    private val saveUserPort: SaveUserPort,
    private val passwordEncoder: PasswordEncoderPort,
    private val tokenIssuer: TokenIssuerPort,
) : RegisterUserUseCase, LoginUseCase {

    override fun register(command: RegisterUserCommand): UserResult {
        if (loadUserPort.existsByEmail(command.email)) {
            throw UserException.EmailAlreadyExists(command.email)
        }
        val userModel = UserModel.newUser(
            email = command.email,
            passwordHash = passwordEncoder.encode(command.password),
            nickname = command.nickname,
            now = Instant.now(),
        )
        return UserResult.from(saveUserPort.save(userModel))
    }

    /** 자격 검증 후 JWT 발급. 쓰기가 없어 클래스 기본값을 readOnly 로 오버라이드한다. */
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
