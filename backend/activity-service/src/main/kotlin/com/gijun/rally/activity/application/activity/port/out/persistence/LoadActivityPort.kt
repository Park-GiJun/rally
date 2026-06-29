package com.gijun.rally.activity.application.activity.port.out.persistence

import com.gijun.rally.activity.domain.model.ActivityModel

interface LoadActivityPort {
    fun findById(id: Long): ActivityModel?

    /** actorId/groupId 가 주어지면 그 기준으로, 둘 다 null 이면 전체 최신순으로 limit 개. */
    fun findFeed(actorId: Long?, groupId: Long?, limit: Int): List<ActivityModel>
}
