import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const guardarBusquedaReciente = async (texto) => {
  if (!texto.trim()) return;

  try {
    const jsonValue = await AsyncStorage.getItem("busquedasRecientes");
    const busquedas = jsonValue != null ? JSON.parse(jsonValue) : [];

    const actualizadas = [texto, ...busquedas.filter((b) => b !== texto)];

    const limitadas = actualizadas.slice(0, 5);

    await AsyncStorage.setItem("busquedasRecientes", JSON.stringify(limitadas));
  } catch (e) {
    console.error("Error guardando búsqueda reciente:", e);
  }
};

export default function Search() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      const { data, error } = await supabase
        .from("Categorias")
        .select("idCategoria, Nombre");

      if (error) {
        console.error("Error fetching filters:", error);
      } else {
        const formatted = data.map((item) => ({
          id: item.idCategoria,
          name: item.Nombre,
          active: false,
        }));

        // Agregar el filtro especial "Todas"
        const allOption = { id: 0, name: "Todas", active: true, isAll: true }; // activo por defecto

        setFilters([allOption, ...formatted]);
      }
    };

    fetchFilters();
  }, []);

  const toggleFilter = (id) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)),
    );
  };

  const [filtersBackup, setFiltersBackup] = useState([]);
  const openFilters = () => {
    setFiltersBackup(JSON.parse(JSON.stringify(filters)));
    setShowFilters(true);
  };

  const [empresas, setEmpresas] = useState([]);

  const handleFilterClick = (id) => {
    setFilters((prev) => {
      const clickedFilter = prev.find((f) => f.id === id);
      const isAll = clickedFilter.isAll;

      if (isAll) {
        // Si se selecciona "Todas", desactivar los demás
        return prev.map((f) => ({
          ...f,
          active: f.isAll,
        }));
      } else {
        const updated = prev.map((f) => {
          if (f.isAll) return { ...f, active: false };
          if (f.id === id) return { ...f, active: !f.active };
          return f;
        });

        const alMenosUnoActivo = updated.some((f) => f.active);

        // Si ninguno queda activo, activar "Todas"
        if (!alMenosUnoActivo) {
          return prev.map((f) => ({
            ...f,
            active: f.isAll,
          }));
        }

        return updated;
      }
    });
  };

  const [esBusquedaLocal, setEsBusquedaLocal] = useState(false);

  const buscarEmpresas = async (texto) => {
    const textoMinuscula = texto.toLowerCase();

    const filtrosActivos = filters.filter((f) => f.active);

    const todasActiva = filtrosActivos.some((f) => f.isAll);

    const coincidenciasLocales = busquedasRecientes.filter((b) =>
      b.toLowerCase().includes(textoMinuscula),
    );

    let coincidenciasRemotas = [];

    if (todasActiva) {
      // Buscar sin filtrar por categoría
      const { data, error } = await supabase
        .from("Empresas")
        .select("Nombre")
        .ilike("Nombre", `%${texto}%`);

      if (!error && data) {
        coincidenciasRemotas = data.map((empresa) => empresa.Nombre);
      }
    } else {
      // Obtener IDs de filtros activos normales
      const categoriasActivas = filtrosActivos.map((f) => f.id);

      if (categoriasActivas.length > 0) {
        const { data, error } = await supabase
          .from("Empresas")
          .select("Nombre")
          .ilike("Nombre", `%${texto}%`)
          .in("idCategoria", categoriasActivas);

        if (!error && data) {
          coincidenciasRemotas = data.map((empresa) => empresa.Nombre);
        }
      }
    }

    // Unificar resultados y eliminar duplicados
    const nombresUnicos = [];
    const lowerSet = new Set();

    [...coincidenciasLocales, ...coincidenciasRemotas].forEach((nombre) => {
      const key = nombre.trim().toLowerCase();
      if (!lowerSet.has(key)) {
        lowerSet.add(key);
        nombresUnicos.push(nombre);
      }
    });

    setEmpresas(nombresUnicos);
  };

  const [searchText, setSearchText] = useState("");

  const [busquedasRecientes, setBusquedasRecientes] = useState([]);

  const cargarBusquedasRecientes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("busquedasRecientes");
      const busquedas = jsonValue != null ? JSON.parse(jsonValue) : [];
      setBusquedasRecientes(busquedas);
    } catch (e) {
      console.error("Error cargando búsquedas recientes:", e);
    }
  };

  useEffect(() => {
    cargarBusquedasRecientes();
  }, []);

  const borrarBusquedasRecientes = async () => {
    await AsyncStorage.removeItem("busquedasRecientes");
    setBusquedasRecientes([]);
  };

  const [mostrarRecientes, setMostrarRecientes] = useState(true);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Hinted search text"
          style={styles.searchInput}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);

            if (text.trim() === "") {
              setEmpresas([]);
              cargarBusquedasRecientes();
              setMostrarRecientes(true);
            } else {
              buscarEmpresas(text);
              setMostrarRecientes(false);
            }
          }}
        />
        <TouchableOpacity onPress={openFilters}>
          <Ionicons name="list" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Busquedas recientes */}
      {mostrarRecientes && busquedasRecientes.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          {busquedasRecientes.map((busqueda, index) => (
            <TouchableOpacity
              key={index}
              style={styles.empresaItem}
              onPress={() => {
                navigation.navigate("/planes", {});
              }}
            >
              <Text>{busqueda}</Text>
              <Ionicons name="reload" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Lista de empresas */}
      <FlatList
        data={empresas}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const esReciente = busquedasRecientes
            .map((b) => b.toLowerCase().trim())
            .includes(item.toLowerCase().trim());

          return (
            <TouchableOpacity
              style={styles.empresaItem}
              onPress={() => {
                navigation.navigate("/planes", {});
                guardarBusquedaReciente(item);
              }}
            >
              <Text>{item}</Text>
              <Ionicons
                name={esReciente ? "reload" : "chevron-forward"}
                size={20}
              />
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal de Filtros */}
      <Modal visible={showFilters} animationType="slide">
        <View style={{ flex: 1, padding: 30, marginTop: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Filters</Text>
            <TouchableOpacity
              onPress={() => {
                setFilters(filtersBackup);
                setShowFilters(false);
              }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: 16,
              alignSelf: "flex-start",
              flexDirection: "left",
            }}
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#f44336" }]}
              onPress={async () => {
                await borrarBusquedasRecientes();
                alert("Búsquedas recientes borradas");
              }}
            >
              <Text style={{ color: "white" }}>Borrar búsquedas recientes</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de filtros */}
          {filters.map((filter) => (
            <View key={filter.id} style={styles.filterItem}>
              <Text>{filter.name}</Text>
              {filter.canBeDeleted ? (
                <TouchableOpacity onPress={() => deleteFilter(filter.id)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              ) : (
                <Switch
                  value={filter.active}
                  onValueChange={() => handleFilterClick(filter.id)}
                />
              )}
            </View>
          ))}

          {/* Botones */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc" }]}
              onPress={() => {
                setFilters(filtersBackup);
                setShowFilters(false);
              }}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#4CAF50" }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={{ color: "white" }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 30 },
  header: {
    flexDirection: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: { fontSize: 24, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1 },
  lastSearchButton: {
    alignSelf: "flex-start",
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  empresaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addFilterButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
});
