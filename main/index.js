global.XMLHttpRequest = require("xhr2");

const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  ipcRenderer,
  systemPreferences,
  shell
} = require("electron");
const path = require("path");
const { format } = require("url");
const { resolve } = require("app-root-path");

const isDev = require("electron-is-dev");
const prepareNext = require("electron-next");
const assetsDirectory = path.join(__dirname, "../assets");
const AutoLaunch = require("auto-launch");
const Store = require("electron-store");

const store = new Store({
  defaults: {
    defaultCoin: "btceur",
    start: true
  }
});

var autoLauncher = new AutoLaunch({
  name: "Crypto Monitor"
});

app.setName("Crypto Monitor");

if (store.get("start")) {
  autoLauncher.enable();
  app.setLoginItemSettings({
    openAtLogin: true
  });
} else {
  autoLauncher.disable();
  app.setLoginItemSettings({
    openAtLogin: false
  });
}

//TODO support macOs Dark mode
//systemPreferences.isDarkMode();

require("electron-debug")({ showDevTools: "undocked" /* enabled: true*/ });

let tray = undefined;
let window = undefined;

// Don't show the app in the doc
app.dock.hide();

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  await createTray();
  await createWindow();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 350,
    show: false,
    title: "Crypto Monitor",
    frame: false,
    movable: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      experimentalFeatures: true,
      backgroundThrottling: false
    }
  });

  const url = isDev
    ? "http://localhost:8000/start"
    : format({
        pathname: resolve("renderer/out/start/index.html"), //join(__dirname, "../renderer/out/start/index.html"),
        protocol: "file:",
        slashes: true
      });

  window.loadURL(url);
  // Hide the window when it loses focus
  window.on("blur", () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });
};
const createTray = () => {
  tray = new Tray(updateImage(store.get("defaultCoin")));

  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);
  tray.on("click", function(event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: "detach" });
    }
  });

  //Bitfiniex does not support ltceur
  if (
    store.get("defaultCoin") === "ltceur" &&
    store.get("source") === "bitfinex"
  ) {
    tray.setTitle("-,-- €");
  } else {
    tray.setTitle("...");
  }
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};

const updateImage = coin => {
  if (coin.indexOf("btc") >= 0) {
    return path.join(assetsDirectory, "bitcoin.png");
  }
  if (coin.indexOf("eth") >= 0) {
    return path.join(assetsDirectory, "ethereum.png");
  }
  if (coin.indexOf("ltc") >= 0) {
    return path.join(assetsDirectory, "litecoin.png");
  }
};

ipcMain.on("show-window", () => {
  showWindow();
});

ipcMain.on("image-updated", (event, coin) => {
  tray.setImage(updateImage(coin));
});

ipcMain.on("quit", () => {
  app.quit();
});

ipcMain.on("price-updated", (event, data) => {
  var title = "-,-- €";
  if (data.price !== title) {
    title = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(data.price);

    if (data.coin.indexOf("usd") >= 0) {
      title = new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD"
      }).format(data.price);
    }
  }

  tray.setTitle(title);
});
