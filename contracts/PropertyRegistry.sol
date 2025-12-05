// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PropertyRegistry
 * @dev Smart contract for managing land registry and property transfers
 */
contract PropertyRegistry {
    
    // Enums
    enum UserRole { None, Seller, Buyer, Registrar, Municipal, Broker }
    enum TransferStatus { 
        Initiated,      // Seller initiated transfer
        BrokerVerified, // Broker verified transaction
        RegistrarVerified, // Registrar verified documents
        MunicipalApproved, // Municipal approved transfer
        BuyerAccepted,  // Buyer accepted transfer
        Completed,      // Transfer completed
        Cancelled,      // Transfer cancelled
        Rejected        // Transfer rejected by Broker, Registrar, or Municipal
    }
    
    // Structs
    struct Property {
        uint256 propertyId;
        address currentOwner;
        string propertyAddress;
        string propertyType; // Residential, Commercial, Agricultural, etc.
        uint256 area; // in square feet/meters
        string ipfsHash; // IPFS hash for property documents
        uint256 registrationDate;
        bool isActive;
    }
    
    struct TransferRequest {
        uint256 transferId;
        uint256 propertyId;
        address seller;
        address buyer;
        uint256 price;
        string documentsHash; // IPFS hash for transfer documents (seller's documents)
        string buyerDocumentsHash; // IPFS hash for buyer's acceptance documents
        TransferStatus status;
        address broker;
        bool brokerVerified;
        bool registrarVerified;
        bool municipalApproved;
        bool buyerAccepted;
        string rejectionReason; // Reason for rejection (if rejected)
        address rejectedBy; // Address of the role that rejected the transfer
        uint256 createdAt;
        uint256 completedAt;
    }
    
    struct OwnershipHistory {
        address owner;
        uint256 transferId;
        uint256 timestamp;
        string ipfsHash;
    }
    
    // State Variables
    mapping(address => UserRole) public userRoles;
    mapping(uint256 => Property) public properties;
    mapping(uint256 => TransferRequest) public transferRequests;
    mapping(uint256 => OwnershipHistory[]) public ownershipHistory;
    mapping(address => uint256[]) public userProperties;
    
    uint256 public propertyCounter;
    uint256 public transferCounter;
    
    address public admin;
    
    // Events
    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed owner,
        string propertyAddress,
        string ipfsHash
    );
    
    event TransferInitiated(
        uint256 indexed transferId,
        uint256 indexed propertyId,
        address indexed seller,
        address buyer
    );
    
    event BrokerVerified(uint256 indexed transferId, address indexed broker);
    event RegistrarVerified(uint256 indexed transferId);
    event MunicipalApproved(uint256 indexed transferId);
    event BuyerAccepted(uint256 indexed transferId);
    event TransferCompleted(uint256 indexed transferId, uint256 indexed propertyId, address newOwner);
    event TransferCancelled(uint256 indexed transferId);
    event TransferRejected(uint256 indexed transferId, address indexed rejectedBy, string reason);
    event RoleAssigned(address indexed user, UserRole role);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRole(UserRole role) {
        require(userRoles[msg.sender] == role, "Insufficient role permissions");
        _;
    }
    
    modifier validProperty(uint256 _propertyId) {
        require(properties[_propertyId].isActive, "Property does not exist");
        _;
    }
    
    modifier validTransfer(uint256 _transferId) {
        require(transferRequests[_transferId].status != TransferStatus.Completed && 
                transferRequests[_transferId].status != TransferStatus.Cancelled &&
                transferRequests[_transferId].status != TransferStatus.Rejected, 
                "Transfer already completed or cancelled");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        propertyCounter = 0;
        transferCounter = 0;
    }
    
    /**
     * @dev Assign role to a user (only admin)
     */
    function assignRole(address _user, UserRole _role) external onlyAdmin {
        require(_user != address(0), "Invalid user address");
        userRoles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }
    
    /**
     * @dev Register a new property
     * Registrar can register for any owner
     * Seller can register for themselves (owner = msg.sender)
     */
    function registerProperty(
        address _owner,
        string memory _propertyAddress,
        string memory _propertyType,
        uint256 _area,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(_owner != address(0), "Invalid owner address");
        require(bytes(_propertyAddress).length > 0, "Property address required");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        
        // Check permissions: Registrar can register for anyone, Seller can register for themselves
        if (userRoles[msg.sender] != UserRole.Registrar) {
            require(_owner == msg.sender, "Sellers can only register properties for themselves");
            require(userRoles[msg.sender] == UserRole.Seller || _owner == msg.sender, 
                    "Only Registrar or Seller can register properties");
        }
        
        propertyCounter++;
        
        properties[propertyCounter] = Property({
            propertyId: propertyCounter,
            currentOwner: _owner,
            propertyAddress: _propertyAddress,
            propertyType: _propertyType,
            area: _area,
            ipfsHash: _ipfsHash,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        userProperties[_owner].push(propertyCounter);
        
        ownershipHistory[propertyCounter].push(OwnershipHistory({
            owner: _owner,
            transferId: 0,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash
        }));
        
        emit PropertyRegistered(propertyCounter, _owner, _propertyAddress, _ipfsHash);
        
        return propertyCounter;
    }
    
    /**
     * @dev Seller initiates a property transfer
     */
    function initiateTransfer(
        uint256 _propertyId,
        address _buyer,
        uint256 _price,
        address _broker,
        string memory _documentsHash
    ) external validProperty(_propertyId) returns (uint256) {
        require(properties[_propertyId].currentOwner == msg.sender, "Only owner can initiate transfer");
        require(userRoles[msg.sender] == UserRole.Seller || properties[_propertyId].currentOwner == msg.sender, 
                "Must be seller or property owner");
        require(_buyer != address(0), "Invalid buyer address");
        require(_buyer != msg.sender, "Buyer cannot be seller");
        require(_price > 0, "Price must be greater than zero");
        require(bytes(_documentsHash).length > 0, "Documents hash required");
        
        transferCounter++;
        
        transferRequests[transferCounter] = TransferRequest({
            transferId: transferCounter,
            propertyId: _propertyId,
            seller: msg.sender,
            buyer: _buyer,
            price: _price,
            documentsHash: _documentsHash,
            buyerDocumentsHash: "", // Will be set when buyer accepts
            status: TransferStatus.Initiated,
            broker: _broker,
            brokerVerified: false,
            registrarVerified: false,
            municipalApproved: false,
            buyerAccepted: false,
            rejectionReason: "",
            rejectedBy: address(0),
            createdAt: block.timestamp,
            completedAt: 0
        });
        
        emit TransferInitiated(transferCounter, _propertyId, msg.sender, _buyer);
        
        return transferCounter;
    }
    
    /**
     * @dev Broker verifies the transaction
     */
    function brokerVerify(uint256 _transferId) external validTransfer(_transferId) {
        require(userRoles[msg.sender] == UserRole.Broker, "Only broker can verify");
        require(transferRequests[_transferId].broker == msg.sender, "Unauthorized broker");
        require(transferRequests[_transferId].status == TransferStatus.Initiated, 
                "Transfer not in Initiated status");
        
        transferRequests[_transferId].brokerVerified = true;
        transferRequests[_transferId].status = TransferStatus.BrokerVerified;
        
        emit BrokerVerified(_transferId, msg.sender);
    }
    
    /**
     * @dev Registrar verifies documents and ownership
     */
    function registrarVerify(uint256 _transferId) external validTransfer(_transferId) 
        onlyRole(UserRole.Registrar) {
        require(transferRequests[_transferId].status == TransferStatus.BrokerVerified, 
                "Broker verification required first");
        
        transferRequests[_transferId].registrarVerified = true;
        transferRequests[_transferId].status = TransferStatus.RegistrarVerified;
        
        emit RegistrarVerified(_transferId);
    }
    
    /**
     * @dev Municipal office approves the transfer
     */
    function municipalApprove(uint256 _transferId) external validTransfer(_transferId) 
        onlyRole(UserRole.Municipal) {
        require(transferRequests[_transferId].status == TransferStatus.RegistrarVerified, 
                "Registrar verification required first");
        
        transferRequests[_transferId].municipalApproved = true;
        transferRequests[_transferId].status = TransferStatus.MunicipalApproved;
        
        emit MunicipalApproved(_transferId);
    }
    
    /**
     * @dev Buyer accepts the transfer and uploads acceptance documents
     * @notice Buyer must send ETH equal to the transfer price
     */
    function buyerAccept(uint256 _transferId, string memory _buyerDocumentsHash) external payable validTransfer(_transferId) {
        TransferRequest storage transfer = transferRequests[_transferId];
        require(msg.sender == transfer.buyer, "Only buyer can accept");
        require(transfer.status == TransferStatus.MunicipalApproved, 
                "Municipal approval required first");
        require(bytes(_buyerDocumentsHash).length > 0, "Buyer documents hash required");
        require(msg.value == transfer.price, "ETH amount must match transfer price");
        
        transfer.buyerAccepted = true;
        transfer.buyerDocumentsHash = _buyerDocumentsHash;
        transfer.status = TransferStatus.BuyerAccepted;
        
        emit BuyerAccepted(_transferId);
        
        // Automatically complete transfer after buyer acceptance
        completeTransfer(_transferId);
    }
    
    /**
     * @dev Complete the transfer (internal function called after buyer acceptance)
     * @notice Transfers ETH from contract to seller
     */
    function completeTransfer(uint256 _transferId) internal {
        TransferRequest storage transfer = transferRequests[_transferId];
        require(transfer.status == TransferStatus.BuyerAccepted, "Buyer acceptance required");
        
        uint256 propertyId = transfer.propertyId;
        Property storage property = properties[propertyId];
        
        // Transfer ETH to seller
        address seller = transfer.seller;
        uint256 price = transfer.price;
        
        // Send ETH to seller
        (bool success, ) = payable(seller).call{value: price}("");
        require(success, "ETH transfer to seller failed");
        
        // Update property ownership
        address oldOwner = property.currentOwner;
        property.currentOwner = transfer.buyer;
        property.ipfsHash = transfer.documentsHash;
        
        // Update ownership history
        ownershipHistory[propertyId].push(OwnershipHistory({
            owner: transfer.buyer,
            transferId: _transferId,
            timestamp: block.timestamp,
            ipfsHash: transfer.buyerDocumentsHash // Use buyer's documents hash for ownership record
        }));
        
        // Update user properties
        userProperties[transfer.buyer].push(propertyId);
        
        // Update transfer status
        transfer.status = TransferStatus.Completed;
        transfer.completedAt = block.timestamp;
        
        emit TransferCompleted(_transferId, propertyId, transfer.buyer);
    }
    
    /**
     * @dev Broker rejects the transfer
     */
    function brokerReject(uint256 _transferId, string memory _reason) external validTransfer(_transferId) {
        require(userRoles[msg.sender] == UserRole.Broker, "Only broker can reject");
        require(transferRequests[_transferId].broker == msg.sender, "Unauthorized broker");
        require(transferRequests[_transferId].status == TransferStatus.Initiated, 
                "Transfer not in Initiated status");
        require(bytes(_reason).length > 0, "Rejection reason required");
        
        transferRequests[_transferId].status = TransferStatus.Rejected;
        transferRequests[_transferId].rejectionReason = _reason;
        transferRequests[_transferId].rejectedBy = msg.sender;
        
        emit TransferRejected(_transferId, msg.sender, _reason);
    }
    
    /**
     * @dev Registrar rejects the transfer
     */
    function registrarReject(uint256 _transferId, string memory _reason) external validTransfer(_transferId) 
        onlyRole(UserRole.Registrar) {
        require(transferRequests[_transferId].status == TransferStatus.BrokerVerified, 
                "Transfer must be broker verified");
        require(bytes(_reason).length > 0, "Rejection reason required");
        
        transferRequests[_transferId].status = TransferStatus.Rejected;
        transferRequests[_transferId].rejectionReason = _reason;
        transferRequests[_transferId].rejectedBy = msg.sender;
        
        emit TransferRejected(_transferId, msg.sender, _reason);
    }
    
    /**
     * @dev Municipal rejects the transfer
     */
    function municipalReject(uint256 _transferId, string memory _reason) external validTransfer(_transferId) 
        onlyRole(UserRole.Municipal) {
        require(transferRequests[_transferId].status == TransferStatus.RegistrarVerified, 
                "Transfer must be registrar verified");
        require(bytes(_reason).length > 0, "Rejection reason required");
        
        transferRequests[_transferId].status = TransferStatus.Rejected;
        transferRequests[_transferId].rejectionReason = _reason;
        transferRequests[_transferId].rejectedBy = msg.sender;
        
        emit TransferRejected(_transferId, msg.sender, _reason);
    }
    
    /**
     * @dev Cancel a transfer (only seller or admin can cancel)
     */
    function cancelTransfer(uint256 _transferId) external validTransfer(_transferId) {
        require(msg.sender == transferRequests[_transferId].seller || msg.sender == admin, 
                "Only seller or admin can cancel");
        
        transferRequests[_transferId].status = TransferStatus.Cancelled;
        
        emit TransferCancelled(_transferId);
    }
    
    /**
     * @dev Get property details
     */
    function getProperty(uint256 _propertyId) external view returns (
        uint256 propertyId,
        address currentOwner,
        string memory propertyAddress,
        string memory propertyType,
        uint256 area,
        string memory ipfsHash,
        uint256 registrationDate,
        bool isActive
    ) {
        Property memory property = properties[_propertyId];
        return (
            property.propertyId,
            property.currentOwner,
            property.propertyAddress,
            property.propertyType,
            property.area,
            property.ipfsHash,
            property.registrationDate,
            property.isActive
        );
    }
    
    /**
     * @dev Get transfer request details
     */
    function getTransferRequest(uint256 _transferId) external view returns (TransferRequest memory) {
        return transferRequests[_transferId];
    }
    
    /**
     * @dev Get ownership history for a property
     */
    function getOwnershipHistory(uint256 _propertyId) external view returns (
        address[] memory owners,
        uint256[] memory transferIds,
        uint256[] memory timestamps,
        string[] memory ipfsHashes
    ) {
        OwnershipHistory[] memory history = ownershipHistory[_propertyId];
        uint256 length = history.length;
        
        owners = new address[](length);
        transferIds = new uint256[](length);
        timestamps = new uint256[](length);
        ipfsHashes = new string[](length);
        
        for (uint256 i = 0; i < length; i++) {
            owners[i] = history[i].owner;
            transferIds[i] = history[i].transferId;
            timestamps[i] = history[i].timestamp;
            ipfsHashes[i] = history[i].ipfsHash;
        }
        
        return (owners, transferIds, timestamps, ipfsHashes);
    }
    
    /**
     * @dev Get properties owned by a user
     */
    function getUserProperties(address _user) external view returns (uint256[] memory) {
        return userProperties[_user];
    }
}

