import React from 'react';
import {
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  return (
    <View style={styles.container}>

      {/* Botón atrás */}
      <Pressable style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.card}>

        {/* Texto arriba */}
        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Iniciar Sesión
          </Text>
        </Text>

        {/* Título */}
        <Text style={styles.title}>Registrarse</Text>

        {/* Botón Google */}
        <Pressable
          style={styles.googleBtn}
          onPress={() =>
            Linking.openURL('http://localhost:3000/auth/google/register')
          }
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.googleText}>Registrarse con Google</Text>
        </Pressable>

        {/* Botón Gmail */}
        <Pressable style={styles.gmailBtn}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.gmailText}>Continuar con Gmail</Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c14',
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

  loginText: {
    color: '#aaa',
    marginBottom: 10,
  },

  loginLink: {
    color: '#4da3ff',
    fontWeight: 'bold',
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101a57',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },

  googleText: {
    color: '#fff',
    fontWeight: '600',
  },

  gmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7e170d',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },

  gmailText: {
    color: '#fff',
    fontWeight: '600',
  },

  icon: {
    width: 20,
    height: 20,
  },

  backBtn: {
    position: 'absolute',
    top: 60,
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