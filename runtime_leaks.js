 const alterText = id => {
    const node = document.getElementById(id);
    node.innerText = node.innerText.replace("assuming no", "assuming yes");
};

    const getConsoleAPICalledTest = (caseId, callback) => {
    // Runtime.consoleAPICalled (Runtime.RemoteObject)
    return async () => {
    // Sample code here targeting isArrayLike from v8/src/inspector/value-mirror.cc
    const a = {};
    a.splice = () => null;
    Object.defineProperty(a, "length", {
    get: () => {
    callback();
    return 10 * caseId;
}
});
    console.log(a);
};
};

    const getExceptionThrownTest = (caseId, callback) => {
    // Runtime.exceptionThrown (Runtime.ExceptionDetails)
    return async () => {
    // Sample code here targeting descriptionForError from v8/src/inspector/value-mirror.cc
    const err = new Error("foo" + caseId);
    Object.defineProperty(err, "stack", {
    get: () => {
    callback();
    return "bar" + caseId;
},
});
    throw err;
};
};

    // Test 1
    getConsoleAPICalledTest(1, () => { alterText("result1"); })();

    // Test 2
    getExceptionThrownTest(2, () => { alterText("result2"); })();

    const wrapWithWorker = (caseId, test) => {
    return async () => {
    const payload = `
            const caseId = ${caseId};
            const callback = () => { postMessage("result${caseId}"); };
            (${test().toString()})();
          `;
    const url = URL.createObjectURL(new Blob([payload], { type: "text/javascript" }));
    const worker = new Worker(url);
    worker.addEventListener('message', event => {
    alterText(event.data);
});
};
};

    // Test 3
    wrapWithWorker(3, getConsoleAPICalledTest)();

    // Test 4
    wrapWithWorker(4, getExceptionThrownTest)();

    const wrapWithSharedWorker = (caseId, test) => {
    return async () => {
    const payload = `
            const p = new Promise(resolve => {
              const caseId = ${caseId};
              const callback = () => { resolve("result${caseId}"); };
              (${test().toString()})();
            });
            onconnect = async event => {
              event.ports[0].postMessage(await p);
            };
          `;
    const url = `data:text/javascript;base64,${btoa(payload)}`;
    const worker = new SharedWorker(url);
    worker.port.start();
    worker.port.addEventListener('message', event => {
    alterText(event.data);
});
};
};

    // Test 5
    wrapWithSharedWorker(5, getConsoleAPICalledTest)();

    // Test 6
    wrapWithSharedWorker(6, getExceptionThrownTest)();

    const wrapWithIframe = (caseId, test) => {
    return async () => {
    const payload = `
            <script>
              const caseId = ${caseId};
              const callback = () => { parent.postMessage("result${caseId}", "*"); };
              (${test().toString()})();
            <\/script>
          `;
    const url = URL.createObjectURL(new Blob([payload], { type: "text/html" }));
    addEventListener('message', event => {
    if (event.data == `result${caseId}`)
    alterText(event.data);
});

    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    document.body.appendChild(iframe);
};
};

    // Test 7
    wrapWithIframe(7, getConsoleAPICalledTest)();

    // Test 8
    wrapWithIframe(8, getExceptionThrownTest)();
