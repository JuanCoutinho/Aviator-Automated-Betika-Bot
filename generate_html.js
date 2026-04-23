const fs = require('fs');

const jsxContent = fs.readFileSync('LandingPage.jsx', 'utf8');

// Remove imports and export default
let processedJsx = jsxContent.replace(/import React.*?from 'react';/, 'const { useState, useEffect, useRef, useCallback } = React;');
processedJsx = processedJsx.replace(/export default function App\(\)/, 'function App()');

const htmlContent = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tropa do Sheik</title>
  <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
${processedJsx}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;

fs.writeFileSync('public/index.html', htmlContent);
console.log('HTML gerado em public/index.html');
