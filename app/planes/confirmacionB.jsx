import { Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from 'react';
import { supabase } from '../../supabase/supabase';

export default function ConfirmacionB() {
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
    idEvento
  } = useLocalSearchParams();

  // Verificar si el idEvento es undefined
  if (typeof idEvento === 'undefined') {
    console.error('Error: idEvento es undefined');
    console.error('Parámetros recibidos:', {
      Title,
      idEvento,
      asientosSeleccionados
    });
    throw new Error('idEvento no recibido correctamente');
  }

  // Convertir strings a números cuando sea necesario
  const cantidad = parseInt(cantidadAsientos) || 0;
  // Usar el costo directamente del parámetro, ya que ya es un número

  console.log('Datos recibidos:', {
    Title,
    idEvento,
    asientosSeleccionados
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Tarjeta principal */}
          <View className="bg-white rounded-xl shadow-md p-4">
            <View className="space-y-3">
              {/* Información del evento */}
              <View className="space-y-2">
                <Text className="text-lg font-semibold text-gray-800">{Title}</Text>
                <Text className="text-gray-600 text-sm">{Description}</Text>
                <Image
                  source={{ uri: Imagen }}
                  className="w-full h-48 rounded-lg object-cover mt-2"
                />
                <View className="flex-row justify-between items-center text-sm">
                  <View>
                    <Text className="font-medium text-gray-800">Fecha y Hora</Text>
                    <Text className="text-gray-600">{Fecha} a las {Hora}</Text>
                  </View>
                  <View className="flex-row items-center space-x-1">
                    <Text className="text-green-500 font-medium">{cantidad} asientos</Text>
                  </View>
                </View>
              </View>

              {/* Resumen de compra */}
              <View className="space-y-2 pt-3 border-t border-gray-200">
                <Text className="font-medium text-gray-800">Resumen de compra</Text>
                <View className="flex-row justify-between items-center text-sm">
                  <Text className="text-gray-600">Cantidad de asientos</Text>
                  <Text className="font-medium">{cantidad}</Text>
                </View>
                <View className="flex-row justify-between items-center text-sm">
                  <Text className="text-gray-600">Costo total</Text>
                  <Text className="font-medium text-green-600">${costo}</Text>
                </View>
                {costo > 0 && (
                  <View className="space-y-2">
                    <View className="flex-row justify-between items-center text-sm border-t border-gray-200 pt-2">
                      <Text className="text-gray-600">Tarjeta de crédito</Text>
                      <Text className="font-medium">**** {numeroTarjeta.slice(-4)}</Text>
                    </View>
                    <View className="flex-row justify-between items-center text-sm">
                      <Text className="text-gray-600">Fecha de Vencimiento</Text>
                      <Text className="font-medium">{fechaVencimiento}</Text>
                    </View>
                    <View className="flex-row justify-between items-center text-sm">
                      <Text className="text-gray-600">CVV</Text>
                      <Text className="font-medium">**{cvv}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Asientos seleccionados */}
              <View className="pt-3 border-t border-gray-200">
                <Text className="font-medium text-gray-800">Asientos seleccionados</Text>
                {asientosSeleccionados ? (
                  <>
                    {JSON.parse(asientosSeleccionados).map((asiento, index) => (
                      <View key={index} className="flex-row justify-between items-center text-sm py-2 border-b border-gray-200">
                        <View className="flex-1">
                          <Text className="font-medium text-gray-800">Clave: {asiento.Fila}{asiento.Columna}</Text>
                          <View className="flex-row space-x-2 mt-1">
                            <Text className="text-gray-600">Fila: {asiento.Fila}</Text>
                            <Text className="text-gray-600">Columna: {asiento.Columna}</Text>
                          </View>
                        </View>
                        <View className="bg-green-100 px-2 py-1 rounded-full">
                          <Text className="text-green-600 font-medium text-xs">Reservado</Text>
                        </View>
                      </View>
                    ))}
                  </>
                ) : (
                  <View className="flex-1 items-center justify-center py-4">
                    <Text className="text-gray-500 text-sm">No hay asientos seleccionados</Text>
                  </View>
                )}
              </View>

              {/* Botón de confirmación */}
              <TouchableOpacity
                className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 py-3 rounded-lg mt-4"
                onPress={async () => {
                  try {
                    // Si hay IDs de asientos, usarlos directamente
                    let asientosParaActualizar = [];
                    if (asientosIDs) {
                      asientosParaActualizar = JSON.parse(asientosIDs);
                    } else {
                      // Si no hay IDs, obtenerlos usando los datos de los asientos seleccionados
                      const asientosSeleccionadosArray = JSON.parse(asientosSeleccionados);
                      const { data: asientosData, error: fetchError } = await supabase
                        .from('Asientos')
                        .select('idAsiento')
                        .in('Fila', asientosSeleccionadosArray.map(asiento => asiento.Fila))
                        .in('Columna', asientosSeleccionadosArray.map(asiento => asiento.Columna))
                        .eq('idEvento', idEvento);

                      if (fetchError) {
                        throw new Error('Error al obtener los IDs de los asientos: ' + fetchError.message);
                      }
                      if (!asientosData || asientosData.length === 0) {
                        throw new Error('No se encontraron los asientos seleccionados');
                      }
                      asientosParaActualizar = asientosData.map(asiento => asiento.idAsiento);
                    }

                    // Actualizar los asientos a ocupados usando Fila y Columna
                    const asientosSeleccionadosArray = JSON.parse(asientosSeleccionados);
                    console.log('Actualizando asientos:', {
                      asientos: asientosSeleccionadosArray,
                      idEvento,
                      filas: asientosSeleccionadosArray.map(asiento => asiento.Fila),
                      columnas: asientosSeleccionadosArray.map(asiento => asiento.Columna)
                    });
                    
                    const { error: updateError } = await supabase
                      .from('Asientos')
                      .update({ Estado: 'Ocupado' })
                      .in('Fila', asientosSeleccionadosArray.map(asiento => asiento.Fila))
                      .in('Columna', asientosSeleccionadosArray.map(asiento => asiento.Columna))
                      .eq('idEvento', idEvento);

                    if (updateError) {
                      throw new Error('Error al actualizar los asientos: ' + updateError.message);
                    }

                    // Mostrar mensaje de éxito
                    await alert('Pago confirmado con éxito! Los asientos han sido reservados.');
                    
                    // Navegar al grupo de tabs y luego a la pantalla de Home
                    navigation.navigate('/(tabs)/Home');
                  } catch (error) {
                    console.error('Error al confirmar la reserva:', error);
                    await alert('Error al confirmar la reserva. Por favor, inténtelo de nuevo.');
                  }
                }}
              >
                <Text className="text-white font-medium text-center text-sm">Confirmar Reserva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}