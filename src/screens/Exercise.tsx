import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Box, HStack, Heading, Icon, Image, Text, VStack, ScrollView} from 'native-base';

import { Feather } from '@expo/vector-icons'
import { Button } from '@components/Button';

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'

export function Exercise(){
  const navigation = useNavigation()

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
              Puxada frontal
            </Heading>
            <HStack alignItems={'center'}>
              <BodySvg/>
              <Text color={'gray.200'} ml={1} flexShrink={1} textTransform={'capitalize'}>
                Costas
              </Text>
            </HStack>
          </HStack>
        </VStack>

        <ScrollView>
          <VStack p={8}>
              <Image
                w={'full'}
                height={80}
                source={{uri: 'https://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg'}}
                alt='Nome do exercício'
                mb={3}
                resizeMode='cover'
                rounded={'lg'}
              />

              <Box bg={'gray.500'} p={4} rounded={'lg'}>
                <HStack mb={6} alignItems={'center'} justifyContent={'space-around'} >
                  <HStack>
                    <SeriesSvg/>
                    <Text color={'gray.200'} fontSize={'md'} fontWeight={'thin'} ml={2}>
                      3 séries
                    </Text>
                  </HStack>

                  <HStack>
                    <RepetitionsSvg/>
                    <Text color={'gray.200'} fontSize={'md'} fontWeight={'thin'} ml={2}>
                      12 repetições
                    </Text>
                  </HStack>
                </HStack>

                <Button title='Marcar como realizado'/>
              </Box>
          </VStack>
        </ScrollView>
        
      </VStack>
    
  )
}