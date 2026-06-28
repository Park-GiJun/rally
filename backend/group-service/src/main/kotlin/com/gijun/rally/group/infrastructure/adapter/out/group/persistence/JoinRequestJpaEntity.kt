package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import com.gijun.rally.group.domain.enums.JoinRequestStatus
import com.gijun.rally.group.domain.model.JoinRequestModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/** 영속 엔티티. 도메인 [JoinRequestModel] 와 분리한다. */
@Entity
@Table(name = "join_requests")
class JoinRequestJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var groupId: Long,

    @Column(nullable = false)
    var requesterId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: JoinRequestStatus,

    @Column(nullable = true)
    var message: String?,

    @Column(nullable = false)
    var requestedAt: Instant,

    @Column(nullable = true)
    var decidedBy: Long?,

    @Column(nullable = true)
    var decidedAt: Instant?,
) {
    fun toDomain(): JoinRequestModel =
        JoinRequestModel(
            id = id,
            groupId = groupId,
            requesterId = requesterId,
            status = status,
            message = message,
            requestedAt = requestedAt,
            decidedBy = decidedBy,
            decidedAt = decidedAt,
        )

    companion object {
        fun fromDomain(joinRequestModel: JoinRequestModel): JoinRequestJpaEntity =
            JoinRequestJpaEntity(
                id = joinRequestModel.id,
                groupId = joinRequestModel.groupId,
                requesterId = joinRequestModel.requesterId,
                status = joinRequestModel.status,
                message = joinRequestModel.message,
                requestedAt = joinRequestModel.requestedAt,
                decidedBy = joinRequestModel.decidedBy,
                decidedAt = joinRequestModel.decidedAt,
            )
    }
}
