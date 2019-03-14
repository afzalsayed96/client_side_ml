var images = [], image_parents = [];
var elements = document.body.getElementsByTagName("img");
var body = document.body;
[...elements].map((el) => {
    if (el.height > 100 && el.width > 100) {
        scanImgs(el)
    }
})

/* MutationObserver callback to add images when the body changes */
// var callback = function (mutationsList, observer) {
//     for (var mutation of mutationsList) {
//         if (mutation.type == 'childList') {
//             Array.prototype.forEach.call(mutation.target.children, function (el) {
//                 if (el.tagName.toLowerCase() === "img")
//                     scanImgs(el)
//             });
//         }
//     }
// }
// var observer = new MutationObserver(callback);
// var config = {
//     characterData: true,
//     attributes: false,
//     childList: true,
//     subtree: true
// };

// observer.observe(body, config);
// console.log(images)

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
        data_1 = data
        var array = Array.prototype.slice.call(data_1);
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