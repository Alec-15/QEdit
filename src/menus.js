
export class Menus {
  getMenus() {
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'New', accelerator: 'CmdOrCtrl+N',},
          { label: 'Open...', accelerator: 'CmdOrCtrl+O',},
          { label: 'Save', accelerator: 'CmdOrCtrl+S',},
          { label: 'Save As...', accelerator: 'CmdOrCtrl+Alt+S',},
          { label: 'Export to JavaScript', accelerator: 'CmdOrCtrl+J',},
          { type: 'separator' },
          { label: 'Exit', accelerator: 'Alt+F4',},
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
          { 
            label: 'Dark mode',
            type: 'checkbox',
          },
          //{ type: 'separator' },
          //{ 
          //  label: 'Preview in browser',
          //  click () { require('electron').shell.openExternal("file://" + FILENAME) }
          //}
        ]
      },
      {
        label: 'Object',
        submenu: [
          { label: 'Add location', accelerator: 'CmdOrCtrl+L',},
          { label: 'Add item', accelerator: 'CmdOrCtrl+I',},
          { label: 'Add stub', },
          { type: 'separator' },
          { label: 'Delete object', },
          { label: 'Duplicate object', accelerator: 'CmdOrCtrl+D',},
          { type: 'separator' },
          { label: 'Add function', accelerator: 'Alt+CmdOrCtrl+F',},
          { label: 'Add command', accelerator: 'Alt+CmdOrCtrl+C',},
        ]
      },
      {
        label: 'Search',
        submenu: [
          { label: 'Find', accelerator: 'CmdOrCtrl+F',},
          { label: 'Find next', accelerator: 'F3',},
          { label: 'Search backwards', type: 'checkbox', checked : false, },
          { label: 'Search case sensitive', type: 'checkbox', checked : true, },
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Help',
            click () {
              require('electron').shell.openExternal('https://github.com/ThePix/QEdit/wiki');
            }
          },
        ]
      }
    ]

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })

      // Edit menu
      template[1].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      )

      // Window menu
      template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }
    return template;
  }
}

