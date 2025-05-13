// app/empresa/Perfil.jsx
import { View, Text, ScrollView, Image } from "react-native";
import { useState } from "react";

export default function PerfilEmpresa() {
  const [empresa] = useState({
    nombre: "Café Durango",
    calificacion: 4.5,
    visitas: 1234,
    comentariosNuevos: 5,
    direccion: "Calle Ficticia #123, Durango",
    logo: "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Teatro.jpg",
    horarios: {
      lunesViernes: "9:00 - 18:00",
      sabado: "10:00 - 14:00",
      domingo: "Cerrado"
    },
    comentarios: [
      { usuario: "Juan", texto: "Muy buen servicio" },
      { usuario: "Ana", texto: "Excelente atención y lugar" },
    ],
  });

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-4">
      <View className="bg-white rounded-2xl p-4 shadow mb-4 ">
        <Image
          source={{ uri: empresa.logo }}
          className="w-24 h-24 rounded-full mb-3"
        />
        <Text className="text-xl font-bold mb-1">{empresa.nombre}</Text>
        <Text className="text-yellow-500 text-base mb-1">⭐ {empresa.calificacion} / 5</Text>
        <Text className="text-gray-600">Visitas: {empresa.visitas}</Text>
        <Text className="text-gray-600">Nuevos comentarios: {empresa.comentariosNuevos}</Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow mb-4">
        <Text className="text-lg font-bold mb-2">Datos generales</Text>
        <Text className="text-gray-700">Dirección:</Text>
        <Text>{empresa.direccion}</Text>
        <Text className="mt-2 text-gray-700">Horarios:</Text>
        <Text>Lunes a Viernes: {empresa.horarios.lunesViernes}</Text>
        <Text>Sábado: {empresa.horarios.sabado}</Text>
        <Text>Domingo: {empresa.horarios.domingo}</Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow mb-4">
        <Text className="text-lg font-bold mb-2">Estadísticas</Text>
        <Text className="text-gray-600">[Estadísticas]</Text>
      </View>

      <View className="bg-white rounded-2xl p-4 shadow mb-8">
        <Text className="text-lg font-bold mb-2">Comentarios recientes</Text>
        {empresa.comentarios.map((c, idx) => (
          <View key={idx} className="border-b border-gray-200 py-2">
            <Text className="font-semibold">{c.usuario}</Text>
            <Text className="text-gray-700">{c.texto}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}