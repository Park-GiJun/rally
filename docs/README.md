# rally 설계 문서

그룹 활동 피드 플랫폼 **rally** 의 설계 정본. 작업 기록이라 코드와 어긋날 수 있다 — **코드가 정답이다.**

## 인덱스

- [architecture.md](architecture.md) — **시스템 전반 아키텍처(타깃: 완전 오픈 기준)**. 정체성·설계원칙·
  서비스 분해·Kafka 이벤트 계약·Redis 구조·단계별 로드맵.
- [deploy.md](deploy.md) — **배포/서버 인프라**. 공유 인프라(infra-postgres/redis/kafka) 재사용, nginx
  서브도메인, CI, Brevo 메일, ticket-server 슬롯 승계.
- (예정) 서비스별 문서 — 빌드하며 도메인당 1파일로 추가: `activity-service.md`, `group-service.md`,
  `feed-service.md`, `ranking-service.md` …

## 한 줄 요약

> `Group + Activity 이벤트 → 실시간 피드 + 랭킹` 단일 추상화 위에, 습관·게임·관심종목 등 이종 도메인을
> 각각 독립 서비스(Kafka producer)로 붙이고 공통 피드/랭킹 코어(consumer)로 수렴시킨다.
> 구현은 **개인 → 친구 → 오픈** 단계로, 동시성 기술(Redis/Kafka)은 필요해지는 시점에 도입한다.
