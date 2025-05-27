import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsRow = ({ icon, text, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between py-3"
  >
    <View className="flex-row items-center">
      <Icon name={icon} size={22} color="#FFF" className="mr-4" />
      <Text className="text-white text-lg">{text}</Text>
    </View>
    <Icon name="chevron-right" size={22} color="#9ca3af" />
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1e22]">
      <StatusBar barStyle="light-content" backgroundColor="#1a1e22" />

      <View className="px-6 pt-10 flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sección GENERAL */}
          <Text className="text-[#9ca3af] font-semibold mb-4 text-sm">
            GENERAL
          </Text>
          <View className="bg-[#2a2e33] rounded-xl p-4 mb-4">
            <SettingsRow
              icon="bell-outline"
              text="Notificaciones"
              onPress={() => navigateTo("/settings/notificaciones")}
            />
            <View className="border-b border-[#3a3f44] my-2" />
            <SettingsRow
              icon="gift-outline"
              text="Cupones"
              onPress={() => navigateTo("/settings/cupones")}
            />
            <View className="border-b border-[#3a3f44] my-2" />
            <SettingsRow
              icon="robot-outline"
              text="Ayuda"
              onPress={() => {
                router.push("/help/helpcenter");
              }}
            />
            <View className="border-b border-[#3a3f44] my-2" />
            <SettingsRow
              icon="logout"
              text="Cerrar sesión"
              onPress={() => {
                console.log("Cerrar sesión");
                router.replace("/login/login");
              }}
            />
          </View>

          {/* Sección FEEDBACK */}
          <Text className="text-[#9ca3af] font-semibold mb-4 text-sm">
            FEEDBACK
          </Text>
          <View className="bg-[#2a2e33] rounded-xl p-4 mb-8">
            <SettingsRow
              icon="alert-circle-outline"
              text="Reportar un bug"
              onPress={() => navigateTo("/settings/report-bug")}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
