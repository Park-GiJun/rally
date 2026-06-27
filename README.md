# rally

> 함께, 그리고 지속. **그룹 활동 피드 플랫폼.**

사람들이 그룹을 만들어 활동(습관 인증·게임 스코어·관심종목 등)을 기록하면 **실시간 피드 + 랭킹**으로
서로를 본다. 모든 도메인은 단일 추상화 `Group + Activity 이벤트 → 피드 + 랭킹` 의 변주로 흡수된다.

## 구성

```
backend/   Kotlin · Spring Boot 4 · Spring Cloud(Eureka+Gateway) · 헥사고날 + CQRS (MSA)
client/    web(React 19 + Vite, :13100) · mobile(React 19 + Vite 모바일웹, :13101) · android(Kotlin 네이티브)
infra/     PostgreSQL · Redis · Kafka (compose)
docs/      설계 정본 → docs/architecture.md · docs/frontend.md
```

`client/web`(:13100)·`client/mobile`(:13101)은 **같은 대시보드 앱**이다(같은 백엔드 계약 `ApiResponse` 봉투,
뷰만 미러: web=사이드바, mobile=하단탭). 대시보드(그룹×섹션 필터 실시간 피드) + 7개 도메인 섹션(캘린더·가계부·
SNS·LoL·할일·습관·주식)을 `Activity.type` 확장으로 흡수한다. 기본 **데모 모드**(localStorage)로 백엔드 없이
완전 동작하며 `VITE_DEMO_MODE=false` 로 실 API(게이트웨이 :18800)에 붙는다 — 설계 정본 `docs/frontend.md`.
`client/android`(Kotlin 네이티브)는 예정(Jira RP-81).

## 설계

- **이종 도메인 MSA**: 습관/게임/관심종목을 각각 독립 서비스(Kafka producer)로 두고, 공통 피드/랭킹
  코어(consumer)로 수렴. 새 도메인 = `Activity.type` + producer 추가.
- **동시성**: 선착순 race 가 아니라 실시간 fan-out · 랭킹(Redis Sorted Set) · 프레즌스.
- **단계적 구현**: 개인 → 친구 → 오픈. 동시성 기술은 필요해지는 시점에 도입.

자세한 내용은 **[docs/architecture.md](docs/architecture.md)**.

## 보안

공개 저장소. 실제 자격증명·시크릿은 커밋하지 않으며 전부 환경변수로 주입한다. 기본값은 로컬 dev.
