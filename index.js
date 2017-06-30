var app = require('electron').app
var bw = require('electron').BrowserWindow
var ipc = require('electron').ipcMain
var fs = require('fs')

app.on('ready', function(){
    mw = new bw({
        width: 1300,
        height: 750,
    })
    mw.loadURL('file://' + __dirname + '/index.html');
    mw.openDevTools();

    return mw
});
app.commandLine.appendSwitch('enable-javascript-harmony')
