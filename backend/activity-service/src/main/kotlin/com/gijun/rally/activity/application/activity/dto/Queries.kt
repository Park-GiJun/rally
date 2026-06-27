package com.gijun.rally.activity.application.activity.dto

/**
 * 피드 조회 Query. P0 는 actorId(개인 타임라인), P1+ 는 groupId(그룹 피드) 기준.
 * 둘 다 null 이면 전체 최신순(관리/디버그용).
 */
data class GetActivityFeedQuery(
    val actorId: Long?,
    val groupId: Long?,
    val limit: Int = 50,
)
