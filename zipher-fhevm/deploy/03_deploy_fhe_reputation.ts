import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const networkName = network.name

  // We usually only want this on the FHEVM / local FH chain – not Sepolia.
  if (networkName === 'sepolia') {
    log('⏭  Skipping FHEReputation on Sepolia (FHE-only contract).')
    return
  }

  log('🚀 Deploying FHEReputation...')

  // Need the Registrar address from 01_deploy_registrar.ts
  const registrarDep = await deployments.get('Registrar')

  // OPTIONAL: put your relayer / backend address here for now.
  // You can also pass deployer and change later via setUpdater().
  const relayerAddress =
    process.env.FHE_REPUTATION_RELAYER ??
    deployer

  const fheReputation = await deploy('FHEReputation', {
    from: deployer,
    args: [registrarDep.address, relayerAddress],
    log: true,
  })

  log(`✅ FHEReputation deployed at: ${fheReputation.address}`)
}

export default func

func.tags = ['FHEReputation']
