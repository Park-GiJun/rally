package com.gijun.rally.activity.domain.enums

/**
 * Activity 의 확장점. **새 도메인 추가 = 여기에 type 추가 + producer 서비스 1개**.
 * 피드/랭킹/알림 consumer 는 type 을 모른 채 동일하게 처리한다.
 */
enum class ActivityType {
    CHECKIN,      // 습관/챌린지 인증 (habit-service, P0 인라인)
    SCORE,        // 게임 스코어 (game-service, P2)
    MESSAGE,      // 그룹 메시지 (user/group)
    PRICE_ALERT,  // 관심종목 알림 (market-service, P2)
}
