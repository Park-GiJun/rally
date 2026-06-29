package com.gijun.rally.user.application.user.handler.query

import com.gijun.rally.user.application.user.dto.query.GetUserQuery
import com.gijun.rally.user.application.user.dto.result.UserResult
import com.gijun.rally.user.application.user.port.`in`.query.GetUserUseCase
import com.gijun.rally.user.application.user.port.out.persistence.LoadUserPort
import com.gijun.rally.user.domain.exception.UserException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** User 애그리거트 Query 핸들러. 조회 전용(readOnly). */
@Service
@Transactional(readOnly = true)
class UserQueryHandler(
    private val loadUserPort: LoadUserPort,
) : GetUserUseCase {

    override fun getUser(query: GetUserQuery): UserResult {
        val user = loadUserPort.findById(query.userId)
            ?: throw UserException.UserNotFound(query.userId)
        return UserResult.from(user)
    }
}
