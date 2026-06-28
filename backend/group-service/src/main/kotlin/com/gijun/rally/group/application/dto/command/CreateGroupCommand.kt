package com.gijun.rally.group.application.dto.command

import com.gijun.rally.group.domain.enums.GroupVisibility

/** 생성시 미지정시 Private 지정 Frontend에 가드를 둘거지만 더블 체크 */
data class CreateGroupCommand(
    val groupName: String,
    val description: String?,
    val ownerId: Long,
    val visibility: GroupVisibility? = GroupVisibility.PRIVATE,
)
