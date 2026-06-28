package com.gijun.rally.group.domain.enums

/**
 * 그룹 내 멤버 역할. owner 는 그룹당 1명(생성자), 나머지는 member.
 * 작성·조회 인가(RP-49)는 이 역할을 기준으로 판단한다.
 */
enum class GroupRole {
    OWNER,
    MEMBER,
}
