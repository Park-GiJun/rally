package com.gijun.rally.user.domain.exception

import com.gijun.rally.shared.exception.ErrorCode
import com.gijun.rally.shared.exception.RallyException

/**
 * user 도메인 예외. sealed 로 모든 실패 사례를 한곳에 모으고, infrastructure 의 예외 핸들러가
 * shared 의 [ErrorCode] 로 매핑한다.
 */
sealed class UserException(code: ErrorCode, message: String) : RallyException(code, message) {

    class EmailAlreadyExists(email: String) :
        UserException(ErrorCode.CONFLICT, "이미 사용 중인 이메일입니다: $email")

    class UserNotFound(userId: Long) :
        UserException(ErrorCode.NOT_FOUND, "사용자를 찾을 수 없습니다: $userId")

    class InvalidCredentials :
        UserException(ErrorCode.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.")
}
