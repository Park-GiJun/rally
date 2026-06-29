package com.gijun.rally.group.infrastructure.adapter.`in`.group.web

import com.gijun.rally.group.application.dto.command.DeleteGroupCommand
import com.gijun.rally.group.application.port.`in`.CreateGroupUseCase
import com.gijun.rally.group.application.port.`in`.DeleteGroupUseCase
import com.gijun.rally.group.application.port.`in`.UpdateGroupUseCase
import com.gijun.rally.group.infrastructure.adapter.`in`.group.web.dto.CreateGroupRequest
import com.gijun.rally.group.infrastructure.adapter.`in`.group.web.dto.GroupResponse
import com.gijun.rally.group.infrastructure.adapter.`in`.group.web.dto.UpdateGroupRequest
import com.gijun.rally.shared.security.AuthHeaders
import com.gijun.rally.shared.web.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

/**
 * 그룹 엔드포인트. 신원은 gateway 가 검증해 넣어준 X-User-Id 헤더에서 읽는다
 * (이 서비스는 토큰을 다시 검증하지 않고 게이트웨이를 신뢰). 수정·삭제는 owner 만 가능.
 */
@RestController
@RequestMapping("/api/groups")
class GroupController(
    private val createGroupUseCase: CreateGroupUseCase,
    private val updateGroupUseCase: UpdateGroupUseCase,
    private val deleteGroupUseCase: DeleteGroupUseCase,
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

    @PatchMapping("/{groupId}")
    fun update(
        @RequestHeader(AuthHeaders.USER_ID) userId: Long,
        @PathVariable groupId: Long,
        @Valid @RequestBody request: UpdateGroupRequest,
    ): ApiResponse<GroupResponse> {
        val result = updateGroupUseCase.updateGroup(
            request.toCommand(groupId = groupId, requesterId = userId),
        )
        return ApiResponse.ok(GroupResponse.from(result))
    }

    @DeleteMapping("/{groupId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @RequestHeader(AuthHeaders.USER_ID) userId: Long,
        @PathVariable groupId: Long,
    ) {
        deleteGroupUseCase.deleteGroup(DeleteGroupCommand(groupId = groupId, requesterId = userId))
    }
}
