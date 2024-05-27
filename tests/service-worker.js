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
  webGlData: webGlData
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