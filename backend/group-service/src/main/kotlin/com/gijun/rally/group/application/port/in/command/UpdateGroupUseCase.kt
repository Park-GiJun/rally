package com.gijun.rally.group.application.port.`in`.command

import com.gijun.rally.group.application.dto.command.UpdateGroupCommand
import com.gijun.rally.group.application.dto.result.GroupResult

/** 그룹 수정 유스케이스(Command). owner 만 수행 가능. 부분 수정(null 필드는 미변경). */
fun interface UpdateGroupUseCase {
    fun updateGroup(command: UpdateGroupCommand): GroupResult
}
