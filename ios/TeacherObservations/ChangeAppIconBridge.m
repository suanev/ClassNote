#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ChangeAppIcon, NSObject)

RCT_EXTERN_METHOD(setAppIcon:(NSString *)iconName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCurrentAppIcon:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end

@interface RCT_EXTERN_MODULE(ThemePreferenceBridge, NSObject)

RCT_EXTERN_METHOD(setThemePreference:(NSString *)preference
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

@end
