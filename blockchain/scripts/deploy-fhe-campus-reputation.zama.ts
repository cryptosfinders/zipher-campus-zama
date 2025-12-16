import { ethers } from 'hardhat'


async function main() {
console.log('🚀 Deploying to Zama FH-EVM (remote)...')


const ACL = process.env.ZAMA_ACL || '0x0000000000000000000000000000000000000000'
const COP = process.env.ZAMA_COP || '0x0000000000000000000000000000000000000000'
const ORACLE = process.env.ZAMA_ORACLE || '0x0000000000000000000000000000000000000000'
const KMS = process.env.ZAMA_KMS || '0x0000000000000000000000000000000000000000'


const FHECampus = await ethers.getContractFactory('FHECampusReputation')
const repo = await FHECampus.deploy(ACL, COP, ORACLE, KMS)
await repo.deployed()


console.log('🎉 Zama FHECampusReputation deployed at:', repo.address)
}


main().catch(err => {
console.error(err)
process.exitCode = 1
})
