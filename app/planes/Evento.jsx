import { Text, View, ScrollView, SafeAreaView } from "react-native";
import Calendario from "../../components/Calendario";
import { TouchableOpacity } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useState, useLayoutEffect, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import CardEvento from "../../components/CardEvento";

export default function Evento() {
  const navigation = useNavigation();
  const router = useRouter();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [eventos, setEventos] = useState([]);

  const getEventos = async () => {
    let { data: Eventos, error } = await supabase
      .from("Eventos")
      .select("Titulo,Image,Descripcion,Fecha,Hora");
    if (error) {
      console.log(error);
    } else {
      setEventos(Eventos);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cartelera",
      headerStyle: { backgroundColor: "#282d33" },
      headerTitleAlign: "center",
      headerTintColor: "#F5EFE7",
    });
  }, [navigation]);

  useEffect(() => {
    getEventos();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      <ScrollView className="flex-1 p-4">
        <View>
          <View className="mb-6">
            <Text className="text-2xl font-bold text-veryLightBeige-500 mb-4">
              Eventos disponibles
            </Text>
            <View className="gap-y-4">
              {" "}
              {/* Usamos solo gap-y para el espaciado vertical */}
              {eventos.map((evento, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    router.push({
                      pathname: `/planes/Asientos`,
                      params: {
                        Title: evento.Titulo,
                        Description: evento.Descripcion,
                        Imagen: evento.Image,
                        Fecha: evento.Fecha,
                        Hora: evento.Hora,
                      },
                    });
                  }}
                  className="w-full mb-4" // Cada tarjeta ocupa el ancho completo
                >
                  <CardEvento
                    imagen={evento.Image}
                    titulo={evento.Titulo}
                    descripcion={evento.Descripcion}
                    fecha={evento.Fecha}
                    hora={evento.Hora}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sección del calendario (opcional) */}
          {/* <View className="mb-8">
            <Text className="text-xl font-bold text-veryLightBeige-500 mb-4">
              Selecciona fecha
            </Text>
            <View className="w-full items-center justify-center">
              <Calendario
                onFechaSeleccionada={(fecha) => {
                  setFechaSeleccionada(fecha);
                  console.log(fecha);
                }}
              />
            </View>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
