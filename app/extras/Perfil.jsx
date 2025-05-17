import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Perfil() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [theme, setTheme] = useState("light");

  const handleThemeToggle = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
    // Este sigo viendo q onda, pero estaba haciendo pruebas :D
  };

  return (
    <SafeAreaView className={`flex-1 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
      <ScrollView className="flex-1 px-4">
        <View className="items-center mt-4 relative">
          {/*El avatar del pelado y el botón de editar (aun sin jalar)*/}
          <View className="bg-gray-200 rounded-full p-4">
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              className="w-24 h-24 rounded-full"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-gray-300 p-2 rounded-full">
              <Feather name="edit-2" size={16} color="black" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-lg font-semibold">Apodo de usuario</Text>
          <TouchableOpacity
            className="absolute top-2 right-2 bg-gray-300 p-2 rounded-full"
            onPress={handleThemeToggle}
          >
            {theme === "light" ? (
              <Feather name="moon" size={20} color="black" />
            ) : (
              <Feather name="sun" size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Text className="mb-1 font-medium">Nombre</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Nombre"
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <Text className="mb-1 font-medium">Apellido</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Apellido"
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <Text className="mb-1 font-medium">Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            className="border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <Text className="mb-1 font-medium">Teléfono móvil</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Teléfono móvil"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded px-3 py-2 mb-6"
          />

          <TouchableOpacity
            onPress={() => router.push("/extras/CambioContrasena")}
            className="bg-gray-200 py-3 rounded mb-4 items-center"
          >
            <Text className="font-medium">Modificar contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // Todo para validar y enviar formulario Solo hay q esperar a Christian :D
            }}
            className="bg-red-500 py-3 rounded items-center"
          >
            <Text className="text-white font-medium">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
