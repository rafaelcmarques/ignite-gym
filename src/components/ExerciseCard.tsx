import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Image, Text, VStack, Icon, Center } from "native-base";
import {Entypo} from "@expo/vector-icons"

type Props = TouchableOpacityProps & {

};

export function ExerciseCard({...rest}: Props){
  return (
    <TouchableOpacity {...rest}>
      <HStack bg={"gray.500" } p={2} pr={4} rounded={"md"} mb={3} alignItems={"center"}>
        <Image
          source={{uri: 'https://conteudo.imguol.com.br/c/entretenimento/0c/2019/12/03/remada-unilateral-com-halteres-1575402100538_v2_600x600.jpg'}}
          alt="Imagem do exercício"
          w={16}
          h={16}
          borderRadius={"md"}
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading color={"white"} fontSize={"md"}>
            Remada unilateral
          </Heading>

          <Text color={"gray.200"} mt={1} numberOfLines={2} >
            3 séries x 2 repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color={"gray.300"}/>
      </HStack>
    </TouchableOpacity>
  )
}