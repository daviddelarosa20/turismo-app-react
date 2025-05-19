import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Platform } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

const router = useRouter();

const Colors = {
  darkBlue: "#292d32",
  mediumBlue: "#3E5879",
  lightBeige: "#F5EFE7",
  veryLightBeige: "#F5EFE7",
};

export default () => {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: Colors.darkBlue },
          headerTintColor: Colors.veryLightBeige,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 28,
          },
          headerLeft: () => (
            <View className="items-center justify-center ml-3">
              <TouchableOpacity onPress={() => alert("Menu")}>
                <Feather name="menu" size={24} color={Colors.veryLightBeige} />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View className="items-center justify-center mr-3 rounded-full bg-mediumBlue p-2">
              <TouchableOpacity
                onPress={() => {
                  router.push("/extras/Perfil");
                }}
              >
                <AntDesign
                  name="user"
                  size={24}
                  color={Colors.veryLightBeige}
                />
              </TouchableOpacity>
            </View>
          ),
          tabBarStyle: {
            backgroundColor: Colors.darkBlue,
            borderTopWidth: 0,
            height: 65,
            paddingTop: 5,
            paddingBottom: Platform.OS === "ios" ? 0 : 0,
          },
          tabBarHideOnKeyboard: true,
          tabBarInactiveTintColor: Colors.lightBeige,
          tabBarActiveTintColor: Colors.veryLightBeige,
          tabBarShowIcon: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
            headerTitle: "Inicio",
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
            headerTitle: "Search",
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="setting" size={size} color={color} />
            ),
            headerTitle: "Configuración",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 28,
            },
            headerStyle: { backgroundColor: Colors.darkBlue },
            headerTintColor: Colors.veryLightBeige,
          }}
        />
      </Tabs>
    </>
  );
};
