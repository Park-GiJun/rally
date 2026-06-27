package com.gijun.rally.user.application.user.handler

import com.gijun.rally.user.application.user.dto.GetUserQuery
import com.gijun.rally.user.application.user.dto.UserResult
import com.gijun.rally.user.application.user.port.`in`.GetUserUseCase
import com.gijun.rally.user.application.user.port.out.LoadUserPort
import com.gijun.rally.user.domain.exception.UserException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** 단건 조회 QueryHandler. */
@Service
class GetUserHandler(
    private val loadUserPort: LoadUserPort,
) : GetUserUseCase {

    @Transactional(readOnly = true)
    override fun getUser(query: GetUserQuery): UserResult {
        val user = loadUserPort.findById(query.userId)
            ?: throw UserException.UserNotFound(query.userId)
        return UserResult.from(user)
    }
}
