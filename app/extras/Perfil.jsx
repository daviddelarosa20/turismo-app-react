import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, TextInput, TouchableOpacity, Image, Text } from "react-native";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";

export default function Perfil() {
  const router = useRouter();
  const navigation = useNavigation();
  const { idUser } = useLocalSearchParams();
  
  const userId = Number(idUser); // Para volverlo un numero y no un string

  const [nickname, setNickname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Perfil",
      headerStyle: { backgroundColor: "#e1dcd0" },
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="items-center mt-4">
          <View className="bg-gray-200 rounded-full p-4">
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              className="w-36 h-36 rounded-full"
            />
          </View>

          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Apodo de usuario"
            className="mt-2 w-48 border-b border-gray-300 text-center text-lg font-semibold"
          />

          <View className="mt-6">
            <Text className="mb-1 font-medium">Nombre:</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="ej. Jonathan"
              className="border border-gray-300 rounded px-3 py-3 mb-4 w-96 self-center"
            />

            <Text className="mb-1 font-medium">Apellido:</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="ej. Hernández"
              className="border border-gray-300 rounded px-3 py-3 mb-4 w-96 self-center"
            />

            <Text className="mb-1 font-medium">Correo electrónico:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="ej. correo@dominio.com"
              keyboardType="email-address"
              className="border border-gray-300 rounded px-3 py-3 mb-4 w-96 self-center"
            />

            <Text className="mb-1 font-medium">Teléfono móvil:</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="ej. +52 1234567890"
              keyboardType="phone-pad"
              className="border border-gray-300 rounded px-3 py-3 mb-8 w-96 self-center"
            />

            <TouchableOpacity
              className="bg-blue-500 px-[75px] py-2 rounded mb-3 self-center"
              onPress={() =>
                router.push({
                  pathname: "/extras/CambioContrasena",
                  params: { idUser: String(userId) }, // ✅ Lo pasamos como string
                })
              }
            >
              <Text className="font-medium text-white text-sm">Modificar contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-1 bg-green-500 px-[88px] py-2 rounded mb-3 self-center"
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
              <Text className="font-medium text-white text-sm">Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-1 bg-red-500 px-[101px] py-2 rounded self-center mb-10"
              onPress={() => {
                router.replace("/login/login");
              }}
            >
              <Text className="text-white font-medium">Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
