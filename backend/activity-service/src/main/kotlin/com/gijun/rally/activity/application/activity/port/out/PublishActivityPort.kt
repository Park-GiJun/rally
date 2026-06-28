package com.gijun.rally.activity.application.activity.port.out

import com.gijun.rally.activity.application.activity.dto.event.ActivityEvent

/**
 * `activity.recorded` 발행 포트.
 * **P0**: 로깅 stand-in 어댑터. **P1**: Kafka producer 어댑터로 교체(포트는 그대로).
 */
fun interface PublishActivityPort {
    fun publish(event: ActivityEvent)
}
