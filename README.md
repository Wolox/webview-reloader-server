web-view-reloader-server
========================

## Install

    brew install node
    npm install -g webview-reloader-server

## Usage

If you want to load the configuration from a file

    wvrserver config.json

If you want to configure a listener named `MyWebView` serving folder `../MyIOSProject/MyWebView`:

    wvrserver MyWebView ../MyIOSProject/MyWebView

If you want to configure a listener named `MyWebView` serving folder `../MyIOSProject/MyWebView` 
and only notify about file changes that matches the regular expression `.*\\.html`:

    wvrserver MyWebView ../MyIOSProject/MyWebView ".*\\.html"
    
### Configuration file

```json
{
  "publicDirPath": "/tmp/wvrserver",
  "serverPort": 4040, 
  "listeners": [
    {
      "name" : "MyWebView1",
      "folder": "../MyIOSProject/MyWebView",
      "fileRegexp" : ".*\\.html" 
    },
    {
      "name" : "MyWebView2",
      "folder": "../MyIOSProject/MyWebView2",
      "fileRegexp" : "(.*\\.html|.*\\.js)" 
    },
    {
      "name" : "MyWebView3",
      "folder": "../MyIOSProject/MyWebView2"
    }
  ]
}
```
