package com.gijun.rally.activity.domain.model

import com.gijun.rally.activity.domain.enums.ActivityType
import java.time.Instant

/**
 * 코어 도메인(척추). type 별 세부 데이터는 [payload] 에 담아 스키마를 유연하게 확장한다.
 *
 * @property groupId P0(개인 단계)에서는 null 가능. P1(그룹)부터 채워진다.
 * @property schemaVersion 이벤트 진화 대비. consumer 는 하위호환을 유지한다.
 */
data class ActivityModel(
    val id: Long?,
    val actorId: Long,
    val groupId: Long?,
    val type: ActivityType,
    val payload: Map<String, Any?>,
    val occurredAt: Instant,
    val schemaVersion: Int = CURRENT_SCHEMA_VERSION,
) {
    companion object {
        const val CURRENT_SCHEMA_VERSION = 1

        fun record(
            actorId: Long,
            groupId: Long?,
            type: ActivityType,
            payload: Map<String, Any?>,
            occurredAt: Instant,
        ): ActivityModel =
            ActivityModel(
                id = null,
                actorId = actorId,
                groupId = groupId,
                type = type,
                payload = payload,
                occurredAt = occurredAt,
                schemaVersion = CURRENT_SCHEMA_VERSION,
            )
    }
}
