const Dropper = artifacts.require('./Dropper.sol')
const ERC6551Registry = artifacts.require('./ERC6551Registry.sol')
const ERC6551Account = artifacts.require('./ERC6551Account')

module.exports = async function (deployer) {
  await deployer.deploy(Dropper);
  await deployer.deploy(ERC6551Registry);
  await deployer.deploy(ERC6551Account);
}
