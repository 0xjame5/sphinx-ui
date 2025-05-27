This is a Cosmos App project bootstrapped with [`create-cosmos-app`](https://github.com/cosmology-tech/create-cosmos-app).

## Getting Started

First, install the packages and run the development server:

```bash
yarn && yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contract Configuration

To point the application to your lottery contract, you need to modify the configuration in `config/lottery.ts`:

```typescript
// config/lottery.ts
export const FREEDOM_LIST: string[] = [
  'your-contract-address-here',
];

export const PRIMARY_RUNNING_GAME = FREEDOM_LIST[0];
```

Replace `'your-contract-address-here'` with your deployed contract address. The `PRIMARY_RUNNING_GAME` constant is used throughout the application to reference the active lottery contract.

You can also add multiple contract addresses to the `FREEDOM_LIST` array if you want to support multiple lotteries. The first address in the list will be used as the primary game.

## Backend Contract

The smart contract implementation for this lottery system can be found in the [cw-sphinx](https://github.com/0xjame5/cw-sphinx) repository. This repository contains the CosmWasm smart contract code that powers the lottery functionality.

## Application Overview

Sphinx UI is a lottery application built on the Cosmos blockchain. The application consists of two main user interfaces:

1. **Player Interface** (`/`)
   - Home page showing the current lottery state
   - Requires wallet connection to interact
   - Displays game state and play button when connected
   - Players can view active lotteries and participate

2. **Admin Interface** (`/admin`)
   - Create new lottery contracts (`/admin/create`)
   - Manage existing lotteries (`/admin/[id]`)
   - Monitor lottery states and execute draws

3. **Play Interface** (`/play/[id]`)
   - Dedicated page for participating in specific lotteries
   - Purchase tickets and view lottery details
   - Claim winnings when applicable

## User Flows

### Player Flow
1. Connect wallet on the home page
2. View active lottery state
3. Click play button to participate
4. Purchase tickets using the specified token denomination
5. Wait for lottery completion
6. Claim winnings if selected as winner

### Admin Flow
1. Navigate to admin portal
2. Create new lottery with parameters:
   - Contract Owner address
   - Ticket Cost Amount
   - Token Denomination
   - Duration
   - House Fee
3. Monitor lottery state
4. Execute lottery draw when in CHOOSING state
5. Track winner and claim status

## Lottery Contract States

The lottery contract operates in three states:

1. **OPEN**: The lottery is accepting ticket purchases
2. **CHOOSING**: The lottery is closed for purchases and waiting for admin to execute the draw
3. **CLOSED**: The lottery has been executed and has a winner

Players can:
- Purchase tickets while the lottery is OPEN
- Claim their winnings if they are the winner and the lottery is CLOSED

## Learn More 
