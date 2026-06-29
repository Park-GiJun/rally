package com.gijun.rally.group.application.dto.command

data class RequestGroupJoinCommand(
    val requesterId: Long,
    val groupId: Long,
)
