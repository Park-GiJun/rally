package com.gijun.rally.group.application.port.`in`

import com.gijun.rally.group.application.dto.command.DeleteGroupCommand

/** 그룹 삭제 유스케이스(Command). owner 만 수행 가능. 연관 멤버십도 함께 정리한다. */
fun interface DeleteGroupUseCase {
    fun deleteGroup(command: DeleteGroupCommand)
}
