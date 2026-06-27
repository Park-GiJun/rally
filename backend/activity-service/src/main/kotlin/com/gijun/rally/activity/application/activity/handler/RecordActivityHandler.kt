package com.gijun.rally.activity.application.activity.handler

import com.gijun.rally.activity.application.activity.dto.ActivityEvent
import com.gijun.rally.activity.application.activity.dto.ActivityResult
import com.gijun.rally.activity.application.activity.dto.RecordActivityCommand
import com.gijun.rally.activity.application.activity.port.`in`.RecordActivityUseCase
import com.gijun.rally.activity.application.activity.port.out.PublishActivityPort
import com.gijun.rally.activity.application.activity.port.out.SaveActivityPort
import com.gijun.rally.activity.domain.model.Activity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/**
 * 코어 스파인 CommandHandler: 활동을 영속화하고 `activity.recorded` 이벤트를 발행한다.
 *
 * P0 는 단일 트랜잭션 + 로깅 발행. P1 에서 outbox 패턴으로 발행 신뢰성을 끌어올린다(설계만 선반영).
 */
@Service
class RecordActivityHandler(
    private val saveActivityPort: SaveActivityPort,
    private val publishActivityPort: PublishActivityPort,
) : RecordActivityUseCase {

    @Transactional
    override fun record(command: RecordActivityCommand): ActivityResult {
        val activity = Activity.record(
            actorId = command.actorId,
            groupId = command.groupId,
            type = command.type,
            payload = command.payload,
            occurredAt = command.occurredAt ?: Instant.now(),
        )
        val saved = saveActivityPort.save(activity)
        publishActivityPort.publish(ActivityEvent.from(saved))
        return ActivityResult.from(saved)
    }
}
