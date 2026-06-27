package com.gijun.rally.user.application.user.handler

import com.gijun.rally.user.application.user.dto.RegisterUserCommand
import com.gijun.rally.user.application.user.dto.UserResult
import com.gijun.rally.user.application.user.port.`in`.RegisterUserUseCase
import com.gijun.rally.user.application.user.port.out.LoadUserPort
import com.gijun.rally.user.application.user.port.out.PasswordEncoderPort
import com.gijun.rally.user.application.user.port.out.SaveUserPort
import com.gijun.rally.user.domain.exception.UserException
import com.gijun.rally.user.domain.model.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/** 회원가입 CommandHandler. */
@Service
class RegisterUserHandler(
    private val loadUserPort: LoadUserPort,
    private val saveUserPort: SaveUserPort,
    private val passwordEncoder: PasswordEncoderPort,
) : RegisterUserUseCase {

    @Transactional
    override fun register(command: RegisterUserCommand): UserResult {
        if (loadUserPort.existsByEmail(command.email)) {
            throw UserException.EmailAlreadyExists(command.email)
        }
        val user = User.newUser(
            email = command.email,
            passwordHash = passwordEncoder.encode(command.password),
            nickname = command.nickname,
            now = Instant.now(),
        )
        return UserResult.from(saveUserPort.save(user))
    }
}
