package com.teacherobservations

import android.content.ComponentName
import android.os.Build
import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ChangeAppIconModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {
  private val defaultAliasEnabledByManifest = true
  private val secondOptionAliasEnabledByManifest = false

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

      val (toEnable, toDisable) = when (iconName) {
        "default" -> Pair(defaultAlias, secondOptionAlias)
        "second_option" -> Pair(secondOptionAlias, defaultAlias)
        else -> {
          promise.reject("INVALID_ICON", "Ícone inválido: $iconName")
          return
        }
      }

      if (isComponentEnabled(toEnable, isDefaultAlias(toEnable))) {
        if (!isComponentEnabled(toDisable, isDefaultAlias(toDisable))) {
          promise.resolve(iconName)
          return
        }
      }

      val flags = PackageManager.DONT_KILL_APP or
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          PackageManager.SYNCHRONOUS
        } else {
          0
        }

      packageManager.setComponentEnabledSetting(
        toEnable,
        PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
        flags
      )

      packageManager.setComponentEnabledSetting(
        toDisable,
        PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
        flags
      )

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
          isEnabledState(secondOptionState, secondOptionAliasEnabledByManifest) -> "second_option"
          isEnabledState(defaultState, defaultAliasEnabledByManifest) -> "default"
          else -> "default"
        }

      promise.resolve(currentIcon)
    } catch (error: Exception) {
      promise.reject("GET_ICON_ERROR", error)
    }
  }

  private fun isDefaultAlias(componentName: ComponentName): Boolean =
    componentName.className.endsWith(".MainActivityDefault")

  private fun isEnabledState(state: Int, manifestDefaultEnabled: Boolean): Boolean =
    when (state) {
      PackageManager.COMPONENT_ENABLED_STATE_ENABLED -> true
      PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
      PackageManager.COMPONENT_ENABLED_STATE_DISABLED_USER,
      PackageManager.COMPONENT_ENABLED_STATE_DISABLED_UNTIL_USED -> false
      PackageManager.COMPONENT_ENABLED_STATE_DEFAULT -> manifestDefaultEnabled
      else -> manifestDefaultEnabled
    }

  private fun isComponentEnabled(componentName: ComponentName, manifestDefaultEnabled: Boolean): Boolean =
    isEnabledState(
      reactApplicationContext.packageManager.getComponentEnabledSetting(componentName),
      manifestDefaultEnabled
    )
}
