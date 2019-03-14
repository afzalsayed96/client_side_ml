let classifier
function startup() {
    chrome.storage.sync.get(['model'], function (model) {
        if (Object.keys(model).length !== 0) { console.log("Model loded from memory:", model); }
        else { loadModel() }
    });
    async function loadModel() {
        loadStartTime = window.performance.now()
        console.log("Loading model...")
        classifier = await tf.loadLayersModel('https://difference-engine.github.io/tensorflowjs_demo//models/quantized/model.json');
        loadCompleteTime = window.performance.now()
        console.log("Model loaded in " + Number.parseFloat(loadCompleteTime - loadStartTime).toFixed(2).toString() + "ms")
        modelLoaded()
    }
    async function modelLoaded() {
        inferenceStartTime = window.performance.now()
        console.log("Starting Inference...")
        imgEl_tf = tf.zeros([1, 224, 224, 3])
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
        if (request.type == "image")
            sendResponse({ prediction: makePrediction(request.image) });
    });

async function makePrediction(img) {
    console.log(img)
    data = img
    let result
    prediction = await classifier.predict(img)
    prediction.argMax(1).data().then(resultTxt => resultTxt[0]).then(resultTxt => {
        result = class_names[resultTxt]
        console.log(class_names[resultTxt])
    })
    return result
}
let data

let class_names = [
    'Abyssinian',
    'Bengal',
    'Birman',
    'Bombay',
    'British_Shorthair',
    'Egyptian_Mau',
    'Maine_Coon',
    'Persian',
    'Ragdoll',
    'Russian_Blue',
    'Siamese',
    'Sphynx',
    'american_bulldog',
    'american_pit_bull_terrier',
    'basset_hound',
    'beagle',
    'boxer',
    'chihuahua',
    'english_cocker_spaniel',
    'english_setter',
    'german_shorthaired',
    'great_pyrenees',
    'havanese',
    'japanese_chin',
    'keeshond',
    'leonberger',
    'miniature_pinscher',
    'newfoundland',
    'pomeranian',
    'pug',
    'saint_bernard',
    'samoyed',
    'scottish_terrier',
    'shiba_inu',
    'staffordshire_bull_terrier',
    'wheaten_terrier',
    'yorkshire_terrier'
]   