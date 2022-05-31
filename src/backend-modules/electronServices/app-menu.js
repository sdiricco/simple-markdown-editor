////////////////////////////////////// Global Requires \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const { Menu } = require("electron");
const R = require("ramda");

////////////////////////////////////// Global Constants \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const isMac = process.platform === "darwin";

////////////////////////////////////// Global Variables \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let defaultTemplate = [];
let template = [];

////////////////////////////////////// Global Functions \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function buildMenuFromTemplate(window, template) {
  const menu = Menu.buildFromTemplate(template);
  window.setMenu(menu);
}

function createTemplate(app, window, onClickItem) {
  let __template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: "File",
      submenu: [
        {
          label: "Open",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Open"], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        { type: "separator" },
        {
          label: "Build",
          accelerator: "Ctrl + B",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Build"], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "Ctrl + S",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Save"], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        {
          label: "Save as..",
          accelerator: "Ctrl + Shift + S",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Save as.."], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    // { role: 'editMenu' }
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" },
              { role: "delete" },
              { role: "selectAll" },
              { type: "separator" },
              {
                label: "Speech",
                submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
              },
            ]
          : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
      ],
    },
    // { role: 'windowMenu' }
    {
      label: "View",
      submenu: [
        {
          label: "Editor",
          type: "checkbox",
          checked: true,
          click: (menuItem, browserWindow, event) =>
            onClickItem(["View", "Editor"], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        {
          label: "Preview",
          type: "checkbox",
          checked: true,
          click: (menuItem, browserWindow, event) =>
            onClickItem(["View", "Preview"], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "togglefullscreen" },
        { role: "minimize" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        ...(isMac
          ? [
              { type: "separator" },
              { role: "front" },
              { type: "separator" },
              { role: "window" },
            ]
          : [{ type: "separator" }, { role: "close" }]),
      ],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["Help", "Learn More"], {
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
      ],
    },
  ];
  template = R.clone(__template);
  defaultTemplate = R.clone(__template);
  buildMenuFromTemplate(window, template);
}

function updateTemplateItem(window, tree, content, __template) {
  if (__template === undefined) {
    __template = template;
  }
  if (tree.length === 1) {
    const label = tree[0];
    for (let i = 0; i < __template.length; i++) {
      if (__template[i].label === label) {
        __template[i] = content;
        return true;
      }
    }
  } else {
    const label = tree[0];
    for (let i = 0; i < __template.length; i++) {
      if (__template[i].label === label) {
        tree.shift();
        updateTemplateItem(window, tree, content, __template[i].submenu);
        buildMenuFromTemplate(window, template);
      }
    }
  }
}

////////////////////////////////////// Exports \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
module.exports = { updateTemplateItem, createTemplate };
