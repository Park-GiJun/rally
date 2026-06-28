package com.gijun.rally.group.application.port.`in`

import com.gijun.rally.group.application.dto.command.CreateGroupCommand

interface CreateGroupUseCase {
    fun createGroup(query : CreateGroupCommand)
}