import { useRouter } from "expo-router";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ReportarBug() {
  const navigation = useNavigation();
  const router = useRouter();

  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reportar un Bug",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="ml-3 p-2 rounded-full bg-slate-800"
        >
          <Ionicons name="arrow-back" size={24} color="#F5EFE7" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleSubmitBug = () => {
    if (!bugTitle.trim() || !bugDescription.trim()) {
      Alert.alert(
        "Error",
        "Por favor, completa el título y la descripción del bug.",
      );
      return;
    }

    Alert.alert(
      "Reporte Enviado",
      "¡Gracias por ayudarnos a mejorar! Hemos recibido tu reporte y lo revisaremos.",
      [
        {
          text: "OK",
          onPress: () => {
            router.push("/Settings");
          },
        },
      ],
    );

    setBugTitle("");
    setBugDescription("");
  };

  return (
    <View className="flex-1 bg-darkBlue-900 p-4">
      <ScrollView className="flex-1">
        <View className="bg-slate-50 p-6 rounded-lg mb-4 shadow-md">
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons
              name="bug-outline"
              size={28}
              color="#EF4444"
              className="mr-3"
            />
            <Text className="text-xl font-bold text-gray-800">
              Detalles del Bug
            </Text>
          </View>

          <Text className="text-gray-700 text-base mb-2">Título del bug:</Text>
          <TextInput
            className="border border-gray-300 p-3 rounded-md text-base text-gray-800 mb-4 bg-white"
            placeholder="Introduce un título breve y descriptivo."
            placeholderTextColor="#6B7280"
            value={bugTitle}
            onChangeText={setBugTitle}
            maxLength={100}
          />

          <Text className="text-gray-700 text-base mb-2">Describe el bug:</Text>
          <TextInput
            className="border border-gray-300 p-3 rounded-md text-base text-gray-800 mb-4 h-32 text-top bg-white"
            placeholder="Describe los pasos para reproducirlo, qué esperabas y qué pasó."
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={4}
            value={bugDescription}
            onChangeText={setBugDescription}
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleSubmitBug}
            className="bg-red-600 p-4 rounded-md items-center mt-4"
          >
            <Text className="text-white text-lg font-bold">Enviar reporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
