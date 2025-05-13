import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
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


export default function Search() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([
    { id: 1, name: "Filter 1", active: true },
    { id: 2, name: "Filter 2", active: false },
    { id: 3, name: "Filter 3", active: false },
    { id: 4, name: "Filter 4", canBeDeleted: true },
  ]);

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

  const getEmpresas = async () => {
    let { data: Empresas, error } = await supabase.from("Empresas").select("Nombre");
  
    if (error) {
      console.log(error); 
    } else {
      const nombresEmpresas = Empresas.map((empresa) => empresa.Nombre);
      setEmpresas(nombresEmpresas);
    }
  };

  useEffect(() => {
    getEmpresas();
  }, []);

  return (
    <View style={styles.container}>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Hinted search text" style={styles.searchInput} />
        <TouchableOpacity onPress={openFilters}>
         <Ionicons name="list" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Last Search Button */}
      <TouchableOpacity style={styles.lastSearchButton}>
        <Text>My last Searching</Text>
      </TouchableOpacity>

      {/* Lista de empresas */}
      <FlatList
        data={empresas}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.empresaItem}>
            <Text>{item}</Text>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>
        )}
      />

      {/* Modal de Filtros */}
      <Modal visible={showFilters} animationType="slide">
        <View style={{ flex: 1, padding: 30, marginTop: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>Filters</Text>
            <TouchableOpacity
           onPress={() => {
             setFilters(filtersBackup);     // Restaurar filtros
             setAvailableFilters(availableFiltersBackup); //Restaurar
              setShowFilters(false);         // Cerrar panel
           }}
          >
            <Ionicons name="close" size={24} color="black" />
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
             setFilters(filtersBackup);     // Restaurar filtros
             setAvailableFilters(availableFiltersBackup); //Restaurar
             setShowFilters(false);         // Cerrar panel
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
