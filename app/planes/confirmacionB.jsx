import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../../supabase/supabase";

export default function ConfirmacionB() {
  const navigation = useNavigation();
  const {
    Title,
    Description,
    Imagen,
    Fecha,
    Hora,
    cantidadAsientos,
    costo,
    numeroTarjeta,
    fechaVencimiento,
    cvv,
    asientosSeleccionados,
    asientosIDs,
    idEvento,
  } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Confirmación",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
      },
    });
  }, [navigation]);

  const costoNumero = typeof costo === "string" ? parseFloat(costo) : costo;

  if (isNaN(costoNumero)) {
    console.error("Error: costo no es un número válido:", costo);
    return null;
  }

  if (typeof idEvento === "undefined") {
    console.error("Error: idEvento es undefined");
    console.error("Parámetros recibidos:", {
      Title,
      idEvento,
      asientosSeleccionados,
    });
    throw new Error("idEvento no recibido correctamente");
  }

  const cantidad = parseInt(cantidadAsientos) || 0;

  console.log("Datos recibidos:", { Title, idEvento, asientosSeleccionados });

  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      <ScrollView className="flex-1 p-4">
        {/* Tarjeta principal */}
        <View className="bg-mediumBlue-800 rounded-xl shadow-md p-6 space-y-4">
          {/* Información del evento */}
          <View className="space-y-2">
            <Text className="text-lg font-semibold text-veryLightBeige-500">
              {Title}
            </Text>
            <Text className="text-gray-800 text-sm">{Description}</Text>
            <Image
              source={{ uri: Imagen }}
              className="w-full h-48 rounded-lg object-cover mt-2"
            />
            <View className="flex-row justify-between items-center text-sm">
              <View>
                <Text className="font-medium text-lightBeige-400">
                  Fecha y hora
                </Text>
                <Text className="text-gray-800">
                  {Fecha} a las {Hora}
                </Text>
              </View>
              <View className="flex-row items-center space-x-1">
                <Text className="text-green-400 font-medium">
                  {cantidad} asientos
                </Text>
              </View>
            </View>
          </View>

          {/* Resumen de compra */}
          <View className="space-y-2 pt-3 border-t border-gray-600">
            <Text className="font-medium text-lightBeige-400">
              Resumen de compra
            </Text>
            <View className="flex-row justify-between items-center text-sm">
              <Text className="text-gray-800">Cantidad de asientos</Text>
              <Text className="font-medium text-veryLightBeige-500">
                {cantidad}
              </Text>
            </View>
            <View className="flex-row justify-between items-center text-sm">
              <Text className="text-gray-800">Costo total</Text>
              <Text className="font-medium text-green-400">
                ${costoNumero.toFixed(2)}
              </Text>
            </View>
            {costoNumero > 0 && (
              <View className="space-y-2 pt-3 border-t border-gray-600">
                <View className="flex-row justify-between items-center text-sm">
                  <Text className="text-gray-800">Tarjeta de crédito</Text>
                  <Text className="font-medium text-veryLightBeige-500">
                    **** {numeroTarjeta.slice(-4)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center text-sm">
                  <Text className="text-gray-800">Fecha de vencimiento</Text>
                  <Text className="font-medium text-veryLightBeige-500">
                    {fechaVencimiento}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center text-sm">
                  <Text className="text-gray-800">CVV</Text>
                  <Text className="font-medium text-veryLightBeige-500">
                    **{cvv}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Asientos seleccionados */}
          <View className="pt-3 border-t border-gray-600">
            <Text className="font-medium text-lightBeige-400 mb-2">
              Asientos seleccionados
            </Text>
            {asientosSeleccionados ? (
              <>
                {JSON.parse(asientosSeleccionados).map((asiento, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between items-center text-sm py-2 border-b border-gray-600"
                  >
                    <View className="flex-1">
                      <Text className="font-medium text-veryLightBeige-500">
                        Clave: {asiento.Fila}
                        {asiento.Columna}
                      </Text>
                      <View className="flex-row space-x-2 mt-1">
                        <Text className="text-gray-800">
                          Fila: {asiento.Fila}
                        </Text>
                        <Text className="text-gray-800">
                          Columna: {asiento.Columna}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-green-900 px-2 py-1 rounded-full">
                      <Text className="text-green-400 font-medium text-xs">
                        Comprado
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View className="flex-1 items-center justify-center py-4">
                <Text className="text-gray-500 text-sm">
                  No hay asientos seleccionados
                </Text>
              </View>
            )}
          </View>

          {/* Botón de confirmación */}
          <TouchableOpacity
            className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 py-3 rounded-lg mt-4"
            onPress={async () => {
              try {
                let asientosParaActualizar = [];
                if (asientosIDs) {
                  asientosParaActualizar = JSON.parse(asientosIDs);
                } else {
                  const asientosSeleccionadosArray = JSON.parse(
                    asientosSeleccionados,
                  );
                  const { data: asientosData, error: fetchError } =
                    await supabase
                      .from("Asientos")
                      .select("idAsiento")
                      .in(
                        "Fila",
                        asientosSeleccionadosArray.map(
                          (asiento) => asiento.Fila,
                        ),
                      )
                      .in(
                        "Columna",
                        asientosSeleccionadosArray.map(
                          (asiento) => asiento.Columna,
                        ),
                      )
                      .eq("idEvento", idEvento);

                  if (fetchError) {
                    throw new Error(
                      "Error al obtener los IDs de los asientos: " +
                        fetchError.message,
                    );
                  }
                  if (!asientosData || asientosData.length === 0) {
                    throw new Error(
                      "No se encontraron los asientos seleccionados",
                    );
                  }
                  asientosParaActualizar = asientosData.map(
                    (asiento) => asiento.idAsiento,
                  );
                }

                const { data: boletajeData, error: boletajeError } =
                  await supabase.from("Boletaje").insert([
                    {
                      idEvento: idEvento,
                      AsientosCantidad: parseInt(cantidadAsientos),
                      AsientosSeleccionados: JSON.stringify(
                        JSON.parse(asientosSeleccionados),
                      ),
                      Costo: parseFloat(costo),
                    },
                  ]);

                if (boletajeError) {
                  throw new Error(
                    "Error al guardar el boletaje: " + boletajeError.message,
                  );
                }

                const asientosSeleccionadosArray = JSON.parse(
                  asientosSeleccionados,
                );
                const { error: updateError } = await supabase
                  .from("Asientos")
                  .update({ Estado: "Ocupado" })
                  .in(
                    "Fila",
                    asientosSeleccionadosArray.map((asiento) => asiento.Fila),
                  )
                  .in(
                    "Columna",
                    asientosSeleccionadosArray.map(
                      (asiento) => asiento.Columna,
                    ),
                  )
                  .eq("idEvento", idEvento);

                if (updateError) {
                  throw new Error(
                    "Error al actualizar los asientos: " + updateError.message,
                  );
                }

                await Alert.alert(
                  "Compra exitosa",
                  "¡Pago confirmado con éxito! Los asientos han sido comprados.",
                );
                navigation.navigate("(tabs)", { screen: "Home" });
              } catch (error) {
                console.error("Error al confirmar la compra:", error);
                await alert(
                  "Error al confirmar la compra. Por favor, inténtelo de nuevo.",
                );
              }
            }}
          >
            <Text className="text-white font-medium text-center text-lg">
              Confirmar compra
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
