  import React, { useEffect, useState } from "react";
  import { supabase } from "../../supabase/supabase";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useNavigation } from '@react-navigation/native';
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
      const jsonValue = await AsyncStorage.getItem('busquedasRecientes');
      const busquedas = jsonValue != null ? JSON.parse(jsonValue) : [];

      const actualizadas = [texto, ...busquedas.filter(b => b !== texto)];

      const limitadas = actualizadas.slice(0, 5);

      await AsyncStorage.setItem('busquedasRecientes', JSON.stringify(limitadas));
    } catch (e) {
      console.error('Error guardando búsqueda reciente:', e);
    }
  };


  export default function Search() {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState([]);
  
    useEffect(() => {
      const fetchFilters = async () => {
        const { data, error } = await supabase
          .from('Categorias')
          .select('idCategoria, Nombre');
  
        if (error) {
          console.error("Error fetching filters:", error);
        } else {
          const formatted = data.map((item, index) => ({
            id: item.idCategoria,
            name: item.Nombre,
            active: index === 0, // El primero activo
          }));
  
          console.log("Filtros traídos de Supabase:", formatted); // 👈 Aquí se imprime

          setFilters(formatted);
        }
      };
  
      fetchFilters();
    }, []);

    const [availableFilters, setAvailableFilters] = useState([
      { id: 5, name: "Filter 5", canBeDeleted: true},
      { id: 6, name: "Filter 6", canBeDeleted: true },
    ]);

    const toggleFilter = (id) => {
      setFilters((prev) =>
        prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
      );
    };

    const deleteFilter = (id) => {
      const removed = filters.find((f) => f.id === id);
      if (removed) {
        setFilters((prev) => prev.filter((f) => f.id !== id));
        setAvailableFilters((prev) => [...prev, removed]);
      }
    };

    const addFilter = (id) => {
      const toAdd = availableFilters.find((f) => f.id === id);
      if (toAdd) {
        setAvailableFilters((prev) => prev.filter((f) => f.id !== id));
        setFilters((prev) => [...prev, toAdd]);
      }
    };  

    const [filtersBackup, setFiltersBackup] = useState([]);
    const [availableFiltersBackup, setAvailableFiltersBackup] = useState([]);
    const openFilters = () => {
      setFiltersBackup(JSON.parse(JSON.stringify(filters)));
      setAvailableFiltersBackup(JSON.parse(JSON.stringify(availableFilters)));
      setShowFilters(true);
    };  

    const [empresas, setEmpresas] = useState([]);

    const [esBusquedaLocal, setEsBusquedaLocal] = useState(false);

    const buscarEmpresas = async (texto) => {
      const textoMinuscula = texto.toLowerCase();
    
      // Obtener todas las categorías activas
      const categoriasActivas = filters.filter(f => f.active).map(f => f.id);
    
      if (categoriasActivas.length === 0) {
        console.warn("No hay categorías activas seleccionadas");
        return;
      }
    
      // Coincidencias locales
      const coincidenciasLocales = busquedasRecientes.filter((b) =>
        b.toLowerCase().includes(textoMinuscula)
      );
    
      // Supabase: buscar empresas con nombre que coincida Y categoría activa
      const { data, error } = await supabase
        .from('Empresas')
        .select('Nombre')
        .ilike('Nombre', `%${texto}%`)
        .in('idCategoria', categoriasActivas); // 👈 múltiples categorías
    
      let coincidenciasRemotas = [];
      if (!error && data) {
        coincidenciasRemotas = data.map((empresa) => empresa.Nombre);
      }
    
      // Unificar resultados y eliminar duplicados
      const nombresUnicos = [];
      const lowerSet = new Set();
    
      [...coincidenciasLocales, ...coincidenciasRemotas].forEach(nombre => {
        const key = nombre.trim().toLowerCase();
        if (!lowerSet.has(key)) {
          lowerSet.add(key);
          nombresUnicos.push(nombre);
        }
      });
    
      setEmpresas(nombresUnicos);
    };
       
    

    const [searchText, setSearchText] = useState('');

    const [busquedasRecientes, setBusquedasRecientes] = useState([]);

    const cargarBusquedasRecientes = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('busquedasRecientes');
        const busquedas = jsonValue != null ? JSON.parse(jsonValue) : [];
        setBusquedasRecientes(busquedas);
      } catch (e) {
        console.error('Error cargando búsquedas recientes:', e);
      }
    };
    
    useEffect(() => {
      cargarBusquedasRecientes();
    }, []);
    
    const borrarBusquedasRecientes = async () => {
      await AsyncStorage.removeItem('busquedasRecientes');
      setBusquedasRecientes([]);
    };
    
    const [mostrarRecientes, setMostrarRecientes] = useState(true);

    return (
      <View style={styles.container}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
    placeholder="Hinted search text"
    style={styles.searchInput}
    value={searchText}
    onChangeText={(text) => {
      setSearchText(text);
    
      if (text.trim() === '') {
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
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>Filters</Text>
              <TouchableOpacity
            onPress={() => {
              setFilters(filtersBackup); 
              setAvailableFilters(availableFiltersBackup);
                setShowFilters(false);       
            }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            </View>
            
            <View style={{ marginTop: 16, alignSelf: "flex-start", flexDirection: "left" }}>
            <TouchableOpacity
            style={[styles.button, { backgroundColor: "#f44336"}]}
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
                  onValueChange={() => toggleFilter(filter.id)}
                />
              )}
              </View>
            ))}

  {/*para volver a agregarlos*/}
  {availableFilters.length > 0 && (
    <View style={{ marginTop: 30 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Agregar Filtros</Text>
      {availableFilters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={styles.addFilterButton}
          onPress={() => addFilter(filter.id)}
        >
          <Text>+ {filter.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}

            {/* Botones */}
            <View style={styles.buttonRow}>
            <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ccc" }]}
            onPress={() => {
              setFilters(filtersBackup);    
              setAvailableFilters(availableFiltersBackup); 
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
    header: { flexDirection: "center", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
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
