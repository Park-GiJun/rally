package com.gijun.rally.activity.application.activity.port.`in`.command

import com.gijun.rally.activity.application.activity.dto.result.ActivityResult
import com.gijun.rally.activity.application.activity.dto.command.RecordActivityCommand

/** 활동 기록 유스케이스(Command). 기록 + 이벤트 발행을 한 트랜잭션 경계에서 수행. */
fun interface RecordActivityUseCase {
    fun record(command: RecordActivityCommand): ActivityResult
}
