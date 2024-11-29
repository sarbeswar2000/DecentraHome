// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress;
    address public inspector;
    address public lender;

    mapping(address => bool) public isSeller;
    mapping(address => bool) public isBuyer;

    modifier notBothRoles() {
        require(
            !isSeller[msg.sender] && !isBuyer[msg.sender],
            "You cannot register as both buyer and seller"
        );
        _;
    }

    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    modifier onlySeller(uint256 _nftID) {
        require(msg.sender == seller[_nftID], "Only seller can call this method");
        _;
    }

    // Registration functions
    function registerAsSeller() external notBothRoles {
        isSeller[msg.sender] = true;
    }

    function registerAsBuyer() external notBothRoles {
        isBuyer[msg.sender] = true;
    }

    // NFT property mappings
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => address) public seller;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(
        address _nftAddress,
        address _inspector,
        address _lender
    ) {
        nftAddress = _nftAddress;
        inspector = _inspector;
        lender = _lender;
    }

    function list(
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount
    ) public {
        require(isSeller[msg.sender], "Only registered sellers can list properties");

        // Transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        seller[_nftID] = msg.sender;
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        
    }
    // newly added code for buyerassigning and 
    function assignBuyer(uint256 _nftID, address _buyer) public {
    require(isListed[_nftID], "Property is not listed");
    require(buyer[_nftID] == address(0), "Buyer already assigned");
    require(msg.sender == _buyer, "Only the buyer can assign themselves");
    buyer[_nftID] = _buyer;
    }

    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID], "Insufficient escrow deposit");
    }

    function updateInspectionStatus(uint256 _nftID, bool _passed)
        public
        onlyInspector
    {
        inspectionPassed[_nftID] = _passed;
    }

    function approveSale(uint256 _nftID) public {
        require(
            msg.sender == buyer[_nftID] || 
            msg.sender == seller[_nftID] || 
            msg.sender == lender,
            "Unauthorized approver"
        );
        approval[_nftID][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftID) public {
        require(isListed[_nftID], "Property not listed for sale");
        require(inspectionPassed[_nftID], "Inspection not passed");
        require(approval[_nftID][buyer[_nftID]], "Buyer approval missing");
        require(approval[_nftID][seller[_nftID]], "Seller approval missing");
        require(approval[_nftID][lender], "Lender approval missing");
        require(address(this).balance >= purchasePrice[_nftID], "Insufficient funds");

        isListed[_nftID] = false;

        // Transfer funds to seller
        (bool success, ) = payable(seller[_nftID]).call{value: purchasePrice[_nftID]}("");
        require(success, "Funds transfer failed");

        // Transfer NFT to buyer
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }

    function cancelSale(uint256 _nftID) public {
        require(isListed[_nftID], "Property not listed for sale");

        if (!inspectionPassed[_nftID]) {
            // Refund escrow to buyer
            payable(buyer[_nftID]).transfer(address(this).balance);
        } else {
            // Send escrow to seller
            payable(seller[_nftID]).transfer(address(this).balance);
        }

        isListed[_nftID] = false;
    }

    receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
