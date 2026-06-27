package com.gijun.rally.activity.infrastructure.adapter.`in`.activity.web.dto

import com.gijun.rally.activity.application.activity.dto.ActivityResult
import com.gijun.rally.activity.application.activity.dto.RecordActivityCommand
import com.gijun.rally.activity.domain.enums.ActivityType
import jakarta.validation.constraints.NotNull
import java.time.Instant

/**
 * 활동 기록 요청. **actorId 는 본문에 받지 않고** gateway 가 검증해 넣은 X-User-Id 헤더에서 취한다
 * (신원 위조 방지).
 */
data class RecordActivityRequest(
    @field:NotNull(message = "type 은 필수입니다.")
    val type: ActivityType,

    val groupId: Long? = null,

    val payload: Map<String, Any?> = emptyMap(),

    val occurredAt: Instant? = null,
) {
    fun toCommand(actorId: Long): RecordActivityCommand =
        RecordActivityCommand(
            actorId = actorId,
            groupId = groupId,
            type = type,
            payload = payload,
            occurredAt = occurredAt,
        )
}

data class ActivityResponse(
    val id: Long,
    val actorId: Long,
    val groupId: Long?,
    val type: ActivityType,
    val payload: Map<String, Any?>,
    val occurredAt: Instant,
    val schemaVersion: Int,
) {
    companion object {
        fun from(result: ActivityResult): ActivityResponse =
            ActivityResponse(
                id = result.id,
                actorId = result.actorId,
                groupId = result.groupId,
                type = result.type,
                payload = result.payload,
                occurredAt = result.occurredAt,
                schemaVersion = result.schemaVersion,
            )
    }
}
