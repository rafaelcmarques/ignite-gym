import { ReactNode, createContext, useEffect, useState } from "react";

import { storageAuthTokenGet, storageAuthTokenSave, storageAuthTokenRemove } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";

import { UserDTO } from "@dtos/UserDTO";

import { api } from "@services/api";

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email:string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
  updateUserProfile: (updatedUser: UserDTO) => Promise<void>
  signOut: () => void
} 

type AuthContextProviderProps = {
  children: ReactNode;
}

export  const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)


export function AuthContextProvider({children}: AuthContextProviderProps) {

  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

   function userAndTokenUpdate(user: UserDTO, token:string){
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
      setUser(user)
    }

  async function storageUserAndTokenSave(userData: UserDTO, token:string, refresh_token:string){
    try {
      setIsLoadingUserStorageData(true)

      await storageUserSave(userData)
      await storageAuthTokenSave({token, refresh_token})
      

    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }
  
  async function signIn(email:string, password: string){
      try {
        const { data } = await api.post('/sessions', {email, password});
    
        if(data.user && data.token && data.refresh_token){
          storageUserAndTokenSave(data.user, data.token, data.refresh_token)
          userAndTokenUpdate(data.user, data.token)
        }
      } catch (error) {
        throw(error);
      }
  }

  async function signOut(){
    try {
      setIsLoadingUserStorageData(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
      
    } catch (error) {
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(updatedUser: UserDTO){
    try {
      setUser(updatedUser)
      await storageUserSave(updatedUser)
    } catch (error) {
      throw error
    }
  }

  async function loadUserData(){
    try{
      setIsLoadingUserStorageData(true)
      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()
      if(userLogged && token){
        userAndTokenUpdate(userLogged, token)
      }
      } catch(error) {
        throw error
      } finally {
        setIsLoadingUserStorageData(false)
      }
  }

  useEffect(()=>{
    loadUserData()
  }, [])

  useEffect(()=>{
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe()
    }
  }, [signOut])

  return(
    <AuthContext.Provider value={{
        user, 
        signIn, 
        isLoadingUserStorageData,
        signOut,
        updateUserProfile
      }}>
     {children}
    </AuthContext.Provider>
  )
}