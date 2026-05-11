package com.teacherobservations

import android.content.Context
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ClassNote"

  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    RNBootSplash.init(this, resolveBootTheme())
    super.onCreate(savedInstanceState)
  }

  private fun resolveBootTheme(): Int {
    val prefs = getSharedPreferences(
      ThemePreferenceModule.THEME_PREFS_NAME,
      Context.MODE_PRIVATE
    )

    return when (prefs.getString(ThemePreferenceModule.THEME_PREFERENCE_KEY, "system")) {
      "light" -> R.style.BootThemeLight
      "dark" -> R.style.BootThemeDark
      else -> R.style.BootThemeSystem
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
