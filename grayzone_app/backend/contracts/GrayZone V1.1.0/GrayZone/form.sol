//SPDX-License-Identifier: MIT

/*
mantle : 0xc06a80778af273801ed5C14AB46883c446Dd6e23
fuse :  0xEB3A60E47a899B8776fb36B5EEDd16e589E722Ae
polygon : 0x042929007BFb97363741D79DDf9A1aA4C2b7EBC9
linea : 
base : 0x0ff9Ef29BD23c82E260aDEC858Aa1d7Cdf6ad33d
opBNB : 
BSC:
polygonZk:
lineaGoerli :
*/
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BasicForm is Ownable{
    uint256 public formFee;
    uint256 public formUsers;
    //address[] public allowedViewers;
    
    struct User {
        address user;
        uint256 nonce;
        mapping(uint256=> FORM) forms;
        mapping(uint256=> bool) viewed;
        mapping(uint256=> bool) delivered;
        mapping(uint256=> bytes) hireData;
    }
    
    struct FORM{
        bytes title;
        bytes desc;
        bytes ref;
        bytes other;
        bytes email;
        uint64 budget;
        uint64 timeInDays;
    }

    mapping (address => bool) public allowedViewer;
    mapping (address => User) internal data;
    mapping (uint256 => address) public users;
    

    constructor(){
        allowedViewer[msg.sender] = true;
    }

    function isViewed(address user , uint256 formId) public view returns(bool){
        return data[user].viewed[formId]; 
    }

    function isDelivered(address user , uint256 formId) public view returns(bool){
        return data[user].delivered[formId]; 
    }

    function getAllocationData(address user , uint256 id) public view returns(bytes memory) {
        return data[user].hireData[id];
    }

    function getFormData(address user ,uint256 id) public view returns(   
            bytes memory , 
            bytes memory,
            bytes memory,
            bytes memory,
            bytes memory, 
            uint64, 
            uint64){
        FORM storage form = data[user].forms[id];
        (
            bytes memory title , 
            bytes memory desc ,
            bytes memory refer,
            bytes memory other,
            bytes memory mail, 
            uint64 time , 
            uint64 budget
        ) = ( 
            
            form.title ,
            form.desc,
            form.ref,
            form.other,
            form.email, 
            form.timeInDays , 
            form.budget
            );
        return ( title , desc, refer , other , mail, time , budget);
    }

    function getUserNonce(address user) public view returns(uint256){
        return data[user].nonce;
    }

    function submit(bytes memory _title,bytes memory des,bytes memory ref , bytes memory other, bytes memory mail ,uint64 _days , uint64 _budget) public payable{
        require(msg.value >= formFee,"send fee");
        User storage user = data[msg.sender];
        uint256 id = user.nonce;
        user.user = msg.sender;
        user.nonce++;
        FORM memory form = FORM({
            title: _title,
            desc: des,
            ref: ref,
            other: other,
            email: mail,
            budget: _budget,
            timeInDays: _days
        });
        user.forms[id] = form;
        users[formUsers] = msg.sender;
        formUsers++;
    }

    function withdrawFee(address to , uint256 amount) public onlyOwner{
        payable(to).transfer(amount);
    }

    function changeFee(uint256 newFee) public onlyOwner{
        formFee = newFee;
    }

    function setViewer (address addr , bool _modifier) public onlyOwner{
        allowedViewer[addr] = _modifier;
    }
    
    function formViewed(address user , uint256 formId) public onlyOwner{
        data[user].viewed[formId] = true;
    }

    function formDelivered(address user , uint256 formId) public onlyOwner{
        data[user].delivered[formId] = true;
    }

    function allocateDev(bytes memory _data ,address _user , uint256 id) public onlyOwner {
        User storage u = data[_user];
        u.hireData[id] = _data;
    }
}
