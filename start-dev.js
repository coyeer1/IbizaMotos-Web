// Bootstrap: change cwd to 'app' then launch Vite
process.chdir(__dirname + '/app');
if (!process.argv.includes('--port')) {
  process.argv.push('--port', '5173');
}
import('./app/node_modules/vite/bin/vite.js');
