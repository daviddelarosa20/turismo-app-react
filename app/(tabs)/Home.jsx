import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/Card";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";

export default function Home() {
  const [categorias, setCategorias] = useState([]);
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
  useEffect(() => {
    getCategorias();
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
          <Card
            imageUrl="https://cf.bstatic.com/xdata/images/hotel/max1024x768/38625982.jpg?k=b5786fed1ec48c1784607732356aaa004586a4be1d3d6e7ce66c9262e6609a19&o=&hp=1"
            title="Hotel Gobernador"
            description="Av. 20 de Noviembre frente al hospital Materno. CP. 34161"
            buttonText="Ver más"
            onPress={() => alert("Estas viendo más")}
          />

          <Card
            imageUrl="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMS5HndKDTVnByWy84Y2AAxyapjnvbq0nl7xhg8jO0plo-QoUVgAkQqy0uuUcgqfFpwCouyGpoUvWtp0xjO1d55r_EsztATEeEfsqH_re8klIU3wkfXi1Gv8LtNYVz4V4xXn8TAI99CszG3WfwLl2qV0xwvcTAOc_QV9C1cNY_pdadeWI_wTQBS5aM-cI/s1900/Giordano's%20Deep%20Dish%20Pizza.jpg"
            title="Giardinos Pizza"
            description="Calle Cosntitución 111, Centro."
            buttonText="Ver más"
            onPress={() => alert("Estas viendo más")}
          />

          <Card
            imageUrl="https://www.turimexico.com/wp-content/uploads/2015/05/victoria.jpg"
            title="Teatro Ricardo Castro"
            description="Bruno Martinez, Zona Centro, 34100,"
            buttonText="Cartelera"
            onPress={() => alert("Estas viendo la cartelera")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
