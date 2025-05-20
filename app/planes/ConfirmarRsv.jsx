import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect } from "react";

export default function ConfirmarRsv() {
  const navigation = useNavigation();
  const { nombre, telefono, fecha, hora, personas, empresa } =
    useLocalSearchParams();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Confirmación",
      headerStyle: { backgroundColor: "#282d33" },
      headerTitleAlign: "center",
      headerTintColor: "#F5EFE7",
    });
  }, []);

  return (
    <View className="flex-1 bg-darkBlue-900 p-6 items-center justify-center">
      <Text className="text-right text-gray-500 mb-5 w-full">2 de 2</Text>
      <Text className="text-3xl font-bold text-center mb-10 text-veryLightBeige-500">
        ¡Reserva Confirmada!
      </Text>

      <View className="w-full bg-slate-50 p-6 rounded-xl mb-8">
        <Text className="text-xl font-semibold text-center mb-6 text-veryLightBeige-500">
          Resumen
        </Text>

        <Text className="text-lg text-lightBeige-400 mb-3">
          <Text className="font-semibold">📍 Restaurante:</Text> {empresa}
        </Text>
        <Text className="text-lg text-lightBeige-400 mb-3">
          <Text className="font-semibold">🙍 Nombre:</Text> {nombre}
        </Text>
        <Text className="text-lg text-lightBeige-400 mb-3">
          <Text className="font-semibold">👥 Personas:</Text> {personas}
        </Text>
        <Text className="text-lg text-lightBeige-400 mb-3">
          <Text className="font-semibold">📅 Fecha:</Text> {fecha}
        </Text>
        <Text className="text-lg text-lightBeige-400 mb-3">
          <Text className="font-semibold">⏰ Hora:</Text> {hora}
        </Text>
        <Text className="text-lg text-lightBeige-400 mb-3">
          <Text className="font-semibold">📞 Teléfono:</Text> {telefono}
        </Text>
      </View>

      <TouchableOpacity
        className="w-40 bg-green-300 p-3 rounded-full"
        onPress={() => {
          router.push("/Home");
        }}
      >
        <Text className="font-semibold text-center text-darkBlue-900 text-lg">
          Regresar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
