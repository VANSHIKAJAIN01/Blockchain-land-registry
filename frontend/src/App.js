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
  FiCheck,
  FiBell
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
  const [notifications, setNotifications] = useState([]);
  const [balance, setBalance] = useState('0.0');

  // Load wallet balance
  const loadBalance = async (address, providerInstance) => {
    try {
      if (providerInstance && address) {
        console.log('Loading balance for:', address);
        const balance = await providerInstance.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        console.log('Balance loaded:', formattedBalance, 'ETH');
        setBalance(formattedBalance);
      } else {
        console.warn('Cannot load balance: provider or address missing', { providerInstance: !!providerInstance, address });
        setBalance('0.0');
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance('0.0');
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        setProvider(providerInstance);
        await loadBalance(accounts[0], providerInstance);
        await loadUserRole(accounts[0]);
        await loadUserProperties(accounts[0]);
        
        // Check for pending actions for all roles
        await checkRolePendingActions(accounts[0]);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', async (newAccounts) => {
          if (newAccounts.length > 0) {
            setAccount(newAccounts[0]);
            await loadBalance(newAccounts[0], providerInstance);
            await loadUserRole(newAccounts[0]);
            await loadUserProperties(newAccounts[0]);
            await checkRolePendingActions(newAccounts[0]);
          } else {
            // User disconnected
            setAccount('');
            setUserRole('');
            setProperties([]);
            setBalance('0.0');
          }
        });

        // Listen for balance changes (when transactions occur)
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
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

  // Check for pending actions for all roles
  const checkRolePendingActions = async (address) => {
    try {
      const roleResponse = await fetch(`${API_URL}/users/${address}/role`);
      if (roleResponse.ok) {
        const roleData = await roleResponse.json();
        const role = roleData.role;
        
        // Show role-specific notifications
        switch (role) {
          case 'Broker':
            addNotification('🔔 As a Broker, you can verify transfers assigned to you. Use the "View Transfer" feature to find transfers that need your verification.', 'info');
            break;
          case 'Registrar':
            addNotification('🔔 As a Registrar, you can verify transfers after broker verification. Use the "View Transfer" feature to find transfers that need your verification.', 'info');
            break;
          case 'Municipal':
            addNotification('🔔 As Municipal, you can approve transfers after registrar verification. Use the "View Transfer" feature to find transfers that need your approval.', 'info');
            break;
          case 'Buyer':
            addNotification('🔔 As a Buyer, you can accept transfers after municipal approval. Use the "View Transfer" feature to find transfers assigned to you.', 'info');
            break;
          case 'Seller':
            addNotification('🔔 As a Seller, you can initiate transfers and register properties. Use the "Transfers" tab to start a transfer or "Register Property" to add properties.', 'info');
            break;
          default:
            break;
        }
      }
    } catch (error) {
      // Silently fail - not critical
      console.log('Could not check role status:', error);
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

  // Notification system
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="App">
      {/* Notification Container */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div key={notification.id} className={`notification notification-${notification.type}`}>
            <div className="notification-content">
              {notification.type === 'success' && <FiCheckCircle className="notification-icon" />}
              {notification.type === 'error' && <FiXCircle className="notification-icon" />}
              {notification.type === 'info' && <FiInfo className="notification-icon" />}
              {notification.type === 'warning' && <FiBell className="notification-icon" />}
              <span>{notification.message}</span>
            </div>
            <button 
              className="notification-close" 
              onClick={() => removeNotification(notification.id)}
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>

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
              <div className="wallet-balance-section" style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                <div className="balance-info">
                  <span className="balance-label">Balance</span>
                  <div className="balance-value-container">
                    <span className="balance-value">{parseFloat(balance).toFixed(4)} ETH</span>
                    <button 
                      onClick={() => loadBalance(account, provider)} 
                      className="refresh-balance-btn" 
                      title="Refresh balance"
                      style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' }}
                    >
                      <FiRefreshCw style={{ fontSize: '0.9rem' }} />
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
                balance={balance}
                onTabChange={setActiveTab}
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
                addNotification={addNotification}
              />
            )}
            {activeTab === 'register' && (userRole === 'Registrar' || userRole === 'Seller') && (
              <RegisterProperty 
                uploadFile={uploadFile} 
                account={account} 
                userRole={userRole}
                onPropertyRegistered={() => loadUserProperties(account)}
              />
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
function Dashboard({ account, userRole, properties, balance, onTabChange }) {
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
          <h3>Wallet Balance</h3>
          <p className="stat-value">{parseFloat(balance || '0').toFixed(4)} ETH</p>
          <p className="stat-label">{account.substring(0, 6)}...{account.substring(38)}</p>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          {(userRole === 'Registrar' || userRole === 'Seller') && (
            <div className="quick-action-card" onClick={() => onTabChange('register')}>
              <FiPlus className="action-icon" />
              <h4>Register Property</h4>
              <p>Add a new property to the registry</p>
            </div>
          )}
          {userRole === 'Seller' && (
            <div className="quick-action-card" onClick={() => onTabChange('transfers')}>
              <FiRefreshCw className="action-icon" />
              <h4>Initiate Transfer</h4>
              <p>Start a property transfer process</p>
            </div>
          )}
          <div className="quick-action-card" onClick={() => onTabChange('properties')}>
            <FiSearch className="action-icon" />
            <h4>Search Properties</h4>
            <p>Find properties by ID</p>
          </div>
          <div className="quick-action-card" onClick={() => onTabChange('transfers')}>
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
function Transfers({ account, userRole, uploadFile, provider, onPropertiesUpdate, addNotification }) {
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loadingTx, setLoadingTx] = useState(false);
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
  // Always use Backend API (no checkbox needed)
  const useBackendAPI = true;
  
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
          broker: transferForm.broker,
          documentsHash: ipfsHash
        })
      });

      const data = await response.json();
      if (data.success) {
        const message = `Transfer initiated successfully! Transfer ID: ${data.transferId}`;
        alert(message);
        addNotification(message, 'success');
        
        // Notify broker if broker address is provided
        if (transferForm.broker) {
          addNotification(`Broker ${transferForm.broker.substring(0, 10)}... has been notified to verify this transfer.`, 'info');
        }
        
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

  const handleAction = async (action, transferId, file = null, reason = null) => {
    // Always use backend API
    return handleActionViaBackend(action, transferId, file, reason);
  };

  // Handle actions via backend API (no MetaMask popup)
  const handleActionViaBackend = async (action, transferId, file = null, reason = null) => {
    setLoading(true);
    try {
      let endpoint = '';
      let formData = null;
      let body = null;
      
      switch (action) {
        case 'brokerVerify':
          endpoint = `${API_URL}/transfers/${transferId}/broker-verify`;
          break;
        case 'brokerReject':
          endpoint = `${API_URL}/transfers/${transferId}/broker-reject`;
          if (reason) {
            body = JSON.stringify({ reason: reason });
          }
          break;
        case 'registrarVerify':
          endpoint = `${API_URL}/transfers/${transferId}/registrar-verify`;
          break;
        case 'registrarReject':
          endpoint = `${API_URL}/transfers/${transferId}/registrar-reject`;
          if (reason) {
            body = JSON.stringify({ reason: reason });
          }
          break;
        case 'municipalApprove':
          endpoint = `${API_URL}/transfers/${transferId}/municipal-approve`;
          break;
        case 'municipalReject':
          endpoint = `${API_URL}/transfers/${transferId}/municipal-reject`;
          if (reason) {
            body = JSON.stringify({ reason: reason });
          }
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
        headers: {}
      };
      
      if (formData) {
        // FormData - don't set Content-Type, browser will set it with boundary
        options.body = formData;
      } else if (body) {
        // JSON body for rejections
        options.headers['Content-Type'] = 'application/json';
        options.body = body;
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      if (data.success) {
        const txHash = data.transactionHash;
        const successMsg = `✅ Action completed successfully! Transaction Hash: ${txHash || 'N/A'}`;
        alert(successMsg);
        addNotification(successMsg, 'success');
        
        // Store transaction hash and fetch details
        if (txHash && provider) {
          setTransactionHash(txHash);
          await fetchTransactionDetails(txHash, provider);
        }
        
        // Show ETH transfer notification when buyer accepts
        if (action === 'buyerAccept' && transferDetails && transferDetails.seller) {
          const ethAmount = transferDetails.price || '0';
          addNotification(`💰 ETH Transfer: ${ethAmount} ETH sent from buyer to seller`, 'success');
          addNotification(`Seller ${transferDetails.seller.substring(0, 10)}... has been notified that the transfer has been completed.`, 'info');
        }
        
        // Notify next role in workflow
        if (action === 'brokerVerify' && transferDetails) {
          addNotification('Registrar has been notified to verify this transfer.', 'info');
        } else if (action === 'registrarVerify' && transferDetails) {
          addNotification('Municipal office has been notified to approve this transfer.', 'info');
        } else if (action === 'municipalApprove' && transferDetails) {
          addNotification(`Buyer ${transferDetails.buyer.substring(0, 10)}... has been notified to accept this transfer.`, 'info');
        }
        
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

  // Fetch transaction details from blockchain
  const fetchTransactionDetails = async (txHash, providerInstance) => {
    if (!txHash || !providerInstance) return;
    
    setLoadingTx(true);
    try {
      const tx = await providerInstance.getTransaction(txHash);
      const receipt = await providerInstance.getTransactionReceipt(txHash);
      const block = await providerInstance.getBlock(receipt.blockNumber);
      
      setTransactionDetails({
        hash: txHash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value || 0),
        gasPrice: ethers.formatUnits(tx.gasPrice || 0, 'gwei'),
        gasLimit: tx.gasLimit.toString(),
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber.toString(),
        confirmations: receipt.confirmations,
        status: receipt.status === 1 ? 'Success' : 'Failed',
        timestamp: new Date(block.timestamp * 1000).toLocaleString(),
        network: (await providerInstance.getNetwork()).name
      });
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      setTransactionDetails(null);
    } finally {
      setLoadingTx(false);
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
      'Cancelled': '#f44336',
      'Rejected': '#d32f2f'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="transfers">
      <h2><FiRefreshCw className="section-icon" /> Property Transfers</h2>
      
      {!viewingTransfer ? (
        <>
          {/* Role Notification Banners */}
          {userRole === 'Broker' && (
            <div className="transfer-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#fff8f0', border: '2px solid #ff9800', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiBell style={{ fontSize: '1.5rem', color: '#ff9800' }} />
                <div>
                  <strong style={{ color: '#333', display: 'block', marginBottom: '0.25rem' }}>
                    🔔 Broker Notification
                  </strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    You have transfers assigned to you that need verification. Use the "View Transfer" section below to enter a Transfer ID and verify transfers where you are the assigned broker.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {userRole === 'Registrar' && (
            <div className="transfer-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#f3e5f5', border: '2px solid #9c27b0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiBell style={{ fontSize: '1.5rem', color: '#9c27b0' }} />
                <div>
                  <strong style={{ color: '#333', display: 'block', marginBottom: '0.25rem' }}>
                    🔔 Registrar Notification
                  </strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    You can verify transfers after broker verification. Use the "View Transfer" section below to enter a Transfer ID and verify transfers that have been broker-verified.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {userRole === 'Municipal' && (
            <div className="transfer-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#fff8f0', border: '2px solid #ff9800', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiBell style={{ fontSize: '1.5rem', color: '#ff9800' }} />
                <div>
                  <strong style={{ color: '#333', display: 'block', marginBottom: '0.25rem' }}>
                    🔔 Municipal Notification
                  </strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    You can approve transfers after registrar verification. Use the "View Transfer" section below to enter a Transfer ID and approve transfers that have been registrar-verified.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {userRole === 'Buyer' && (
            <div className="transfer-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#e3f2fd', border: '2px solid #2196f3', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiBell style={{ fontSize: '1.5rem', color: '#2196f3' }} />
                <div>
                  <strong style={{ color: '#333', display: 'block', marginBottom: '0.25rem' }}>
                    🔔 Buyer Notification
                  </strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    You can accept transfers after municipal approval. Use the "View Transfer" section below to enter a Transfer ID and accept transfers assigned to you that have been approved by municipal.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {userRole === 'Seller' && (
            <div className="transfer-section" style={{ marginBottom: '1rem', padding: '1rem', background: '#e8f5e9', border: '2px solid #4caf50', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiBell style={{ fontSize: '1.5rem', color: '#4caf50' }} />
                <div>
                  <strong style={{ color: '#333', display: 'block', marginBottom: '0.25rem' }}>
                    🔔 Seller Notification
                  </strong>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
                    You can initiate transfers and register properties. Use the form below to initiate a new transfer or go to "Register Property" tab to add new properties.
                  </p>
                </div>
              </div>
            </div>
          )}


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
                  <label>Broker Address *</label>
                  <input
                    type="text"
                    placeholder="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
                    value={transferForm.broker}
                    onChange={(e) => setTransferForm({ ...transferForm, broker: e.target.value })}
                    required
                  />
                  <small>Enter the Ethereum address of the broker (42 characters). Example: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65. Broker verification is required for all transfers.</small>
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
                        <a
                          href={transferDetails.documentsHash.startsWith('QmMock') 
                            ? `${API_URL}/documents/${transferDetails.documentsHash}`
                            : `https://ipfs.io/ipfs/${transferDetails.documentsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="document-link"
                        >
                          <FiFileText className="btn-icon" /> View Documents
                        </a>
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
                          <FiFileText className="btn-icon" /> View Documents
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="verification-status">
                  <h4><FiCheckCircle className="section-icon" /> Verification Status</h4>
                  {transferDetails.status === 'Rejected' ? (
                    <div style={{ 
                      padding: '1rem', 
                      background: '#ffebee', 
                      border: '2px solid #f44336', 
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <FiXCircle style={{ color: '#f44336', fontSize: '1.5rem' }} />
                        <strong style={{ color: '#c62828', fontSize: '1.1rem' }}>Workflow Stopped - Transfer Rejected</strong>
                      </div>
                      {transferDetails.rejectedBy && (
                        <p style={{ margin: '0.5rem 0', color: '#666' }}>
                          Rejected by: <strong>{transferDetails.rejectedBy.substring(0, 10)}...{transferDetails.rejectedBy.substring(38)}</strong>
                        </p>
                      )}
                      {transferDetails.rejectionReason && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '4px', border: '1px solid #ffcdd2' }}>
                          <strong style={{ color: '#c62828', display: 'block', marginBottom: '0.25rem' }}>Reason:</strong>
                          <p style={{ margin: 0, color: '#333' }}>{transferDetails.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div className="verification-grid">
                    {/* Broker Verification */}
                    <div className={`verification-item ${
                      transferDetails.status === 'Rejected' && !transferDetails.brokerVerified
                        ? 'rejected' 
                        : transferDetails.brokerVerified 
                          ? 'verified' 
                          : transferDetails.status === 'Rejected'
                            ? 'blocked' 
                            : 'pending'
                    }`}>
                      {transferDetails.status === 'Rejected' && !transferDetails.brokerVerified ? (
                        <FiXCircle className="verification-icon rejected-icon" />
                      ) : transferDetails.brokerVerified ? (
                        <FiCheckCircle className="verification-icon verified-icon" />
                      ) : transferDetails.status === 'Rejected' ? (
                        <FiX className="verification-icon blocked-icon" />
                      ) : (
                        <FiClock className="verification-icon pending-icon" />
                      )}
                      <div>
                        <strong>Broker</strong>
                        <p>
                          {transferDetails.status === 'Rejected' && !transferDetails.brokerVerified
                            ? 'Rejected' 
                            : transferDetails.brokerVerified 
                              ? 'Verified' 
                              : transferDetails.status === 'Rejected' 
                                ? 'Blocked' 
                                : 'Pending'}
                        </p>
                      </div>
                    </div>
                    {/* Registrar Verification */}
                    <div className={`verification-item ${
                      transferDetails.status === 'Rejected' && transferDetails.brokerVerified && !transferDetails.registrarVerified
                        ? 'rejected'
                        : transferDetails.registrarVerified 
                          ? 'verified' 
                          : transferDetails.status === 'Rejected' || !transferDetails.brokerVerified
                            ? 'blocked' 
                            : 'pending'
                    }`}>
                      {transferDetails.status === 'Rejected' && transferDetails.brokerVerified && !transferDetails.registrarVerified ? (
                        <FiXCircle className="verification-icon rejected-icon" />
                      ) : transferDetails.registrarVerified ? (
                        <FiCheckCircle className="verification-icon verified-icon" />
                      ) : transferDetails.status === 'Rejected' || !transferDetails.brokerVerified ? (
                        <FiX className="verification-icon blocked-icon" />
                      ) : (
                        <FiClock className="verification-icon pending-icon" />
                      )}
                      <div>
                        <strong>Registrar</strong>
                        <p>
                          {transferDetails.status === 'Rejected' && transferDetails.brokerVerified && !transferDetails.registrarVerified
                            ? 'Rejected'
                            : transferDetails.registrarVerified 
                              ? 'Verified' 
                              : transferDetails.status === 'Rejected' || !transferDetails.brokerVerified
                                ? 'Blocked' 
                                : 'Pending'}
                        </p>
                      </div>
                    </div>
                    {/* Municipal Approval */}
                    <div className={`verification-item ${
                      transferDetails.status === 'Rejected' && transferDetails.registrarVerified && !transferDetails.municipalApproved
                        ? 'rejected'
                        : transferDetails.municipalApproved 
                          ? 'verified' 
                          : transferDetails.status === 'Rejected' || !transferDetails.registrarVerified
                            ? 'blocked' 
                            : 'pending'
                    }`}>
                      {transferDetails.status === 'Rejected' && transferDetails.registrarVerified && !transferDetails.municipalApproved ? (
                        <FiXCircle className="verification-icon rejected-icon" />
                      ) : transferDetails.municipalApproved ? (
                        <FiCheckCircle className="verification-icon verified-icon" />
                      ) : transferDetails.status === 'Rejected' || !transferDetails.registrarVerified ? (
                        <FiX className="verification-icon blocked-icon" />
                      ) : (
                        <FiClock className="verification-icon pending-icon" />
                      )}
                      <div>
                        <strong>Municipal</strong>
                        <p>
                          {transferDetails.status === 'Rejected' && transferDetails.registrarVerified && !transferDetails.municipalApproved
                            ? 'Rejected'
                            : transferDetails.municipalApproved 
                              ? 'Approved' 
                              : transferDetails.status === 'Rejected' || !transferDetails.registrarVerified
                                ? 'Blocked' 
                                : 'Pending'}
                        </p>
                      </div>
                    </div>
                    {/* Buyer Acceptance */}
                    <div className={`verification-item ${
                      transferDetails.buyerAccepted 
                        ? 'verified' 
                        : transferDetails.status === 'Rejected' || !transferDetails.municipalApproved
                          ? 'blocked' 
                          : 'pending'
                    }`}>
                      {transferDetails.buyerAccepted ? (
                        <FiCheckCircle className="verification-icon verified-icon" />
                      ) : transferDetails.status === 'Rejected' || !transferDetails.municipalApproved ? (
                        <FiX className="verification-icon blocked-icon" />
                      ) : (
                        <FiClock className="verification-icon pending-icon" />
                      )}
                      <div>
                        <strong>Buyer</strong>
                        <p>
                          {transferDetails.buyerAccepted 
                            ? 'Accepted' 
                            : transferDetails.status === 'Rejected' || !transferDetails.municipalApproved
                              ? 'Blocked' 
                              : 'Pending'}
                        </p>
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
                        <p className="action-note">🤝 <strong>Your Action Required:</strong> Verify or reject this transaction as the assigned broker.</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAction('brokerVerify', transferDetails.transferId)}
                            disabled={loading}
                            className="action-btn broker-btn"
                          >
                            ✓ Verify as Broker
                          </button>
                          <RejectionForm
                            transferId={transferDetails.transferId}
                            onReject={(reason) => handleAction('brokerReject', transferDetails.transferId, null, reason)}
                            loading={loading}
                            role="Broker"
                          />
                        </div>
                      </div>
                    )}
                    
                    {userRole === 'Registrar' && 
                     transferDetails.status === 'BrokerVerified' && (
                      <div className="action-card">
                        <p className="action-note">📋 <strong>Your Action Required:</strong> Verify or reject documents and ownership as Registrar.</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAction('registrarVerify', transferDetails.transferId)}
                            disabled={loading}
                            className="action-btn registrar-btn"
                          >
                            ✓ Verify as Registrar
                          </button>
                          <RejectionForm
                            transferId={transferDetails.transferId}
                            onReject={(reason) => handleAction('registrarReject', transferDetails.transferId, null, reason)}
                            loading={loading}
                            role="Registrar"
                          />
                        </div>
                      </div>
                    )}
                    
                    {userRole === 'Municipal' && 
                     transferDetails.status === 'RegistrarVerified' && (
                      <div className="action-card">
                        <p className="action-note">🏛️ <strong>Your Action Required:</strong> Approve or reject this transfer as Municipal office.</p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleAction('municipalApprove', transferDetails.transferId)}
                            disabled={loading}
                            className="action-btn municipal-btn"
                          >
                            ✓ Approve as Municipal
                          </button>
                          <RejectionForm
                            transferId={transferDetails.transferId}
                            onReject={(reason) => handleAction('municipalReject', transferDetails.transferId, null, reason)}
                            loading={loading}
                            role="Municipal"
                          />
                        </div>
                      </div>
                    )}
                    
                    {userRole === 'Buyer' && 
                     transferDetails.status === 'MunicipalApproved' &&
                     transferDetails.buyer.toLowerCase() === account.toLowerCase() && (
                      <div className="action-card">
                        <p className="action-note">👤 <strong>Your Action Required:</strong> Accept the transfer and upload your acceptance documents.</p>
                        <div className="eth-payment-notice" style={{ marginBottom: '1rem', padding: '1rem', background: 'linear-gradient(135deg, #fff3cd 0%, #ffe082 100%)', borderRadius: '6px', border: '2px solid #ffc107' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <FiShield style={{ fontSize: '1.5rem', color: '#f57c00' }} />
                            <strong style={{ color: '#e65100', fontSize: '1.1rem' }}>💰 ETH Payment Required</strong>
                          </div>
                          <p style={{ margin: '0.5rem 0', color: '#333' }}>
                            You will need to send <strong style={{ color: '#e65100', fontSize: '1.1rem' }}>{transferDetails.price} ETH</strong> to complete this transfer.
                          </p>
                          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '4px', border: '1px solid #ffc107' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                              <strong>How it works:</strong> When you accept, {transferDetails.price} ETH will be deducted from your wallet and automatically transferred to the seller ({transferDetails.seller.substring(0, 8)}...{transferDetails.seller.substring(36)}) through the smart contract.
                            </p>
                          </div>
                        </div>
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
                      <>
                        <div className="success-message">
                          <FiCheckCircle className="success-icon" />
                          <div>
                            <strong>Transfer Completed!</strong>
                            <p>Property ownership has been transferred on the blockchain.</p>
                          </div>
                        </div>
                        
                        {/* ETH Transfer Visualization */}
                        <div className="eth-transfer-section" style={{
                          marginTop: '1.5rem',
                          padding: '1.5rem',
                          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)',
                          border: '2px solid #4caf50',
                          borderRadius: '8px'
                        }}>
                          <h4 style={{ marginBottom: '1rem', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiShield style={{ fontSize: '1.25rem' }} />
                            ETH Transfer Flow
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            {/* Buyer */}
                            <div style={{ flex: '1', minWidth: '150px', textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '6px', border: '2px solid #2196f3' }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👤</div>
                              <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#1976d2' }}>Buyer</strong>
                              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.25rem 0', wordBreak: 'break-all' }}>
                                {transferDetails.buyer.substring(0, 8)}...{transferDetails.buyer.substring(36)}
                              </p>
                              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#ffebee', borderRadius: '4px' }}>
                                <span style={{ color: '#c62828', fontWeight: 'bold' }}>-{transferDetails.price} ETH</span>
                              </div>
                            </div>
                            
                            {/* Arrow */}
                            <div style={{ fontSize: '2rem', color: '#4caf50', fontWeight: 'bold' }}>→</div>
                            
                            {/* Contract */}
                            <div style={{ flex: '1', minWidth: '150px', textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '6px', border: '2px solid #9c27b0' }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔐</div>
                              <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#7b1fa2' }}>Smart Contract</strong>
                              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.25rem 0' }}>
                                PropertyRegistry
                              </p>
                              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f3e5f5', borderRadius: '4px' }}>
                                <span style={{ color: '#7b1fa2', fontWeight: 'bold' }}>Holds {transferDetails.price} ETH</span>
                              </div>
                            </div>
                            
                            {/* Arrow */}
                            <div style={{ fontSize: '2rem', color: '#4caf50', fontWeight: 'bold' }}>→</div>
                            
                            {/* Seller */}
                            <div style={{ flex: '1', minWidth: '150px', textAlign: 'center', padding: '1rem', background: '#fff', borderRadius: '6px', border: '2px solid #4caf50' }}>
                              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏠</div>
                              <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#2e7d32' }}>Seller</strong>
                              <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.25rem 0', wordBreak: 'break-all' }}>
                                {transferDetails.seller.substring(0, 8)}...{transferDetails.seller.substring(36)}
                              </p>
                              <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#e8f5e9', borderRadius: '4px' }}>
                                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>+{transferDetails.price} ETH</span>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff', borderRadius: '4px', border: '1px solid #c8e6c9' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
                              <strong>💰 Total Amount Transferred:</strong> <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>{transferDetails.price} ETH</span>
                            </p>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                              The ETH was automatically transferred from the buyer's wallet to the seller's wallet through the smart contract upon transfer completion.
                            </p>
                          </div>
                        </div>
                        
                        {/* Blockchain Transaction Details */}
                        {transactionHash && (
                          <div className="transaction-details-section" style={{
                            marginTop: '1.5rem',
                            padding: '1.5rem',
                            background: '#f5f5f5',
                            border: '2px solid #667eea',
                            borderRadius: '8px'
                          }}>
                            <h4 style={{ marginBottom: '1rem', color: '#667eea', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <FiShield style={{ fontSize: '1.25rem' }} />
                              Blockchain Transaction Details
                            </h4>
                            
                            {loadingTx ? (
                              <p style={{ textAlign: 'center', color: '#666' }}>Loading transaction details...</p>
                            ) : transactionDetails ? (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Transaction Hash:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', color: '#333' }}>
                                    {transactionDetails.hash}
                                  </p>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(transactionDetails.hash)}
                                    style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                  >
                                    <FiCopy style={{ fontSize: '0.75rem', marginRight: '0.25rem' }} /> Copy
                                  </button>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>From:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', color: '#333' }}>
                                    {transactionDetails.from}
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>To (Contract):</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', color: '#333' }}>
                                    {transactionDetails.to}
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Value:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', color: '#2e7d32', fontWeight: 'bold' }}>
                                    {transactionDetails.value} ETH
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Status:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: transactionDetails.status === 'Success' ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                                    {transactionDetails.status === 'Success' ? '✓ Success' : '✗ Failed'}
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Block Number:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#333' }}>
                                    {transactionDetails.blockNumber}
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Gas Used:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#333' }}>
                                    {transactionDetails.gasUsed} / {transactionDetails.gasLimit}
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Timestamp:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#333' }}>
                                    {transactionDetails.timestamp}
                                  </p>
                                </div>
                                
                                <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '4px' }}>
                                  <strong style={{ color: '#666', fontSize: '0.85rem' }}>Network:</strong>
                                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#333' }}>
                                    {transactionDetails.network} (Local - Free Transactions)
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div style={{ padding: '1rem', background: '#fff', borderRadius: '4px', textAlign: 'center' }}>
                                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Transaction Hash: {transactionHash}</p>
                                <button
                                  onClick={() => fetchTransactionDetails(transactionHash, provider)}
                                  style={{ padding: '0.5rem 1rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Load Transaction Details
                                </button>
                              </div>
                            )}
                            
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e3f2fd', borderRadius: '4px', border: '1px solid #2196f3' }}>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: '#1976d2' }}>
                                <strong>ℹ️ Note:</strong> You're on a local Hardhat network. Transactions are <strong>FREE</strong> (no real ETH needed). 
                                In production on mainnet, you would need real ETH to pay for gas fees (~$5-50 per transaction depending on network congestion).
                              </p>
                            </div>
                          </div>
                        )}
                      </>
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

                    {transferDetails.status === 'Rejected' && (
                      <div className="rejected-message" style={{ padding: '1rem', background: '#ffebee', border: '2px solid #f44336', borderRadius: '8px', marginTop: '1rem' }}>
                        <FiXCircle className="cancelled-icon" style={{ color: '#f44336', fontSize: '2rem' }} />
                        <div>
                          <strong style={{ color: '#c62828', display: 'block', marginBottom: '0.5rem' }}>Transfer Rejected</strong>
                          <p style={{ margin: '0.5rem 0', color: '#666' }}>
                            This transfer has been rejected by {transferDetails.rejectedBy ? `${transferDetails.rejectedBy.substring(0, 10)}...` : 'an authorized party'}.
                          </p>
                          {transferDetails.rejectionReason && (
                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff', borderRadius: '4px', border: '1px solid #ffcdd2' }}>
                              <strong style={{ color: '#c62828', display: 'block', marginBottom: '0.25rem' }}>Reason for Rejection:</strong>
                              <p style={{ margin: 0, color: '#333' }}>{transferDetails.rejectionReason}</p>
                            </div>
                          )}
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

// Rejection Form Component
function RejectionForm({ transferId, onReject, loading, role }) {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    await onReject(reason.trim());
    setShowForm(false);
    setReason('');
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        disabled={loading}
        className="action-btn reject-btn"
        style={{ background: '#f44336', color: 'white' }}
      >
        ✗ Reject Transfer
      </button>
    );
  }

  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ color: '#c62828', fontWeight: 'bold' }}>Reason for Rejection *</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder={`Enter the reason for rejecting this transfer as ${role}...`}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '2px solid #f44336', 
              borderRadius: '4px',
              fontSize: '0.95rem',
              fontFamily: 'inherit'
            }}
          />
          <small style={{ color: '#666' }}>Please provide a clear reason for rejection</small>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="submit" 
            disabled={loading || !reason.trim()} 
            className="action-btn reject-btn"
            style={{ background: '#f44336', color: 'white', flex: 1 }}
          >
            {loading ? <><FiClock className="btn-icon" /> Processing...</> : <><FiXCircle className="btn-icon" /> Submit Rejection</>}
          </button>
          <button 
            type="button"
            onClick={() => {
              setShowForm(false);
              setReason('');
            }}
            disabled={loading}
            className="action-btn"
            style={{ background: '#757575', color: 'white' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Register Property Component
function RegisterProperty({ uploadFile, account, userRole, onPropertyRegistered }) {
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
        // Wait a moment for blockchain transaction to be confirmed, then refresh
        setTimeout(async () => {
          if (onPropertyRegistered) {
            await onPropertyRegistered();
          }
        }, 1000);
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

