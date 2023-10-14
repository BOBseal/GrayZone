// SPDX-License-Identifier: MIT

/*
LINEA TESTNET = 0xD6cD7CadB5f45680b847dc5Fe926230F4fbae691
""      "" UPGRADEABLE = 0xe9DF3113c2727AaBe5c1F50747c0CB6dB4f0cD0F -- non init
fuse mainnet = 0x98ce6472dd53A65381AD85cdf8AF0A7E2946a9E4
*/
pragma solidity ^0.8.17;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/interfaces/ILayerZeroEndpoint.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/*
v-1.0.5;
*/


contract ZONEPASS is Initializable,ERC721Upgradeable, ERC721EnumerableUpgradeable{
    using Counters for Counters.Counter;
    //uint16 public constant FUNCTION_TYPE_SEND = 1;
    uint256 internal week = 604800;
    address [] internal minters;
    address internal initAcc;
    address internal _feeToken;
    address public _owner;
    uint256 internal feeAmt ; // 0.1% for direct 0.01% for via minter
    uint256 internal directFee; // basefee
    uint256 internal pointsModifier;
    ILayerZeroEndpoint public lzEndpoint;

    struct PASSHOLDER {
        address minter;
        address holder;
        uint16 mintCh; //minting chain for omni modules
        uint16 activeCh; // active chain for omni modules
        uint256 tokenId;
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
        uint256 maxShare;
        address [] access;
    }
    //event MINT(address by , uint256 id);
    mapping(address => uint256) public contractAccruedFee;
    mapping(uint256 => PASSHOLDER) public _zonepassmaps;
    mapping(uint256 => Access) public storageViewAccess;
    Counters.Counter internal _tokenIdCounter;


    modifier isMinter(){
        bool x = false;
        for(uint16 i ; i<minters.length ; i++){
            address minter = minters[i];
            if(msg.sender== minter) {
               x = true;
               break; 
            }
        }
        require(x = true,"not allowed");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == _owner);
        _;
    }
    
    function __fx__() public {
        initAcc = msg.sender;
    }

    function initialize(address weth , string memory name , string memory symbol , address _endpoint) initializer public {
        require(msg.sender == initAcc,"not init acc");
        __ERC721_init_unchained(name, symbol);
        __ERC721Enumerable_init_unchained();
        lzEndpoint = ILayerZeroEndpoint(_endpoint);
        minters.push(msg.sender);
        _owner = msg.sender;
        _feeToken = weth;
        feeAmt = 2;
        directFee = 0.0001 ether;
        pointsModifier = 3;
        //ONFT721Core(_minGasToTransfer, _lzEndpoint);
    }

    function owner() public view returns(address){
        return _owner;
    }

    function getMintChain(uint256 id) public view returns(uint16) {
        return _zonepassmaps[id].mintCh;
    }
    
    //omni module verifier
    function getActiveChain(uint256 id) public view returns(uint16){
        return _zonepassmaps[id].activeCh;
    }

    function getIdBalance(address token , uint256 id) public view returns(uint256){
        return _zonepassmaps[id]._20bal[token];
    }

    function getInitializer() public view returns(address){
        return initAcc;
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

    function getRecoveryFee() public view returns(uint256){
        return directFee * 5;
    }

    function getStorage(address by, uint256 id , uint256 slot) public isMinter view returns(string memory , bytes memory){
        require(by == _zonepassmaps[id]._storageSlots[slot].storer || 
        haveStorageAccess(by , id , slot) == true,"not owner of id and slot");
        require(_zonepassmaps[id]._storageSlots[slot].deleted == false,"Deleted Slot");
        return (_zonepassmaps[id]._storageSlots[slot].store,_zonepassmaps[id]._storageSlots[slot].extra);
    }

    function isExpired(uint256 id) public view returns(bool){
        if(block.timestamp > _zonepassmaps[id].nextExpiry){
            return true;
        }
        return false;
    }

    function getFeeToken() public view returns(address){
        return _feeToken;
    }

    function getWeeklyFee() public view returns(address token , uint256 amount){
        return (_feeToken , directFee);
    }

    function getMinterIndex(address minter) public view returns(uint16){
        uint16 i;
        for(uint16 a ; a < minters.length ; a++){
            if(minter == minters[a]){
                i =a;
                break;
            }
        }
        return i;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return  super.supportsInterface(interfaceId);
    }

    //write functions

    function setActiveChain(uint256 id , uint16 ch) public isMinter{
        _zonepassmaps[id].activeCh = ch;
    } 

    function setLzPoint(address endPoint) public onlyOwner {
        lzEndpoint = ILayerZeroEndpoint(endPoint);
    }
    function transferOwnership(address nOwner) public onlyOwner{
        _owner = nOwner;
    }

    function shareStorage(uint256 id , uint256 slot , address to) public payable{
        Storage storage Store = _zonepassmaps[id]._storageSlots[slot];
        require(storageViewAccess[id].access.length < storageViewAccess[id].maxShare, "max share allowed 10 by default");
        require(msg.sender == _zonepassmaps[id].holder || msg.sender == _zonepassmaps[id].minter,"not owner of id ");
        require(msg.sender == Store.storer && Store.deleted == false,"no access to slot or deleted slot");
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
        
        for (uint256 i ; i< storageViewAccess[id].maxShare; i++){
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

    function addToStorage(string memory hash , uint256 id , bytes memory extraData , address by) public payable isMinter{
        require(_zonepassmaps[id].holder == by,"not holder");
        uint256 a = _zonepassmaps[id].usedSlots;
        require(a <_zonepassmaps[id].allowedSlots && block.timestamp < _zonepassmaps[id].nextExpiry,"slot exceed or expired");
        Storage storage Store = _zonepassmaps[id]._storageSlots[a];
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id].usedSlots ++;
        incrementTotalServices(id);
        Store.store = hash;
        Store.extra = extraData;
        Store.storer = by;
    }

    function delFromStorage(uint256 id, uint256 slot , address storer) public payable isMinter{
        Storage storage Store = _zonepassmaps[id]._storageSlots[slot];
        require(slot <=_zonepassmaps[id].usedSlots && block.timestamp < _zonepassmaps[id].nextExpiry,"slot exceed");
        require(storer == Store.storer && storer == _zonepassmaps[id].holder, "did not store data slot");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        //_zonepassmaps[id].usedSlots - 1;
        incrementTotalServices(id);
        Store.deleted = true;
    }

    function recoverData( uint256 id , uint256 slot , bool paywithpass) public payable{
        PASSHOLDER storage pass = _zonepassmaps[id];
        require(msg.sender == pass.holder || msg.sender== pass.minter,"not access to id ");
        require(msg.sender == pass._storageSlots[slot].storer,"no access to slot");
        if(msg.sender == pass.holder && paywithpass == true)
        {
            require(pass._20bal[_feeToken] >= directFee * 5,"need fee");
            pass._20bal[_feeToken] = pass._20bal[_feeToken] - (directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        if(msg.sender == pass.holder && paywithpass == false) {
            require(IERC20(_feeToken).balanceOf(msg.sender)>= directFee * 5  ,"need fee");
            IERC20(_feeToken).transferFrom(msg.sender , address(this), directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        if(msg.sender == pass.minter) {
            require(IERC20(_feeToken).balanceOf(msg.sender)>= directFee * 5  ,"need fee");
            IERC20(_feeToken).transferFrom(msg.sender , address(this), directFee * 5);
            contractAccruedFee[_feeToken] =contractAccruedFee[_feeToken] + directFee * 5;
        }
        incrementTotalServices(id);
        pass._storageSlots[slot].deleted = false;
       // emit STORAGERECOVER(id, slot ,msg.sender);
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
        pass.allowedSlots = 200;
        pass.mintCh = ch;
        pass.activeCh = ch;
        pass.tokenId = tokenId;
        storageViewAccess[tokenId].maxShare = 10;
    }

    function increaseMaxShare(uint id, uint256 slot,uint256 incNum, address by) public payable isMinter{
        require(by == _zonepassmaps[id]._storageSlots[slot].storer);
        storageViewAccess[id].maxShare = storageViewAccess[id].maxShare + incNum;
    }

    function increaseSlots(uint256 slots, uint256 id) public isMinter{
        require(id < _tokenIdCounter.current(),"non existent id");
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
        _zonepassmaps[id].lastRenewal = block.timestamp;
        _zonepassmaps[id].nextExpiry = _zonepassmaps[id].nextExpiry + (timeInWeeks * week);
        incrementTotalServices(id);
      //  emit EXPIRYEXTEND(id , timeInWeeks * week , by);
    }

    function deposit(uint256 id , address token , uint256 amt, address from) public payable isMinter{
        require(_exists(id) == true,"non existent id");
            require(IERC20(token).balanceOf(from) >= amt,"no bal");
            contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
            IERC20(token).transferFrom(from , address(this) , amt);
            _zonepassmaps[id]._20bal[token] = _zonepassmaps[id]._20bal[token] + amt;
            incrementTotalServices(id);
    }

    function withdraw(uint256 id , address token , uint256 amt , address to , address from) public payable isMinter{
        require(_exists(id) == true && token != address(0),"non existent id");
        require(IERC20(token).balanceOf(address(this)) >= amt && _zonepassmaps[id]._20bal[token] >= amt,"no bal");
        require( from == _zonepassmaps[id].holder,"not owner");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id]._20bal[token] =_zonepassmaps[id]._20bal[token] - amt;
        IERC20(token).transfer(to , amt);
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

    function depositEth(uint256 id , uint256 amount) public payable{
        require(_exists(id)== true);
        require(msg.value >= amount);
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + (msg.value - amount);
        _zonepassmaps[id]._20bal[address(0)] = _zonepassmaps[id]._20bal[address(0)] + amount;
        incrementTotalServices(id);
    }

    function withdrawEth(uint256 id , uint256 amount , address to , address from) public payable{
        require(_exists(id)== true);
        require(address(this).balance >= amount && _zonepassmaps[id]._20bal[address(0)] >= amount,"no bal");
        require( from == _zonepassmaps[id].holder,"not owner");
        contractAccruedFee[address(0)] = contractAccruedFee[address(0)] + msg.value;
        _zonepassmaps[id]._20bal[address(0)] =_zonepassmaps[id]._20bal[address(0)] - amount;
        payable(to).transfer(amount);
    }

    function setWeeklyFee(uint256 amount) public onlyOwner{
        directFee = amount;
    }

    function setFeeToken(address token) public onlyOwner {
        _feeToken = token;
    }

    function setPointsM(uint256 _modifier) public onlyOwner{
        pointsModifier = _modifier;
    } 

    function withdrawCaErc(address token , uint256 amount) public onlyOwner {
        require(amount <= contractAccruedFee[token] , "No balances");
        contractAccruedFee[token] = contractAccruedFee[token] - amount;
        IERC20(token).transfer(msg.sender , amount);
    }

    function withdrawCaEth(uint amount) public onlyOwner{
        address token = address(0);
        require(amount <= contractAccruedFee[token] , "No balances");
        contractAccruedFee[token] = contractAccruedFee[token] - amount;
        payable(msg.sender).transfer(amount);
    }

    function addMinter(address minter_) public onlyOwner{
       // require(index < ~uint16(0) ,"max modules reach");
      //  require(minters[index] == address(0),"minter exist in index");
        minters.push(minter_);
    }
    
    function removeMinter(address minter,uint16 index) public onlyOwner{
        require(minter == minters[index],"mismatch");
        delete minters[index];
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        _zonepassmaps[tokenId].holder = to;
    }

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable) {
        super._burn(tokenId);
        _zonepassmaps[tokenId].holder = address(0);
    }


    function incrementTotalServices(uint256 id) internal {
        _zonepassmaps[id].totalServiceUses= _zonepassmaps[id].totalServiceUses + pointsModifier;
    }
}