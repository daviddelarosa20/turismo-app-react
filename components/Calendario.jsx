import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const diasSemana = ["D", "L", "M", "Mi", "J", "V", "S"];

const CalendarioSimple = () => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diasDelMes, setDiasDelMes] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  useEffect(() => {
    generarDiasDelMes();
  }, [fechaActual]);

  const generarDiasDelMes = () => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    const primerDia = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();

    const diasArray = [];

    // Rellenar espacios en blanco al inicio
    for (let i = 0; i < primerDia; i++) {
      diasArray.push(null);
    }

    for (let i = 1; i <= diasEnMes; i++) {
      diasArray.push(i);
    }

    setDiasDelMes(diasArray);
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(fechaActual.setMonth(fechaActual.getMonth() + direccion));
    setFechaActual(new Date(nuevoMes));
  };

  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%", marginBottom: 10 }}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <Text style={{ fontSize: 18 }}>◀</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {fechaActual.toLocaleString("default", { month: "long" })} {fechaActual.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <Text style={{ fontSize: 18 }}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "90%" }}>
        {diasSemana.map((dia) => (
          <Text key={dia} style={{ width: 30, textAlign: "center", fontWeight: "bold" }}>{dia}</Text>
        ))}
      </View>

      {/* Días del mes */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", width: "90%" }}>
        {diasDelMes.map((dia, index) => (
          <TouchableOpacity
            key={index}
            disabled={!dia}
            onPress={() => setDiaSeleccionado(dia)}
            style={{
              width: "14.28%",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 2,
              backgroundColor: dia === diaSeleccionado ? "#facc15" : "#f4f4f5",
              borderRadius: 6,
              opacity: dia ? 1 : 0
            }}
          >
            <Text style={{ color: dia ? "#000" : "transparent" }}>{dia}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CalendarioSimple;
