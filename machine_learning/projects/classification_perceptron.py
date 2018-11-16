import matplotlib.pyplot as plt
import numpy as np

def boundary(objects, labels):
    theta = np.array([0, 0])
    iterate = True

    while iterate:
        errors = 0
        for point, label in zip(objects, labels):
            check = label * np.dot(point, theta)
            if check <= 0:
                increment = np.multiply(label, point)
                theta = theta + increment
                errors = errors + 1

        if errors == 0:
            iterate = False
    return theta


if __name__ == "__main__":
    objects = np.array([[1,2], [3,3], [4,4], [4,1], [6,1], [7,2], [1,5], [0,3], [4,2]])
    labels  = np.array([1, 1, 1, -1, -1, -1, 1, 1, -1])

    theta = boundary(objects, labels)
    for point, label in zip(objects, labels):
        if label == 1:
            plt.scatter(point[0], point[1], c="red")
        else:
            plt.scatter(point[0], point[1], c="blue")

x = np.array(range(1,8))
y = np.multiply(0.6666666, x)
plt.plot(x,y)
plt.show()
