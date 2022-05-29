# vue-electron

Basic vue-electron boilerplate

**Features**

- vuetify: material design UI for vue with default layout
- vue electron plugin
- electron builder: to build cross platform app
- electron extra-resources: All the extra resources under `src/extra-resources` will be moved under `resources` of root path after the build. It can be utils if you want to load extra scripts
- electron app-menu with default template and custom `updateTemplateItem()` function to update dinamically the menu
- electron debugger. Debugger in vs code

## Usage

To run in development mode

```sh
yarn install
yarn electron:serve
```

To debug, launch run and debug and don't delete `launch.json`, `tasks.json` under `.vscode` folder

To build

```sh
yarn electron:build
```