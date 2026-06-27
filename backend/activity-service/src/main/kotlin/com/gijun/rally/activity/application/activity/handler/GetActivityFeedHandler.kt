package com.gijun.rally.activity.application.activity.handler

import com.gijun.rally.activity.application.activity.dto.ActivityResult
import com.gijun.rally.activity.application.activity.dto.GetActivityFeedQuery
import com.gijun.rally.activity.application.activity.port.`in`.GetActivityFeedUseCase
import com.gijun.rally.activity.application.activity.port.out.LoadActivityPort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/** 피드 조회 QueryHandler. */
@Service
class GetActivityFeedHandler(
    private val loadActivityPort: LoadActivityPort,
) : GetActivityFeedUseCase {

    @Transactional(readOnly = true)
    override fun feed(query: GetActivityFeedQuery): List<ActivityResult> =
        loadActivityPort
            .findFeed(actorId = query.actorId, groupId = query.groupId, limit = query.limit)
            .map(ActivityResult::from)
}
