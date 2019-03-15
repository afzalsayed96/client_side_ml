import tensorflowjs as tfjs
import keras
import keras_contrib


class DeprocessStylizedImage(keras.layers.Layer):
    """A layer to deprocess style transfer layer output.
    The style transfer network outputs an image where pixel values are
    between -1 and 1 due to a tanh activation. This layer converts that back
    to normal values between 0 and 255.
    """

    def __init__(self, **kwargs):
        """Initialize the layer.
        Args:
            **kwargs - arguments passed to the Keras layer base.
        """
        super(DeprocessStylizedImage, self).__init__(**kwargs)

    def build(self, input_shape):
        """Build the layer."""
        pass

    def call(self, x):
        """Apply the layer."""
        return (x + 1.0) * 127.5


custom_objects = {
    'InstanceNormalization': keras_contrib.layers.InstanceNormalization,
    'DeprocessStylizedImage': DeprocessStylizedImage
}

model = keras.models.load_model('./starry_night.h5', custom_objects=custom_objects)
tfjs.converters.save_keras_model(model, "./models")
