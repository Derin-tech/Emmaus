const fs = require('fs');
const path = require('path');

['HomePage.tsx', 'SelectionPage.tsx', 'AboutPage.tsx', 'ContactPage.tsx'].forEach(f => {
  let p = path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity-ide', 'scratch', 'ajeshsir', 'src', 'pages', f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/from '\.\/PremiumCard'/g, "from '../components/PremiumCard'");
  fs.writeFileSync(p, c);
});
console.log('Fixed imports in pages');
