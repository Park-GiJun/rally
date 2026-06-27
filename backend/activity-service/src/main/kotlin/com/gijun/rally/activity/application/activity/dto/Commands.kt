package com.gijun.rally.activity.application.activity.dto

import com.gijun.rally.activity.domain.enums.ActivityType
import java.time.Instant

/** 활동 기록 Command. occurredAt 미지정 시 핸들러가 기록 시각으로 채운다. */
data class RecordActivityCommand(
    val actorId: Long,
    val groupId: Long?,
    val type: ActivityType,
    val payload: Map<String, Any?>,
    val occurredAt: Instant?,
)
