## 📚 Zipher Campus — Zama Confidential Learning Platform

Privacy-Preserving Education Powered by Fully Homomorphic Encryption (FHE)

Built on the Zama Protocol · fhEVM · WASM Encryption · Coprocessor

---

## 🚀 Overview

Zipher Campus is a fully confidential on-chain learning platform built on the Zama FHE ecosystem.

It enables creators, educators, and institutions to run privacy-preserving classrooms, assignments, and assessments, where all user data remains encrypted—even while being processed.

Think of it as:

A learning platform, upgraded with Zama-grade cryptography.
A next-generation Coursera + on-chain privacy + encrypted ML.

---

## 🔐 Why Zipher Campus?

Traditional Web3 and Web2 learning platforms expose sensitive data:

- Quiz answers

- Student scores

- Personal metrics

- Performance analytics

With Zama’s Fully Homomorphic Encryption (FHE), Zipher Campus processes all these values in encrypted form, without ever seeing the raw numbers.

This ensures:

✔ Zero data exposure
✔ No trust in platform admins
✔ Transparent blockchain execution
✔ True user-owned privacy

---

## 🧠 Core Features
1️⃣ Confidential Courses (Encrypted Metadata)

Course details such as difficulty, scoring rules, or evaluation conditions can be encrypted.

2️⃣ Encrypted Assignments & Submissions

Students submit encrypted responses directly from the browser (via Zama WASM).

3️⃣ Encrypted ML Health Inference (optional module)

Using your idea:

Input: age, blood pressure, glucose

Values are encrypted in the browser

Sent to FHE contract or coprocessor

Model runs on ciphertext

Result is encrypted → only decrypted by KMS or user

4️⃣ fhEVM Smart Contracts

- Built using encrypted types:

euint64 encryptedScore;
euint8 encryptedPassed;


- Operations are executed using:

FHE.add()
FHE.mul()
FHE.compare()
FHE.ifElse()

5️⃣ Zama WASM Client Integration

Frontend loads Zama's client:

- Fetches global public key

- Encrypts data before sending

- Decrypts results with KMS or user-owned key

6️⃣ Coprocessor + Gateway Integration

For heavy FHE workloads:

- ML inference

- Multi-step scoring

- Batch evaluation

- Encrypted data is sent to a compute node, not decrypted.

7️⃣ Encrypted Discussion Feed

Posts & comments use encrypted payloads:

- Titles encrypted

- Body encrypted

- Likes encrypted (optional)

8️⃣ Encrypted Badges (SBT)

Completion badges are minted based on encrypted conditions.

---

## 🏗️ Architecture
---
---
                      ┌────────────────────────────────────────┐
                      │                Frontend                 │
                      │               (Next.js)                 │
                      ├────────────────────────────────────────┤
                      │ - Zama/WASM FHE Client                  │
                      │ - Encrypt user inputs (client-side)     │
                      │ - Generate keys (user-owned)            │
                      │ - Send ciphertext → Relayer             │
                      │ - Decrypt results locally               │
                      └────────────────────────────────────────┘
                                        │
                             Encrypted  │  Requests
                                        ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                            Relayer                           │
        │                           (Node.js)                           │
        ├──────────────────────────────────────────────────────────────┤
        │ - Verifies user auth / signature                             │
        │ - Receives ciphertext from frontend                           │
        │ - Formats calls for fhEVM                                     │
        │ - Publishes encrypted data via ethers.js / hardhat / viem     │
        │ - Receives encrypted results                                  │
        │ - Sends ciphertext → frontend                                 │
        └──────────────────────────────────────────────────────────────┘
                                        │
                             Encrypted  │  Transaction
                                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         Blockchain Layer (fhEVM)                         │
├──────────────────────────────────────────────────────────────────────────┤
│ - Smart Contracts with fheUint, fheBool, fheBytes                        │
│ - Computes over encrypted data (no plaintext ever exposed)               │
│ - Emits encrypted events/results                                         │
└──────────────────────────────────────────────────────────────────────────┘
                                        │
                             Encrypted  │  Outputs
                                        ▼
          ┌──────────────────────────────────────────────────────────┐
          │                 Frontend (User’s device)                 │
          ├──────────────────────────────────────────────────────────┤
          │ - Uses Zama WASM keys to decrypt contract outputs        │
          │ - Renders private results (e.g. progress, scores, etc.)  │
          └──────────────────────────────────────────────────────────┘

Everything is encrypted end-to-end.

---

## 📦 Project Structure
zipher-campus/
│
├── frontend/                     # Next.js + Zama WASM FHE Client
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   │   ├── fhe/                  # FHE WASM client
│   │   │   ├── index.ts
│   │   │   ├── keys.ts
│   │   │   ├── encrypt.ts
│   │   │   └── decrypt.ts
│   │   ├── api/                  # Relayer + Convex clients
│   │   └── onchain/              # Contract services + addresses
│   ├── providers/
│   ├── public/
│   ├── styles/
│   ├── env.ts
│   └── package.json
│
├── relayer/                      # Node.js Relayer (encrypted tx router)
│   ├── server.js                 # Main entrypoint
│   ├── config.ts
│   ├── routes/
│   │   ├── encrypt.ts            # Accept encrypted payloads
│   │   └── publish.ts            # Publish tx to fhEVM
│   ├── services/
│   │   ├── ethereum.ts           # RPC calls to fhEVM
│   │   ├── auth.ts               # Wallet/Convex signature validation
│   │   └── logging.ts
│   ├── abi/
│   ├── package.json
│   └── README.md
│
├── blockchain/                   # fhEVM Smart Contracts (FHE logic)
│   ├── contracts/
│   │   ├── Course.sol            # Example: encrypted course data
│   │   ├── Groups.sol
│   │   └── Utils.sol
│   ├── scripts/
│   │   ├── deploy.ts
│   │   └── encode.ts             # Compile + encode encrypted calls
│   ├── deployments/
│   ├── hardhat.config.js
│   ├── fhevm/                    # Zama fhevm helpers
│   │   ├── fhevm.ts
│   │   └── schema.ts
│   ├── test/
│   └── package.json
│
├── convex/                       # Convex backend (non-sensitive data)
│   ├── api/
│   ├── media.ts
│   ├── users.ts
│   ├── groups.ts
│   ├── posts.ts
│   ├── lessons.ts
│   ├── courses.ts
│   ├── schema.ts
│   ├── convex.config.js
│   └── utils.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FHE_FLOW.md
│   └── CONTRACT_DESIGN.md
│
├── scripts/
│   ├── setup-project.sh          # Auto setup (install + prepare keys)
│   └── generate-keys.ts          # FHE keypair generation
│
├── docker/
│   ├── Dockerfile.relayer
│   ├── Dockerfile.frontend
│   └── compose.yaml
│
├── .env                          # Root env
├── package.json
└── README.md

---

## 🛠️ Installation
1️⃣ Clone Repo
git clone https://github.com/cryptosfinders/zipher-campus-zama
cd zipher-campus-zama

2️⃣ Install Frontend
cd frontend
npm install
npm run dev

3️⃣  Install backend and server
cd relayer 
node server.js

cd convex
npm run convex:dev

npm install
npm start

4️⃣ Install Contracts (Hardhat)
cd blockchain or
cd zipher-fhevm
npm install
npx hardhat compile
npx hardhat node

🔑 Environment Variables

##############################################
# CONVEX - LOCAL
##############################################
CONVEX_DEPLOYMENT=anonymous:anonymous-zipher-campus-zama
NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210

##############################################
# NETWORK SWITCH (MAIN TOGGLE)
##############################################
# fhevm  = local hardhat FHE VM
# sepolia = Ethereum Sepolia testnet
NEXT_PUBLIC_NETWORK=sepolia

##############################################
# RPC ENDPOINTS
##############################################
# Local FH-EVM / Hardhat
NEXT_PUBLIC_ZIPHER_FHEVM_RPC=http://127.0.0.1:8545
NEXT_PUBLIC_ZIPHER_CHAIN_ID=31337
NEXT_PUBLIC_BLOCK_EXPLORER_URL=http://localhost:8545
NEXT_PUBLIC_NATIVE_TOKEN_SYMBOL=FHE

# Sepolia RPC
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/Q5SVqxq6UPyg0qOg6nkHY
NEXT_PUBLIC_SEPOLIA_CHAIN_ID=11155111
NEXT_PUBLIC_SEPOLIA_EXPLORER=https://sepolia.etherscan.io
NEXT_PUBLIC_SEPOLIA_NATIVE_SYMBOL=ETH

##############################################
# CONTRACT ADDRESSES — (YOU WILL UPDATE THESE)
##############################################
# ⭐ Important: FH-EVM and Sepolia will not share addresses.

### FH-EVM (local hardhat) contracts:
#NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
#NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
#NEXT_PUBLIC_REGISTRAR_CONTRACT_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0

### Sepolia contracts (replace after deployment):
NEXT_PUBLIC_MEMBERSHIP_CONTRACT_ADDRESS=0xfcBbe248206a4BF7A56598A9Ef2b7A955fF1Ea03
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=0xBAAAD6aeDdA4765Cf86e93dcFAED3Ab50c4f7b26
NEXT_PUBLIC_REGISTRAR_CONTRACT_ADDRESS=0x0E6b7c44E4f753C80933eB2640d94bC41b896be4

##############################################
# COMMON SETTINGS
##############################################
NEXT_PUBLIC_PLATFORM_TREASURY_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
NEXT_PUBLIC_REVENUE_SPLIT_ROUTER_ADDRESS=0x0165878A594ca255338adfa4d48449f69242Eb8F

NEXT_PUBLIC_FHE_REPUTATION_ADDRESS=0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1

NEXT_PUBLIC_PRODUCT_NAME=Zipher Campus
NEXT_PUBLIC_BRAND_COLOR=#F5B700
NEXT_PUBLIC_BRAND_ACCENT=#FF6A00

NEXT_PUBLIC_SUBSCRIPTION_PRICE_USD=1
NEXT_PUBLIC_PLATFORM_FEE_BPS=0
NEXT_PUBLIC_PLATFORM_MIN_FEE_WEI=0
NEXT_PUBLIC_MEMBERSHIP_DURATION_SECONDS=2592000
NEXT_PUBLIC_MEMBERSHIP_TRANSFER_COOLDOWN_SECONDS=86400

NEXT_PUBLIC_USE_FHE=false
NEXT_PUBLIC_ZAMA_GATEWAY_URL=https://gateway.zama.ai/v1
NEXT_PUBLIC_GLOBAL_KEY_URL=/api/global-key
NEXT_PUBLIC_RELAYER_URL=http://localhost:4002

---

## ▶️ How to Run 
1. Start local blockchain
npx hardhat node

2. Run relayer
npm start

3. Run frontend
npm run dev

You can now open:

🔗 http://localhost:3000

---

## 🎬 User Flow

- Connect wallet

- Create new confidential course

- Enter sample metrics (e.g., health inference)

- Values are encrypted in-browser

- Submit assignment → ciphertext stored on-chain

- Relayer performs encrypted computation

- Result returned (still encrypted)

- User decrypts result locally or via KMS

---

## 🌟 Why Zipher Campus is Unique

- 100% encrypted learning

- Fully homomorphic operations

- Zero knowledge grading

- Coprocessor ML integration

- Encrypted feed + interactions

- Zama WASM everywhere

- Built to scale to thousands of students

This goes far beyond traditional Web3 education platforms.

---

## 🧭 Roadmap

### Phase 1 (MVP)

Encrypted submissions

Confidential course metadata

Basic encrypted scoring

### Phase 2

Encrypted badges

Coprocessor ML inference

### Phase 3

Encrypted discussion feed

zk-attested student identity

### Phase 4

Full Zama Gateway + KMS integration

Deploy to Zama testnet

---

## 📝 License

MIT License.
Open-source. Build on it freely.

---

## 🙌 Credits

Built with ❤️ for
@zama_fhe · Zama Creator Program · Zama Ecosystem

---

## 📧 Contact

For support, collaboration, or technical questions:

- **GitHub**: [@cryptosfinders](https://github.com/cryptosfinders) 
- **Twitter**: [@cryptos_finders](https://x.com/cryptos_finders)
