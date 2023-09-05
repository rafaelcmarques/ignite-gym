import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HStack, VStack, FlatList, Heading, Text, useToast } from 'native-base';

import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { ExerciseCard } from '@components/ExerciseCard';
import { HomeHeader } from '@components/HomeHeader';
import { Loading } from '@components/Loading';
import { Group } from '@components/Group'

import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { exerciseDTO } from '@dtos/ExerciseDTO';

export function Home(){
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<exerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState('costas')

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  function handleOpenExerciseDetails(){
    navigation.navigate('exercise')
  }

  async function fetchGroups(){
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possivel carregar os grupos musculares'
      toast.show({
        title,
        bgColor: 'red.500',
        placement: 'top'
      })
    }
  }

  async function fetchExerciseByGroup(){
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possivel carregar os  exercícios'
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
    useCallback(()=>{
      fetchExerciseByGroup()
    }, [groupSelected])
  )
  useEffect(()=> {
    fetchGroups() 
  }, [])

  return (
    <VStack flex={1}>

      <HomeHeader/>

      <FlatList
        data={groups}
        keyExtractor={(item)=> item}
        renderItem={
          ({item}) => (
            <Group 
            name= {item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={()=> setGroupSelected(item)}
          />
          )
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{px:8}}
        my={10}
        maxH={10}
        minH={10}
      />
       {
        isLoading ? <Loading/> :
        <VStack px={8} flex={1} >  
          <HStack justifyContent={"space-between"} mb={4} >
            <Heading color={"gray.200"} fontSize={"md"} fontFamily={"heading"}>
              Exercícios
            </Heading>
            <Text color={"gray.200"} fontSize={"sm"}>
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ExerciseCard 
                onPress={handleOpenExerciseDetails}
                data={item}
                />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{paddingBottom: 20}}
          
          />
        </VStack>
       }

    </VStack>
  )
}