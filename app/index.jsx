import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function StartPage() {
  const router = useRouter();

  useEffect(() => {
    // Pequeño retraso para asegurar la navegación
    const timer = setTimeout(() => {
      router.replace("/login/welcomescreen");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Retornar un componente vacío mientras se hace la redirección
  return <View />;
}
