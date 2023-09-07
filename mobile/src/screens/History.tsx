import { useCallback, useState } from 'react';
import {Heading, SectionList, Text, VStack, useToast} from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';
export function History(){
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  const toast = useToast()

  async function fetchHistory(){
    try {
      setIsLoading(true)
      const response = await api.get('/history')
      setExercises(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possivel carregar o histórico de exercícios'
      toast.show({
        title,
        bgColor: 'red.500',
        placement: 'top'
      })
    } finally {
      setIsLoading(false)
    }

  }

  useFocusEffect(
    useCallback(()=> {
      fetchHistory()
    }, [])
  )

  return (
    <VStack flex={1}>
        <ScreenHeader title='Histórico de Exercício'/>
        <SectionList
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({item})=> (
            <HistoryCard data={item}/>
          )}
          renderSectionHeader={({section})=>(
            <Heading color={'gray.200'} fontSize={'md'} mt={10} mb={3} fontFamily={"heading"}>
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={exercises.length === 0 && {flex: 1, justifyContent: 'center'}}
          ListEmptyComponent={()=> (
            <Text  color={'gray.100'} fontSize={'md'} textAlign={'center'}>
              Não á exercícios registrados ainda. {'\n'} 
              Vamos fazer exercícios hoje?
            </Text>
          )}
        />
    </VStack>
  )
}