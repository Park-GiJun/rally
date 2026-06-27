package com.gijun.rally.user.application.user.port.`in`

import com.gijun.rally.user.application.user.dto.GetUserQuery
import com.gijun.rally.user.application.user.dto.UserResult

/** 단건 사용자 조회 유스케이스(Query). */
fun interface GetUserUseCase {
    fun getUser(query: GetUserQuery): UserResult
}
