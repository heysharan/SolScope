import { StyleSheet, TouchableOpacity } from "react-native";
import { useWalletStore } from "../stores/wallet-store";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  address: string;
}

export function FavoriteButton({ address }: Props) {
  const addFavorite = useWalletStore((s) => s.addFavorite);
  const removeFavorite = useWalletStore((s) => s.removeFavorite);
  const isFavorite = useWalletStore((s) => s.favorites.includes(address));

  return (
    <TouchableOpacity
      onPress={() => {
        if (isFavorite) {
          removeFavorite(address);
        } else {
          addFavorite(address);
        }
      }}
      style={s.button}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={24}
        color={isFavorite ? "#FF4545" : "#666"}
      />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  button: {
    padding: 8,
  },
});
