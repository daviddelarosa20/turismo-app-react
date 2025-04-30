import { useLocalSearchParams } from "expo-router";
import { Text, View, Image, TouchableOpacity } from "react-native";

import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function PlanBasico() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Detalle",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
      headerRight: () => (
        <View className="items-center justify-center mr-3 rounded-full bg-slate-100 p-2">
          <TouchableOpacity onPress={() => alert("Perfil")}>
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  const { title, description, direccion, imageUrl } = useLocalSearchParams();

  return (
    <View>
      <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
      <Text>{title}</Text>
      <Text>{description}</Text>
      <Text>{direccion}</Text>
    </View>
  );
}
