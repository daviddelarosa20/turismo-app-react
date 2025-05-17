import { Text, View, Image, SafeAreaView, ScrollView } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router";

export default function Asientos() {
  const navigation = useNavigation();
  const { Title, Description, Imagen, Fecha, Hora } = useLocalSearchParams();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Selecciona asiento",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
    });
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
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
                  <Text
                    className="text-gray-600 text-sm mb-2"
                    numberOfLines={2}
                  >
                    {Description}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm font-semibold">
                    📆 {Fecha}
                  </Text>
                  <Text className="text-gray-600 text-sm font-semibold">
                    🕤 {Hora}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
