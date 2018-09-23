const request = require("request");
const log = require("fancy-log");
const ping = require("ping");
const readlineSync = require("readline-sync");

function askForIp() {
  let host = readlineSync.question("What's the IP address of your Aurora? ");
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host)) {
    testIp(host);
  } else {
    log.warn("Not a valid IP address. Please input a correct IP.");
    askForIp();
  }
}

function testIp(host) {
log("Pinging address to see if device is available");
ping.promise.probe(host).then((res) => {
  if (res.alive) {
    log("Aurora seems to be up. Starting request for token.");
    getToken(res.numeric_host);
  } else {
    log.error("This device doesn't seem to be running. Please check that you've entered the correct IP address or that your Aurora is running and connected to your network.");
  }
});
}

function getToken(host) {
  readlineSync.question("Please press the power button on your Aurora for 5-7 seconds, then press the enter key.");
  request.post('http://' + host + ':16021/api/v1/new', (err, res, body) => {
    if (err) {
      log.error(err);
    }
    if (res.statusCode === 200) {
      log("Success!");
      log(res.body);
    } else {
      log.error("Could connect to Aurora but were not able to get an API token. Please make sure you have pressed the power button correctly and try again.");
    }
  });
}

askForIp();
