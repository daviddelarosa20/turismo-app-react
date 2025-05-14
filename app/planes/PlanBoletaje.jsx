import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";

import { useNavigation } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import StarRating from "../../components/StarRating";
import { supabase } from "../../supabase/supabase";
import GoogleMap from "../../components/GoogleMap";
import { useRouter } from "expo-router";

export default function PlanBoletaje() {
  const navigation = useNavigation();
  const router = useRouter();

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
  const { title, description, direccion, imageUrl } = useLocalSearchParams();

  const [valoracion, setValoracion] = useState(null);

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
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="w-full h-full mb-12">
          <View className="flex-1 items-center justify-center mt-10 mb-44">
            <Text className="text-3xl font-bold mb-2">{title}</Text>
            <View className="flex-row items-center justify-center mb-2">
              {valoracion?.Valoracion && (
                <StarRating rating={valoracion.Valoracion} />
              )}
              <Text className="text-xl font-bold ml-2 color-slate-500">
                {valoracion?.Valoracion}
              </Text>
            </View>
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-72 rounded-xl mt-2 bg-gray-400"
            />
            <Text className="text-xl font-bold mt-3 mr-64">
              Información del lugar
            </Text>
            <Text className="text-xl font-normal mb-2 mr-64">
              {description}
            </Text>
            <Text className="text-lg font-normal mb-2 mr-30">{direccion}</Text>
            <View className="w-full h-60 mt-2">
              <View className="w-full h-60 mt-28 mb-5">
                <GoogleMap />
              </View>
            </View>
            <View>
              <TouchableOpacity
                className="mt-60 bg-green-200 px-8 py-3 rounded-full mb-5"
                onPress={() => {
                  router.push("/planes/Evento");
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
