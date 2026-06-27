package com.gijun.rally.activity.application.activity.port.out

import com.gijun.rally.activity.domain.model.Activity

interface LoadActivityPort {
    fun findById(id: Long): Activity?

    /** actorId/groupId 가 주어지면 그 기준으로, 둘 다 null 이면 전체 최신순으로 limit 개. */
    fun findFeed(actorId: Long?, groupId: Long?, limit: Int): List<Activity>
}
