package com.gijun.rally.user.application.user.port.out

import com.gijun.rally.user.domain.model.UserModel

/** 조회(읽기) 포트. */
interface LoadUserPort {
    fun findById(id: Long): UserModel?
    fun findByEmail(email: String): UserModel?
    fun existsByEmail(email: String): Boolean
}
