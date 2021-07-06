import Web3 from "web3";
import ERC721 from "../../eth-contracts/build/contracts/ERC721MintableComplete.json";
import SolnSquareVerifier from "../../eth-contracts/build/contracts/SolnSquareVerifier.json";
let proof = require('../../eth-contracts/test/proof.json');

const App = {
    web3: null,
    account: null,
    accounts: null,
    meta: null,
    erc721ContractAddress: '0xa08A617E9Ad682053EF1eCA9424158C922a23fff',
    solnSquareVeriferContractAddress: '0xdd5503E258E5902FA28A4FbB31051c1448AadeD8',
    verifierContractAddress: '0x09A6C01a28F2583a190834D892B1b28AaC3e96A1',

    start: async function() {
        const { web3 } = this;

        try {
        this.erc721Contract = new web3.eth.Contract(
            ERC721.abi,
            this.erc721ContractAddress,
        );

        this.solnSquareVerifierContract = new Web3.eth.Contract(
            SolnSquareVerifier.abi,
            this.solnSquareVeriferContractAddress
        );

        // get accounts
        const accounts = await web3.eth.getAccounts();
        this.account = accounts[0];
        this.accounts = accounts;
        } catch (error) {
        console.error("Could not connect to contract or chain.");
        }
        
        // Acccounts now exposed
        window.ethereum.on('accountsChanged', function () {
            web3.eth.getAccounts(function (error, accounts) {
                this.account = accounts[0];
                console.log(accounts[0], 'current account after account change');
            });
        });
    },

    mint: async function() {
        console.log('minting started');

        const { proof: { a, b, c }, inputs: inputs } = proof;
        console.log({ a, b, c, inputs });

        const tokenId = document.getElementById("tokenId").value;
        console.log({ tokenId });

        try {
            this.solnSquareVeriferContract.mintToken(this.account, a, b, c, inputs, { from: this.account });
            console.log(`Real estate property ${tokenId} registered to ${this.account}`);
        } catch (err) {
            console.error('minting error');
            console.error(err);
        }
    }
};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    try {
        await window.ethereum.enable(); // get permission to access accounts
    } catch (error) {
        console.error("Permission to access account denied");
    }
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});
