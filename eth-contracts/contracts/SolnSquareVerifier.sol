pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";
    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
    SquareVerifier public verifier;

    constructor(address verifierAddress) ERC721MintableComplete() public{
        verifier = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address addr;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address addr);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 index, address addr, bytes32 key) public {
        Solution memory solution = Solution({ index: index, addr: addr });
        solutions.push(solution);
        uniqueSolutions[key] = true;
        emit SolutionAdded(index, addr);
    }

    function generateKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) vew internal returns (bytes32) {
        return keccak256(abi.encodedPacked(a, b , c, inputs));
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address to , uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory inputs) public {
        bytes32 key = generateKey(a, b, c, inputs);
        require(!uniqueSolutions[key], "Solution already exists");
        bool isValidProof = verifier.verifyTx(a, b, c, inputs);
        require(isValidProof, "Invalid proof");
        addSolution(tokenId, to, key);
        super.mint(to, tokenId);
    }
}

  


























