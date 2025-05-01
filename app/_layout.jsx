import { Stack } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Las demás pantallas usarán el header por defecto */}
    </Stack>
  );
};

export default StackLayout;
