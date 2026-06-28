package com.gijun.rally.user.application.user.port.`in`

import com.gijun.rally.user.application.user.dto.command.LoginCommand
import com.gijun.rally.user.application.user.dto.result.TokenResult

/** 로그인 유스케이스(Command — 토큰 발급 부수효과). */
fun interface LoginUseCase {
    fun login(command: LoginCommand): TokenResult
}
