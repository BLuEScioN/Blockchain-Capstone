// migrating the appropriate contracts
var ERC721MintableComplete = artifacts.require("ERC721MintableComplete");
var Verifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = function(deployer) {
  deployer.deploy(ERC721MintableComplete);
  deployer.deploy(Verifier)
    .then(() => deployer.deploy(SolnSquareVerifier, Verifier.address));
};
