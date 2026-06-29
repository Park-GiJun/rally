package com.gijun.rally.group.application.dto.command

/**
 * 그룹 삭제.
 * @property requesterId 요청자(게이트웨이의 X-User-Id). owner 여야 삭제 가능.
 */
data class DeleteGroupCommand(
    val groupId: Long,
    val requesterId: Long,
)
