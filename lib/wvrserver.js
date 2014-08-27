#! /usr/bin/env node

// Imports
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

// Global variables

var defaultConfig = {
  serverPort: 4040,
  publicDirPath: '/tmp/wvserver'
};

var io = {};

var publicDirPath = "";

// Utility functions

function merge(obj1, obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

function loadConfig(configFilePath, defaultConfig, callback) {
  console.log("Using server config file: " + configFilePath);
  if (configFilePath) {
    fs.readFile(configFilePath, function(error, data) {
      if (error) {
        console.log("Configuration could not be loaded: ", error);
      } else {
        var config = JSON.parse(data);
        callback(merge(defaultConfig, config));
      }
    });
  } else {
    callback(merge(defaultConfig, {}));
  }
}

function isListenerValid(listener) {
  return listener !== null                      &&
         typeof listener.folder !== "undefined" &&
         typeof listener.name !== "undefined"   &&
         listener.folder !== ""                 &&
         listener.name !== "";
}

function isChannelValid(channel) {
  return typeof channel !== "undefined"           &&
         channel !== ""                           &&
         typeof channels[channel] !== "undefined";
}

function parseListener(body) {
  var listener = merge(body, { sockets:[] });
  try {
    if (listener.fileRegexp) {
      listener.fileRegexp = new RegExp(listener.fileRegexp);
    }
  } catch (e) {
    console.log("Listener RegExp is not valid %s", listener.fileRegexp);
    listener = null;
  }
  return listener;
}

function startServer(config) {
  rimraf(config.publicDirPath, function(error){
    if (error) {
      console.log("Public dir %s could not be removed: ", config.publicDirPath, error);
      return;
    }
    fs.mkdir(config.publicDirPath, function(error) {
      if (error) {
        console.log("Public dir %s could not be created: ", config.publicDirPath, error);
        return;
      }
      publicDirPath = config.publicDirPath;
      createServer(config);
    });
  });
}

function createServer(config) {
  console.log("Starting server using config ", config);
  var app = express();
  app.use(bodyParser.json(publicDirPath));
  app.use(express.static(publicDirPath));

  app.post('/listen', listenRequestHandler);

  var server = http.Server(app);
  io = socketio(server);
  server.listen(config.serverPort, function() {
    console.log("WLXWebViewReloader server listening on port %d", server.address().port);
  });

  for (var i = 0, size = config.listeners.length; i < size; ++i) {
    var listener = config.listeners[i];
    createListener(listener, function (success) {
      if (!success) {
        console.log("Listener %s could not be created.", listener.name);
      }
    });
  }
}

function connectListener(listener) {
  io.of("/" + listener.name).on('connection', function (socket) {
    console.log("New connection received for listener %s.", listener.name);
    listener.sockets.push(socket);
    socket.on('disconnect', function () {
      console.log("A socket from listener %s has been disconnected", listener.name);
      // TODO Check if this actually removes the socket.
      var i = listener.sockets.indexOf(socket);
      listener.sockets.splice(i,1);
    });
  });
}

function watchListenerFolder(listener) {
  var watchedFolder = path.resolve(listener.folder);
  console.log("Watching folder '%s' for listener %s", watchedFolder, listener.name);
  fs.watch(watchedFolder, function (event, filename) {
    console.log("Event '%s' for filename '%s' of listener '%s'", event, filename, watchedFolder);

    if (!listener.fileRegexp.test(filename)) {
      console.log("Filename %s does not match listener's regexp %s.", filename, listener.fileRegexp);
      return;
    }

    for (var i = 0, size = listener.sockets.length; i < size; ++i) {
      console.log("Notifying socket %d of listener %s", i, listener.name);
      listener.sockets[i].emit('src-change', { filename: filename });
    }
  });
}

function createListener(json, callback) {
  var listener = parseListener(json);
  if (isListenerValid(listener)) {
    // TODO avoid symlin if dir already exists
    var srcFolder = path.resolve(listener.folder);
    var dstFolder = path.join(publicDirPath, listener.name);
    console.log("Symlinking folder '%s' to '%s'", srcFolder, dstFolder);
    fs.symlink(srcFolder, dstFolder, 'dir', function(error) {
      if (error) {
        console.log("Listener's %s folder could not be symlinked: %s", listener.name, error);
        callback(false) 
      } else {
        connectListener(listener);
        watchListenerFolder(listener);
        console.log("New listener created with name %s for folder '%s'", listener.name, listener.folder);
        callback(true)          
      }
    });
  } else {
    callback(false);
  }
}

// Request Handlers

function listenRequestHandler(req, res) {
  if (req.is("application/json")) {
    createListener(req.body, function(success){
      var status = (success) ? 200 : 400;
      res.status(status).end();
    });
  } else {
    res.status(415).end(); 
  }
}


// Bootstrap

function main() {
  var configFilePath = null;
  if (process.argv.length == 2 + 1) {
    configFilePath = process.argv[2];
  } else if (process.argv.length >= 2 + 2) {
    var listener = {
      name: process.argv[2],
      folder: process.argv[3]
    };
    if (process.argv.length == 2 + 3) {
      listener.fileRegexp = process.argv[4];
    }
    defaultConfig.listeners = [listener];
  } else {
    throw new Error("Invalid arguments!");
  }
  loadConfig(configFilePath, defaultConfig, startServer);
}

main();