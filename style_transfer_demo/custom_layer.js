class InstanceNormalization extends tf.layers.Layer {
    static className = 'InstanceNormalization';
    constructor({ axis, epsilon, center, scale, beta_initializer, gamma_initializer, beta_regularizer, gamma_regularizer, beta_constraint, gamma_constraint }) {
        super({});
        this.supports_masking = true
        this.axis = axis
        this.epsilon = epsilon
        this.center = center
        this.scale = scale
        this.beta_initializer = tf.initializers[beta_initializer]
        this.gamma_initializer = tf.initializers[gamma_initializer]
        this.beta_regularizer = tf.regularizers[beta_regularizer]
        this.gamma_regularizer = tf.regularizers[gamma_regularizer]
        this.beta_constraint = tf.constraints[beta_constraint]
        this.gamma_constraint = tf.constraints[gamma_constraint]
    }

    build(input_shape) {
        let ndim = input_shape.length
        if (this.axis === 0) {
            throw new ValueError('Axis cannot be zero')
        }
        if ((this.axis !== null) && (ndim === 2)) {
            throw new ValueError('Cannot specify axis for rank 1 tensor')
        }
        this.inputSpec = tf.InputSpec(ndim)
        let shape
        if (this.axis === null) {
            shape = [1]
        }
        else {
            shape = input_shape[this.axis]
        }
        console.log(input_shape, this.axis, shape, this.gamma_initializer, this.gamma_regularizer, this.gamma_constraint)

        if (this.scale) {
            this.gamma = this.addWeight('gamma', shape, undefined, this.gamma_initializer, this.gamma_regularizer, undefined, this.gamma_constraint)
        }
        else {
            this.gamma = null
        }
        if (this.center) {
            this.beta = this.add_weight('beta', shape, undefined, this.beta_initializer, regularizer = this.beta_regularizer, undefined, this.beta_constraint)
        }
        else { this.beta = null }
        this.built = True
    }


    // call = (inputs, kwargs) => {
    //     let input = inputs
    //     if (Array.isArray(input)) {
    //         input = input[0];
    //       }
    //       this.invokeCallHook(inputs, kwargs);
    //       const origShape = input.shape;
    //       const flatShape =
    //           [origShape[0], origShape[1] * origShape[2] * origShape[3]];
    //       const flattened = input.reshape(flatShape);
    //       const centered = tf.sub(flattened, flattened.mean(1).expandDims(1));
    //       const pos = centered.relu().reshape(origShape);
    //       const neg = centered.neg().relu().reshape(origShape);
    //       tf.concat([pos, neg], 3);


    //     input_shape = origShape
    //     reduction_axes = [...Array(input_shape.length).keys()]

    //     if (this.axis !== null){
    //         del reduction_axes[this.axis]
    //     }
    //     del reduction_axes[0]

    //     mean = K.mean(inputs, reduction_axes, keepdims = True)
    //     stddev = K.std(inputs, reduction_axes, keepdims = True) + self.epsilon
    //     normed = (inputs - mean) / stddev

    //     broadcast_shape = [1] * len(input_shape)
    //     if self.axis !== null:
    //     broadcast_shape[self.axis] = input_shape[self.axis]

    //     if self.scale:
    //         broadcast_gamma = K.reshape(self.gamma, broadcast_shape)
    //     normed = normed * broadcast_gamma
    //     if self.center:
    //         broadcast_beta = K.reshape(self.beta, broadcast_shape)
    //     normed = normed + broadcast_beta
    //     return normed
    // }
    get_config() {
        axis = this.axis
        epsilon = this.epsilon
        center = this.center
        scale = this.scale
        beta_initializer = this.beta_initializer
        gamma_initializer = this.gamma_initializer
        beta_regularizer = this.beta_regularizer
        gamma_regularizer = this.gamma_regularizer
        beta_constraint = this.beta_constraint
        gamma_constraint = this.gamma_constraint
        config = {
            'axis': axis,
            'epsilon': epsilon,
            'center': center,
            'scale': scale,
            'beta_initializer': beta_initializer,
            'gamma_initializer': gamma_initializer,
            'beta_regularizer': beta_regularizer,
            'gamma_regularizer': gamma_regularizer,
            'beta_constraint': beta_constraint,
            'gamma_constraint': gamma_constraint
        }
        base_config = this.super({}).get_config()
        return Object.assign(base_config, config)
    }
}

tf.serialization.registerClass(InstanceNormalization);


class DeprocessStylizedImage extends tf.layers.Layer {
    static className = 'DeprocessStylizedImage';


    constructor(kwargs) {
        super({})
    }
    build(input_shape) { }

    call(x) {
        return x.add(1.0).mul(127.5)
    }
}

tf.serialization.registerClass(DeprocessStylizedImage);