package com.gijun.rally.user.application.user.dto.result

data class TokenResult(
    val accessToken: String,
    val tokenType: String = "Bearer",
)