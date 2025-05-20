import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import CalendarioS from "../../components/Calendario";
import { supabase } from "../../supabase/supabase";

export default function Reserva() {
  const navigation = useNavigation();
  const { title } = useLocalSearchParams();
  const [empresa, setEmpresa] = useState(null);
  const [personas, setPersonas] = useState(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState();
  const [hora, setHora] = useState();
  const [turno, setTurno] = useState(null);

  function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Reservar",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
    });
  }, []);

  useEffect(() => {
    async function fetchEmpresa() {
      const { data, error } = await supabase
        .from("Empresas")
        .select("*")
        .eq("Nombre", title)
        .single();

      console.log("Empresa recibida:", data);
      if (error) console.error("Error al obtener empresa:", error);
      else setEmpresa(data);
    }

    fetchEmpresa();
  }, [title]);

  const obtenerHoras = () => {
    if (turno === "Mañana") {
      return ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"];
    } else if (turno === "Tarde") {
      return [
        "12:00 PM",
        "12:30 PM",
        "1:00 PM",
        "1:30 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
        "5:00 PM",
        "6:00 PM",
      ];
    } else if (turno === "Noche") {
      return [
        "6:30 PM",
        "7:00 PM",
        "7:30 PM",
        "8:00 PM",
        "8:30 PM",
        "9:00 PM",
        "9:30 PM",
        "10:00 PM",
        "10:30 PM",
        "11:00 PM",
        "11:30 PM",
        "12:00 AM",
        "12:30 AM",
        "1:00 AM",
        "1:30 AM",
      ];
    }
    return [];
  };

  async function guardarReserva() {
    console.log("Intentando guardar reserva con:");
    console.log({
      nombre,
      telefono,
      fecha,
      hora,
      personas,
      empresa: empresa?.Nombre || title,
    });

    console.log("TIPOS:");
    console.log({
      nombre: typeof nombre,
      telefono: typeof telefono,
      fecha: typeof fecha,
      hora: typeof hora,
      personas: typeof personas,
      empresa: typeof (empresa?.Nombre || title),
    });

    if (!empresa?.Nombre && !title)
      return alert("Error con la empresa, intenta de nuevo.");
    if (!nombre) return alert("Ingresa tu nombre.");
    if (!telefono) return alert("Ingresa tu número de teléfono.");
    if (!personas) return alert("Selecciona el número de personas.");
    if (!fecha) return alert("Selecciona una fecha.");
    if (!hora) return alert("Selecciona una hora.");

    const { data, error } = await supabase.from("reservaciones").insert([
      {
        nombre,
        telefono,
        fecha,
        hora,
        personas,
        empresa: empresa?.Nombre || title,
      },
    ]);

    if (error) {
      console.error("❌ ERROR COMPLETO:", error);
      alert("❌ Ocurrió un error al guardar la reserva. Revisa consola.");
    } else {
      router.push({
        pathname: "/planes/ConfirmarRsv",
        params: {
          nombre,
          telefono,
          fecha,
          hora,
          personas,
          empresa: empresa?.Nombre || title,
        },
      });
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-darkBlue-900 p-6"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text className="text-3xl font-bold text-center mb-4 text-veryLightBeige-500 mt-2">
        {empresa?.Nombre}
      </Text>
      <Text className="text-right text-gray-500 mb-6">1 de 2</Text>

      <Text className="text-xl font-semibold mb-3 text-veryLightBeige-500">
        Agregar detalles de reserva:
      </Text>

      <Text className="mt-5 mb-2 font-semibold text-veryLightBeige-500">
        Elegir número de personas
      </Text>
      <View className="flex-row flex-wrap items-center justify-center gap-3">
        {[...Array(10)].map((_, i) => (
          <TouchableOpacity
            key={i}
            className={`w-12 h-10 items-center justify-center rounded-md ${
              personas === i + 1 ? "bg-green-300" : "bg-slate-700"
            }`}
            onPress={() => setPersonas(i + 1)}
          >
            <Text className="text-white">{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="mt-7 mb-2 font-semibold text-veryLightBeige-500">
        Nombre
      </Text>
      <TextInput
        className="border rounded-md p-3 text-gray-100 bg-slate-800"
        placeholder="Tu nombre"
        placeholderTextColor="#cbd5e0"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text className="mt-5 mb-2 font-semibold text-veryLightBeige-500">
        Número de teléfono
      </Text>
      <TextInput
        className="border rounded-md p-3 text-gray-100 bg-slate-800"
        placeholder="+52 1234567890"
        placeholderTextColor="#cbd5e0"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <Text className="mt-7 mb-3 font-semibold text-veryLightBeige-500">
        Seleccionar fecha:
      </Text>
      <Text className="text-center text-lg font-medium mb-4 text-lightBeige-400">
        {fecha}
      </Text>
      <CalendarioS
        onSelectFecha={(newFecha) => setFecha(newFecha)}
        textColor="#F5EFE7"
      />

      <Text className="mt-5 mb-3 font-semibold text-veryLightBeige-500">
        Seleccionar hora:
      </Text>

      <View className="flex-row justify-around my-3">
        {["Mañana", "Tarde", "Noche"].map((rango) => (
          <TouchableOpacity
            key={rango}
            onPress={() => {
              setTurno(rango);
              setHora(null);
            }}
            className={`px-5 py-2 rounded-md ${
              turno === rango ? "bg-yellow-400" : "bg-yellow-200"
            }`}
          >
            <Text className="font-bold text-black">{rango}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {turno && (
        <View className="px-2 mt-4">
          {chunkArray(obtenerHoras(), 3).map((fila, filaIndex) => (
            <View key={filaIndex} className="flex-row justify-between mb-3">
              {fila.map((horaItem) => (
                <TouchableOpacity
                  key={horaItem}
                  onPress={() => setHora(horaItem)}
                  className={`flex-1 mx-1 rounded-md py-3 items-center ${
                    hora === horaItem ? "bg-yellow-500" : "bg-slate-700"
                  }`}
                >
                  <Text className="text-white">{horaItem}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        className="bg-green-300 p-4 rounded-full items-center mt-8"
        onPress={guardarReserva}
      >
        <Text className="text-darkBlue-900 font-bold text-lg">
          Confirmar Reserva
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
