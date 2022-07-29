import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { Heading, Icon, VStack, useTheme } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useNavigation } from '@react-navigation/native';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleGoSignIn() {
    navigation.navigate('signIn');
  }

  function handleSignUp() {
    if (!email || !password || !confirmPassword) {
      return Alert.alert('Cadastrar', 'Preencha todos os campos');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Cadastrar', 'As senhas não conferem');
    }

    if (password.length < 6) {
      return Alert.alert('Cadastrar', 'A senha deve possuir pelo menos 6 caracteres.');
    }

    setIsLoading(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => console.log(response))
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Entrar', 'Email inválido.');
        }

        return Alert.alert('Cadastrar', 'Não foi possível cadastrar.');
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" mt={24} mb={6} fontSize="xl">
        Criar uma conta
      </Heading>

      <Input
        mb={4}
        placeholder="Email"
        onChangeText={setEmail}
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
      />
      <Input
        mb={4}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Input
        mb={8}
        placeholder="Confirme a senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />

      <Button w="full" title="Cadastrar" onPress={handleSignUp} isLoading={isLoading} />
      <Button w="full" bg={colors.gray[500]} title="Entrar" onPress={handleGoSignIn} mt={4} />
    </VStack>
  );
}
