package com.gijun.rally.activity.application.activity.handler.query

import com.gijun.rally.activity.application.activity.dto.query.GetActivityFeedQuery
import com.gijun.rally.activity.application.activity.dto.result.ActivityResult
import com.gijun.rally.activity.application.activity.port.`in`.query.GetActivityFeedUseCase
import com.gijun.rally.activity.application.activity.port.out.persistence.LoadActivityPort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** Activity 애그리거트 Query 핸들러. 조회 전용(readOnly). P1+ 에서는 feed-service read model 로 분리. */
@Service
@Transactional(readOnly = true)
class ActivityQueryHandler(
    private val loadActivityPort: LoadActivityPort,
) : GetActivityFeedUseCase {

    override fun feed(query: GetActivityFeedQuery): List<ActivityResult> =
        loadActivityPort
            .findFeed(actorId = query.actorId, groupId = query.groupId, limit = query.limit)
            .map(ActivityResult::from)
}
