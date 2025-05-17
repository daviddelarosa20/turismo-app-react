import React, { useState } from "react";
import {
  Button,
  View,
  Platform,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    // Formatear la fecha para mostrarla
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setSelectedDate(formattedDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View className="flex-row items-center justify-center gap-3">
      <TextInput
        className="w-1/2 h-12 border border-gray-400 rounded color-slate-500"
        value={!selectedDate ? "Fecha DD/MM/YYYY" : selectedDate}
        editable={false}
      />
      <TouchableOpacity style={styles.button} onPress={showDatepicker}>
        <Text className="text-white font-bold">Seleccionar Fecha</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
          minimumDate={new Date()}
          maximumDate={new Date(2025, 11, 31)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default DatePicker;
