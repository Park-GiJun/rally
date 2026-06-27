package com.gijun.rally.user.application.user.port.`in`

import com.gijun.rally.user.application.user.dto.RegisterUserCommand
import com.gijun.rally.user.application.user.dto.UserResult

/** 회원가입 유스케이스(Command). */
fun interface RegisterUserUseCase {
    fun register(command: RegisterUserCommand): UserResult
}
