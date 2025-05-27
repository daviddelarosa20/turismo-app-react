import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter, useNavigation } from "expo-router";

const QuestionRow = ({ question, onPress, isExpanded }) => (
  <TouchableOpacity onPress={onPress} className="py-3">
    <View className="flex-row items-center justify-between">
      <Text className="text-lightBeige-400 text-lg flex-1">{question}</Text>
      <Icon
        name={isExpanded ? "chevron-up" : "chevron-down"}
        size={22}
        color="#9ca3af"
      />
    </View>
  </TouchableOpacity>
);

const AnswerRow = ({ answer }) => (
  <View className="rounded-md p-4 mt-2">
    <Text className="text-black">{answer}</Text>
  </View>
);

const CategoryHeader = ({ title }) => (
  <Text className="text-[#9ca3af] font-semibold mb-4 text-sm">{title}</Text>
);

export default function Helpcenter() {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Ayuda",
      headerStyle: { backgroundColor: "#1a1e22" },
      headerTintColor: "#FFF",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
        marginLeft: 10,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} className="ml-2">
          <Icon name="arrow-left" size={28} color="#FFF" />
        </TouchableOpacity>
      ),
      headerTitleAlign: "left",
    });
  }, [navigation, router]);

  const categorias = [
    {
      nombre: "Administración de la cuenta",
      preguntas: [
        {
          pregunta: "¿Cómo cerrar sesión?",
          respuesta:
            "Ve a configuración y selecciona 'Cerrar sesión' al final del menú.",
        },
        {
          pregunta: "¿Cómo puedo cambiar mi contraseña?",
          respuesta:
            "En tu perfil, selecciona 'Cambiar contraseña' y sigue las instrucciones.",
        },
      ],
    },
    {
      nombre: "Uso de la app",
      preguntas: [
        {
          pregunta: "¿Cómo navegar por la app?",
          respuesta:
            "Utiliza la barra inferior para moverte entre secciones principales.",
        },
        {
          pregunta: "¿Cómo crear un perfil?",
          respuesta:
            "En la pantalla de inicio, pulsa 'Registrarse' y llena tus datos.",
        },
        {
          pregunta: "¿Cómo hago una reservación?",
          respuesta:
            "En la sección correspondiente, elige un servicio y selecciona 'Reservar'.",
        },
      ],
    },
    {
      nombre: "Atención al cliente",
      preguntas: [
        {
          pregunta: "¿Dónde contactar soporte?",
          respuesta:
            "Puedes enviar un mensaje desde la sección 'Ayuda' o escribir al correo soporte@ejemplo.com.",
        },
        {
          pregunta: "¿Tienen chat en vivo?",
          respuesta:
            "Sí, está disponible desde el ícono de soporte en la esquina inferior derecha.",
        },
      ],
    },
    {
      nombre: "Seguridad y privacidad",
      preguntas: [
        {
          pregunta: "¿Mis datos están seguros?",
          respuesta:
            "Sí, usamos cifrado de extremo a extremo para proteger tu información.",
        },
        {
          pregunta: "¿Cómo eliminar mi cuenta?",
          respuesta:
            "Contáctanos desde soporte y procederemos a eliminarla de forma segura.",
        },
      ],
    },
    {
      nombre: "Problemas técnicos",
      preguntas: [
        {
          pregunta: "La app no abre",
          respuesta: "Intenta actualizar la app o reiniciar tu dispositivo.",
        },
        {
          pregunta: "No se cargan los datos",
          respuesta: "Revisa tu conexión a internet o vuelve a iniciar sesión.",
        },
      ],
    },
  ];

  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categorias
    .map((cat) => ({
      ...cat,
      preguntas: cat.preguntas.filter((q) =>
        q.pregunta.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.preguntas.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-[#1a1e22]">
      <StatusBar barStyle="light-content" backgroundColor="#1a1e22" />

      <View className="px-6 py-3 flex-1">
        <TextInput
          placeholder="Buscar preguntas..."
          placeholderTextColor="#6b7280"
          className="bg-[#FFF] rounded-xl p-4 mb-6 text-lightBeige-400"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredCategories.map((category, index) => (
            <View key={index} className="mb-6">
              <CategoryHeader title={category.nombre} />
              <View className="bg-[#fff] rounded-xl p-4">
                {category.preguntas.map((preguntaItem, qIndex) => (
                  <View key={qIndex}>
                    <QuestionRow
                      question={preguntaItem.pregunta}
                      onPress={() =>
                        setExpandedQuestion(
                          expandedQuestion === preguntaItem.pregunta
                            ? null
                            : preguntaItem.pregunta,
                        )
                      }
                      isExpanded={expandedQuestion === preguntaItem.pregunta}
                    />
                    {expandedQuestion === preguntaItem.pregunta && (
                      <AnswerRow answer={preguntaItem.respuesta} />
                    )}
                    {qIndex < category.preguntas.length - 1 && (
                      <View className="border-b border-[#3a3f44] my-2" />
                    )}
                  </View>
                ))}
                {category.preguntas.length === 0 && searchQuery !== "" && (
                  <Text className="text-gray-500 mt-2 text-center">
                    No se encontraron preguntas en esta categoría.
                  </Text>
                )}
              </View>
            </View>
          ))}

          {filteredCategories.length === 0 && searchQuery !== "" && (
            <Text className="text-gray-500 mt-10 text-center">
              No se encontraron preguntas con "{searchQuery}".
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
