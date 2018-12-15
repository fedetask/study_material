graphDiv = 'myDiv'

var scatter = {
  x: [],
  y: [],
  mode: 'markers',
  type: 'scatter'
}

var line = {
  x: [],
  y: [],
  mode: 'lines'
}

var data = [scatter]
Plotly.newPlot(graphDiv, data);

/* Our cost function is given by the sum of the squared errors:
 * for each (x,y), we calculate the hypothesis h(x) and the error h(x) - y
 * the cost function is then (1/2m)*sum((h(x) - y)^2), where (1/2m) is added
 * to simplify the derivative after.  
 * 
 * @param {points}  array of bidimensional points
 * @param {m}       current m value of the hypothesis
 * @param {q}       current q value of the hypothesys
 * @return          cost for the given points and hypothesis
 */
function cost(points, m, q) {
  let n = points.length
  let totalCost = 0

  for (var i = 0; i < n; i++) {
    let point = points[i]
    let h = point.x * m + q
    totalCost += Math.pow(h - point.y, 2)
  }
  return totalCost / (2 * n)
}

/* This function calculates the derivatives of the cost function respect to m and q
 * The derivative with respect to m is (1/n) * sum (x * (mx + q - y))
 * The derivative with respect to q is (1/n) * sum (mx + q - y)
 * 
 * @param pointsx    array of x coordinates
 * @param pointsy    array of y coordinates. Must have the same length of pointsx
 * @param {m}       current m value of the hypothesis
 * @param {q}       current q value of the hypothesys
 * @return          array with dm: derivative respect m and dq: derivative respect q
 */
function derivatives(pointsx, pointsy, m, q) {
  let dm = 0
  let dq = 0
  let n = pointsx.length
  for (let i = 0; i < n; i++) {
    dm += pointsx[i] * (m * pointsx[i] + q - pointsy[i])
    dq += m * pointsx[i] + q - pointsy[i]
  }
  return { dm: dm / n, dq: dq / n }
}

/* This function returns the updated values for m and q
 * 
 * @param {points}  array of bidimensional points
 * @param {m}       current m value of the hypothesis
 * @param {q}       current q value of the hypothesys
 * @return          array {newm: new value of m, newq: new value of q}
 */
function update(pointsx, pointsy, m, q, learningRate) {
  ders = derivatives(pointsx, pointsy, m, q)
  let newm = m - learningRate * ders.dm
  let newq = q - learningRate * ders.dq
  return { newm: newm, newq: newq }
}

/* Executes gradient descent algorithm and returns the final values of m and q
 * It stops after the given number of iterations
 * 
 * @param points       array of points
 * @param learningRate learning rate parameter that the derivative is multiplied for
 * @param iterations   number of iterations to do
 */
function gradientDescent(pointsx, pointsy, learningRate, iterations) {
  let m = 0;
  let q = 0;
  for (let i = 0; i < iterations; i++) {
    updated = update(pointsx, pointsy, m, q, learningRate)
    m = updated.newm
    q = updated.newq
  }
  return { m: m, q: q }
}


function addPoint() {
  newx = parseInt(document.getElementById('pointx').value)
  newy = parseInt(document.getElementById('pointy').value)
  scatter.x.push(newx)
  scatter.y.push(newy)
  Plotly.newPlot(graphDiv, data);
}

function run() {
  result = gradientDescent(scatter.x, scatter.y, 0.01, 1000)
  console.log(`${result.m}   ${result.q}`)
  min = Math.min(...scatter.x)
  max = Math.max(...scatter.y)

  range = max - min
  lineStart = min - range * 0.2
  lineEnd = max + range * 0.2

  line.x.push(lineStart)
  line.y.push(result.m * lineStart + result.q)

  line.x.push(lineEnd)
  line.y.push(result.m * lineEnd + result.q)
}