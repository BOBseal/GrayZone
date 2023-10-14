// SPDX-License-Identifier: MIT

/*
LINEA TESTNET = 0xD6cD7CadB5f45680b847dc5Fe926230F4fbae691
*/
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/onft/ONFT721Core.sol";
//import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/token/onft/IONFT721.sol";

contract ZONEPASS is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    address [] public minters;
    address public _feeToken;
    uint256 internal feeAmt = 1; // 0.1% for direct 0.01% for via minter
    uint256 internal directFee = 0.0001 ether; // basefee
    bool internal d;

    struct PASSHOLDER {
        address minter;
        address holder;
        uint256 mintTime;
        uint256 lastRenewal;
        uint256 nextExpiry;
        uint256 usedSlots;
        uint256 allowedSlots;
        uint256 totalServiceUses;
        mapping(address=>uint256) _20bal; // token balances
        mapping(uint256 => Storage) _storageSlots;
    }

    struct Storage{
        bool deleted;
        string store;
        address storer;
        bytes extra;
    }

    struct Access{
        uint256 slot;
        uint256 accesees;
        address [] access;
    }

    event ADDBALANCE(uint256 id , address token , uint256 amount , address by);
    event DEDUCTBALANCE(uint256 id , address token , uint256 amount , address by);
    event IDBALTRANSFER(uint256 fromId , uint256 toId , address token , uint256 amount);
    event SHAREVIEW(uint256 id , uint256 slot, address by , address to);
    event STORAGEADD(uint256 id, uint256 slot , address by);
    event STORAGEDEL(uint256 id ,uint256 slot, address by);
    event STORAGERECOVER(uint256 id , uint256 slot , address by);
    event EXPIRYEXTEND(uint256 id, uint256 timeExtend, address by);
    event EXTENDSLOTS(uint256 id , uint256 slotsAdded,address by);
    event MINT(address by , uint256 id);

    mapping(address => uint256) public contractAccruedFee;
    mapping(uint256 => PASSHOLDER) public _zonepassmaps;
    mapping(uint256 => Access) public storageViewAccess;
    Counters.Counter internal _tokenIdCounter;

    constructor(
        string memory name,
        string memory symbol,
        address weth
    ) ERC721(name, symbol) {
        minters.push(msg.sender);
        _feeToken = weth;
    }

    function getIdBalance(address token , uint256 id) public view returns(uint256){
        return _zonepassmaps[id]._20bal[token];
    }

    function shareStorage(uint256 id , uint256 slot , address to) public {
        require(msg.sender == _zonepassmaps[id].holder || msg.sender == _zonepassmaps[id].minter,"not owner of id ");
        require(msg.sender == _zonepassmaps[id]._storageSlots[slot].storer && _zonepassmaps[id]._storageSlots[slot].deleted == false,"no access to slot or deleted slot");
        incrementTotalServices(id);
        storageViewAccess[id].slot = slot;
        storageViewAccess[id].access.push(to);
        storageViewAccess[id].accesees ++;
        emit SHAREVIEW(id , slot , msg.sender , to);
    }

    function removeShare(uint256 id , uint256 slot , address to) public {
        require(msg.sender == _zonepassmaps[id].holder || msg.sender == _zonepassmaps[id].minter,"not owner of id ");
        require(msg.sender == _zonepassmaps[id]._storageSlots[slot].storer && _zonepassmaps[id]._storageSlots[slot].deleted == false,"no access to slot or deleted slot");
        incrementTotalServices(id);
        storageViewAccess[id].slot = slot;
        
        for (uint256 i ; i<storageViewAccess[id].access.length; i++){
            address a = storageViewAccess[id].access[i];
            if(a == to){
                delete storageViewAccess[id].access[i];
                break;
            }
        }
        
        //storageViewAccess[id].access.push(to);
        storageViewAccess[id].accesees -1;
       // emit SHAREVIEW(id , slot , msg.sender , to);
    }

    function shareStorage_(uint256 id , uint256 slot , address to , address from) public  isMinter{
        require(from == _zonepassmaps[id].holder || from == _zonepassmaps[id].minter,"not owner of id ");
        require(from == _zonepassmaps[id]._storageSlots[slot].storer && _zonepassmaps[id]._storageSlots[slot].deleted == false,"no access to slot or deleted slot");
        incrementTotalServices(id);
        storageViewAccess[id].slot = slot;
        storageViewAccess[id].access.push(to);
        storageViewAccess[id].accesees ++;
        emit SHAREVIEW(id , slot , from , to);
    }

    function haveStorageAccess(address user , uint256 id , uint256 slot) public view returns(bool){
        bool x = false;
        for(uint256 i ; i< storageViewAccess[id].access.length ; i++){
            address b = storageViewAccess[id].access[i];
            if(b == user && slot == storageViewAccess[id].slot){
                x = true;
                break;
            }
        }
        return x;
    }

    function getPassInfo(uint256 id) public view returns(address , uint256 ,uint256 , uint256, uint256){
        return(
            _zonepassmaps[id].holder,
            _zonepassmaps[id].mintTime,
            _zonepassmaps[id].nextExpiry,
            _zonepassmaps[id].allowedSlots,
            _zonepassmaps[id].totalServiceUses
        );
    }

    function addToStorage(string memory hash , uint256 id , bytes memory extraData , address by) public payable isMinter{
        require(_zonepassmaps[id].usedSlots <=_zonepassmaps[id].allowedSlots,"slot exceed");
        uint256 a = _zonepassmaps[id].usedSlots;
        _zonepassmaps[id].usedSlots ++;
        incrementTotalServices(id);
        _zonepassmaps[id]._storageSlots[a].store = hash;
        _zonepassmaps[id]._storageSlots[a].extra = extraData;
        _zonepassmaps[id]._storageSlots[a].storer = by;
        emit STORAGEADD(id , a , by);
    }

    function delFromStorage(uint256 id, uint256 slot , address storer) public payable isMinter{
        require(_zonepassmaps[id].usedSlots <=_zonepassmaps[id].allowedSlots,"slot exceed");
        require(storer == _zonepassmaps[id]._storageSlots[slot].storer && storer == _zonepassmaps[id].holder, "did not store data slot");
        _zonepassmaps[id].usedSlots - 1;
        incrementTotalServices(id);
        _zonepassmaps[id]._storageSlots[slot].deleted = true;
        emit STORAGEDEL(id , slot ,storer);
    }

    function getStorage( uint256 id , uint256 slot) public view returns(string memory , bytes memory){
        require((msg.sender == _zonepassmaps[id].holder && msg.sender == _zonepassmaps[id]._storageSlots[slot].storer)
        ||haveStorageAccess(msg.sender , id , slot) == true,"not owner of id and slot");
        require(_zonepassmaps[id]._storageSlots[slot].deleted == false,"Deleted Slot");
        return (_zonepassmaps[id]._storageSlots[slot].store,_zonepassmaps[id]._storageSlots[slot].extra);
    }

    function recoverData( uint256 id , uint256 slot) public payable{
        require(msg.sender == _zonepassmaps[id].holder || msg.sender == _zonepassmaps[id].minter,"not owner of id ");
        require(msg.sender == _zonepassmaps[id]._storageSlots[slot].storer,"no access to slot");
        require(_zonepassmaps[id]._20bal[_feeToken] >= directFee * 5 || IERC20(_feeToken).balanceOf(msg.sender)>= directFee * 5  ,"need sufficient fee in nft or wallet");
        if(msg.sender == _zonepassmaps[id].holder)
        {
            _zonepassmaps[id]._20bal[_feeToken] = _zonepassmaps[id]._20bal[_feeToken] - (directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        else {
            IERC20(_feeToken).transferFrom(msg.sender , address(this), directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        incrementTotalServices(id);
        _zonepassmaps[id]._storageSlots[slot].deleted = false;
        emit STORAGERECOVER(id, slot ,msg.sender);
    }

    function getRecoveryFee() public view returns(uint256){
        return directFee * 5;
    }

    function getStorage_(address by, uint256 id , uint256 slot) public isMinter view returns(string memory , bytes memory){
        require(by == _zonepassmaps[id].holder && by == _zonepassmaps[id]._storageSlots[slot].storer || 
        haveStorageAccess(by , id , slot) == true,"not owner of id and slot");
        require(_zonepassmaps[id]._storageSlots[slot].deleted == false,"Deleted Slot");
        return (_zonepassmaps[id]._storageSlots[slot].store,_zonepassmaps[id]._storageSlots[slot].extra);
    }

    function incrementTotalServices(uint256 id) public isMinter{
        _zonepassmaps[id].totalServiceUses++;
    }

    function mint(address to, string memory uri) public payable isMinter {
        uint256 tokenId = _tokenIdCounter.current();
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _zonepassmaps[tokenId].holder = to;
        _zonepassmaps[tokenId].minter = to;
        _zonepassmaps[tokenId].mintTime = block.timestamp;
        _zonepassmaps[tokenId].nextExpiry = block.timestamp + 31536000; // one year free pass
        incrementTotalServices(tokenId);
        _zonepassmaps[tokenId].allowedSlots = 50000;
        emit MINT(to , tokenId);
    }

    function increaseSlots(uint256 slots, uint256 id, address by) public isMinter{
        _zonepassmaps[id].allowedSlots = _zonepassmaps[id].allowedSlots + slots;
        emit EXTENDSLOTS(id , slots , by);
    }

    function depositMint(address to , string memory uri  , uint256 amt) public payable isMinter{
        require(IERC20(_feeToken).balanceOf(to)>= amt,"no balance");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        IERC20(_feeToken).transferFrom(to , address(this) , amt);
        uint256 tokenId = _tokenIdCounter.current();
        _zonepassmaps[tokenId]._20bal[_feeToken] = _zonepassmaps[tokenId]._20bal[_feeToken] + amt;
        mint(to , uri);
        incrementTotalServices(tokenId);
        emit ADDBALANCE(tokenId , _feeToken , amt , to); 
    }

    function extendPassTime(uint256 id , uint256 time, address by) public payable isMinter {
        require(id < _tokenIdCounter.current(),"non existent id");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id].lastRenewal = block.timestamp;
        _zonepassmaps[id].nextExpiry = _zonepassmaps[id].nextExpiry + time;
        incrementTotalServices(id);
        emit EXPIRYEXTEND(id , time , by);
    }

    function boostPass(uint256 timeInWeeks ,uint256 id , address by) public payable {
        require(IERC20(_feeToken).balanceOf(msg.sender)>= directFee * timeInWeeks,"Recharge Your Pass With Fee token first");
        require(msg.sender == _zonepassmaps[id].holder);
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id]._20bal[_feeToken] = _zonepassmaps[id]._20bal[_feeToken] - (directFee * timeInWeeks);
        uint256 week = 604800;
        _zonepassmaps[id].lastRenewal = block.timestamp;
        _zonepassmaps[id].nextExpiry = _zonepassmaps[id].nextExpiry + (timeInWeeks * week);
        incrementTotalServices(id);
        emit EXPIRYEXTEND(id , timeInWeeks * week , by);
    }

    function depositErc20(uint256 id , address token , uint256 amt, address from) public payable isMinter{
        require(id < _tokenIdCounter.current(),"non existent id");
        require(IERC20(token).balanceOf(from) >= amt,"no bal");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        IERC20(token).transferFrom(from , address(this) , amt);
        uint256 fee_ = (amt * (feeAmt*2))/10000;
        uint256 amount = amt - fee_;
        _zonepassmaps[id]._20bal[token] = _zonepassmaps[id]._20bal[token] + amount;
        contractAccruedFee[token] = contractAccruedFee[token] + fee_/2;
        IERC20(token).transfer(_zonepassmaps[id].minter , fee_/2);
        incrementTotalServices(id);
        emit ADDBALANCE(id , token , amount , from); 
    }

    function withdraw(uint256 id , address token , uint256 amt , address to , address from) public payable isMinter{
        require(id < _tokenIdCounter.current(),"non existent id");
        require(IERC20(token).balanceOf(address(this)) >= amt,"no bal");
        require(_zonepassmaps[id]._20bal[token] >= amt , "no bal");
        require( from == _zonepassmaps[id].holder,"not owner");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id]._20bal[token] =_zonepassmaps[id]._20bal[token] - amt;
        IERC20(token).transfer(to , amt);
        incrementTotalServices(id);
        emit DEDUCTBALANCE(id , token , amt, from);
    }

    function _balTx( uint256 fromId , uint256 toId , address token , uint256 amount) public payable isMinter{
        require(_zonepassmaps[fromId]._20bal[token] >= amount,"no bal");
        require(fromId < _tokenIdCounter.current());
        require(toId < _tokenIdCounter.current());
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[fromId]._20bal[token] = _zonepassmaps[fromId]._20bal[token] - amount;
        _zonepassmaps[toId]._20bal[token] = _zonepassmaps[toId]._20bal[token] + amount;
        emit IDBALTRANSFER(fromId , toId , token , amount);
    }

    function balTransfer_(uint256 fromId , uint256 toId , address token , uint256 amt) public payable isMinter{
        require(_zonepassmaps[fromId]._20bal[token] >= amt,"no bal");
        require(fromId < _tokenIdCounter.current());
        require(toId < _tokenIdCounter.current());
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        uint256 fee_ = (amt * feeAmt ) / 10000;
        uint256 amount = amt - fee_;
        _zonepassmaps[fromId]._20bal[token] = _zonepassmaps[fromId]._20bal[token] - amt;
        _zonepassmaps[toId]._20bal[token] = _zonepassmaps[toId]._20bal[token] + amount;
        withdraw(fromId, token , fee_/2 , _zonepassmaps[fromId].minter , _zonepassmaps[fromId].holder);
        contractAccruedFee[token] = contractAccruedFee[token] + fee_/2;
        incrementTotalServices(fromId);
        emit IDBALTRANSFER(fromId , toId , token , amount);
    }

    function balTransfer(uint256 fromId , uint256 toId , address token , uint256 amt) public payable{
        require(_zonepassmaps[fromId]._20bal[token] >= amt,"no bal");
        require(msg.sender == _zonepassmaps[fromId].holder,"must be owner of id");
        require(fromId < _tokenIdCounter.current());
        require(toId < _tokenIdCounter.current());
        require(d == false ,"temporary feature disabled");
        uint256 fee_ = (amt * feeAmt ) / 1000;
        uint256 amount = amt - fee_;
        _zonepassmaps[fromId]._20bal[token] = _zonepassmaps[fromId]._20bal[token] - amt;
        _zonepassmaps[toId]._20bal[token] = _zonepassmaps[toId]._20bal[token] + amount;
        withdraw(fromId, token , fee_/2 , _zonepassmaps[fromId].minter, msg.sender);
        contractAccruedFee[token] = contractAccruedFee[token] + fee_/2;
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        incrementTotalServices(fromId);
        emit IDBALTRANSFER(fromId , toId , token , amt);
    }

    function disableDirect() public onlyOwner{
        d = true;
    }

    function enableDirect() public onlyOwner{
        d = false;
    }

    function getDirect () public view returns(bool) {
        return d;
    }

    function setWeeklyFee(uint256 amount) public onlyOwner{
        directFee = amount;
    }

    function setFeeToken(address token) public onlyOwner {
        _feeToken = token;
    }

    function getFeeToken() public view returns(address){
        return _feeToken;
    }

    function getWeeklyFee() public view returns(address token , uint256 amount){
        return (_feeToken , directFee);
    }

    //enter zero address to withdraw ether;

    function withdrawContractFee(address token , uint256 amount) public onlyOwner {
        require(amount <= contractAccruedFee[token] , "No balances");
        contractAccruedFee[token] = contractAccruedFee[token] - amount;
        if(token != address(0)){
            IERC20(token).transfer(msg.sender , amount);
        }
        if(token == address(0)){
            payable(msg.sender).transfer(amount);
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        _zonepassmaps[tokenId].holder = to;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        _zonepassmaps[tokenId].holder = address(0);
    }

    modifier isMinter(){
        bool minterr =false;
        for(uint256 i ; i<minters.length ; i++){
            address minter = minters[i];
            if(msg.sender == minter){
                minterr = true;
            }
        }
        require(minterr == true || msg.sender == address(this) || msg.sender == owner(),"access control denied");
        _;
    }

    function isExpired(uint256 id) public view returns(bool){
        if(block.timestamp > _zonepassmaps[id].nextExpiry){
            return true;
        }
        return false;
    }

    function addMinter(address minter_) public onlyOwner{
        minters.push(minter_);
    }
    
    function removeMinter(address minter_) public onlyOwner{
        for(uint256 i; i< minters.length;i++){
            address m = minters[i];
            if(minter_ == m){
                delete minters[i];
            }
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

   function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable , ERC721URIStorage) returns (bool) {
        return  super.supportsInterface(interfaceId);
    }
}