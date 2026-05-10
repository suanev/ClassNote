require('@testing-library/jest-native/extend-expect');

jest.spyOn(console, 'warn').mockImplementation(() => {});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const {Pressable, Text, View} = require('react-native');
  const Dialog = ({children, visible}) =>
    visible ? React.createElement(View, null, children) : null;
  Dialog.Title = ({children}) => React.createElement(Text, null, children);
  Dialog.Content = ({children}) => React.createElement(View, null, children);
  Dialog.Actions = ({children}) => React.createElement(View, null, children);

  const Appbar = {
    Header: ({children, style}) => React.createElement(View, {style}, children),
    BackAction: ({onPress, testID}) =>
      React.createElement(Pressable, {onPress, testID, accessibilityRole: 'button'}, null),
    Content: ({title}) => React.createElement(Text, null, title),
  };

  return {
    __esModule: true,
    MD3LightTheme: {colors: {}},
    MD3DarkTheme: {colors: {}},
    PaperProvider: ({children}) => children,
    Portal: ({children}) => children,
    Appbar,
    Surface: ({children, style, testID}) =>
      React.createElement(View, {style, testID}, children),
    Text: ({children, style}) => React.createElement(Text, {style}, children),
    Divider: props => React.createElement(View, props),
    Dialog,
    List: {
      Item: ({title, description, left}) =>
        React.createElement(
          View,
          null,
          left ? left({}) : null,
          title ? React.createElement(Text, null, title) : null,
          description ? React.createElement(Text, null, description) : null,
        ),
      Icon: () => null,
    },
    SegmentedButtons: ({buttons, onValueChange, value}) =>
      React.createElement(
        View,
        null,
        buttons.map(button =>
          React.createElement(
            Pressable,
            {
              key: button.value,
              onPress: () => onValueChange(button.value),
              accessibilityLabel: button.label,
              accessibilityState: {selected: value === button.value},
            },
            React.createElement(Text, null, button.label),
          ),
        ),
      ),
    Button: ({children, onPress, testID}) =>
      React.createElement(
        Pressable,
        {onPress, testID},
        React.createElement(Text, null, children),
      ),
    FAB: ({onPress, testID, disabled}) =>
      React.createElement(Pressable, {disabled, onPress, testID}),
    IconButton: ({icon, onPress, testID, accessibilityLabel}) =>
      React.createElement(
        Pressable,
        {onPress, testID, accessibilityLabel},
        React.createElement(Text, null, icon),
      ),
  };
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    __esModule: true,
    default: {
      View,
      call: () => {},
      createAnimatedComponent: component => component,
    },
    View,
    createAnimatedComponent: component => component,
    useSharedValue: value => ({value}),
    useAnimatedStyle: updater => (updater ? updater() : {}),
    cancelAnimation: jest.fn(),
    withTiming: value => value,
    withSequence: (...values) => values[values.length - 1],
    withRepeat: value => value,
    FadeIn: {
      duration: () => ({}),
    },
    FadeInDown: {
      duration: () => ({}),
    },
    FadeOutDown: {
      duration: () => ({}),
    },
    FadeOutLeft: {
      duration: () => ({}),
    },
    FadeOutUp: {
      duration: () => ({}),
    },
    LinearTransition: {
      duration: () => ({}),
    },
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    SafeAreaProvider: ({children}) => children,
    SafeAreaView: ({children, ...props}) => React.createElement(View, props, children),
    useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const {Pressable, ScrollView, View} = require('react-native');

  const BottomSheetBackdrop = () => null;
  const BottomSheetView = ({children, testID}) =>
    React.createElement(View, {testID}, children);
  const BottomSheetScrollView = ({children, ...props}) =>
    React.createElement(ScrollView, props, children);
  const BottomSheetModalProvider = ({children}) => children;
  const BottomSheetModal = React.forwardRef(({children, onDismiss}, ref) => {
    React.useImperativeHandle(ref, () => ({
      present: jest.fn(),
      dismiss: () => onDismiss?.(),
      snapToIndex: jest.fn(),
    }));

    return React.createElement(
      View,
      null,
      React.createElement(
        Pressable,
        {
          onPress: () => onDismiss?.(),
          testID: 'bottom-sheet-dismiss',
        },
        null,
      ),
      children,
    );
  });

  return {
    __esModule: true,
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
    BottomSheetView,
    BottomSheetFlatList: BottomSheetScrollView,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const {Pressable} = require('react-native');

  return {
    GestureHandlerRootView: ({children}) => children,
    RectButton: ({children, onPress}) =>
      React.createElement(Pressable, {onPress}, children),
    Swipeable: ({children}) => children,
    SwipeDirection: {
      LEFT: 'LEFT',
      RIGHT: 'RIGHT',
    },
  };
});

jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
  const React = require('react');
  const {Pressable, View} = require('react-native');

  const Swipeable = React.forwardRef(
    ({children, onSwipeableOpen, renderRightActions}, ref) => {
      React.useImperativeHandle(ref, () => ({
        close: jest.fn(),
      }));

      return React.createElement(
        View,
        null,
        React.createElement(Pressable, {
          onPress: () => onSwipeableOpen?.('RIGHT'),
          testID: 'swipe-open-right',
        }),
        React.createElement(Pressable, {
          onPress: () => onSwipeableOpen?.('LEFT'),
          testID: 'swipe-open-left',
        }),
        children,
        renderRightActions ? renderRightActions() : null,
      );
    },
  );

  return {
    __esModule: true,
    default: Swipeable,
    SwipeDirection: {
      LEFT: 'LEFT',
      RIGHT: 'RIGHT',
    },
  };
});

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(() => undefined),
    getAllKeys: jest.fn(() => []),
    remove: jest.fn(),
  }),
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(() =>
      Promise.resolve({
        isConnected: true,
        isInternetReachable: true,
      }),
    ),
  },
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    }),
  ),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({params: {}}),
  };
});

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: jest.fn(() => ({
    Navigator: ({children}) => children,
    Screen: () => null,
  })),
}));

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(() => Promise.resolve()),
  isVisible: jest.fn(() => true),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('react-native-vector-icons/Feather', () => 'Feather');

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {APP_VERSION: '1.0.0'},
}));

const firebaseMock = () => ({
  recordError: jest.fn(),
  setAttribute: jest.fn(),
  setUserId: jest.fn(),
  log: jest.fn(),
  crash: jest.fn(),
});
jest.mock('@react-native-firebase/crashlytics', () => () => firebaseMock());
jest.mock('@react-native-firebase/analytics', () => () => ({
  logEvent: jest.fn(),
  logScreenView: jest.fn(),
  setUserId: jest.fn(),
}));
jest.mock('@react-native-firebase/app', () => ({}));

jest.mock('axios', () => {
  const actual = jest.requireActual('axios');
  return {
    ...actual,
    create: () => ({
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    }),
    isAxiosError: jest.fn(() => false),
  };
});
