import React, { useState, useLayoutEffect, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../../supabase/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function CambioContrasena() {
  const router = useRouter();
  const navigation = useNavigation();
  const { apodo } = useLocalSearchParams();

  const [contrasenaActual, setContrasenaActual] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const [mostrarContrasenaActual, setMostrarContrasenaActual] = useState(false);
  const [mostrarNuevaContrasena, setMostrarNuevaContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Nueva contraseña",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);

  useEffect(() => {
    async function obtenerContrasena() {
      if (!apodo) return;

      const { data, error } = await supabase
        .from("Users")
        .select("Password")
        .eq("Apodo", apodo)
        .single();

      if (error) {
        console.error("Error al obtener la contraseña:", error.message);
      } else if (data) {
        setContrasenaActual(data.Password);
      }
    }

    obtenerContrasena();
  }, [apodo]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      <View className="items-center mt-6 relative">
        <View className="px-4 py-6 flex-1">
          <Text className="text-xl font-bold mb-6 w-96 self-center">Cambiar la contraseña</Text>
          <Text className="text-gray-600 mb-10 w-96 self-center">
            Una contraseña segura contribuye a evitar el acceso no autorizado a la cuenta de correo electrónico.
          </Text>
          <Text className="text-sm text-gray-500 mb-4 w-96 self-center">
            8 caracteres como mínimo...
          </Text>

          <View className="items-center mt-4 relative">
            <View className="mt-1 w-96 self-center">
              {/*Contraseña actual*/}
              <Text className="mb-1 font-medium">Contraseña actual:</Text>
              <View className="relative mb-4">
                <TextInput
                  secureTextEntry={!mostrarContrasenaActual}
                  value={contrasenaActual}
                  onChangeText={setContrasenaActual}
                  placeholder="Contraseña actual"
                  className="border border-gray-300 rounded px-3 py-3 pr-10"
                />
                <TouchableOpacity
                  onPress={() => setMostrarContrasenaActual(!mostrarContrasenaActual)}
                  style={{ position: "absolute", right: 10, top: 14 }}
                >
                  <Ionicons
                    name={mostrarContrasenaActual ? "eye" : "eye-off"}
                    size={22}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              
              {/*Nueva contraseña*/}
              <Text className="mb-1 font-medium">Nueva contraseña:</Text>
              <View className="relative mb-4">
                <TextInput
                  secureTextEntry={!mostrarNuevaContrasena}
                  value={nuevaContrasena}
                  onChangeText={setNuevaContrasena}
                  placeholder="Nueva contraseña"
                  className="border border-gray-300 rounded px-3 py-3 pr-10"
                />
                <TouchableOpacity
                  onPress={() => setMostrarNuevaContrasena(!mostrarNuevaContrasena)}
                  style={{ position: "absolute", right: 10, top: 14 }}
                >
                  <Ionicons
                    name={mostrarNuevaContrasena ? "eye" : "eye-off"}
                    size={22}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {/*Confirmar contraseña*/}
              <Text className="mb-1 font-medium">Confirmar contraseña:</Text>
              <View className="relative mb-10">
                <TextInput
                  secureTextEntry={!mostrarConfirmarContrasena}
                  value={confirmarContrasena}
                  onChangeText={setConfirmarContrasena}
                  placeholder="Confirmar contraseña"
                  className="border border-gray-300 rounded px-3 py-3 pr-10"
                />
                <TouchableOpacity
                  onPress={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
                  style={{ position: "absolute", right: 10, top: 14 }}
                >
                  <Ionicons
                    name={mostrarConfirmarContrasena ? "eye" : "eye-off"}
                    size={22}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="flex-1 mr-5 bg-red-500 rounded py-2 items-center"
              onPress={() => {
                router.back();
              }}
            >
              <Text className="font-medium text-white">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 ml-2 bg-blue-500 rounded py-2 items-center"
              onPress={async () => {
                if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
                  alert("Completa todos los campos.");
                  return;
                }
              
                if (nuevaContrasena.length < 8) {
                  alert("La nueva contraseña debe tener al menos 8 caracteres.");
                  return;
                }
              
                //Obtenemos la contraseña real desde la base de datos
                const { data: usuario, error } = await supabase
                  .from("Users")
                  .select("idUser, Password")
                  .eq("Apodo", apodo)
                  .single();
              
                if (error || !usuario) {
                  alert("No se pudo verificar la contraseña actual.");
                  return;
                }
              
                //Verificamos que la contraseña actual ingresada coincida con la del pelao
                if (contrasenaActual !== usuario.Password) {
                  alert("La contraseña actual no es correcta.");
                  return;
                }
              
                //Verificar que la contraseña nueva y la confirmación coincidan
                if (nuevaContrasena !== confirmarContrasena) {
                  alert("La nueva contraseña y la confirmación no coinciden.");
                  return;
                }
              
                //Hacemos el update
                const { error: errorUpdate } = await supabase
                  .from("Users")
                  .update({ Password: nuevaContrasena })
                  .eq("idUser", usuario.idUser);
              
                if (errorUpdate) {
                  console.error("Error al actualizar la contraseña:", errorUpdate);
                  alert("Ocurrió un error al actualizar la contraseña.");
                } else {
                  alert("Contraseña actualizada correctamente.");
                  router.back();
                }
              }}
            >
              <Text className="font-medium text-white">Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
