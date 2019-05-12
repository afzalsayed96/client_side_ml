const image = document.getElementById('image'); // The image we want to classify
const dropContainer = document.getElementById('container');
const warning = document.getElementById('warning');
const fileInput = document.getElementById('fileUploader');

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
};

function windowResized() {
    let windowW = window.innerWidth;
    if (windowW < 480 && windowW >= 200) {
        image.style.maxWidth = windowW - 80;
        dropContainer.style.display = 'block';
    } else if (windowW < 200) {
        dropContainer.style.display = 'none';
    } else {
        image.style.maxWidth = '90%';
        dropContainer.style.display = 'block';
    }
}

['dragenter', 'dragover'].forEach(eventName => {
    dropContainer.addEventListener(eventName, e => dropContainer.classList.add('highlight'), false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropContainer.addEventListener(eventName, e => dropContainer.classList.remove('highlight'), false)
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropContainer.addEventListener(eventName, preventDefaults, false)
});

dropContainer.addEventListener('drop', gotImage, false)

function gotImage(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 1) {
        console.error('upload only one file');
    }
    const file = files[0];
    const imageType = /image.*/;
    if (file.type.match(imageType)) {
        warning.innerHTML = '';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            image.src = reader.result;
            setTimeout(classifyImage, 100);
        }
    } else {
        image.src = 'images/sphynx.jpg';
        setTimeout(classifyImage, 100);
        warning.innerHTML = 'Please drop an image file.'
    }
}

function handleFiles() {
    const curFiles = fileInput.files;
    if (curFiles.length === 0) {
        image.src = 'images/sphynx.jpg';
        setTimeout(classifyImage, 100);
        warning.innerHTML = 'No image selected for upload';
    } else {
        image.src = window.URL.createObjectURL(curFiles[0]);
        warning.innerHTML = '';
        setTimeout(classifyImage, 100);
    }
}

function clickUploader() {
    fileInput.click();
}


// Initialize the Style Transfer method
let classifier, loadStartTime, loadCompleteTime;
async function loadModel() {
    loadStartTime = window.performance.now()
    console.log("Loading model...")
    classifier = await tf.loadGraphModel('https://afzalsayed96.github.io/client_side_ml/extension/style_transfer/line_style_model/model.json');
    loadCompleteTime = window.performance.now()
    console.log("Model loaded in " + Number.parseFloat(loadCompleteTime - loadStartTime).toFixed(2).toString() + "ms")
    modelLoaded()
}
loadModel()

function modelLoaded() {
    document.getElementById('loader').style.display = "none"
    document.getElementById('container').style.display = "block"
}

let data
async function classifyImage() {
    inferenceStartTime = window.performance.now()
    console.log("Starting Inference...")
    imgEl_tf = tf.browser.fromPixels(image);
    imgEl_exp = imgEl_tf.div(127.5).sub(1) //Normalise
    data = imgEl_exp
    result = await classifier.execute(tf.image.resizeBilinear(imgEl_exp, [256, 256]))
    inferenceCompleteTime = window.performance.now()
    console.log("Inference completed in " + Number.parseFloat(inferenceCompleteTime - inferenceStartTime).toFixed(2).toString() + "ms")
    result = tf.image.resizeBilinear(result, [image.height, image.width])
    await result.data()
        .then(data => {
            var array = Array.prototype.slice.call(data);
            result = array
            var resultArr = result
            var c = document.createElement("canvas");
            c.width = image.width;
            c.height = image.height;
            var ctx = c.getContext("2d");
            var imgData = ctx.createImageData(image.width, image.height);

            var i;
            for (i = 0, j = 0; i < imgData.data.length; i += 4, j += 3) {
                imgData.data[i + 0] = resultArr[j];
                imgData.data[i + 1] = resultArr[j + 1];
                imgData.data[i + 2] = resultArr[j + 2];
                imgData.data[i + 3] = 255;
            }

            ctx.putImageData(imgData, 0, 0);
            var d = c.toDataURL("image/png");
            image.src = d
        })

}