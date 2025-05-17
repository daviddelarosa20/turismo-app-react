// app/profile/CambioContrasena.jsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function CambioContrasena() {   
  const router = useRouter();
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <View className="px-4 py-6 flex-1">
        <Text className="text-xl font-bold mb-2">Cambiar la contraseña</Text>
        <Text className="text-gray-600 mb-4">
          Una contraseña segura contribuye a evitar el acceso no autorizado a la cuenta de correo electrónico.
        </Text>
        <Text className="text-sm text-gray-500 mb-6">8 caracteres como mínimo</Text>

        <View>
          <Text className="mb-1 font-medium">Contraseña actual:</Text>
          <TextInput
            secureTextEntry
            value={contrasenaActual}
            onChangeText={setContrasenaActual}
            placeholder="Contraseña actual"
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <Text className="mb-1 font-medium">Nueva contraseña:</Text>
          <TextInput
            secureTextEntry
            value={nuevaContrasena}
            onChangeText={setNuevaContrasena}
            placeholder="Nueva contraseña"
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <Text className="mb-1 font-medium">Confirmar contraseña:</Text>
          <TextInput
            secureTextEntry
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
            placeholder="Confirmar contraseña"
            className="border border-gray-300 rounded px-3 py-2 mb-6"
          />
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 mr-2 border border-gray-400 rounded py-2 items-center"
          >
            <Text>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Todo para validar y enviar formulario Solo hay q esperar a Christian :D
            }}
            className="flex-1 ml-2 bg-blue-500 rounded py-2 items-center"
          >
            <Text className="text-white">Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
