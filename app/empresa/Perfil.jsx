import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../supabase/supabase";
import { LineChart, BarChart } from "react-native-chart-kit";

import moment from "moment"; // npm install moment
import "moment/locale/es";

export default function PerfilEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estadisticasPorMes, setEstadisticasPorMes] = useState({});
  const [chartData, setChartData] = useState(null);
  const { idEmpresa } = useLocalSearchParams();

  useEffect(() => {
    async function fetchEmpresa() {
      setLoading(true);

      const { data, error } = await supabase
        .from("Empresas")
        .select("*")
        .eq("idEmpresa", idEmpresa) //id empresa
        .single();

      if (error) {
        console.error("Error cargando empresa:", error);
      } else {
        setEmpresa(data);
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

      // Ordenamos los meses para que estén en orden cronológico
      const mesesOriginales = Object.keys(agrupadas).sort();

      // Creamos etiquetas con el nombre del mes en español
      const labels = mesesOriginales.map((mes) =>
        moment(mes, "YYYY-MM").locale("es").format("MMMM"),
      );

      // Obtenemos los datos usando la llave original (YYYY-MM)
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
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-gray-600">Cargando empresa...</Text>
      </View>
    );
  }

  if (!empresa) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-600">
          No se encontró información de la empresa
        </Text>
      </View>
    );
  }

  const portadaUrl = empresa.Portada.trim().replace("images//", "images/");
  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-4">
      <View className="bg-white rounded-2xl p-4 shadow mb-4 items-center">
        <Image
          source={{ uri: portadaUrl }}
          className="w-24 h-24 rounded-full mb-3"
        />
        <Text className="text-xl font-bold mb-1">{empresa.Nombre}</Text>
        <Text className="text-yellow-500 text-base mb-1">
          ⭐ {empresa.Valoracion} / 5
        </Text>
        <Text className="text-gray-600">Email: {empresa.ContactoEmail}</Text>
        <Text className="text-gray-600">Teléfono: {empresa.Telefono}</Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow mb-4">
        <Text className="text-lg font-bold mb-2">Datos generales</Text>
        <Text className="text-gray-700">Dirección:</Text>
        <Text>
          {empresa.Calle} #{empresa.NumExt}, {empresa.Colonia}
        </Text>
        <Text>
          {empresa.CodigoPostal}, {empresa.Ciudad}
        </Text>
        <Text className="mt-2 text-gray-700">Descripción:</Text>
        <Text>{empresa.Descripcion}</Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow mb-4">
        <Text className="text-lg font-bold mb-2">Estadísticas mensuales</Text>
        {Object.entries(estadisticasPorMes).length === 0 ? (
          <Text className="text-gray-500">No hay datos disponibles</Text>
        ) : (
          Object.entries(estadisticasPorMes).map(([mes, stats]) => (
            <View key={mes} className="mb-2">
              <Text className="font-semibold text-blue-600">{mes}</Text>
              <Text>Visitas: {stats.visitas}</Text>
              <Text>Clientes atraídos: {stats.clientes}</Text>
            </View>
          ))
        )}
      </View>

      {chartData && (
        <View className="bg-white rounded-2xl p-4 shadow mb-4">
          <Text className="text-lg font-bold mb-2">Visitas por mes</Text>
          <BarChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.datasets[0].data, // visitas
                },
              ],
            }}
            width={screenWidth - 48}
            height={220}
            yAxisLabel=""
            fromZero={true} // Inicia desde 0
            yAxisInterval={1} // Intervalos del eje Y
            formatYLabel={(value) => {
              const num = Number(value);
              if (num >= 1000) return (num / 1000).toFixed(1) + "k";
              return value;
            }}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            verticalLabelRotation={30}
            style={{
              borderRadius: 16,
              marginBottom: 16,
            }}
          />
        </View>
      )}

      {chartData && (
        <View className="bg-white rounded-2xl p-4 shadow mb-4">
          <Text className="text-lg font-bold mb-2">
            Clientes atraídos por mes
          </Text>
          <BarChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.datasets[1].data, // clientes atraídos
                },
              ],
            }}
            width={screenWidth - 48}
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
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            verticalLabelRotation={30}
            style={{
              borderRadius: 16,
              marginBottom: 16,
            }}
          />
        </View>
      )}

      <View className="bg-white rounded-2xl p-4 shadow mb-8">
        <Text className="text-lg font-bold mb-2">Comentarios recientes</Text>
        <Text className="text-gray-500">[Comentarios aquí]</Text>
      </View>
    </ScrollView>
  );
}
