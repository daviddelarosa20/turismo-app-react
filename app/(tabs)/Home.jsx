import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Card from "../../components/Card";

const Colors = {
  darkBlue: "#1a1e22",
  mediumBlue: "#282d33",
  lightBeige: "#D8C4B6",
  veryLightBeige: "#F5EFE7",
};

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
      .limit(5)
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
    getEmpresas();
  }, []);

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors.darkBlue }}
      className="flex-1"
    >
      <ScrollView className="flex-1">
        <View className="px-4 pt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              style={{ color: Colors.veryLightBeige }}
              className="text-2xl font-bold"
            >
              Categorías
            </Text>
            <TouchableOpacity onPress={() => router.push("/categorias")}>
              <Text
                style={{ color: Colors.lightBeige }}
                className="font-semibold text-base"
              >
                Ver más &gt;
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-8"
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categorias.length > 0 ? (
              categorias.map((categoria, index) => (
                <TouchableOpacity
                  style={{ backgroundColor: Colors.mediumBlue }}
                  className="rounded-xl px-4 py-2 mr-2"
                  key={index}
                  onPress={() =>
                    alert("Estas viendo la categoria " + categoria.Nombre)
                  }
                >
                  <Text
                    style={{ color: Colors.veryLightBeige }}
                    className="font-semibold"
                  >
                    {categoria.Nombre}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: Colors.lightBeige }}>
                Cargando categorías...
              </Text>
            )}
          </ScrollView>

          <Text
            style={{ color: Colors.veryLightBeige }}
            className="text-2xl font-bold mb-4"
          >
            Nuestra recomendación
          </Text>
          <View className="items-center justify-center w-full">
            {empresas.length > 0 ? (
              empresas.map((empresa, index) => (
                <Card
                  key={index}
                  imageUrl={
                    imagenesEmpresas[empresa.Nombre] ||
                    "https://via.placeholder.com/300x200"
                  }
                  title={empresa.Nombre}
                  description={empresa.Descripcion}
                  direccion={`${empresa.Calle} ${empresa.NumExt}, ${empresa.Colonia}, CP: ${empresa.CodigoPost}`}
                  buttonText="Ver más"
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
                />
              ))
            ) : (
              <Text style={{ color: Colors.lightBeige }} className="mt-4">
                Cargando recomendaciones...
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
