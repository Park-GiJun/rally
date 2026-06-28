package com.gijun.rally.activity.infrastructure.adapter.`in`.activity.web

import com.gijun.rally.activity.application.activity.dto.query.GetActivityFeedQuery
import com.gijun.rally.activity.application.activity.port.`in`.GetActivityFeedUseCase
import com.gijun.rally.activity.application.activity.port.`in`.RecordActivityUseCase
import com.gijun.rally.activity.infrastructure.adapter.`in`.activity.web.dto.ActivityResponse
import com.gijun.rally.activity.infrastructure.adapter.`in`.activity.web.dto.RecordActivityRequest
import com.gijun.rally.shared.security.AuthHeaders
import com.gijun.rally.shared.web.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

/** 코어 스파인의 외부 API. 신원은 gateway 가 넣어준 X-User-Id 헤더로 신뢰한다. */
@RestController
@RequestMapping("/api/activities")
class ActivityController(
    private val recordActivityUseCase: RecordActivityUseCase,
    private val getActivityFeedUseCase: GetActivityFeedUseCase,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun record(
        @RequestHeader(AuthHeaders.USER_ID) actorId: Long,
        @Valid @RequestBody request: RecordActivityRequest,
    ): ApiResponse<ActivityResponse> {
        val result = recordActivityUseCase.record(request.toCommand(actorId))
        return ApiResponse.ok(ActivityResponse.from(result))
    }

    /** groupId 가 있으면 그룹 피드, 없으면 내 개인 피드(P0 기본). */
    @GetMapping("/feed")
    fun feed(
        @RequestHeader(AuthHeaders.USER_ID) actorId: Long,
        @RequestParam(required = false) groupId: Long?,
        @RequestParam(required = false, defaultValue = "50") limit: Int,
    ): ApiResponse<List<ActivityResponse>> {
        val query = if (groupId != null) {
            GetActivityFeedQuery(actorId = null, groupId = groupId, limit = limit)
        } else {
            GetActivityFeedQuery(actorId = actorId, groupId = null, limit = limit)
        }
        val results = getActivityFeedUseCase.feed(query).map(ActivityResponse::from)
        return ApiResponse.ok(results)
    }
}
