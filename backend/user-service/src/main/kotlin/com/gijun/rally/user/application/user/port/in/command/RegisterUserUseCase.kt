package com.gijun.rally.user.application.user.port.`in`.command

import com.gijun.rally.user.application.user.dto.command.RegisterUserCommand
import com.gijun.rally.user.application.user.dto.result.UserResult

/** 회원가입 유스케이스(Command). */
fun interface RegisterUserUseCase {
    fun register(command: RegisterUserCommand): UserResult
}
