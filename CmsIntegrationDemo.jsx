import React, { useState, useEffect, useRef } from 'react';

const CmsIntegrationDemo = () => {
  // State management
  const [userId, setUserId] = useState('e2e384a5-c08d-40d1-bdb1-15832cfb272f');
  const [userEmail, setUserEmail] = useState('admin@admin.example.com');
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const [workspaceId, setWorkspaceId] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [cmsStatus, setCmsStatus] = useState({ message: '', type: '' });

  // Refs for iframes
  const projectsIframeRef = useRef(null);
  const builderIframeRef = useRef(null);

  // Demo JWT token
  const demoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMmUzODRhNS1jMDhkLTQwZDEtYmRiMS0xNTgzMmNmYjI3MmYiLCJlbWFpbCI6ImFkbWluQGFkbWluLmV4YW1wbGUuY29tIiwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IlVzZXIiLCJpYXQiOjE3NjIzNjM1ODAsImV4cCI6MTc2Mjk2ODM4MH0.NC8rNWe50_82qcEscOwCbAFrDAnIysFIwCiSHCmAkb4';

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Show status message
  const showStatus = (message, type) => {
    setStatus({ message, type });
  };

  // Show CMS status message
  const showCmsStatus = (message, type) => {
    setCmsStatus({ message, type });
  };

  // Load projects list in iframe
  const loadProjectsList = (token, workspaceId) => {
    if (projectsIframeRef.current && token) {
      let projectsUrl;
      if (workspaceId) {
        // If workspaceId is provided, use the specific workspace projects path
        projectsUrl = `http://localhost:3003/workspaces/${workspaceId}?token=${token}#tab=projects`;
      } else {
        // Otherwise use the default projects path
        projectsUrl = `http://localhost:3003/?token=${token}`;
      }
      projectsIframeRef.current.src = projectsUrl;

      setShowProjects(true);
      setShowBuilder(false);

      console.log(`Loading projects list with URL: ${projectsUrl}`);
    }
  };

  // Open specific project in builder
  const openProjectInBuilder = (projectId, token) => {
    if (builderIframeRef.current && token) {
      const projectUrl = `http://localhost:3003/projects/${projectId}?token=${token}`;
      builderIframeRef.current.src = projectUrl;

      setShowBuilder(true);
      setShowProjects(false);

      showStatus(`Opening project "${projectId}" in Plasmic Builder...`, 'success');

      console.log(`Opening project with URL: ${projectUrl}`);
    }
  };

  // Open project in builder with URL
  const openProjectInBuilderWithUrl = (projectUrl, projectId) => {
    if (builderIframeRef.current) {
      builderIframeRef.current.src = projectUrl;

      setShowBuilder(true);
      setShowProjects(false);

      showStatus(`Opening project "${projectId}" in Plasmic Builder...`, 'success');

      console.log(`Opening project with URL: ${projectUrl}`);
    }
  };

  // Handle authentication
  const handleAuthenticate = async () => {
    if (!userId || !userEmail) {
      showStatus('User ID and Email are required!', 'error');
      return;
    }

    if (!isValidEmail(userEmail)) {
      showStatus('Please enter a valid email address!', 'error');
      return;
    }

    showStatus('Authenticating and generating token...', 'success');

    try {
      // In a real implementation, you would call your CMS backend to generate the token
      console.log('In a real implementation, this would call your CMS backend to generate a JWT token');

      // Uncomment this section when you have your backend API set up:
      const response = await fetch('http://localhost:3004/api/v1/cms-integration/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test_cms_api_key_12345' // Default test API key
        },
        body: JSON.stringify({
          user_id: userId,
          tenant_id: "default_tenant", // Adding required tenant_id
          email: userEmail,
          firstName,
          lastName,
          workspace_id: workspaceId // Adding workspace_id if provided
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setToken(data.token);
      setShowToken(true);

      // Load the projects list iframe with the generated token and workspace ID
      loadProjectsList(data.token, workspaceId);

      showStatus('Successfully authenticated! Loading your projects...', 'success');
      /*
      // For fallback, uncomment this section if the API is not working
      // Load the projects list with demo token and workspace ID
      loadProjectsList(demoToken, workspaceId);

      showStatus('Successfully authenticated! Loading your projects...', 'success');
      */
    } catch (error) {
      console.error('Authentication error:', error);
      showStatus(`Authentication failed: ${error.message}`, 'error');
      setShowProjects(false);
      setShowBuilder(false);
    }
  };

  // Handle opening specific projects from CMS
  const handleOpenPlasmicBtn = (projectId, buttonName) => {
    const tokenToUse = token || demoToken;
    const projectName = buttonName === 'Home' ? 'Home Page' : 'About Page';

    showCmsStatus(`Opening ${projectName} in Plasmic Builder with token...`, 'success');

    if (!tokenToUse) {
      showCmsStatus('No token available. Please authenticate first using the form above.', 'error');
      return;
    }

    setTimeout(() => {
      let plasmicUrl;
      if (workspaceId) {
        // If workspaceId is provided, direct to the specific project within the workspace
        plasmicUrl = `http://localhost:3003/workspaces/${workspaceId}/projects/${projectId}?token=${tokenToUse}#tab=projects`;
      } else {
        // Otherwise, use the general project URL
        plasmicUrl = `http://localhost:3003/projects/${projectId}?token=${tokenToUse}`;
      }
      showCmsStatus(`Generated URL: <a href="${plasmicUrl}" target="_blank">${plasmicUrl}</a>`, 'success');

      console.log(`Opening project with URL: ${plasmicUrl}`);
      console.log(`Token being used: ${tokenToUse}`);

      // For demo purposes, also load it in the builder iframe
      openProjectInBuilderWithUrl(plasmicUrl, projectId);
    }, 1000);
  };

  return (
    <div className="cms-integration-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .cms-integration-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
          padding: 20px;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .demo-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .section-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #eee;
        }

        .auth-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-group label {
          font-weight: 600;
          color: #555;
          font-size: 0.9rem;
        }

        .form-group input {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          width: auto;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .builder-container {
          display: none;
          width: 100%;
          height: 800px;
          border: 2px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .builder-container.active {
          display: block;
        }

        .builder-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .status {
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          display: none;
        }

        .status.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          display: block;
        }

        .status.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
          display: block;
        }

        .instructions {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .instructions h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .instructions ol {
          padding-left: 20px;
        }

        .instructions li {
          margin-bottom: 8px;
          color: #666;
        }

        .token-display {
          background: #f1f3f4;
          padding: 15px;
          border-radius: 6px;
          font-family: monospace;
          word-break: break-all;
          margin: 15px 0;
          display: none;
        }

        .token-display.active {
          display: block;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2rem;
          }

          .demo-section {
            padding: 20px;
          }

          .builder-container {
            height: 600px;
          }
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>🚀 Plasmic CMS Integration Demo</h1>
          <p>Embed the Plasmic Web Builder in your CMS with seamless authentication</p>
        </div>

        <div className="demo-section">
          <h2 className="section-title">📝 Authentication</h2>
          <div className="auth-section">
            <div className="form-group">
              <label htmlFor="userId">User ID:</label>
              <input 
                type="text" 
                id="userId"
                placeholder="Enter user ID (e.g., e2e384a5-c08d-40d1-bdb1-15832cfb272f)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="userEmail">Email:</label>
              <input 
                type="email" 
                id="userEmail"
                placeholder="Enter user email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input 
                type="text" 
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input 
                type="text" 
                id="lastName"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="workspaceId">Workspace ID (Optional):</label>
              <input
                type="text"
                id="workspaceId"
                placeholder="Enter workspace ID to filter projects"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAuthenticate}
              className="btn"
            >
              Generate Token & Load Projects
            </button>
          </div>

          <div className={`status ${status.type}`}>
            {status.message}
          </div>

          <div className={`token-display ${showToken ? 'active' : ''}`}>
            <strong>Generated JWT Token:</strong>
            <div>{token}</div>
          </div>

          <div className="instructions">
            <h3>📋 How This Works:</h3>
            <ol>
              <li>Enter user details from your CMS system</li>
              <li>Click "Generate Token & Load Projects" to authenticate</li>
              <li>The system generates a secure JWT token</li>
              <li>The Plasmic projects list page opens in the embedded view below</li>
              <li>User is automatically logged in and can access their projects</li>
              <li>Use the "Create New Project" button above to start a new project</li>
            </ol>
          </div>
        </div>

        {/* Projects List iFrame Section */}
        <div className="demo-section">
          <h2 className="section-title">📊 Plasmic Projects List</h2>
          <div className={`builder-container ${showProjects ? 'active' : ''}`} style={{ height: '700px' }}>
            <iframe 
              ref={projectsIframeRef}
              className="builder-iframe"
              src="" 
              title="Plasmic Projects List"
            ></iframe>
          </div>
          <p style={{ marginTop: '15px', color: '#666', fontStyle: 'italic' }}>
            This iframe embeds the Plasmic projects list page directly. After authentication, the projects will load automatically.
          </p>
        </div>

        {/* Project Detail iFrame Section */}
        <div className={`builder-container ${showBuilder ? 'active' : ''}`} style={{ marginTop: '30px' }}>
          <iframe 
            ref={builderIframeRef}
            className="builder-iframe"
            src="" 
            title="Plasmic Web Builder"
          ></iframe>
        </div>

        {/* Projects Actions Section */}
        <div className="demo-section">
          <h2 className="section-title">🎯 Project Actions</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button 
              onClick={() => {
                if (projectsIframeRef.current && token) {
                  // Focus on the projects iframe so user can see the new project button
                  loadProjectsList(token, workspaceId);
                  showStatus('Projects page reloaded. Look for "New Project" button in the embedded view.', 'success');
                } else {
                  showStatus('Please authenticate first to create projects.', 'error');
                }
              }}
              className="btn"
              style={{ flex: '1', minWidth: '200px' }}
            >
              📁 View All Projects
            </button>
            
            <button 
              onClick={() => {
                if (token) {
                  // Create a new project by navigating to the new project creation page
                  // The URL pattern for creating a new project in Plasmic is typically the main page
                  // where the "New Project" button exists
                  if (projectsIframeRef.current) {
                    let newProjectUrl;
                    if (workspaceId) {
                      // If workspaceId is provided, use the specific workspace path
                      newProjectUrl = `http://localhost:3003/workspaces/${workspaceId}?token=${token}#tab=projects`;
                    } else {
                      // Otherwise use the default projects path
                      newProjectUrl = `http://localhost:3003/?token=${token}`;
                    }
                    projectsIframeRef.current.src = newProjectUrl;
                    
                    setShowProjects(true);
                    setShowBuilder(false);
                    
                    showStatus('Projects page loaded. Click "New Project" in the embedded view to create a project.', 'success');
                    console.log(`Loading projects page for new project creation with URL: ${newProjectUrl}`);
                  }
                } else {
                  showStatus('Please authenticate first to create projects.', 'error');
                }
              }}
              className="btn"
              style={{ flex: '1', minWidth: '200px', background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}
            >
              ➕ Create New Project
            </button>
            
            <button 
              onClick={() => {
                if (token) {
                  // Show the projects iframe if not already visible
                  if (!showProjects) {
                    loadProjectsList(token, workspaceId);
                  }
                  showStatus('Projects list is now visible. Manage your projects in the embedded view below.', 'success');
                } else {
                  showStatus('Please authenticate first to view projects.', 'error');
                }
              }}
              className="btn"
              style={{ flex: '1', minWidth: '200px', background: 'linear-gradient(135deg, #2196F3, #1976D2)' }}
            >
              📋 Manage Projects
            </button>
          </div>
        </div>

        {/* CMS Integration Example Section */}
        <div className="demo-section">
          <h2 className="section-title">🛠️ CMS Integration Example</h2>
          <div className="cms-integration-content">
            <p style={{ marginBottom: '20px', color: '#666' }}>
              This demonstrates how to integrate Plasmic into your CMS. When a user clicks to edit a page in your CMS,
              you can use the token to automatically authenticate them in Plasmic.
            </p>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>Example: Your CMS Page Editor</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ color: '#555', marginBottom: '10px' }}>Page: Home Page</h4>
                  <p style={{ color: '#777', marginBottom: '15px' }}>This page is connected to Plasmic project: tH77ekFNugan8Yv3d3xJez</p>
                  <button 
                    onClick={() => handleOpenPlasmicBtn('tH77ekFNugan8Yv3d3xJez', 'Home')}
                    className="btn"
                    style={{ width: '100%' }}
                  >
                    ✏️ Edit in Plasmic Builder
                  </button>
                </div>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h4 style={{ color: '#555', marginBottom: '10px' }}>Page: About Page</h4>
                  <p style={{ color: '#777', marginBottom: '15px' }}>This page is connected to Plasmic project: gmeH6XgPaBtkt51HunAo4g</p>
                  <button 
                    onClick={() => handleOpenPlasmicBtn('gmeH6XgPaBtkt51HunAo4g', 'About')}
                    className="btn"
                    style={{ width: '100%' }}
                  >
                    ✏️ Edit in Plasmic Builder
                  </button>
                </div>
              </div>
            </div>

            <div className={`status ${cmsStatus.type}`} style={{ marginTop: '15px' }}>
              <div dangerouslySetInnerHTML={{ __html: cmsStatus.message }} />
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4fd', borderRadius: '6px' }}>
              <h4 style={{ color: '#1a73e8', marginBottom: '10px' }}>How This Works in Your CMS:</h4>
              <ol style={{ paddingLeft: '20px', color: '#333' }}>
                <li style={{ marginBottom: '8px' }}>User clicks "Edit in Plasmic" in your CMS</li>
                <li style={{ marginBottom: '8px' }}>Your CMS backend calls Plasmic's token generation API</li>
                <li style={{ marginBottom: '8px' }}>Plasmic returns a JWT token for the authenticated user</li>
                <li style={{ marginBottom: '8px' }}>Your CMS constructs the URL: <code>http://localhost:3003/p/{{projectId}}?token={{jwtToken}}</code></li>
                <li>User is automatically logged in to Plasmic and taken to the specific project</li>
              </ol>
            </div>

            <div style={{ marginTop: '15px', padding: '15px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '6px' }}>
              <h4 style={{ color: '#856404', marginBottom: '10px' }}>💡 Important Notes:</h4>
              <ul style={{ paddingLeft: '20px', color: '#856404' }}>
                <li style={{ marginBottom: '8px' }}>The JWT token authenticates the user automatically in Plasmic</li>
                <li style={{ marginBottom: '8px' }}>If the studio appears blank, it may be due to an auth issue or an invalid token</li>
                <li style={{ marginBottom: '8px' }}>Make sure your backend API key is correctly configured</li>
                <li style={{ marginBottom: '8px' }}>The token has a 7-day expiration time</li>
                <li style={{ marginBottom: '8px' }}>For production, ensure proper HTTPS and security measures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsIntegrationDemo;