package com.gijun.rally.group.application.dto.command

import com.gijun.rally.group.domain.enums.GroupVisibility

/**
 * 그룹 부분 수정. null 필드는 미변경.
 * - [name] null 이면 이름 유지, 값이면 변경(공백 불가).
 * - [description] null 이면 설명 유지, 빈 문자열이면 설명 제거, 값이면 변경.
 * - [visibility] null 이면 공개범위 유지.
 *
 * @property requesterId 요청자(게이트웨이의 X-User-Id). owner 여야 수정 가능.
 */
data class UpdateGroupCommand(
    val groupId: Long,
    val requesterId: Long,
    val name: String? = null,
    val description: String? = null,
    val visibility: GroupVisibility? = null,
)
