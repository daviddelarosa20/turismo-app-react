import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import { TextInput, List } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

export default function Estadisticas() {
  const router = useRouter();

  const [filtros, setFiltros] = useState([]);
  const [query, setQuery] = useState("");
  const [filtroSeleccionado, setFiltroSeleccionado] = useState(null);

  const [estadisticasDiarias, setEstadisticasDiarias] = useState([]);

  // 🔄 Cargar combos únicos (mes-año)
  useEffect(() => {
    const obtenerFiltros = async () => {
      const { data, error } = await supabase
        .from("Estadisticas")
        .select("fecha");

      if (error) {
        console.error("Error al obtener fechas:", error);
        return;
      }

      const únicos = [
        ...new Map(
          data.map((item) => {
            const fecha = new Date(item.fecha);
            const mes = fecha.toLocaleString("es-MX", { month: "long" });
            const anio = fecha.getFullYear();
            return [`${mes}-${anio}`, { mes, anio }];
          })
        ).values(),
      ];

      setFiltros(únicos);
    };

    obtenerFiltros();
  }, []);

  // Función auxiliar para convertir mes a número
  const obtenerNumeroMes = (nombreMes) => {
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return meses.indexOf(nombreMes.toLowerCase()) + 1;
  };

  // 🔎 Consultar datos de ese mes-año cuando se selecciona
  useEffect(() => {
    if (!filtroSeleccionado) return;

    const obtenerEstadisticas = async () => {
      const { mes, anio } = filtroSeleccionado;

      const mesNum = obtenerNumeroMes(mes); // ← conversión corregida
      if (mesNum === 0) {
        console.error("Mes no válido:", mes);
        return;
      }

      const diasEnMes = new Date(anio, mesNum, 0).getDate();

      const desde = `${anio}-${mesNum.toString().padStart(2, "0")}-01`;
      const hasta = `${anio}-${mesNum.toString().padStart(2, "0")}-${diasEnMes}`;

      const { data, error } = await supabase
        .from("Estadisticas")
        .select("fecha, visitas, clientesAtraidos")
        .gte("fecha", desde)
        .lte("fecha", hasta)
        .order("fecha", { ascending: true });

      if (error) {
        console.error("Error al consultar estadísticas:", error);
        return;
      }

      console.log("Datos reales recibidos:", data);
      setEstadisticasDiarias(data);
    };

    obtenerEstadisticas();
  }, [filtroSeleccionado]);


  // 📊 Construcción de la gráfica
  const graficaDisponible = estadisticasDiarias.length > 0;
  const fechas = estadisticasDiarias.map((e) =>
    new Date(e.fecha).getDate().toString()
  );
  const visitas = estadisticasDiarias.map((e) => e.visitas);
  const atraidos = estadisticasDiarias.map((e) => e.clientesAtraidos);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold">Reportes Estadísticas</Text>
        <View className="w-8 h-8 bg-gray-400 rounded-full" />
      </View>

      {/* Buscador dinámico */}
      <View className="mx-4 my-3 z-10">
        <TextInput
          label="Buscar Mes y Año"
          value={query}
          onChangeText={(text) => setQuery(text)}
          mode="outlined"
          style={{ backgroundColor: "white" }}
        />
        {query.length > 0 &&
          filtros
            .filter((f) =>
              `${f.mes} ${f.anio}`.toLowerCase().includes(query.toLowerCase())
            )
            .map((f, index) => (
              <List.Item
                key={index}
                title={`${f.mes} ${f.anio}`}
                onPress={() => {
                  setFiltroSeleccionado(f);
                  setQuery(`${f.mes} ${f.anio}`);
                }}
              />
            ))}
      </View>

      <ScrollView className="flex-1">
        {/* Card resumen */}
        <View className="bg-gray-100 m-4 p-4 rounded-xl">
          <Text className="font-bold mb-2">Mes Seleccionado</Text>
          <Text>Número de Visitas: {visitas.reduce((a, b) => a + b, 0)}</Text>
          <Text>
            Clientes Atraídos: {atraidos.reduce((a, b) => a + b, 0)}
          </Text>
        </View>

        {/* Gráfico */}
        <View className="bg-gray-100 m-4 p-4 rounded-xl items-center">
          <Text className="text-xl font-bold self-start mb-2">
            Gráfico Principal
          </Text>

          {graficaDisponible ? (
            <LineChart
              data={{
                labels: fechas,
                datasets: [
                  {
                    data: visitas,
                    color: () => "rgba(33, 150, 243, 1)",
                    strokeWidth: 2,
                  },
                  {
                    data: atraidos,
                    color: () => "rgba(76, 175, 80, 1)",
                    strokeWidth: 2,
                  },
                ],
                legend: ["Visitas", "Clientes Atraídos"],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => "#888",
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#000" },
              }}
              bezier
              style={{ borderRadius: 10 }}
            />
          ) : (
            <Text className="text-gray-500 mt-4">
              No hay datos para este mes
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}