import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export const options = {
  headerShown: false,
}

export default function Helpcenter() {
  const categorias = [
    {
      nombre: "Administración de la cuenta",
      preguntas: ["¿Cómo cerrar sesión?", "¿Cómo puedo cambiar mi contraseña?"],
    },
    {
      nombre: "Uso de la app",
      preguntas: [
        "¿Cómo navegar por la app?",
        "¿Cómo crear un perfil?",
        "¿Cómo hago una reservación?",
      ],
    },
    {
      nombre: "Atención al cliente",
      preguntas: ["¿Dónde contactar soporte?", "¿Tienen chat en vivo?"],
    },
    {
      nombre: "Seguridad y privacidad",
      preguntas: ["¿Mis datos están seguros?", "¿Cómo eliminar mi cuenta?"],
    },
    {
      nombre: "Problemas técnicos",
      preguntas: ["La app no abre", "No se cargan los datos"],
    },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header personalizado */}
      <View className="bg-[#e1dcd0] py-4 items-center justify-center">
        <Text className="text-lg font-semibold text-black">Servicio de ayuda</Text>
      </View>

      {/* Buscador */}
      <View className="flex-row items-center m-4 bg-purple-100 p-3 rounded-xl">
        <Text className="text-gray-500 mr-2">🔍</Text>
        <TextInput
          placeholder="Buscar pregunta..."
          placeholderTextColor="#666"
          className="flex-1 text-black text-base"
        />
      </View>

      {/* Contenido principal dividido */}
      <View className="flex-row flex-1 px-4">
        {/* Categorías */}
        <ScrollView className="w-1/2 pr-3 border-r border-gray-300">
          {categorias.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCategoriaSeleccionada(cat);
                setPreguntaSeleccionada(null);
              }}
              className={`py-3 ${categoriaSeleccionada.nombre === cat.nombre ? "bg-gray-100 rounded" : ""}`}
            >
              <Text className="text-base text-black">{cat.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Preguntas y respuestas */}
        <View className="w-1/2 pl-3">
          <ScrollView>
            {categoriaSeleccionada.preguntas.map((pregunta, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setPreguntaSeleccionada(pregunta)}
                className="py-2"
              >
                <Text className="text-base text-black">{pregunta}</Text>
              </TouchableOpacity>
            ))}

            {/* Respuesta */}
            {preguntaSeleccionada && (
              <View className="mt-6 p-3 bg-slate-100 rounded-lg">
                <Text className="text-sm font-semibold text-gray-700 mb-1">
                  Respuesta:
                </Text>
                <Text className="text-base text-black">
                  Aquí iría la respuesta de: {preguntaSeleccionada}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}