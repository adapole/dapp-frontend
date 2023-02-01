# CoinFog

This demo shows how to use `CoinFog` mixer with a frontend dapp. You can use your own relay for withdrawing from the mixer contract. For your relay add a `.env` file to the project and store the memonic of the relay address you prefer. The relay address should have an account balance greater than zero, since it needs to pay for transaction fees when calling the smart contract.

```bash
NEXT_PUBLIC_TESTACCOUNT_MENMONIC='YOUR-MEMONIC-HERE'
```

## Deploy your own

Deploy the demo locally or preview live [CoinFog on Vercel](https://coinfog.vercel.app/) or [CoinFog on IPFS](https://coinfog.on.fleek.co/).

## How to run locally

Execute `dev` with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to run the demo on local server:

```bash
git clone https://github.com/adapole/dapp-frontend.git

cd dapp-frontend
```

```bash
npm install

npm run dev
```

```bash
pnpm install

pnpm dev
```

## Built with

Next.js + Tailwind CSS + Typescript
