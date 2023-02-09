import NetInfo from '@react-native-community/netinfo';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export async function dbWritePromise(functionPromise: Promise<any>): Promise<any> {
  const { isConnected } = await NetInfo.fetch();

  if (isConnected) {
    return functionPromise;
  } else {
    return Promise.resolve();
  }
}

// I grabbed this function from a Github issue one upon a time
export function docSnapshotPromise(ref: FirebaseFirestoreTypes.DocumentData): Promise<any> {
  return new Promise((resolve, reject) => {
    const unsubscribe = ref.onSnapshot(
      (doc) => {
        resolve(doc);
        unsubscribe();
      },
      (err) => {
        reject(err);
        unsubscribe();
      },
    );
  });
}
