import { View, Text, TextInput, Image, ScrollView } from 'react-native';
import { useTailwind } from 'tailwind-rn'; // Si usas nativewind, cambia esto según la lib
import { PieChart } from 'react-native-svg-charts'; // Ejemplo si usarás gráficos

const EstadisticasScreen = () => {
  const tailwind = useTailwind(); // Esto depende de tu setup

  return (
    <ScrollView className="flex-1 bg-white px-4 py-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-bold">Reportes Estadísticas</Text>
        {/* Icono de perfil */}
      </View>

      <TextInput
        placeholder="Filtro de Búsqueda y Fecha"
        className="bg-gray-200 rounded px-3 py-2 my-4"
      />

      <View className="bg-gray-200 rounded p-4 mb-4">
        <Text className="font-semibold">Mes</Text>
        <Text>Número de Visitas:</Text>
        <Text>Clientes Atraídos:</Text>
      </View>

      <View className="bg-gray-200 rounded p-4 mb-4">
        <Text className="font-bold mb-2">Gráfico Principal</Text>
        {/* Aquí va el gráfico */}
      </View>

      <View className="bg-gray-200 rounded p-4 items-center">
        <Text className="font-semibold mb-2">Exportar PDF</Text>
        <Image source={require('../../assets/pdf-icon.png')} style={{ width: 50, height: 50 }} />
      </View>
    </ScrollView>
  );
};

export default EstadisticasScreen;
