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

const result = document.getElementById('result'); // The result tag in the HTML
const probability = document.getElementById('probability'); // The probability tag in the HTML

// Initialize the Image Classifier method
let classifier, loadStartTime, loadCompleteTime;
async function loadModel() {
  loadStartTime = window.performance.now()
  console.log("Loading model...")
  classifier = await tf.loadLayersModel('./models/pets_quantized/model.json');
  loadCompleteTime = window.performance.now()
  console.log("Model loaded in " + Number.parseFloat(loadCompleteTime - loadStartTime).toFixed(2).toString() + "ms")
  modelLoaded()
  classifyImage()
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
  imgEl_exp = imgEl_tf.div(127.5).sub(1).expandDims(0) //Normalise
  data = imgEl_exp
  prediction = await classifier.predict(tf.image.resizeBilinear(imgEl_exp, [224, 224]))
  inferenceCompleteTime = window.performance.now()
  console.log("Inference completed in " + Number.parseFloat(inferenceCompleteTime - inferenceStartTime).toFixed(2).toString() + "ms")
  prediction.array().then(n => prob = Math.max(...n[0])).then(n => {
    let prob = n * 100;
    probability.innerText = Number.parseFloat(prob).toFixed(2) + '%';
  })
  prediction.argMax(1).data().then(resultTxt => resultTxt[0]).then(resultTxt => {
    result.innerText = class_names[resultTxt]
    console.log(class_names[resultTxt])
  })
}

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