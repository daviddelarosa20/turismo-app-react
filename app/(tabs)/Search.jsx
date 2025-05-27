import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../supabase/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Colors = {
  darkBlue: "#1a1e22",
  mediumBlue: "#282d33",
  lightBeige: "#fff",
  veryLightBeige: "#F5EFE7",
};

const imagenesEmpresas = {
  "La Finca":
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images//RestauranteComida.jpg",
  "SweetCake House":
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Postres.jpg",
  "Teatro Ricardo Castro":
    "https://jxcchonixqmpsnyefhfh.supabase.co/storage/v1/object/public/images/Teatro.jpg",
};

const guardarBusquedaReciente = async (texto, empresaData) => {
  if (!texto || !texto.trim()) return;

  try {
    const jsonValue = await AsyncStorage.getItem("busquedasRecientes");
    let busquedas = [];
    if (jsonValue != null) {
      try {
        busquedas = JSON.parse(jsonValue);
      } catch (parseError) {
        console.error(
          "Error al parsear búsquedas recientes de AsyncStorage:",
          parseError,
        );
        busquedas = [];
      }
    }

    const itemToSave =
      empresaData && empresaData.Nombre
        ? empresaData
        : { Nombre: texto.trim() };

    const actualizadas = [
      itemToSave,
      ...busquedas.filter(
        (b) =>
          b &&
          b.Nombre &&
          b.Nombre.toLowerCase() !== texto.trim().toLowerCase(),
      ),
    ];

    const limitadas = actualizadas.slice(0, 5);

    await AsyncStorage.setItem("busquedasRecientes", JSON.stringify(limitadas));
  } catch (e) {
    console.error("Error guardando búsqueda reciente en AsyncStorage:", e);
  }
};

export default function Search() {
  const router = useRouter();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);
  const [filtersBackup, setFiltersBackup] = useState([]);

  const [empresas, setEmpresas] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [busquedasRecientes, setBusquedasRecientes] = useState([]);
  const [mostrarRecientes, setMostrarRecientes] = useState(true);

  // --- Funciones para la Lógica de Filtros ---

  const fetchFilters = useCallback(async () => {
    const { data, error } = await supabase
      .from("Categorias")
      .select("idCategoria, Nombre");

    if (error) {
      console.error("Error fetching filters:", error);
      Alert.alert("Error", "No se pudieron cargar las categorías de filtro.");
    } else {
      const formatted = data.map((item) => ({
        id: item.idCategoria,
        name: item.Nombre,
        active: false,
        isAll: false,
      }));

      const allOption = { id: null, name: "Todas", active: true, isAll: true };
      setFilters([allOption, ...formatted]);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const handleFilterClick = useCallback((id) => {
    setFilters((prevFilters) => {
      if (!Array.isArray(prevFilters)) {
        console.error("`prevFilters` no es un array:", prevFilters);
        return [];
      }

      const clickedFilter = prevFilters.find((f) => f.id === id);

      if (!clickedFilter) {
        console.warn("Filtro clicado no encontrado:", id);
        return prevFilters;
      }

      if (clickedFilter.isAll) {
        return prevFilters.map((f) => ({
          ...f,
          active: f.isAll,
        }));
      } else {
        const updatedFilters = prevFilters.map((f) => {
          if (f.isAll) return { ...f, active: false };
          if (f.id === id) return { ...f, active: !f.active };
          return f;
        });

        const alMenosUnaEspecificaActiva = updatedFilters.some(
          (f) => !f.isAll && f.active,
        );
        if (!alMenosUnaEspecificaActiva) {
          return updatedFilters.map((f) => ({
            ...f,
            active: f.isAll,
          }));
        }
        return updatedFilters;
      }
    });
  }, []);

  const openFilters = () => {
    setFiltersBackup(JSON.parse(JSON.stringify(filters)));
    setShowFilters(true);
  };

  const applyFilters = () => {
    setShowFilters(false);
    buscarEmpresas(searchText);
  };

  const cancelFilters = () => {
    setFilters(filtersBackup); // Restaura el estado anterior
    setShowFilters(false);
  };

  // --- Funciones para la Búsqueda de Empresas ---

  const buscarEmpresas = useCallback(
    async (texto) => {
      const filtrosActivos = filters.filter((f) => f.active);
      const todasActiva = filtrosActivos.some((f) => f.isAll);
      let query = supabase.from("Empresas").select(`
      idEmpresa,
      Nombre,
      Descripcion,
      RutaDestino,
      Calle,
      NumExt,
      NumInt,
      Colonia,
      CodigoPost,
      Portada,
      idCategoria
    `); // Incluye todos los campos necesarios

      if (texto && texto.trim() !== "") {
        query = query.ilike("Nombre", `%${texto.trim()}%`);
      }

      if (!todasActiva) {
        const categoriasActivasIds = filtrosActivos.map((f) => f.id);
        if (categoriasActivasIds.length > 0) {
          query = query.in("idCategoria", categoriasActivasIds);
        } else {
          setEmpresas([]);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al buscar empresas:", error);
        Alert.alert(
          "Error",
          "No se pudieron obtener los resultados de la búsqueda.",
        );
        setEmpresas([]);
      } else {
        const empresasUnicas = [];
        const nombresVistos = new Set();
        data.forEach((emp) => {
          if (emp && emp.Nombre) {
            const lowerCaseName = emp.Nombre.trim().toLowerCase();
            if (!nombresVistos.has(lowerCaseName)) {
              nombresVistos.add(lowerCaseName);
              empresasUnicas.push(emp);
            }
          }
        });
        setEmpresas(empresasUnicas);
      }
    },
    [filters],
  );

  // --- Funciones para Búsquedas Recientes ---

  const cargarBusquedasRecientes = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("busquedasRecientes");
      let busquedasGuardadas = [];
      if (jsonValue != null) {
        try {
          busquedasGuardadas = JSON.parse(jsonValue);
        } catch (parseError) {
          console.error(
            "Error al parsear búsquedas recientes en carga:",
            parseError,
          );
          busquedasGuardadas = [];
        }
      }
      const validBusquedas = busquedasGuardadas.filter(
        (b) => b && typeof b === "object" && b.Nombre,
      );
      setBusquedasRecientes(validBusquedas);
    } catch (e) {
      console.error("Error al cargar búsquedas recientes de AsyncStorage:", e);
    }
  }, []);

  useEffect(() => {
    cargarBusquedasRecientes();
  }, [cargarBusquedasRecientes]);

  const borrarBusquedasRecientes = async () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres borrar todas las búsquedas recientes?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          onPress: async () => {
            await AsyncStorage.removeItem("busquedasRecientes");
            setBusquedasRecientes([]);
            Alert.alert("Éxito", "Búsquedas recientes borradas.");
          },
        },
      ],
      { cancelable: true },
    );
  };

  useEffect(() => {
    if (searchText.trim() === "") {
      setEmpresas([]);
      cargarBusquedasRecientes();
      setMostrarRecientes(true);
    } else {
      buscarEmpresas(searchText); //
      setMostrarRecientes(false); //
    }
  }, [searchText, filters, buscarEmpresas, cargarBusquedasRecientes]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.mediumBlue}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Busca negocios o servicios..."
          placeholderTextColor={Colors.mediumBlue}
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={openFilters}>
          <Ionicons name="filter" size={24} color={Colors.mediumBlue} />
        </TouchableOpacity>
      </View>

      {/* Busquedas recientes */}
      {mostrarRecientes && busquedasRecientes.length > 0 && (
        <View style={styles.recentSearchesSection}>
          <View style={styles.recentSearchesHeader}>
            <Text style={styles.recentSearchesTitle}>Búsquedas Recientes</Text>
            <TouchableOpacity onPress={borrarBusquedasRecientes}>
              <Text style={styles.clearRecentSearchesText}>Borrar todo</Text>
            </TouchableOpacity>
          </View>
          {busquedasRecientes.map((empresa, index) => (
            <TouchableOpacity
              key={empresa.idEmpresa || `recent-${empresa.Nombre}-${index}`} // Clave más robusta
              style={styles.empresaItem}
              onPress={() => {
                setSearchText(empresa.Nombre); // Rellena la barra de búsqueda
                router.push({
                  pathname: `/planes/${empresa.RutaDestino || "planBasico"}`, // Fallback por si no hay RutaDestino
                  params: {
                    title: empresa.Nombre,
                    description:
                      empresa.Descripcion || "Sin descripción disponible.",
                    direccion: `${empresa.Calle || ""} ${empresa.NumExt || ""}${empresa.NumInt ? ", Int. " + empresa.NumInt : ""}, ${empresa.Colonia || ""}, CP: ${empresa.CodigoPost || ""}`,
                    imageUrl:
                      empresa.Portada ||
                      imagenesEmpresas[empresa.Nombre] ||
                      "https://via.placeholder.com/300x200",
                  },
                });
              }}
            >
              <Text style={styles.empresaItemText}>{empresa.Nombre}</Text>
              <Ionicons name="arrow-undo" size={20} color={Colors.mediumBlue} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lista de empresas resultantes de la búsqueda */}
      {empresas.length > 0 && !mostrarRecientes ? (
        <FlatList
          data={empresas}
          keyExtractor={(item) =>
            item.idEmpresa
              ? item.idEmpresa.toString()
              : item.Nombre + Math.random()
          }
          renderItem={({ item }) => {
            if (!item || !item.Nombre) return null; // Renderiza nulo si el item no es válido

            return (
              <TouchableOpacity
                style={styles.empresaItem}
                onPress={() => {
                  guardarBusquedaReciente(item.Nombre, item); // Guarda el objeto completo
                  router.push({
                    pathname: `/planes/${item.RutaDestino || "planBasico"}`, // Fallback
                    params: {
                      title: item.Nombre,
                      description:
                        item.Descripcion || "Sin descripción disponible.",
                      direccion: `${item.Calle || ""} ${item.NumExt || ""}${item.NumInt ? ", Int. " + item.NumInt : ""}, ${item.Colonia || ""}, CP: ${item.CodigoPost || ""}`,
                      imageUrl:
                        item.Portada ||
                        imagenesEmpresas[item.Nombre] ||
                        "https://via.placeholder.com/300x200",
                    },
                  });
                }}
              >
                <Text style={styles.empresaItemText}>{item.Nombre}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.mediumBlue}
                />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        // Mensaje cuando no hay resultados de búsqueda y no se muestran las recientes
        !mostrarRecientes &&
        searchText.trim() !== "" && (
          <Text style={styles.noResultsText}>
            No se encontraron resultados.
          </Text>
        )
      )}

      {/* Modal de Filtros */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
        onRequestClose={cancelFilters} // Permite cerrar el modal con el botón de retroceso de Android
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={cancelFilters}>
              <Ionicons name="close" size={28} color={Colors.darkBlue} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterListContainer}>
            {/* Iterar sobre los filtros en el estado `filters` */}
            {filters.map((filter) => (
              <View
                key={filter.id === null ? "all" : filter.id.toString()} // Clave única para "Todas" y otras categorías
                style={styles.filterItemModal}
              >
                <Text style={styles.filterItemText}>{filter.name}</Text>
                <Switch
                  trackColor={{
                    false: Colors.lightBeige,
                    true: Colors.darkBlue,
                  }} // Colores para el track
                  thumbColor={Colors.veryLightBeige} // Color del thumb
                  ios_backgroundColor={Colors.mediumBlue} // Fondo para iOS cuando está desactivado
                  onValueChange={() => handleFilterClick(filter.id)}
                  value={filter.active}
                />
              </View>
            ))}
          </ScrollView>

          {/* Botones del Modal */}
          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: Colors.lightBeige },
              ]}
              onPress={cancelFilters}
            >
              <Text
                style={[styles.modalButtonText, { color: Colors.darkBlue }]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: Colors.darkBlue }]}
              onPress={applyFilters}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: Colors.veryLightBeige },
                ]}
              >
                Aplicar Filtros
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: Colors.veryLightBeige, // Fondo de la pantalla principal
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.lightBeige, // Color de la barra de búsqueda
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Sombra para Android
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.darkBlue, // Color del texto de entrada
  },
  recentSearchesSection: {
    marginBottom: 20,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.darkBlue,
  },
  clearRecentSearchesText: {
    color: Colors.mediumBlue,
    fontSize: 14,
  },
  empresaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.lightBeige,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2, // Sombra para Android
  },
  empresaItemText: {
    fontSize: 16,
    color: Colors.darkBlue,
    flex: 1,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: Colors.mediumBlue,
  },
  modalContainer: {
    flex: 1,
    padding: 25,
    paddingTop: 50, // Ajuste para iOS notches/status bar
    backgroundColor: Colors.veryLightBeige,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.darkBlue,
  },
  filterListContainer: {
    flex: 1,
    marginBottom: 20,
  },
  filterItemModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: Colors.lightBeige,
    borderBottomWidth: 1,
  },
  filterItemText: {
    fontSize: 18,
    color: Colors.darkBlue,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopColor: Colors.lightBeige,
    borderTopWidth: 1,
  },
  modalButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Sombra para Android
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
