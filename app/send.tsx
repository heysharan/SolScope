import { useWallet } from "@/src/hooks/useWallet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SendScreen() {
  const router = useRouter();
  const wallet = useWallet();

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleSend = async () => {
    if (!toAddress.trim()) return Alert.alert("Enter a recipient address");
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      return Alert.alert("Enter a valid amount");
    }

    try {
      const sig = await wallet.sendSOL(toAddress.trim(), Number(amount));
      setTxSignature(sig);
      Alert.alert(
        "Transaction Send!",
        `Send ${amount} SOL\nSignature: ${sig.slice(0, 20)}...`,
        [
          {
            text: "View on Solscan",
            onPress: () => Linking.openURL(`https://solcan.io/tx/${sig}`),
          },
          { text: "Dine", onPress: () => router.back() },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        "Transaction Failed",
        error.message || "Something went wrong",
      );
    }
  };

  if (!wallet.connected) {
    return (
      <View style={s.center}>
        <Ionicons name="wallet-outline" size={64} color="#333" />
        <Text style={s.emptyTitle}>Wallet Not Connected</Text>
        <Text style={s.emptyText}>
          Connect your wallet from the Wallet tab first
        </Text>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Send SOL</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.card}>
        <Text style={s.cardLabel}>From</Text>
        <Text style={s.cardAddress}>
          {wallet.publicKey?.toBase58().slice(0, 8)}...
          {wallet.publicKey?.toBase58().slice(-4)}
        </Text>
      </View>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Recipient Address</Text>
        <TextInput
          style={s.input}
          placeholder="Paste Solana address..."
          placeholderTextColor="#555"
          value={toAddress}
          onChangeText={setToAddress}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={s.inputGroup}>
        <Text style={s.inputLabel}>Amount (SOL)</Text>
        <TextInput
          style={s.input}
          placeholder="0.0"
          placeholderTextColor="#555"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
      </View>

      <TouchableOpacity
        style={[s.sendButton, wallet.sending && s.sendButtonDisabled]}
        onPress={handleSend}
        disabled={wallet.sending}
      >
        {wallet.sending ? (
          <ActivityIndicator color="#0a0a1a" />
        ) : (
          <Text style={s.sendButtonText}>Send SOL</Text>
        )}
      </TouchableOpacity>

      <Text style={s.feeText}>
        Network fee: ~0.00005 SOL ($0.001)
      </Text>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    padding: 16,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    backgroundColor: "#0a0a1a",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardLabel: {
    color: "#888",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardAddress: {
    color: "#9945FF",
    fontSize: 14,
    fontFamily: "monospace",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#888",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  sendButton: {
    backgroundColor: "#14F195",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: {
    color: "#0a0a1a",
    fontSize: 18,
    fontWeight: "bold",
  },
  feeText: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },
  backButton: {
    backgroundColor: "#9945FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
