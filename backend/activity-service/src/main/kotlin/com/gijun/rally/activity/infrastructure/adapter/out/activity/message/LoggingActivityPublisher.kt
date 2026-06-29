package com.gijun.rally.activity.infrastructure.adapter.out.activity.message

import com.gijun.rally.activity.application.activity.dto.event.ActivityEvent
import com.gijun.rally.activity.application.activity.port.out.message.PublishActivityPort
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component

private val log = KotlinLogging.logger {}

/**
 * **P0 stand-in.** `activity.recorded` 를 실제 브로커 대신 로그로 흘린다.
 * P1 에서 이 어댑터를 Kafka producer(topic=rally.activity.recorded, key=partitionKey)로 교체한다 — 포트는 불변.
 */
@Component
class LoggingActivityPublisher : PublishActivityPort {

    override fun publish(event: ActivityEvent) {
        log.info {
            "activity.recorded (P0 log) " +
                "id=${event.activityId} actor=${event.actorId} group=${event.groupId} " +
                "type=${event.type} key=${event.partitionKey} v=${event.schemaVersion}"
        }
    }
}
