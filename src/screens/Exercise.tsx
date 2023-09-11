import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Box, HStack, Heading, Icon, Image, Text, VStack, ScrollView, useToast, Hidden} from 'native-base';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';
import { exerciseDTO } from '@dtos/ExerciseDTO';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { Feather } from '@expo/vector-icons'
import { Button } from '@components/Button';

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'

type RouteParamsProps = {
  exerciseId: string;
}

export function Exercise(){

  const [exercise, setExercise] = useState<exerciseDTO>({} as exerciseDTO)
  const [sendingExercise, setSendingExercise] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const toast = useToast()

  const { exerciseId } = route.params as RouteParamsProps

  async function fetchExerciseDetails(){
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possivel carregar os detalhes do exercício'
      toast.show({
        title,
        bgColor: 'red.500',
        placement: 'top'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister(){
    try {
      setSendingExercise(true)
      await api.post('/history', { exercise_id: exerciseId })
      toast.show({
        title: 'Parabéns! Exercício registrado em seu histórico.',
        bgColor: 'green.700',
        placement: 'top'
      })
      navigation.navigate('history')
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possivel registrar o exercício'
      toast.show({
        title,
        bgColor: 'red.500',
        placement: 'top'
      })
    } finally {
      setSendingExercise(false)
    }
  }

  useEffect(()=> {
  fetchExerciseDetails() }, [])

  function handleGoBack(){
  navigation.goBack()
}
  return (
      <VStack flex={1}>
        <VStack bg={'gray.600'} px={8} pt={12}>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon as={Feather} name='arrow-left' color={'green.500'} size={6}/>
          </TouchableOpacity>

          <HStack justifyContent={'space-between'} alignItems={'center'} mt={4} mb={8}>
            <Heading fontSize={'lg'} color={'gray.100'} fontFamily={"heading"}>
              {exercise.name}
            </Heading>
            <HStack alignItems={'center'}>
              <BodySvg/>
              <Text color={'gray.200'} ml={1} flexShrink={1} textTransform={'capitalize'}>
                {exercise.group}
              </Text>
            </HStack>
          </HStack>
        </VStack>
        {
          isLoading ? <Loading/> :
          <ScrollView>
            <VStack p={8} >
                  <Box rounded="lg" mb={3} overflow="hidden">
                    <Image
                      w="full"
                      h={80}
                      source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}` }}
                      alt="Nome do exercício"
                      resizeMode="cover"
                      rounded="lg"
                    />
                </Box>

                <Box bg={'gray.500'} p={4} rounded={'lg'}>
                  <HStack mb={6} alignItems={'center'} justifyContent={'space-around'} >
                    <HStack>
                      <SeriesSvg/>
                      <Text color={'gray.200'} fontSize={'md'} fontWeight={'thin'} ml={2}>
                        {exercise.series} séries
                      </Text>
                    </HStack>

                    <HStack>
                      <RepetitionsSvg/>
                      <Text color={'gray.200'} fontSize={'md'} fontWeight={'thin'} ml={2}>
                      {exercise.repetitions} repetições
                      </Text>
                    </HStack>
                  </HStack>

                  <Button 
                    title='Marcar como realizado'
                    isLoading={sendingExercise}
                    onPress={handleExerciseHistoryRegister}
                  />
                </Box>
            </VStack>
          </ScrollView>
        }
        
      </VStack>
    
  )
}