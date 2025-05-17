import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const diasSemana = ["D", "L", "M", "Mi", "J", "V", "S"];

const CalendarioS = ({ onSelectFecha }) => {
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

    for (let i = 0; i < primerDia; i++) {
      diasArray.push(null);
    }

    for (let i = 1; i <= diasEnMes; i++) {
      diasArray.push(i);
    }

    setDiasDelMes(diasArray);
  };

  const cambiarMes = (direccion) => {
    const nuevoMes = new Date(
      fechaActual.setMonth(fechaActual.getMonth() + direccion),
    );
    setFechaActual(new Date(nuevoMes));
  };

  const seleccionarDia = (dia) => {
    setDiaSeleccionado(dia);

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; 
    const fechaFormateada = `${año}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
    
    
    if (onSelectFecha) onSelectFecha(fechaFormateada);
  };

  return (
    <View className="items-center my-5">
      <View className="flex-row justify-between w-[90%] mb-2.5">
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <Text className="text-lg">◀</Text>
        </TouchableOpacity>
        <Text className="text-base font-bold">
          {fechaActual.toLocaleString("default", { month: "long" })}{" "}
          {fechaActual.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <Text className="text-lg">▶</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "90%" }}>
        {diasSemana.map((dia) => (
          <Text key={dia} className="w-[30px] text-center font-bold">
            {dia}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", width: "90%" }}>
        {diasDelMes.map((dia, index) => (
          <TouchableOpacity
            key={index}
            disabled={!dia}
            onPress={() => seleccionarDia(dia)}
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
            className={`w-[14.28%] h-10 justify-center items-center my-0.5 ${
              dia === diaSeleccionado ? "bg-yellow-400" : "bg-zinc-100"
            } rounded-md ${!dia ? "opacity-0" : "opacity-100"}`}
          >
            <Text className={`${dia ? "text-black" : "text-transparent"}`}>
              {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CalendarioS;
