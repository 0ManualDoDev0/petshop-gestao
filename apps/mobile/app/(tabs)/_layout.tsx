import{Tabs}from'expo-router';
export default function TabsLayout(){return<Tabs screenOptions={{headerShown:false}}><Tabs.Screen name="dashboard" options={{title:'Início'}}/><Tabs.Screen name="agenda" options={{title:'Agenda'}}/><Tabs.Screen name="hotel" options={{title:'Hotel'}}/><Tabs.Screen name="clientes" options={{title:'Clientes'}}/></Tabs>;}
