import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions, // Importa Dimensions
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useEffect, useState, useLayoutEffect } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { supabase } from "../../supabase/supabase";
import { BarChart } from "react-native-chart-kit";

import moment from "moment";
import "moment/locale/es";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function PerfilEmpresa() {
  const navigation = useNavigation();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadisticasPorMes, setEstadisticasPorMes] = useState({});
  const [chartData, setChartData] = useState(null);
  const { idEmpresa } = useLocalSearchParams();
  const [rating, setRating] = useState(0);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    Dimensions.addEventListener("change", updateDimensions);

    return () => {
      Dimensions.removeEventListener("change", updateDimensions);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Perfil de la Empresa",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          className="ml-3 p-2 rounded-full bg-slate-800"
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : router.push("/")
          }
        >
          <AntDesign name="arrowleft" size={24} color="#F5EFE7" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchEmpresa() {
      setLoading(true);

      const { data, error } = await supabase
        .from("Empresas")
        .select("*")
        .eq("idEmpresa", idEmpresa)
        .single();

      if (error) {
        console.error("Error cargando empresa:", error);
      } else {
        setEmpresa(data);
        setRating(data?.Valoracion || 0);
        fetchEstadisticas(data.idEmpresa);
      }

      setLoading(false);
    }

    async function fetchEstadisticas(idEmpresa) {
      const { data, error } = await supabase
        .from("Estadisticas")
        .select("fecha, visitas, clientesAtraidos")
        .eq("idEmpresa", idEmpresa);

      if (error) {
        console.error("Error al cargar estadísticas:", error);
        return;
      }

      const agrupadas = {};
      data.forEach((item) => {
        const mes = moment(item.fecha).format("YYYY-MM");
        if (!agrupadas[mes]) {
          agrupadas[mes] = { visitas: 0, clientes: 0 };
        }
        agrupadas[mes].visitas += item.visitas;
        agrupadas[mes].clientes += item.clientesAtraidos;
      });

      setEstadisticasPorMes(agrupadas);

      const mesesOriginales = Object.keys(agrupadas).sort();

      const labels = mesesOriginales.map((mes) =>
        moment(mes, "YYYY-MM").locale("es").format("MMMM"),
      );

      const visitasData = mesesOriginales.map((mes) => agrupadas[mes].visitas);
      const clientesData = mesesOriginales.map(
        (mes) => agrupadas[mes].clientes,
      );

      setChartData({
        labels,
        datasets: [
          {
            data: visitasData,
            color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
            strokeWidth: 2,
          },
          {
            data: clientesData,
            color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
            strokeWidth: 2,
          },
        ],
        legend: ["Visitas", "Clientes Atraídos"],
      });
    }

    fetchEmpresa();
  }, [idEmpresa]);

  const handleRatingPress = (newRating) => {
    if (rating !== 0 && rating !== newRating) {
      Alert.alert(
        "Cambiar calificación",
        "Ya seleccionaste una calificación. ¿Deseas cambiarla?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí",
            onPress: () => setRating(newRating),
          },
        ],
        { cancelable: true },
      );
    } else if (rating === 0) {
      setRating(newRating);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-darkBlue-900">
        <ActivityIndicator size="large" color="#F5EFE7" />
        <Text className="mt-2 text-veryLightBeige-500">Cargando perfil...</Text>
      </View>
    );
  }

  if (!empresa) {
    return (
      <View className="flex-1 justify-center items-center bg-darkBlue-900">
        <Text className="text-red-400">
          No se encontró información de la empresa
        </Text>
      </View>
    );
  }

  const portadaUrl = empresa.Portada.trim().replace("images//", "images/");
  const chartWidth = screenWidth - 24 * 2 - 16 * 2;

  return (
    <ScrollView className="flex-1 bg-darkBlue-900 p-6 pt-2">
      {/* Sección de información principal (similar al título y calificación de PlanBasico) */}
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-veryLightBeige-500 mb-2 text-center">
          {empresa.Nombre}
        </Text>
        <View className="flex-row items-center mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => handleRatingPress(i)}>
              <AntDesign
                name={i <= rating ? "star" : "staro"}
                size={24}
                color="#facc15"
                className="mx-1"
              />
            </TouchableOpacity>
          ))}
          <Text className="ml-2 text-lightBeige-400 text-xl font-bold">
            {rating}.0
          </Text>
        </View>
      </View>

      {/* Imagen de portada circular */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: portadaUrl }}
          className="w-40 h-40 rounded-full mb-4 border-4 border-veryLightBeige-500"
          resizeMode="cover"
        />
      </View>

      {/* Información de contacto */}
      <View className="w-full items-start mb-6">
        <Text className="font-bold mb-2 text-left text-veryLightBeige-500 text-xl">
          Datos de Contacto
        </Text>
        <Text className="text-lightBeige-400 text-left leading-6 text-lg font-normal mb-1">
          Email: {empresa.ContactoEmail}
        </Text>
        <Text className="text-lightBeige-400 text-left leading-6 text-lg font-normal">
          Teléfono: {empresa.Telefono}
        </Text>
      </View>

      {/* Sección de Descripción (similar a Información del lugar) */}
      <View className="w-full items-start mb-6">
        <Text className="font-bold mb-2 text-left text-veryLightBeige-500 text-xl">
          Descripción
        </Text>
        <Text className="text-lightBeige-400 text-left leading-6 text-lg font-normal">
          {empresa.Descripcion || "Sin descripción disponible."}
        </Text>
      </View>

      {/* Sección de Ubicación */}
      <View className="w-full items-start mb-8">
        <Text className="font-bold mb-2 text-left text-veryLightBeige-500 text-xl">
          Ubicación
        </Text>
        <Text className="text-lightBeige-400 text-left mt-2 text-lg font-normal">
          {empresa
            ? `${empresa.Calle} ${empresa.NumExt}${
                empresa.NumInt ? ", Int. " + empresa.NumInt : ""
              }, ${empresa.Colonia}, ${empresa.CodigoPostal}, ${empresa.Ciudad}`
            : "Dirección no disponible"}
        </Text>

        <TouchableOpacity
          onPress={() => {
            const query = encodeURIComponent(
              `${empresa?.Calle} ${empresa?.NumExt}, ${empresa?.Colonia}, ${empresa?.Ciudad}`,
            );
            // Asegúrate de que la URL de Google Maps sea correcta
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${query}`,
            );
          }}
          className="w-full mt-4 rounded-xl overflow-hidden h-48"
        >
          <Image
            source={{
              uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
            }}
            className="w-full h-full opacity-80"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Estadísticas mensuales en un diseño más integrado (texto) */}
      <View className="w-full items-start mb-6">
        <Text className="font-bold mb-4 text-left text-veryLightBeige-500 text-xl">
          Estadísticas Mensuales
        </Text>
        {Object.entries(estadisticasPorMes).length === 0 ? (
          <Text className="text-lightBeige-400">No hay datos disponibles</Text>
        ) : (
          Object.entries(estadisticasPorMes).map(([mes, stats]) => (
            <View
              key={mes}
              className="bg-darkBlue-800 rounded-lg p-3 mb-3 w-full"
            >
              <Text className="font-semibold text-veryLightBeige-500 text-lg">
                {moment(mes, "YYYY-MM").locale("es").format("MMMM")}
              </Text>
              <Text className="text-lightBeige-400">
                Visitas: {stats.visitas}
              </Text>
              <Text className="text-lightBeige-400">
                Clientes atraídos: {stats.clientes}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Gráficos de barras */}
      {chartData && (
        <>
          {/* Card de Visitas por Mes */}
          <View className="bg-darkBlue-800 rounded-2xl p-4 shadow mb-6">
            <Text className="text-lg font-bold mb-2 text-veryLightBeige-500">
              Visitas por Mes
            </Text>
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.datasets[0].data,
                  },
                ],
              }}
              // Utiliza el `chartWidth` dinámico aquí
              width={chartWidth}
              height={220}
              yAxisLabel=""
              fromZero={true}
              yAxisInterval={1}
              formatYLabel={(value) => {
                const num = Number(value);
                if (num >= 1000) return (num / 1000).toFixed(1) + "k";
                return value;
              }}
              chartConfig={{
                backgroundColor: "#282d33",
                backgroundGradientFrom: "#282d33",
                backgroundGradientTo: "#282d33",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(245,239,223,${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForVerticalLabels: {
                  fontSize: 10,
                },
                propsForHorizontalLabels: {
                  fontSize: 10,
                },
              }}
              verticalLabelRotation={30}
              style={{
                borderRadius: 16,
              }}
            />
          </View>

          {/* Card de Clientes Atraídos por Mes */}
          <View className="bg-darkBlue-800 rounded-2xl p-4 shadow mb-6">
            <Text className="text-lg font-bold mb-2 text-veryLightBeige-500">
              Clientes Atraídos por Mes
            </Text>
            <BarChart
              data={{
                labels: chartData.labels,
                datasets: [
                  {
                    data: chartData.datasets[1].data,
                  },
                ],
              }}
              width={chartWidth}
              height={220}
              yAxisLabel=""
              fromZero={true}
              yAxisInterval={1}
              formatYLabel={(value) => {
                const num = Number(value);
                if (num >= 1000) return (num / 1000).toFixed(1) + "k";
                return value;
              }}
              chartConfig={{
                backgroundColor: "#282d33",
                backgroundGradientFrom: "#282d33",
                backgroundGradientTo: "#282d33",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(245,239,223,${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForVerticalLabels: {
                  fontSize: 10,
                },
                propsForHorizontalLabels: {
                  fontSize: 10,
                },
              }}
              verticalLabelRotation={30}
              style={{
                borderRadius: 16,
              }}
            />
          </View>
        </>
      )}

      {/* Sección de Comentarios (placeholder) */}
      <View className="w-full items-start mb-8">
        <Text className="font-bold mb-2 text-left text-veryLightBeige-500 text-xl">
          Comentarios Recientes
        </Text>
        <Text className="text-lightBeige-400 text-left leading-6 text-lg font-normal">
          [Comentarios]
        </Text>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}
