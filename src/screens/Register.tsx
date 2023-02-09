import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import useIsOffline from '../hooks/useNetwork';
import { dbWritePromise, docSnapshotPromise } from '../utils/test';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();
  const collectionRef = firestore().collection('orders');
  const isOffline = useIsOffline();

  async function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Registrar', 'Preencha todos os campos');
    }

    const { uid } = auth().currentUser;

    setIsLoading(true);

    try {
      const orderRef = collectionRef.doc(Math.random().toString());
      //update org doc
      await dbWritePromise(
        orderRef.set({
          uid,
          patrimony,
          description,
          status: 'open',
          created_at: firestore.FieldValue.serverTimestamp(),
        }),
      );
      // wait for this updated doc to be written to local cache, then we can get the updated org
      const createdDocRef = await docSnapshotPromise(orderRef);
      const data = createdDocRef.data();
      console.log(data); // outputs the new and improved nam

      navigation.goBack();
    } catch (error) {
      console.log(error);
      return Alert.alert('Solicitação', 'Não foi possível registrar o pedido.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação" />

      <Input placeholder="Número do patrimônio" mt={4} onChangeText={setPatrimony} />

      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button title="Cadastrar" mt={5} isLoading={isLoading} onPress={handleNewOrderRegister} />
    </VStack>
  );
}
