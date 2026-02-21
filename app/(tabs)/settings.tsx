import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <Text style={s.subtitle}>Settings</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 15,
  },
});
