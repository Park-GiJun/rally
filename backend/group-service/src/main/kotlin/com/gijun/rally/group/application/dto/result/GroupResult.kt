package com.gijun.rally.group.application.dto.result

import com.gijun.rally.group.domain.enums.GroupVisibility
import com.gijun.rally.group.domain.model.GroupModel
import java.time.Instant

/** 유스케이스 반환 결과. 도메인/엔티티를 외부로 새지 않게 하는 경계 타입. */
data class GroupResult(
    val id: Long,
    val name: String,
    val description: String?,
    val ownerId: Long,
    val visibility: GroupVisibility,
    val createdAt: Instant,
) {
    companion object {
        fun from(groupModel: GroupModel): GroupResult =
            GroupResult(
                id = requireNotNull(groupModel.id) { "영속된 Group 만 결과로 변환할 수 있다." },
                name = groupModel.name,
                description = groupModel.description,
                ownerId = groupModel.ownerId,
                visibility = groupModel.visibility,
                createdAt = groupModel.createdAt,
            )
    }
}
