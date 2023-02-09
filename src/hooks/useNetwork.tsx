import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useIsOffline = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isOffline;
};

export default useIsOffline;
