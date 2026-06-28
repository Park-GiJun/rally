package com.gijun.rally.activity.application.activity.dto.result

import com.gijun.rally.activity.domain.enums.ActivityType
import com.gijun.rally.activity.domain.model.ActivityModel
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
        fun from(activityModel: ActivityModel): ActivityResult =
            ActivityResult(
                id = requireNotNull(activityModel.id) { "영속된 Activity 만 결과로 변환할 수 있다." },
                actorId = activityModel.actorId,
                groupId = activityModel.groupId,
                type = activityModel.type,
                payload = activityModel.payload,
                occurredAt = activityModel.occurredAt,
                schemaVersion = activityModel.schemaVersion,
            )
    }
}