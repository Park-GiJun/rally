package com.gijun.rally.user.application.user.port.out.token

import com.gijun.rally.user.domain.model.UserModel

/**
 * JWT 발급 포트. 검증은 gateway(shared) 가, **발급은 user-service** 가 한다.
 * 구현은 동일한 jwt.secret/issuer 로 서명한다.
 */
fun interface TokenIssuerPort {
    fun issue(userModel: UserModel): String
}
