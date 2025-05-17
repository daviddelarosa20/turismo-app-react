import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { useRouter } from "expo-router";

export default function Home() {
  const imagenesEmpresas = {
    "La Finca":
      "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//RestauranteComida.jpg",
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-1 items-center justify-center mb-12">
          <View className="bg-slate-100 w-full border border-blue-400  p-4">
            <Text className="text-2xl font-bold mb-2">
              Categorías Populares
            </Text>
            <View className="items-center justify-center flex-row overflow-x-auto">
              {categorias.map((categoria, index) => (
                <TouchableOpacity
                  className="bg-stone-400 w-30 h-15 rounded-xl items-center justify-center ml-2 mb-2 p-3"
                  key={index}
                  onPress={() =>
                    alert("Estas viendo la categoria " + categoria.Nombre)
                  }
                >
                  <Text className="text-white">{categoria.Nombre}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Text className="text-2xl font-bold mb-2 mt-2">
            Nuestra recomendación
          </Text>
          {/* Ejemplo de Card con datos de destino turístico */}
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
              <Text className="text-gray-500">Cargando recomendaciones...</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
