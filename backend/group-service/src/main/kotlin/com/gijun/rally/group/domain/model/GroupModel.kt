package com.gijun.rally.group.domain.model

import com.gijun.rally.group.domain.enums.GroupVisibility
import com.gijun.rally.group.domain.exception.GroupException
import java.time.Instant

/**
 * 순수 도메인 모델. JPA/Spring 을 모른다(영속성 엔티티는 infrastructure 의 별도 타입).
 *
 * @property id 영속 전에는 null.
 * @property ownerId 그룹 생성자. 항상 [GroupRole.OWNER][com.gijun.rally.group.domain.enums.GroupRole.OWNER]
 *   멤버십을 가진다.
 * @property visibility 그룹 공개 범위(PRIVATE/PUBLIC). 기본은 [GroupVisibility.PRIVATE].
 */
data class GroupModel(
    val id: Long?,
    val name: String,
    val description: String?,
    val ownerId: Long,
    val visibility: GroupVisibility,
    val createdAt: Instant,
    val updatedAt: Instant,
) {
    val isPublic: Boolean get() = visibility == GroupVisibility.PUBLIC

    /** 이름 변경. 공백 이름은 허용하지 않는다. */
    fun rename(newName: String, now: Instant): GroupModel =
        copy(name = validateName(newName), updatedAt = now)

    /** 설명 변경(null = 설명 제거). */
    fun describe(newDescription: String?, now: Instant): GroupModel =
        copy(description = newDescription?.trim()?.ifBlank { null }, updatedAt = now)

    /** 공개 범위 변경(PRIVATE↔PUBLIC). */
    fun changeVisibility(newVisibility: GroupVisibility, now: Instant): GroupModel =
        copy(visibility = newVisibility, updatedAt = now)

    /** [userId] 가 이 그룹의 소유자인가. */
    fun isOwnedBy(userId: Long): Boolean = ownerId == userId

    companion object {
        /** 신규 그룹 생성(아직 미영속). 기본 공개 범위는 PRIVATE. 생성자는 곧 owner 멤버십을 받는다. */
        fun create(
            name: String,
            description: String?,
            ownerId: Long,
            now: Instant,
            visibility: GroupVisibility = GroupVisibility.PRIVATE,
        ): GroupModel =
            GroupModel(
                id = null,
                name = validateName(name),
                description = description?.trim()?.ifBlank { null },
                ownerId = ownerId,
                visibility = visibility,
                createdAt = now,
                updatedAt = now,
            )

        private fun validateName(name: String): String =
            name.trim().ifBlank { throw GroupException.InvalidGroupName() }
    }
}
