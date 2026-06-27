package com.gijun.rally.user.application.user.port.out

/** 비밀번호 해싱 포트(구현은 infrastructure 의 BCrypt 어댑터). */
interface PasswordEncoderPort {
    fun encode(rawPassword: String): String
    fun matches(rawPassword: String, encodedPassword: String): Boolean
}
