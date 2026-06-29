import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs

/*
 * rally CI/CD — 서비스별 독립 빌드 + 배포.
 *
 * 토폴로지: 같은 홈서버의 TeamCity 에이전트가 이미지를 빌드하고 deploy/docker-compose.yml 로
 *           해당 서비스만 무중단 교체한다(레지스트리 없음 — 빌드=배포 동일 호스트).
 *           에이전트에 docker / docker compose 가 있어야 하고 deploy/.env 가 서버에 존재해야 한다.
 *
 * 적용: TeamCity 에서 이 repo 를 Versioned Settings(Kotlin DSL) 로 연결하면 아래 BuildType 들이 생성된다.
 *       서버 버전에 맞춰 version 값을 조정한다(불일치 시 DSL 컴파일 경고).
 */
version = "2025.03"

project {
    val composeFile = "deploy/docker-compose.yml"

    // compose 서비스명 = backend 모듈명. 각 항목이 독립 배포 BuildType 1개가 된다.
    val backendServices = listOf(
        "config-server",
        "discovery-server",
        "gateway",
        "user-service",
        "activity-service",
        "group-service",
    )

    backendServices.forEach { svc ->
        buildType {
            id("Deploy_${svc.replace("-", "_")}")
            name = "Deploy · $svc"
            description = "$svc 이미지 빌드 후 compose 로 해당 서비스만 교체"

            vcs { root(DslContext.settingsRoot) }

            steps {
                script {
                    name = "build & deploy"
                    scriptContent = """
                        set -e
                        docker compose -f $composeFile build $svc
                        docker compose -f $composeFile up -d --no-deps $svc
                    """.trimIndent()
                }
            }

            triggers {
                vcs {
                    // 해당 서비스 소스 + 공통 라이브러리/설정/배포 정의 변경 시 빌드
                    triggerRules = """
                        +:backend/$svc/**
                        +:backend/shared/**
                        +:config-repo/**
                        +:deploy/**
                    """.trimIndent()
                }
            }
        }
    }

    // web (정적 빌드 → nginx)
    buildType {
        id("Deploy_web")
        name = "Deploy · web"
        description = "client/web 빌드 후 compose 로 교체"

        vcs { root(DslContext.settingsRoot) }

        steps {
            script {
                name = "build & deploy"
                scriptContent = """
                    set -e
                    docker compose -f $composeFile build web
                    docker compose -f $composeFile up -d --no-deps web
                """.trimIndent()
            }
        }

        triggers {
            vcs { triggerRules = "+:client/web/**" }
        }
    }
}
