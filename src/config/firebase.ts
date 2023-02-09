import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';

const host = '192.168.0.47';

export async function bootstrap() {
  if (__DEV__) {
    firestore().useEmulator(host, 8080);
    auth().useEmulator(`http://${host}:9099`);
  }

  await firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    serverTimestampBehavior: 'estimate',
  });

  const netSubscriber = NetInfo.addEventListener(async ({ isConnected }) => {
    console.log('Is connected?', isConnected);
    !isConnected ? await firestore().disableNetwork() : await firestore().enableNetwork();
  });

  return netSubscriber;
}
