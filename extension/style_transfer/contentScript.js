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
    return tf.image.resizeBilinear(image_tf, [256, 256])
}

function scanImgs(el) {
    images.push(el.src);
    var node = document.createElement("div")
    node.classList.add("tfjs---container")
    node.style.position = "relative"
    el.parentNode.appendChild(node)
    el.crossOrigin = "anonymous";
    node.appendChild(el.cloneNode())
    var overlay = document.createElement("div")
    overlay.classList.add("tfjs---overlay")
    overlay.innerHTML = "<div class='tfjs---text'>Stylize</div>"
    overlay.addEventListener("click", (e) => {
        imgEl = overlay.parentElement.getElementsByTagName("img")[0]
        image_tf = flattenImg(el)
        image_tf.data().then((data) => {
            var array = Array.prototype.slice.call(data);
            chrome.runtime.sendMessage({ type: "image", data: array, width: imgEl.width, height: imgEl.height }, function (response) {
                var resultArr = response.result
                var c = document.createElement("canvas");
                c.width = imgEl.width;
                c.height = imgEl.height;
                var ctx = c.getContext("2d");
                var imgData = ctx.createImageData(imgEl.width, imgEl.height);

                var i;
                for (i = 0, j = 0; i < imgData.data.length; i += 4, j += 3) {
                    imgData.data[i + 0] = resultArr[j];
                    imgData.data[i + 1] = resultArr[j + 1];
                    imgData.data[i + 2] = resultArr[j + 2];
                    imgData.data[i + 3] = 255;
                }

                ctx.putImageData(imgData, 0, 0);
                var d = c.toDataURL("image/png");
                imgEl.src = d
                overlay.remove()
            });
        })
    })

    node.appendChild(overlay)
    el.remove()
    images.push(el.src); // save image src
    image_parents.push(el.parentNode); // save image parent
}

