import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabase/supabase";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Card from "../../components/Card";
import { useLocalSearchParams } from "expo-router";

const Colors = {
  darkBlue: "#1a1e22",
  mediumBlue: "#282d33",
  lightBeige: "#D8C4B6",
  veryLightBeige: "#F5EFE7",
};

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
  const { idUser, email, selectedCategoryIdFromCategories } =
    useLocalSearchParams();

  // El estado `selectedCategoryId` ahora puede ser inicializado con el parámetro
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    selectedCategoryIdFromCategories
      ? parseInt(selectedCategoryIdFromCategories)
      : null,
  );

  const getCategorias = async () => {
    let { data: Categorias, error } = await supabase
      .from("Categorias")
      .select("idCategoria, Nombre")
      .limit(3)
      .order("Nombre", { ascending: true });
    if (error) {
      console.log("Error al obtener categorías:", error);
    } else {
      setCategorias(Categorias);
    }
  };

  const getEmpresas = useCallback(async () => {
    let query = supabase.from("Empresas").select(`
      Nombre,
      Descripcion,
      Portada,
      RutaDestino,
      Calle,
      NumExt,
      Colonia,
      CodigoPost,
      idCategoria
    `);

    if (selectedCategoryId) {
      query = query.eq("idCategoria", selectedCategoryId);
    }

    let { data: Empresas, error } = await query;

    if (error) {
      console.log("Error al obtener empresas:", error);
    } else {
      setEmpresas(Empresas);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (idUser) {
      console.log("ID del usuario logueado:", idUser);
    }
    getCategorias();
    // getEmpresas se llamará automáticamente cuando selectedCategoryId cambie
    // debido a su inclusión en el useEffect de abajo
  }, [idUser]);

  // Este useEffect se encargará de llamar a getEmpresas cuando selectedCategoryId cambie
  // (ya sea por un clic en la barra de categorías o por el parámetro de navegación).
  useEffect(() => {
    getEmpresas();
  }, [selectedCategoryId, getEmpresas]); // Dependencia: re-ejecutar cuando selectedCategoryId cambie

  // Sincroniza el estado selectedCategoryId con el parámetro de navegación
  // Esto es importante si el usuario navega a Home con un filtro y luego cambia de filtro manualmente.
  useEffect(() => {
    if (
      selectedCategoryIdFromCategories &&
      parseInt(selectedCategoryIdFromCategories) !== selectedCategoryId
    ) {
      setSelectedCategoryId(parseInt(selectedCategoryIdFromCategories));
    } else if (
      !selectedCategoryIdFromCategories &&
      selectedCategoryId !== null
    ) {
      // Si el parámetro ya no existe (ej. usuario llegó directamente a Home), limpia el filtro
      setSelectedCategoryId(null);
    }
  }, [selectedCategoryIdFromCategories]);

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
            <TouchableOpacity
              onPress={() => {
                // Al hacer clic en "Ver más", navega a la pantalla de Categorias
                router.push("/extras/Categorias");
              }}
            >
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
            {/* Opción para "Ver todas" las empresas */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedCategoryId === null
                    ? Colors.lightBeige
                    : Colors.mediumBlue,
              }}
              className="rounded-xl px-4 py-2 mr-2"
              onPress={() => setSelectedCategoryId(null)} // Limpia el filtro
            >
              <Text
                style={{
                  color:
                    selectedCategoryId === null
                      ? Colors.darkBlue
                      : Colors.veryLightBeige,
                }}
                className="font-semibold"
              >
                Todas
              </Text>
            </TouchableOpacity>

            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <TouchableOpacity
                  // Resalta la categoría seleccionada
                  style={{
                    backgroundColor:
                      selectedCategoryId === categoria.idCategoria
                        ? Colors.lightBeige
                        : Colors.mediumBlue,
                  }}
                  className="rounded-xl px-4 py-2 mr-2"
                  key={categoria.idCategoria}
                  onPress={() => setSelectedCategoryId(categoria.idCategoria)}
                >
                  <Text
                    style={{
                      color:
                        selectedCategoryId === categoria.idCategoria
                          ? Colors.darkBlue
                          : Colors.veryLightBeige,
                    }}
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
                No hay recomendaciones para esta categoría.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
