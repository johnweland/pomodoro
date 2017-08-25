// setup requirements
const electron = require('electron')
const path = require('path')
const url = require('url')
const {app, BrowserWindow} = electron

// set directories
let APP_DIR = '/app/';
let IMG_DIR = '/images/';


const createWindow = () => {
	// create browser window
	let win = new BrowserWindow({
		width: 519, 
		height: 600,
		icon: path.join(__dirname, APP_DIR, IMG_DIR, 'pomodoro.png'),
		titleBarStyle: 'customButtonsOnHover',
		frame: false,
		resizable: false
	})
	// load index.html
	win.loadURL(url.format({
		pathname: path.join(__dirname, APP_DIR, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))
	win.setMenu(null)

	app.on('closed', () => {
		win = null
	})
}

// run create window function
app.on('ready', createWindow);

// quit when all windows are closed
app.on('window-all-closed', ()=> {
	if(process.platform !== 'darwin'){
		app.quit()
	}
})