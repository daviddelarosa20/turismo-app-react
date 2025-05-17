import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ImageBackground,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/supabase";

export default function PlanBasico() {
  const navigation = useNavigation();
  const router = useRouter();
  const { title } = useLocalSearchParams();

  const [empresa, setEmpresa] = useState(null);
  const [rating, setRating] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Detalle",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
      headerRight: () => (
        <View style={{ marginRight: 12, padding: 8, borderRadius: 999, backgroundColor: "#f3f4f6" }}>
          <TouchableOpacity onPress={() => alert("Perfil")}> 
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchEmpresa() {
      const { data, error } = await supabase
        .from("Empresas")
        .select("*")
        .eq("Nombre", title)
        .single();

      if (error) console.error("Error al obtener empresa:", error);
      else setEmpresa(data);
    }

    fetchEmpresa();
  }, [title]);

  const redes = [
    {
      nombre: "facebook",
      color: "#1877f2",
      url: "https://www.facebook.com/",
      icon: <FontAwesome name="facebook" size={24} color="#fff" />,
    },
    {
      nombre: "instagram",
      color: "#e1306c",
      url: "https://www.instagram.com/",
      icon: <FontAwesome name="instagram" size={24} color="#fff" />,
    },
    {
      nombre: "whatsapp",
      color: "#25D366",
      url: "https://wa.me/5210000000000",
      icon: <FontAwesome name="whatsapp" size={24} color="#fff" />,
    },
    {
      nombre: "web",
      color: "#4b5563",
      url: "https://tu-sitio-web.com",
      icon: <Ionicons name="globe-outline" size={24} color="#fff" />,
    },
  ];

  const staticImageUrls = [
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//logo.png",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//pasteleria1.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//pastel.jpeg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Pasteleria.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//Postre1.jpg",
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//PostreFresa.jpeg",
  ];

  const hacerLlamada = () => {
    if (empresa?.Telefono) {
      Linking.openURL(`tel:${empresa.Telefono}`);
    } else {
      alert("Número de teléfono no disponible.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{empresa?.Nombre || "Nombre de la empresa"}</Text>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                if (rating !== 0 && rating !== i) {
                  Alert.alert(
                    "Cambiar calificación",
                    "Ya seleccionaste una calificación. ¿Deseas cambiarla?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Sí",
                        onPress: () => setRating(i),
                      },
                    ],
                    { cancelable: true }
                  );
                } else if (rating === 0) {
                  setRating(i);
                }
              }}
            >
              <AntDesign
                name={i <= rating ? "star" : "staro"}
                size={24}
                color="gold"
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
          <Text style={styles.ratingText}>{rating}.0</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {staticImageUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información del lugar</Text>
          <Text style={styles.infoText}>{empresa?.Descripcion || "Sin descripción disponible."}</Text>
        </View>

        <Text style={styles.subTitle}>Redes Sociales</Text>
        <View style={styles.socialContainer}>
          {redes.map((red, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.socialButton, { backgroundColor: red.color }]}
              onPress={() => Linking.openURL(red.url)}
            >
              {red.icon}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subTitle}>Ubicación</Text>
        <Text style={styles.locationText}>
          {empresa
            ? `${empresa.Calle} ${empresa.NumExt}${empresa.NumInt ? ", Int. " + empresa.NumInt : ""}, ${empresa.Colonia}, ${empresa.CodigoPost}, ${empresa.Ciudad}`
            : "Dirección no disponible"}
        </Text>

        <TouchableOpacity
          onPress={() => {
            const query = encodeURIComponent(
              `${empresa?.Calle} ${empresa?.NumExt}, ${empresa?.Colonia}, ${empresa?.Ciudad}`
            );
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
          }}
          style={styles.mapContainer}
        >
          <ImageBackground
            source={{
              uri: "https://www.tintasytonercompatibles.es/images/blog/como-imprimir-mapa-google-maps.jpg",
            }}
            style={styles.mapImage}
            imageStyle={{ borderRadius: 16 }}
          ></ImageBackground>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.callButton} onPress={hacerLlamada}>
        <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    justifyContent: "center",
  },
  ratingText: {
    marginLeft: 8,
    color: "#6b7280",
  },
  carousel: {
    marginTop: 8,
  },
  carouselImage: {
    width: 211,
    height: 211,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: "#d1d5db",
  },
  infoSection: {
    width: "100%",
    marginTop: 20,
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "left",
  },
  subTitle: {
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    borderRadius: 10,
    padding: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
  },
  mapContainer: {
    width: "100%",
    marginTop: 16,
  },
  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  callButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#10b981",
    borderRadius: 50,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
