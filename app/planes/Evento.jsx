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
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);
  useEffect(() => {
    getEventos();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View>
          <View className="w-full mt-5 mb-2">
            <Text className="text-xl font-bold mb-2 ml-5">
              Eventos disponibles
            </Text>
            <View className="flex-row flex-wrap justify-evenly px-2">
              {eventos.map((evento, index) => (
                <CardEvento
                  key={index}
                  imagen={evento.Image}
                  titulo={evento.Titulo}
                  descripcion={evento.Descripcion}
                  fecha={evento.Fecha}
                  hora={evento.Hora}
                  onSelectAsiento={() => {
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
                />
              ))}
            </View>
            {/*<Text className="text-xl font-bold mb-2 ml-5">
              Selecciona fecha
            </Text>
            <View className="mt-3 w-full items-center justify-center gap-3">
              <Calendario
                onFechaSeleccionada={(fecha) => {
                  setFechaSeleccionada(fecha);
                  console.log(fecha);
                }}
              />
            </View> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
