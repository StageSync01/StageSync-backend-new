import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from 'react';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StartScreen from '../screens/StartScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {

    const handleUrl = async (url: string) => {
      if (!url) return;

      console.log("🌐 URL recibida:", url);

      const parsed = Linking.parse(url);

      let token = parsed.queryParams?.token;

      // 🔥 corregir si viene como array
      if (Array.isArray(token)) {
        token = token[0];
      }

      // 🔥 validar token antes de guardar
      if (typeof token === "string" && token.length > 0) {
        console.log("✅ Token capturado en AppNavigator:", token);

        await SecureStore.setItemAsync("token", token);
        setIsLogged(true);
      } else {
        console.log("❌ Token inválido en AppNavigator:", token);
      }
    };

    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        setIsLogged(!!token);
      } catch (error) {
        console.log("Error leyendo token:", error);
      } finally {
        setLoading(false);
      }
    };

    // 🔥 escuchar deep links
    const subscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    // 🔥 app abierta desde login (caso Safari → app)
    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    checkLogin();

    return () => subscription.remove();
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLogged ? (
        <Stack.Screen name="Start" component={StartScreen} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />

          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} setIsLogged={setIsLogged} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}