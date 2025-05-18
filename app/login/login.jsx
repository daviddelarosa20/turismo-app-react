import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation && navigation.setOptions) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-[#1a1e22]">
      <StatusBar barStyle="light-content" backgroundColor="#1a1e22" />

      {/* Usamos ScrollView para permitir el desplazamiento en caso de que el contenido exceda la pantalla */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contenedor principal con padding y flexbox para el layout */}
        <View className="flex-1 px-6 pt-10 pb-5 justify-between">
          {/* Parte superior: Flecha y Título */}
          <View className="mb-10">
            <TouchableOpacity
              className="self-start mb-6"
              onPress={() => router.push("/login/welcomescreen")}
            >
              {/* Icono de flecha hacia atrás */}
              <Icon name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>

            <Text className="text-white text-4xl font-bold mb-2">Hey,</Text>
            <Text className="text-white text-4xl font-bold">
              Bienvenido de vuelta
            </Text>
          </View>

          {/* Campos de entrada (Inputs) */}
          <View className="w-full mb-10">
            {/* Campo Email */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="email-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                className="flex-1 text-white text-base ml-2"
              />
            </View>

            {/* Campo Password */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-3">
              <Icon
                name="lock-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-white text-base ml-2"
              />
              <TouchableOpacity className="ml-3">
                <Icon name="eye-outline" size={20} color="#9ca3af" />{" "}
                {/* Icono de ojo para mostrar/ocultar contraseña */}
              </TouchableOpacity>
            </View>

            {/* Texto "¿Olvidaste la contraseña?" */}
            <TouchableOpacity className="self-end mb-8">
              <Text className="text-white text-base font-semibold">
                Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botones de acción*/}
          <View className="w-full items-center">
            {/* Botón Login */}
            <TouchableOpacity className="w-full bg-white py-4 rounded-full items-center ">
              <Text className="text-black font-bold text-lg">
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* Enlace "Don't have an account? Sign up" */}
          <View className="w-full flex-row justify-center mt-auto">
            <Text className="text-white text-base">
              ¿No tienes una cuenta?{" "}
            </Text>
            <TouchableOpacity>
              <Text
                className="text-white font-bold text-base"
                onPress={() => router.push("/login/signup")}
              >
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
