package com.teacherobservations

import android.content.Context
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ThemePreferenceModule(
  reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ThemePreferenceBridge"

  @ReactMethod
  fun setThemePreference(preference: String, promise: Promise) {
    try {
      val prefs = reactApplicationContext.getSharedPreferences(
        THEME_PREFS_NAME,
        Context.MODE_PRIVATE
      )

      prefs.edit().putString(THEME_PREFERENCE_KEY, preference).apply()
      promise.resolve(preference)
    } catch (error: Exception) {
      promise.reject("THEME_PREFERENCE_ERROR", error.message, error)
    }
  }

  companion object {
    const val THEME_PREFS_NAME = "app_theme_prefs"
    const val THEME_PREFERENCE_KEY = "theme_preference"
  }
}
