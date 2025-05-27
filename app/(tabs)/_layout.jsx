import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { View, TouchableOpacity, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const Colors = {
  darkBlue: "#292d32",
  mediumBlue: "#3E5879",
  lightBeige: "#F5EFE7",
  veryLightBeige: "#F5EFE7",
};

export default function Layout() {
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);

  useEffect(() => {
    const getUserSession = async () => {
      try {
        const session = await AsyncStorage.getItem("userSession");
        if (session) {
          const userData = JSON.parse(session);
          setUserSession(userData);
        }
      } catch (error) {
        console.error("Error al obtener sesión:", error);
      }
    };

    getUserSession();
  }, []);
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

          headerRight: () => (
            <View className="items-center justify-center mr-3 rounded-full bg-mediumBlue p-2">
              <TouchableOpacity
                onPress={() => {
                  if (userSession && userSession.idUser) {
                    router.push({
                      pathname: "/extras/Perfil",
                      params: { idUser: String(userSession.idUser) },
                    });
                  } else {
                    alert("No se pudo obtener la información del usuario");
                  }
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
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" size={size} color={color} />
            ),
            headerTitle: "Inicio",
          }}
        />
        <Tabs.Screen
          name="Search"
          options={{
            title: "Buscar",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="search1" size={size} color={color} />
            ),
            headerTitle: "Buscar",
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            title: "Configuración",
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
}
