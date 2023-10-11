// SPDX-License-Identifier: MIT

/*
LINEA TESTNET = 0xD6cD7CadB5f45680b847dc5Fe926230F4fbae691
""      "" UPGRADEABLE = 0xe9DF3113c2727AaBe5c1F50747c0CB6dB4f0cD0F -- non init
fuse mainnet = 0x98ce6472dd53A65381AD85cdf8AF0A7E2946a9E4
*/
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/interfaces/ILayerZeroEndpoint.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/interfaces/ILayerZeroEndpoint.sol";
//import "./LZO/NonblockingLzApp.sol";

/*
next upgrade=> 

v-1.0.4 == fixes recommended => split to libs 

Omnichain Problems => metadata migration / read/ write or execution from any chain
balances and storage metadata not viable for migration 

possible solution => read / write directly from dstChain-srcChain

other problems: 

Refactoring for minimal gas usage and upgrading to more modular functions capable of handling crosschain + normal (within chain)

improving the access control for minter modifier and introducing dynamic access 

adding approvals for id based payments to ensure user spends
*/


contract ZONEPASS is Initializable,ERC721Upgradeable{
    using Counters for Counters.Counter;
    //uint16 public constant FUNCTION_TYPE_SEND = 1;
    address [] internal minters;
    address internal initAcc;
    address internal _feeToken;
    address public _owner;
    uint256 internal feeAmt ; // 0.1% for direct 0.01% for via minter
    uint256 internal directFee; // basefee
    ILayerZeroEndpoint public lzEndpoint;

    struct PASSHOLDER {
        address minter;
        address holder;
        // Omnichain--disabled
        uint16 mintCh;//minting chain
        uint16 activeCh; // active chain
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
    //event MINT(address by , uint256 id);

    mapping(address => uint256) public contractAccruedFee;
    mapping(uint256 => PASSHOLDER) public _zonepassmaps;
    mapping(uint256 => Access) public storageViewAccess;
    Counters.Counter internal _tokenIdCounter;


    modifier isMinter(){
        bool minterr =false;
        for(uint256 i ; i<minters.length ; i++){
            address minter = minters[i];
            if(msg.sender == minter){
                minterr = true;
            }
        }
        require(minterr == true,"access control denied");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == _owner);
        _;
    }
    
    function __fx() public {
        initAcc = msg.sender;
    }

    function initialize(address weth , string memory name , string memory symbol , address _endpoint) initializer public {
        require(msg.sender == initAcc,"not init acc");
        __ERC721_init_unchained(name, symbol);
        //__ERC721Enumerable_init_unchained();
        //__ERC721URIStorage_init_unchained();
        //__ERC721Burnable_init_unchained();
        //__Ownable_init_unchained();
        lzEndpoint = ILayerZeroEndpoint(_endpoint);
        //minGasToTransferAndStore = _minGasToTransfer;
      //  __initCore(_lzEndpoint , _minGasToTransfer);
        minters.push(msg.sender);
        _owner = msg.sender;
        _feeToken = weth;
        feeAmt = 2;
        directFee = 0.0001 ether;
        //ONFT721Core(_minGasToTransfer, _lzEndpoint);
    }

    function owner() public view returns(address){
        return _owner;
    }

    function getMintChain(uint256 id) public view returns(uint16) {
        return _zonepassmaps[id].mintCh;
    }

    function getActiveChain(uint256 id) public view returns(uint16){
        return _zonepassmaps[id].activeCh;
    }

    function setActiveChain(uint256 id , uint16 ch) public isMinter{
        _zonepassmaps[id].activeCh = ch;
    } 

    function setLzPoint(address endPoint) public onlyOwner {
        lzEndpoint = ILayerZeroEndpoint(endPoint);
    }
    function transferOwnership(address nOwner) public onlyOwner{
        _owner = nOwner;
    }

    function getIdBalance(address token , uint256 id) public view returns(uint256){
        return _zonepassmaps[id]._20bal[token];
    }

    function getInitializer() public view returns(address){
        return initAcc;
    }

    function shareStorage(uint256 id , uint256 slot , address to) public payable{
        require(msg.sender == _zonepassmaps[id].holder || msg.sender == _zonepassmaps[id].minter,"not owner of id ");
        require(msg.sender == _zonepassmaps[id]._storageSlots[slot].storer && _zonepassmaps[id]._storageSlots[slot].deleted == false,"no access to slot or deleted slot");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        incrementTotalServices(id);
        storageViewAccess[id].slot = slot;
        storageViewAccess[id].access.push(to);
        storageViewAccess[id].accesees ++;
        //emit SHAREVIEW(id , slot , msg.sender , to);
    }

    function changeDirectFee(uint256 newAmt) public onlyOwner{
        directFee = newAmt;
    }

    function removeShare(uint256 id , uint256 slot , address to) public payable{
        require(msg.sender == _zonepassmaps[id].holder || msg.sender == _zonepassmaps[id].minter,"not owner of id ");
        require(msg.sender == _zonepassmaps[id]._storageSlots[slot].storer && _zonepassmaps[id]._storageSlots[slot].deleted == false,"no access to slot or deleted slot");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        incrementTotalServices(id);
        storageViewAccess[id].slot = slot;
        
        for (uint256 i ; i<storageViewAccess[id].access.length; i++){
            address a = storageViewAccess[id].access[i];
            if(a == to){
                delete storageViewAccess[id].access[i];
                storageViewAccess[id].accesees -1;
                break;
            }
        }
        
        //storageViewAccess[id].access.push(to);
        storageViewAccess[id].accesees -1;
       // emit SHAREVIEW(id , slot , msg.sender , to);
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

    function addToStorage(string memory hash , uint256 id , bytes memory extraData , address by) public payable isMinter{
        PASSHOLDER storage pass = _zonepassmaps[id];
        uint256 a = pass.usedSlots;
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        require(_zonepassmaps[id].holder == by);
        require(a <=_zonepassmaps[id].allowedSlots,"slot exceed");
        _zonepassmaps[id].usedSlots ++;
        incrementTotalServices(id);
        pass._storageSlots[a].store = hash;
        pass._storageSlots[a].extra = extraData;
        pass._storageSlots[a].storer = by;
        //emit STORAGEADD(id , a , by);
    }

    function delFromStorage(uint256 id, uint256 slot , address storer) public payable isMinter{
        PASSHOLDER storage pass = _zonepassmaps[id];
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        require(pass.usedSlots <=_zonepassmaps[id].allowedSlots,"slot exceed");
        require(storer == pass._storageSlots[slot].storer && storer == pass.holder, "did not store data slot");
        pass.usedSlots - 1;
        incrementTotalServices(id);
        pass._storageSlots[slot].deleted = true;
        //emit STORAGEDEL(id , slot ,storer);
    }

    function recoverData( uint256 id , uint256 slot) public payable{
        PASSHOLDER storage pass = _zonepassmaps[id];
        require(msg.sender == pass.holder || msg.sender == pass.minter,"not owner of id ");
        require(msg.sender == pass._storageSlots[slot].storer,"no access to slot");
        require(pass._20bal[_feeToken] >= directFee * 5 || IERC20(_feeToken).balanceOf(msg.sender)>= directFee * 5  ,"need fee");
        if(msg.sender == pass.holder)
        {
            pass._20bal[_feeToken] = pass._20bal[_feeToken] - (directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        else {
            IERC20(_feeToken).transferFrom(msg.sender , address(this), directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        incrementTotalServices(id);
        pass._storageSlots[slot].deleted = false;
       // emit STORAGERECOVER(id, slot ,msg.sender);
    }

    function getRecoveryFee() public view returns(uint256){
        return directFee * 5;
    }

    function getStorage(address by, uint256 id , uint256 slot) public isMinter view returns(string memory , bytes memory){
        require(by == _zonepassmaps[id].holder && by == _zonepassmaps[id]._storageSlots[slot].storer || 
        haveStorageAccess(by , id , slot) == true,"not owner of id and slot");
        require(_zonepassmaps[id]._storageSlots[slot].deleted == false,"Deleted Slot");
        return (_zonepassmaps[id]._storageSlots[slot].store,_zonepassmaps[id]._storageSlots[slot].extra);
    }

    function incrementTotalServices(uint256 id) public isMinter{
        _zonepassmaps[id].totalServiceUses++;
    }

    function incrementServices(uint256 id , uint256 num) public isMinter{
        _zonepassmaps[id].totalServiceUses=_zonepassmaps[id].totalServiceUses + num;
    }

    function decrementServices(uint256 id , uint256 num) public isMinter{
        _zonepassmaps[id].totalServiceUses = _zonepassmaps[id].totalServiceUses - num;
    }

    function mint(address to , uint256 tokenId) public payable isMinter{
        require(_exists(tokenId)== false,"already minted");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        PASSHOLDER storage pass = _zonepassmaps[tokenId];
        uint16 ch = lzEndpoint.getChainId();
        _safeMint(to, tokenId);
        //_setTokenURI(tokenId, uri);
        pass.holder = to;
        pass.minter = to;
        pass.mintTime = block.timestamp;
        pass.nextExpiry = block.timestamp + 31536000; // one year free pass
        incrementTotalServices(tokenId);
        pass.allowedSlots = 1000;
        pass.mintCh = ch;
        pass.activeCh = ch;
    }

    function increaseSlots(uint256 slots, uint256 id) public isMinter{
        _zonepassmaps[id].allowedSlots = _zonepassmaps[id].allowedSlots + slots;
        //emit EXTENDSLOTS(id , slots , by);
    }

    function setUri(uint id , string memory uri_) public isMinter{
       require(_exists(id)== true);
       _setUri(id , uri_);
    }

    function extendPassTime(uint256 id , uint256 time) public payable isMinter {
        require(id < _tokenIdCounter.current(),"non existent id");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id].lastRenewal = block.timestamp;
        _zonepassmaps[id].nextExpiry = _zonepassmaps[id].nextExpiry + time;
        incrementTotalServices(id);
      //  emit EXPIRYEXTEND(id , time , by);
    }

    function boostPass(uint256 timeInWeeks ,uint256 id) public payable {
        require(IERC20(_feeToken).balanceOf(msg.sender)>= directFee * timeInWeeks,"Recharge first");
        require(msg.sender == _zonepassmaps[id].holder);
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id]._20bal[_feeToken] = _zonepassmaps[id]._20bal[_feeToken] - (directFee * timeInWeeks);
        uint256 week = 604800;
        _zonepassmaps[id].lastRenewal = block.timestamp;
        _zonepassmaps[id].nextExpiry = _zonepassmaps[id].nextExpiry + (timeInWeeks * week);
        incrementTotalServices(id);
      //  emit EXPIRYEXTEND(id , timeInWeeks * week , by);
    }

    function deposit(uint256 id , address token , uint256 amt, address from) public payable isMinter{
        require(_exists(id) == true,"non existent id");
        if(token == address(0)){
            require(msg.value > amt);
            uint256 fee = msg.value - amt;
            contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + fee;
            payable(address(this)).transfer(amt);
            _zonepassmaps[id]._20bal[address(0)] = _zonepassmaps[id]._20bal[address(0)] + amt;
        } else{
            require(IERC20(token).balanceOf(from) >= amt,"no bal");
            contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
            IERC20(token).transferFrom(from , address(this) , amt);
            _zonepassmaps[id]._20bal[token] = _zonepassmaps[id]._20bal[token] + amt;
        }
            incrementTotalServices(id);
    }

    function withdraw(uint256 id , address token , uint256 amt , address to , address from) public payable isMinter{
        require(_exists(id) == true,"non existent id");
        require(IERC20(token).balanceOf(address(this)) >= amt && _zonepassmaps[id]._20bal[token] >= amt,"no bal");
        require( from == _zonepassmaps[id].holder,"not owner");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        if(token == address(0)){
            _zonepassmaps[id]._20bal[address(0)] = _zonepassmaps[id]._20bal[address(0)] - amt;
            payable(to).transfer(amt);
        } else {
        _zonepassmaps[id]._20bal[token] =_zonepassmaps[id]._20bal[token] - amt;
        IERC20(token).transfer(to , amt);
        }
        incrementTotalServices(id);
    }

    function idToId( uint256 fromId , uint256 toId , address token , uint256 amount) public payable isMinter{
        require(_zonepassmaps[fromId]._20bal[token] >= amount,"no bal");
        require(_exists(fromId) == true && _exists(toId)== true);
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[fromId]._20bal[token] = _zonepassmaps[fromId]._20bal[token] - amount;
        _zonepassmaps[toId]._20bal[token] = _zonepassmaps[toId]._20bal[token] + amount;
        incrementTotalServices(fromId);
      //  emit IDBALTRANSFER(fromId , toId , token , amount);
    }

    function idToAddress(uint256 fromId , address toAddress , address from,address token , uint256 amt) public payable{
        require(fromId < _tokenIdCounter.current(),"non existent id");
        require(IERC20(token).balanceOf(address(this)) >= amt && _zonepassmaps[fromId]._20bal[token] >= amt ,"no bal");
        require( from == _zonepassmaps[fromId].holder,"not owner");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        uint256 fee_ = (amt * feeAmt)/1000;
        _zonepassmaps[fromId]._20bal[token] =_zonepassmaps[fromId]._20bal[token] - amt;
        if(token == address(0)){
            payable(toAddress).transfer(amt-fee_);
            payable(_zonepassmaps[fromId].minter).transfer(fee_);
        } else{ 
        IERC20(token).transfer(toAddress , amt-fee_);
        IERC20(token).transfer(_zonepassmaps[fromId].minter , fee_);
        }
        incrementTotalServices(fromId);
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
        override(ERC721Upgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        _zonepassmaps[tokenId].holder = to;
    }

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable) {
        super._burn(tokenId);
        _zonepassmaps[tokenId].holder = address(0);
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
        override(ERC721Upgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

   function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable) returns (bool) {
        return  super.supportsInterface(interfaceId);
    }
}