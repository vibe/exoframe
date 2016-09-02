// npm packages
import os from 'os';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// our packages
import installPlugins from './plugin';

// construct paths
const baseFolder = path.join(os.homedir(), '.exoframe');
const configPath = path.join(baseFolder, 'cli.config.yml');

const defaultConfig = {
  endpoint: 'http://localhost:3000',
  plugins: {
    templates: ['exoframe-template-node', 'exoframe-template-maven'],
  },
};

// default config
let userConfig = defaultConfig; // eslint-disable-line

// create config folder if doesn't exist
try {
  fs.statSync(baseFolder);
} catch (e) {
  fs.mkdirSync(baseFolder);
}

// create user config if doesn't exist
try {
  fs.statSync(configPath);
} catch (e) {
  fs.writeFileSync(configPath, yaml.safeDump(defaultConfig), 'utf8');
}

// load
try {
  const newCfg = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'));
  // assign new config and clean endpoint url
  userConfig = {
    ...newCfg,
    endpoint: newCfg.endpoint.replace(/\/$/, ''),
  };
} catch (e) {
  console.error('Error parsing user config:', e);
}

// install plugins
installPlugins(userConfig);

export const updateConfig = (newCfg) => {
  const cfg = {...userConfig, ...newCfg};
  fs.writeFileSync(configPath, yaml.safeDump(cfg), 'utf8');
};

// latest config from file
export default userConfig;