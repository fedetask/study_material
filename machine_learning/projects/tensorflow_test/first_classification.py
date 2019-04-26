# TensorFlow and tf.keras
import tensorflow as tf
from tensorflow import keras

# Helper libraries
import numpy as np
import matplotlib.pyplot as plt

fashion_mnist = keras.datasets.fashion_mnist
class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
               'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']
# We have a training set and a testing set
(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()

# Scaling pixel values in the range [0, 1]
train_images = train_images / 255.0
test_images = test_images / 255.0

# Creating the neural network:
# Layer 1: Flattens the input 28x28 matrix in a 1x784 vector
# Layer 2: Hidden layers, activation relu
# Layer 3: Output layers with softmax
model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation=tf.nn.relu),
    keras.layers.Dense(10, activation=tf.nn.softmax)
])

accuracies = []
# Training for different number of epochs
for epochsnum in range(1,1):
    print ('using epochs: ', epochsnum)
    model.compile(optimizer=tf.train.AdamOptimizer(),
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    model.fit(train_images, train_labels, epochs=epochsnum)

    test_loss, test_acc = model.evaluate(test_images, test_labels)
    accuracies.append(test_acc)

print accuracies

to_predict=1

prediction = model.predict(np.expand_dims(test_images[to_predict], 0))

max_idx = np.argmax(prediction[0])
plt.figure()
plt.imshow(train_images[to_predict])
plt.title(class_names[max_idx])
plt.show()

