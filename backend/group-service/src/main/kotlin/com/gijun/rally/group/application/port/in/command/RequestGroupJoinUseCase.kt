package com.gijun.rally.group.application.port.`in`.command

import com.gijun.rally.group.application.dto.command.RequestGroupJoinCommand

interface RequestGroupJoinUseCase {
    fun requestGroupJoin(command: RequestGroupJoinCommand)
}