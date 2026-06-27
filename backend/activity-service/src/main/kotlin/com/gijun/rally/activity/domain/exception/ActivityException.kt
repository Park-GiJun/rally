package com.gijun.rally.activity.domain.exception

import com.gijun.rally.shared.exception.ErrorCode
import com.gijun.rally.shared.exception.RallyException

sealed class ActivityException(code: ErrorCode, message: String) : RallyException(code, message) {

    class ActivityNotFound(id: Long) :
        ActivityException(ErrorCode.NOT_FOUND, "활동을 찾을 수 없습니다: $id")
}
