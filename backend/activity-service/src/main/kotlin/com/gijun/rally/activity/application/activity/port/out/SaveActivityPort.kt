package com.gijun.rally.activity.application.activity.port.out

import com.gijun.rally.activity.domain.model.ActivityModel

fun interface SaveActivityPort {
    fun save(activityModel: ActivityModel): ActivityModel
}
