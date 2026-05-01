import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Rect, Line } from 'react-native-svg';

import { AuthProvider, useAuth } from './src/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { PainelScreen } from './src/screens/PainelScreen';
import { TelegramScreen } from './src/screens/TelegramScreen';
import { PagamentosScreen } from './src/screens/PagamentosScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const c = focused ? colors.purple : 'rgba(255,255,255,0.25)';
  const sw = 1.8;
  if (name === 'Painel') return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={7} height={7} rx={1} stroke={c} strokeWidth={sw} />
      <Rect x={14} y={3} width={7} height={7} rx={1} stroke={c} strokeWidth={sw} />
      <Rect x={3} y={14} width={7} height={7} rx={1} stroke={c} strokeWidth={sw} />
      <Rect x={14} y={14} width={7} height={7} rx={1} stroke={c} strokeWidth={sw} />
    </Svg>
  );
  if (name === 'Telegram') return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={c} strokeWidth={sw} />
    </Svg>
  );
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Rect x={1} y={4} width={22} height={16} rx={2} stroke={c} strokeWidth={sw} />
      <Line x1={1} y1={10} x2={23} y2={10} stroke={c} strokeWidth={sw} />
    </Svg>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontSize: 10, fontWeight: '500', letterSpacing: 0.2, color: focused ? colors.purple : 'rgba(255,255,255,0.25)' }}>
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: 'rgba(10,8,20,0.97)',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(255,255,255,0.07)',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarBackground: () => (
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,8,20,0.97)' }} />
        ),
      })}
    >
      <Tab.Screen name="Painel" component={PainelScreen} />
      <Tab.Screen name="Telegram" component={TelegramScreen} />
      <Tab.Screen name="Pagamentos" component={PagamentosScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={colors.bg} />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
