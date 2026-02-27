const JUPITER_API = "https://api.jup.ag/swap/v1";
const JUPITER_API_KEY =
  process.env.EXPO_PUBLIC_EXPO_PUBLIC_JUPITER_API_KEY || "";

export const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
  WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
};

export const TOKEN_INFO: Record<
  string,
  { symbol: string; name: string; decimal: number; color: string }
> = {
  [TOKENS.SOL]: {
    symbol: "SOL",
    name: "Solana",
    decimal: 9,
    color: "#9945FF",
  },
  [TOKENS.USDC]: {
    symbol: "USDC",
    name: "USD Coin",
    decimal: 6,
    color: "#2775CA",
  },
  [TOKENS.USDT]: {
    symbol: "USDT",
    name: "Tether",
    decimal: 6,
    color: "#26A17B",
  },
  [TOKENS.BONK]: {
    symbol: "BONK",
    name: "Bonk",
    decimal: 5,
    color: "#F7931A",
  },
  [TOKENS.JUP]: {
    symbol: "JUP",
    name: "Jupiter",
    decimal: 6,
    color: "#14F195",
  },
  [TOKENS.WIF]: {
    symbol: "WIF",
    name: "dogwifhat",
    decimal: 6,
    color: "#E91E63",
  },
};

export const AVAILABLE_TOKENS = [
  TOKENS.SOL,
  TOKENS.USDC,
  TOKENS.USDT,
  TOKENS.BONK,
  TOKENS.JUP,
  TOKENS.WIF,
];

export interface QuoteResponce {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: {
    ammkey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount?: string;
    feeMint?: string;
  };
}

export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50,
): Promise<QuoteResponce> {
  console.log("[jupiter] getSwapQuote called");
  console.log("[jupiter] inputMint:", inputMint);
  console.log("[jupiter] outputMint:", outputMint);
  console.log("[jupiter] amount:", amount);

  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
  });

  const url = `${JUPITER_API}/quote?${params}`;
  console.log("[jupiter] fetching quote from:", url);

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const responce = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": JUPITER_API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!responce.ok) {
        const errorText = await responce.text();
        console.error("[jupiter] quote failed:", responce.status, errorText);
        throw new Error(`Jupiter quote failed: ${responce.status}`);
      }

      const quote = await responce.json();
      console.log("[jupiter] quote received, outAmount:", quote.outAmount);
      return quote;
    } catch (err) {
      lastError = err as Error;
      console.log(`[jupiter] attempt ${attempt} failed:`, lastError.message);
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error("Failed to get quote after 2 attempts");
}

export async function getSwapTransaction(
  quoteResponce: QuoteResponce,
  userPublicKey: string,
): Promise<string> {
  console.log("[jupiter] getSwapTransaction called");
  console.log("[jupiter] userPublicKey:", userPublicKey);

  const swapUrl = `${JUPITER_API}/swap`;
  console.log("[jupiter] posting swap toL:", swapUrl);

  const responce = await fetch(swapUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": JUPITER_API_KEY,
    },
    body: JSON.stringify({
      quoteResponce,
      userPublicKey,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          priorityLevel: "high",
          maxLamports: 1000000,
        },
      },
    }),
  });

  if (!responce.ok) {
    const errorText = await responce.text();
    console.error("[jupiter] swap tx failed:", responce.status, errorText);
    throw new Error(`Jupiter swap failed: ${responce.status}`);
  }

  const data = await responce.json();
  console.log("[jupiter] swap transaction received");
  return data.swapTransaction;
}

export async function getTokenPrice(mintAddress: string): Promise<number> {
  try {
    const responce = await fetch(
      `https://api.jup.ag/price/v2?ids=${mintAddress}`,
      {
        headers: {
          "x-api-key": JUPITER_API_KEY,
        },
      },
    );
    const data = await responce.json();
    return data.data?.[mintAddress]?.price || 0;
  } catch {
    return 0;
  }
}

export function toSmallestUnit(amount: number, decimals: number): number {
  return Math.round(amount * Math.pow(10, decimals));
}

export function fromSmallestUnit(
  amount: number | string,
  decimals: number,
): number {
  return Number(amount) / Math.pow(10, decimals);
}
