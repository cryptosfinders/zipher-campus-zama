import { ethers } from 'hardhat'


async function main() {
console.log('🚀 Deploying to PushChain network (config-driven)')


const ACL = process.env.PUSH_ACL || '0x0000000000000000000000000000000000000000'
const COP = process.env.PUSH_COP || '0x0000000000000000000000000000000000000000'
const ORACLE = process.env.PUSH_ORACLE || '0x0000000000000000000000000000000000000000'
const KMS = process.env.PUSH_KMS || '0x0000000000000000000000000000000000000000'


const FHECampus = await ethers.getContractFactory('FHECampusReputation')
const repo = await FHECampus.deploy(ACL, COP, ORACLE, KMS)
await repo.deployed()


console.log('🎉 PushChain FHECampusReputation deployed at:', repo.address)
}


main().catch(err => {
console.error(err)
process.exitCode = 1
})
