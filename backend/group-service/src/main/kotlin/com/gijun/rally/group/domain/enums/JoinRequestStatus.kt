package com.gijun.rally.group.domain.enums

/**
 * 가입 신청 상태. 사용자가 신청하면 [PENDING], owner 의 결정으로 [APPROVED]/[REJECTED] 가 되고,
 * 신청자가 스스로 거두면 [CANCELED]. PENDING 외 상태는 모두 종료(재결정 불가).
 */
enum class JoinRequestStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELED,
}
