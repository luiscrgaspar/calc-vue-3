const { spawn } = require('child_process');

const SERVER_URL = 'http://127.0.0.1:8080/';
const SERVER_COMMAND = process.execPath;
const SERVER_ARGS = [
  'node_modules/@vue/cli-service/bin/vue-cli-service.js',
  'serve',
  '--host',
  '127.0.0.1',
  '--port',
  '8080',
  '--no-progress',
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs, serverProcess) {
  const startedAt = Date.now();
  let failure = null;

  const handleFailure = (error) => {
    if (!failure) {
      failure = error;
    }
  };

  serverProcess.once('error', handleFailure);
  serverProcess.once('exit', (code, signal) => {
    if (code === 0) return;

    const details =
      code !== null
        ? `exit code ${code}`
        : `signal ${signal || 'unknown'}`;
    handleFailure(new Error(`Dev server exited before ready (${details})`));
  });

  while (Date.now() - startedAt < timeoutMs) {
    if (failure) throw failure;

    let timer;
    try {
      const controller = new AbortController();
      timer = setTimeout(() => controller.abort(), 2_000);
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      if (response.ok) return;
    } catch (error) {
      // Keep polling until the dev server comes up.
    } finally {
      if (timer) clearTimeout(timer);
    }

    await wait(250);
  }

  throw new Error(`Timed out waiting for dev server at ${url}`);
}

function spawnProcess(command, args, options) {
  return spawn(command, args, options);
}

async function main() {
  const playwrightArgs = process.argv.slice(2);
  const server = spawnProcess(SERVER_COMMAND, SERVER_ARGS, {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  const stopServer = () => {
    if (!server.killed) {
      server.kill();
    }
  };

  process.on('exit', stopServer);
  process.on('SIGINT', () => {
    stopServer();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    stopServer();
    process.exit(143);
  });

  try {
    await waitForServer(SERVER_URL, 120_000, server);

    const playwright = spawnProcess(
      process.execPath,
      ['node_modules/playwright/cli.js', 'test', ...playwrightArgs],
      {
        cwd: process.cwd(),
        env: process.env,
        stdio: 'inherit',
      }
    );

    const exitCode = await new Promise((resolve, reject) => {
      playwright.on('error', reject);
      playwright.on('exit', (code) => resolve(code ?? 1));
    });

    process.exitCode = exitCode;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    stopServer();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
