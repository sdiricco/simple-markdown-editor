////////////////////////////////////// Global Requires \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
import { Menu } from "electron";
import * as R from "ramda";

////////////////////////////////////// Global Constants \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const isMac = process.platform === "darwin";

////////////////////////////////////// Global Variables \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
let defaultTemplate = [];
let template = [];

////////////////////////////////////// Global Functions \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export function buildMenuFromTemplate(window, template) {
  const menu = Menu.buildFromTemplate(template);
  window.setMenu(menu);
}

export function create(app, window, onClickItem) {
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
          id: "file/open",
          label: "Open",
          accelerator: "Ctrl + O",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Open"], {
              options: optionsFiltered(menuItem),
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        { type: "separator" },
        {
          id: "file/save",
          label: "Save",
          accelerator: "Ctrl + S",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Save"], {
              options: optionsFiltered(menuItem),
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        {
          id: "file/saveas",
          label: "Save as..",
          accelerator: "Ctrl + Shift + S",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Save as.."], {
              options: optionsFiltered(menuItem),
              menuItem: menuItem,
              browserWindow: browserWindow,
              event: event,
            }),
        },
        { type: "separator" },
        {
          id: "file/preferences",
          label: "Preferences",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["File", "Preferences"], {
              options: optionsFiltered(menuItem),
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
          id: "view/toggle-window",
          label: "Toogle window",
          accelerator: "Ctrl + Tab",
          click: (menuItem, browserWindow, event) =>
            onClickItem(["View", "Toogle window"], {
              options: optionsFiltered(menuItem),
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

export function updateTemplateItem(window, tree, content, __template) {
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

function optionsFiltered(menuItem) {
  return {
    id: menuItem.id || null,
    label: menuItem.label || null,
    type: menuItem.type || null,
    checked: menuItem.checked || null,
    role: menuItem.role || null,
    accelerator: menuItem.accelerator || null,
    sublabel: menuItem.sublabel || null,
    toolTip: menuItem.toolTip || null,
    enabled: menuItem.enabled || null,
    visible: menuItem.visible || null,
    acceleratorWorksWhenHidden:
      menuItem.acceleratorWorksWhenHidden || null,
    registerAccelerator: menuItem.registerAccelerator || null,
    commandId: menuItem.commandId || null,
  };
}


