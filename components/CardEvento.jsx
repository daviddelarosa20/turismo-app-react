import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const CardEvento = ({
  imagen,
  titulo,
  descripcion,
  fecha,
  hora,
  onSelectAsiento,
}) => {
  return (
    <View className="bg-white rounded-lg shadow-md mb-4 overflow-hidden w-[45%]">
      <Image
        source={{ uri: imagen }}
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text className="text-sm font-bold mb-1" numberOfLines={1}>
          {titulo}
        </Text>
        <Text className="text-gray-600 text-xs mb-2" numberOfLines={2}>
          {descripcion}
        </Text>
        <Text className="text-gray-600 text-xs font-bold mb-2">📆 {fecha}</Text>
        <Text className="text-gray-600 text-xs font-bold mb-2">🕤 {hora}</Text>
        <TouchableOpacity
          className="bg-blue-500 px-2 py-1 rounded self-end"
          onPress={onSelectAsiento}
        >
          <Text className="text-white font-bold text-xs">Ver asientos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardEvento;
