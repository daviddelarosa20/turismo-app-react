import React from "react";
import { View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const StarRating = ({ rating, maxStars = 5 }) => {
  if (typeof rating !== "number" || isNaN(rating)) return null;

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesome key={`full-${i}`} name="star" color="#FFD700" size={24} />
      ))}
      {halfStar && (
        <FontAwesome
          name="star-half"
          color="#FFD700"
          size={24}
          style={{ opacity: 1 }}
        />
      )}
    </View>
  );
};

export default StarRating;
