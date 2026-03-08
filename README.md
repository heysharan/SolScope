# SolScope

SolScope is a **mobile-first Solana wallet explorer and utility app**. 
It allows users to explore any Solana wallet, view token balances, swap tokens,
inspect recent transactions, and interact with the Solana ecosystem 
directly from a mobile device.

SolScope aims to provide a **clean, fast, and mobile-native experience
for analyzing Solana wallets**.

------------------------------------------------------------------------

## Features

### Wallet Explorer

-   Search any **Solana wallet address**
-   View **SOL balance**
-   View **token holdings**
-   Inspect **recent transactions**

### Wallet Connection

-   Connect using **Solana Mobile Wallet Adapter**
-   Supports wallets such as **Seeker Wallet**, **Phantom Wallet** etc.,

### Token Actions

-   Swap tokens directly from the connected wallet

### Network Switching

-   Toggle between:
    -   **Mainnet**
    -   **Devnet**

### User Experience

-   Clean mobile UI
-   Smooth animations using **React Native Reanimated**
-   Persistent search history
-   Favorite wallet tracking

------------------------------------------------------------------------

## Tech Stack

**Frontend** - React Native - Expo - Expo Router - TypeScript

**Solana** - @solana/web3.js - Solana Mobile Wallet Adapter

**State Management** - Zustand

**UI / UX** - React Native Reanimated - Expo Vector Icons

------------------------------------------------------------------------

## Installation

Clone the repository:

``` bash
git clone git@github.com:heysharan/SolScope.git
cd solscope
```

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

## Running the App

### Android

``` bash
npx expo prebuild
```

``` bash
npx expo run:android
```

------------------------------------------------------------------------

## Build Android APK

To generate an APK for distribution:

``` bash
cd android
./gradlew assembleRelease
```

Output file:

    android/app/build/outputs/apk/release/app-release.apk

------------------------------------------------------------------------

## Use Cases

SolScope can be used to:

-   Analyze Solana wallets on mobile
-   Track token holdings
-   View wallet transaction history
-   Quickly explore wallets shared in chats or social media
-   Perform token swaps through a connected wallet
