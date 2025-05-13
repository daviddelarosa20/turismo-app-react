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
import Calendario from "../../components/Calendario";
import Asientos from "../../components/Asientos";
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
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

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
              style={{ width: 400, height: 400, borderRadius: 30 }}
            />
            <Text className="text-xl font-bold mt-3 mr-64">
              Información del lugar
            </Text>
            <Text className="text-xl font-normal mb-2 mr-64">
              {description}
            </Text>
            <Text className="text-lg font-normal mb-2 mr-30">{direccion}</Text>
            <View className="w-full h-60 mt-2">
              <View className="w-full h-60 mt-24 mb-40">
                <GoogleMap />
              </View>
            </View>
            <View className="w-full mt-48 mb-2">
              <Text className="text-xl font-bold mb-2 ml-5">
                Selecciona fecha
              </Text>
              <View className="mt-3 w-full items-center justify-center gap-3">
                <Calendario
                  onFechaSeleccionada={(fecha) => {
                    setFechaSeleccionada(fecha);
                    console.log(fecha);
                  }}
                />
                <TouchableOpacity
                  onPress={() => router.push("/components/Asientos")}
                  className="bg-purple-400 px-8 py-3 rounded-full mb-10"
                >
                  <Text className="font-semibold text-black">
                    Seleccionar asientos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
