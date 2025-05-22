import React, { useState, useLayoutEffect, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../supabase/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function CambioContrasena() {
  const router = useRouter();
  const navigation = useNavigation();
  const { idUser } = useLocalSearchParams();
  const userId = Number(idUser);

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [passwordReal, setPasswordReal] = useState("");

  const [mostrarNuevaContrasena, setMostrarNuevaContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] =
    useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Nueva contraseña",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
    });
  }, []);

  useEffect(() => {
    async function obtenerContrasena() {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("Password")
        .eq("idUser", userId)
        .single();

      if (error) {
        console.error("Error al obtener la contraseña:", error.message);
        Alert.alert(
          "Error",
          "No se pudo obtener la información de la contraseña. Intente de nuevo más tarde.",
        );
      } else if (data) {
        setPasswordReal(data.Password);
        setContrasenaActual(data.Password);
      }
    }

    if (userId) obtenerContrasena();
  }, [userId]);

  const handlePasswordChange = async () => {
    if (!nuevaContrasena || !confirmarContrasena) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    if (nuevaContrasena.length < 8) {
      Alert.alert(
        "Error",
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    if (contrasenaActual !== passwordReal) {
      Alert.alert(
        "Error",
        "Hubo un problema al verificar la contraseña actual.",
      );
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert(
        "Error",
        "La nueva contraseña y la confirmación no coinciden.",
      );
      return;
    }

    const { error: errorUpdate } = await supabase
      .from("Usuarios")
      .update({ Password: nuevaContrasena })
      .eq("idUser", userId);

    if (errorUpdate) {
      console.error("Error al actualizar la contraseña:", errorUpdate);
      Alert.alert("Error", "Ocurrió un error al actualizar la contraseña.");
    } else {
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      <StatusBar style="light" />
      <View className="flex-1 px-6 justify-center">
        <Text className="text-3xl font-bold text-veryLightBeige-500 mb-8 text-center">
          Nueva contraseña
        </Text>

        <View className="mb-6">
          <Text className="mb-2 font-medium text-veryLightBeige-500">
            Nueva contraseña:
          </Text>
          <View className="relative">
            <TextInput
              secureTextEntry={!mostrarNuevaContrasena}
              value={nuevaContrasena}
              onChangeText={setNuevaContrasena}
              placeholder="Nueva contraseña"
              placeholderTextColor="#a0a0a0"
              className="border border-gray-600 rounded-lg px-4 py-3 pr-12 text-lightBeige-400 bg-gray-800"
            />
            <TouchableOpacity
              onPress={() => setMostrarNuevaContrasena(!mostrarNuevaContrasena)}
              style={{ position: "absolute", right: 12, top: 14 }}
            >
              <Ionicons
                name={mostrarNuevaContrasena ? "eye" : "eye-off"}
                size={22}
                color="#a0a0a0"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="mb-2 font-medium text-veryLightBeige-500">
            Confirmar contraseña:
          </Text>
          <View className="relative">
            <TextInput
              secureTextEntry={!mostrarConfirmarContrasena}
              value={confirmarContrasena}
              onChangeText={setConfirmarContrasena}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#a0a0a0"
              className="border border-gray-600 rounded-lg px-4 py-3 pr-12 text-lightBeige-400 bg-gray-800"
            />
            <TouchableOpacity
              onPress={() =>
                setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)
              }
              style={{ position: "absolute", right: 12, top: 14 }}
            >
              <Ionicons
                name={mostrarConfirmarContrasena ? "eye" : "eye-off"}
                size={22}
                color="#a0a0a0"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="flex-1 mr-4 bg-red-600 rounded-lg py-3 items-center shadow-md"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-white text-lg">Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 ml-4 bg-blue-600 rounded-lg py-3 items-center shadow-md"
            onPress={handlePasswordChange}
          >
            <Text className="font-semibold text-white text-lg">Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
