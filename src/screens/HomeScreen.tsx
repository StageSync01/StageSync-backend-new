import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (



    <View style={styles.container}>
<Image
  source={require('../../assets/Icon.png')}
  style={{ width: 160, height: 160 }}
/>
      <Text style={styles.title}>StageSync</Text>
      <Text style={styles.subtitle}>¿Ya tienes cuenta?</Text>

      <Pressable
  style={styles.buttonPrimary}
  onPress={() => navigation.navigate('Login')}
>
  <Text style={styles.buttonText}>Iniciar sesión</Text>
</Pressable>

      <Pressable
  style={styles.buttonSecondary}
  onPress={() => navigation.navigate('Register')}
>
  <Text style={styles.buttonText}>Registrarse</Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     marginTop: -70,
    backgroundColor: '#0f0f16',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  logo: {
  width: 120,
  height: 120,
  marginBottom: 20,
  resizeMode: 'contain',
},
  
  title: {
    fontSize: 35,
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#ccc',
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: '#0a3799',
    fontSize: 10,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 300,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#475569',
    padding: 15,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});