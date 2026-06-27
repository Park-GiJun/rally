package com.gijun.rally.user.application.user.port.out

import com.gijun.rally.user.domain.model.User

/** 조회(읽기) 포트. */
interface LoadUserPort {
    fun findById(id: Long): User?
    fun findByEmail(email: String): User?
    fun existsByEmail(email: String): Boolean
}
