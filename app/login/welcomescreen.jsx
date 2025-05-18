import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-[#1a1e22]">
      <StatusBar barStyle="light-content" backgroundColor="#1a1e22" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        horizontal={false}
      >
        <View className="flex-1 items-center justify-between px-6 mb-10">
          <View className="items-center w-full ">
            <Image
              source={require("../../assets/grupo-gente.png")}
              resizeMode="contain"
              style={{
                width: "100%",
                maxWidth: 400,
                aspectRatio: 1.2,
                marginBottom: 5,
              }}
            />
            <Text
              className={`text-white font-bold text-center mb-4 ${
                width < 400 ? "text-2xl" : "text-4xl"
              }`}
            >
              Social Chatter Team.
            </Text>
            <Text className="text-white text-base text-center leading-6 px-2">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum
            </Text>
          </View>
          <View className="w-full flex-row justify-center mt-10 py-4">
            <TouchableOpacity
              className="flex-1 py-4 border border-white rounded-full items-center mr-2"
              onPress={() => router.push("/login/login")}
            >
              <Text className="text-white font-semibold text-lg">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-4 bg-white rounded-full items-center ml-2"
              onPress={() => router.push("/login/signup")}
            >
              <Text className="text-black font-semibold text-lg">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
