package com.gijun.rally.user.application.user.port.`in`

import com.gijun.rally.user.application.user.dto.query.GetUserQuery
import com.gijun.rally.user.application.user.dto.result.UserResult

/** 단건 사용자 조회 유스케이스(Query). */
fun interface GetUserUseCase {
    fun getUser(query: GetUserQuery): UserResult
}
