import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

export default function ConfirmarRsv() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Confirmación",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "white" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>¡Reserva Confirmada!</Text>
{/*esto será funcional despues jeje */}
      <View style={{ width: "100%", backgroundColor: "#f2f2f2", padding: 20, borderRadius: 10, marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 10 }}>Resumen:</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>📍 Restaurante: El Buen Sabor</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>👥 Personas: 2</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>📅 Fecha: 29 Abril 2025</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>⏰ Hora: 1:15 PM</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>📞 Teléfono: +52 1234567890</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ backgroundColor: "#90ee90", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}
