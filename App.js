import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView } from "react-native";
import "./global.css";
export default function App() {
  return (
    <View>
      <StatusBar style="auto" />
      <ScrollView>
        <Text>hola</Text>
      </ScrollView>
    </View>
  );
}
