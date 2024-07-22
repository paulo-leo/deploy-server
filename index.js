/*
  Autor: Paulo Leonardo da Silva Cassimiro
*/
import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const jsonFilePath = path.join(process.cwd(), 'deploy.json');
const logFilePath = path.join(process.cwd(), 'deploy.log');

app.use(express.json());

// Function to add logs
const logMessage = (message) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
};

// Function to convert IPv6 address with embedded IPv4 to IPv4
const convertIPv6ToIPv4 = (ip) => ip.startsWith('::ffff:') ? ip.substring(7) : ip;

// Function to get the client IP address
const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map(ip => ip.trim());
    const ipv4 = ips.find(ip => ip.includes('.') && ip !== '::1');
    return convertIPv6ToIPv4(ipv4 || ips[0]);
  }
  return convertIPv6ToIPv4(req.socket.remoteAddress);
};

app.get('/', (req, res) => {
  res.status(200).send('Server Deploy is working');
});

app.post('/', (req, res) => {
  const input = req.body;
  const clientIp = getClientIp(req); // Get the client's IP address

  logMessage(`Received POST request from IP ${clientIp}: ${JSON.stringify(input)}`);

  fs.readFile(jsonFilePath, 'utf8', (error, data) => {
    if (error) {
      logMessage(`Error reading JSON file: ${error.message}`);
      return res.status(500).send(`Error reading JSON file: ${error.message}`);
    }

    try {
      const json = JSON.parse(data);
      const deployName = input.deploy;
      const deployData = json[deployName];

      if (!deployData) {
        throw new Error('Deploy not found.');
      }

      const { user, password, cmd, ips } = deployData;

      if (!ips.includes(clientIp)) {
        throw new Error(`Unauthorized IP: ${clientIp}`);
      }

      if (user !== input.user || password !== input.password) {
        return res.status(401).send('Invalid username or password');
      }

      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          logMessage(`Error executing command: ${error.message}`);
          return res.status(500).send(`Error executing command: ${error.message}`);
        }

        if (stderr) {
          logMessage(`Execution error: ${stderr}`);
          return res.status(500).send(`Execution error: ${stderr}`);
        }

        logMessage(`Command executed successfully: ${cmd}\nOutput:\n${stdout}`);
        res.status(200).send(`Command output:\n${stdout}`);
      });

    } catch (e) {
      logMessage(`Error in deploy request: ${e.message}`);
      res.status(500).send(`Error in deploy request: ${e.message}`);
    }
  });
});

app.use((req, res) => {
  logMessage(`Route not found: ${req.originalUrl}`);
  res.status(404).send('Route not found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  logMessage('Server started');
});
