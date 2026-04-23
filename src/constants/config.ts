const Config = {
  // Microsoft Business Central
  businessCentral: {
    baseUrl: 'https://api.businesscentral.dynamics.com/v2.0',
    tenantId: 'YOUR_TENANT_ID',
    environment: 'production',
    companyId: 'YOUR_COMPANY_ID',
  },

  // SharePoint
  sharePoint: {
    siteUrl: 'https://YOUR_TENANT.sharepoint.com/sites/ENV-Control',
    documentLibrary: 'EmissionDocuments',
    clientId: 'YOUR_SHAREPOINT_CLIENT_ID',
  },

  // Azure Document Intelligence
  documentIntelligence: {
    endpoint: 'https://YOUR_RESOURCE.cognitiveservices.azure.com',
    apiKey: 'YOUR_ADI_API_KEY',
    modelId: 'prebuilt-invoice',
  },

  // Firebase
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },

  // Auth
  auth: {
    clientId: 'YOUR_AUTH_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'envcontrol://auth/callback',
    scopes: [
      'https://api.businesscentral.dynamics.com/.default',
      'Sites.ReadWrite.All',
    ],
  },

  // Demo credentials
  demo: {
    email: 'demo@envcontrol.com',
    password: 'demo123',
  },

  // App
  app: {
    name: 'ENV-Control',
    version: '1.0.0',
  },
};

export default Config;
