package com.gijun.rally.group.application.port.out

/** 그룹의 모든 멤버십 일괄 삭제 포트(그룹 삭제 시 정합성 정리). */
fun interface DeleteMembershipPort {
    fun deleteByGroupId(groupId: Long)
}
