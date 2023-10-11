pragma solidity ^0.8.17;

import "./ZP.sol";

contract GRAYSTORE {
    ZONEPASS public Pass;
    address internal _owner;
    uint256 public nonces;

    struct Stored{
        uint256 id;
        uint256 storeNonce;
        address executor;
        uint16 chainId;
        uint256 storeTime;
    }

    mapping(uint256=> Stored) public usage;

    constructor(address _pass) {
        Pass = ZONEPASS(_pass);
        _owner = msg.sender;
    }

    function getHolder(uint256 id) public view returns(address){
        (, address h ,,,,,,,,)= Pass._zonepassmaps(id);
        return h;
    }

    function getChainId(uint256 id) public view returns(uint16){
       return Pass.getActiveChain(id);
    }

    function addToStore(uint256 id , string memory storeUri , bytes memory data ) public payable{
        require(getHolder(id) == msg.sender,"must be holder");
        Pass.addToStorage(storeUri , id , data , msg.sender);
        usage[nonces].id = id;
        usage[nonces].storeNonce = nonces;
        usage[nonces].executor = msg.sender;
        uint16 ch = getChainId(id);
        usage[nonces].chainId = ch;
        usage[nonces].storeTime = block.timestamp;
        nonces ++;
    }

    function deleteSlot(uint256 id , uint256 slot) public payable{
        Pass.delFromStorage(id, slot , msg.sender);
    }
    
}