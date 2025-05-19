import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("Solicitando permisos de ubicación...");
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permiso denegado:", status);
          setErrorMsg("Permission to access location was denied");
          return;
        }

        console.log("Obteniendo ubicación actual...");
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        console.log("Ubicación obtenida:", location.coords);
        setLocation(location.coords);

        // Solo intentamos cargar el mapa estático en dispositivos móviles
        if (Platform.OS !== "web") {
          // Crear una URL para una imagen de mapa estática (sin API key por ahora)
          const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.coords.latitude},${location.coords.longitude}&zoom=14&size=400x400&maptype=roadmap&markers=color:red%7C${location.coords.latitude},${location.coords.longitude}`;
          console.log("URL del mapa:", staticMapUrl);
          setMapUrl(staticMapUrl);
        }
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        setErrorMsg("Error al obtener la ubicación: " + error.message);
      }
    })();
  }, []);

  // Función para abrir Google Maps con las coordenadas
  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      Linking.openURL(url).catch((err) => {
        console.error("Error al abrir Google Maps:", err);
        setErrorMsg("No se pudo abrir Google Maps");
      });
    }
  };

  // Renderizado para mensaje de error
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Renderizado para carga
  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando ubicación...</Text>
      </View>
    );
  }

  // Renderizado principal
  return (
    <View style={styles.container}>
      <View style={styles.coordsContainer}>
        <Text style={styles.coordsText}>
          Lat: {location.latitude.toFixed(6)}, Long:{" "}
          {location.longitude.toFixed(6)}
        </Text>
      </View>

      {Platform.OS !== "web" && mapUrl ? (
        // Mostrar mapa estático en dispositivos móviles
        <Image
          source={{ uri: mapUrl }}
          style={styles.map}
          resizeMode="cover"
          onError={(e) => {
            console.error("Error al cargar la imagen:", e.nativeEvent.error);
            setMapUrl(null); // Resetear la URL para mostrar el placeholder
          }}
        />
      ) : (
        // Mostrar placeholder con botón para abrir Google Maps
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            {Platform.OS === "web"
              ? "Mapa no disponible en web"
              : "Mapa no disponible"}
          </Text>

          <TouchableOpacity style={styles.mapButton} onPress={openInGoogleMaps}>
            <Text style={styles.mapButtonText}>Abrir en Google Maps</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  coordsContainer: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    borderRadius: 4,
  },
  coordsText: {
    color: "white",
    fontSize: 12,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  loadingText: {
    textAlign: "center",
    padding: 20,
  },
  mapButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  mapButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
