# rally — 아키텍처 (타깃: 완전 오픈 기준)

> 설계는 **최종 목표(공개 서비스, 아래 P2)** 를 기준으로 그린다. 구현은 이 청사진의 서브셋을
> **개인 → 친구 → 오픈** 순서로 단계적으로 켠다. 그래야 P1에서 만든 게 P2에서 뒤집히지 않는다.

## 1. 정체성

**그룹 활동 피드 플랫폼.** 사람들이 그룹을 만들어 활동(습관 인증·게임 스코어·관심종목 등)을 기록하면,
**실시간 피드 + 랭킹**으로 서로를 본다. 핵심 가치 = *함께 + 지속*.

- **첫 수직슬라이스 = 습관/챌린지 인증**(예: 운동·공부 그룹 챌린지) — 지속력 검증된 장르.
- 모든 도메인은 단일 추상화 **`Group + Activity 이벤트 → 피드 + 랭킹`** 의 변주로 흡수한다.

## 2. 설계 원칙 (왜 이렇게)

- **UGC = 게이트키핑 0.** 데이터를 유저가 직접 만든다(외부 API 의존 금지 — 막히면 죽는다).
- **동시성 = 선착순 race 가 아니다.** *실시간 fan-out · 랭킹(Redis Sorted Set) · 프레즌스* = 매일
  발생하는 트래픽 위의 동시성. 지속력 있는 서비스와 궁합이 맞는다.
- **이종(異種) 도메인 = MSA 의 진짜 정당성.** 습관/게임/관심종목은 본질적으로 다른 도메인이라
  각각을 독립 서비스로 두고 **공통 피드/랭킹 코어로 수렴**시킨다(흔한 "분산 모놀리스"가 아니다).
- **동시성 기술은 필요해질 때 도입한다.** P0(개인)은 Kafka/Redis 없이. 트래픽 조건이 바뀌는 시점마다
  도입 — "왜 지금 도입했나"의 의사결정 자체가 설계 산출물이다.
- **헥사고날 + CQRS** 는 ticket-server 컨벤션을 그대로 재사용한다. `port.in`·`handler`·`dto` 는
  **command/query 로** 쪼개고, `port.out` 은 읽기/쓰기가 아니라 **기술 관심사(persistence·message·cache·
  token·security)로** 나눠 같은 관심사의 구현 어댑터와 1:1로 맞춘다(상세는 `CLAUDE.md` 의 "서비스 내부 구조").

## 3. 핵심 도메인 모델 (Activity = 척추)

```
Group(id, name, ownerId, visibility)                   그룹 (visibility ∈ {PRIVATE, PUBLIC})
Membership(groupId, userId, role, joinedAt)            멤버십/권한
JoinRequest(groupId, requesterId, status, ...)         가입 신청 → owner 승인/거절
Activity(id, actorId, groupId, type, payload,          ← 확장점(척추)
         occurredAt, schemaVersion)
   type ∈ { CHECKIN, SCORE, MESSAGE, PRICE_ALERT, ... }   새 도메인 = type 추가
Streak / Leaderboard                                   Redis 집계(P1+)
```

> **새 도메인 추가 = `Activity.type` 추가 + producer 서비스 1개.** 피드/랭킹/알림 consumer 는 무수정.

## 4. 서비스 분해 (타깃 / 오픈 스케일)

| 계층 | 서비스 | 책임 | 소유 데이터(DB-per-service) |
|------|--------|------|------------------------------|
| edge | `gateway` | JWT 검증·단일 진입·X-User-* 발급 | — |
| edge | `discovery-server` | Eureka | — |
| edge | `shared`(lib) | JWT 검증기·공통 예외·OpenApi | — |
| 신원 | `user-service` | 회원·인증·소셜 로그인 | users |
| 코어 | `group-service` | 그룹·멤버십·권한·가입승인 | groups, memberships, join_requests |
| 코어 | `activity-service` | **Activity 기록(쓰기)·이벤트 발행 = 스파인** | activity log(event store) |
| 코어 | `feed-service` | activity 구독 → 타임라인 read model(CQRS) + 실시간 push | timeline(비정규화) |
| 코어 | `ranking-service` | activity 구독 → 리더보드/스트릭 | Redis(+PG 스냅샷) |
| 코어 | `notification-service` | activity 구독 → 푸시/이메일/알림 (채널: 웹푸시·Slack·**이메일 `@gijun.net`**) | notification log |
| 코어 | `realtime-service` | WebSocket 연결·프레즌스·인스턴스 간 fan-out | Redis pub/sub |
| 도메인 | `habit-service` | 습관/챌린지 검증 → `CHECKIN` producer | habit 정의 |
| 도메인 | `game-service` | 게임/경쟁 스코어 → `SCORE` producer | game 설정 |
| 도메인 | `market-service` | 관심종목 봇(외부 무료 API 폴링) → `PRICE_ALERT` producer | watchlist |

## 5. 이벤트 계약 (Kafka — 코어 스파인)

```
topic: activity.recorded          key = groupId   (그룹 내 순서보장 위해 groupId 파티셔닝)
  {
    activityId, actorId, groupId,
    type: CHECKIN | SCORE | MESSAGE | PRICE_ALERT,
    payload, occurredAt, schemaVersion
  }
        │
        ├─▶ feed-service          타임라인 갱신 + realtime push
        ├─▶ ranking-service       Redis Sorted Set 갱신
        └─▶ notification-service  → topic: notification.requested

producers: habit / game / market / (user 의 MESSAGE) → activity-service → activity.recorded
```

- `activity.recorded` **하나가 척추**. 이종 도메인은 전부 이 토픽으로 수렴 → consumer 는 도메인을 모른다.
- `schemaVersion` 으로 이벤트 진화 대비(처음부터 포함). consumer 는 하위호환 유지.
- groupId 파티셔닝 → **그룹 단위 순서보장**. consumer 는 멱등(`idem:{activityId}`).

## 6. Redis 구조 (랭킹·실시간)

```
lb:{groupId}:{period}      Sorted Set    리더보드 / 스트릭 랭킹
presence:{groupId}         Set + TTL     온라인 멤버
unread:{userId}:{groupId}  Counter       안읽음 카운트
rl:checkin:{userId}        Token bucket  인증 rate-limit
idem:{activityId}          String + TTL  멱등성(중복 이벤트 차단)
ws:group:{groupId}         Pub/Sub       WebSocket 인스턴스 간 fan-out
feed:{groupId}             Capped list   핫 그룹 타임라인 캐시
```

## 7. 횡단 관심사 (오픈 전제 — 처음부터 설계만 해둠)

- **인증 전파**: gateway 가 `Authorization` 검증 → `X-User-Id/Email/Role` 헤더로 백엔드 신뢰
  (ticket-server 패턴 그대로). 클라이언트가 보낸 `X-User-*` 는 게이트웨이가 덮어쓴다.
- **관측성**: traceId 를 gateway 에서 발급·전파(분산추적), 서비스별 메트릭/로그.
- **이벤트 버저닝**: `schemaVersion` + consumer 하위호환.
- **시크릿**: 전부 환경변수 주입, 절대 커밋 금지(공개 repo). `deploy/.env`(미추적)로 배포 주입.
- **메일링**: 개인 메일 도메인 `@gijun.net` 을 발신 주소로 사용(예: `no-reply@gijun.net`). `notification-service`
  의 이메일 채널 = 챌린지 리마인더·랭킹 요약·초대 메일 등. SMTP 가용 여부는 서버 확인 필요(미확정 시 웹푸시/Slack 우선).

## 8. 클라이언트 (3-way)

| 클라이언트            | 스택            | 비고              |
| ---------------- | ------------- | --------------- |
| `client/web`     | React         | 메인 웹            |
| `client/mobile`  | React         | 모바일             |
| `client/android` | Kotlin (네이티브) | 안드로이드 네이티브 쇼케이스 |


## 9. 단계별 구현 로드맵

| 단계 | 누가 | 타깃에서 켜는 것 | 동시성 기술 |
|------|------|------------------|-------------|
| **P0 개인** | 나 혼자 | `user` + `activity-service`(habit 로직 인라인), 단일 PostgreSQL. group/Kafka/Redis **끔**. 단 도메인 모델은 `Group`·`Activity` 구조로 *미리* 설계 | 없음(의도적) |
| **P1 친구** | 친구 그룹 | `group`/`feed`/`ranking`/`notification`/`realtime` 분리 | **Redis·Kafka·WebSocket 등판** |
| **P2 오픈** | 일반 공개 | `game`/`market` producer 추가, 관측성·부하테스트·rate-limit 강화 | 확장 + 운영 |

## 10. 기술 스택

- **백엔드**: Kotlin / JDK 25 / Spring Boot 4.x / Spring Cloud(Eureka + Gateway) / 헥사고날 + CQRS
- **영속성**: JPA(Hibernate) + PostgreSQL (로컬 dev H2 PostgreSQL 호환 모드)
- **인프라**: Redis(랭킹·실시간) · Kafka(이벤트) · (옵션) Elasticsearch — ticket-server 와 동일 인프라
- **클라이언트**: React(web) · React Native(mobile) · Kotlin(android)
- **빌드**: Gradle 멀티모듈, 빌드 루트 = `backend/`

## 11. 모노레포 디렉토리 구조

```
rally/
├─ backend/                 # Gradle 멀티모듈 빌드루트 (settings.gradle.kts · gradlew)
│  └─ {service}/            # discovery-server · gateway · shared · user/group/activity/feed/...
├─ client/
│  ├─ web/      (React)
│  ├─ mobile/   (React)
│  └─ android/  (Kotlin 네이티브)
├─ docs/                    # 설계 정본 (이 문서)
├─ infra/                   # compose.yaml (현재와 동일 인프라)
└─ .claude/commands/        # ship.md (Jira/Notion/Slack/GitHub 파이프라인)
```

## 12. 보안 / 공개 repo 정책

- 공개 저장소 전제. **실제 자격증명·호스트·시크릿은 절대 커밋하지 않는다.**
- 모든 설정은 환경변수 주입(`DB_URL`/`DB_USERNAME`/`DB_PASSWORD`/`REDIS_*`/`KAFKA_BOOTSTRAP_SERVERS`/
  `JWT_SECRET` 등), 기본값은 로컬 dev(`localhost`). 배포는 미추적 `deploy/.env` 로 주입.
