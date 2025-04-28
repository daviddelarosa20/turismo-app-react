import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default () => {
  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1D4ED8",
          tabBarStyle: {
            backgroundColor: "#e1dcd0",
            position: "absolute",
            bottom: 0,
          },
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#e1dcd0",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => alert("Botón izquierdo presionado")}
            >
              <View className="ml-6">
                <Feather name="menu" size={24} color="black" />
              </View>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert("Botón derecho presionado")}>
              <View className="w-10 h-10 mr-4 rounded-full bg-slate-300 items-center justify-center">
                <AntDesign name="user" size={28} color="black" />
              </View>
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};
