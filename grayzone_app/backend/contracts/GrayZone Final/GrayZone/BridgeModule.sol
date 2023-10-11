//SPDX-License-Identifier: NONE
pragma solidity ^0.8.0;

import "./LZO/NonblockingLzApp.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ZonePass.sol";

contract BridgeModule is NonblockingLzApp, ReentrancyGuard{
    uint16 public constant FUNCTION_TYPE_SEND = 1;
    
    ZONEPASS public Pass;
    
    uint public minGasToTransferAndStore; // min amount of gas required to transfer, and also store the payload
    mapping(uint16 => uint) public dstChainIdToBatchLimit;
    mapping(uint16 => uint) public dstChainIdToTransferGas;
    mapping(address => uint256) public userNonces;
    constructor
    (
        address endpoint, 
        uint256 _minGasToTransferAndStore,
        address _zonepass
    ) {
        require(_minGasToTransferAndStore > 0, "minGasToTransferAndStore must be > 0");
        lzEndpoint = ILayerZeroEndpoint(endpoint);
        minGasToTransferAndStore = _minGasToTransferAndStore;
        Pass = ZONEPASS(_zonepass);
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal virtual override{
    
    
    }


//bytes memory payload = abi.encode();

/*
PARAM TYPES = ENCODING =>

IdToId fungible transfer 
    =>send tokens to contract on dest chain => dest chain mints params;
=> {

        uint id,
        uint16 dstChain
    }
*/
    
    
    function estimateSendFee(
        uint16 _dstChainId,
        bool _useZro,
        bytes memory payload,
        bytes memory _adapterParams
    ) public view virtual returns (uint nativeFee, uint zroFee) {
        return lzEndpoint.estimateFees(_dstChainId, address(this), payload, _useZro, _adapterParams);
    }
}