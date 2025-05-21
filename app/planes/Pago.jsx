import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { supabase } from "../../supabase/supabase";

export default function Pago() {
  const {
    Title,
    Description,
    Imagen,
    Fecha,
    Hora,
    asientosSeleccionados,
    cantidadAsientos,
    idEvento: eventoId,
  } = useLocalSearchParams();
  const navigation = useNavigation();
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [costo, setCosto] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Pago",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
      },
    });
  }, [navigation]);

  useEffect(() => {
    const obtenerCostoEvento = async () => {
      try {
        console.log("Buscando costo para evento:", Title);
        const { data: evento, error: eventoError } = await supabase
          .from("Eventos")
          .select("Costo")
          .eq("Titulo", Title)
          .single();

        if (eventoError) {
          console.error("Error al obtener el costo:", eventoError);
          return;
        }

        if (!evento) {
          console.error("Evento no encontrado:", Title);
          return;
        }

        const costoTotal = evento.Costo * (cantidadAsientos || 1);
        setCosto(costoTotal);
      } catch (error) {
        console.error("Error al obtener el costo:", error);
      }
    };

    if (Title && cantidadAsientos) {
      obtenerCostoEvento();
    }
  }, [Title, cantidadAsientos]);

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
                <Text className="text-black text-sm mb-2" numberOfLines={2}>
                  {Description}
                </Text>
              </View>
              <View>
                <Text className="text-black text-sm font-semibold">
                  {Fecha}
                </Text>
                <Text className="text-black text-sm font-semibold">{Hora}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Formulario de pago */}
        <View className="w-full mt-8 p-4 bg-mediumBlue-800 rounded-lg shadow-md">
          <Text className="text-xl font-bold mb-4 text-veryLightBeige-500 text-center">
            Ingrese datos de pago
          </Text>

          {/* Número de tarjeta */}
          <View className="mb-4">
            <Text className="text-lightBeige-400 mb-1">Número de tarjeta</Text>
            <TextInput
              placeholder="Número de tarjeta"
              value={numeroTarjeta}
              onChangeText={setNumeroTarjeta}
              keyboardType="numeric"
              maxLength={16}
              className="border border-gray-600 rounded-lg p-3 w-full text-black bg-darkBlue-900"
            />
          </View>

          {/* Fecha de vencimiento */}
          <View className="mb-4">
            <Text className="text-lightBeige-400 mb-1">
              Fecha de vencimiento (MM/YY)
            </Text>
            <TextInput
              placeholder="MM/YY"
              value={fechaVencimiento}
              onChangeText={setFechaVencimiento}
              keyboardType="text"
              maxLength={5}
              className="border border-gray-600 rounded-lg p-3 w-full text-black bg-darkBlue-900"
            />
          </View>

          {/* CVV */}
          <View className="mb-6">
            <Text className="text-lightBeige-400 mb-1">CVV</Text>
            <TextInput
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={3}
              className="border border-gray-600 rounded-lg p-3 w-full text-black bg-darkBlue-900"
            />
          </View>

          {/* Costo Final */}
          <View className="mb-8 items-center">
            <Text className="text-lg font-bold text-lightBeige-400">
              Costo Final: ${costo.toFixed(2)}
            </Text>
          </View>

          {/* Botón de pago */}
          <TouchableOpacity
            className="bg-green-600 p-4 rounded-lg w-full items-center"
            onPress={async () => {
              try {
                if (!numeroTarjeta || numeroTarjeta.length !== 16) {
                  alert(
                    "Por favor ingrese un número de tarjeta válido (16 dígitos)",
                  );
                  return;
                }

                if (!fechaVencimiento || fechaVencimiento.length !== 5) {
                  alert(
                    "Por favor ingrese una fecha de vencimiento válida (MM/YY)",
                  );
                  return;
                }

                if (!cvv || cvv.length !== 3) {
                  alert("Por favor ingrese un CVV válido (3 dígitos)");
                  return;
                }

                const asientosIDs = await Promise.all(
                  JSON.parse(asientosSeleccionados).map(async (asiento) => {
                    const { data: asientoData, error: asientoError } =
                      await supabase
                        .from("Asientos")
                        .select("idAsiento")
                        .eq("idEvento", parseInt(eventoId))
                        .eq("Fila", asiento.Fila)
                        .eq("Columna", asiento.Columna)
                        .single();

                    if (asientoError) throw asientoError;
                    if (!asientoData) throw new Error("Asiento no encontrado");
                    return asientoData.idAsiento;
                  }),
                );

                navigation.navigate("planes/confirmacionB", {
                  Title,
                  Description,
                  Imagen,
                  Fecha,
                  Hora,
                  cantidadAsientos,
                  costo,
                  numeroTarjeta: numeroTarjeta.slice(-4),
                  fechaVencimiento,
                  cvv: cvv.slice(-2),
                  asientosSeleccionados: asientosSeleccionados,
                  asientosIDs: JSON.stringify(asientosIDs),
                  idEvento: eventoId,
                });
              } catch (error) {
                console.error("Error al procesar el pago:", error);
                alert(
                  "Error al procesar el pago. Por favor, inténtelo de nuevo.",
                );
              }
            }}
          >
            <Text className="text-white text-center font-bold text-lg">
              Pagar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
