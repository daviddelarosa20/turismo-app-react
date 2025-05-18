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

export default function SignUpScreen() {
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

            <Text className="text-white text-4xl font-bold">
              Vamos a empezar!
            </Text>
          </View>

          {/* Campos de entrada (Inputs) */}
          <View className="w-full mb-10">
            {/* Campo Nombre */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="account-outline" // Puedes cambiar este icono si prefieres otro
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Nombre"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-white text-base ml-2"
              />
            </View>

            {/* Campo Apellido */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="account-outline" // Puedes cambiar este icono si prefieres otro
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Apellido"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-white text-base ml-2"
              />
            </View>

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

            {/* Campo Teléfono */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="phone-outline" // Icono de teléfono
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Teléfono"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                className="flex-1 text-white text-base ml-2"
              />
            </View>

            {/* Campo Apodo */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="account-cowboy-hat-outline" // Un icono divertido para apodo, puedes cambiarlo
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Apodo"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-white text-base ml-2"
              />
            </View>

            {/* Campo Password */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
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
                <Icon name="eye-outline" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {/* Campo Confirm Password */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-8">
              <Icon
                name="lock-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Confirmar contraseña"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                className="flex-1 text-white text-base ml-2"
              />
              <TouchableOpacity className="ml-3">
                <Icon name="eye-outline" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botones de acción (Sign up, Google) */}
          <View className="w-full items-center">
            {/* Botón Sign up */}
            <TouchableOpacity className="w-full bg-white py-4 rounded-full items-center mb-4">
              <Text className="text-black font-bold text-lg">Registrarse</Text>
            </TouchableOpacity>
          </View>

          {/* Enlace "Already have an account? Login" */}
          <View className="w-full flex-row justify-center mt-auto">
            <Text className="text-white text-base">
              ¿Ya tienes una cuenta?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")} // Navegar de vuelta a la pantalla de Login
            >
              <Text
                className="text-white font-bold text-base"
                onPress={() => router.push("/login/login")}
              >
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
