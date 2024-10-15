import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Updates from 'expo-updates';
import { ActivityIndicator, MD2Colors, Portal, Provider, Text, Button, Modal } from 'react-native-paper';

import { theme } from "./app/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
} from "./app/screens";
import { StyleSheet, View } from "react-native";
const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el loading
  const [isUpdating, setIsUpdating] = useState(false); // Estado para manejar el loading

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setIsUpdating(true); // Si hay actualizaciones, mostrar el loading
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // Recarga la app con la nueva actualización

          setTimeout(() => {}, 3000)
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
        setIsUpdating(false); 
      }
    };

    checkForUpdates();
  }, []);

  return (
    <Provider theme={theme}>
      {isLoading && (
        <Portal>
          <View style={{
            top: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
         <Button
            mode="outlined"
            disabled={true}
            loading={isLoading} 
            onPress={() => console.log('Button pressed')}
          >
            {isLoading ? 'Loading' : 'Submit'}  {/* Cambia el texto según el estado */}
          </Button>
          </View>
        </Portal>
      )}

      {isUpdating && (
         <Portal>
            <Modal
              visible={isUpdating}
              onDismiss={() => {}}  // Vacío o controlado para evitar cerrar
              dismissable={false}   // Esto deshabilita el clic fuera del modal
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.title}>Actualizando la app</Text>
              <Text style={styles.description}>
                Aguarda un momento, estamos actualizando la aplicación
              </Text>
              <ActivityIndicator style={{
                marginVertical: 10,
              }} size="small" animating={true} color={MD2Colors.purple400} />
            </Modal>
          </Portal>
      )}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',   // Centra el contenido
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',    // Centra el texto de la descripción
  },
});
