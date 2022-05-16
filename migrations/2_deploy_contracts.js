const SupplyChain = artifacts.require("./coffeebase/SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChain);
};
