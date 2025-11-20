## 📚 Zipher Campus — Zama Confidential Learning Platform

Privacy-Preserving Education Powered by Fully Homomorphic Encryption (FHE)

Built on the Zama Protocol · fhEVM · WASM Encryption · Coprocessor

---

## 🚀 Overview

Zipher Campus is a fully confidential on-chain learning platform built on the Zama FHE ecosystem.

It enables creators, educators, and institutions to run privacy-preserving classrooms, assignments, and assessments, where all user data remains encrypted—even while being processed.

Think of it as:

A PushCampus-style learning platform, upgraded with Zama-grade cryptography.
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
Frontend (Next.js)
 └── Zama WASM client
       ├── encrypt user inputs
       ├── send ciphertext to relayer
       └── decrypt results (user-side or KMS)

Relayer (Node.js)
 ├── Publishes encrypted data to fhEVM
 ├── Requests FHE computation from coprocessor
 └── Returns encrypted result + signature

Blockchain (fhEVM)
 ├── Stores encrypted assignments
 ├── Runs encrypted calculations
 └── Verifies Gateway/KMS signatures

Coprocessor (GPU/HPU)
 ├── Runs heavy encrypted ML tasks
 └── Returns encrypted outputs


Everything is encrypted end-to-end.

---

## 📦 Project Structure
zipher-campus/
│
├── frontend/        # Next.js app with Zama WASM integration
│   ├── app/
│   ├── pages/
│   ├── components/
│   └── lib/zamaClient.js
│
├── blockchain/      # fhEVM contracts + Hardhat fallback
│   ├── contracts/
│   │   └── PrivateCourseFHE.sol
│   ├── scripts/
│   └── hardhat.config.js
│
├── relayer/         # Coprocessor + KMS handler
    ├── server.js
    ├── kms.js
    ├── coprocessor.js
    └── api.js


---

## 🛠️ Installation
1️⃣ Clone Repo
git clone https://github.com/cryptosfinders/zipher-campus-zama
cd zipher-campus-zama

2️⃣ Install Frontend
cd frontend
npm install
npm run dev

3️⃣ Install Backend
cd relayer
npm install
npm start

4️⃣ Install Contracts (Hardhat)
cd blockchain
npm install
npx hardhat compile
npx hardhat node

🔑 Environment Variables

- Create .env.local in frontend/:

NEXT_PUBLIC_FHEVM_RPC=http://localhost:8545
NEXT_PUBLIC_GLOBAL_KEY_URL=/api/global-key
NEXT_PUBLIC_RELAYER_URL=http://localhost:4000
NEXT_PUBLIC_USE_FHE=true


- Create .env in relayer/:

RELAYER_GATEWAY_URL=https://gateway.zama.ai/v1
RELAYER_GATEWAY_KEY=YOUR_KEY
FHEVM_PRIVATE_KEY=0xYOUR_KEY
FHEVM_RPC=http://localhost:8545

---

## ▶️ How to Run the Demo
1. Start local blockchain
npx hardhat node

2. Run relayer
npm start

3. Run frontend
npm run dev


You can now open:

🔗 http://localhost:3000

---

## 🎬 Demo User Flow

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
