import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation, setIsLogged }: any) {

  const handleGoogleLogin = async () => {
    try {
      // 🔥 Redirect correcto basado en tu scheme
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "stagesync1",
        path: "auth"
      });

      console.log("🔗 REDIRECT:", redirectUrl);

      // 🔥 CORRECTO: enviar "redirect", NO "state"
      const authUrl = `https://stagesync-backend-new-production.up.railway.app/auth/google/login?redirect=${encodeURIComponent(
        redirectUrl
      )}`;

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl
      );

      console.log("RESULT:", result);

    if (result.type === "success" && result.url) {

  console.log("URL COMPLETA:", result.url);

  const data = Linking.parse(result.url);

  let token = data.queryParams?.token;

  // 🔥 Si viene como array, tomar el primero
  if (Array.isArray(token)) {
    token = token[0];
  }

  // 🔥 Validar que sea string válido
  if (typeof token === "string" && token.length > 0) {
    console.log("✅ TOKEN:", token);

    await SecureStore.setItemAsync("token", token);
    setIsLogged(true);

    setIsLogged(true);
  } else {
    console.log("❌ Token inválido:", token);
  }
}

    } catch (error) {
      console.log("❌ ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>

      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.card}>

        <Text style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Registrarse
          </Text>
        </Text>

        <Text style={styles.title}>Iniciar Sesión</Text>

        <Pressable
          style={[styles.socialBtn, styles.google]}
          onPress={handleGoogleLogin}
        >
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png" }}
            style={styles.icon}
          />
          <Text style={styles.btnText}>Continuar con Google</Text>
        </Pressable>

        <Pressable
          style={[styles.socialBtn, styles.gmail]}
          onPress={handleGoogleLogin}
        >
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/732/732200.png" }}
            style={styles.icon}
          />
          <Text style={styles.btnText}>Continuar con Gmail</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f16',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 30,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    marginBottom: 20,
  },

  registerText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },

  registerLink: {
    color: '#4da3ff',
    fontWeight: 'bold',
  },

  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    width: '100%',
    marginTop: 12,
  },

  google: {
    backgroundColor: '#101a57',
  },

  gmail: {
    backgroundColor: '#7e170d',
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#050e38',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: '#fff',
    fontSize: 20,
  },
});