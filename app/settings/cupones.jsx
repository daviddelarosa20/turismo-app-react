import { useRouter, useLocalSearchParams } from "expo-router";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Cupones() {
  const navigation = useNavigation();
  const router = useRouter();

  const [cupones, setCupones] = useState([
    {
      id: "1",
      title: "20% de descuento en pasteles",
      description:
        "Válido en la compra de pasteles grandes. Solo para nuestros usuarios.",
      code: "PASTEL20",
      expires: "2025-06-30T23:59:59Z",
      image:
        "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//pastel.jpeg",
    },

    {
      id: "3",
      title: "Postre gratis a los nuevos usuarios",
      description:
        "Presenta este cupón en tu sucursal más cercana, aplican té rminos y condiciones.",
      code: "POSTREGRATIS",
      expires: "2025-06-10T23:59:59Z",
      image:
        "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//PostreFresa.jpeg",
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Cupones", // Updated title
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

  const copyCouponCode = (code) => {
    alert(`Código de cupón copiado: ${code}`);
  };

  return (
    <View className="flex-1 ">
      <ScrollView className="flex-1 p-4">
        {cupones.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <MaterialCommunityIcons
              name="ticket-off-outline"
              size={60}
              color="#6B7280"
            />
            <Text className="text-lightBeige-400 text-lg mt-4">
              No tienes cupones disponibles
            </Text>
          </View>
        ) : (
          cupones.map((coupon) => (
            <TouchableOpacity
              key={coupon.id}
              className="mb-4 p-4 rounded-lg flex-col bg-slate-50 overflow-hidden"
              activeOpacity={0.8}
              onPress={() => copyCouponCode(coupon.code)}
            >
              {coupon.image && (
                <Image
                  source={{ uri: coupon.image }}
                  className="w-full h-32 rounded-md mb-3"
                  resizeMode="cover"
                />
              )}
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="ticket-percent-outline"
                  size={24}
                  color="#"
                  className="mr-3"
                />
                {/* Gold icon for coupons */}
                <Text className="text-xl font-bold  flex-1">
                  {coupon.title}
                </Text>
              </View>
              <Text className="text-base  mb-2">{coupon.description}</Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-sm font-semibold text-gray-100 bg-emerald-800 px-3 py-1 rounded-full">
                  Código: {coupon.code}
                </Text>
                <Text className="text-xs text-gray-400">
                  Expira:{" "}
                  {new Date(coupon.expires).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
