const webGlData = {};
var canvas = new OffscreenCanvas(1, 1);
const gl = canvas.getContext("webgl");
webGlData['gl.VERSION'] =  gl.getParameter(gl.VERSION);
webGlData['gl.SHADING_LANGUAGE_VERSION']= gl.getParameter(gl.SHADING_LANGUAGE_VERSION) ;
webGlData['gl.VENDOR'] = gl.getParameter(gl.VENDOR);

const ext = gl.getExtension("WEBGL_debug_renderer_info");

if (ext) {
  webGlData['UNMASKED_VENDOR_WEBGL'] = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
  webGlData['UNMASKED_RENDERER_WEBGL'] = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
}

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
  webGlData: webGlData
}

postMessage(JSON.stringify(workerData, null, 2));
//
// // main page
// w = new Worker("webworker2.js");
// w.onmessage = function(event) {
//   let obj = JSON.parse(event.data);
//   document.getElementById("webWorkerRes").innerHTML = event.data;
// };

// setTimeout(() => {
//   postMessage(JSON.stringify(workerData, null, 2));
// }, 100);


// const iframe = document.createElement('iframe');
// document.body.appendChild(iframe);
// iframeNavigator = iframe.contentWindow.navigator;
// document.body.removeChild(iframe);
// alert(iframeNavigator.platform);