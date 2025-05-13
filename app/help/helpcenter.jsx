import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export const options = {
  headerShown: false,
};

export default function Helpcenter() {
  const categorias = [
    {
      nombre: "Administración de la cuenta",
      preguntas: [
        { pregunta: "¿Cómo cerrar sesión?", respuesta: "Ve a configuración y selecciona 'Cerrar sesión' al final del menú." },
        { pregunta: "¿Cómo puedo cambiar mi contraseña?", respuesta: "En tu perfil, selecciona 'Cambiar contraseña' y sigue las instrucciones." },
      ],
    },
    {
      nombre: "Uso de la app",
      preguntas: [
        { pregunta: "¿Cómo navegar por la app?", respuesta: "Utiliza la barra inferior para moverte entre secciones principales." },
        { pregunta: "¿Cómo crear un perfil?", respuesta: "En la pantalla de inicio, pulsa 'Registrarse' y llena tus datos." },
        { pregunta: "¿Cómo hago una reservación?", respuesta: "En la sección correspondiente, elige un servicio y selecciona 'Reservar'." },
      ],
    },
    {
      nombre: "Atención al cliente",
      preguntas: [
        { pregunta: "¿Dónde contactar soporte?", respuesta: "Puedes enviar un mensaje desde la sección 'Ayuda' o escribir al correo soporte@ejemplo.com." },
        { pregunta: "¿Tienen chat en vivo?", respuesta: "Sí, está disponible desde el ícono de soporte en la esquina inferior derecha." },
      ],
    },
    {
      nombre: "Seguridad y privacidad",
      preguntas: [
        { pregunta: "¿Mis datos están seguros?", respuesta: "Sí, usamos cifrado de extremo a extremo para proteger tu información." },
        { pregunta: "¿Cómo eliminar mi cuenta?", respuesta: "Contáctanos desde soporte y procederemos a eliminarla de forma segura." },
      ],
    },
    {
      nombre: "Problemas técnicos",
      preguntas: [
        { pregunta: "La app no abre", respuesta: "Intenta actualizar la app o reiniciar tu dispositivo." },
        { pregunta: "No se cargan los datos", respuesta: "Revisa tu conexión a internet o vuelve a iniciar sesión." },
      ],
    },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categorias[0]);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const todasLasPreguntas = categorias.flatMap((cat) =>
    cat.preguntas.map((p) => ({ ...p, categoria: cat.nombre }))
  );

  const preguntasAMostrar =
    busqueda.trim() === ""
      ? categoriaSeleccionada.preguntas
      : todasLasPreguntas.filter((p) =>
          p.pregunta.toLowerCase().includes(busqueda.toLowerCase())
        );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-[#e1dcd0] py-4 rounded-xl mb-4">
        <Text className="text-center text-xl font-semibold text-black">
          Servicio de ayuda
        </Text>
      </View>

      {/* Buscador */}
      <View className="flex-row items-center m-4 bg-purple-100 p-3 rounded-xl">
        <Text className="text-gray-500 mr-2">🔍</Text>
        <TextInput
          placeholder="Buscar pregunta..."
          placeholderTextColor="#666"
          className="flex-1 text-black text-base"
          value={busqueda}
          onChangeText={(text) => {
            setBusqueda(text);
            setPreguntaSeleccionada(null); // para evitar confusión
          }}
        />
      </View>

      {/* Contenido dividido */}
      <View className="flex-row flex-1 px-4">
        {/* Categorías */}
        <ScrollView className="w-1/2 pr-3 border-r border-gray-300">
          {categorias.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCategoriaSeleccionada(cat);
                setBusqueda(""); // limpiar búsqueda al cambiar categoría
                setPreguntaSeleccionada(null);
              }}
              className={`py-3 ${
                categoriaSeleccionada.nombre === cat.nombre
                  ? "bg-gray-100 rounded"
                  : ""
              }`}
            >
              <Text className="text-base text-black">{cat.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Preguntas y respuestas */}
        <View className="w-1/2 pl-3">
          <ScrollView>
            {preguntasAMostrar.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setPreguntaSeleccionada(item)}
                className="py-2"
              >
                <Text className="text-base text-black">{item.pregunta}</Text>

                {preguntaSeleccionada?.pregunta === item.pregunta && (
                  <View className="mt-2 bg-slate-100 p-3 rounded-lg">
                    <Text className="text-sm font-semibold text-gray-700 mb-1">
                      Respuesta:
                    </Text>
                    <Text className="text-base text-black">
                      {item.respuesta}
                    </Text>
                    {busqueda && (
                      <Text className="text-xs italic text-gray-500 mt-2">
                        Categoría: {item.categoria}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {preguntasAMostrar.length === 0 && (
              <Text className="text-gray-500 mt-10 text-center">
                No se encontraron resultados.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
