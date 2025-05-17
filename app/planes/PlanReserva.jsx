import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,

  Image,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

export default function PlanReserva() {
  const navigation = useNavigation();
  const { title, description, direccion } = useLocalSearchParams();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Detalle",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
      headerRight: () => (
        <View className="mr-3 p-2 rounded-full bg-gray-100">
          <TouchableOpacity onPress={() => alert("Perfil")}>
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }} className="bg-white p-4">
      <Text className="text-lg font-semibold mt-2">
        {title || "Nombre de la empresa"}
      </Text>

      {/* Estrellas y rating */}
      <View className="flex-row items-center my-2">
        {[...Array(5)].map((_, index) => (
          <AntDesign key={index} name="star" size={16} color="gold" />
        ))}
        <Text className="ml-2 text-gray-500">5.0</Text>
      </View>

    
      <Image
        source={{
          uri: "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Dentista.jpg",
        }}
        className="w-full h-72 rounded-xl mt-2 bg-gray-400"
      />

      {/* Info del lugar */}
      <View className="w-full mt-5">
        <Text className="font-bold mb-2">Información del lugar</Text>
        <Text className="text-sm text-gray-700">
          {description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel."}
        </Text>

        <View className="flex-row justify-around mt-4">
          {["#444", "#999", "#444", "#ccc"].map((color, idx) => (
            <View
              key={idx}
              style={{ backgroundColor: color }}
              className="w-8 h-8 rounded"
            />
          ))}
        </View>
      </View>

     
      <Text className="font-bold mt-6">Ubicación</Text>
      <Text className="text-sm text-gray-700">
        {direccion || "Dirección no disponible"}
      </Text>

      {/* Imagen del mapa ya luego ira el mapa real no feik */}
      <Text className="font-bold mt-6">Mapa</Text>
      <Image
        source={{
          uri: "https://dbdzm869oupei.cloudfront.net/img/sticker/preview/38676.png",
        }}
        className="w-full h-72 rounded-xl mt-2 bg-gray-400"
      />


      <TouchableOpacity
        className="mt-6 bg-green-200 px-8 py-3 rounded-full mb-10"
        onPress={() => {
          router.push("/planes/Reserva");
        }}
      >
        <Text className="font-semibold text-black">Reservar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

