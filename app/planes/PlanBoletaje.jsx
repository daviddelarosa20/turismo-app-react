import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Linking,
} from "react-native";

import { useNavigation } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import StarRating from "../../components/StarRating";
import { supabase } from "../../supabase/supabase";
import { useRouter } from "expo-router";

export default function PlanBoletaje() {
  const navigation = useNavigation();
  const router = useRouter();
  const { title, description, direccion, imageUrl } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Detalle",
      headerStyle: { backgroundColor: "#282d33" },
      headerTitleAlign: "center",
      headerTintColor: "#F5EFE7",
    });
  }, [navigation, title]);

  const [valoracion, setValoracion] = useState(null);
  const [empresa, setEmpresa] = useState(null);

  const getempresa = async () => {
    let { data: Empresa, error } = await supabase
      .from("Empresas")
      .select("*")
      .eq("Nombre", title)
      .single();
    if (error) {
      console.log(error);
    } else {
      setEmpresa(Empresa);
    }
  };
  useEffect(() => {
    getempresa();
  }, [title]);

  const getvaloracion = async () => {
    let { data: Valoracion, error } = await supabase
      .from("Empresas")
      .select("Valoracion")
      .eq("Nombre", title)
      .single();
    if (error) {
      console.log(error);
    } else {
      setValoracion(Valoracion);
    }
  };
  useEffect(() => {
    getvaloracion();
  }, [title]);

  const staticImages = [
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Teatro.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//RecP.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Obra.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//EmptyT.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Image.jpg",
  ];
  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      {/* Fondo oscuro */}
      <ScrollView className="flex-1">
        <View className="p-4 pt-2 items-center">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-veryLightBeige-500 mb-2">
              {title}
            </Text>
            {/* Texto claro */}
            <View className="flex-row items-center mb-4">
              {valoracion?.Valoracion && (
                <StarRating
                  rating={valoracion.Valoracion}
                  starSize={20}
                  starColor="#D8C4B6"
                />
              )}
              <Text className="text-xl font-bold ml-2 text-lightBeige-400">
                {/* Texto beige */}
                {valoracion?.Valoracion}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full mb-6"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {staticImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                className="w-80 h-52 rounded-xl mr-4 bg-gray-700"
              />
            ))}
          </ScrollView>
          <View className="w-full items-start mb-6">
            <Text className="text-xl font-bold text-veryLightBeige-500 mb-2">
              Información del lugar
            </Text>
            <Text className="text-lg font-normal text-lightBeige-400">
              {description}
            </Text>
          </View>
          <View className="flex-row justify-around mt-4 mb-8 w-4/5">
            {[
              "https://cdn-icons-png.flaticon.com/512/1384/1384063.png",
              "https://img.icons8.com/ios_filled/512/twitterx.png",
              "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
              "https://static.vecteezy.com/system/resources/previews/016/716/450/non_2x/tiktok-icon-free-png.png",
            ].map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                className="w-8 h-8 rounded-md"
              />
            ))}
          </View>
          <View className="w-full items-start mb-8">
            <Text className="text-lg font-bold text-veryLightBeige-500 mb-2">
              Ubicación
            </Text>
            <Text className="text-lg font-normal text-lightBeige-400 mb-3">
              {direccion}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const query = encodeURIComponent(
                  `${empresa?.Calle} ${empresa?.NumExt}, ${empresa?.Colonia}, ${empresa?.Ciudad}`,
                );
                Linking.openURL(`http://google.com/maps/place/${query}`);
              }}
              className="w-full h-48 rounded-xl overflow-hidden"
            >
              <ImageBackground
                source={{
                  uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
                }}
                className="w-full h-full"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="mt-10 bg-green-300 px-8 py-3 rounded-full"
            onPress={() => {
              router.push({
                pathname: "/planes/Evento",
                params: {
                  title: title,
                },
              });
            }}
          >
            <Text className="font-semibold text-darkBlue-900">
              Ver próximos eventos
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
