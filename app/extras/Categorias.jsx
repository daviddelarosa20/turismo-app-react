import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../supabase/supabase";

const Colors = {
  darkBlue: "#1a1e22",
  mediumBlue: "#282d33",
  lightBeige: "#D8C4B6",
  veryLightBeige: "#F5EFE7",
};

export default function CategoriasScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Explorar categorías",
      headerStyle: { backgroundColor: Colors.darkBlue },
      headerTintColor: Colors.veryLightBeige,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchCategorias() {
      setLoading(true);
      const { data, error } = await supabase
        .from("Categorias")
        .select("idCategoria, Nombre, Descripcion")
        .order("Nombre", { ascending: true });

      if (error) {
        console.error("Error al obtener categorías:", error);
        Alert.alert("Error", "No se pudieron cargar las categorías.");
      } else {
        setCategorias(data);
      }
      setLoading(false);
    }

    fetchCategorias();
  }, []);

  const handleCategoryPress = (idCategoria) => {
    router.replace({
      pathname: "/Home",
      params: { selectedCategoryIdFromCategories: idCategoria },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.darkBlue }}>
      <ScrollView style={{ flex: 1, padding: 16, paddingTop: 8 }}>
        {loading ? (
          <Text
            style={{
              color: Colors.lightBeige,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Cargando categorías...
          </Text>
        ) : categorias.length > 0 ? (
          <>
            {/* Opción para "Ver todas" las empresas, al igual que en Home */}
            <TouchableOpacity
              onPress={() => handleCategoryPress(null)}
              style={{ backgroundColor: Colors.mediumBlue }}
              className="rounded-xl p-4 mb-4 flex-row items-center shadow-md"
            >
              <View className="flex-1">
                <Text
                  style={{ color: Colors.veryLightBeige }}
                  className="text-xl font-bold"
                >
                  Ver todas
                </Text>
              </View>
              <AntDesign name="right" size={20} color={Colors.lightBeige} />
            </TouchableOpacity>

            {categorias.map((categoria) => (
              <TouchableOpacity
                key={categoria.idCategoria}
                onPress={() => handleCategoryPress(categoria.idCategoria)} // Pasa solo el ID
                style={{ backgroundColor: Colors.mediumBlue }}
                className="rounded-xl p-4 mb-4 flex-row items-center shadow-md"
              >
                {/* Puedes añadir un icono o imagen si tienes para cada categoría */}
                <View className="flex-1">
                  <Text
                    style={{ color: Colors.veryLightBeige }}
                    className="text-xl font-bold mb-1"
                  >
                    {categoria.Nombre}
                  </Text>
                  {categoria.Descripcion && (
                    <Text
                      style={{ color: Colors.lightBeige }}
                      className="text-base"
                    >
                      {categoria.Descripcion}
                    </Text>
                  )}
                </View>
                <AntDesign name="right" size={20} color={Colors.lightBeige} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <Text
            style={{
              color: Colors.lightBeige,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            No se encontraron categorías.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
