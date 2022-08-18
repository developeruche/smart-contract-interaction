// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract KoloVest {
    struct Vest {
        uint32 BreakTime;
        uint256 amount;
    }
    struct VestERC20 {
        uint32 BreakTime;
        uint256 amount;
        address tokenAddress;
    }
    mapping(address => mapping(uint8 => Vest)) private vests;
    mapping(address => uint8) private currentVest;


    // ERRORS

    /// You can't save zero ether
    error ZeroEtherIsNotAllowed();

    /// This KoloVest is empty
    error KolovestEmpty();


    /// @dev this function would create a vest for the user and populate the vests mapping
    /// @param _breakTime: this is how long in seconds the vesting would take
    function makeVest(uint32 _breakTime) public payable {
        if(msg.value == 0) {
            revert ZeroEtherIsNotAllowed();
        }
        Vest storage v = vests[msg.sender][currentVest[msg.sender] + 1];

        v.BreakTime = uint32(block.timestamp) + _breakTime;
        v.amount = msg.value;

        currentVest[msg.sender] = currentVest[msg.sender] + 1;
    }

    /// @dev this function would return the vest which the user provided the id
    function getVest(uint8 _vestID) view public returns(Vest memory) {
        return vests[msg.sender][_vestID];
    }

    /// @dev this function when called would send the saved ether back to the owner
    function breakVest(uint8 _vestID) payable public returns(bool ) {
        Vest storage v = vests[msg.sender][_vestID];
        if(v.amount <= 0) {
            revert KolovestEmpty();
        }
        uint payment = v.amount;
        v.amount = 0;
        (bool sent, ) = payable(msg.sender).call{value: payment}("");

        return sent;
    }
}