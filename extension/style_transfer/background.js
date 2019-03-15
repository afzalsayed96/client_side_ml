let classifier
function startup() {
    chrome.storage.sync.get(['model'], function (model) {
        if (Object.keys(model).length !== 0) { console.log("Model loded from memory:", model); }
        else { loadModel() }
    });
    async function loadModel() {
        loadStartTime = window.performance.now()
        console.log("Loading model...")
        classifier = await tf.loadGraphModel('./line_style_model/model.json');
        loadCompleteTime = window.performance.now()
        console.log("Model loaded in " + Number.parseFloat(loadCompleteTime - loadStartTime).toFixed(2).toString() + "ms")
        modelLoaded()
    }
    async function modelLoaded() {
        inferenceStartTime = window.performance.now()
        console.log("Starting Inference...")
        imgEl_tf = tf.zeros([256, 256, 3])
        prediction = await classifier.predict(imgEl_tf)
        inferenceCompleteTime = window.performance.now()
        console.log("Inference completed in " + Number.parseFloat(inferenceCompleteTime - inferenceStartTime).toFixed(2).toString() + "ms")
    }
}
chrome.runtime.onStartup.addListener(function () {
    startup()
    console.log("Started")
});
chrome.runtime.onInstalled.addListener(function () {
    startup()
    console.log("Started")
});


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.type == "image") {
            result = makeStyle(request.data, request.width, request.height)
            result.then((result) => sendResponse({ result: result }));
        }
        return true;
    });


function createTensor(data) {
    return tf.tensor3d(data, [256, 256, 3])
}

async function makeStyle(data, width, height) {
    let result
    let img_tf = createTensor(data)
    result = await classifier.execute(img_tf)
    result = tf.image.resizeBilinear(result, [height, width])
    await result.data()
        .then(data => {
            var array = Array.prototype.slice.call(data);
            result = array
        })
    return result
}