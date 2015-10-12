# Cottontail
Cottontail is a web-based IDE for WebdriverIO.

## Installation
To run Cottontail, you need to install a proxy locally. Run `npm install cottontail`.

### Browser server
Every browser requires their own "server" (or "driver") to receive WebDriver commands. You can find list of servers below, or from [Selenium](http://docs.seleniumhq.org/download/) site.

| Browser | URL |
| --- | --- |
| ChromeDriver | https://sites.google.com/a/chromium.org/chromedriver/downloads |
| Edge | https://www.microsoft.com/en-us/download/details.aspx?id=48212 |
| Firefox | https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/WebDriver |
| Safari | https://github.com/SeleniumHQ/selenium/wiki/SafariDriver |

## Run
You will need to run both WebDriver server for your browser, and Cottontail proxy. The order of the run is not important:

* Run specific WebDriver server for your browser
* Run `cottontail`
* Browse to http://cottontail.azurewebsites.net/

## Roadmap
Version N
* Better UI
* Export to JavaScript (WebdriverIO), C# and Markdown test spec
* Import from JSON

Version N+1
* Synchronize with Dropbox, GitHub, and OneDrive

Version N+2
* WebDriver server process lifetime management
  * Auto start server process
  * Kill server process if hang
  * Download/update server binaries

## Contributions
Please submit bugs to [issues](issues).
