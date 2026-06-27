package com.gijun.rally.activity.application.activity.dto

import com.gijun.rally.activity.domain.enums.ActivityType
import com.gijun.rally.activity.domain.model.Activity
import java.time.Instant

data class ActivityResult(
    val id: Long,
    val actorId: Long,
    val groupId: Long?,
    val type: ActivityType,
    val payload: Map<String, Any?>,
    val occurredAt: Instant,
    val schemaVersion: Int,
) {
    companion object {
        fun from(activity: Activity): ActivityResult =
            ActivityResult(
                id = requireNotNull(activity.id) { "영속된 Activity 만 결과로 변환할 수 있다." },
                actorId = activity.actorId,
                groupId = activity.groupId,
                type = activity.type,
                payload = activity.payload,
                occurredAt = activity.occurredAt,
                schemaVersion = activity.schemaVersion,
            )
    }
}
