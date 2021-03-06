# Client Side ML

This project was developed as a side project at [difference-engine.ai](difference-engine.ai)

<img width="300px" src="images/difference-engine-logo.jpg">

## Directory Structure

    client_side_ml
    ├── convert.py
    ├── css
    ├── extension
    │   ├── pets_classification
    │   ├── pets_classification.crx
    │   ├── pets_classification.pem
    │   ├── style_transfer
    │   ├── style_transfer.crx
    │   └── style_transfer.pem
    ├── images
    ├── pets_classification.html
    ├── style_transfer.html
    ├── mobileNet.html
    ├── models
    ├── README.md
    ├── sketch.js
    ├── sketch_mobileNet.js
    └── style_transfer_demo
        ├── convert.py
        ├── custom_layer.js
        └── demo2.html

## Model

[pets-nasnetmobile-all-nontrainable-30-0.91.hdf5](https://drive.google.com/file/d/1YW1SQ0C3Qb8bDSYzcwgC1kcBF_lb9716/view?usp=sharing_eip&ts=5c877267)

## Steps to convert keras model to tensorflowjs format

<https://www.tensorflow.org/js/tutorials/conversion/import_keras?hl=kn>

-   Install tensorflowjs
    `pip install tensorflowjs`

-   Using bash

```bash
tensorflowjs_converter --input_format keras \
                       path/to/my_model.h5 \
                       path/to/tfjs_target_dir
```

-   Using python

```python
import tensorflowjs as tfjs

def train(...):
    model = keras.models.Sequential()   # for example
    ...
    model.compile(...)
    model.fit(...)
    tfjs.converters.save_keras_model(model, tfjs_target_dir)
```

**Note**: The model generated with bash command method gives an error
while loading. Use `convert.py` for our model.
GH issue: <https://github.com/tensorflow/tfjs/issues/755>

## Quantization

We quantize our model in order to reduce it's size

```python
import tensorflowjs as tfjs
import keras
import numpy as np
model = keras.models.load_model('./models/pets-nasnetmobile-all-nontrainable-30-0.91.hdf5')
tfjs.converters.save_keras_model(model, "./models/quantized", quantization_dtype=np.uint8)
```

## Using TensorflowJS for inference

-   Pet Classification preview: <https://afzalsayed96.github.io/client_side_ml/pets_classification.html>
-   Style Transfer preview: <https://afzalsayed96.github.io/client_side_ml/style_transfer.html>

### Loading the model

```javascript
classifier = await tf.loadLayersModel('model.json');
```

### Inference

```javascript
prediction = await classifier.predict(image)
```

**Note**: First inference is very slow in browser because time of first call also includes the compilation time of WebGL shader programs for the model. [Refer](https://github.com/tensorflow/tfjs-converter#faq).

## Extensions

### Pet Classification

extension-file `extension/pet_classification.crx`

<img src="images/pet_demo.gif">

### Style Transfer

extension-file `extension/style_transfer.crx`

<img src="images/style_demo.gif">

## Installing extension

-   Clone the repo
-   In chrome go to `chrome://extensions/`
-   Enable developer mode on the top right.
-   Click on load unpacked on top left
-   Navigate to `extension/pets_classification` or `extension/style_transfer` and click open

**Note**: 

-   Disable the extension when not using
-   Do not enable both extensions at once
