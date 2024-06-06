const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ip = '192.168.68.50';
const port = 1234;

const key = fs.readFileSync(path.resolve(__dirname, './192.168.68.50-key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, './192.168.68.50.pem'));

const app = express();

app.use(
  '/',
  createProxyMiddleware({
    target: `http://localhost:1235`,
    changeOrigin: true,
  })
);

const httpsServer = https.createServer({ key, cert }, app);

httpsServer.listen(port, ip, () => {
  console.log(`Starting server on https://${ip}:${port}`);

const parcel = exec(`parcel serve src/index.html --port 1235`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Parcel error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Parcel stderr: ${stderr}`);
      return;
    }
    console.log(`Parcel stdout: ${stdout}`);
  });

  parcel.stdout.on('data', (data) => {
    console.log(`Parcel stdout: ${data}`);
  });

  parcel.stderr.on('data', (data) => {
    console.error(`Parcel stderr: ${data}`);
  });
});
