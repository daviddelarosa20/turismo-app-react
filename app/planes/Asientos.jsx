import { Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabase';

export default function Asientos() {
  console.log('Componente Asientos renderizado');
  const navigation = useNavigation();
  const { Title, Description, Imagen, Fecha, Hora } = useLocalSearchParams();
  const [asientosSeleccionados, setAsientosSeleccionados] = useState({});
  const [asientosEstado, setAsientosEstado] = useState({});

  // Obtener estados de los asientos desde Supabase
  React.useEffect(() => {
    const obtenerEstadosAsientos = async () => {
      try {
        console.log('Obteniendo estados de asientos desde Supabase');
        
        // Primero, verificar si el título existe
        if (!Title) {
          console.error('No se recibió el título del evento');
          return;
        }

        console.log('Buscando evento con título:', Title);

        const { data: evento, error: eventoError } = await supabase
          .from('Eventos')
          .select('idEvento')
          .eq('Titulo', Title)
          .single();

        if (eventoError) {
          console.error('Error al obtener el evento:', eventoError);
          console.error('Detalles del error:', {
            message: eventoError.message,
            details: eventoError.details,
            hint: eventoError.hint,
            code: eventoError.code
          });
          return;
        }

        if (!evento) {
          console.log('No se encontró evento con el título:', Title);
          return;
        }

        console.log('Evento encontrado:', {
          idEvento: evento.idEvento,
          nombre: Title
        });

        // Ahora obtener los asientos para este evento específico
        const { data: asientos, error } = await supabase
          .from('Asientos')
          .select('Fila, Columna, Estado')
          .eq('idEvento', evento.idEvento)
          .order('idAsiento');

        if (error) {
          console.error('Error al obtener asientos:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          return;
        }

        if (!asientos || asientos.length === 0) {
          console.log('No se encontraron asientos para este evento');
          return;
        }

        // Crear objeto con estados de los asientos
        const estados = {};
        
        // Primero, inicializar todos los asientos como disponibles
        const filas = ['A', 'B', 'C'];
        const columnas = [1, 2, 3, 4, 5];
        filas.forEach(fila => {
          columnas.forEach(col => {
            const seatId = `${fila}${col}`;
            estados[seatId] = true; // Por defecto, asumimos disponible
          });
        });

        // Luego, actualizar según los datos de la base de datos
        if (asientos && asientos.length > 0) {
          console.log('Datos de asientos recibidos:', asientos);
          asientos.forEach(asiento => {
            console.log('Procesando asiento:', asiento);
            if (asiento && asiento.Fila && asiento.Columna) {
              const fila = asiento.Fila.toString();
              const columna = asiento.Columna.toString();
              const seatId = `${fila}${columna}`;
              const estado = asiento.Estado?.toUpperCase();
              estados[seatId] = estado === 'DISPONIBLE';
              console.log(`Asiento ${seatId}: estado = ${asiento.estado}, disponible = ${estados[seatId]}`);
            } else {
              console.log('Asiento inválido encontrado:', asiento);
            }
          });
        } else {
          console.log('No se encontraron asientos en la base de datos');
        }

        // Verificar el estado final de cada asiento
        filas.forEach(fila => {
          columnas.forEach(col => {
            const seatId = `${fila}${col}`;
            console.log(`Estado final de asiento ${seatId}: ${estados[seatId]}`);
          });
        });

        setAsientosEstado(estados);
        console.log('Estado final de asientos:', estados);
      } catch (error) {
        console.error('Error en obtenerEstadosAsientos:', error);
      }
    };

    obtenerEstadosAsientos();
  }, []);

  // Función para cambiar el estado de un asiento
  const toggleAsiento = (id) => {
    console.log(`Intentando cambiar estado de asiento ${id}`);
    // Solo permite cambiar el estado si el asiento está disponible
    if (asientosEstado[id]) {
      setAsientosSeleccionados((prev) => ({
        ...prev,
        [id]: !prev[id]
      }));
    }
  };

  // Función para actualizar el estado de los asientos en la base de datos
  const confirmarCompra = async () => {
    try {
      // Obtener el id del evento
      const { data: evento, error: eventoError } = await supabase
        .from('Eventos')
        .select('idEvento')
        .eq('Titulo', Title)
        .single();

      if (eventoError) throw eventoError;
      if (!evento) throw new Error('Evento no encontrado');

      // Obtener los asientos seleccionados
      const asientosSeleccionadosArray = Object.entries(asientosSeleccionados)
        .filter(([_, seleccionado]) => seleccionado)
        .map(([id]) => {
          const fila = id[0];
          const columna = parseInt(id.slice(1));
          return { Fila: fila, Columna: columna };
        });

      if (asientosSeleccionadosArray.length === 0) {
        Alert.alert('Error', 'Por favor seleccione al menos un asiento');
        return;
      }

      // Obtener el costo del evento y el idEvento
      const { data: eventoData, error: eventoError1 } = await supabase
        .from('Eventos')
        .select('Costo, idEvento')
        .eq('Titulo', Title)
        .single();

      if (eventoError1) throw eventoError1;
      if (!eventoData) throw new Error('Evento no encontrado');
      if (!eventoData.idEvento) throw new Error('No se encontró el idEvento');

      // Guardar el idEvento y el costo en variables para usarlas en la navegación
      const eventoId = eventoData.idEvento;
      const costoTotal = eventoData.Costo * asientosSeleccionadosArray.length;
      console.log('Costo total calculado:', costoTotal);

      console.log('Datos del evento:', { 
        costo: eventoData.Costo,
        idEvento: eventoData.idEvento,
        titulo: Title
      });

      // Si el evento es gratuito, redirigir directamente a confirmacionB
      if (costoTotal === 0) {
        navigation.navigate('planes/confirmacionB', {
          Title,
          Description,
          Imagen,
          Fecha,
          Hora,
          asientosSeleccionados: JSON.stringify(asientosSeleccionadosArray),
          cantidadAsientos: asientosSeleccionadosArray.length,
          costo: 0,
          numeroTarjeta: 'GRATIS',
          fechaVencimiento: 'N/A',
          cvv: 'N/A',
          asientosSeleccionados: JSON.stringify(asientosSeleccionadosArray),
          asientosIDs: JSON.stringify(asientosSeleccionadosArray.map(asiento => asiento.Fila + asiento.Columna)),
          idEvento: eventoId // Usar la variable guardada
        });
        return;
      }

      // Obtener los asientos seleccionados
      const { data: asientosData, error: fetchError } = await supabase
        .from('Asientos')
        .select('*')
        .eq('idEvento', evento.idEvento)
        .in('Fila', asientosSeleccionadosArray.map(asiento => asiento.Fila))
        .in('Columna', asientosSeleccionadosArray.map(asiento => asiento.Columna));

      if (fetchError) throw fetchError;
      if (!asientosData || asientosData.length === 0) {
        Alert.alert('Error', 'No se encontraron asientos con los criterios especificados');
        return;
      }

      if (fetchError) throw fetchError;
      if (!asientosData || asientosData.length === 0) {
        Alert.alert('Error', 'No se encontraron asientos con los criterios especificados');
        return;
      }

      const asientosActualizados = asientosData.map(asiento => ({
        idAsiento: asiento.idAsiento,
        idEvento: evento.idEvento
      }));

      // Pasamos los datos necesarios para la actualización
      navigation.navigate('planes/Pago', {
        Title,
        Description,
        Imagen,
        Fecha,
        Hora,
        asientosSeleccionados: JSON.stringify(asientosSeleccionadosArray),
        cantidadAsientos: asientosSeleccionadosArray.length,
        costoTotal: costoTotal,
        asientosIDs: JSON.stringify(asientosData.map(asiento => asiento.idAsiento)),
        idEvento: eventoId // Usar el eventoId obtenido
      });

      // Limpiar los asientos seleccionados después de la navegación
      setAsientosSeleccionados([]);
      setAsientosEstado({});

      Alert.alert('¡Listo!', 'Selecciona los datos de tu tarjeta para continuar');
      
      // No necesitamos el segundo Alert.alert aquí, ya que la confirmación se maneja en confirmacionB
      // Alert.alert('Éxito', 'Compra realizada con éxito');

      // Ya navegamos arriba, no necesitamos hacerlo dos veces
      // navigation.navigate('planes/Pago', {
      //   Title,
      //   Description,
      //   Imagen,
      //   Fecha,
      //   Hora,
      //   asientosSeleccionados: JSON.stringify(asientosSeleccionadosArray.map(asiento => ({
      //     Fila: asiento.Fila,
      //     Columna: asiento.Columna
      //   }))),
      //   cantidadAsientos: asientosSeleccionadosArray.length
      // });

      // Limpiar los asientos seleccionados después de la navegación
      setAsientosSeleccionados([]);
      setAsientosEstado({});

      Alert.alert('¡Listo!', 'Selecciona los datos de tu tarjeta para continuar');
    } catch (error) {
      console.error('Error al confirmar compra:', error);
      Alert.alert('Error', 'No se pudo completar la compra. Por favor, inténtelo nuevamente.');
      return;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Selecciona asiento",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);

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
        </View>

        {/* Escritorio */}
        <View className="w-2/6 bg-gray-700 py-4 rounded-xl mb-8 items-center">
          <Text className="text-white font-bold text-lg">Escenario</Text>
        </View>

        {/* Asientos */}
        <View className="items-center mt-10">
          {['A', 'B', 'C'].map((row) => (
            <View key={row} className="flex-row mb-4">
              {[1, 2, 3, 4, 5].map((col) => {
                const seatId = `${row}${col}`;
                const seleccionado = asientosSeleccionados[seatId] || false;
                const disponible = asientosEstado[seatId]; 
                console.log(`Renderizando asiento ${seatId}: seleccionado = ${seleccionado}, disponible = ${disponible}`);

                return (
                  <TouchableOpacity
                    key={seatId}
                    onPress={() => {
                      // Solo permitir seleccionar si el asiento está disponible
                      if (disponible) {
                        toggleAsiento(seatId);
                      }
                    }}
                    className={`w-12 h-12 mx-1 rounded-lg justify-center items-center ${
                      !disponible ? 'bg-gray-400 opacity-50' : 
                      seleccionado ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    disabled={!disponible}
                  >
                    <Text className="text-white font-bold">{seatId}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      
      {/* Botón de confirmar compra */}
      <View className="mt-4 w-full">
        <TouchableOpacity
          onPress={confirmarCompra}
          className="bg-green-500 p-3 rounded-lg w-full"
        >
          <Text className="text-white text-center font-bold">
            Confirmar Compra
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}