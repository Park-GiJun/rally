package com.gijun.rally.group.domain.enums

/**
 * 그룹 공개 범위(그룹 단위 설정). [PRIVATE] = 멤버만 조회, [PUBLIC] = 누구나 조회.
 *
 * 배포 롤아웃 단계("개인→친구→오픈" = P0→P1→P2)와는 무관하다 — 그건 인프라/배포 얘기이고,
 * 이건 개별 그룹의 속성이다.
 */
enum class GroupVisibility {
    PRIVATE,
    PUBLIC,
}
