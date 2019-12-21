function on(msg, callback) {
  if (msg === 'agent-update') {
    callback(
      {},
      {
        online: true,
        name: 'Example',
        host: 'Nikolays-MacBook-Pro.local',
        port: 8080,
      },
    );
  }
}
function send(msg) {
  console.log(`IPC message: ${msg} sent`);
}

if (!window.require) {
  window.require = moduleName => {
    if (moduleName === 'electron') {
      return {
        ipcRenderer: {
          on,
          send,
        },
      };
    }
    return null;
  };
}
