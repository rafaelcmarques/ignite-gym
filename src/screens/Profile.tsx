import { useState } from 'react';
import { Touchable, TouchableOpacity } from 'react-native';
import {Center, ScrollView, Text, VStack, Skeleton, Heading} from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

export function Profile(){
  const [photoLoading, setPhotoLoading] = useState(false);

  const PHOTO_SIZE = 33
  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil'/>
      <ScrollView contentContainerStyle={{paddingBottom: 36}}>
        <Center mt={3} px={10}>

          {
            photoLoading ?        
           <Skeleton 
              w={PHOTO_SIZE} 
              h={PHOTO_SIZE} 
              rounded={'full'}
              startColor={'gray.500'}
              endColor={'gray.400'}
            /> :
            <UserPhoto 
              size={PHOTO_SIZE} 
            source={{uri: 'https://github.com/rafaelcmarques.png'}}
            alt='foto do usário'
            />
        }

        <TouchableOpacity>
          <Text color={'green.500'} fontSize={'md'} mt={2} mb={8} fontWeight={'bold'} >
            Alterar foto
          </Text>
        </TouchableOpacity>

        <Input placeholder='Nome' bg={'gray.600'}/>
        <Input placeholder='Email' bg={'gray.600'} isDisabled/>

        <Heading color={'gray.200'} fontSize={'md'} mt={'16'} mb={3} alignSelf={'flex-start'}>
            Alterar senha
          </Heading>
          <Input
            placeholder='Senha antiga'
            bg={'gray.600'}
            secureTextEntry
          />
          <Input
            placeholder='Nova senha'
            bg={'gray.600'}
            secureTextEntry
          />
          <Input
            placeholder='Confirme a nova senha'
            bg={'gray.600'}
            secureTextEntry
          />

          <Button title='Atulizar' mt={4}/>
        </Center>
  
      </ScrollView>
    </VStack>
  )
}
