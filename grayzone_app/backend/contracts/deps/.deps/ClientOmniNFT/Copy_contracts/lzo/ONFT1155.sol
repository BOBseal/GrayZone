// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IONFT1155.sol";
import "./ONFT1155Core.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

// NOTE: this ONFT contract has no public minting logic.
// must implement your own minting logic in child classes
contract OMNINFT1155 is ONFT1155Core, ERC1155, IONFT1155, ERC1155URIStorage, ERC1155Supply {
    constructor(string memory _uri, address _lzEndpoint) ERC1155(_uri) ONFT1155Core(_lzEndpoint) {}

    function supportsInterface(bytes4 interfaceId) public view virtual override(ONFT1155Core, ERC1155, IERC165) returns (bool) {
        return interfaceId == type(IONFT1155).interfaceId || super.supportsInterface(interfaceId);
    }

    function _debitFrom(address _from, uint16, bytes memory, uint[] memory _tokenIds, uint[] memory _amounts) internal virtual override {
        address spender = _msgSender();
        require(spender == _from || isApprovedForAll(_from, spender), "ONFT1155: send caller is not owner nor approved");
        _burnBatch(_from, _tokenIds, _amounts);
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155URIStorage, ERC1155) returns (string memory) {
    return super.uri(tokenId);
    }

    function _creditTo(uint16, address _toAddress, uint[] memory _tokenIds, uint[] memory _amounts) internal virtual override {
        _mintBatch(_toAddress, _tokenIds, _amounts, "");
    }

    function totalSupply(uint256 tokenId) public view virtual override(ERC1155Supply) returns (uint256) {
        return super.totalSupply(tokenId);
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
    
}
