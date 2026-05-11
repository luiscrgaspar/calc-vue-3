const { spawn } = require('child_process');

const COMMAND = process.execPath;
const ARGS = [
  'node_modules/@vue/cli-service/bin/vue-cli-service.js',
  'test:unit',
  '--runInBand',
  'tests/unit/visual.smoke.spec.ts',
];

function run() {
  const extraArgs = process.argv.includes('--update-snapshots')
    ? ['--updateSnapshot']
    : [];

  const child = spawn(COMMAND, [...ARGS, ...extraArgs], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });

  child.on('error', (error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

run();
