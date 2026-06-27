package com.gijun.rally.activity.application.activity.dto

import com.gijun.rally.activity.domain.enums.ActivityType
import com.gijun.rally.activity.domain.model.Activity
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
        fun from(activity: Activity): ActivityEvent =
            ActivityEvent(
                activityId = requireNotNull(activity.id) { "영속된 Activity 만 발행할 수 있다." },
                actorId = activity.actorId,
                groupId = activity.groupId,
                type = activity.type,
                payload = activity.payload,
                occurredAt = activity.occurredAt,
                schemaVersion = activity.schemaVersion,
            )
    }
}
