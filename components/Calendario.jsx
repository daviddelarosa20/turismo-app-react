import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const diasSemana = ["D", "L", "M", "Mi", "J", "V", "S"];

const CalendarioS = ({ onFechaSeleccionada }) => {
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

      <View className="flex-row justify-around w-[90%]">
        {diasSemana.map((dia) => (
          <Text key={dia} className="w-[30px] text-center font-bold">
            {dia}
          </Text>
        ))}
      </View>

      <View className="flex-row flex-wrap w-[90%]">
        {diasDelMes.map((dia, index) => (
          <TouchableOpacity
            key={index}
            disabled={!dia}
            onPress={() => {
              setDiaSeleccionado(dia);
              if (dia) {
                const fechaSeleccionada = new Date(
                  fechaActual.getFullYear(),
                  fechaActual.getMonth(),
                  dia,
                );
                onFechaSeleccionada && onFechaSeleccionada(fechaSeleccionada);
              }
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
