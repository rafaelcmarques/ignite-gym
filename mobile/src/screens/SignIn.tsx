import { VStack, Image, Center, Text, Heading, ScrollView } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";

import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Input } from "@components/Input";
import { Button } from "@components/Button";

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail'),
  password: yup.string().required('Informe a senha').min(6, 'Senha de ter pelo menos 6 caracteres'),
})

export function SignIn(){
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {signIn} = useAuth()

  type FormDataProps = {
    email:string,
    password: string,
    
  }

  function handleNewAccount(){
    navigation.navigate("signUp")
  }

  async function handleSignIn({email, password}: FormDataProps){
     await signIn(email, password)
  }

  
  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
  resolver: yupResolver(signInSchema)
  })


  return(
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>

        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treianando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg/>
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily={"heading"}>
            Acesse sua conta
          </Heading>

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}})=>(
              <Input 
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
            )}
          />
       
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, value}})=>(
              <Input 
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button title="Criar e Acessar" onPress={handleSubmit(handleSignIn)}/>
        </Center>

        <Center mt={24}>
          <Text color={'gray.100'} fontSize={'sm'} mb={3} fontFamily={'body'}>
            Ainda não tem acesso?
          </Text>
          <Button 
            title="Criar conta" 
            variant={"outline"}
            onPress={handleNewAccount}
          />
        </Center>

      </VStack>
    </ScrollView>
  )
}