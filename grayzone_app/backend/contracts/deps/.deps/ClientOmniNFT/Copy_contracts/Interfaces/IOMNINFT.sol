// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IOmniNFT {
    function increaseRoleLimit(uint256 newLimit) external;

    function assignRole(address to, uint16 _roleId, string memory role, uint256 idAllowed) external;

    function getRole(address _of) external view returns (uint16, uint256[] memory, string memory);

    function mint(address to, uint256 id_, uint256 amounts, string memory tokenUri) external;

    function setFee(uint256 amountinwei) external;

    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts) external;

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function uri(uint256 tokenId) external view returns (string memory);

    function totalSupply(uint256 tokenId) external view returns (uint256);
    
    function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes calldata data) external;

    function safeBatchTransferFrom(address from, address to, uint256[] calldata tokenIds, uint256[] calldata amounts, bytes calldata data) external;

    function balanceOf(address account, uint256 tokenId) external view returns (uint256);

    function balanceOfBatch(address[] calldata accounts, uint256[] calldata tokenIds) external view returns (uint256[] memory);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address account, address operator) external view returns (bool);

    function exists(uint256 tokenId) external view returns (bool);
}
