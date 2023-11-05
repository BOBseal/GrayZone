pragma solidity ^0.8.17;

import "./ZP.sol";
import "./genesisMinter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ZoneLend {
    ZONEPASS internal Pass;
    GenesisMint internal Gen;
    address public weth;
    address public usdc;
    AggregatorV3Interface internal ethFeed;
    uint256 internal interestRatePerDay = 1; // 0.01% interest rate per day
    uint256 internal borrowNonce;
    uint256 internal lendNonce;
    uint256 internal cTokensNonce;
    uint256 internal lTokenNonce;
    uint256 internal ratePerDay = 1; // 0.01 %
    uint256 internal contractId; // nft id of this contract

    struct Allowances{
        uint256 amount;
        address token;
        uint256 nonce;
        uint256 id;
    }

    struct Lends{
        uint256 id;
        address[] tokens;
        uint256[] lendedAmts;
    }

    struct Borrower{
        uint256 id;
        address token;
        uint256 amountTaken;
        uint256 amountToPay;
        address collateralUsed;
        uint256 collateralAmount;
    }

    constructor(address pass , address gen , address _usdc, address _ethPriceFeed){
        Pass = ZONEPASS(pass);
        Gen = GenesisMint(gen);
        contractId = Gen.nonce();
        Gen.Claim();
        ethFeed = AggregatorV3Interface(_ethPriceFeed);
        weth = Pass.getFeeToken();
        usdc = _usdc;
    }

    mapping (uint256 => address) internal cTokens; // allowed tokens as collateral
    mapping (uint256 => address) internal lTokens; // allowed lending tokens
    mapping (uint256 => Borrower) internal borrows; // borrowers
    mapping (address => uint256 ) internal lPools; // total pools for lending 
    mapping (address => uint256 ) internal feePools; // fee pools of lending tokens -- extra amount returned;
    mapping (uint256 => Allowances) internal lAllowances; // id lending allowances -- for interacting with the base


    function lend(uint256 id , address token , uint256 amount) public{
        require(isAllowedLend(token)== true,"not allowed token to lend");
        require(Pass.ownerOf(id) == msg.sender , "not owner");
        require(Pass.isExpired(id)== false && Pass.getIdBalance(token,id) >= amount,"expired or no collateral");
        Allowances memory x =lAllowances[lendNonce];
        Pass.idToId(id, contractId , token, amount);
        x.token = token;
        x.amount = x.amount + amount;
        x.id = id;
        x.nonce= lendNonce;
        lPools[token] = lPools[token] + amount;
        Pass.incrementServices(id, 12);
        lendNonce++;
    }

    // Collateral amount needed to be got from calculateCollateral();

    function borrow(uint256 id,address bTkn,uint256 _bAmt, address _cTkn) public {
        uint256 _cAmount = calculateCollateral(bTkn , _cTkn, _bAmt);
        require(isAllowedLend(bTkn)== true && isAllowedCollateral(_cTkn)== true ,"mismatch tokens");
        require(Pass.isExpired(id)== false && Pass.getIdBalance(_cTkn,id) >= _cAmount,"expired or no collateral");
        require(lPools[bTkn] > _bAmt,"Not enough Bal In Pools");
        //require(IERC20(bTkn).balanceOf(address(Pass))>= _bAmt * 100,"contract balances unavailable");// max borrow < 1% of pool
        Pass.idToId(id , contractId , _cTkn , _cAmount);
        _addToPass(id , bTkn , _bAmt);
        Borrower memory S = borrows[borrowNonce]; 
        borrowNonce++;
    }

    function isAllowedCollateral(address token) public view returns(bool){
        bool x = false;
        for(uint i ; i< cTokensNonce; i++){
            if(token == cTokens[i]){
                x = true;
            }
        }
        return x;
    }

    function isAllowedLend(address token) public view returns(bool){
        bool x = false;
        for(uint i ; i< lTokenNonce; i++){
            if(token == lTokens[i]){
                x = true;
            }
        }
        return x;
    }

    function calculateCollateral(address borrowToken , address collateralToken , uint256 borrowAmount) public view returns(uint256){
        uint256 collateralRequirement = _getEthPrice() * borrowAmount * 110 / 100;
        return collateralRequirement;
    }

    function calculateReturnAmt (uint256 amt, uint256 timeInDays) public view returns(uint256){
        return 0;
    }

    function _addToPass(uint256 id , address token,uint256 amount) internal returns(bool){
        Pass.addBal(id, token , amount);
        lPools[token] =lPools[token] - amount;
        return true;
    }

    function _subFromPass(uint256 id , address token,uint256 amount) internal returns(bool){
        Pass.subBal(id, token , amount);
        lPools[token] =lPools[token] + amount; 
        return true;
    }

    function _getEthPrice() internal view returns(uint256){
        (, int256 ethPrice, , , ) = ethFeed.latestRoundData();
        return uint256(ethPrice);
    }
}