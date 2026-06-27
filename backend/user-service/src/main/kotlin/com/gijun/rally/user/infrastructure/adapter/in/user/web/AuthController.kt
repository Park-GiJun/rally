package com.gijun.rally.user.infrastructure.adapter.`in`.user.web

import com.gijun.rally.shared.web.ApiResponse
import com.gijun.rally.user.application.user.dto.LoginCommand
import com.gijun.rally.user.application.user.port.`in`.LoginUseCase
import com.gijun.rally.user.application.user.port.`in`.RegisterUserUseCase
import com.gijun.rally.user.infrastructure.adapter.`in`.user.web.dto.LoginRequest
import com.gijun.rally.user.infrastructure.adapter.`in`.user.web.dto.RegisterRequest
import com.gijun.rally.user.infrastructure.adapter.`in`.user.web.dto.TokenResponse
import com.gijun.rally.user.infrastructure.adapter.`in`.user.web.dto.UserResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

/** 공개 인증 엔드포인트(/api/auth 이하 — gateway 가 JWT 검증 없이 통과시킨다). */
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val registerUserUseCase: RegisterUserUseCase,
    private val loginUseCase: LoginUseCase,
) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody request: RegisterRequest): ApiResponse<UserResponse> {
        val result = registerUserUseCase.register(request.toCommand())
        return ApiResponse.ok(UserResponse.from(result))
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ApiResponse<TokenResponse> {
        val result = loginUseCase.login(LoginCommand(email = request.email, password = request.password))
        return ApiResponse.ok(TokenResponse.from(result))
    }
}
