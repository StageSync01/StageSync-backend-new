import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  
  const handleGoogleLogin = () => {
    // Aquí luego conectamos tu backend real
    Alert.alert("Google Login", "Conectar con backend aquí");
  };

  return (
    <View style={styles.container}>

      {/* Botón regresar */}
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.card}>

        {/* Texto registro */}
        <Text style={styles.registerText}>
          ¿No tienes cuenta?{' '}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            Registrarse
          </Text>
        </Text>

        {/* Título */}
        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* Google */}
        <Pressable style={[styles.socialBtn, styles.google]} onPress={handleGoogleLogin}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
            style={styles.icon}
          />
          <Text style={styles.btnText}>Continuar con Google</Text>
        </Pressable>

        {/* Gmail */}
        <Pressable style={[styles.socialBtn, styles.gmail]}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/732/732200.png' }}
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
    backgroundColor: 'rgba(255,255,255,0.05)', // glass effect
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

  googleText: {
    color: '#000',
    fontWeight: '600',
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