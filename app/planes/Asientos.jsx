import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";

export default function Asientos() {
  console.log("Componente Asientos renderizado");
  const navigation = useNavigation();
  const { Title, Description, Imagen, Fecha, Hora } = useLocalSearchParams();
  const [asientosSeleccionados, setAsientosSeleccionados] = useState({});
  const [asientosEstado, setAsientosEstado] = useState({});

  // Obtener estados de los asientos desde Supabase
  React.useEffect(() => {
    const obtenerEstadosAsientos = async () => {
      try {
        console.log("Obteniendo estados de asientos desde Supabase");

        if (!Title) {
          console.error("No se recibió el título del evento");
          return;
        }

        console.log("Buscando evento con título:", Title);

        const { data: evento, error: eventoError } = await supabase
          .from("Eventos")
          .select("idEvento")
          .eq("Titulo", Title)
          .single();

        if (eventoError) {
          console.error("Error al obtener el evento:", eventoError);
          return;
        }

        if (!evento) {
          console.log("No se encontró evento con el título:", Title);
          return;
        }

        console.log("Evento encontrado:", {
          idEvento: evento.idEvento,
          nombre: Title,
        });

        const { data: asientos, error } = await supabase
          .from("Asientos")
          .select("Fila, Columna, Estado")
          .eq("idEvento", evento.idEvento)
          .order("idAsiento");

        if (error) {
          console.error("Error al obtener asientos:", error);
          return;
        }

        if (!asientos || asientos.length === 0) {
          console.log("No se encontraron asientos para este evento");
          return;
        }

        const estados = {};
        const filas = ["A", "B", "C"];
        const columnas = [1, 2, 3, 4, 5];
        filas.forEach((fila) => {
          columnas.forEach((col) => {
            const seatId = `${fila}${col}`;
            estados[seatId] = true;
          });
        });

        if (asientos && asientos.length > 0) {
          console.log("Datos de asientos recibidos:", asientos);
          asientos.forEach((asiento) => {
            if (asiento && asiento.Fila && asiento.Columna) {
              const seatId = `${asiento.Fila}${asiento.Columna}`;
              const estado = asiento.Estado?.toUpperCase();
              estados[seatId] = estado === "DISPONIBLE";
            }
          });
        } else {
          console.log("No se encontraron asientos en la base de datos");
        }

        setAsientosEstado(estados);
        console.log("Estado final de asientos:", estados);
      } catch (error) {
        console.error("Error en obtenerEstadosAsientos:", error);
      }
    };

    obtenerEstadosAsientos();

    const unsubscribe = navigation.addListener("focus", () => {
      obtenerEstadosAsientos();
    });

    return () => unsubscribe();
  }, [navigation, Title]);

  const toggleAsiento = (id) => {
    if (asientosEstado[id]) {
      setAsientosSeleccionados((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const confirmarCompra = async () => {
    try {
      const { data: evento, error: eventoError } = await supabase
        .from("Eventos")
        .select("idEvento, Costo")
        .eq("Titulo", Title)
        .single();

      if (eventoError) throw eventoError;
      if (!evento) throw new Error("Evento no encontrado");
      if (evento.Costo === null || evento.idEvento === null)
        throw new Error("Información del evento incompleta");

      const asientosSeleccionadosArray = Object.entries(asientosSeleccionados)
        .filter(([_, seleccionado]) => seleccionado)
        .map(([id]) => ({ Fila: id[0], Columna: parseInt(id.slice(1)) }));

      if (asientosSeleccionadosArray.length === 0) {
        Alert.alert("Error", "Por favor seleccione al menos un asiento");
        return;
      }

      const costoTotal = evento.Costo * asientosSeleccionadosArray.length;
      const eventoId = evento.idEvento;

      if (costoTotal === 0) {
        navigation.navigate("planes/confirmacionB", {
          Title,
          Description,
          Imagen,
          Fecha,
          Hora,
          asientosSeleccionados: JSON.stringify(asientosSeleccionadosArray),
          cantidadAsientos: asientosSeleccionadosArray.length,
          costo: 0,
          numeroTarjeta: "GRATIS",
          fechaVencimiento: "N/A",
          cvv: "N/A",
          asientosIDs: JSON.stringify(
            asientosSeleccionadosArray.map(
              (asiento) => asiento.Fila + asiento.Columna,
            ),
          ),
          idEvento: eventoId,
        });
        return;
      }

      const { data: asientosData, error: fetchError } = await supabase
        .from("Asientos")
        .select("*")
        .eq("idEvento", evento.idEvento)
        .in(
          "Fila",
          asientosSeleccionadosArray.map((asiento) => asiento.Fila),
        )
        .in(
          "Columna",
          asientosSeleccionadosArray.map((asiento) => asiento.Columna),
        );

      if (fetchError) throw fetchError;
      if (!asientosData || asientosData.length === 0) {
        Alert.alert(
          "Error",
          "No se encontraron asientos con los criterios especificados",
        );
        return;
      }

      navigation.navigate("planes/Pago", {
        Title,
        Description,
        Imagen,
        Fecha,
        Hora,
        asientosSeleccionados: JSON.stringify(asientosSeleccionadosArray),
        cantidadAsientos: asientosSeleccionadosArray.length,
        costo: costoTotal,
        asientosIDs: JSON.stringify(
          asientosData.map((asiento) => asiento.idAsiento),
        ),
        idEvento: eventoId,
      });

      setAsientosSeleccionados([]);
      setAsientosEstado({});
      Alert.alert(
        "¡Listo!",
        "Selecciona los datos de tu tarjeta para continuar",
      );
    } catch (error) {
      console.error("Error al confirmar compra:", error);
      Alert.alert(
        "Error",
        "No se pudo completar la compra. Por favor, inténtelo nuevamente.",
      );
      return;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Selecciona asiento",
      headerStyle: { backgroundColor: "#282d33" },
      headerTitleAlign: "center",
      headerTintColor: "#F5EFE7",
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
        <View className="w-full mb-6 bg-mediumBlue-800 rounded-lg shadow-md p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: Imagen }}
              className="w-24 h-24 rounded-lg"
              resizeMode="cover"
            />
            <View className="ml-4 flex-1 justify-between">
              <View>
                <Text className="text-lg font-bold text-veryLightBeige-500 mb-1">
                  {Title}
                </Text>
                <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
                  {Description}
                </Text>
              </View>
              <View>
                <Text className="text-gray-400 text-sm font-semibold">
                  {Fecha}
                </Text>
                <Text className="text-gray-400 text-sm font-semibold">
                  {Hora}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Escritorio */}
        <View className="w-4/5 bg-slate-700 py-3 rounded-xl mb-8 items-center">
          <Text className="text-white font-bold text-lg">Escenario</Text>
        </View>

        {/* Asientos */}
        <View className="items-center mt-6">
          {["A", "B", "C"].map((row) => (
            <View key={row} className="flex-row mb-3">
              {[1, 2, 3, 4, 5].map((col) => {
                const seatId = `${row}${col}`;
                const seleccionado = asientosSeleccionados[seatId] || false;
                const disponible = asientosEstado[seatId];

                return (
                  <TouchableOpacity
                    key={seatId}
                    onPress={() => {
                      if (disponible) {
                        toggleAsiento(seatId);
                      }
                    }}
                    className={`w-10 h-10 mx-1 rounded-md justify-center items-center ${
                      !disponible
                        ? "bg-gray-500 opacity-70"
                        : seleccionado
                          ? "bg-green-600"
                          : "bg-blue-600"
                    }`}
                    disabled={!disponible}
                  >
                    <Text className="text-white font-semibold text-sm">
                      {seatId}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Botón de confirmar compra */}
        <TouchableOpacity
          onPress={confirmarCompra}
          className="mt-8 bg-green-600 p-4 rounded-lg w-4/5 items-center"
        >
          <Text className="text-white text-center font-bold text-lg">
            Confirmar Selección
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
