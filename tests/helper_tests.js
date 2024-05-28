
function compareNavigatorProperties(obj, test) {
  let passed;
  let propertiesToCheck = [
    'userAgent',
    'appVersion',
    'platform',
    // 'webdriver',
    'deviceMemory',
    'hardwareConcurrency',
    'cpuClass',
    // 'vendor',
    'language',
    'languages'
  ];
  passed = true;
            new_results[test] = 'PASSED';
            for (let prop of propertiesToCheck) {
              let toTest = obj[prop];
              let tester = navigator[prop];

              if (Array.isArray(tester)) {
                toTest = toTest.toString()
                tester = tester.toString()
              }

              
              if (toTest !== tester) {
                if(passed){
                  passed = false;
                  new_results[test] = 'FAILED: '
                }  
                console.log(prop, toTest, tester);
                new_results[test] += prop + '; ';
              }
            }

            document.getElementById('new-tests').innerHTML = JSON.stringify(new_results, null, 2);
          }

          // https://github.com/berstend/puppeteer-extra/issues/451
          var w;
          if (typeof(Worker) !== "undefined") {
            if (typeof(w) == "undefined") {
              w = new Worker("webworker2.js");
              document.getElementById("webWorkerRes").innerHTML = 'started...';
            }
            w.onmessage = function(event) {
              let obj = JSON.parse(event.data);
              console.log('webworker', event.data);
              compareNavigatorProperties(obj, "inconsistentWebWorkerNavigatorPropery");
              document.getElementById("webWorkerRes").innerHTML = event.data;
            };
          } else {
            document.getElementById("webWorkerRes").innerHTML = "Sorry! No Web Worker support.";
          }




          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js')
              .then(function() {
                console.log('sw registered');
              })
              .catch(function(e) {
                console.log('sw-error:', e);
              });
          } else {
            console.error('this browser does not support service workers');
          }

          const broadcast = new BroadcastChannel('sw-channel');
          // Listen to the response
          broadcast.onmessage = function (event) {
            if (event.data) {
              console.log('serviceworker', event.data);
              compareNavigatorProperties(event.data, "inconsistentServiceWorkerNavigatorPropery");
              document.getElementById('serviceWorkerRes').innerHTML = JSON.stringify(event.data, null, 2);
            }
          }

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

var navigatorData = {
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

document.getElementById('navigatorRes').innerHTML = JSON.stringify(navigatorData, null, 2);
    