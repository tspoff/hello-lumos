/*
    Auto-copy .env.example files to .env on initial load, cross platform compatible method
*/

const fs = require("fs");
const baseDir = process.env.INIT_CWD;

const clientEnvPath = `${baseDir}/client/.env`;
const serverEnvPath = `${baseDir}/server/.env`;
const clientEnvExamplePath = `${baseDir}/client/.env.example`;
const serverEnvExamplePath = `${baseDir}/server/.env.example`;

if (!fs.existsSync(clientEnvPath)) {
  fs.copyFile(clientEnvExamplePath, clientEnvPath, (err) => {
    if (err) throw err;
  });
}

if (!fs.existsSync(serverEnvPath)) {
  fs.copyFile(serverEnvExamplePath, serverEnvPath, (err) => {
    if (err) throw err;
  });
}
