package com.gijun.rally.user.application.user.port.`in`

import com.gijun.rally.user.application.user.dto.LoginCommand
import com.gijun.rally.user.application.user.dto.TokenResult

/** 로그인 유스케이스(Command — 토큰 발급 부수효과). */
fun interface LoginUseCase {
    fun login(command: LoginCommand): TokenResult
}
