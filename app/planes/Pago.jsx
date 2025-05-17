import { Text, View, Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';

export default function Pago() {
  const { Title, Description, Imagen, Fecha, Hora, asientosSeleccionados, cantidadAsientos } = useLocalSearchParams();
  const navigation = useNavigation();
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [costo, setCosto] = useState(0);

// Eliminar este useEffect ya que la lógica de redirección se maneja en el otro useEffect
  // React.useEffect(() => {
  //   if (costo === 0) {
  //     navigation.navigate('planes/confirmacionB', {
  //       Title,
  //       Description,
  //       Imagen,
  //       Fecha,
  //       Hora,
  //       cantidadAsientos,
  //       costo,
  //       numeroTarjeta: 'GRATIS',
  //       fechaVencimiento: 'N/A',
  //       cvv: 'N/A',
  //       asientosSeleccionados
  //     });
  //   }
  // }, [costo]);

  // Obtener el costo del evento desde Supabase
  useEffect(() => {
    const obtenerCostoEvento = async () => {
      try {
        console.log('Buscando costo para evento:', Title);
        const { data: evento, error: eventoError } = await supabase
          .from('Eventos')
          .select('Costo')
          .eq('Titulo', Title)
          .single();

        if (eventoError) {
          console.error('Error al obtener el costo:', eventoError);
          return;
        }

        if (!evento) {
          console.error('Evento no encontrado:', Title);
          return;
        }

        console.log('Costo base encontrado:', evento.Costo);
        console.log('Cantidad de asientos:', cantidadAsientos);

        // Calcular el costo total (costo por asiento * cantidad de asientos)
        const costoTotal = evento.Costo * (cantidadAsientos || 1);
        console.log('Costo total calculado:', costoTotal);
        
        // Si el costo es 0, redirigir inmediatamente a confirmacionB
        if (costoTotal === 0) {
          setCosto(0);
          return;
        }

        setCosto(costoTotal);
      } catch (error) {
        console.error('Error al obtener el costo:', error);
      }
    };

    if (Title && cantidadAsientos) {
      obtenerCostoEvento();
    }
  }, [Title, cantidadAsientos]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}>
        <View className="w-full p-4">
          <View className="bg-white rounded-lg shadow-md p-3">
            <View className="flex-row">
              <Image
                source={{ uri: Imagen }}
                className="w-32 h-32 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 ml-4 justify-between">
                <View>
                  <Text className="text-lg font-bold mb-1">{Title}</Text>
                  <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                    {Description}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm font-semibold"> {Fecha}</Text>
                  <Text className="text-gray-600 text-sm font-semibold"> {Hora}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Formulario de pago */}
          <View className="w-full mt-8">
            <Text className="text-lg font-bold mb-4 text-center">Ingrese tarjeta de Débito/Crédito para pagar</Text>
            
            {/* Número de tarjeta */}
            <View className="mb-4">
              <TextInput
                placeholder="Número de tarjeta"
                value={numeroTarjeta}
                onChangeText={setNumeroTarjeta}
                keyboardType="numeric"
                maxLength={16}
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
            </View>

            {/* Fecha de vencimiento */}
            <View className="mb-4">
              <TextInput
                placeholder="Fecha de vencimiento (MM/YY)"
                value={fechaVencimiento}
                onChangeText={setFechaVencimiento}
                keyboardType="numeric"
                maxLength={5}
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
            </View>

            {/* CVV */}
            <View className="mb-8">
              <TextInput
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
            </View>

            {/* Botón de pago */}
            <View className="mb-8">
              <Text className="text-lg font-bold mb-2">Costo Final: ${costo.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              className="bg-blue-500 p-3 rounded-lg w-full"
              onPress={async () => {
                try {
                  // Validar que todos los campos estén completos
                  if (!numeroTarjeta || numeroTarjeta.length !== 16) {
                    alert('Por favor ingrese un número de tarjeta válido (16 dígitos)');
                    return;
                  }

                  if (!fechaVencimiento || fechaVencimiento.length !== 5) {
                    alert('Por favor ingrese una fecha de vencimiento válida (MM/YY)');
                    return;
                  }

                  if (!cvv || cvv.length !== 3) {
                    alert('Por favor ingrese un CVV válido (3 dígitos)');
                    return;
                  }

                  // Navegar a la página de confirmación con los datos
                  navigation.navigate('planes/confirmacionB', {
                    Title,
                    Description,
                    Imagen,
                    Fecha,
                    Hora,
                    cantidadAsientos: asientosSeleccionados ? asientosSeleccionados.length : 0,
                    costo,
                    numeroTarjeta: numeroTarjeta.slice(-4), // Solo mostrar los últimos 4 dígitos
                    fechaVencimiento,
                    cvv: cvv.slice(-2), // Solo mostrar los últimos 2 dígitos del CVV
                    asientosSeleccionados: asientosSeleccionados // Ya viene como string de Asientos.jsx
                  });
                } catch (error) {
                  console.error('Error al procesar el pago:', error);
                  alert('Error al procesar el pago. Por favor, inténtelo de nuevo.');
                }
              }}
            >
              <Text className="text-white text-center font-bold">Pagar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}