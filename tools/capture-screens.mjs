// One capture workflow, maintained beside the app and its demo fixture.
// Run from any directory; NIVOLO_SITE_PATH/CHROME_PATH can override defaults.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const app = fileURLToPath(new URL('../../pebble-app/', import.meta.url));
execFileSync('npm', ['run', 'website:screens'], { cwd: app, stdio: 'inherit' });
