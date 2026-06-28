rootProject.name = "rally"

// edge / 공통
include("shared")
include("discovery-server")
include("gateway")

// P0 비즈니스 서비스 (코어 스파인 = activity-service)
include("user-service")
include("activity-service")

// P1+ 모듈은 단계가 켜질 때 include 한다 (group/feed/ranking/notification/realtime/habit/game/market)
include("group-service")
