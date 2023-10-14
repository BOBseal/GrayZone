
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract BOTGENTOKEN is ERC20 , ERC20Burnable, ERC20Permit{
    //deflationary taxed token - to toggle deflation on/off set tax/fee to more thn 0 / equal to 0 
    //auto-burn 50% of fee
    address public owner;
    uint256 public tax;

    event OwnerTransfer(address indexed oldOwner , address indexed newOwner);    
    constructor(
        string memory name,
        string memory symbol,
        address initialHolder,
        uint256 initialSupply
    ) ERC20(name, symbol) ERC20Permit(name) {
        // Mint initial supply to the contract deployer
        _mint(initialHolder, initialSupply);
        owner = initialHolder;
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == owner,"not owner");
        owner = newOwner;
        emit OwnerTransfer(msg.sender , newOwner);
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override(ERC20) {
         uint256 amt;
         if(tax > 0){
            uint256 fee = amount * tax / 100;
            amt = amount - fee;
            super._transfer(from , owner , fee/2);
            burn(fee/2);
         }
         if(tax == 0) {
            amt = amount;
         }
         super._transfer(from , to , amt);
    }
    
    function changeFee(uint256 percent) public {
        require(msg.sender == owner, "owner function");
        require(percent < 16,"fee cannot exceed 15% max");
        tax = percent;
    }
}