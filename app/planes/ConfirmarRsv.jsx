import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect } from "react";

export default function ConfirmarRsv() {
  const navigation = useNavigation();
  const { nombre, telefono, fecha, hora, personas, empresa } = useLocalSearchParams();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Confirmación",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <Text className="text-right text-gray-500 mb-5">2 de 2</Text>
      <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 40 }}>
        ¡Reserva Confirmada!
      </Text>

      <View
        style={{
          width: "100%",
          backgroundColor: "#f2f2f2",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "500", textAlign: "center", marginBottom: 20 }}>
          Resumen
        </Text>

        <Text style={{ fontSize: 16, marginBottom: 20 }}>📍 Restaurante: {empresa}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>🙍 Nombre: {nombre}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>👥 Personas: {personas}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>📅 Fecha: {fecha}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>⏰ Hora: {hora}</Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>📞 Teléfono: {telefono}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
  <TouchableOpacity
    style={{
      width: "40%",
      backgroundColor: "#bbf7d0", 
      padding: 12,
      borderRadius: 9999,
    }}
    onPress={() => {
      router.push("/");
    }}
  >
    <Text style={{ fontWeight: "600", textAlign: "center", color: "black" }}>
      Regresar al inicio
    </Text>
  </TouchableOpacity>
</View>

    </View>
  );
}
