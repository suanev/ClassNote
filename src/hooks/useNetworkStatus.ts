import {useEffect, useRef, useState} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

export type NetworkStatus = 'online' | 'offline' | 'restored';

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus | null>(null);
  const wasOfflineRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const applyNetworkState = (state: NetInfoState) => {
      const hasConnection = state.isConnected !== false;
      const hasInternetReachability = state.isInternetReachable !== false;
      const isOffline = !hasConnection || !hasInternetReachability;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (isOffline) {
        wasOfflineRef.current = true;
        setStatus('offline');
      } else if (wasOfflineRef.current) {
        setStatus('restored');
        timerRef.current = setTimeout(() => setStatus(null), 4000);
      }
    };

    NetInfo.fetch().then(applyNetworkState);

    const unsubscribe = NetInfo.addEventListener(applyNetworkState);

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return status;
};
