(function () {
    var noScriptMessageElement = document.getElementById('cmsg');
    var noScriptMessageText = noScriptMessageElement ? noScriptMessageElement.innerText : '';
    var getRefererQueryParamString = function () {
        try {
            var prefix = '&referer=';
            if (window.location !== window.parent.location) {
                // Nested Iframe
                return prefix + encodeURIComponent(window.location.href);
            }
            return prefix + encodeURIComponent(window.parent.location.href);
        } catch (e) {
            return '';
        }
    };

    var isSafari = window.navigator
        ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        : false;
    var stretchHeightRule = isSafari ? 'height: -webkit-fill-available;' : '';

    var getDDCookie = function (value) {
        var r = new RegExp('datadome=([^;]+)');
        var v = r.exec(value);
        if (v != null) {
            try {
                return decodeURIComponent(v[1]);
            } catch (e) {
                return v[1];
            }
        }
        return null;
    };

    var volatile = document.cookie === '' && window.ddcid != null;

    document.open();
    document.write(
        '<script>if("string"==typeof navigator.userAgent&&navigator.userAgent.indexOf("Firefox")>-1){var isIframeLoaded=!1,maxTimeoutMs=5e3;function iframeOnload(e){isIframeLoaded=!0;var a=document.getElementById("noiframe");a&&a.parentNode.removeChild(a)}var initialTime=(new Date).getTime();setTimeout(function(){isIframeLoaded||(new Date).getTime()-initialTime>maxTimeoutMs&&(document.body.innerHTML=\'<div id="noiframe">' +
            noScriptMessageText +
            '</div>\'+document.body.innerHTML)},maxTimeoutMs)}else function iframeOnload(){}</script><iframe src="https://' +
            dd.host +
            '/tests/?initialCid=' +
            encodeURIComponent(dd.cid) +
            '&hash=' +
            encodeURIComponent(dd.hsh) +
            '&cid=' +
            encodeURIComponent(volatile ? window.ddcid : getDDCookie(document.cookie)) +
            '&t=' +
            encodeURIComponent(dd.t) +
            getRefererQueryParamString() +
            '&s=' +
            dd.s +
            '&e=' +
            dd.e +
            '" width="100%" height="100%" style="height:100vh;' +
            stretchHeightRule +
            '" FRAMEBORDER="0" border="0" scrolling="yes" onload="iframeOnload()"></iframe>'
    );
    document.close();

    if (noScriptMessageElement) {
        noScriptMessageElement.parentNode.removeChild(noScriptMessageElement);
    }

    var canGoBack =
        window.history && typeof window.history.back === 'function' && window.history.length > 1;
    // `ddShouldGoBack` is an option that can be set by a code snippet in a customer's page customization.
    var shouldGoBack = (dd.r && dd.r === 'b' && canGoBack) || (window.ddShouldGoBack && canGoBack);

    var viewPortTag = document.createElement('meta');
    viewPortTag.name = 'viewport';
    viewPortTag.content = 'width=device-width, initial-scale=1.0';

    var headTag = document.querySelector('head');
    if (headTag != null) {
        headTag.appendChild(viewPortTag);
    }

    var onCaptchaCookie = function (event) {
        // Check if messages come from DataDome origins.
        function isDatadomeOrigin(url) {
            var ddHosts = ['.datado.me', '.captcha-delivery.com'];
            if (url.indexOf('https://') !== 0) {
                return false;
            }
            for (var i = 0; i < ddHosts.length; i++) {
                if (url.indexOf(ddHosts[i]) === url.length - ddHosts[i].length) {
                    return true;
                }
            }
            return false;
        }

        if (event.isTrusted && isDatadomeOrigin(event.origin)) {
            if (typeof event.data !== 'string') {
                return false;
            }

            try {
                var data = JSON.parse(event.data);

                if (data.cookie) {
                    document.cookie = data.cookie;
                }
                if (data.url) {
                    setTimeout(function () {
                        if (shouldGoBack) {
                            history.back();
                        } else {
                            if (volatile && typeof window.URL === 'function') {
                                var volatileUrl = new URL(window.location.href);
                                volatileUrl.searchParams.set('ddcid', getDDCookie(data.cookie));

                                window.location = volatileUrl;
                            } else {
                                window.location.reload();
                            }
                        }
                    }, 500);
                }
            } catch (_) {
                /* Silent failure if JSON.parse is used on invalid data */
            }
        }
    };

    if (window.addEventListener) {
        window.addEventListener('message', onCaptchaCookie, false);
    } else if (window.attachEvent) {
        window.attachEvent('onmessage', onCaptchaCookie);
    }
})();