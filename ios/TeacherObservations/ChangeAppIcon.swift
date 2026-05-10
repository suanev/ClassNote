import Foundation
import UIKit
import React

@objc(ChangeAppIcon)
class ChangeAppIcon: NSObject {

  @objc
  func setAppIcon(
    _ iconName: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    guard UIApplication.shared.supportsAlternateIcons else {
      reject("UNSUPPORTED", "Alternate icons are not supported on this device.", nil)
      return
    }

    let targetIconName: String?

    switch iconName {
    case "default":
      targetIconName = nil
    case "second_option":
      targetIconName = "AppIconSecondOption"
    default:
      reject("INVALID_ICON", "Invalid icon name: \(iconName)", nil)
      return
    }

    DispatchQueue.main.async {
      UIApplication.shared.setAlternateIconName(targetIconName) { error in
        if let error = error {
          reject("CHANGE_ICON_ERROR", error.localizedDescription, error)
        } else {
          resolve(iconName)
        }
      }
    }
  }

  @objc
  func getCurrentAppIcon(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let currentIcon = UIApplication.shared.alternateIconName

    switch currentIcon {
    case nil:
      resolve("default")
    case "AppIconSecondOption":
      resolve("second_option")
    default:
      resolve("default")
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    true
  }
}

@objc(ThemePreferenceBridge)
class ThemePreferenceBridge: NSObject {

  @objc
  func setThemePreference(
    _ preference: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    UserDefaults.standard.set(preference, forKey: NativeThemePreference.userDefaultsKey)
    resolve(preference)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }
}
