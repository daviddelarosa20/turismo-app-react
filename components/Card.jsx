import { Text, View, Image, TouchableOpacity } from "react-native";

export default function Card({
  imageUrl = "https://via.placeholder.com/300x200",
  title = "Título de la tarjeta",
  description = "Descripción de la tarjeta que puede ocupar varias líneas de texto para mostrar información detallada.",
  direccion = "Dirección de la tarjeta",
  buttonText = "Ver más",
  onPress = () => console.log("Botón presionado"),
}) {
  return (
    <View className="bg-white rounded-xl shadow-md overflow-hidden w-[90%] mx-auto my-3">
      {/* Imagen */}
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", height: 192 }}
        resizeMode="cover"
      />

      {/* Contenido */}
      <View className="p-4">
        {/* Título */}
        <Text className="text-xl font-bold text-gray-800 mb-2">{title}</Text>

        {/* Descripción */}
        <Text className="text-gray-600 mb-4">{description}</Text>

        {/* Dirección */}
        <Text className="text-gray-600 mb-4">{direccion}</Text>

        {/* Contenedor para botón alineado a la derecha */}
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={onPress}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
