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
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
      headerRight: () => (
        <View className="items-center justify-center mr-3 rounded-full bg-slate-100 p-2">
          <TouchableOpacity onPress={() => alert("Perfil")}>
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

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
  }, []);
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
  }, []);

  const staticImages = [
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Teatro.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//RecP.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Obra.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//EmptyT.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Image.jpg",
  ];
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="w-full h-full mb-12">
          <View className="flex-1 items-center justify-center mt-10 mb-14">
            <Text className="text-3xl font-bold mb-2">{title}</Text>
            <View className="flex-row items-center justify-center mb-5">
              {valoracion?.Valoracion && (
                <StarRating rating={valoracion.Valoracion} />
              )}
              <Text className="text-xl font-bold ml-2 color-slate-500">
                {valoracion?.Valoracion}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="w-full mb-1"
            >
              {staticImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  className="w-80 h-72 rounded-xl mx-2 bg-gray-400"
                />
              ))}
            </ScrollView>
            <Text className="text-xl text-start font-bold">
              Información del lugar
            </Text>
            <Text className="text-lg font-normal text-start">
              {description}
            </Text>
            <View className="flex-row justify-around mt-6 gap-12">
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
            <Text className="text-lg font-bold mt-7">Ubicación</Text>
            <Text className="text-lg font-normal mb-1 mr-30 mt-2">
              {direccion}
            </Text>
            <View className="w-full h-60 mt-0 mb-1 px-4">
              <TouchableOpacity
                onPress={() => {
                  const query = encodeURIComponent(
                    `${empresa?.Calle} ${empresa?.NumExt}, ${empresa?.Colonia}, ${empresa?.Ciudad}`,
                  );
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${query}`,
                  );
                }}
                className="w-full h-60 mt-0 mb-5"
              >
                <ImageBackground
                  source={{
                    uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
                  }}
                  className="w-full h-60 mt-10 mb-5 border rounded-xl"
                ></ImageBackground>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                className="mt-20 bg-green-200 px-8 py-3 rounded-full"
                onPress={() => {
                  router.push({
                    pathname: "/planes/Evento",
                    params: {
                      title: title,
                    },
                  });
                }}
              >
                <Text className="font-semibold text-black">
                  Ver próximos eventos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
