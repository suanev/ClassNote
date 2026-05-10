package com.teacherobservations

import android.content.ComponentName
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ChangeAppIconModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ChangeAppIcon"

  @ReactMethod
  fun setAppIcon(iconName: String, promise: Promise) {
    try {
      val packageManager = reactApplicationContext.packageManager
      val packageName = reactApplicationContext.packageName

      val defaultAlias = ComponentName(
        packageName,
        "$packageName.MainActivityDefault"
      )

      val secondOptionAlias = ComponentName(
        packageName,
        "$packageName.MainActivitySecondOption"
      )

      val (toEnable, pendingDisableName) = when (iconName) {
        "default" -> Pair(defaultAlias, "$packageName.MainActivitySecondOption")
        "second_option" -> Pair(secondOptionAlias, "$packageName.MainActivityDefault")
        else -> {
          promise.reject("INVALID_ICON", "Ícone inválido: $iconName")
          return
        }
      }

      packageManager.setComponentEnabledSetting(
        toEnable,
        PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
        PackageManager.DONT_KILL_APP
      )

      reactApplicationContext
        .getSharedPreferences("app_icon_prefs", android.content.Context.MODE_PRIVATE)
        .edit()
        .putString("pending_disable", pendingDisableName)
        .apply()

      promise.resolve(iconName)
    } catch (error: Exception) {
      promise.reject("CHANGE_ICON_ERROR", error)
    }
  }

  @ReactMethod
  fun getCurrentAppIcon(promise: Promise) {
    try {
      val packageManager = reactApplicationContext.packageManager
      val packageName = reactApplicationContext.packageName

      val defaultAlias = ComponentName(
        packageName,
        "$packageName.MainActivityDefault"
      )

      val secondOptionAlias = ComponentName(
        packageName,
        "$packageName.MainActivitySecondOption"
      )

      val defaultState = packageManager.getComponentEnabledSetting(defaultAlias)
      val secondOptionState = packageManager.getComponentEnabledSetting(secondOptionAlias)

      val currentIcon =
        when {
          secondOptionState == PackageManager.COMPONENT_ENABLED_STATE_ENABLED -> "second_option"
          defaultState == PackageManager.COMPONENT_ENABLED_STATE_ENABLED -> "default"
          else -> "default"
        }

      promise.resolve(currentIcon)
    } catch (error: Exception) {
      promise.reject("GET_ICON_ERROR", error)
    }
  }
}
