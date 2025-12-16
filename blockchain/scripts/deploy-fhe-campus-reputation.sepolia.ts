import { ethers } from 'hardhat'


async function main() {
console.log('🚀 Deploying to Sepolia...')


// Replace with real addresses or environment variables
const ACL = process.env.SEPOLIA_ACL || '0x0000000000000000000000000000000000000000'
const COP = process.env.SEPOLIA_COP || '0x0000000000000000000000000000000000000000'
const ORACLE = process.env.SEPOLIA_ORACLE || '0x0000000000000000000000000000000000000000'
const KMS = process.env.SEPOLIA_KMS || '0x0000000000000000000000000000000000000000'


const FHECampus = await ethers.getContractFactory('FHECampusReputation')
const repo = await FHECampus.deploy(ACL, COP, ORACLE, KMS)
await repo.deployed()


console.log('🎉 Sepolia FHECampusReputation deployed at:', repo.address)
}


main().catch(err => {
console.error(err)
process.exitCode = 1
})
