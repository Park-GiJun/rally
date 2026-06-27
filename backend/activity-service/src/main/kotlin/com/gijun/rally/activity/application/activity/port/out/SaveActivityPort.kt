package com.gijun.rally.activity.application.activity.port.out

import com.gijun.rally.activity.domain.model.Activity

fun interface SaveActivityPort {
    fun save(activity: Activity): Activity
}
