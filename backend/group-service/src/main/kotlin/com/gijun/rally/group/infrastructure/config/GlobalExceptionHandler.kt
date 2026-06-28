package com.gijun.rally.group.infrastructure.config

import com.gijun.rally.shared.exception.ErrorCode
import com.gijun.rally.shared.exception.RallyException
import com.gijun.rally.shared.web.ApiResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/** 도메인/검증 예외를 shared 의 ErrorCode 기반 일관 응답으로 매핑한다. */
@RestControllerAdvice
class GlobalExceptionHandler {

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

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(ex: Exception): ResponseEntity<ApiResponse<Nothing>> =
        ResponseEntity
            .status(ErrorCode.INTERNAL_ERROR.status)
            .body(ApiResponse.fail(ErrorCode.INTERNAL_ERROR.name, ErrorCode.INTERNAL_ERROR.defaultMessage))
}
