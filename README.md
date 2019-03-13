# tensorflowjs_demo

## Directory Structure

```
tensorflowjs_demo
├── convert.py
├── css
├── images
├── index.html
├── mobileNet.html
├── models
├── README.md
├── sketch.js
└── sketch_mobileNet.js
```

## Model
[pets-nasnetmobile-all-nontrainable-30-0.91.hdf5](https://drive.google.com/file/d/1YW1SQ0C3Qb8bDSYzcwgC1kcBF_lb9716/view?usp=sharing_eip&ts=5c877267)


## Steps to convert keras model to tensorflowjs format
https://www.tensorflow.org/js/tutorials/conversion/import_keras?hl=kn
- Install tensorflowjs
`pip install tensorflowjs`

- Using bash
```bash
tensorflowjs_converter --input_format keras \
                       path/to/my_model.h5 \
                       path/to/tfjs_target_dir
```

- Using python
```python
import tensorflowjs as tfjs

def train(...):
    model = keras.models.Sequential()   # for example
    ...
    model.compile(...)
    model.fit(...)
    tfjs.converters.save_keras_model(model, tfjs_target_dir)
```

**Note**: The model generated with bash gives an error while loading. Use `convert.py` for our model.

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
Live preview: https://difference-engine.github.io/tensorflowjs_demo/
### Loading the model
```javascript
classifier = await tf.loadLayersModel('model.json');
```
### Inference
```javascript
prediction = await classifier.predict(image)
```
**Note**: First inference is very slow in browser because time of first call also includes the compilation time of WebGL shader programs for the model. [Refer](https://github.com/tensorflow/tfjs-converter#faq).
