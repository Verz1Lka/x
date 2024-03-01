var data0 = {
    cat: 0,
    c: {}
};
try {
    data0.c.ua = navigator.userAgent;
    data0.c.hc = navigator.hardwareConcurrency;
    data0.c.pf = navigator.platform;
    data0.c.mob = navigator.userAgentData ? navigator.userAgentData.mobile : "NA";
    data0.c.lngs = JSON.stringify(navigator.languages);
    data0.c.onL = navigator.onLine;
    var debugInfo;
    var vendorEnum;
    var rendererEnum;
    var canvas = new OffscreenCanvas(1, 1);
    var gl = canvas.getContext("webgl");
    var ffRegex = /Firefox\/(\d+)/.exec(navigator.userAgent);
    rendererEnum = ffRegex && 91 < ffRegex[1] ? (vendorEnum = gl.VENDOR, gl.RENDERER) : (vendorEnum = (debugInfo = gl.getExtension("WEBGL_debug_renderer_info")).UNMASKED_VENDOR_WEBGL, debugInfo.UNMASKED_RENDERER_WEBGL);
    data0.c.glvd = gl.getParameter(vendorEnum);
    data0.c.glrd = gl.getParameter(rendererEnum);
    self.postMessage(data0);
} catch (t) {
    data0.e = t.message;
    self.postMessage(data0);
}
function hashArrayBufferAsync(t) {
    return crypto.subtle.digest("SHA-256", t).then(function (t) {
        return Array.from(new Uint8Array(t));
    });
}
function stringifyHash(t) {
    return t.map(function (t) {
        return t.toString(16).padStart(2, "0");
    }).join("");
}
function safeBtoa(t) {
    if (btoa) {
        try {
            return btoa(t);
        } catch (t) {
            return "b_e";
        }
    }
    return "b_u";
}
new Promise(function (r, t) {
    var e = [];
    var a = new OffscreenCanvas(1, 1);
    var n = a.getContext("2d");
    i = n;
    (h = a).width = 380;
    h.height = 55;
    i.textBaseline = "alphabetic";
    i.fillStyle = "#F0A";
    i.fillRect(49, 1, 73, 25);
    h = "Quartz glyph job vexd cwm finks" + String.fromCharCode(55357, 56898);
    i.fillStyle = "#3A1";
    i.font = "13pt \"Times New Roman\"";
    i.fillText(h, 5, 17);
    i.fillStyle = "rgba(49, 40, 223, 0.33)";
    i.font = "17pt Arial";
    i.fillText(h, 7, 25);
    var i = n.getImageData(0, 0, a.width, a.height);
    e.push(hashArrayBufferAsync(i.data));
    var h = n.getImageData(0, 0, a.width, a.height);
    e.push(hashArrayBufferAsync(h.data));
    var i = a;
    i.width = 131;
    i.height = 115;
    n.globalCompositeOperation = "multiply";
    var o = [["#E3E", 55, 55], ["#3EE", 95, 55], ["#EE3", 70, 90]];
    for (var f = 0; f < o.length; f++) {
        n.fillStyle = o[f][0];
        n.beginPath();
        n.arc(o[f][1], o[f][2], 45, 0, 2 * Math.PI, true);
        n.closePath();
        n.fill();
    }
    n.fillStyle = "#EA3";
    n.arc(65, 65, 65, 0, 2 * Math.PI, true);
    n.arc(65, 65, 30, 0, 2 * Math.PI, true);
    n.fill("evenodd");
    h = n.getImageData(0, 0, a.width, a.height);
    e.push(hashArrayBufferAsync(h.data));
    Promise.all(e).then(function (a) {
        var t = stringifyHash(a[0]) != stringifyHash(a[1]);
        var e = a[0].map(function (t, e) {
            return t ^ a[2][e];
        });
        if (t) {
            r("UNST");
        }
        r(stringifyHash(e));
    }).catch(t);
}).catch(function (t) {
    return t.message;
}).then(function (t) {
    self.postMessage({
        cat: 1,
        ch: t
    });
});
var data2 = {
    cat: 2
};
function picassoCanvas(v, w, E) {
    return new Promise(function (t) {
        var i = E.area;
        var r = E.offsetParameter;
        var e = E.multiplier;
        var h = E.fontSizeFactor;
        var g = E.maxShadowBlur;
        function a(t) {
            this.currentNumber = t % r;
            if (this.currentNumber <= 0) {
                this.currentNumber += r;
            }
        }
        function o(t, e, a) {
            t = (t - 1) / r;
            return a ? t * e : Math.floor(t * e);
        }
        a.prototype.getNext = function () {
            this.currentNumber = Math.max(e * this.currentNumber % r, 2);
            return this.currentNumber;
        };
        var f = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D", "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC", "#66994D", "#B366CC", "#4D8000", "#B33300", "#CC80CC", "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399", "#E666B3", "#33991A", "#CC9999", "#B3B31A", "#00E680", "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933", "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3", "#E64D66", "#4DB380", "#FF4D4D", "#99E6E6", "#6666FF"];
        var s = [function (t, e, a) {
            e.beginPath();
            e.arc(o(t.getNext(), a.width / 2), o(t.getNext(), a.height / 2), o(t.getNext(), Math.min(a.width / 4, a.height / 4)), o(t.getNext(), 2 * Math.PI, true), o(t.getNext(), 2 * Math.PI, true));
            e.stroke();
        }, function (t, e, a) {
            var r = Math.max(1, o(t.getNext(), 5));
            var r = function (t, e) {
                var a = [];
                for (var r = 0; r < e; r++) {
                    var n = 65 + t.getNext() % 61;
                    a.push(String.fromCharCode(n));
                }
                return a.join("");
            }(t, r);
            e.font = a.height / h + "px aafakefontaa";
            e.fillText(r, o(t.getNext(), a.width), o(t.getNext(), a.height), o(t.getNext(), a.width));
        }, function (t, e, a) {
            e.beginPath();
            e.moveTo(o(t.getNext(), a.width), o(t.getNext(), a.height));
            e.bezierCurveTo(o(t.getNext(), a.width), o(t.getNext(), a.height), o(t.getNext(), a.width), o(t.getNext(), a.height), o(t.getNext(), a.width), o(t.getNext(), a.height));
            e.stroke();
        }, function (t, e, a) {
            e.beginPath();
            e.moveTo(o(t.getNext(), a.width), o(t.getNext(), a.height));
            e.quadraticCurveTo(o(t.getNext(), a.width), o(t.getNext(), a.height), o(t.getNext(), a.width), o(t.getNext(), a.height));
            e.stroke();
        }];
        function c(t, e, a) {
            var r = Math.max(1, o(t.getNext(), 5));
            var n = String.fromCharCode(9654, 65039);
            e.font = a.height / h + "px aafakefontaa";
            e.fillText(n + r, o(t.getNext(), a.width), o(t.getNext(), a.height), o(t.getNext(), a.width));
        }
        var u = new a(w);
        var n = new OffscreenCanvas(i.width, i.height);
        var l = n.getContext("2d");
        function d(t) {
            var r;
            var n;
            r = i;
            (r = l.createRadialGradient(o(u.getNext(), r.width), o(u.getNext(), r.height), o(u.getNext(), r.width), o(u.getNext(), r.width), o(u.getNext(), r.height), o(u.getNext(), r.width))).addColorStop(0, f[o(u.getNext(), f.length)]);
            r.addColorStop(1, f[o(u.getNext(), f.length)]);
            l.fillStyle = r;
            l.shadowBlur = o(u.getNext(), g);
            l.shadowColor = f[o(u.getNext(), f.length)];
            if (0 == t) {
                (n = s[1])(u, l, i);
            } else {
                n = 1 == t ? c : s[o(u.getNext(), s.length)];
            }
            n(u, l, i);
            l.fill();
        }
        var x = [];
        for (var m = 0; m <= v; m++) {
            d(v - m);
            var N = l.getImageData(0, 0, n.width, n.height);
            x.push(hashArrayBufferAsync(N.data));
        }
        t(Promise.all(x).then(function (t) {
            var e = t[0].length;
            var a = e * t.length;
            var r = new Uint8Array(a);
            for (var n = 0; n < t.length; n++) {
                r.set(t[n], n * e);
            }
            return hashArrayBufferAsync(r);
        }));
    });
}
function collectPicasso(r) {
    var t = performance.now();
    new Promise(function (t) {
        var e = 0;
        for (var a = 0; a < r.length; a++) {
            e += r.charCodeAt(a);
        }
        if (0 == (e %= 10)) {
            e++;
        }
        t(picassoCanvas(data2.pns = 7, data2.ps = e, {
            area: {
                width: 300,
                height: 300
            },
            offsetParameter: 2001000001,
            fontSizeFactor: 1.5,
            multiplier: 15e3,
            maxShadowBlur: 50
        }));
    }).then(function (t) {
        data2.ph = stringifyHash(t);
    }).catch(function (t) {
        data2.e = "Err:" + safeBtoa(t.message.slice(0, 150));
    }).then(function () {
        data2.pt = performance.now() - t;
        self.postMessage(data2);
    });
}
self.onmessage = function (t) {
    if (t.data.is) {
        collectPicasso(t.data.is);
    }
};