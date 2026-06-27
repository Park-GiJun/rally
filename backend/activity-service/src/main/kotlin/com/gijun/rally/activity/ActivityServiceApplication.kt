package com.gijun.rally.activity

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

/**
 * Activity 기록·이벤트 발행 = rally 의 코어 스파인.
 * 모든 도메인(습관/게임/관심종목)은 Activity.type 변주로 이 서비스에 수렴한다.
 */
@SpringBootApplication
class ActivityServiceApplication

fun main(args: Array<String>) {
    runApplication<ActivityServiceApplication>(*args)
}
