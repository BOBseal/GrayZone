// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./lzo/IONFT1155.sol";
import "./lzo/ONFT1155Core.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
//import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// NOTE: this ONFT contract has no public minting logic.
// must implement your own minting logic in child classes
contract OMNINFT1155 is ONFT1155Core, ERC1155, IONFT1155, ERC1155URIStorage, ERC1155Supply {
    uint256 internal maxRoles = 10; // initially upto 10 minter roles 
    uint256 public bridgeTxFee = 50000000000000; // value in 0.000005 -- brdige fee
    IERC20 public feeTkn; // if fee token added in future  
    bool internal enabled = false; // is fee eneabled
    struct Roles{
        string role;
        bool revoked;
        uint16 roleId;
        uint256[] nftId;
    }
    mapping (address=>Roles) internal roles;

    constructor(string memory _uri, address _lzEndpoint) ERC1155(_uri) ONFT1155Core(_lzEndpoint) {}

    modifier MinterRole(){
        if(msg.sender!=owner()){
        require(roles[msg.sender].roleId <= maxRoles && roles[msg.sender].revoked == false ,"Do not Have Minter Role to Mint Collections");
        }
        _;
    }

    function increaseRoleLimit(uint256 newLimit) public onlyOwner{
        maxRoles = newLimit;
    }

    function assignRole(address to ,uint16 _roleId, string memory role,uint256 idAllowed) public onlyOwner{
       // require(roles[to].roleId == 0);
        require(_roleId > 0&& _roleId <= maxRoles,"increase role max");
        require(roles[to].roleId == 0 ,"Role Already Assigned to Address");
        roles[to].role = role;
        roles[to].revoked = false;
        roles[to].roleId = _roleId;
        roles[to].nftId.push(idAllowed);
    }

    function revokeMintRole(address addr) public onlyOwner{
        require(roles[addr].revoked==false,"done");
        roles[addr].revoked = true;
    }

    function getRole(address _of)public view returns(uint16,uint256[]memory,string memory){ // returns - Minterrole-NFTidOfRole - role name
        return(roles[_of].roleId,roles[_of].nftId , roles[_of].role);
    }
    
    function mint(address to, uint256 id_ ,uint256 amounts , string memory tokenUri, bytes memory data) public MinterRole returns(bool){
        uint256 id;
        bool a;
        bytes memory f = abi.encode("Owner Mint" , id_,amounts,tokenUri);
        if(msg.sender == owner()) {
            _mint(to , id_ , amounts,f);
            a = true;
        }else {
            bool ok;
            for(uint256 i ; i<roles[msg.sender].nftId.length ; i++){
                if(id_ == roles[msg.sender].nftId[i]){
                    ok =true;
                    id = roles[msg.sender].nftId[i];
                }
            }
            require(ok == true);
            _mint(to , id_ , amounts ,data);
            a= true;
        }
        if(bytes(uri(id)).length == 0){
            _setURI(id , tokenUri);
        }
        return a;
    }

    function setFee(uint256 amountinwei) public onlyOwner{
        bridgeTxFee = amountinwei;
    }
    
    function mintBatch(address to , uint256[] calldata ids , uint256[] calldata amounts) public MinterRole{
            for(uint256 i ; i <= ids.length; i++){
                uint256 id = i;
                require(exists(id),"one of id not found");
            }
            _mintBatch(to , ids , amounts,"");
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ONFT1155Core, ERC1155, IERC165) returns (bool) {
        return interfaceId == type(IONFT1155).interfaceId || super.supportsInterface(interfaceId);
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155URIStorage, ERC1155) returns (string memory) {
        return super.uri(tokenId);
    }

    function _debitFrom(address _from, uint16, bytes memory, uint[] memory _tokenIds, uint[] memory _amounts) internal virtual override {
        address spender = _msgSender();
        require(spender == _from || isApprovedForAll(_from, spender), "ONFT1155: send caller is not owner nor approved");
        _burnBatch(_from, _tokenIds, _amounts);
    }

    function debitFrom(address _from, uint16 ch, bytes memory dta, uint[] memory _tokenIds, uint[] memory _amounts) public MinterRole {
        _debitFrom(_from , ch , dta , _tokenIds  ,_amounts);
    }

    function _creditTo(uint16, address _toAddress, uint[] memory _tokenIds, uint[] memory _amounts) internal virtual override {
        _mintBatch(_toAddress, _tokenIds, _amounts, "");
    }
    
    function creditTo(uint16 ch, address _toAddress, uint[] memory _tokenIds, uint[] memory _amounts) public MinterRole{
        _creditTo(ch , _toAddress , _tokenIds , _amounts);
    }

    function multiChainTx(
        //debit from data
        address from , 
        uint16 chaidIdFrom , 
        bytes memory data,
        uint[] memory tokenIds, 
        uint[] memory amts,
        //credit to data
        uint16 chainIdTo,
        address to
        ) 
        public payable{
            if(!enabled){
            require(msg.value > bridgeTxFee,"value sent must be greater thn fee and enough to pay gas for bridge");
            }
            bool isA;
            if(enabled){
                isA = false;
                IERC20(feeTkn).transferFrom(msg.sender, address(this), bridgeTxFee);
                isA= true;
            }
            require(isA == true ,"Fee payment not successful");
            bool debit = true;
            bool credit = false;
        if(debit == true){
            _debitFrom(from , chaidIdFrom , data , tokenIds , amts);
            credit = true;
        }
        if(credit == true){
            _creditTo(chainIdTo , to , tokenIds , amts);
        }

    }

    function totalSupply(uint256 tokenId) public view virtual override(ERC1155Supply) returns (uint256) {
        return super.totalSupply(tokenId);
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes memory data) public virtual override(ERC1155, IERC1155) {
        super.safeTransferFrom(from, to, tokenId, amount, data);
    }

    function safeBatchTransferFrom(address from, address to, uint256[] memory tokenIds, uint256[] memory amounts, bytes memory data) public virtual override(ERC1155, IERC1155) {
        super.safeBatchTransferFrom(from, to, tokenIds, amounts, data);
    }
    function balanceOf(address account, uint256 tokenId) public view virtual override(ERC1155, IERC1155) returns (uint256) {
        return super.balanceOf(account, tokenId);
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory tokenIds) public view virtual override(ERC1155, IERC1155) returns (uint256[] memory) {
        return super.balanceOfBatch(accounts, tokenIds);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override(ERC1155, IERC1155) {
        super.setApprovalForAll(operator, approved);
    }

    function isApprovedForAll(address account, address operator) public view virtual override(ERC1155, IERC1155) returns (bool) {
        return super.isApprovedForAll(account, operator);
    }

    function exists(uint256 tokenId) public view virtual override(ERC1155Supply) returns (bool) {
        return super.exists(tokenId);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function getAllowedIds(address addr) public view returns(uint256[] memory, uint16){ // returns allowed ids for address and roleId
        require(addr!= owner(),"Owner Has All ID ACCESS");
        uint256[] memory array = new uint256[](roles[addr].nftId.length);
        for(uint256 i ; i<roles[addr].nftId.length ; i++){
            uint256 id = roles[addr].nftId[i];
            array[i] = id;
        }
        return (array, roles[addr].roleId);
    }
    
}


