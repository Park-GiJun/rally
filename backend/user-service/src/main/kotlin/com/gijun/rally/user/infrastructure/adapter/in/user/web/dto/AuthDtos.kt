package com.gijun.rally.user.infrastructure.adapter.`in`.user.web.dto

import com.gijun.rally.user.application.user.dto.command.RegisterUserCommand
import com.gijun.rally.user.application.user.dto.result.TokenResult
import com.gijun.rally.user.application.user.dto.result.UserResult
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/** 웹 경계 요청/응답 DTO. application 의 Command/Result 와 분리(웹 검증 책임은 여기서). */
data class RegisterRequest(
    @field:Email(message = "이메일 형식이 올바르지 않습니다.")
    @field:NotBlank(message = "이메일은 필수입니다.")
    val email: String,

    @field:NotBlank(message = "비밀번호는 필수입니다.")
    @field:Size(min = 8, max = 64, message = "비밀번호는 8~64자여야 합니다.")
    val password: String,

    @field:NotBlank(message = "닉네임은 필수입니다.")
    @field:Size(min = 2, max = 20, message = "닉네임은 2~20자여야 합니다.")
    val nickname: String,
) {
    fun toCommand(): RegisterUserCommand =
        RegisterUserCommand(email = email, password = password, nickname = nickname)
}

data class LoginRequest(
    @field:NotBlank val email: String,
    @field:NotBlank val password: String,
)

data class UserResponse(
    val id: Long,
    val email: String,
    val nickname: String,
    val role: String,
) {
    companion object {
        fun from(result: UserResult): UserResponse =
            UserResponse(
                id = result.id,
                email = result.email,
                nickname = result.nickname,
                role = result.role.name,
            )
    }
}

data class TokenResponse(
    val accessToken: String,
    val tokenType: String,
) {
    companion object {
        fun from(result: TokenResult): TokenResponse =
            TokenResponse(accessToken = result.accessToken, tokenType = result.tokenType)
    }
}
