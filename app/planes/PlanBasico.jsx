import { useLocalSearchParams } from "expo-router";
import { Text, View, Image } from "react-native";

export default function PlanBasico() {
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
