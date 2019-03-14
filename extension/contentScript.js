var images = [], image_parents = [];
var elements = document.body.getElementsByTagName("img");
var body = document.body;
Array.prototype.forEach.call(elements, function (el) {
    if (el.height > 100 && el.width > 100)
        scanImgs(el)
})

/* MutationObserver callback to add images when the body changes */
var callback = function (mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type == 'childList') {
            Array.prototype.forEach.call(mutation.target.children, function (el) {
                if (el.tagName.toLowerCase() === "img")
                    scanImgs(el)
            });
        }
    }
}
var observer = new MutationObserver(callback);
var config = {
    characterData: true,
    attributes: false,
    childList: true,
    subtree: true
};

// observer.observe(body, config);
// console.log(images)

function normalizeImg(image) {
    image_tf = tf.browser.fromPixels(image);
    image_tf_exp = image_tf.div(127.5).sub(1).expandDims(0) //Normalise
    return tf.image.resizeBilinear(image_tf_exp, [224, 224])
}

function scanImgs(el) {
    images.push(el.src);
    var node = document.createElement("div")
    node.style.position = "relative"
    el.parentNode.appendChild(node)
    el.crossOrigin = "anonymous";
    node.appendChild(el.cloneNode())
    overlay = document.createElement("div")
    overlay.classList.add("tfjs---overlay")
    image_tf = normalizeImg(el)
    chrome.runtime.sendMessage({ type: "image", image: image_tf }, function (response) {
        console.log(response.prediction);
        overlay.innerHTML = response.prediction
    });
    node.appendChild(overlay)
    el.remove()
    images.push(el.src); // save image src
    image_parents.push(el.parentNode); // save image parent
}