---
description: 커밋→Jira→Notion→Slack→GitHub 푸시를 한 번에 동기화하는 rally 일정관리 파이프라인
argument-hint: "[작업 요약 또는 범위 힌트 (선택)] [#이슈키 또는 epic=<도메인> (선택)]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(git remote:*), Bash(git rev-parse:*), mcp__claude_ai_Atlassian__createJiraIssue, mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql, mcp__claude_ai_Atlassian__getTransitionsForJiraIssue, mcp__claude_ai_Atlassian__transitionJiraIssue, mcp__claude_ai_Atlassian__addCommentToJiraIssue, mcp__claude_ai_Atlassian__editJiraIssue, mcp__notion__notion-create-pages, mcp__slack__slack_post_message
---

너는 rally 의 **단일 일정관리 파이프라인**이다. 작업 트리의 변경을 커밋하고,
**Jira(정본) → Notion(로그) → Slack(알림) → GitHub(푸시)** 네 서비스를 한 번에 동기화한다.

## 고정 리소스 (rally 전용 — ticket-server 와 분리, 2026-06-27 확정)

| 키 | 값 |
|----|----|
| Jira cloudId | `c0caf068-84da-4325-8063-45edd0daa2b7` (gijun.atlassian.net) |
| Jira projectKey | `RP` (rally-project · **business** 프로젝트, id 10034) |
| Jira 이슈타입 | 에픽급=`워크스트림`(hierarchyLevel 1) · 작업=`작업` · 하위=`하위 작업` |
| Jira 전이 | 비즈니스 프로젝트라 전이 ID 가변 → **`getTransitionsForJiraIssue` 로 런타임 조회** 후 완료(statusCategory `done`)로 전이 |
| Notion data_source_id | `9cc262c4-432a-4a6f-b67f-9302f47c7d72` (rally 커밋 로그 DB) |
| Notion DB page_id | `1b17d94f-3e65-4c21-b62d-73ca5a95f2fc` |
| Slack channel_id | `C0BBY1G754J` (`schedule-history` 재사용) |

## 도메인 워크스트림 맵 (정본 — 작업 이슈는 변경된 모듈에 맞는 워크스트림 하위로 묶는다)

> 작업(Task) 생성 시 `parent` 에 아래 워크스트림 키를 넣는다.

| 워크스트림 | 도메인 | 모듈/라벨 |
|------------|--------|-----------|
| `RP-1` | 플랫폼·인프라 | gateway · shared · discovery-server · infra · config · build |
| `RP-2` | 인증 | user-service · gateway(JWT) |
| `RP-3` | 그룹 | group-service |
| `RP-4` | 활동 코어 | activity-service · feed-service |
| `RP-5` | 랭킹 | ranking-service |
| `RP-6` | 알림·실시간 | notification-service · realtime-service |
| `RP-7` | 습관 | habit-service |
| `RP-8` | 게임 | game-service |
| `RP-9` | 관심종목 | market-service |
| `RP-10` | 프론트엔드 | client/web · client/mobile · client/android |
| `RP-11` | 배포·CI/CD | infra · build · config |
| `RP-12` | 관측성 | observability |
| `RP-13` | QA·테스트 | qa · test |

## 입력
- `$ARGUMENTS` — 작업 요약/범위 힌트(선택). `#<이슈키>` 가 있으면 **기존 이슈**를 재사용하고,
  `epic=<에픽키>` 처럼 명시하면 그 에픽 하위로 새 이슈를 만든다. 없으면 위 맵에서 모듈→에픽을 자동 선택한다.

## 현재 상태 (자동 수집)
- 브랜치:
!`git branch --show-current`
- 변경 요약:
!`git status --short`
- 변경 통계:
!`git diff --stat`
- 최근 커밋(스타일 참고):
!`git log --oneline -8`
- 원격 존재 여부:
!`git remote -v`

## 진행 절차

### 0. 사전 점검
- 변경이 없으면 멈추고 알린다. 시크릿/자격증명이 보이면 멈추고 보고한다.
- 성격이 다른 변경(기능+문서+설정)이 섞였으면 **여러 묶음**으로 나눠 각 묶음마다 1~5 를 반복한다.

### 1. Jira 이슈 확보 (정본 먼저)
- `$ARGUMENTS` 에 `#<이슈키>` 가 있으면 그 이슈를 사용. 없으면 변경 내용으로 **작업(Task)** 이슈를 새로 만든다.
  - `createJiraIssue`: `cloudId`, `projectKey`, `issueTypeName=작업`, `summary`(한국어 명령형),
    `description`(무엇을/왜), `additional_fields.labels=[<모듈>, <커밋타입>]`.
  - **도메인 에픽 맵**에서 변경 모듈에 맞는 에픽 키를 골라 `parent` 에 넣어 에픽 하위로 묶는다.
- 반환된 **이슈 키** 와 webUrl 을 기억한다.

### 2. 커밋 (GitHub 으로 연결)
- 해당 묶음 파일만 선택적으로 `git add <paths>` (빌드 산출물·gitignore 대상 제외, `git add -A` 남용 금지).
- **Conventional Commits** + 본문에 Jira 키:
  ```
  <type>(<scope>): <제목, 한국어, 명령형, ~50자, 마침표 없음>

  <본문: 필요 시 무엇을/왜>

  Refs: <이슈키>
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```
  - type: `feat|fix|docs|refactor|chore|test|build|style|perf` · scope 예: `activity` `group` `feed` `ranking` `gateway` `auth` `config` `docs`
  - PowerShell 멀티라인은 here-string(`@' ... '@`) 또는 여러 `-m` 옵션으로 전달.
- `--no-verify`/`--amend`/강제 옵션 금지. 훅 실패 시 원인 보고 후 중단.
- 커밋 후 `git rev-parse --short HEAD` 로 **단축 해시**를 얻는다.

### 3. GitHub 푸시
- 원격이 있으면 현재 브랜치를 `git push`(필요 시 `-u origin <branch>`). 원격이 없으면 **푸시는 건너뛰고** 그 사실을 출력에 명시한다.
- 푸시 성공 시 커밋 URL을 만들 수 있으면 기억한다. 없으면 빈 값.

### 4. Notion 커밋 로그 기록
- `notion-create-pages` 로 `parent.data_source_id`(rally 커밋 로그 DB) 아래 1행 생성:
  - `제목` = 커밋 제목, `커밋타입` = type, `모듈` = 모듈 라벨(들),
    `상태` = `완료`(푸시까지 끝났으면) / `진행 중`, `Jira키` = 이슈키,
    `커밋해시` = 단축 해시, `GitHub` = 커밋 URL(있으면), `날짜` = 오늘(ISO).

### 5. Jira 상태 전이 + Slack 알림
- `transitionJiraIssue` 로 이슈를 **완료** 로 옮긴다(작업이 미완이면 진행 중). 전이 ID 는 상단 표 참고.
- `slack_post_message`(rally 채널)로 알림 전송:
  ```
  :rocket: <type>(<scope>): <제목>
  • Jira: <이슈키 webUrl>
  • 커밋: <단축 해시>  • 모듈: <모듈>
  • GitHub: <커밋 URL 또는 "원격 미설정">
  ```

## 출력 형식
한 줄 표로 동기화 결과를 요약한다 — **커밋 해시·제목 / Jira 키(+URL) / Notion 기록 / Slack 전송 / GitHub 푸시** 각각 ✅/⏭️(건너뜀)/❌(실패+이유).

## 실패 처리 (부분 성공 허용)
- 4단계 이후 어느 서비스가 실패해도 **커밋/푸시는 이미 끝났으므로 롤백하지 않는다.** 실패한 서비스만 표시하고,
  사용자가 재시도할 수 있도록 필요한 ID(이슈키·해시)를 출력에 남긴다.
- Slack 전송이 `not_in_channel` 로 실패하면 "채널에 봇 초대 필요"를 안내한다.
