//SPDX-License-Identifier: NONE
pragma solidity ^0.8.0;

import "./NonblockingLzApp.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@"

contract BridgeModule is NonblockingLzApp, ReentrancyGuard{
    uint16 public constant FUNCTION_TYPE_SEND = 1;

    uint public minGasToTransferAndStore; // min amount of gas required to transfer, and also store the payload
    mapping(uint16 => uint) public dstChainIdToBatchLimit;
    mapping(uint16 => uint) public dstChainIdToTransferGas;

    function __initBridge(address endpoint, uint256 _minGasToTransferAndStore) internal {
        require(_minGasToTransferAndStore > 0, "minGasToTransferAndStore must be > 0");
        lzEndpoint = ILayerZeroEndpoint(endpoint);
        minGasToTransferAndStore = _minGasToTransferAndStore;
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal virtual override{

    }

    function _sendData(
        uint16 dstId , 
        bool _useZro, 
        bytes memory payload , 
        bytes memory adapterParams,
        address payable _refundAddress,
        address _zroPaymentAddress
        ) internal virtual{
            //send
    }

    function _rcvData() internal virtual{}

    function estimateSendFee(
        uint16 _dstChainId,
        bool _useZro,
        bytes memory payload,
        bytes memory _adapterParams
    ) public view virtual returns (uint nativeFee, uint zroFee) {
        return lzEndpoint.estimateFees(_dstChainId, address(this), payload, _useZro, _adapterParams);
    }
}