package com.gijun.rally.gateway

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

/**
 * rally 의 유일한 외부 진입점. 모든 요청의 JWT 를 검증하고 신원을 X-User-* 헤더로 백엔드에 전파한다.
 */
@ConfigurationPropertiesScan
@SpringBootApplication
class GatewayApplication

fun main(args: Array<String>) {
    runApplication<GatewayApplication>(*args)
}
