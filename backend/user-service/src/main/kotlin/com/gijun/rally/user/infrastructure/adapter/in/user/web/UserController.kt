package com.gijun.rally.user.infrastructure.adapter.`in`.user.web

import com.gijun.rally.shared.security.AuthHeaders
import com.gijun.rally.shared.web.ApiResponse
import com.gijun.rally.user.application.user.dto.query.GetUserQuery
import com.gijun.rally.user.application.user.port.`in`.query.GetUserUseCase
import com.gijun.rally.user.infrastructure.adapter.`in`.user.web.dto.UserResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * 인증된 사용자 엔드포인트. 신원은 gateway 가 검증해 넣어준 X-User-Id 헤더에서 읽는다
 * (이 서비스는 토큰을 다시 검증하지 않고 게이트웨이를 신뢰).
 */
@RestController
@RequestMapping("/api/users")
class UserController(
    private val getUserUseCase: GetUserUseCase,
) {

    @GetMapping("/me")
    fun me(@RequestHeader(AuthHeaders.USER_ID) userId: Long): ApiResponse<UserResponse> {
        val result = getUserUseCase.getUser(GetUserQuery(userId = userId))
        return ApiResponse.ok(UserResponse.from(result))
    }
}
