var abi = require('ethereumjs-abi')

var parameterTypes = ["address"];
var parameterValues = ["0x09A6C01a28F2583a190834D892B1b28AaC3e96A1"];

var encoded = abi.rawEncode(parameterTypes, parameterValues);

console.log(encoded.toString('hex'));