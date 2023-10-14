pragma solidity ^0.8.17;

import "./ZP.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GRAYCHARGE {
    ZONEPASS public Pass;
    address internal _owner;
    uint256 internal _feePercent;
    uint256 internal _baseFee;
    uint256 internal _etherfees;

    constructor (address pass){
        Pass = ZONEPASS(pass);
        _owner=msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == _owner, "Not Owner");
        _;
    }
    function getOwner() public view returns(address){
        return _owner;
    }

    function getTransferFee() public view returns(uint256){
        return _feePercent;
    }

    function getBaseFee() public view returns(uint256){
        return _baseFee;
    }

    function getRevenue() public view returns(uint256){
        return _etherfees;
    }

    function setTransferFee(uint256 percent) public onlyOwner{
        require(percent < 6);
        _feePercent = percent;
    }

    function setBaseFee(uint256 _wei) public onlyOwner{
        _baseFee = _wei;
    }

    function setOwner(address owner) public onlyOwner{
        _owner = owner;
    }

    function feeWithdraw( uint256 amt ,address to) public onlyOwner{
        require(amt <= _etherfees);
        _etherfees = _etherfees - amt;
        payable(to).transfer(amt);
    }

    function deposit(uint256 id , address token , uint256 amount) public payable{
        require(IERC20(token).balanceOf(msg.sender) >= amount);
        require(msg.value >= _baseFee);
        uint fee = _calculateFee(amount);
        uint amt = amount - fee;
        (address minter, , , , , , , , , , ) =Pass._zonepassmaps(id);
        Pass.deposit(id, token , amt, msg.sender);
        IERC20(token).transferFrom(msg.sender , minter , fee);
        Pass.incrementServices(id,10);
    }

    function withdraw(uint256 id , address token , address to, uint256 amount) public payable{
        Pass.withdraw(id, token , amount , to , msg.sender);
        Pass.incrementServices(id, 2);
    }

    //special param => address 0 = eth
    function idToId(uint256 fromId , uint256 toId , address token , uint256 amount) public payable{
      //  uint fee = _calculateFee(amount);
      //  (address minter, , , , , , , , , ) =Pass._zonepassmaps(toId);
       // (address minter2, , , , , , , , , ) =Pass._zonepassmaps(fromId);
        Pass.idToId(fromId, toId , token , amount);
        Pass.incrementServices(fromId , 10);
        Pass.incrementServices(toId , 2);
    }

    function _calculateFee(uint256 amt) internal view returns(uint256){
        require(amt > 0);
        uint256 fee = (amt * _feePercent) /100;
        return  fee;
    }
}