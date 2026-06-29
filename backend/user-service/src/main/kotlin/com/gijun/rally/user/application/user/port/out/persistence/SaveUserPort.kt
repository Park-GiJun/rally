package com.gijun.rally.user.application.user.port.out.persistence

import com.gijun.rally.user.domain.model.UserModel

/** 영속화(쓰기) 포트. */
fun interface SaveUserPort {
    fun save(userModel: UserModel): UserModel
}
