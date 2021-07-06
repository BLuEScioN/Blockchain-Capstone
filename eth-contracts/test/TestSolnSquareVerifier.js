const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const SquareVerifier = artifacts.require('Verifier');

contract('SolnSquareVerifier', accounts => {

    const account1 = accounts[0];
    const account2 = accounts[1];

    const proof = require('./proof.json');

    beforeEach(async function () {
        this.verifier = await SquareVerifier.new({ from: account1 });
        this.contract = await SolnSquareVerifier.new(this.verifier.address, { from: account1 });
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {
        const {proof: {a, b, c}, inputs: inputs} = proof;

        let key = await this.contract.generateKey(a, b, c, inputs);

        let result = await this.contract.addSolution(2, account1, key);

        assert.equal(result.logs.length, 1, 'No event emitted');
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {
        const {proof: {a, b, c}, inputs: inputs} = proof;

        let totalSupply = (await this.contract.totalSupply()).toNumber();

        await this.contract.mintToken(account2, 1, a, b, c, inputs, { from: account1 });

        let newTotalSupply = (await this.contract.totalSupply()).toNumber();

        assert.equal(totalSupply + 1, newTotalSupply, "Invalid proof");
    });
})





// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
