import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
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
import * as Linking from "expo-linking";
import { ImageBackground } from "react-native";


export default function PlanReserva() {
  const navigation = useNavigation();
  const { title } = useLocalSearchParams();
  const router = useRouter();

  const [empresa, setEmpresa] = useState(null);

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

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }} className="bg-white p-4">
      <Text className="text-lg font-semibold mt-1">
        {empresa?.Nombre }
      </Text>

      {/* Estrellas y rating */}
      <View className="flex-row items-center my-2">
        {[...Array(5)].map((_, index) => (
          <AntDesign key={index} name="star" size={16} color="gold" />
        ))}
        <Text className="ml-2 text-gray-500">{empresa?.Valoracion}</Text>
      </View>

      <View style={{ width: "100%", height: 250, marginTop: 10}}>
    <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingLeft: 8 }}
  >
    {[
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Restaurante.jpg",
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestauranteComida.jpg",
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestaurantePersonas.png",
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestaurantePersonas2.png",
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestauranteComida2.jpg",
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/RestauranteComida3.jpg",
    ].map((uri, index) => (
      <Image
        key={index}
        source={{ uri }}
        style={{
          width: 300,
          height: 250,
          borderRadius: 16,
          backgroundColor: "#ccc",
          marginRight: 10,
        }}
      />
    ))}
  </ScrollView>
</View>


      {/* Info del lugar */}
      <View className="w-full mt-6">
        <Text className="font-bold mb-2">Información del lugar:</Text>
        <Text className="text-sm text-gray-700">
          {empresa?.Descripcion }
        </Text>

        <View className="flex-row justify-around mt-6">
          {[
            "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
            "https://img.icons8.com/ios_filled/512/twitterx.png",
            "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
            "https://static.vecteezy.com/system/resources/previews/016/716/450/non_2x/tiktok-icon-free-png.png",
          ].map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{ width: 32, height: 32, borderRadius: 4 }}
            />
          ))}
        </View>
      </View>

      <Text className="font-bold mt-7">Ubicación</Text>
      <Text className="text-sm text-gray-700 text-center mt-4">
        {empresa
          ? `${empresa.Calle} ${empresa.NumExt}${empresa.NumInt ? ", Int. " + empresa.NumInt : ""}, ${empresa.Colonia}, ${empresa.CodigoPost}, ${empresa.Ciudad}`
          : "Dirección no disponible"}

      </Text>

       <TouchableOpacity
  style={{ width: '100%', height: 300, borderRadius: 16, marginTop: 15 }}
  onPress={() => {
    const query = encodeURIComponent(
      `${empresa.Calle} ${empresa.NumExt}, ${empresa.Colonia}, ${empresa.Ciudad}`
    );
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  }}
>
  <ImageBackground
    source={{
      uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
    }}
    style={{
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
    }}
    imageStyle={{ borderRadius: 16 }}
  />
</TouchableOpacity>



      <TouchableOpacity
        className="mt-6 bg-green-200 px-8 py-3 rounded-full mb-10"
        onPress={() => {
          router.push({
            pathname: "/planes/Reserva",
            params: { title: empresa.Nombre },
          });
        }}
      >
        <Text className="font-semibold text-black">Reservar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
} 