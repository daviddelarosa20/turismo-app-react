import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";

export default function Perfil() {
  const router = useRouter();
  const navigation = useNavigation();
  const { idUser } = useLocalSearchParams();

  const userId = Number(idUser);

  const [nickname, setNickname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Mi perfil",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useEffect(() => {
    async function obtenerDatosUsuario() {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("idUser, Nombre, Apellido, Email, Telefono, Apodo")
        .eq("idUser", userId)
        .single();

      if (error) {
        console.error("Error al obtener datos:", error.message);
        alert("Error", "No se pudieron cargar los datos del usuario.");
      } else if (data) {
        setNickname(data.Apodo);
        setFirstName(data.Nombre);
        setLastName(data.Apellido);
        setEmail(data.Email);
        setPhone(data.Telefono);
      }
    }

    if (userId) obtenerDatosUsuario();
  }, [userId]);

  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      <ScrollView className="flex-1 p-6 pt-2">
        <View className="items-center mt-4 mb-8">
          <View className="bg-gray-700 rounded-full p-4">
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              className="w-36 h-36 rounded-full"
            />
          </View>

          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Apodo de usuario"
            placeholderTextColor="#a0a0a0"
            className="mt-4 w-48 border-b border-gray-600 text-center text-xl font-bold text-veryLightBeige-500"
          />
        </View>

        <View className="w-full items-start mb-6">
          <Text className="font-bold mb-2 text-left text-veryLightBeige-500 text-xl">
            Información Personal
          </Text>

          <Text className="mb-1 font-medium text-lightBeige-400">Nombre:</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="ej. Jonathan"
            placeholderTextColor="#a0a0a0"
            className="border border-gray-600 rounded px-3 py-3 mb-4 w-full text-lightBeige-400 bg-gray-200"
          />

          <Text className="mb-1 font-medium text-lightBeige-400">
            Apellido:
          </Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="ej. Hernández"
            placeholderTextColor="#a0a0a0"
            className="border border-gray-600 rounded px-3 py-3 mb-4 w-full text-lightBeige-400 bg-gray-200"
          />

          <Text className="mb-1 font-medium text-lightBeige-400">
            Correo electrónico:
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="ej. correo@dominio.com"
            placeholderTextColor="#a0a0a0"
            keyboardType="email-address"
            className="border border-gray-600 rounded px-3 py-3 mb-4 w-full text-lightBeige-400 bg-gray-200"
          />

          <Text className="mb-1 font-medium text-lightBeige-400">
            Teléfono móvil:
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="ej. +52 1234567890"
            placeholderTextColor="#a0a0a0"
            keyboardType="phone-pad"
            className="border border-gray-600 rounded px-3 py-3 mb-8 w-full text-lightBeige-400 bg-gray-200"
          />

          <TouchableOpacity
            className="bg-blue-600 px-[75px] py-3 rounded mb-3 self-center"
            onPress={() =>
              router.push({
                pathname: "/extras/CambioContrasena",
                params: { idUser: String(userId) },
              })
            }
          >
            <Text className="font-bold text-white text-base">
              Modificar contraseña
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-1 bg-green-600 px-[88px] py-3 rounded mb-3 self-center"
            onPress={async () => {
              if (!nickname || !firstName || !lastName || !email) {
                alert("Apodo, nombre, apellido y correo son obligatorios.");
                return;
              }

              const { data: apodoRepetido } = await supabase
                .from("Usuarios")
                .select("idUser")
                .eq("Apodo", nickname)
                .neq("idUser", userId)
                .maybeSingle();

              if (apodoRepetido) {
                alert("Ese apodo ya está en uso por otro usuario.");
                return;
              }

              const { data: emailRepetido } = await supabase
                .from("Usuarios")
                .select("idUser")
                .eq("Email", email)
                .neq("idUser", userId)
                .maybeSingle();

              if (emailRepetido) {
                alert("Ese correo ya está registrado por otro usuario.");
                return;
              }

              const { error: errorUpdate } = await supabase
                .from("Usuarios")
                .update({
                  Apodo: nickname,
                  Nombre: firstName,
                  Apellido: lastName,
                  Email: email,
                  Telefono: phone || null,
                })
                .eq("idUser", userId);

              if (errorUpdate) {
                alert("Error al guardar cambios.");
                console.error(errorUpdate);
              } else {
                alert("Cambios guardados exitosamente.");
              }
            }}
          >
            <Text className="font-bold text-white text-base">
              Guardar cambios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-1 bg-red-600 px-[101px] py-3 rounded self-center mb-10"
            onPress={() => {
              router.replace("/login/login");
            }}
          >
            <Text className="text-white font-bold text-base">
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
