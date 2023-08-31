import { useTheme, Box } from "native-base";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

import { useAuth } from "@hooks/useAuth";


export function Routes(){
  const {colors} = useTheme()
  const theme = DefaultTheme
  
  const {user} = useAuth()
  console.log(user)

  theme.colors.background = colors.gray[700]

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes/>
      </NavigationContainer>
    </Box>
  )
}