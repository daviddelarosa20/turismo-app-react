import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useLocalSearchParams } from "expo-router";
import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { ImageBackground } from "react-native";
import StarRating from "../../components/StarRating"; // Importa StarRating

export default function PlanReserva() {
  const navigation = useNavigation();
  const { title } = useLocalSearchParams();
  const router = useRouter();

  const [empresa, setEmpresa] = useState(null);
  const [valoracion, setValoracion] = useState(null);

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

  useEffect(() => {
    async function fetchValoracion() {
      const { data, error } = await supabase
        .from("Empresas")
        .select("Valoracion")
        .eq("Nombre", title)
        .single();

      if (error) console.error("Error al obtener valoración:", error);
      else setValoracion(data);
    }

    fetchValoracion();
  }, [title]);

  const staticImages = [
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Restaurante.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestauranteComida.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestaurantePersonas.png",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestaurantePersonas2.png",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestauranteComida2.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestauranteComida3.jpg",
  ];

  return (
    <ScrollView
      className="flex-1 bg-darkBlue-900 p-6"
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text className="text-3xl font-bold text-veryLightBeige-500 mb-2 text-center mt-2">
        {empresa?.Nombre}
      </Text>

      {/* Estrellas y rating */}
      <View className="flex-row items-center mb-4">
        {valoracion?.Valoracion && (
          <StarRating
            rating={valoracion.Valoracion}
            starSize={20}
            starColor="#D8C4B6"
          />
        )}
        <Text className="text-xl font-bold ml-2 text-lightBeige-400">
          {valoracion?.Valoracion}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full mb-6"
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {staticImages.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            className="w-80 h-52 rounded-xl mr-4 bg-gray-700"
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Info del lugar */}
      <View className="w-full items-start mb-6">
        <Text className="text-xl font-bold text-veryLightBeige-500 mb-2 text-left">
          Información del lugar:
        </Text>
        <Text className="text-lg font-normal text-lightBeige-400 leading-6 text-left">
          {empresa?.Descripcion}
        </Text>
      </View>

      <View className="flex-row justify-around mt-4 mb-8 w-4/5">
        {[
          "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
          "https://img.icons8.com/ios_filled/512/twitterx.png",
          "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
          "https://static.vecteezy.com/system/resources/previews/016/716/450/non_2x/tiktok-icon-free-png.png",
        ].map((uri, idx) => (
          <Image key={idx} source={{ uri }} className="w-8 h-8 rounded-md" />
        ))}
      </View>

      <View className="w-full items-start mb-8">
        <Text className="font-bold text-veryLightBeige-500 text-xl mb-2 text-left">
          Ubicación
        </Text>
        <Text className="text-lightBeige-400 text-center mt-2 text-lg font-normal">
          {empresa
            ? `${empresa.Calle} ${empresa.NumExt}${empresa.NumInt ? ", Int. " + empresa.NumInt : ""}, ${empresa.Colonia}, ${empresa.CodigoPost}, ${empresa.Ciudad}`
            : "Dirección no disponible"}
        </Text>

        <TouchableOpacity
          className="w-full h-48 rounded-xl mt-4 overflow-hidden"
          onPress={() => {
            const query = encodeURIComponent(
              `${empresa?.Calle} ${empresa?.NumExt}, ${empresa?.Colonia}, ${empresa?.Ciudad}`,
            );
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${query}`,
            );
          }}
        >
          <ImageBackground
            source={{
              uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
            }}
            className="w-full h-full opacity-80"
            imageStyle={{ borderRadius: 16 }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-10 bg-green-300 px-8 py-3 rounded-full mb-10"
        onPress={() => {
          router.push({
            pathname: "/planes/Reserva",
            params: { title: empresa.Nombre },
          });
        }}
      >
        <Text className="font-semibold text-darkBlue-900 text-lg">
          Reservar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
