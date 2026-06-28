package com.gijun.rally.group.infrastructure.adapter.`in`.group.web

import com.gijun.rally.group.application.port.`in`.CreateGroupUseCase
import com.gijun.rally.group.infrastructure.adapter.`in`.group.web.dto.CreateGroupRequest
import com.gijun.rally.group.infrastructure.adapter.`in`.group.web.dto.GroupResponse
import com.gijun.rally.shared.security.AuthHeaders
import com.gijun.rally.shared.web.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

/**
 * 그룹 엔드포인트. 신원은 gateway 가 검증해 넣어준 X-User-Id 헤더에서 읽는다
 * (이 서비스는 토큰을 다시 검증하지 않고 게이트웨이를 신뢰).
 */
@RestController
@RequestMapping("/api/groups")
class GroupController(
    private val createGroupUseCase: CreateGroupUseCase,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestHeader(AuthHeaders.USER_ID) userId: Long,
        @Valid @RequestBody request: CreateGroupRequest,
    ): ApiResponse<GroupResponse> {
        val result = createGroupUseCase.createGroup(request.toCommand(ownerId = userId))
        return ApiResponse.ok(GroupResponse.from(result))
    }
}
