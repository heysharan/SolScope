const JUPITER_API = "https://quote-api.jup.ag/v6";

export const TOKENS = {
    SOL: "So11111111111111111111111111111111111111112",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    JUP: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    WIF: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
};

export const TOKEN_INFO: Record<string, { symbol: string; name: string; decimal: number } > = {
    [TOKENS.SOL] : { symbol: "SOL", name: "Solana", decimal: 9},
    [TOKENS.USDC]: { symbol: "USDC", name: "USD Coin", decimal: 6},
    [TOKENS.USDT]: { symbol: "USDT", name: "Tether", decimal: 6},
    [TOKENS.BONK]: { symbol: "BONK", name: "Bonk", decimal: 5},
    [TOKENS.JUP]: { symbol: "JUP", name: "Jupiter", decimal: 6},
    [TOKENS.WIF]: { symbol: "WIF", name: "dogwifhat", decimal: 6}
};

export async function getSwapQuote(
    inputMint: string,
    outputMint: string,
    amount: Number,
    slippageBps: number = 50
) {
    const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
    });

    const respose = await fetch(`Z${JUPITER_API}/quote?${params}`)

    if(!respose.ok){
        throw new Error(`Jupiter quote failed: ${respose.statusText}`);
    }

    const quote = await respose.json();
    return quote;
}