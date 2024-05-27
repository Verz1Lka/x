var new_results = {};

const uaParsed = UAParser(navigator.userAgent);
const browserName = uaParsed.browser.name;
const majorVersion = uaParsed.browser.major;

fetch('https://us-central1-uncork-dev.cloudfunctions.net/client-hints?json=1') // fetch http headers dynamically
  .then(response => response.json())
  .then(function(data) {
    // 1. Test inconsistentUserAgent:
    // compare the User-Agent obtained from http headers to 
    // `navigator.appVersion` and `navigator.userAgent` and `navigator.platform`
    // and `navigator.product`
    document.getElementById('httpHeaders').innerHTML = JSON.stringify(data, null, 2);
    new_results['inconsistentUserAgent'] = 'PASSED';
    const headerUserAgent = data['user-agent'];
    const parsedHeaderUserAgent = UAParser(headerUserAgent);
    const navUserAgent = navigator.userAgent;
    const navAppVersion = navigator.appVersion;
    const platform = navigator.platform.split(' ')[0];
    const isChrome = headerUserAgent.includes('Chrome') && navUserAgent.includes('Chrome');

    // this is the most important test
    if (navUserAgent !== headerUserAgent) {
      new_results['inconsistentUserAgent'] = 'FAIL';
    }

    // just to get sure
    if (majorVersion !== parsedHeaderUserAgent.browser.major) {
      new_results['inconsistentUserAgent'] = 'FAIL';
    }

    if (isChrome) {
      if (navUserAgent.indexOf(navAppVersion) === -1) {
        new_results['inconsistentUserAgent'] = 'FAIL';
      }
    }

    let toTest = isChrome ? [headerUserAgent, navUserAgent, navAppVersion] : [headerUserAgent, navUserAgent];

    for (let tester of toTest) {
      // TODO: I have to map all the platforms to the equivalents of the User-Agent here
      // to test that this is consistent.

      // if (platform && platform === 'Linux') {
      //   if (tester.indexOf(platform) === -1) {
      //     new_results['inconsistentUserAgent'] = 'FAIL';
      //   }
      // }

      if (navigator.product) {
        if (tester.indexOf(navigator.product) === -1) {
          new_results['inconsistentUserAgent'] = 'FAIL';
        }
      }
    }
    // 2. Test inconsistentLanguages:
    // compare the languages found in Accept-Language http header
    // to language set in `navigator.languages` and `navigator.language`
    // Why? 
    // See: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
    // "The Accept-Language HTTP header in every HTTP request from the user's browser uses
    // the same value for the navigator.languages property except for the
    // extra qvalues (quality values) field (e.g. en-US;q=0.8)."
    // This means: every value in the http header needs to be in `navigator.languages`
    // and the other way around
    // Futhermore, `navigator.language` must be the first language in `navigator.languages`
    // and the first language in the header
    new_results['inconsistentLanguages'] = 'PASSED';
    const headerAcceptLanguage = data['accept-language'];
    let langTokens = headerAcceptLanguage.split(',');
    let httpHeaderLanguages = [];
    langTokens.forEach((token) => {
      let lang = token.split(';')[0]; // remove the quality part from "en;q=0.9"
      if (lang) {
        httpHeaderLanguages.push(lang.toLowerCase());
      }
    })

    if (Array.isArray(navigator.languages) && navigator.language) {
      let language = navigator.language.toLowerCase();
      let navigatorLanguages = navigator.languages.map((lang) => lang.toLowerCase());

      for (let lang of httpHeaderLanguages) {
        if (!navigatorLanguages.includes(lang)) {
          new_results['inconsistentLanguages'] = 'FAIL';
        }
      }

      for (let lang of navigatorLanguages) {
        if (!httpHeaderLanguages.includes(lang)) {
          new_results['inconsistentLanguages'] = 'FAIL';
        }
      }

      if (language !== httpHeaderLanguages[0]) {
        new_results['inconsistentLanguages'] = 'FAIL';
      }

      if (language !== navigatorLanguages[0]) {
        new_results['inconsistentLanguages'] = 'FAIL';
      }

      // in incognito mode this appears for example
      if (navigatorLanguages.length !== httpHeaderLanguages.length) {
        new_results['inconsistentLanguages'] = 'UNKNOWN';
      }
    }
  })
  .catch((err) => {
    console.error(err.toString());
  })
  .finally(() => {
    document.getElementById('new-tests').innerHTML = JSON.stringify(new_results, null, 2);
  })

// https://github.com/digitalhurricane-io/puppeteer-detection-100-percent/blob/master/public/main.js
let err = new Error('test err');
if (err.stack.toString().includes('puppeteer')) {
  new_results['puppeteerEvaluationScript'] = 'FAIL';
} else {
  new_results['puppeteerEvaluationScript'] = 'PASSED';
}

new_results['webdriverPresent'] = navigator.webdriver ? 'FAIL': 'PASSED';

let connection = navigator.connection;
let connectionRtt = connection ? connection.rtt : undefined;

if (connectionRtt === undefined) {
  new_results['connectionRTT'] = 'UNKNOWN';
} else {
  new_results['connectionRTT'] = connectionRtt === 0 ? 'FAIL': 'PASSED';
}

// detect puppeteer stealth usage 
// see: https://github.com/berstend/puppeteer-extra/issues/403
// also: https://github.com/berstend/puppeteer-extra/issues/407
if ((browserName === 'Chrome' || browserName === 'Chrome Headless' || browserName === 'Headless')
 && parseInt(majorVersion) > 70) {
  let prototypeValues = [];

  ['hardwareConcurrency', 'languages'].forEach((prop) => {
    let objDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), prop);
  
    if (objDesc !== undefined) {
      if (objDesc.value !== undefined) {
        res = objDesc.value.toString();
      } else if (objDesc.get !== undefined) {
        res = objDesc.get.toString();
      }
    } else {
      res = "";
    }
    
    prototypeValues.push(prop + "~~~" + res);
  })

  var permissions = () => {
    return new Promise((resolve) => {
      navigator.permissions.query({name: 'notifications'}).then((val) => {
        resolve({
          state: val.state,
          permission: Notification.permission
        })
      });
    })
  }

  permissions().then((res) => {
    if (prototypeValues[0] !== 'hardwareConcurrency~~~function get hardwareConcurrency() { [native code] }'
     && prototypeValues[1] !== 'languages~~~function get languages() { [native code] }'
     && JSON.stringify(res) === '{"state":"default","permission":"default"}') {
      new_results['puppeteerExtraStealthUsed'] = 'FAIL';
     } else {
      new_results['puppeteerExtraStealthUsed'] = 'PASSED';
     }
  }).catch((err) => {
    new_results['puppeteerExtraStealthUsed'] = err.toString();
  }).finally(() => {
    document.getElementById('new-tests').innerHTML = JSON.stringify(new_results, null, 2);
  });
} else {
  new_results['puppeteerExtraStealthUsed'] = 'PASSED';
}

// Those detection test come from https://github.com/berstend/puppeteer-extra/issues/407
// Author: https://github.com/niespodd

if ((browserName === 'Chrome' || browserName === 'Chrome Headless' || browserName === 'Headless')
 && parseInt(majorVersion) > 70) {
  if (navigator.plugins && navigator.plugins[0]) {
    // `refMatch` - Headless reports `false` while regular Chrome `true`
    const nameMatch = navigator.plugins[0].name === navigator.plugins[0][0].enabledPlugin.name;
    const refMatch = navigator.plugins[0][0].enabledPlugin === navigator.plugins[0];

    if (refMatch === false) {
      new_results['refMatch'] = 'FAIL';
    } else {
      new_results['refMatch'] = 'PASSED';
    }
  }

  // `overrideTest` - Headless reports `false` while regular Chrome `true`
  navigator.plugins.refresh = 'test';
  const overrideTest = navigator.plugins.refresh === 'test';

  if (overrideTest === false) {
    new_results['overrideTest'] = 'FAIL';
  } else {
    new_results['overrideTest'] = 'PASSED';
  }

  if (navigator.plugins && navigator.plugins[0]) {
    // `overflowTest` - Headless reports `false` while regular Chrome `true`
    const overflowTest = navigator.plugins.item(4294967296) === navigator.plugins[0];
    // this can go on with navigator.plugins.item(4294967297) === navigator.plugins[1]; etc.
    // Edit: This gives false positives on Android + Chrome

    if (overflowTest === false) {
      new_results['overflowTest'] = 'FAIL';
    } else {
      new_results['overflowTest'] = 'PASSED';
    }
  }
}

// http://colorizer.org/
function getColor(value) {
  var hue = ((value / 1.2) * 130).toString(10);
  return ["hsl(", hue, ",100%,38%)"].join("");
}


// stringify results
document.getElementById('new-tests').innerHTML = JSON.stringify(new_results, null, 2);