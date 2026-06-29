package com.gijun.rally.group.application.port.out.persistence

import com.gijun.rally.group.domain.model.MembershipModel

/** 멤버십 영속화(쓰기) 포트. */
fun interface SaveMembershipPort {
    fun save(membershipModel: MembershipModel): MembershipModel
}
