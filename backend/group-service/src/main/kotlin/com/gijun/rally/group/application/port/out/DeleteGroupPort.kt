package com.gijun.rally.group.application.port.out

/** 그룹 삭제 포트. */
fun interface DeleteGroupPort {
    fun deleteById(groupId: Long)
}
