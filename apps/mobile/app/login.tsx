import{useState}from'react';
import{View,Text,TextInput,TouchableOpacity,StyleSheet,Alert}from'react-native';
import{useRouter}from'expo-router';
import{useAuth}from'../context/AuthContext';
export default function Login(){
const[email,setEmail]=useState('');
const[senha,setSenha]=useState('');
const{signIn}=useAuth();
const router=useRouter();
async function entrar(){try{await signIn(email,senha);router.replace('/(tabs)/dashboard');}catch{Alert.alert('Erro','Email ou senha incorretos');}}
return(<View style={s.container}><Text style={s.logo}>🐾 PetShop</Text><TextInput style={s.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/><TextInput style={s.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry/><TouchableOpacity style={s.btn} onPress={entrar}><Text style={s.btnTxt}>Entrar</Text></TouchableOpacity></View>);}
const s=StyleSheet.create({container:{flex:1,justifyContent:'center',padding:32,backgroundColor:'#fff'},logo:{fontSize:36,textAlign:'center',marginBottom:40,fontWeight:'bold'},input:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:14,marginBottom:16,fontSize:16},btn:{backgroundColor:'#2563eb',borderRadius:8,padding:16},btnTxt:{color:'#fff',textAlign:'center',fontSize:16,fontWeight:'bold'}});
