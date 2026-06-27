package com.gijun.rally.user.application.user.dto

/** 쓰기 의도(Command). 검증된 1차 입력만 담는다(웹 DTO 와 분리). */
data class RegisterUserCommand(
    val email: String,
    val password: String,
    val nickname: String,
)

data class LoginCommand(
    val email: String,
    val password: String,
)
