import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { HStack, VStack, FlatList, Heading, Text } from 'native-base';
import { AppNavigatorRoutesProps } from '@routes/app.routes';

import { ExerciseCard } from '@components/ExerciseCard';
import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group'

export function Home(){
  const [groups, setGroups] = useState(['costas', 'ombros', 'bíceps', 'tríceps'])
  const [exercises, setExercises] = useState(['1', '2', '3', 'remada unilateral', 'puxada frontal', 'remada curvada', 'levantamento terra'])
  const [groupSelected, setGroupSelected] = useState('costas')

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(){
    navigation.navigate('exercise')
  }

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

      <VStack px={8} flex={1} >  
        <HStack justifyContent={"space-between"} mb={4} >
          <Heading color={"gray.200"} fontSize={"md"}>
            Exercícios
          </Heading>
          <Text color={"gray.200"} fontSize={"sm"}>
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <ExerciseCard onPress={handleOpenExerciseDetails}/>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{paddingBottom: 20}}
        
        />
      </VStack>

    </VStack>
  )
}