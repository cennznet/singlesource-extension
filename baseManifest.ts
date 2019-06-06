module.exports = {
  manifest_version: 2,
  name: 'SingleSource Extension',

  description: 'SingleSource browser extension',

  icons: {
    '16': 'images/icon-16.png',
    '128': 'images/icon-128.png'
  },

  browser_action: {
    browser_style: true,
    default_icon: {
      '19': 'images/icon-19.png',
      '38': 'images/icon-38.png'
    },
    default_title: 'SingleSource Extension',
    default_popup: 'index.html'
  },

  permissions: [
    'tabs',
    'activeTab',
    'webRequest',
    'notifications',
    'storage',
    'clipboardWrite'
  ],

  content_scripts: [
    {
      matches: ['file://*/*', 'http://*/*', 'https://*/*'],
      js: ['contentScript.js'],
      run_at: 'document_start',
      all_frames: true
    }
  ],
  web_accessible_resources: ['singleSource.js'],

  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",

  background: {
    scripts: ['background.js'],
    persistent: true
  }
};
