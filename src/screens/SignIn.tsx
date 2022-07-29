import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { Heading, Icon, VStack, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigation } from '@react-navigation/native';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoSignUp() {
    navigation.navigate('signUp');
  }

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Entrar', 'Informe email e senha');
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => console.log(response))
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'Email inválido.');
        }

        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          return Alert.alert('Entrar', 'Email ou senha inválida.');
        }

        return Alert.alert('Entrar', 'Não foi possível acessar.');
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" mt={24} mb={6} fontSize="xl">
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="Email"
        onChangeText={setEmail}
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
      />
      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button w="full" title="Entrar" onPress={handleSignIn} isLoading={isLoading} />
      <Button w="full" bg={colors.gray[500]} title="Cadastrar" onPress={handleGoSignUp} mt={4} />
    </VStack>
  );
}
