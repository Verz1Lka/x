// service-worker.js
// Set up channel with same name as in app.js

var data = {
  userAgent: navigator.userAgent,
  appVersion: navigator.appVersion,
  platform: navigator.platform,
  webdriver: navigator.webdriver,
  deviceMemory: navigator.deviceMemory,
	hardwareConcurrency: navigator.hardwareConcurrency,
  cpuClass: navigator.cpuClass,
  vendor: navigator.vendor,
  language: navigator.language,
  languages: navigator.languages,
  userAgentData: JSON.parse(JSON.stringify(navigator.userAgentData)),
}

const broadcast = new BroadcastChannel('sw-channel');
var cnt = 10;

var intervalID = setInterval(() => {
  broadcast.postMessage(data);
  cnt--;
  if (cnt <= 0) {
    clearInterval(intervalID);
  }
}, 500);