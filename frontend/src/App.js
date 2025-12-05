import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  FiHome, 
  FiLayers, 
  FiRefreshCw, 
  FiPlus, 
  FiInfo,
  FiUser,
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiFileText,
  FiSearch,
  FiX,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import './App.css';

const API_URL = 'http://localhost:3001/api';

// Role descriptions and responsibilities
const ROLE_INFO = {
  'Seller': {
    icon: '🏠',
    color: '#667eea',
    description: 'Property Owner',
    responsibilities: [
      'Register properties you own',
      'Initiate property transfers to buyers',
      'Upload property documents (deeds, titles)',
      'Cancel transfers before completion',
      'View your property portfolio'
    ],
    permissions: 'Can register and transfer your own properties'
  },
  'Buyer': {
    icon: '👤',
    color: '#4caf50',
    description: 'Property Purchaser',
    responsibilities: [
      'Accept property transfers',
      'Upload acceptance documents',
      'View transfer details',
      'Complete property purchases',
      'View properties you are purchasing'
    ],
    permissions: 'Can accept transfers and complete purchases'
  },
  'Registrar': {
    icon: '📋',
    color: '#9c27b0',
    description: 'Government Registrar Office',
    responsibilities: [
      'Register properties for any owner',
      'Verify property documents and ownership',
      'Verify transfer requests after broker verification',
      'Maintain official property records',
      'View all properties and transfers'
    ],
    permissions: 'Can register properties for anyone and verify transfers'
  },
  'Municipal': {
    icon: '🏛️',
    color: '#ff9800',
    description: 'Municipal Corporation',
    responsibilities: [
      'Approve property transfers',
      'Review registrar-verified transfers',
      'Grant final approval before buyer acceptance',
      'View all transfer requests',
      'Ensure compliance with municipal regulations'
    ],
    permissions: 'Can approve transfers after registrar verification'
  },
  'Broker': {
    icon: '🤝',
    color: '#2196f3',
    description: 'Real Estate Broker',
    responsibilities: [
      'Verify property transfer transactions',
      'Review transfer details and documents',
      'Verify transaction authenticity',
      'Facilitate seller-buyer agreements',
      'View assigned transfer requests'
    ],
    permissions: 'Can verify transfers assigned to you'
  },
};

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [properties, setProperties] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        await loadUserRole(accounts[0]);
        await loadUserProperties(accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Error connecting wallet: ' + error.message);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Load user role
  const loadUserRole = async (address) => {
    try {
      const response = await fetch(`${API_URL}/users/${address}/role`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserRole(data.role);
    } catch (error) {
      console.error('Error loading role:', error);
      // Set empty role if API fails
      setUserRole('');
      alert('Warning: Could not load user role. Make sure backend is running on port 3001.');
    }
  };

  // Load user properties
  const loadUserProperties = async (address) => {
    try {
      const response = await fetch(`${API_URL}/users/${address}/properties`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.properties && data.properties.length > 0) {
        const propertyPromises = data.properties.map(id =>
          fetch(`${API_URL}/properties/${id}`).then(r => r.json())
        );
        const propertyData = await Promise.all(propertyPromises);
        // Double-check: filter by current owner (in case backend didn't filter)
        const filteredProperties = propertyData.filter(prop => 
          prop.currentOwner.toLowerCase() === address.toLowerCase()
        );
        setProperties(filteredProperties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      // Set empty array if API fails
      setProperties([]);
    }
  };

  // File upload handler
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.ipfsHash;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <div className="logo-container">
            <FiShield className="logo-icon" />
            <div className="logo-text">
              <h1>Blockchain Land Registry</h1>
              <span className="tagline">Secure Property Management System</span>
            </div>
          </div>
        </div>
        
        {account ? (
          <div className="wallet-info">
            <div className="wallet-details">
              <div className="wallet-address-section">
                <FiUser className="wallet-icon" />
                <div className="address-info">
                  <span className="address-label">Wallet Address</span>
                  <div className="address-value-container">
                    <span className="address-value">{account.substring(0, 6)}...{account.substring(38)}</span>
                    <button onClick={copyAddress} className="copy-btn" title="Copy address">
                      {copied ? <FiCheck className="copy-icon" /> : <FiCopy className="copy-icon" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="role-section">
                <div className="role-badge-header" style={{ backgroundColor: ROLE_INFO[userRole]?.color || '#999' }}>
                  <span className="role-icon-header">{ROLE_INFO[userRole]?.icon || '👤'}</span>
                  <span className="role-text">{userRole || 'No Role'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={connectWallet} className="connect-btn">
            <FiShield className="btn-icon" />
            Connect Wallet
          </button>
        )}
      </header>

      {account && (
        <div className="container">
          <nav className="tabs">
            <button
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <FiLayers className="tab-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={activeTab === 'properties' ? 'active' : ''}
              onClick={() => setActiveTab('properties')}
            >
              <FiHome className="tab-icon" />
              <span>Properties</span>
            </button>
            <button
              className={activeTab === 'transfers' ? 'active' : ''}
              onClick={() => setActiveTab('transfers')}
            >
              <FiRefreshCw className="tab-icon" />
              <span>Transfers</span>
            </button>
            {(userRole === 'Registrar' || userRole === 'Seller' || userRole === 'Admin') && (
              <button
                className={activeTab === 'register' ? 'active' : ''}
                onClick={() => setActiveTab('register')}
              >
                <FiPlus className="tab-icon" />
                <span>Register Property</span>
              </button>
            )}
            <button
              className="role-info-btn"
              onClick={() => setShowRoleInfo(!showRoleInfo)}
              title="View role information"
            >
              <FiInfo className="tab-icon" />
              <span>Roles & Help</span>
            </button>
          </nav>

          {showRoleInfo && (
            <RoleInfoPanel userRole={userRole} onClose={() => setShowRoleInfo(false)} />
          )}

          <main className="content">
            {activeTab === 'dashboard' && (
              <Dashboard
                account={account}
                userRole={userRole}
                properties={properties}
              />
            )}
            {activeTab === 'properties' && (
              <Properties
                properties={properties}
                account={account}
                userRole={userRole}
              />
            )}
            {activeTab === 'transfers' && (
              <Transfers
                account={account}
                userRole={userRole}
                uploadFile={uploadFile}
                provider={provider}
                onPropertiesUpdate={() => loadUserProperties(account)}
              />
            )}
            {activeTab === 'register' && (userRole === 'Registrar' || userRole === 'Seller') && (
              <RegisterProperty uploadFile={uploadFile} account={account} userRole={userRole} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

// Role Info Panel Component
function RoleInfoPanel({ userRole, onClose }) {
  const currentRoleInfo = ROLE_INFO[userRole] || { 
    icon: '👤', 
    color: '#999', 
    description: 'No Role Assigned', 
    responsibilities: ['View public property information', 'Search properties by ID'],
    permissions: 'Limited access - contact admin to assign a role'
  };
  
  return (
    <div className="role-info-panel">
      <div className="role-info-header">
        <h2><FiInfo className="section-icon" /> Roles & Responsibilities Guide</h2>
        <button onClick={onClose} className="close-btn"><FiX /></button>
      </div>
      
      <div className="role-info-content">
        <div className="current-role-section">
          <h3>Your Current Role</h3>
          <div className="role-badge-large" style={{ backgroundColor: currentRoleInfo.color }}>
            <span className="role-icon">{currentRoleInfo.icon}</span>
            <div>
              <h4>{userRole || 'No Role'}</h4>
              <p>{currentRoleInfo.description}</p>
            </div>
          </div>
          <div className="role-permissions">
            <p><strong>Permissions:</strong> {currentRoleInfo.permissions}</p>
          </div>
        </div>

        <div className="all-roles-section">
          <h3>All Roles in the System</h3>
          <div className="roles-grid">
            {Object.entries(ROLE_INFO).map(([role, info]) => (
              <div key={role} className="role-card" style={{ borderColor: info.color }}>
                <div className="role-card-header" style={{ backgroundColor: info.color }}>
                  <span className="role-icon">{info.icon}</span>
                  <h4>{role}</h4>
                  <p>{info.description}</p>
                </div>
                <div className="role-card-body">
                  <p><strong>Responsibilities:</strong></p>
                  <ul>
                    {info.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="workflow-section">
          <h3>🔄 Property Transfer Workflow</h3>
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Seller Initiates Transfer</h4>
                <p>Seller uploads property documents and initiates transfer to buyer</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Broker Verification</h4>
                <p>Broker verifies transaction details and authenticity</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Registrar Verification</h4>
                <p>Registrar office verifies documents and ownership</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Municipal Approval</h4>
                <p>Municipal corporation grants final approval</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h4>Buyer Acceptance</h4>
                <p>Buyer accepts transfer and uploads acceptance documents</p>
              </div>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">✓</div>
              <div className="step-content">
                <h4>Transfer Completed</h4>
                <p>Ownership transferred on blockchain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ account, userRole, properties }) {
  const roleInfo = ROLE_INFO[userRole] || { 
    icon: '👤', 
    color: '#999', 
    description: 'No Role Assigned'
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2><FiLayers className="section-icon" /> Dashboard</h2>
        <div className="role-badge" style={{ backgroundColor: roleInfo.color }}>
          <span>{roleInfo.icon}</span>
          <span>{userRole || 'No Role'}</span>
        </div>
      </div>
      
      <div className="stats">
        <div className="stat-card" style={{ background: `linear-gradient(135deg, ${roleInfo.color} 0%, ${roleInfo.color}dd 100%)` }}>
          <FiHome className="stat-icon" />
          <h3>My Properties</h3>
          <p className="stat-number">{properties.length}</p>
          <p className="stat-label">Properties owned</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <FiUser className="stat-icon" />
          <h3>My Role</h3>
          <p className="stat-value">{userRole || 'No Role'}</p>
          <p className="stat-label">{roleInfo.description}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <FiShield className="stat-icon" />
          <h3>Wallet Address</h3>
          <p className="stat-value-small">{account.substring(0, 6)}...{account.substring(38)}</p>
          <p className="stat-label">Connected</p>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {(userRole === 'Registrar' || userRole === 'Seller') && (
            <div className="quick-action-card">
              <FiPlus className="action-icon" />
              <h4>Register Property</h4>
              <p>Add a new property to the registry</p>
            </div>
          )}
          {userRole === 'Seller' && (
            <div className="quick-action-card">
              <FiRefreshCw className="action-icon" />
              <h4>Initiate Transfer</h4>
              <p>Start a property transfer process</p>
            </div>
          )}
          <div className="quick-action-card">
            <FiSearch className="action-icon" />
            <h4>Search Properties</h4>
            <p>Find properties by ID</p>
          </div>
          <div className="quick-action-card">
            <FiFileText className="action-icon" />
            <h4>View Transfers</h4>
            <p>Check transfer status</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Properties Component
function Properties({ properties, account, userRole }) {
  const [searchPropertyId, setSearchPropertyId] = useState('');
  const [searchedProperty, setSearchedProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchProperty = async () => {
    if (!searchPropertyId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/properties/${searchPropertyId}`);
      if (response.ok) {
        const data = await response.json();
        setSearchedProperty(data);
      } else {
        alert('Property not found');
        setSearchedProperty(null);
      }
    } catch (error) {
      console.error('Error searching property:', error);
      alert('Error loading property');
      setSearchedProperty(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="properties">
      <h2><FiHome className="section-icon" /> Properties</h2>
      
      {/* Search Property by ID */}
      <div className="search-section">
        <h3><FiSearch className="section-icon" /> Search Property by ID</h3>
        <p className="help-text">Enter a property ID to view its details, ownership history, and documents</p>
        <div className="search-box">
          <input
            type="number"
            placeholder="Enter Property ID (e.g., 1, 2, 3...)"
            value={searchPropertyId}
            onChange={(e) => setSearchPropertyId(e.target.value)}
            className="search-input"
          />
          <button
            onClick={searchProperty}
            disabled={!searchPropertyId || loading}
            className="search-btn"
          >
            {loading ? <><FiClock className="btn-icon" /> Loading...</> : <><FiSearch className="btn-icon" /> Search</>}
          </button>
        </div>
        {searchedProperty && (
          <div className="property-card featured">
            <div className="property-header">
              <h3><FiHome className="property-icon" /> Property #{searchedProperty.propertyId}</h3>
              <span className="property-badge">{searchedProperty.propertyType}</span>
            </div>
            <div className="property-details">
              <div className="detail-item">
                <span className="detail-label"><FiHome className="inline-icon" /> Address:</span>
                <span className="detail-value">{searchedProperty.propertyAddress}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FiLayers className="inline-icon" /> Area:</span>
                <span className="detail-value">{searchedProperty.area} sq ft</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FiUser className="inline-icon" /> Owner:</span>
                <span className="detail-value address">{searchedProperty.currentOwner}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FiClock className="inline-icon" /> Registered:</span>
                <span className="detail-value">{new Date(searchedProperty.registrationDate * 1000).toLocaleString()}</span>
              </div>
            </div>
            {searchedProperty.ipfsHash && (
              <a
                href={searchedProperty.ipfsHash.startsWith('QmMock') 
                  ? `${API_URL}/documents/${searchedProperty.ipfsHash}`
                  : `https://ipfs.io/ipfs/${searchedProperty.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="document-link"
              >
                <FiFileText className="btn-icon" /> View Documents
                {searchedProperty.ipfsHash.startsWith('QmMock') && (
                  <small style={{ display: 'block', marginTop: '5px', fontSize: '0.85em', opacity: 0.8 }}>
                    (Stored locally - IPFS not configured)
                  </small>
                )}
              </a>
            )}
          </div>
        )}
      </div>

      {/* My Properties List */}
      <div className="my-properties-section">
        <h3><FiHome className="section-icon" /> Properties I Own</h3>
        {properties.length === 0 ? (
          <div className="empty-state">
            <FiHome className="empty-icon" />
            <p>No properties found.</p>
            <p className="help-text">Register a property or connect with the owner account to see your properties.</p>
          </div>
        ) : (
          <div className="property-list">
            {properties.map((property, index) => (
              <div key={index} className="property-card">
                <div className="property-header">
                  <h3><FiHome className="property-icon" /> Property #{property.propertyId}</h3>
                  <span className="property-badge">{property.propertyType}</span>
                </div>
                <div className="property-details">
                  <div className="detail-item">
                    <span className="detail-label"><FiHome className="inline-icon" /> Address:</span>
                    <span className="detail-value">{property.propertyAddress}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label"><FiLayers className="inline-icon" /> Area:</span>
                    <span className="detail-value">{property.area} sq ft</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label"><FiUser className="inline-icon" /> Owner:</span>
                    <span className="detail-value address">{property.currentOwner}</span>
                  </div>
                </div>
                {property.ipfsHash && (
                  <a
                    href={property.ipfsHash.startsWith('QmMock') 
                      ? `${API_URL}/documents/${property.ipfsHash}`
                      : `https://ipfs.io/ipfs/${property.ipfsHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="document-link"
                  >
                    <FiFileText className="btn-icon" /> View Documents
                    {property.ipfsHash.startsWith('QmMock') && (
                      <small style={{ display: 'block', marginTop: '5px', fontSize: '0.85em', opacity: 0.8 }}>
                        (Stored locally - IPFS not configured)
                      </small>
                    )}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Transfers Component
function Transfers({ account, userRole, uploadFile, provider, onPropertiesUpdate }) {
  const [transferForm, setTransferForm] = useState({
    propertyId: '',
    buyer: '',
    price: '',
    broker: '',
    file: null
  });
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [viewTransferId, setViewTransferId] = useState('');
  const [transferDetails, setTransferDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewingTransfer, setViewingTransfer] = useState(false);
  const [useBackendAPI, setUseBackendAPI] = useState(true); // Default to backend API to avoid MetaMask issues
  
  // Contract address (from deployment.json)
  const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  
  // Minimal ABI for role-based actions
  const CONTRACT_ABI = [
    "function brokerVerify(uint256 _transferId) external",
    "function registrarVerify(uint256 _transferId) external",
    "function municipalApprove(uint256 _transferId) external",
    "function cancelTransfer(uint256 _transferId) external",
    "function buyerAccept(uint256 _transferId, string memory _buyerDocumentsHash) external"
  ];

  useEffect(() => {
    if (account) {
      // In a real app, you'd fetch all pending transfers
      // For now, we'll allow manual lookup
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload document first
      const ipfsHash = await uploadFile(transferForm.file);

      // Initiate transfer
      const response = await fetch(`${API_URL}/transfers/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: transferForm.propertyId,
          buyer: transferForm.buyer,
          price: transferForm.price,
          broker: transferForm.broker || null,
          documentsHash: ipfsHash
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Transfer initiated successfully! Transfer ID: ' + data.transferId);
        setTransferForm({ propertyId: '', buyer: '', price: '', broker: '', file: null });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error initiating transfer: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTransferDetails = async (transferId) => {
    try {
      const response = await fetch(`${API_URL}/transfers/${transferId}`);
      const data = await response.json();
      setTransferDetails(data);
      setViewingTransfer(true);
    } catch (error) {
      console.error('Error loading transfer:', error);
      alert('Error loading transfer details');
    }
  };

  const handleAction = async (action, transferId, file = null) => {
    // Use backend API by default (avoids MetaMask popup issues)
    if (useBackendAPI) {
      return handleActionViaBackend(action, transferId, file);
    }
    
    // Use MetaMask (direct contract call)
    if (!provider || !account) {
      alert('Please connect your wallet first');
      return;
    }

    const actionNames = {
      'brokerVerify': 'Broker Verification',
      'registrarVerify': 'Registrar Verification',
      'municipalApprove': 'Municipal Approval',
      'buyerAccept': 'Buyer Acceptance',
      'cancel': 'Cancel Transfer'
    };

    const actionName = actionNames[action] || action;
    
    const confirmMessage = `You are about to ${actionName.toLowerCase()} for Transfer #${transferId}.\n\n` +
      `This will open MetaMask for you to review and confirm the transaction.\n\n` +
      `Contract: ${CONTRACT_ADDRESS}\n` +
      `Your Account: ${account}\n\n` +
      `Click OK to proceed to MetaMask.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      let tx;
      let txHash;
      
      switch (action) {
        case 'brokerVerify':
          tx = await contract.brokerVerify(transferId);
          txHash = tx.hash;
          alert(`Transaction submitted!\n\nHash: ${txHash}\n\nWaiting for confirmation...`);
          await tx.wait();
          alert('✅ Broker verification completed successfully!');
          break;
          
        case 'registrarVerify':
          tx = await contract.registrarVerify(transferId);
          txHash = tx.hash;
          alert(`Transaction submitted!\n\nHash: ${txHash}\n\nWaiting for confirmation...`);
          await tx.wait();
          alert('✅ Registrar verification completed successfully!');
          break;
          
        case 'municipalApprove':
          tx = await contract.municipalApprove(transferId);
          txHash = tx.hash;
          alert(`Transaction submitted!\n\nHash: ${txHash}\n\nWaiting for confirmation...`);
          await tx.wait();
          alert('✅ Municipal approval completed successfully!');
          break;
          
        case 'buyerAccept':
          if (!file) {
            alert('Please select a file to upload');
            setLoading(false);
            return;
          }
          
          const ipfsHash = await uploadFile(file);
          tx = await contract.buyerAccept(transferId, ipfsHash);
          txHash = tx.hash;
          alert(`Transaction submitted!\n\nHash: ${txHash}\n\nWaiting for confirmation...`);
          await tx.wait();
          alert('✅ Transfer accepted successfully!');
          break;
          
        case 'cancel':
          tx = await contract.cancelTransfer(transferId);
          txHash = tx.hash;
          alert(`Transaction submitted!\n\nHash: ${txHash}\n\nWaiting for confirmation...`);
          await tx.wait();
          alert('✅ Transfer cancelled successfully!');
          break;
          
        default:
          setLoading(false);
          return;
      }

      if (transferDetails) {
        await loadTransferDetails(transferId);
      }
      // Reload properties if transfer was completed (ownership changed)
      if (action === 'buyerAccept' && onPropertiesUpdate) {
        await onPropertiesUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = error.message || 'Unknown error';
      
      if (error.code === 4001 || error.message.includes('user rejected') || error.message.includes('User denied')) {
        alert('❌ Transaction cancelled by user');
        setLoading(false);
        return;
      }
      
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
      
      alert('❌ Error performing action: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle actions via backend API (no MetaMask popup)
  const handleActionViaBackend = async (action, transferId, file = null) => {
    setLoading(true);
    try {
      let endpoint = '';
      let formData = null;
      
      switch (action) {
        case 'brokerVerify':
          endpoint = `${API_URL}/transfers/${transferId}/broker-verify`;
          break;
        case 'registrarVerify':
          endpoint = `${API_URL}/transfers/${transferId}/registrar-verify`;
          break;
        case 'municipalApprove':
          endpoint = `${API_URL}/transfers/${transferId}/municipal-approve`;
          break;
        case 'buyerAccept':
          endpoint = `${API_URL}/transfers/${transferId}/buyer-accept`;
          if (file) {
            formData = new FormData();
            formData.append('file', file);
          }
          break;
        case 'cancel':
          endpoint = `${API_URL}/transfers/${transferId}/cancel`;
          break;
        default:
          setLoading(false);
          return;
      }

      const options = {
        method: 'POST',
      };
      
      if (formData) {
        options.body = formData;
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Action completed successfully!\n\nTransaction Hash: ${data.transactionHash || 'N/A'}`);
        if (transferDetails) {
          await loadTransferDetails(transferId);
        }
        // Reload properties if transfer was completed (ownership changed)
        if (action === 'buyerAccept' && onPropertiesUpdate) {
          await onPropertiesUpdate();
        }
      } else {
        alert('❌ Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error performing action: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Initiated': '#ff9800',
      'BrokerVerified': '#2196f3',
      'RegistrarVerified': '#9c27b0',
      'MunicipalApproved': '#4caf50',
      'BuyerAccepted': '#00bcd4',
      'Completed': '#009688',
      'Cancelled': '#f44336'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="transfers">
      <h2><FiRefreshCw className="section-icon" /> Property Transfers</h2>
      
      {!viewingTransfer ? (
        <>
          {/* Transaction Method Toggle */}
          <div className="transfer-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useBackendAPI}
                onChange={(e) => setUseBackendAPI(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span>
                <strong>Use Backend API</strong> (No MetaMask popup required)
                <br />
                <small style={{ color: '#666' }}>
                  {useBackendAPI 
                    ? 'Transactions will be signed by backend. Update backend .env with correct private key for your role.'
                    : 'Transactions will require MetaMask approval.'}
                </small>
              </span>
            </label>
          </div>

          {/* Initiate Transfer Form */}
          {userRole === 'Seller' && (
            <div className="transfer-section">
              <h3><FiRefreshCw className="section-icon" /> Initiate New Transfer</h3>
              <p className="help-text">As a Seller, you can initiate a property transfer. Upload the property deed and enter buyer details.</p>
              <form onSubmit={handleSubmit} className="transfer-form">
                <div className="form-group">
                  <label>Property ID *</label>
                  <input
                    type="number"
                    placeholder="Enter the Property ID you want to transfer"
                    value={transferForm.propertyId}
                    onChange={(e) => setTransferForm({ ...transferForm, propertyId: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Buyer Address *</label>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={transferForm.buyer}
                    onChange={(e) => setTransferForm({ ...transferForm, buyer: e.target.value })}
                    required
                  />
                  <small>Enter the Ethereum address of the buyer</small>
                </div>
                <div className="form-group">
                  <label>Price (ETH) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={transferForm.price}
                    onChange={(e) => setTransferForm({ ...transferForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Broker Address (Optional)</label>
                  <input
                    type="text"
                    placeholder="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (leave empty if no broker)"
                    value={transferForm.broker}
                    onChange={(e) => setTransferForm({ ...transferForm, broker: e.target.value })}
                  />
                  <small>If a broker is involved, enter their Ethereum address (42 characters). Example: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65. Leave empty to skip broker verification.</small>
                </div>
                <div className="form-group">
                  <label>Property Documents (Deed/Title) *</label>
                  <input
                    type="file"
                    onChange={(e) => setTransferForm({ ...transferForm, file: e.target.files[0] })}
                    required
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <small>Upload property deed or title documents</small>
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? <><FiClock className="btn-icon" /> Processing...</> : <><FiRefreshCw className="btn-icon" /> Initiate Transfer</>}
                </button>
              </form>
            </div>
          )}

          {/* View Transfer */}
          <div className="transfer-section">
            <h3><FiSearch className="section-icon" /> View Transfer Details</h3>
            <p className="help-text">Enter a Transfer ID to view its status, verification progress, and take actions based on your role.</p>
            <div className="search-box">
              <input
                type="number"
                placeholder="Enter Transfer ID"
                value={viewTransferId}
                onChange={(e) => setViewTransferId(e.target.value)}
                className="search-input"
              />
              <button
                onClick={() => viewTransferId && loadTransferDetails(viewTransferId)}
                disabled={!viewTransferId || loading}
                className="search-btn"
              >
                {loading ? <><FiClock className="btn-icon" /> Loading...</> : <><FiSearch className="btn-icon" /> Load Transfer</>}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="transfer-details">
          <button onClick={() => { setViewingTransfer(false); setTransferDetails(null); }} className="back-btn">
            <FiX className="btn-icon" /> Back to Transfers
          </button>
          
          {transferDetails && (
            <>
              <div className="transfer-card">
                <div className="transfer-header">
                  <h3><FiRefreshCw className="section-icon" /> Transfer #{transferDetails.transferId}</h3>
                  <div className="status-badge" style={{ backgroundColor: getStatusColor(transferDetails.status) }}>
                    {transferDetails.status}
                  </div>
                </div>
                
                <div className="transfer-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label"><FiHome className="inline-icon" /> Property ID:</span>
                      <span className="info-value">{transferDetails.propertyId}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label"><FiUser className="inline-icon" /> Seller:</span>
                      <span className="info-value address">{transferDetails.seller}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label"><FiUser className="inline-icon" /> Buyer:</span>
                      <span className="info-value address">{transferDetails.buyer}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label"><FiShield className="inline-icon" /> Price:</span>
                      <span className="info-value highlight">{transferDetails.price} ETH</span>
                    </div>
                    {transferDetails.broker && transferDetails.broker !== '0x0000000000000000000000000000000000000000' && (
                      <div className="info-item">
                        <span className="info-label"><FiUser className="inline-icon" /> Broker:</span>
                        <span className="info-value address">{transferDetails.broker}</span>
                      </div>
                    )}
                    <div className="info-item">
                      <span className="info-label"><FiClock className="inline-icon" /> Created:</span>
                      <span className="info-value">{new Date(transferDetails.createdAt * 1000).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="documents-section">
                    {transferDetails.documentsHash && (
                      <div className="document-item">
                        <p><strong><FiFileText className="inline-icon" /> Seller Documents:</strong></p>
                        {transferDetails.documentsHash.startsWith('QmMock') ? (
                          <a
                            href={`${API_URL}/documents/${transferDetails.documentsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-link"
                          >
                            <FiFileText className="btn-icon" /> View Seller Documents
                            <small style={{ display: 'block', marginTop: '5px', fontSize: '0.85em', opacity: 0.8 }}>
                              (Stored locally - IPFS not configured)
                            </small>
                          </a>
                        ) : (
                          <a
                            href={`https://ipfs.io/ipfs/${transferDetails.documentsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="document-link"
                          >
                            <FiFileText className="btn-icon" /> View Seller Documents on IPFS
                          </a>
                        )}
                      </div>
                    )}
                    {transferDetails.buyerDocumentsHash && (
                      <div className="document-item">
                        <p><strong><FiFileText className="inline-icon" /> Buyer Documents:</strong></p>
                        <a
                          href={transferDetails.buyerDocumentsHash.startsWith('QmMock') 
                            ? `${API_URL}/documents/${transferDetails.buyerDocumentsHash}`
                            : `https://ipfs.io/ipfs/${transferDetails.buyerDocumentsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          <FiFileText className="btn-icon" /> View Buyer Documents
                          {transferDetails.buyerDocumentsHash.startsWith('QmMock') && (
                            <small style={{ display: 'block', marginTop: '5px', fontSize: '0.85em', opacity: 0.8 }}>
                              (Stored locally - IPFS not configured)
                            </small>
                          )}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="verification-status">
                  <h4><FiCheckCircle className="section-icon" /> Verification Status</h4>
                  <div className="verification-grid">
                    <div className={`verification-item ${transferDetails.brokerVerified ? 'verified' : 'pending'}`}>
                      {transferDetails.brokerVerified ? <FiCheckCircle className="verification-icon verified-icon" /> : <FiClock className="verification-icon pending-icon" />}
                      <div>
                        <strong>Broker</strong>
                        <p>{transferDetails.brokerVerified ? 'Verified' : 'Pending'}</p>
                      </div>
                    </div>
                    <div className={`verification-item ${transferDetails.registrarVerified ? 'verified' : 'pending'}`}>
                      {transferDetails.registrarVerified ? <FiCheckCircle className="verification-icon verified-icon" /> : <FiClock className="verification-icon pending-icon" />}
                      <div>
                        <strong>Registrar</strong>
                        <p>{transferDetails.registrarVerified ? 'Verified' : 'Pending'}</p>
                      </div>
                    </div>
                    <div className={`verification-item ${transferDetails.municipalApproved ? 'verified' : 'pending'}`}>
                      {transferDetails.municipalApproved ? <FiCheckCircle className="verification-icon verified-icon" /> : <FiClock className="verification-icon pending-icon" />}
                      <div>
                        <strong>Municipal</strong>
                        <p>{transferDetails.municipalApproved ? 'Approved' : 'Pending'}</p>
                      </div>
                    </div>
                    <div className={`verification-item ${transferDetails.buyerAccepted ? 'verified' : 'pending'}`}>
                      {transferDetails.buyerAccepted ? <FiCheckCircle className="verification-icon verified-icon" /> : <FiClock className="verification-icon pending-icon" />}
                      <div>
                        <strong>Buyer</strong>
                        <p>{transferDetails.buyerAccepted ? 'Accepted' : 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-based actions */}
                <div className="transfer-actions">
                  <div className="action-notes">
                    {userRole === 'Broker' && 
                     transferDetails.status === 'Initiated' && 
                     transferDetails.broker.toLowerCase() === account.toLowerCase() && (
                      <div className="action-card">
                        <p className="action-note">🤝 <strong>Your Action Required:</strong> Verify this transaction as the assigned broker.</p>
                        <button
                          onClick={() => handleAction('brokerVerify', transferDetails.transferId)}
                          disabled={loading}
                          className="action-btn broker-btn"
                        >
                          ✓ Verify as Broker
                        </button>
                      </div>
                    )}
                    
                    {userRole === 'Registrar' && 
                     transferDetails.status === 'BrokerVerified' && (
                      <div className="action-card">
                        <p className="action-note">📋 <strong>Your Action Required:</strong> Verify documents and ownership as Registrar.</p>
                        <button
                          onClick={() => handleAction('registrarVerify', transferDetails.transferId)}
                          disabled={loading}
                          className="action-btn registrar-btn"
                        >
                          ✓ Verify as Registrar
                        </button>
                      </div>
                    )}
                    
                    {userRole === 'Municipal' && 
                     transferDetails.status === 'RegistrarVerified' && (
                      <div className="action-card">
                        <p className="action-note">🏛️ <strong>Your Action Required:</strong> Grant final approval as Municipal office.</p>
                        <button
                          onClick={() => handleAction('municipalApprove', transferDetails.transferId)}
                          disabled={loading}
                          className="action-btn municipal-btn"
                        >
                          ✓ Approve as Municipal
                        </button>
                      </div>
                    )}
                    
                    {userRole === 'Buyer' && 
                     transferDetails.status === 'MunicipalApproved' &&
                     transferDetails.buyer.toLowerCase() === account.toLowerCase() && (
                      <div className="action-card">
                        <p className="action-note">👤 <strong>Your Action Required:</strong> Accept the transfer and upload your acceptance documents.</p>
                        <BuyerAcceptForm
                          transferId={transferDetails.transferId}
                          onAccept={handleAction}
                          uploadFile={uploadFile}
                          loading={loading}
                        />
                      </div>
                    )}
                    
                    {userRole === 'Seller' && 
                     transferDetails.seller.toLowerCase() === account.toLowerCase() &&
                     transferDetails.status !== 'Completed' &&
                     transferDetails.status !== 'Cancelled' && (
                      <div className="action-card">
                        <p className="action-note">⚠️ <strong>You can cancel this transfer</strong> before it's completed.</p>
                        <button
                          onClick={() => handleAction('cancel', transferDetails.transferId)}
                          disabled={loading}
                          className="action-btn cancel-btn"
                        >
                          ✗ Cancel Transfer
                        </button>
                      </div>
                    )}

                    {transferDetails.status === 'Completed' && (
                      <div className="success-message">
                        <FiCheckCircle className="success-icon" />
                        <div>
                          <strong>Transfer Completed!</strong>
                          <p>Property ownership has been transferred on the blockchain.</p>
                        </div>
                      </div>
                    )}

                    {transferDetails.status === 'Cancelled' && (
                      <div className="cancelled-message">
                        <FiXCircle className="cancelled-icon" />
                        <div>
                          <strong>Transfer Cancelled</strong>
                          <p>This transfer has been cancelled by the seller.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Buyer Accept Form Component
function BuyerAcceptForm({ transferId, onAccept, uploadFile, loading }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    await onAccept('buyerAccept', transferId, file);
  };

  return (
    <div className="buyer-accept-form">
      <form onSubmit={handleSubmit} className="accept-form">
        <div className="form-group">
          <label>Upload Acceptance Documents *</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <small>Upload your acceptance documents (e.g., signed acceptance letter, ID proof)</small>
        </div>
        <button type="submit" disabled={loading} className="action-btn accept-btn">
          {loading ? <><FiClock className="btn-icon" /> Processing...</> : <><FiCheckCircle className="btn-icon" /> Accept Transfer & Upload Documents</>}
        </button>
      </form>
    </div>
  );
}

// Register Property Component
function RegisterProperty({ uploadFile, account, userRole }) {
  const [form, setForm] = useState({
    owner: '',
    propertyAddress: '',
    propertyType: 'Residential',
    area: '',
    file: null
  });
  const [loading, setLoading] = useState(false);

  // Auto-fill owner address for sellers
  useEffect(() => {
    if (userRole === 'Seller' && account) {
      // Sellers can only register for themselves
      setForm(prev => ({ ...prev, owner: account }));
    }
  }, [account, userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ipfsHash = await uploadFile(form.file);

      // For sellers, ensure owner is their own address
      const ownerAddress = (userRole === 'Seller') ? account : form.owner;

      const response = await fetch(`${API_URL}/properties/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: ownerAddress,
          propertyAddress: form.propertyAddress,
          propertyType: form.propertyType,
          area: form.area,
          ipfsHash: ipfsHash
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Property registered successfully! Property ID: ' + (data.propertyId || 'N/A'));
        setForm({ 
          owner: (userRole === 'Seller') ? account : '', 
          propertyAddress: '', 
          propertyType: 'Residential', 
          area: '', 
          file: null 
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error registering property: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-property">
      <h2><FiPlus className="section-icon" /> Register New Property</h2>
      {userRole === 'Seller' && (
        <div className="info-banner">
          <FiInfo className="info-icon" />
          <div>
            <strong>As a Seller,</strong> you can register properties for yourself. 
            Owner address is automatically set to your wallet address.
          </div>
        </div>
      )}
      {userRole === 'Registrar' && (
        <div className="info-banner">
          <FiInfo className="info-icon" />
          <div>
            <strong>As Registrar,</strong> you can register properties for any owner. Enter the owner's address below.
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="register-form">
        {userRole === 'Registrar' ? (
          <div className="form-group">
            <label>Owner Address *</label>
            <input
              type="text"
              placeholder="0x..."
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              required
            />
            <small>Enter the Ethereum address of the property owner</small>
          </div>
        ) : (
          <div className="form-group">
            <label>Owner Address (Your Address)</label>
            <input
              type="text"
              placeholder="Owner Address (Your Address)"
              value={account || form.owner}
              disabled
              className="disabled-input"
            />
            <small>Automatically set to your connected wallet address</small>
          </div>
        )}
        <div className="form-group">
          <label>Property Address *</label>
          <input
            type="text"
            placeholder="Enter full property address"
            value={form.propertyAddress}
            onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Property Type *</label>
          <select
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
          >
            <option value="Residential">🏠 Residential</option>
            <option value="Commercial">🏢 Commercial</option>
            <option value="Agricultural">🌾 Agricultural</option>
            <option value="Industrial">🏭 Industrial</option>
          </select>
        </div>
        <div className="form-group">
          <label>Area (sq ft) *</label>
          <input
            type="number"
            placeholder="Enter area in square feet"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Property Documents (Deed/Title) *</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            required
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <small>Upload property deed, title, or ownership documents</small>
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <><FiClock className="btn-icon" /> Processing...</> : <><FiCheckCircle className="btn-icon" /> Register Property</>}
        </button>
      </form>
    </div>
  );
}

export default App;

