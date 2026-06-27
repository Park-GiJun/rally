package com.gijun.rally.activity.infrastructure.adapter.out.activity.persistence

import com.gijun.rally.activity.domain.enums.ActivityType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.Table
import java.time.Instant

/**
 * Activity 영속 엔티티 = 이벤트 스토어(append-only 성격).
 * payload 는 type 마다 형태가 달라 JSON 문자열로 저장한다(도메인은 Map 으로 본다).
 */
@Entity
@Table(
    name = "activities",
    indexes = [
        Index(name = "idx_activity_actor_occurred", columnList = "actorId, occurredAt"),
        Index(name = "idx_activity_group_occurred", columnList = "groupId, occurredAt"),
    ],
)
class ActivityJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var actorId: Long,

    @Column
    var groupId: Long? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var type: ActivityType,

    @Column(nullable = false, columnDefinition = "TEXT")
    var payloadJson: String,

    @Column(nullable = false)
    var occurredAt: Instant,

    @Column(nullable = false)
    var schemaVersion: Int,
)
