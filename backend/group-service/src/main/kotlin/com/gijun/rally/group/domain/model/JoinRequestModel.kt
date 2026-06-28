package com.gijun.rally.group.domain.model

import com.gijun.rally.group.domain.enums.JoinRequestStatus
import com.gijun.rally.group.domain.exception.GroupException
import java.time.Instant

/**
 * 그룹 가입 신청. 사용자가 그룹에 합류를 **신청**하고, owner(또는 권한자)가 **승인/거절**한다.
 * 한 사용자는 같은 그룹에 PENDING 신청을 동시에 하나만 가질 수 있다(중복 방지는 application 책임).
 *
 * @property id 영속 전에는 null.
 * @property requesterId 가입을 신청한 사용자.
 * @property message 신청 시 남기는 한마디(선택).
 * @property decidedBy 승인·거절을 결정한 사용자(미결정/취소면 null).
 * @property decidedAt 결정 시각(미결정이면 null).
 */
data class JoinRequestModel(
    val id: Long?,
    val groupId: Long,
    val requesterId: Long,
    val status: JoinRequestStatus,
    val message: String?,
    val requestedAt: Instant,
    val decidedBy: Long? = null,
    val decidedAt: Instant? = null,
) {
    val isPending: Boolean get() = status == JoinRequestStatus.PENDING

    /**
     * 승인 → APPROVED 로 전이한 새 인스턴스. 승인 후 멤버십 생성은 application 핸들러가 수행한다.
     * 이미 결정·취소된 신청이면 [GroupException.JoinRequestNotPending].
     */
    fun approve(deciderId: Long, now: Instant): JoinRequestModel =
        decide(JoinRequestStatus.APPROVED, deciderId, now)

    /** 거절 → REJECTED. PENDING 이 아니면 [GroupException.JoinRequestNotPending]. */
    fun reject(deciderId: Long, now: Instant): JoinRequestModel =
        decide(JoinRequestStatus.REJECTED, deciderId, now)

    /** 신청자 본인이 신청을 거둠 → CANCELED(결정자 없음). PENDING 이 아니면 예외. */
    fun cancel(now: Instant): JoinRequestModel {
        requirePending()
        return copy(status = JoinRequestStatus.CANCELED, decidedAt = now)
    }

    private fun decide(decision: JoinRequestStatus, deciderId: Long, now: Instant): JoinRequestModel {
        requirePending()
        return copy(status = decision, decidedBy = deciderId, decidedAt = now)
    }

    private fun requirePending() {
        if (!isPending) throw GroupException.JoinRequestNotPending(id)
    }

    companion object {
        /** 신규 가입 신청(아직 미영속). */
        fun submit(groupId: Long, requesterId: Long, message: String?, now: Instant): JoinRequestModel =
            JoinRequestModel(
                id = null,
                groupId = groupId,
                requesterId = requesterId,
                status = JoinRequestStatus.PENDING,
                message = message?.trim()?.ifBlank { null },
                requestedAt = now,
            )
    }
}
