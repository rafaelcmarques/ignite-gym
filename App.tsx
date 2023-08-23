import { StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base'

import { Loading } from '@components/Loading';

import { Routes } from '@routes/index';
import { Home } from '@screens/Home';

import {THEME} from './src/theme'

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'

export default function App() {
  const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
          barStyle={'light-content'}
          backgroundColor={'transparent'}
          translucent
      />
     { fontsLoaded ? <Routes/> : <Loading/>}
    </NativeBaseProvider>
  );
}
