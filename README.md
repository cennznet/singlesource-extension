# SingleSourceExtension

### Environment setting

This project requires you local node version as `^10.13.0`. You can use `nvm` to install and select the specific node version.

1. `brew install nvm`
2. `nvm install 10.13.0`
3. `nvm use 10.13.0`

### Start development

1. Git Clone or download source code as zip file
2. From project directory run `yarn && yarn build` and wait until build is finished.
3. Open `chrome://extensions/` on Chrome and toggle `Developer Mode`.
4. Click `Load unpacked` and select `dist` directory inside project directory.
5. Start using SingleSource Extension.

### Install on Firefox

1. Open `about:debugging` on Firefox
2. Click `Load Temporary Add-on…`
3. Select `manifest.json` inside `dist` directory

### Run example

From project directory run `cd react-example && yarn && yarn start` to start a demo dApp.
