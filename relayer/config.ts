export default {
networks: {
local: {
rpc: process.env.NEXT_PUBLIC_ZIPHER_FHEVM_RPC || 'http://127.0.0.1:8545',
chainId: Number(process.env.NEXT_PUBLIC_ZIPHER_CHAIN_ID || 31337)
},
sepolia: {
rpc: process.env.SEPOLIA_RPC_URL || '',
chainId: 11155111
},
zama: {
rpc: process.env.ZAMA_FHEVM_RPC || '',
chainId: Number(process.env.ZAMA_CHAIN_ID || 10901)
}
},
signerPrivateKey: process.env.RELAYER_PRIVATE_KEY || ''
}
