package com.gijun.rally.shared.exception

import org.springframework.http.HttpStatus

/**
 * 서비스 공통 에러 코드. 도메인별 sealed 예외는 각 서비스 domain 레이어에 두고,
 * 인프라 경계에서 이 코드로 매핑해 일관된 응답을 만든다.
 */
enum class ErrorCode(val status: HttpStatus, val defaultMessage: String) {
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "권한이 없습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "리소스를 찾을 수 없습니다."),
    CONFLICT(HttpStatus.CONFLICT, "이미 존재하거나 충돌이 발생했습니다."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다."),
}
