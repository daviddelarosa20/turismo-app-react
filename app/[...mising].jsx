import { Link } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "No encontrado",
      headerStyle: { backgroundColor: "#282d33" },
      headerTitleAlign: "center",
      headerTintColor: "#F5EFE7",
    });
  }, [navigation]);
  return (
    <SafeAreaView className="flex-1 bg-darkBlue-900">
      <View className="flex-1 items-center justify-center p-6 bg-darkBlue-900">
        <Image
          source={{
            uri: "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//NFImage.jpg",
          }}
          className="w-64 h-64 mb-8"
          resizeMode="contain"
        />

        <Text className="text-2xl font-bold text-darkBlue-900 mb-2 text-center">
          ¡Ups! Página no encontrada
        </Text>

        <Text className="text-gray-600 text-center text-base mb-8 px-4">
          ¡La página que estás buscando no existe!
        </Text>
        <View className="bg-darkBlue-900 px-8 py-3 rounded-full">
          <TouchableOpacity
            className="bg-cyan-700 px-8 py-3 rounded-full"
            onPress={() => router.push("/")}
          >
            <Text className="text-white font-semibold text-base">
              Volver al inicio
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
