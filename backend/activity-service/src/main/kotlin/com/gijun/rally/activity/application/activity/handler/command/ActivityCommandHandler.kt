package com.gijun.rally.activity.application.activity.handler.command

import com.gijun.rally.activity.application.activity.dto.command.RecordActivityCommand
import com.gijun.rally.activity.application.activity.dto.event.ActivityEvent
import com.gijun.rally.activity.application.activity.dto.result.ActivityResult
import com.gijun.rally.activity.application.activity.port.`in`.command.RecordActivityUseCase
import com.gijun.rally.activity.application.activity.port.out.message.PublishActivityPort
import com.gijun.rally.activity.application.activity.port.out.persistence.SaveActivityPort
import com.gijun.rally.activity.domain.model.ActivityModel
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/**
 * Activity 애그리거트(코어 스파인) Command 핸들러: 활동을 영속화하고 `activity.recorded` 를 발행한다.
 *
 * P0 는 단일 트랜잭션 + 로깅 발행. P1 에서 outbox 패턴으로 발행 신뢰성을 끌어올린다(설계만 선반영).
 */
@Service
@Transactional
class ActivityCommandHandler(
    private val saveActivityPort: SaveActivityPort,
    private val publishActivityPort: PublishActivityPort,
) : RecordActivityUseCase {

    override fun record(command: RecordActivityCommand): ActivityResult {
        val activityModel = ActivityModel.record(
            actorId = command.actorId,
            groupId = command.groupId,
            type = command.type,
            payload = command.payload,
            occurredAt = command.occurredAt ?: Instant.now(),
        )
        val saved = saveActivityPort.save(activityModel)
        publishActivityPort.publish(ActivityEvent.from(saved))
        return ActivityResult.from(saved)
    }
}
