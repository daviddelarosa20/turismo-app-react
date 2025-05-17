import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={({ route }) => {
          const isTab = ["Home", "Search", "Settings"].includes(route.name);
          return {
            headerShown: isTab,
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#e1dcd0" },
            headerLeft: isTab
              ? () => (
                  <View className="ml-3">
                    <TouchableOpacity onPress={() => alert("Menu")}>
                      <Feather name="menu" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                )
              : undefined,
            headerRight: isTab
              ? () => (
                  <View className="mr-3 rounded-full bg-slate-100 p-2">
                    <TouchableOpacity onPress={() => router.push("/extras/Perfil")}>
                      <AntDesign name="user" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                )
              : undefined,
          };
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

        <Tabs.Screen
          name="extras/Perfil"             
          options={{
            tabBarButton: () => null,
            headerShown: true,
            headerTitle: "Editar perfil",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#e1dcd0" },
            headerTintColor: "black",
          }}
        />
      </Tabs>
    </>
  );
}
