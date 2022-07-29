import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useEffect, useState } from 'react';

import Logo from '../assets/logo_secondary.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/Filter';
import { Order, OrderProps } from '../components/Order';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<'open' | 'closed'>('open');
  const [filterByUser, setFilterByUser] = useState<'all' | 'current'>('current');

  const [orders, setOrders] = useState<OrderProps[]>([]);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate('new');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert('Sair', 'Não foi possível sair.');
      });
  }

  useEffect(() => {
    setIsLoading(true);

    const { uid } = auth().currentUser;

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', selectedStatus)
      .onSnapshot((snapshot) => {
        const dataFromDB = snapshot.docs.map((doc) => {
          const { uid, patrimony, description, status, created_at } = doc.data();

          return {
            uid,
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at),
          };
        });

        const data =
          filterByUser === 'all' ? dataFromDB : dataFromDB.filter((order) => order.uid === uid);

        setOrders(data);
        setIsLoading(false);
      });

    return subscriber;
  }, [selectedStatus, filterByUser]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton onPress={handleLogout} icon={<SignOut size={26} color={colors.gray[300]} />} />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w="full" mt={6} mb={4} justifyContent="space-between" alignItems="center">
          <Heading color="gray.100">Solicitações</Heading>

          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={4}>
          <Filter
            title="minhas"
            type="user"
            value={filterByUser}
            isActive={filterByUser === 'current'}
            onPress={() => setFilterByUser('current')}
          />
          <Filter
            title="todas"
            type="user"
            value={filterByUser}
            isActive={filterByUser === 'all'}
            onPress={() => setFilterByUser('all')}
          />
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            title="em andamento"
            type="status"
            value={selectedStatus}
            isActive={selectedStatus === 'open'}
            onPress={() => setSelectedStatus('open')}
          />
          <Filter
            title="finalizadas"
            type="status"
            value={selectedStatus}
            onPress={() => setSelectedStatus('closed')}
            isActive={selectedStatus === 'closed'}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  Você ainda não possui {'\n'}
                  solicitações {selectedStatus === 'open' ? 'em aberto' : 'finalizadas'}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
