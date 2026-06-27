package com.gijun.rally.activity.application.activity.port.`in`

import com.gijun.rally.activity.application.activity.dto.ActivityResult
import com.gijun.rally.activity.application.activity.dto.GetActivityFeedQuery

/** 피드 조회 유스케이스(Query). P1+ 에서는 feed-service 의 read model 로 분리된다. */
fun interface GetActivityFeedUseCase {
    fun feed(query: GetActivityFeedQuery): List<ActivityResult>
}
