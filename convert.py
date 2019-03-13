import tensorflowjs as tfjs
import keras
import numpy as np
model = keras.models.load_model('./models/pets-nasnetmobile-all-nontrainable-30-0.91.hdf5')
tfjs.converters.save_keras_model(model, "./models/quantized", quantization_dtype=np.uint8)