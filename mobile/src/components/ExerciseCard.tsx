import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Image, Text, VStack, Icon, Center } from "native-base";
import {Entypo} from "@expo/vector-icons"

import { exerciseDTO } from "@dtos/ExerciseDTO";

import { api } from "@services/api";

type Props = TouchableOpacityProps & {
  data: exerciseDTO
};

export function ExerciseCard({data, ...rest}: Props){
  return (
    <TouchableOpacity {...rest}>
      <HStack bg={"gray.500" } p={2} pr={4} rounded={"md"} mb={3} alignItems={"center"}>
        <Image
          source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}}
          alt="Imagem do exercício"
          w={16}
          h={16}
          borderRadius={"md"}
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading color={"white"} fontSize={"md"} fontFamily={"heading"}>
            {data.name}
          </Heading>

          <Text color={"gray.200"} mt={1} numberOfLines={2} >
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color={"gray.300"}/>
      </HStack>
    </TouchableOpacity>
  )
}