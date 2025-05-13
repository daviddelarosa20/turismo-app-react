import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Home() {
  const imagenesEmpresas = {
    "Denta Stick":
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Dentista.jpg",
    "SweetCake House":
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Postres.jpg",
    "Teatro Ricardo Castro":
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Teatro.jpg",
  };
  const [categorias, setCategorias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const router = useRouter();

  const getCategorias = async () => {
    let { data: Categorias, error } = await supabase
      .from("Categorias")
      .select("Nombre")
      .limit(3)
      .order("Nombre", { ascending: true });
    if (error) {
      console.log(error);
    } else {
      setCategorias(Categorias);
    }
  };

  const getEmpresas = async () => {
    let { data: Empresas, error } = await supabase.from("Empresas").select(`
            Nombre,
            Descripcion,
            Portada,
            RutaDestino,
            Calle,
            NumExt,
            Colonia,
            CodigoPost
        `);
    if (error) {
      console.log(error);
    } else {
      setEmpresas(Empresas);
    }
  };

  useEffect(() => {
    getCategorias();
  }, []);

  useEffect(() => {
    getEmpresas();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        {/* Sección de categorías */}
        <View className="mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">Categorías</Text>
            <TouchableOpacity onPress={() => router.push("/Search")}>
              <Text className="text-blue-500">Ver más {">"}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-4"
          >
            {categorias.map((categoria, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-lg shadow-md mr-4 p-3 w-32 items-center justify-center"
                onPress={() =>
                  alert("Estas viendo la categoria " + categoria.Nombre)
                }
              >
                {/*Imagen de las categorias*/}
                <View className="bg-gray-200 rounded-full w-16 h-16 mb-2" />
                <Text className="text-center text-sm pb-2">
                  {categoria.Nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text className="text-lg font-semibold mb-2">Explorar</Text>
          <View className="space-y-4">
            {empresas.map((empresa, index) => (
              <View
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <Image
                  source={{
                    uri:
                      imagenesEmpresas[empresa.Nombre] ||
                      "https://via.placeholder.com/300x150",
                  }}
                  className="w-full h-32"
                />
                <View className="p-4">
                  <Text className="text-lg font-semibold mb-1">
                    {empresa.Nombre}
                  </Text>
                  <View className="flex-row items-center mb-1">
                    {[...Array(4)].map((_, i) => (
                      <FontAwesome key={i} name="star" size={16} color="gold" />
                    ))}
                    <FontAwesome name="star-o" size={16} color="gray" />
                  </View>
                  <View className="flex-row items-center mb-2">
                    <FontAwesome name="map-marker" size={14} color="gray" />
                    <Text className="text-gray-600 text-sm ml-1">{`${empresa.Calle} ${empresa.NumExt}, ${empresa.Colonia}`}</Text>
                  </View>
                  <Text className="text-gray-700 text-sm mb-2 line-clamp-2">
                    {empresa.Descripcion}
                  </Text>
                  <TouchableOpacity
                    className="bg-blue-500 text-white py-2 px-4 rounded-full w-full items-center justify-center"
                    onPress={() =>
                      router.push({
                        pathname: `/planes/${empresa.RutaDestino}`,
                        params: {
                          title: empresa.Nombre,
                          description: empresa.Descripcion,
                          direccion: `${empresa.Calle} ${empresa.NumExt}, ${empresa.Colonia}, CP: ${empresa.CodigoPost}`,
                          imageUrl:
                            imagenesEmpresas[empresa.Nombre] ||
                            "https://via.placeholder.com/300x200",
                        },
                      })
                    }
                  >
                    <Text className="text-white">Ver más</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {empresas.length === 0 && (
              <Text className="text-gray-500">Cargando recomendaciones...</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
