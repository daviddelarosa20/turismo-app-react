import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ImageBackground,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/supabase";

export default function PlanBasico() {
  const navigation = useNavigation();
  const router = useRouter();
  const { title } = useLocalSearchParams();

  const [empresa, setEmpresa] = useState(null);
  const [rating, setRating] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Detalle",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
    });
  }, [navigation, title]);

  useEffect(() => {
    async function fetchEmpresa() {
      const { data, error } = await supabase
        .from("Empresas")
        .select("*")
        .eq("Nombre", title)
        .single();

      if (error) console.error("Error al obtener empresa:", error);
      else setEmpresa(data);
    }

    fetchEmpresa();
  }, [title]);

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

  const staticImageUrls = [
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//logo.png",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//pasteleria1.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//pastel.jpeg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Pasteleria.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Postre1.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//PostreFresa.jpeg",
  ];

  const hacerLlamada = () => {
    if (empresa?.Telefono) {
      Linking.openURL(`tel:${empresa.Telefono}`);
    } else {
      alert("Número de teléfono no disponible.");
    }
  };

  return (
    <View className="flex-1 bg-darkBlue-900">
      <ScrollView className="flex-1 p-6 pt-2">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-veryLightBeige-500 mb-2 text-center">
            {empresa?.Nombre || "Nombre de la empresa"}
          </Text>
          <View className="flex-row items-center mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (rating !== 0 && rating !== i) {
                    Alert.alert(
                      "Cambiar calificación",
                      "Ya seleccionaste una calificación. ¿Deseas cambiarla?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Sí",
                          onPress: () => setRating(i),
                        },
                      ],
                      { cancelable: true },
                    );
                  } else if (rating === 0) {
                    setRating(i);
                  }
                }}
              >
                <AntDesign
                  name={i <= rating ? "star" : "staro"}
                  size={24}
                  color="#facc15"
                  className="mx-1"
                />
              </TouchableOpacity>
            ))}
            <Text className="ml-2 text-lightBeige-400 text-xl font-bold">
              {rating}.0
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="w-full mb-6"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {staticImageUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              className="w-80 h-52 rounded-xl mr-4 bg-gray-700"
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View className="w-full items-start mb-6">
          <Text className="font-bold mb-2 text-left text-veryLightBeige-500 text-xl">
            Información del lugar
          </Text>
          <Text className="text-lightBeige-400 text-left leading-6 text-lg font-normal">
            {empresa?.Descripcion || "Sin descripción disponible."}
          </Text>
        </View>

        <Text className="font-bold mt-6 mb-2 text-center text-veryLightBeige-500 text-xl">
          Redes sociales
        </Text>
        <View className="flex-row justify-around w-full mb-8">
          {redes.map((red, idx) => (
            <TouchableOpacity
              key={idx}
              className="rounded-md p-3"
              style={{ backgroundColor: red.color }}
              onPress={() => Linking.openURL(red.url)}
            >
              {red.icon}
            </TouchableOpacity>
          ))}
        </View>

        <View className="w-full items-start mb-8">
          <Text className="font-bold mt-6 mb-2 text-center text-veryLightBeige-500 text-xl">
            Ubicación
          </Text>
          <Text className="text-lightBeige-400 text-center mt-2 text-lg font-normal">
            {empresa
              ? `${empresa.Calle} ${empresa.NumExt}${empresa.NumInt ? ", Int. " + empresa.NumInt : ""}, ${empresa.Colonia}, ${empresa.CodigoPost}, ${empresa.Ciudad}`
              : "Dirección no disponible"}
          </Text>

          <TouchableOpacity
            onPress={() => {
              const query = encodeURIComponent(
                `${empresa?.Calle} ${empresa?.NumExt}, ${empresa?.Colonia}, ${empresa?.Ciudad}`,
              );
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${query}`,
              );
            }}
            className="w-full mt-4 rounded-xl overflow-hidden h-48"
          >
            <ImageBackground
              source={{
                uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
              }}
              className="w-full h-full opacity-80"
            />
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity
        className="absolute right-5 bottom-5 bg-green-400 rounded-full p-4 shadow-md elevation-5"
        onPress={hacerLlamada}
      >
        <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
