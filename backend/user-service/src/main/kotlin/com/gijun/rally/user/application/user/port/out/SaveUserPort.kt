package com.gijun.rally.user.application.user.port.out

import com.gijun.rally.user.domain.model.User

/** 영속화(쓰기) 포트. */
fun interface SaveUserPort {
    fun save(user: User): User
}
