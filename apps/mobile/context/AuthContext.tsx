import React,{createContext,useContext,useState,useEffect}from'react';
import*as SecureStore from'expo-secure-store';
import api from'../services/api';
const AuthContext=createContext<any>(null);
export function AuthProvider({children}:{children:React.ReactNode}){
const[token,setToken]=useState<string|null>(null);
const[isLoading,setIsLoading]=useState(true);
useEffect(()=>{SecureStore.getItemAsync('token').then(t=>{setToken(t);setIsLoading(false);});},[]);
if(isLoading)return null;
async function signIn(email:string,password:string){const r=await api.post('/auth/login',{email,password});await SecureStore.setItemAsync('token',r.data.access_token);setToken(r.data.access_token);}
async function signOut(){await SecureStore.deleteItemAsync('token');setToken(null);}
return<AuthContext.Provider value={{token,signIn,signOut}}>{children}</AuthContext.Provider>;}
export const useAuth=()=>useContext(AuthContext);
