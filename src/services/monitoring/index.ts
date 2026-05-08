import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

export const monitoring = {
  logError(error: unknown, context?: Record<string, string>) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (context) {
      Object.entries(context).forEach(([key, value]) =>
        crashlytics().setAttribute(key, value),
      );
    }
    crashlytics().recordError(err);
  },

  logEvent(name: string, params?: Record<string, string | number>) {
    analytics().logEvent(name, params);
  },

  setUser(id: string) {
    crashlytics().setUserId(id);
    analytics().setUserId(id);
  },

  async logScreen(screenName: string) {
    await analytics().logScreenView({screen_name: screenName, screen_class: screenName});
  },

  setAppContext(context: {
    networkStatus: 'online' | 'offline';
    observationsCount: number;
    pendingSyncCount: number;
  }) {
    crashlytics().setAttributes({
      network_status: context.networkStatus,
      observations_count: String(context.observationsCount),
      pending_sync_count: String(context.pendingSyncCount),
    });
  },

  breadcrumb(action: string) {
    crashlytics().log(action);
  },
};

export const Events = {
  OBSERVATION_CREATED: 'observation_created',
  OBSERVATION_EDITED: 'observation_edited',
  OBSERVATION_DELETED: 'observation_deleted',
  OBSERVATION_FAVORITED: 'observation_favorited',
  UNDO_DELETE: 'undo_delete',
  FILTER_APPLIED: 'filter_applied',
  SORT_CHANGED: 'sort_changed',
  SYNC_COMPLETED: 'sync_completed',
  SYNC_FAILED: 'sync_failed',
} as const;
