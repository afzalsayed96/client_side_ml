var images = [], image_parents = [];
var elements = document.body.getElementsByTagName("img");
var body = document.body;
[...elements].map((el) => {
    if (el.height > 100 && el.width > 100) {
        scanImgs(el)
    }
})

function flattenImg(image) {
    image_tf = tf.browser.fromPixels(image);
    return tf.image.resizeBilinear(image_tf, [224, 224])
}

function scanImgs(el) {
    images.push(el.src);
    var node = document.createElement("div")
    node.style.position = "relative"
    el.parentNode.appendChild(node)
    el.crossOrigin = "anonymous";
    node.appendChild(el.cloneNode())
    var overlay = document.createElement("div")
    overlay.classList.add("tfjs---overlay")
    image_tf = flattenImg(el)
    image_tf.data().then((data) => {
        var array = Array.prototype.slice.call(data);
        chrome.runtime.sendMessage({ type: "image", data: array }, function (response) {
            console.log(response);
            overlay.innerHTML = response.prediction
        });
    })

    node.appendChild(overlay)
    el.remove()
    images.push(el.src); // save image src
    image_parents.push(el.parentNode); // save image parent
}