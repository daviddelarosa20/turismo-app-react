import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";

export default function PlanBasico() {
  const navigation = useNavigation();
  const router = useRouter();
  const { title, description, direccion, imageUrl } = useLocalSearchParams();
  const imageUrls = imageUrl?.split(",") || [];

  const [rating, setRating] = useState(0); // estado para la calificación

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

  // Redes sociales simuladas
  const redes = [
    {
      nombre: "facebook",
      color: "#1877f2",
      url: "https://www.facebook.com/",
      icon: <FontAwesome name="facebook" size={24} color="#fff" />,
    },
    {
      nombre: "instagram",
      color: "#e1306c",
      url: "https://www.instagram.com/",
      icon: <FontAwesome name="instagram" size={24} color="#fff" />,
    },
    {
      nombre: "whatsapp",
      color: "#25D366",
      url: "https://wa.me/5210000000000",
      icon: <FontAwesome name="whatsapp" size={24} color="#fff" />,
    },
    {
      nombre: "web",
      color: "#4b5563",
      url: "https://tu-sitio-web.com",
      icon: <Ionicons name="globe-outline" size={24} color="#fff" />,
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }} className="bg-white p-4">
      <Text className="text-lg font-semibold mt-2">
        {title || "Nombre del plan"}
      </Text>

      {/* Estrellas interactivas */}
      <View className="flex-row items-center my-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <AntDesign
              name={i <= rating ? "star" : "staro"}
              size={20}
              color="gold"
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        ))}
        <Text className="ml-2 text-gray-500">{rating}.0</Text>
      </View>

      {/* Imagen principal o carrusel */}
      {imageUrls.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url.trim() }}
              className="w-40 h-40 mr-2 rounded-xl bg-gray-400"
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      ) : (
        <Image
          source={{
            uri: "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Dentista.jpg",
          }}
          className="w-full h-72 rounded-xl mt-2 bg-gray-400"
        />
      )}

      {/* Información del lugar */}
      <View className="w-full mt-5">
        <Text className="font-bold mb-2">Información del lugar</Text>
        <Text className="text-sm text-gray-700">
          {description || "Sin descripción disponible."}
        </Text>
      </View>

      {/* Redes sociales con íconos */}
      <Text className="font-bold mt-6 mb-2">Redes Sociales</Text>
      <View className="flex-row justify-around w-full mt-2">
        {redes.map((red, idx) => (
          <TouchableOpacity
            key={idx}
            style={{
              backgroundColor: red.color,
              borderRadius: 10,
              padding: 12,
            }}
            onPress={() => Linking.openURL(red.url)}
          >
            {red.icon}
          </TouchableOpacity>
        ))}
      </View>

      {/* Dirección */}
      <Text className="font-bold mt-6">Ubicación</Text>
      <Text className="text-sm text-gray-700">
        {direccion || "Dirección no disponible"}
      </Text>

      {/* Imagen del mapa */}
      <Text className="font-bold mt-6">Mapa</Text>
      <Image
        source={{
          uri: "https://dbdzm869oupei.cloudfront.net/img/sticker/preview/38676.png",
        }}
        className="w-full h-72 rounded-xl mt-2 bg-gray-400"
      />
    </ScrollView>
  );
}
