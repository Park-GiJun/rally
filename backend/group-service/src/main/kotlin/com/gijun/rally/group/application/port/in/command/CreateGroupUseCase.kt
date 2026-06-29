package com.gijun.rally.group.application.port.`in`.command

import com.gijun.rally.group.application.dto.command.CreateGroupCommand
import com.gijun.rally.group.application.dto.result.GroupResult

/** 그룹 생성 유스케이스(Command). 생성자는 owner 멤버십을 함께 받는다. */
fun interface CreateGroupUseCase {
    fun createGroup(command: CreateGroupCommand): GroupResult
}
