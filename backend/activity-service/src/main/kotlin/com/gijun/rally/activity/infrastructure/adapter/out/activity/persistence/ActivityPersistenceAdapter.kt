package com.gijun.rally.activity.infrastructure.adapter.out.activity.persistence

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.gijun.rally.activity.application.activity.port.out.persistence.LoadActivityPort
import com.gijun.rally.activity.application.activity.port.out.persistence.SaveActivityPort
import com.gijun.rally.activity.domain.model.ActivityModel
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component

/** Save/Load 포트의 JPA 구현. payload(Map) ↔ JSON 문자열 변환 경계. */
@Component
class ActivityPersistenceAdapter(
    private val repository: ActivityJpaRepository,
    private val objectMapper: ObjectMapper,
) : SaveActivityPort, LoadActivityPort {

    private val payloadType = object : TypeReference<Map<String, Any?>>() {}

    override fun save(activityModel: ActivityModel): ActivityModel =
        toDomain(repository.save(toEntity(activityModel)))

    override fun findById(id: Long): ActivityModel? =
        repository.findById(id).map(::toDomain).orElse(null)

    override fun findFeed(actorId: Long?, groupId: Long?, limit: Int): List<ActivityModel> {
        val pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "occurredAt"))
        val entities = when {
            actorId != null -> repository.findByActorId(actorId, pageable)
            groupId != null -> repository.findByGroupId(groupId, pageable)
            else -> repository.findAll(pageable).content
        }
        return entities.map(::toDomain)
    }

    private fun toEntity(activityModel: ActivityModel): ActivityJpaEntity =
        ActivityJpaEntity(
            id = activityModel.id,
            actorId = activityModel.actorId,
            groupId = activityModel.groupId,
            type = activityModel.type,
            payloadJson = objectMapper.writeValueAsString(activityModel.payload),
            occurredAt = activityModel.occurredAt,
            schemaVersion = activityModel.schemaVersion,
        )

    private fun toDomain(entity: ActivityJpaEntity): ActivityModel =
        ActivityModel(
            id = entity.id,
            actorId = entity.actorId,
            groupId = entity.groupId,
            type = entity.type,
            payload = objectMapper.readValue(entity.payloadJson, payloadType),
            occurredAt = entity.occurredAt,
            schemaVersion = entity.schemaVersion,
        )
}
