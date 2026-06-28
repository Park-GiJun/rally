package com.gijun.rally.activity.application.activity.dto.event

import com.gijun.rally.activity.domain.enums.ActivityType
import com.gijun.rally.activity.domain.model.ActivityModel
import java.time.Instant

/**
 * `activity.recorded` 토픽으로 발행되는 이벤트 계약(척추).
 * feed/ranking/notification consumer 가 이 형태를 구독한다(P0 는 로깅 stand-in).
 *
 * key 는 groupId(그룹 단위 순서보장). groupId 가 null(개인)이면 actorId 로 대체한다.
 */
data class ActivityEvent(
    val activityId: Long,
    val actorId: Long,
    val groupId: Long?,
    val type: ActivityType,
    val payload: Map<String, Any?>,
    val occurredAt: Instant,
    val schemaVersion: Int,
) {
    /** Kafka 파티션 key. P1 그룹 단계에서 groupId 우선. */
    val partitionKey: String
        get() = (groupId ?: actorId).toString()

    companion object {
        fun from(activityModel: ActivityModel): ActivityEvent =
            ActivityEvent(
                activityId = requireNotNull(activityModel.id) { "영속된 Activity 만 발행할 수 있다." },
                actorId = activityModel.actorId,
                groupId = activityModel.groupId,
                type = activityModel.type,
                payload = activityModel.payload,
                occurredAt = activityModel.occurredAt,
                schemaVersion = activityModel.schemaVersion,
            )
    }
}