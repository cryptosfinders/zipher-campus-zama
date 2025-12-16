require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// ---- env ----
const GATEWAY_URL = process.env.RELAYER_GATEWAY_URL;       // e.g. https://gateway.zama.ai/v1
const GATEWAY_KEY = process.env.RELAYER_GATEWAY_KEY;       // your gateway key
const FHEVM_PRIVATE_KEY = process.env.FHEVM_PRIVATE_KEY;   // relayer signer (0x...)
const FHEVM_RPC = process.env.FHEVM_RPC || 'http://127.0.0.1:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || null;
const ABI_PATH = process.env.ABI_PATH || './abi/PrivateCourseFallback.json';

// ---- provider & signer ----
const provider = new ethers.JsonRpcProvider(FHEVM_RPC);
let signer = null;
if (FHEVM_PRIVATE_KEY && FHEVM_PRIVATE_KEY.length > 10) {
  signer = new ethers.Wallet(FHEVM_PRIVATE_KEY, provider);
  console.log('Relayer signer loaded:', signer.address);
} else {
  console.log('⚠️ No FHEVM_PRIVATE_KEY set or invalid. Relayer will not sign txs.');
}

// ---- load ABI (if present) and connect contract ----
let contract = null;
let abi = null;
try {
  const abiJson = fs.readFileSync(path.resolve(__dirname, ABI_PATH), 'utf8');
  const artifact = JSON.parse(abiJson);
  abi = artifact.abi || artifact;
  if (CONTRACT_ADDRESS && signer) {
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    console.log('Connected to contract at', CONTRACT_ADDRESS);
  } else if (CONTRACT_ADDRESS) {
    console.log('Contract address set but no signer — set FHEVM_PRIVATE_KEY to enable on-chain txs.');
  } else {
    console.log('No CONTRACT_ADDRESS set — relayer will only call gateway and store results locally.');
  }
} catch (e) {
  console.log('ABI not found or invalid at', ABI_PATH, '- continuing without on-chain calls.');
}

// ---- in-memory DB (demo); replace with persistent DB in production ----
const submissions = [];
let nextId = 0;

/*
  Expected contract functions (assumptions):
  - registerEncryptedCourse(string ciphertext)         // for writing new ciphertext on-chain
  - publishEncryptedResult(string ciphertextOrResult) // for writing compute results on-chain

  We'll check for function existence before trying to call.
*/

// ---- Endpoint: register encrypted course (store + optionally tx register) ----
app.post('/api/register-course', async (req, res) => {
  try {
    const { ciphertext, doOnChain } = req.body;
    if (!ciphertext) return res.status(400).json({ error: 'ciphertext required' });

    const id = ++nextId;
    const ts = Date.now();
    const author = req.headers['x-signer'] || '0xanon';
    submissions.push({ id, ciphertext, ts, author });

    let txHash = null;
    if (doOnChain && contract) {
      // check method exists
      if (contract.registerEncryptedCourse) {
        const tx = await contract.registerEncryptedCourse(ciphertext);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      } else if (contract.register) {
        // fallback if different name
        const tx = await contract.register(ciphertext);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      } else {
        console.warn('No recognized on-chain write method found on contract ABI.');
      }
    }

    return res.json({ status: 'ok', id, txHash });
  } catch (err) {
    console.error('register-course error:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// ---- Endpoint: call Zama gateway to run FHE compute ----
app.post('/api/process', async (req, res) => {
  try {
    const { ciphertext, computeOptions } = req.body;
    if (!ciphertext) return res.status(400).json({ error: 'ciphertext required' });
    if (!GATEWAY_URL || !GATEWAY_KEY) {
      return res.status(500).json({ error: 'Gateway not configured. Set RELAYER_GATEWAY_URL and RELAYER_GATEWAY_KEY.' });
    }

    // Example gateway payload - adjust to Zama gateway API spec you have
    const payload = {
      job_type: 'fhe-compute',
      input: ciphertext,
      options: computeOptions || {}
    };

    const response = await axios.post(
      `${GATEWAY_URL.replace(/\/$/, '')}/compute`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': GATEWAY_KEY
        },
        timeout: 120000 // 2min - adjust as needed
      }
    );

    const gatewayResult = response.data;

    // Optionally publish result on-chain (if contract has publishEncryptedResult)
    let txHash = null;
    if (contract && (contract.publishEncryptedResult || contract.publishResult)) {
      const out = gatewayResult.output || gatewayResult.result || JSON.stringify(gatewayResult);
      if (contract.publishEncryptedResult) {
        const tx = await contract.publishEncryptedResult(out);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      } else {
        const tx = await contract.publishResult(out);
        const receipt = await tx.wait();
        txHash = receipt.transactionHash;
      }
    }

    return res.json({ status: 'ok', gatewayResult, txHash });
  } catch (err) {
    console.error('process error:', err?.response?.data || err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

// ---- Endpoint: list submissions ----
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

// ---- simple health ----
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// ---- start server ----
const port = process.env.PORT || 4002;
app.listen(port, () => console.log('Relayer running on', port));
