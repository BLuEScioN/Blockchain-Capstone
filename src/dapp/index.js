import Web3 from "web3";
import ERC721 from "../../eth-contracts/build/contracts/ERC721MintableComplete.json";
import SolnSquareVerifier from "../../eth-contracts/build/contracts/SolnSquareVerifier.json";
import proofs from "./proofs/proofs";

const App = {
    web3: null,
    account: null,
    accounts: null,
    meta: null,
    erc721ContractAddress: '0x5771C056e8b3fbaC58DF5f8F8805eD084d0Fb367',
    solnSquareVerifierContractAddress: '0x9Be84f3E670011CC6456713EC2e7Cf160e96A036',
    verifierContractAddress: '0x63857bc068daCC364D2cA8cfB24A35087798c5EA',
    proofIndex: 0,

    start: async function() {
        const { web3 } = this;

        try {
            this.erc721Contract = new web3.eth.Contract(
                ERC721.abi,
                this.erc721ContractAddress,
            );

            this.solnSquareVerifierContract = new web3.eth.Contract(
                SolnSquareVerifier.abi,
                this.solnSquareVerifierContractAddress
            );

            // get accounts
            const accounts = await web3.eth.getAccounts();
            console.log({ accounts });
            this.account = accounts[0];
            console.log('current account:', this.account);
            this.accounts = accounts;
            console.log('proofIndex', this.proofIndex)
        } catch (error) {
            console.error("Could not connect to contract or chain.");
            console.error(error);
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
        event.preventDefault();

        console.log('minting started');

        const { proof: { a, b, c }, inputs: inputs } = proofs[this.proofIndex++];
        console.log('mint parameters:', { a, b, c, inputs, proofIndex: this.proofIndex });

        const tokenId = document.getElementById("tokenId").value;
        console.log({ tokenId });

        try {
            let tx = await this.solnSquareVerifierContract.methods.mintToken(this.account, tokenId, a, b, c, inputs).send({ from: this.account, gas: 4500000  });
            console.log(`Real estate property ${tokenId} registered to ${this.account}`);
            console.log("Tx:", tx.transactionHash);
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
        console.log("Asking for permission to access accounts")
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
