package com.gijun.rally.group.domain.exception

import com.gijun.rally.shared.exception.ErrorCode
import com.gijun.rally.shared.exception.RallyException

/**
 * group 도메인 예외. sealed 로 모든 실패 사례를 한곳에 모으고, infrastructure 의 예외 핸들러가
 * shared 의 [ErrorCode] 로 매핑한다.
 */
sealed class GroupException(code: ErrorCode, message: String) : RallyException(code, message) {

    class GroupNotFound(groupId: Long) :
        GroupException(ErrorCode.NOT_FOUND, "그룹을 찾을 수 없습니다: $groupId")

    class InvalidGroupName :
        GroupException(ErrorCode.INVALID_INPUT, "그룹 이름은 비어 있을 수 없습니다.")

    /** 그룹 멤버가 아닌데 멤버 전용 작업을 시도. */
    class NotGroupMember(groupId: Long, userId: Long) :
        GroupException(ErrorCode.FORBIDDEN, "그룹 멤버가 아닙니다: group=$groupId, user=$userId")

    /** owner 전용 작업(수정·삭제·역할변경)을 owner 가 아닌 멤버가 시도. */
    class NotGroupOwner(groupId: Long, userId: Long) :
        GroupException(ErrorCode.FORBIDDEN, "그룹 소유자만 수행할 수 있습니다: group=$groupId, user=$userId")

    /** owner 는 그룹을 탈퇴하거나 스스로 역할을 강등할 수 없다(소유권 이전이 선행되어야 함). */
    class OwnerCannotLeave(groupId: Long) :
        GroupException(ErrorCode.CONFLICT, "소유자는 그룹을 탈퇴할 수 없습니다: group=$groupId")

    class AlreadyMember(groupId: Long, userId: Long) :
        GroupException(ErrorCode.CONFLICT, "이미 그룹 멤버입니다: group=$groupId, user=$userId")

    class JoinRequestNotFound(requestId: Long?) :
        GroupException(ErrorCode.NOT_FOUND, "가입 신청을 찾을 수 없습니다: $requestId")

    /** 같은 그룹에 처리 대기 중인 가입 신청이 이미 있는데 또 신청. */
    class DuplicateJoinRequest(groupId: Long, userId: Long) :
        GroupException(ErrorCode.CONFLICT, "이미 처리 대기 중인 가입 신청이 있습니다: group=$groupId, user=$userId")

    /** 이미 승인·거절·취소된 신청을 다시 결정하려 시도. */
    class JoinRequestNotPending(requestId: Long?) :
        GroupException(ErrorCode.CONFLICT, "대기 중인 가입 신청이 아닙니다: $requestId")
}
