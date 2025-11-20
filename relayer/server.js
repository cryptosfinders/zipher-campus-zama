const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require('ethers');
const app = express();
app.use(cors()); app.use(bodyParser.json({limit:'2mb'}));

// In-memory store (demo)
const submissions = [];
let nextId = 0;

// Endpoint: register encrypted course (frontend calls this)
app.post('/api/register-course', (req,res)=>{
  const { ciphertext } = req.body;
  const id = ++nextId;
  const ts = Date.now();
  submissions.push({ id, ciphertext, ts, author: req.headers['x-signer'] || '0xanon' });
  // In a real deploy, relayer would call fhEVM contract registerEncryptedCourse with the ciphertext
  // For demo we just return a mock tx hash
  res.json({ status:'ok', id, txHash: '0xmock'+id });
});

// Endpoint: list submissions (frontend reads this)
app.get('/api/submissions', (req,res)=>{ res.json(submissions); });

// Endpoint: coprocessor / gateway job template (not implemented)
// e.g., POST /api/process -> call GPU endpoint or local HPU emulator, then call publishEncryptedResult on-chain via provider

const port = process.env.PORT || 4002;
app.listen(port, ()=> console.log('Relayer running on', port));
