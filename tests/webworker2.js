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
  userAgent: navigator.userAgent, appVersion: navigator.appVersion,
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

// setTimeout(() => {
//   postMessage(JSON.stringify(workerData, null, 2));
// }, 100);