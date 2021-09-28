# DEPRECATED 2021-09-28

functionality replaced by https://status.filecoin.io

<br>

# Filecoin Network Information

This repo is the source of https://network.filecoin.io and contains information about all the active Filecoin networks. It is the source of truth for all network information, related links etc. and should be the only place where this information is maintained.

For information about how to connect to a network using a Filecoin node (i.e. Lotus), check the Filecoin documentation: https://docs.filecoin.io
## Network Information Data Model

For each Filecoin network, we include the following information:
- Network name
- Network summary and description
- Network status:
  - 🔴 Network down for all participants
  - 🟡 Network is unstable (down for some participants, but not all)
  - 🟢 Network up and stable
- Link to the genesis CAR files for the network
- Link to the faucet for the network (if the network is not `mainnet`)
- Supported sector sizes on this network
- The minimum miner power required to participate in Filecoin consensus on this network
- Chain genesis information, including when this network was last reset and the hash of the genesis block
- Addresses for the bootstrap peers on this network

Information for each network is stored in a JSON file. Currently information for each network can be found on the [this page](https://docs.filecoin.io/how-to/networks/) on the Filecoin Documentation Site, or on the respective information page for each network:
- `butterfly` network: https://www.butterfly.fildev.network/
- `calibration` network: https://www.calibration.fildev.network/

## Build & Deploy

This application builds a static site using Nuxt.js/Vue.js. The site is generated to the `/dist/` directory during the build process. Only this directory needs to be published.

**This application fetches schemas and network information directly from `https://raw.githubusercontent.com/filecoin-project/network-info/master/...`. This means you cannot see or preview the changes you made until you merge to master** or change the fetch manually to a local urls. Master is automatically deployed so, good luck! For major changes, you can deploy to the develop branch instead. The preview for this branch is generated at a different URL.

### Nuxt settings
- Remove `mode` property from `nuxt.config.js`
- Set `target: 'static'` in `nuxt.config.js`

### Fleek configuration
- A `.fleek.json` configuration file is included which should pre-populate these settings
- Build command: `npm ci && npm run generate`
- Base directory can be left empty
- Publish directory: `dist`
- Environment variables:
  - NODE_ENV=production

### Deployment process
- Commit to a repo on GitHub
- Login to Fleek, click on "Hosting" and click on "Add new site"
- Connect your GitHub repo
- The remaining information should populate automatically, however, if it doesn't:
 - Select NuxtJS as the framework
 - Input the settings as defined in `#fleek-settings`
- Select "Deploy Site"
- 🎉
