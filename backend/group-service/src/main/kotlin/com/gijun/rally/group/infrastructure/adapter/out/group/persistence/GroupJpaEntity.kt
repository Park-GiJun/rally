package com.gijun.rally.group.infrastructure.adapter.out.group.persistence

import com.gijun.rally.group.domain.enums.GroupVisibility
import com.gijun.rally.group.domain.model.GroupModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/** 영속 엔티티. 도메인 [GroupModel] 와 분리해 JPA 세부사항이 도메인으로 새지 않게 한다. */
@Entity
@Table(name = "groups")
class GroupJpaEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = true)
    var description: String?,

    @Column(nullable = false)
    var ownerId: Long,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var visibility: GroupVisibility,

    @Column(nullable = false)
    var createdAt: Instant,

    @Column(nullable = false)
    var updatedAt: Instant,
) {
    fun toDomain(): GroupModel =
        GroupModel(
            id = id,
            name = name,
            description = description,
            ownerId = ownerId,
            visibility = visibility,
            createdAt = createdAt,
            updatedAt = updatedAt,
        )

    companion object {
        fun fromDomain(groupModel: GroupModel): GroupJpaEntity =
            GroupJpaEntity(
                id = groupModel.id,
                name = groupModel.name,
                description = groupModel.description,
                ownerId = groupModel.ownerId,
                visibility = groupModel.visibility,
                createdAt = groupModel.createdAt,
                updatedAt = groupModel.updatedAt,
            )
    }
}
