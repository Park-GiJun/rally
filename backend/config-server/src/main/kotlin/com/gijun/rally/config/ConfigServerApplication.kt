package com.gijun.rally.config

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.config.server.EnableConfigServer

/**
 * rally 중앙 설정 서버(Spring Cloud Config). native(파일시스템) 백엔드로 저장소 루트의
 * `config-repo/` 를 설정 소스로 노출한다. 각 서비스는 부팅 시 여기서 설정을 가져오므로
 * 전체 스택에서 **가장 먼저** 떠야 한다(config-server → discovery-server → gateway → 서비스).
 *
 * Eureka 에는 등록하지 않는다(부트스트랩 순환 방지). 클라이언트는 고정 URL 로 접근한다.
 */
@EnableConfigServer
@SpringBootApplication
class ConfigServerApplication

fun main(args: Array<String>) {
    runApplication<ConfigServerApplication>(*args)
}
