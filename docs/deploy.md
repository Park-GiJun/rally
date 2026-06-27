# rally — 배포 / 서버 인프라

> 실제 홈서버(`homeserver`, Ubuntu 24.04) 인벤토리를 바탕으로 정리. **rally 는 ticket-server 를 내리고
> 그 슬롯(포트·네트워크·도메인·CI 잡)을 승계**한다. 시크릿은 전부 서버의 `.env`(미추적)에 있고,
> 이 문서·repo 에는 **값을 적지 않는다**(공개 저장소).

## 서버 개요

- Ubuntu 24.04.3 LTS · 4 vCPU · 31 GiB RAM(여유 ~17 GiB) · 466 GB 디스크(여유 ~328 GB)
- `gijunpark` 계정(docker·sudo 그룹, sudo 는 비번 필요) · 호스트 Java 21
- 다목적 홈서버: ticket-server(철거 예정)·LoL 이벤트·Stock-Simulator·portfolio·sale·webmail 등 공존

## 공유 인프라 (`~/infra/docker-compose.yml`, 스택 `infra`, 네트워크 `infra-net`)

**rally 는 이 인프라를 그대로 공유한다**(새 컨테이너 안 띄움 — DB/토픽/키 네임스페이스만 추가):

| 구성 | 컨테이너 | 호스트 포트 | rally 사용 방식 |
|------|----------|-------------|------------------|
| PostgreSQL primary | `infra-postgres` | `5432` | **새 DB `rally`** 생성 (replica `infra-postgres-replica` `5433`) |
| Redis | `infra-redis` | `6380`→6379 | 공유, 비번 보호. **키 프리픽스 `rally:`** 로 격리 |
| Kafka | `infra-kafka` (apache/kafka 4.0.2) | `9094`(external) | `AUTO_CREATE_TOPICS=true`. **토픽 `rally.activity.recorded` 등** |
| Kafka UI | `infra-kafka-ui` | `8089` | 토픽 모니터 |
| Elasticsearch | `infra-elasticsearch` | `9201`→9200 | (옵션) 검색/로그 |
| 모니터링 | `infra-prometheus`(`9092`) · `grafana`(`3001`) · `loki`(`3100`) · `alloy` | — | **rally actuator/prometheus 메트릭을 기존 Prometheus 가 스크레이프** (관측성 무료 확보) |

- 모든 설정은 env(`POSTGRES_USER/PASSWORD/DB`, `REDIS_PASSWORD`, `INFRA_HOST` …)로 주입 — 시크릿 외부화됨.
- 볼륨은 `stock-simulator_*` 외부 볼륨을 재사용(인프라 출처가 Stock-Simulator 프로젝트).

## 리버스 프록시 (호스트 nginx, `:80`/`:443`)

서브도메인 → `localhost:<port>` 패턴. 기존 컨벤션: **`<app>.gijun.net`(웹) + `<app>-api.gijun.net`(API)**.
(예: `portfolio`/`sale` 각각 web+api 쌍, `ticket.gijun.net`→`:13000`)

- **rally 계획**: `rally.gijun.net`(web) + `rally-api.gijun.net`(gateway). nginx server 블록 추가.
- 내부 MSA 서비스는 호스트에 노출하지 않고 rally 도커 네트워크에서만 통신 — **gateway·web 만 프록시**.

## CI/CD

- **TeamCity** `:8111`(+에이전트) — ticket-server 가 사용(deploy compose 가 buildagent workdir 에 있었음)
- **GitHub Actions self-hosted runner** (`~/actions-runner`) — 공개 repo 라면 이쪽이 자연스러움
- Portainer `:9000` — 컨테이너 관리 UI
- → rally CI 는 **GitHub Actions(self-hosted runner)** 권장(공개 repo + GitHub 일원화). TeamCity 도 가능.

## 메일 (`@gijun.net`) — 발신 경로 확보됨

- DNS: `MX 10 mail.gijun.net`, SPF `v=spf1 mx ~all` + **`brevo-code:…`** → **Brevo(Sendinblue) 도메인 인증 완료**.
- 수신/웹메일: `mail.gijun.net` → 내부 메일박스(`10.67.244.10:8443`), 커스텀 `webmail-api`(Spring jar, `webmail-api.gijun.net`).
- 이 호스트엔 postfix/dovecot 없음 → **트랜잭셔널 발신은 Brevo 사용이 정답.**
- **rally 계획**: `notification-service` 이메일 채널 = **Brevo SMTP/API**, 발신 `no-reply@gijun.net`.
  비밀키는 `MAIL_*` 환경변수로 주입(커밋 금지).

## rally 슬롯-인 (ticket-server 철거 후 승계)

| 항목 | 승계 |
|------|------|
| 호스트 포트 | ticket 포트(`18080`/`13000`)는 **재사용 금지**(충돌 회피). rally 신규 **`18800`(gateway)·`13100`(web)** 만 호스트 노출, 내부 서비스(`188xx`)는 도커 네트워크 전용 |
| 도커 네트워크 | `ticketserver-net` → `rally-net` 로 교체(외부 네트워크로 infra-net 참조) |
| 도메인 | `ticket.gijun.net` 정리 → `rally.gijun.net` / `rally-api.gijun.net` 신규 |
| DB/Redis/Kafka | 신규 컨테이너 없음. `rally` DB + `rally:` 키 + `rally.*` 토픽만 추가 |
| 배포 | `deploy/docker-compose.yml` + `deploy/.env`(미추적) — ticket 패턴 그대로 |
