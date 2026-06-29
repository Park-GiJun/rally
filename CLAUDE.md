# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**rally — 그룹 활동 피드 플랫폼.** 사람들이 그룹을 만들어 활동(습관 인증·게임 스코어·관심종목 등)을
기록하면 **실시간 피드 + 랭킹**으로 서로를 본다. **MSA 멀티모듈**(Spring Cloud: Eureka + Gateway)이며,
각 비즈니스 서비스는 내부적으로 **헥사고날 아키텍처(Ports & Adapters) + CQRS** 로 구성된다.
(컨벤션·인프라는 ticket-server 와 동일하게 승계하고 **도메인만 교체**한다.)

- Kotlin / JDK 25 (Gradle toolchain) / Spring Boot 4.x / Spring Cloud 2025.1.x
- 영속성: JPA(Hibernate) + PostgreSQL (로컬 dev 는 H2 PostgreSQL 호환 모드)
- 부가 인프라: Redis(랭킹·실시간·토큰), Kafka(활동 이벤트 발행)
- 클라이언트 3-way: `client/web`(React) · `client/mobile`(React 모바일웹, **RN 아님**) · `client/android`(Kotlin 네이티브)

> 설계 정본은 **`docs/`** 에 있다(`docs/architecture.md` = 시스템 전반 청사진, 인덱스 `docs/README.md`).
> 작업 기록이라 코드와 어긋날 수 있다 — **코드가 정답이다.** 설계는 **완전 오픈(P2) 기준**으로 그리고
> 구현은 **개인 → 친구 → 오픈** 단계로 켠다.

## 모노레포 구조

```
rally/
├─ backend/      # Gradle 멀티모듈 빌드루트 (gradlew, settings.gradle.kts 가 여기 있다 — 저장소 루트 아님)
├─ client/       # web(React, 13100) · mobile(React 모바일웹 Vite, 13101) · android(Kotlin 네이티브)
├─ config-repo/  # config-server(native)가 읽는 전 서비스 중앙 설정. application.yml(공통)+{service}.yml+*-prod.yml
├─ infra/        # compose.yaml (현재와 동일 인프라)
└─ docs/         # 설계 정본
```

## 백엔드 모듈 (타깃 / 오픈 스케일)

> **포트 정책:** 홈서버에 다수 프로젝트가 공존하므로 **ticket-server·기타 포트와 절대 겹치지 않게** rally
> 는 **`188xx` 대역 + 웹 `13100`** 을 쓴다(티켓의 `18080`/`13000` 재사용 금지). 배포 시 **호스트에 노출하는
> 것은 `gateway`·`web` 둘뿐**이고 나머지 서비스는 rally 도커 네트워크 내부 포트로만 통신한다(호스트 미바인딩).

| 모듈 | 포트 | 역할 | 단계 |
|------|------|------|------|
| `config-server` | 18859 | Spring Cloud Config(native). repo 루트 `config-repo/` 를 전 서비스 중앙 설정으로 노출 | P0 |
| `discovery-server` | 18861 | Eureka 서버(단일 노드, 자기 등록 안 함) | P0 |
| `gateway` | 18800 | Spring Cloud Gateway. **유일한 외부 진입점 + 단일 인증 지점**(호스트 노출) | P0 |
| `shared` | — | 실행 불가 `java-library`. JWT 검증기·공통 예외·OpenApi 공유 | P0 |
| `user-service` | 18801 | 사용자/인증 (회원·로그인·소셜) | P0 |
| `activity-service` | 18802 | **Activity 기록·이벤트 발행 = 코어 스파인** | P0 |
| `group-service` | 18803 | 그룹·멤버십·권한·초대 | P1 |
| `feed-service` | 18804 | activity 구독 → 타임라인 read model + 실시간 push | P1 |
| `ranking-service` | 18805 | activity 구독 → 리더보드/스트릭(Redis) | P1 |
| `notification-service` | 18806 | activity 구독 → 웹푸시/이메일(`@gijun.net` via Brevo)/Slack | P1 |
| `realtime-service` | 18807 | WebSocket 연결·프레즌스·인스턴스 간 fan-out | P1 |
| `habit-service` | 18808 | 습관/챌린지 검증 → `CHECKIN` producer | P1 |
| `game-service` | 18809 | 게임/경쟁 스코어 → `SCORE` producer | P2 |
| `market-service` | 18810 | 관심종목 봇(외부 무료 API) → `PRICE_ALERT` producer | P2 |
| `client/web` | 13100 | 웹(React) — 호스트 노출, nginx `rally.gijun.net` | P0 |
| `client/mobile` | 13101 | 모바일웹(React+Vite, RN 아님) — web 아키텍처 미러, `/api`→18800 프록시 | P0 |

모든 모듈은 패키지 루트 `com.gijun.rally` 를 공유한다(모듈이 달라도 같은 베이스 패키지).

## 프론트엔드 (클라이언트 — 백엔드 쇼케이스, 데모 우선)

`client/web`(13100)·`client/mobile`(13101)은 **같은 대시보드 앱**이다(같은 계약·로직, 뷰만 미러링:
web=좌측 **Sidebar**, mobile=**하단 BottomNav**, 둘 다 Topbar). 메인 `/`=**대시보드**(실시간 활동 피드를
**그룹 × 섹션**으로 필터 + 도메인별 요약 카드). 섹션 레지스트리 `src/lib/sections.ts` 한 줄 = 사이드바 메뉴 1 =
도메인 페이지 1 = 피드 필터 1, 각 섹션이 `Activity.type` 에 매핑된다(캘린더=`SCHEDULE`·가계부=`LEDGER`·
SNS=`MESSAGE`·LoL=`LOL_MATCH`·할일=`TODO`·습관=`CHECKIN`·주식=`PRICE_ALERT`). **새 도메인 = `ActivityType`
한 줄 + `SECTIONS` 한 줄**(백엔드의 "type 추가 + producer 1개"와 1:1).

**데이터 심:** 기본 `DEMO_MODE=on`(`src/config.ts`) — 백엔드 없이 localStorage 로 전 페이지 동작. 각 도메인
`api/<d>.ts` 가 `if (DEMO_MODE) return demo<D>(...)` 로 분기, 끄면(`VITE_DEMO_MODE=false`) 동일 함수가
`/api`(게이트웨이 18800)로 그대로 붙는다 → **실 API 전환 = 플래그 하나 + 계약대로 구현된 백엔드**. 상세·도메인별
기대 API 계약표는 **`docs/frontend.md`**.

## 인증 아키텍처 (ticket-server 패턴 그대로)

JWT **발급은 user-service**, **검증은 gateway**. 양쪽은 `shared` 의 `JwtTokenValidator` 와 동일한
`jwt.secret`/`jwt.issuer` 를 공유한다.

1. `gateway` 가 모든 요청의 `Authorization: Bearer` 를 검증한다.
2. 성공 시 신원을 **`X-User-Id` / `X-User-Email` / `X-User-Role` 헤더로 백엔드에 전달**한다.
   클라이언트가 보낸 `X-User-*` 는 신뢰하지 않고 게이트웨이가 덮어쓰거나 제거한다.
3. 공개 경로(`/api/auth/**`, `/actuator/**`)는 인증 없이 통과한다.
4. 백엔드 서비스는 게이트웨이가 보장한 `X-User-*` 헤더를 신뢰한다.

JWT secret/issuer 변경 시 **gateway 와 user-service 의 설정을 함께** 수정한다.

## 서비스 내부 구조 (헥사고날 + CQRS)

각 비즈니스 서비스는 동일한 레이어 규칙을 따른다. 의존성 화살표는 항상 **바깥 → 안쪽**.
domain/application 은 infrastructure 를 모른다.

```
domain/            순수 Kotlin. model / service / enums / exception(sealed)
application.<도메인>/
  port.in/
    command/       쓰기 유스케이스 인터페이스 (1 인터페이스 = 1 함수)
    query/         조회 유스케이스 인터페이스
  port.out/        ← 기술 관심사별로 나눈다(읽기/쓰기로 나누지 않음)
    persistence/   Save*/Load*/Delete* 영속성 포트
    message/       이벤트 발행 포트(Kafka)
    cache/         Memory(Redis) 포트
    token/         토큰 발급/검증 포트
    security/      비밀번호 인코더 등 보안 포트
  dto/
    command/       Commands
    query/         Queries
    result/        Results
    event/         도메인 이벤트
  handler/
    command/       CommandHandler
    query/         QueryHandler
infrastructure/
  adapter.in.<도메인>.web/    REST 컨트롤러 + 요청/응답 DTO
  adapter.out.<도메인>/        포트 구현체 (persistence / message / cache / token / security)
  config/                      예외 핸들러, security 등
```

- **CQRS**: 명령은 `@Transactional`, 조회는 `@Transactional(readOnly = true)`. `port.in`·`handler` 는
  **command/query 로** 분리한다.
- **`port.out` 은 command/query 가 아니라 기술 관심사(persistence/message/cache/token/security)로** 나눈다.
  포트 인터페이스의 하위 패키지와 그 구현 어댑터(`infrastructure/adapter/out/<도메인>/<관심사>/`)의 관심사가 1:1로 맞물린다.

## 핵심 도메인 (Activity = 척추)

```
Activity(id, actorId, groupId, type, payload, occurredAt, schemaVersion)   ← 확장점
  type ∈ { CHECKIN, SCORE, MESSAGE, PRICE_ALERT, ... }   새 도메인 = type 추가 + producer 1개
Kafka topic: activity.recorded  (key=groupId, 그룹 단위 순서보장)
  consumers: feed-service / ranking-service / notification-service
```

## 일정관리 파이프라인 (Jira · Notion · Slack · GitHub)

진입점은 `/ship`(`.claude/commands/ship.md`). **rally 전용 Jira 프로젝트 `RP`(rally-project, business) +
Notion DB(rally 커밋 로그) 를 사용**한다(ticket-server 의 KAN/Notion 과 분리). 워크스트림 13개(`RP-1`~`RP-13`)
가 도메인 마일스톤. 리소스 ID 는 `ship.md` 상단 표에 고정돼 있다. 커밋 본문에 `Refs: RP-xx` 로 GitHub↔Jira 연결.

## 빌드 & 실행 명령

**반드시 빌드 루트 `backend/` 에서 실행**(또는 `-p backend`). `JAVA_HOME` 이 비어 있으면 JDK 25 를 지정.

```powershell
.\gradlew.bat build                        # 전체 빌드
.\gradlew.bat :config-server:bootRun        # 모듈별 실행 (루트에 bootRun 없음) — 가장 먼저
.\gradlew.bat :discovery-server:bootRun
.\gradlew.bat :gateway:bootRun
.\gradlew.bat test                          # 전체 테스트
```

전체 스택 기동 순서: **config-server → discovery-server → gateway → user-service / activity-service → (P1) 나머지**.
(각 서비스는 부팅 시 config-server 에서 설정을 가져오므로 config-server 가 가장 먼저 떠 있어야 한다.)

### 로컬 인프라

`infra/compose.yaml` 에 PostgreSQL/Redis/Elasticsearch/Kafka 가 정의돼 있다(ticket-server 와 동일).

```powershell
docker compose -f ..\infra\compose.yaml up -d   # backend 기준 상위의 infra/
```

datasource/redis/kafka/jwt/mail 은 **환경변수로 주입**(`DB_URL`/`DB_USERNAME`/`DB_PASSWORD`/`REDIS_*`/
`KAFKA_BOOTSTRAP_SERVERS`/`JWT_SECRET`/`MAIL_*`)하며 기본값은 로컬 dev(`localhost`). **실제 자격증명은
절대 커밋하지 않는다**(public 저장소). 배포는 `deploy/.env`(미추적)로 주입. 인프라·서버는 ticket-server 와
동일 서버를 공유한다(개인 프로젝트 정책상 개발=배포 동일 인프라, 도메인만 분리).

### 중앙 설정 (config-server) & 프로파일

서비스 설정은 `config-repo/` 에 모은다: `application.yml`(전 서비스 공통) + `{service}.yml`(서비스별) +
`*-prod.yml`(prod 오버라이드). config-server 는 native 백엔드로 이를 읽어 각 클라이언트에 병합한다.
값 자체는 여전히 환경변수로 주입(`${ENV:기본값}`)하며 시크릿은 커밋하지 않는다 — config-repo 는 **구조**만 담는다.

- **dev(기본)**: eureka/config-server 주소 = `localhost`. 추가 profile 없이 그냥 뜬다.
- **prod**: `SPRING_PROFILES_ACTIVE=prod` → config-server 가 `*-prod.yml`(홈서버 IP `210.121.177.150`)을 병합.
- **config-server 주소**(`spring.config.import`)는 부팅 부트스트랩 단계라 profile yaml 로 못 나눈다 →
  `CONFIG_SERVER_URL` 환경변수로 분리(dev 기본 localhost, prod 는 `deploy/.env` 에서 IP 주입).
- JPA 서비스는 **Flyway**(`config-repo/db/migration` 아님, 각 서비스 `classpath:db/migration`)로 스키마 관리.
  마이그레이션으로 스키마를 완전히 잡으면 `JPA_DDL_AUTO` 를 `validate`/`none` 으로 내린다.
