import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function PlanBasico() {
  const navigation = useNavigation();
  const { title, description, direccion } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || "Detalle",
      headerStyle: { backgroundColor: "#e1dcd0" },
      headerTitleAlign: "center",
      headerRight: () => (
        <View style={styles.headerIcon}>
          <TouchableOpacity onPress={() => alert("Perfil")}>
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title || "Nombre de la empresa"}</Text>

      {/* Estrellas y rating */}
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <AntDesign key={index} name="star" size={16} color="gold" />
        ))}
        <Text style={styles.ratingText}>5.0</Text>
      </View>

      {/* Imagen principal desde Supabase */}
      <Image
        source={{
          uri: "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Dentista.jpg",
        }}
        style={styles.image}
      />

      {/* Información del lugar */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Información del lugar</Text>
        <Text style={styles.infoText}>
          {description ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel."}
        </Text>

        {/* Indicadores de color */}
        <View style={styles.colorBoxes}>
          {["#444", "#999", "#444", "#ccc"].map((color, idx) => (
            <View
              key={idx}
              style={[styles.colorBox, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>

      {/* Dirección */}
      <Text style={styles.sectionTitle}>Ubicación</Text>
      <Text style={styles.infoText}>
        {direccion || "Dirección no disponible"}
      </Text>

      {/* Imagen del mapa */}
      <Text style={styles.sectionTitle}>Mapa</Text>
      <Image
        source={{
          uri: "https://example.com/mapa.jpg", // URL de la imagen del mapa
        }}
        style={styles.mapImage}
      />

      {/* Botón de reserva */}
      <TouchableOpacity
        style={styles.reserveButton}
        onPress={() => alert("Reserva hecha!")}
      >
        <Text style={styles.reserveText}>Reservar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  ratingText: {
    marginLeft: 6,
    color: "gray",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#bbb",
  },
  mapImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#bbb",
  },
  infoSection: {
    marginTop: 20,
    width: "100%",
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
  },
  colorBoxes: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-around",
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  sectionTitle: {
    marginTop: 20,
    fontWeight: "bold",
  },
  reserveButton: {
    marginTop: 20,
    backgroundColor: "#A8FFB4",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 40,
  },
  reserveText: {
    color: "#000",
    fontWeight: "600",
  },
  headerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderRadius: 50,
    backgroundColor: "#f1f1f1",
    padding: 8,
  },
});
