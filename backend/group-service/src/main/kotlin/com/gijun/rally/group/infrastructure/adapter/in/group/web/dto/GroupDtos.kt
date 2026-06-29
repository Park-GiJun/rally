package com.gijun.rally.group.infrastructure.adapter.`in`.group.web.dto

import com.gijun.rally.group.application.dto.command.CreateGroupCommand
import com.gijun.rally.group.application.dto.command.UpdateGroupCommand
import com.gijun.rally.group.application.dto.result.GroupResult
import com.gijun.rally.group.domain.enums.GroupVisibility
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

/** 웹 경계 요청/응답 DTO. application 의 Command/Result 와 분리(웹 검증 책임은 여기서). */
data class CreateGroupRequest(
    @field:NotBlank(message = "그룹 이름은 필수입니다.")
    @field:Size(min = 1, max = 50, message = "그룹 이름은 1~50자여야 합니다.")
    val name: String,

    @field:Size(max = 500, message = "설명은 500자 이하여야 합니다.")
    val description: String? = null,

    /** 미지정 시 핸들러에서 PRIVATE 로 처리한다. */
    val visibility: GroupVisibility? = null,
) {
    /** ownerId 는 요청 바디가 아니라 게이트웨이가 넣어준 X-User-Id 에서 받는다. */
    fun toCommand(ownerId: Long): CreateGroupCommand =
        CreateGroupCommand(
            groupName = name,
            description = description,
            ownerId = ownerId,
            visibility = visibility,
        )
}

/**
 * 부분 수정 요청. 보낸 필드만 변경된다(미포함/null = 미변경).
 * description 은 ""(빈 문자열)을 보내면 설명이 제거된다.
 */
data class UpdateGroupRequest(
    @field:Size(min = 1, max = 50, message = "그룹 이름은 1~50자여야 합니다.")
    val name: String? = null,

    @field:Size(max = 500, message = "설명은 500자 이하여야 합니다.")
    val description: String? = null,

    val visibility: GroupVisibility? = null,
) {
    /** groupId 는 경로변수, requesterId 는 게이트웨이가 넣어준 X-User-Id 에서 받는다. */
    fun toCommand(groupId: Long, requesterId: Long): UpdateGroupCommand =
        UpdateGroupCommand(
            groupId = groupId,
            requesterId = requesterId,
            name = name,
            description = description,
            visibility = visibility,
        )
}

data class GroupResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val ownerId: Long,
    val visibility: String,
) {
    companion object {
        fun from(result: GroupResult): GroupResponse =
            GroupResponse(
                id = result.id,
                name = result.name,
                description = result.description,
                ownerId = result.ownerId,
                visibility = result.visibility.name,
            )
    }
}
