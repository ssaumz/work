const express = require('express');
const { exec } = require('child_process');
const fs = require('fs-extra');
const os = require('os');
const app = express();
const port = 3000;

const browsers = {
  chrome: {
    startCmd: (url) => `start chrome ${url}`,
    stopCmd: `taskkill /IM chrome.exe /F`,
    cleanupCmd: `${os.homedir()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default`,
    getActiveTabCmd: `tasklist /FI "IMAGENAME eq chrome.exe"`
  },
  firefox: {
    startCmd: (url) => `start firefox ${url}`,
    stopCmd: `taskkill /IM firefox.exe /F`,
    cleanupCmd: `${os.homedir()}\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles`,
    getActiveTabCmd: `tasklist /FI "IMAGENAME eq firefox.exe"`
  }
};


app.get('/start', (req, res) => {
  const { browser, url } = req.query;

  if (!browsers[browser]) {
    return res.status(400).send('Invalid browser');
  }

  exec(browsers[browser].startCmd(url), (err) => {
    if (err) {
      return res.status(500).send('Failed to start browser');
    }
    res.send(`Started ${browser} with ${url}`);
  });
});


app.get('/stop', (req, res) => {
  const { browser } = req.query;

  if (!browsers[browser]) {
    return res.status(400).send('Invalid browser');
  }

  exec(browsers[browser].stopCmd, (err) => {
    if (err) {
      return res.status(500).send('Failed to stop browser');
    }
    res.send(`Stopped ${browser}`);
  });
});



app.get('/cleanup', (req, res) => {
  const { browser } = req.query;

  if (!browsers[browser]) {
    return res.status(400).send('Invalid browser');
  }

  fs.emptyDir(browsers[browser].cleanupCmd, (err) => {
    if (err) {
      return res.status(500).send('Failed to clean up browser data');
    }
    res.send(`Cleaned up ${browser} data`);
  });
});



app.get('/geturl', (req, res) => {
  const { browser } = req.query;

  if (!browsers[browser]) {
    return res.status(400).send('Invalid browser');
  }

  exec(browsers[browser].getActiveTabCmd, (err, stdout) => {
    if (err) {
      return res.status(500).send('Failed to get active tab');
    }
    const isRunning = stdout.includes(browser);
    res.send(`Browser ${browser} is ${isRunning ? 'running' : 'not running'}`);
  });
});



app.listen(port, () => {
  console.log(`Web service running at http://localhost:${port}`);
});
