import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import {Center, ScrollView, Text, VStack, Skeleton, Heading, useToast} from 'native-base';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@hooks/useAuth';

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Button } from '@components/Button';
import { Input } from '@components/Input';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'


const PHOTO_SIZE = 33

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema = yup.object({
  name: yup.string()
    .required('Informe o nome'),
  password: yup.string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => !!value ? value : null),
  confirm_password: yup.string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any ) => Field,
      then: yup.string()
      .nullable()
      .required('Informe a confirmação de senha.')
      .transform((value) => !!value ? value : null)
    }),
})

export function Profile(){
  const [photoLoading, setPhotoLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true)

  const toast = useToast()
  const { user,updateUserProfile } = useAuth()



  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({ defaultValues:{
      name: user.name,
      email: user.email, 

    },
    resolver: yupResolver(profileSchema)
  })


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
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any;

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type' : 'multipart/form-data' 
          }
        })
        
        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto alterada com sucesso.',
          bgColor: 'green.500',
          placement: 'top'
        })
      }
  
    } catch (error) {
        console.log(error)
    } finally {
      setPhotoLoading(false)
    }
  }

  async function handleProfileSubmite(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        title: 'Perfil atualizado com sucesso.',
        bgColor: 'green.700',
        placement: 'top'    
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError? error.message : 'Não foi possível atualizar o perfil, tente novamente mais tarde.'
      toast.show({
        title,
        bgColor: 'red.500',
        placement: 'top'    
      })
    } finally {
      setIsUpdating(false)
    }
  }

  
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
              source={user.avatar ? 
                {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : defaultUserPhotoImg}
              alt='foto do usário'
            />
        }

        <TouchableOpacity onPress={handleUserPhotoSelect}>
          <Text color={'green.500'} fontSize={'md'} mt={2} mb={8} fontWeight={'bold'} >
            Alterar foto
          </Text>
        </TouchableOpacity>

        <Controller
          control={control}
          name='name'
          render={({field: {value, onChange}}) => 
            <Input 
              placeholder='Nome' 
              bg={'gray.600'}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          }
        />

        <Controller
          control={control}
          name='email'
          render={({field: {value, onChange}}) => 
            <Input 
              placeholder='E-mail' 
              bg={'gray.600'}
              onChangeText={onChange}
              value={value}
              isDisabled
            />
          }
        />

        <Heading color={'gray.200'} fontSize={'md'} mt={'16'} mb={3} alignSelf={'flex-start'} fontFamily={"heading"}>
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name='old_password'
            render={({field: {onChange}}) => 
              <Input
                placeholder='Senha antiga'
                bg={'gray.600'}
                secureTextEntry
                onChangeText={onChange}
              />
            }
          />

          <Controller
            control={control}
            name='password'
            render={({field: {value, onChange}}) => 
              <Input
                placeholder='Nova senha'
                bg={'gray.600'}
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            }
          />

          <Controller
            control={control}
            name='confirm_password'
            render={({field: {value,onChange}}) => 
              <Input
                placeholder='Confirme a senha'
                bg={'gray.600'}
                value={value}
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.confirm_password?.message}
              />
            }
          />

          <Button 
            title='Atualizar' 
            mt={4} 
            onPress={handleSubmit(handleProfileSubmite)}
            isLoading={isUpdating}
          />
        </Center>
  
      </ScrollView>
    </VStack>
  )
}
