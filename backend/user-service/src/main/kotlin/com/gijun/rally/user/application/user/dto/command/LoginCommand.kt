package com.gijun.rally.user.application.user.dto.command

data class LoginCommand(
    val email: String,
    val password: String,
)
