//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./ZP.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GRAYCHARGE {
    ZONEPASS public Pass;
    address internal _owner;
    uint256 internal etherFee = 0.0016 ether;
    uint256 internal perPercentPrice = 0.2 ether;
    uint256 internal perPercentPricePoints = 10000;

    constructor (address pass){
        Pass = ZONEPASS(pass);
        _owner=msg.sender;
        //Pass.addModule(address(this));
    }
    modifier onlyOwner(){
        require(msg.sender == _owner, "Not Owner");
        _;
    }

    function getFeePerPercent() public view returns(uint256){
        return perPercentPrice;
    }
    
    function getFee() public view returns(uint256) {
        return etherFee;
    }

    function getOwner() public view returns(address){
        return _owner;
    }

    function setOwner(address owner) public onlyOwner{
        _owner = owner;
    }

    function setPriceInPoints(uint256 points) public onlyOwner{
        perPercentPricePoints = points;
    }

    function setRevenuePrice(uint256 amount) public onlyOwner{
        perPercentPrice = amount;
    }

    function setFee(uint256 amount) public onlyOwner{
        etherFee = amount;
    }
    
    function deposit(uint256 id , address token , uint256 amount) public payable{
        require(msg.value >= etherFee, "insufficient fee");
        require(IERC20(token).balanceOf(msg.sender) >= amount);
        Pass.deposit{value: msg.value}(id, token , amount, msg.sender);
        Pass.incrementServices(id,10);
    }

    function withdraw(uint256 id , address token , address to, uint256 amount) public payable{
        require(msg.value >= etherFee, "insufficient fee");
        Pass.withdraw{value: msg.value}(id, token , amount , to , msg.sender);
        Pass.incrementServices(id, 2);
    }

    function depositEth(uint256 amount , uint256 id) public payable{
        require(msg.value >= (etherFee + amount), "insufficient fee");
        Pass.depositEth{value:msg.value}(id , amount);
    }

    function withdrawEth(uint256 id , address to , uint256 amount) public payable{
        require(msg.value >= etherFee, "insufficient fee");
        Pass.withdrawEth{value: msg.value}(id , amount, to , msg.sender);
    }

    //special param => address 0 = eth
    function idToId(uint256 fromId , uint256 toId , address token , uint256 amount) public payable{
        require(msg.value >= etherFee, "insufficient fee");
      //  uint fee = _calculateFee(amount);
      //  (address minter, , , , , , , , , ) =Pass._zonepassmaps(toId);
       // (address minter2, , , , , , , , , ) =Pass._zonepassmaps(fromId);
        Pass.idToId{value: msg.value}(fromId, toId , token , amount);
        Pass.incrementServices(fromId , 10);
        Pass.incrementServices(toId , 2);
    }

    function transferPoints(uint256 fromId , uint256 toId, uint256 amount) public payable {
        require(msg.value >= etherFee, "insufficient fee");
        Pass.transferPoints{value: msg.value}(fromId , toId , amount);
    }

    function buyRevenuePercent(uint256 id, uint8 percent, bool pointsPay , uint256 fromId) public payable{
        address minter = Pass.getMinter(id);
        require(percent > 0 && percent <51,"Max 50% fee share can be bought");
        require(msg.sender == minter,"Only Minter can Buy Revenue shares");
        if(pointsPay == false){
            require(msg.value >= perPercentPrice * uint256(percent), "send appropriate fee");
            Pass.setRev{value:msg.value}(id, percent);
        }

        else {
            uint256 p =perPercentPricePoints * uint256(percent);
            require(Pass.ownerOf(fromId) == msg.sender,"not owner of paying id");
            require(Pass.getIdPoints(fromId) >= p,"Not enough points balance");
            Pass.decrementServices(fromId , p);
            Pass.setRev(id, percent);
        }
        
    }
}