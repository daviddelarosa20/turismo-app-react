import { Text, View, Image, TouchableOpacity } from "react-native";

const Colors = {
  darkBlue: "#1a1e22",
  mediumBlue: "#3E5879",
  lightBeige: "#D8C4B6",
  veryLightBeige: "#F5EFE7",
};

export default function Card({
  imageUrl = "https://via.placeholder.com/300x200",
  title = "Título de la tarjeta",
  description = "Descripción de la tarjeta que puede ocupar varias líneas de texto para mostrar información detallada.",
  direccion = "Dirección de la tarjeta",
  buttonText = "Ver más",
  onPress = () => console.log("Botón presionado"),
}) {
  return (
    <View
      style={{ backgroundColor: Colors.veryLightBeige }}
      className="rounded-xl shadow-md overflow-hidden w-[90%] mx-auto my-3"
    >
      {/* Imagen */}
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", height: 192 }}
        resizeMode="cover"
      />

      {/* Contenido */}
      <View className="p-4">
        {/* Título*/}
        <Text
          style={{ color: Colors.darkBlue }}
          className="text-xl font-bold mb-2"
        >
          {title}
        </Text>

        {/* Descripción */}
        <Text style={{ color: Colors.mediumBlue }} className="mb-4">
          {description}
        </Text>

        {/* Dirección */}
        <Text style={{ color: Colors.mediumBlue }} className="mb-4">
          {direccion}
        </Text>

        {/* Contenedor para botón alineado a la derecha */}
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={onPress}
            // Fondo del botón: usa mediumBlue
            style={{ backgroundColor: Colors.mediumBlue }}
            className="px-4 py-2 rounded-lg"
          >
            {/* Texto del botón: usa veryLightBeige */}
            <Text
              style={{ color: Colors.veryLightBeige }}
              className="font-medium"
            >
              {buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
