import { useRouter, useLocalSearchParams } from "expo-router";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";

export default function Notificaciones() {
  const navigation = useNavigation();
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "¡Bienvenido a la aplicación!",
      message: "Explora todas las funciones que tenemos para ti.",
      read: false, // This property is no longer used for visual styling
      timestamp: "2025-05-21T08:00:00Z",
    },
    {
      id: "2",
      title: "Próximos eventos en tu ciudad",
      message: "No te pierdas los eventos y promociones cercanas.",
      read: true, // This property is no longer used for visual styling
      timestamp: "2025-05-20T11:00:00Z",
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Notificaciones",
      headerStyle: { backgroundColor: "#282d33" },
      headerTintColor: "#F5EFE7",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="ml-3 p-2 rounded-full bg-slate-800"
        >
          <Ionicons name="arrow-back" size={24} color="#F5EFE7" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  return (
    <View className="flex-1 bg-darkBlue-900">
      <ScrollView className="flex-1 p-4">
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Ionicons
              name="notifications-off-outline"
              size={60}
              color="#6B7280"
            />
            <Text className="text-lightBeige-400 text-lg mt-4">
              No tienes notificaciones
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              // All notifications will now have this consistent styling
              className="mb-3 p-4 rounded-lg flex-row items-start bg-slate-200 border-l-4 border-gray-100"
              onPress={() => markAsRead(notification.id)}
              activeOpacity={0.8}
            >
              <View className="mr-3 mt-1">
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#1F2A38"
                />{" "}
                {/* A soft white color for the icon */}
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold text-gray-800" // Soft white for title
                >
                  {notification.title}
                </Text>
                <Text
                  className="mt-1 text-base text-gray-800" // A slightly darker soft white for message
                  numberOfLines={2}
                >
                  {notification.message}
                </Text>
                <Text className="text-xs text-gray-600 mt-2">
                  {new Date(notification.timestamp).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                  {", "}
                  {new Date(notification.timestamp).toLocaleTimeString(
                    "es-ES",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    },
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
