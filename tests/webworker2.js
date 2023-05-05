var workerData = {
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
  userAgentData: navigator.userAgentData,
}

setTimeout(() => {
  postMessage(JSON.stringify(workerData, null, 2));
}, 100);