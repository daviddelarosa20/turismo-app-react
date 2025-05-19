import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#e1dcd0" },
          headerLeft: () => (
            <View className="items-center justify-center ml-3">
              <TouchableOpacity onPress={() => alert("Menu")}>
                <Feather name="menu" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View className="items-center justify-center mr-3 rounded-full bg-slate-100 p-2">
              <TouchableOpacity
                onPress={() => {
                  router.push("/extras/Perfil");
                }}
              >
                <AntDesign name="user" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            title: "Configuración",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
