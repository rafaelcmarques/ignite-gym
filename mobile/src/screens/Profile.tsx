import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {Center, ScrollView, Text, VStack, Skeleton, Heading, useToast} from 'native-base';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Alert } from 'react-native';

export function Profile(){
  const [photoLoading, setPhotoLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/rafaelcmarques.png')
  const toast = useToast()

  async function handleUserPhotoSelect() {
    setPhotoLoading(true)

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
        allowsEditing: true,
      })
  
      if(photoSelected.canceled){
        return;
      }

      if(photoSelected.assets[0].uri){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        if(photoInfo.exists &&  (photoInfo.size / 1024 / 1024 > 5)){
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB",
            placement:'top',
            bgColor: 'red.500'
          })
         
        }
        setUserPhoto(photoSelected.assets[0].uri)
      }
  
    } catch (error) {
        console.log(error)
    } finally {
      setPhotoLoading(false)
    }
  }

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
            source={{uri: userPhoto}}
            alt='foto do usário'
            />
        }

        <TouchableOpacity onPress={handleUserPhotoSelect}>
          <Text color={'green.500'} fontSize={'md'} mt={2} mb={8} fontWeight={'bold'} >
            Alterar foto
          </Text>
        </TouchableOpacity>

        <Input placeholder='Nome' bg={'gray.600'}/>
        <Input placeholder='Email' bg={'gray.600'} isDisabled/>

        <Heading color={'gray.200'} fontSize={'md'} mt={'16'} mb={3} alignSelf={'flex-start'} fontFamily={"heading"}>
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
