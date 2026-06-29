package com.gijun.rally.group.application.port.out

import com.gijun.rally.group.domain.model.GroupModel

/** 그룹 조회(읽기) 포트. 없으면 null. */
fun interface LoadGroupPort {
    fun findById(groupId: Long): GroupModel?
}
