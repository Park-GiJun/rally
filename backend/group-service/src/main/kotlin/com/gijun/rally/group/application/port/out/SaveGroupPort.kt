package com.gijun.rally.group.application.port.out

import com.gijun.rally.group.domain.model.GroupModel

/** 그룹 영속화(쓰기) 포트. */
fun interface SaveGroupPort {
    fun save(groupModel: GroupModel): GroupModel
}
