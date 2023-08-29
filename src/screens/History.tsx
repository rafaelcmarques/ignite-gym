import {Heading, SectionList, Text, VStack} from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { HistoryCard } from '@components/HistoryCard';
import { useState } from 'react';

export function History(){
  const [exercises, setExercises] = useState([
    {
      title: '26.08.2022',
      data: ['Puxada frontal', 'Remada unilateral']
    },
    {
      title: '27.08.2022',
      data: ['Puxada frontal']
    }
  ])

  return (
    <VStack flex={1}>
        <ScreenHeader title='Histórico de Exercício'/>
        <SectionList
          sections={exercises}
          keyExtractor={item => item}
          renderItem={({item})=> (
            <HistoryCard/>
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