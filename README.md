Webview reloader server
========================

This is the server that powers  [WLXWebViewReloader](https://github.com/Wolox/WLXWebViewReloader). It serves the content needed by your webview while your are developing (instead of serving it from the app's bundle) and tells the web view to reload itself every time the source code changes.

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
## About ##

This project is maintained by [Guido Marucci Blas](https://github.com/guidomb) and it was written by [Wolox](http://www.wolox.com.ar).

![Wolox](https://raw.githubusercontent.com/Wolox/press-kit/master/logos/logo_banner.png)

## License

**Webview reloader server** is available under the MIT [license](https://raw.githubusercontent.com/Wolox/webview-reloader-server/master/LICENSE).

    Copyright (c) 2014 Guido Marucci Blas <guidomb@wolox.com.ar>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
