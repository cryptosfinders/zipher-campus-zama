import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from '../artifacts/contracts/PrivateCourseFallback.sol/PrivateCourseFallback.json'; // adjust path if needed

const CONTRACT_ADDRESS =
  process.env.REACT_APP_CONTRACT_ADDRESS ||
  '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function useContract() {
const [provider, setProvider] = useState(null);
const [signer, setSigner] = useState(null);
const [contract, setContract] = useState(null);

useEffect(() => {
if (!window.ethereum) return;

const p = new ethers.BrowserProvider(window.ethereum);
setProvider(p);

(async () => {
await window.ethereum.request({ method: 'eth_requestAccounts' });
const s = await p.getSigner();
setSigner(s);
const c = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, s);
setContract(c);
})();
}, []);

return { provider, signer, contract };
}
