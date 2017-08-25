const electron = require('electron')
const path = require('path')
const url = require('url')
const {app, BrowserWindow} = electron


let APP_DIR = '/app/';
let IMG_DIR = '/images/';

app.on('ready', ()=>{
	let win = new BrowserWindow({
		width: 519, 
		height: 600,
		icon: path.join(__dirname, APP_DIR, IMG_DIR, 'pomodoro.png'),
		titleBarStyle: 'customButtonsOnHover',
		frame: false,
		resizable: false
	})
	win.loadURL(url.format({
		pathname: path.join(__dirname, APP_DIR, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))
	// win.toggleDevTools()
	win.setMenu(null)
})

app.on('window-all-closed', ()=> {
	if(process.platform !== 'darwin'){
		app.quit()
	}
})