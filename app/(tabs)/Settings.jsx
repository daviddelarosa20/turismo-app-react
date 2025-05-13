import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Settings() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      

      {/* BOTÓN DE SERVICIO DE AYUDA */}
      <Link href="/help/helpcenter" asChild>
        <TouchableOpacity className="bg-white-500 px-4 py-2 rounded">
          <Text className="text-black text-lg">Servicio de ayuda</Text>
        </TouchableOpacity>
      </Link>
    </View> 
  );
}
