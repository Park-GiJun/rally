package com.gijun.rally.discovery

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer

/**
 * rally 서비스 레지스트리(Eureka). 단일 노드이며 자기 자신은 등록하지 않는다.
 * 전체 스택 기동 시 가장 먼저 떠야 한다.
 */
@EnableEurekaServer
@SpringBootApplication
class DiscoveryServerApplication

fun main(args: Array<String>) {
    runApplication<DiscoveryServerApplication>(*args)
}
