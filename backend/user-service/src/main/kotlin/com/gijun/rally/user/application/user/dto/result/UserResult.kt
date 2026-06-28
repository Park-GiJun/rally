package com.gijun.rally.user.application.user.dto.result

import com.gijun.rally.user.domain.enums.UserRole
import com.gijun.rally.user.domain.model.UserModel

/** 유스케이스 반환 결과. 도메인/엔티티를 외부로 새지 않게 하는 경계 타입. */
data class UserResult(
    val id: Long,
    val email: String,
    val nickname: String,
    val role: UserRole,
) {
    companion object {
        fun from(userModel: UserModel): UserResult =
            UserResult(
                id = requireNotNull(userModel.id) { "영속된 User 만 결과로 변환할 수 있다." },
                email = userModel.email,
                nickname = userModel.nickname,
                role = userModel.role,
            )
    }
}