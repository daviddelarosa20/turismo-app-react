import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, router } from "expo-router";
import { useLayoutEffect, useState } from "react";
import CalendarioS from "../../components/Calendario";


export default function Reserva() {
  const navigation = useNavigation();
  const [personas, setPersonas] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("29 Abril 2025");
  const [hora, setHora] = useState("1:15 PM");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reservar",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "white" }}>
      <Text className="text-xl font-bold text-center mb-2">Nombre del restaurante</Text>
      <Text className="text-right text-gray-500 mb-4">1 de 2</Text>

      <Text className="text-lg font-semibold mb-2">Agregar detalles de reserva</Text>

      <Text className="mt-4 mb-2 font-semibold">Elegir número de personas</Text>
      <View className="flex-row flex-wrap gap-2">
        {[...Array(10)].map((_, i) => (
          <TouchableOpacity
            key={i}
            className={`w-12 h-10 items-center justify-center rounded bg-gray-200 ${
              personas === i + 1 ? "bg-green-300" : ""
            }`}
            onPress={() => setPersonas(i + 1)}
          >
            <Text>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="mt-6 mb-1 font-semibold">Nombre</Text>
      <TextInput
        className="border rounded p-2"
        placeholder="Tu nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text className="mt-4 mb-1 font-semibold">Número de teléfono</Text>
      <TextInput
        className="border rounded p-2"
        placeholder="+52 1234567890"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

       <Text className="mt-6 mb-2 font-semibold">Seleccionar fecha:</Text>
      <Text className="text-center text-lg font-medium mb-2">{fecha}</Text>
      <CalendarioS onSelectFecha={setFecha} /> 
      


      <Text className="mt-4 mb-2 font-semibold">Seleccionar hora:</Text>
      <View className="flex-row justify-around mb-2">
        {["Mañana", "Tarde", "Noche"].map((rango) => (
          <TouchableOpacity key={rango} className="px-4 py-2 bg-yellow-100 rounded">
            <Text>{rango}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="items-center mb-6">
        {["1:00 PM", "1:15 PM", "1:30 PM", "2:00 PM"].map((h) => (
          <TouchableOpacity
            key={h}
            className={`w-full py-2 my-1 rounded ${
              hora === h ? "bg-yellow-200" : "bg-gray-200"
            }`}
            onPress={() => setHora(h)}
          >
            <Text className="text-center">{h}</Text>
          </TouchableOpacity>
        ))}
      </View>
        
      <TouchableOpacity 
  className="bg-green-300 p-4 rounded-full items-center"
  onPress={() => {
    router.push("/planes/ConfirmarRsv");
  }}
>
  <Text className="text-black font-bold">Confirmar</Text>
</TouchableOpacity>


    </ScrollView>
  );
}
