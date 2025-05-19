import React, { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { supabase } from "../../supabase/supabase";

const { width } = Dimensions.get("window");

export default function SignUpScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [apodo, setApodo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (navigation && navigation.setOptions) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation]);

  const handleSignUp = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.from("Usuarios").insert([
        {
          Nombre: nombre,
          Apellido: apellido,
          Email: email,
          Telefono: telefono,
          Apodo: apodo,
          Password: password,
          FechaRegistro: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }

      Alert.alert(
        "Éxito",
        "Usuario registrado exitosamente en la base de datos!",
      );
      router.push("/login/login");
    } catch (error) {
      console.error(
        "Error al registrar el usuario en la base de datos:",
        error.message,
      );
      Alert.alert(
        "Error",
        "Hubo un problema al registrar el usuario: " + error.message,
      );
    } finally {
      setLoading(false);
    }
  };

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
                name="account-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Nombre"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-white text-base ml-2"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
              />
            </View>

            {/* Campo Apellido */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="account-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Apellido"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-white text-base ml-2"
                value={apellido}
                onChangeText={setApellido}
                autoCapitalize="words"
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
                autoCapitalize="none"
                className="flex-1 text-white text-base ml-2"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Campo Teléfono */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="phone-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Teléfono"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                className="flex-1 text-white text-base ml-2"
                value={telefono}
                onChangeText={setTelefono}
              />
            </View>

            {/* Campo Apodo */}
            <View className="flex-row items-center bg-[#2a2e33] p-4 rounded-xl mb-4">
              <Icon
                name="account-cowboy-hat-outline"
                size={20}
                color="#9ca3af"
                className="mr-3"
              />
              <TextInput
                placeholder="Apodo"
                placeholderTextColor="#9ca3af"
                className="flex-1 text-white text-base ml-2"
                value={apodo}
                onChangeText={setApodo}
                autoCapitalize="none"
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
                secureTextEntry={!showPassword}
                className="flex-1 text-white text-base ml-2"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="ml-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
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
                secureTextEntry={!showConfirmPassword}
                className="flex-1 text-white text-base ml-2"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                className="ml-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botones de acción (Sign up) */}
          <View className="w-full items-center">
            {/* Botón Sign up */}
            <TouchableOpacity
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-white"
              } py-4 rounded-full items-center mb-4`}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <Text className="text-black font-bold text-lg">
                  Registrando...
                </Text>
              ) : (
                <Text className="text-black font-bold text-lg">
                  Registrarse
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Enlace "Already have an account? Login" */}
          <View className="w-full flex-row justify-center mt-auto">
            <Text className="text-white text-base">
              ¿Ya tienes una cuenta?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login/login")}>
              <Text className="text-white font-bold text-base">
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
