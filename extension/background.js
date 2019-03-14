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

        if (request.type == "image") {
            result = makePrediction(request.data)
            result.then((prediction) => sendResponse({ prediction: prediction }));
        }
        return true;
    });

function normalizeImg(image_tf) {
    image_tf_exp = image_tf.div(127.5).sub(1).expandDims(0) //Normalise
    return image_tf_exp
}

function createTensor(data) {
    return tf.tensor3d(data, [224, 224, 3])
}

async function makePrediction(data) {
    let result
    let img_tf = createTensor(data)
    let img = normalizeImg(img_tf)
    prediction = await classifier.predict(img)
    await prediction.argMax(1).data().then(resultTxt => resultTxt[0]).then(resultTxt => {
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