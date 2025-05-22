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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (navigation && navigation.setOptions) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);

    if (!email || !password) {
      Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
      setLoading(false);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from("Usuarios")
        .select("idUser, Email")
        .eq("Email", email)
        .eq("Password", password)
        .single();

      if (userError && userError.code !== "PGRST116") {
        Alert.alert(
          "Error",
          "Ocurrió un error al verificar las credenciales de usuario: " +
            userError.message,
        );
        console.error(
          "Error al buscar usuario en la tabla 'Usuarios':",
          userError,
        );
        setLoading(false);
        return;
      }

      if (userData) {
        Alert.alert("Éxito", "¡Inicio de sesión exitoso!");
        console.log("Usuario autenticado:", userData);

        try {
          await AsyncStorage.setItem(
            "userSession",
            JSON.stringify({
              idUser: userData.idUser,
              email: userData.Email,
              loginTime: new Date().toISOString(),
            }),
          );
        } catch (storageError) {
          console.error("Error al guardar sesión:", storageError);
        }

        router.replace("/Home");
      } else {
        const { data: adminData, error: adminError } = await supabase
          .from("UserAdmin")
          .select("idEmpresa, Email")
          .eq("Email", email)
          .eq("Password", password)
          .single();

        if (adminData) {
          Alert.alert("Éxito", "¡Inicio de sesión como administrador!");
          console.log("Administrador autenticado:", adminData);
          router.replace(`/empresa/Perfil?idEmpresa=${adminData.idEmpresa}`);
        } else if (adminError && adminError.code !== "PGRST116") {
          Alert.alert(
            "Error",
            "Ocurrió un error al verificar las credenciales de administrador: " +
              adminError.message,
          );
          console.error(
            "Error al buscar usuario en la tabla 'UserAdmin':",
            adminError,
          );
        } else {
          Alert.alert(
            "Error de inicio de sesión",
            "Correo electrónico o contraseña incorrectos.",
          );
        }
      }
    } catch (unexpectedError) {
      Alert.alert("Error", "Ocurrió un error inesperado al iniciar sesión.");
      console.error("Error inesperado en handleLogin:", unexpectedError);
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
        <View className="flex-1 px-6 pt-10 pb-5 justify-between">
          <View className="mb-10">
            <TouchableOpacity
              className="self-start mb-6"
              onPress={() => router.push("/login/welcomescreen")}
            >
              <Icon name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>

            <Text className="text-white text-4xl font-bold mb-2">Hey,</Text>
            <Text className="text-white text-4xl font-bold">
              Bienvenido de vuelta
            </Text>
          </View>

          <View className="w-full mb-10">
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
            <TouchableOpacity
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-white"
              } py-4 rounded-full items-center `}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <Text className="text-black font-bold text-lg">
                  Iniciando sesión...
                </Text>
              ) : (
                <Text className="text-black font-bold text-lg">
                  Iniciar sesión
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Texto "¿No tienes una cuenta?" */}
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
