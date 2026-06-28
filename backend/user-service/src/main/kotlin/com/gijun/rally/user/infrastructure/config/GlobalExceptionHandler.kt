package com.gijun.rally.user.infrastructure.config

import com.gijun.rally.shared.exception.ErrorCode
import com.gijun.rally.shared.exception.RallyException
import com.gijun.rally.shared.web.ApiResponse
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingRequestHeaderException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/** 도메인/검증 예외를 shared 의 ErrorCode 기반 일관 응답으로 매핑한다. */
@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(RallyException::class)
    fun handleRally(ex: RallyException): ResponseEntity<ApiResponse<Nothing>> =
        ResponseEntity
            .status(ex.code.status)
            .body(ApiResponse.fail(ex.code.name, ex.message))

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ApiResponse<Nothing>> {
        val message = ex.bindingResult.fieldErrors
            .joinToString(", ") { "${it.field}: ${it.defaultMessage}" }
            .ifBlank { ErrorCode.INVALID_INPUT.defaultMessage }
        return ResponseEntity
            .status(ErrorCode.INVALID_INPUT.status)
            .body(ApiResponse.fail(ErrorCode.INVALID_INPUT.name, message))
    }

    /** 깨진 JSON 본문·필수 헤더 누락 등 클라이언트 요청 결함 → 400. */
    @ExceptionHandler(HttpMessageNotReadableException::class, MissingRequestHeaderException::class)
    fun handleBadRequest(ex: Exception): ResponseEntity<ApiResponse<Nothing>> =
        ResponseEntity
            .status(ErrorCode.INVALID_INPUT.status)
            .body(ApiResponse.fail(ErrorCode.INVALID_INPUT.name, ex.message ?: ErrorCode.INVALID_INPUT.defaultMessage))

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(ex: Exception): ResponseEntity<ApiResponse<Nothing>> {
        log.error("처리되지 않은 예외", ex)
        return ResponseEntity
            .status(ErrorCode.INTERNAL_ERROR.status)
            .body(ApiResponse.fail(ErrorCode.INTERNAL_ERROR.name, ErrorCode.INTERNAL_ERROR.defaultMessage))
    }
}
