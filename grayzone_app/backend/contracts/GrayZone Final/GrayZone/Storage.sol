pragma solidity ^0.8.17;

import "./ZonePass.sol";

contract GrayStore {
    ZONEPASS internal pass;
    address internal _owner;

    constructor(address _pass){
        pass = ZONEPASS(_pass);
        _owner = msg.sender;
    }
}