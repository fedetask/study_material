graphDiv = 'myDiv'

let scatter = {
  x: [3, 4, 5, 6, 8, 10,],
  y: [3, 5, 3.5, 7, 9.2, 9],
  mode: 'markers',
  type: 'scatter',
  marker: {
    size: 10
  },
  name: 'Points'
}

let emptyLine = {
  x: [],
  y: [],
  mode: 'lines'
}

var improvement
var learningRate
var maxIterations


readInput()
result = gradientDescent(scatter.x, scatter.y, false, false)
currLine = getLine(result.m, result.q)
createGraph(scatter, currLine)
printlog(pointsAsString())

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
function cost(pointsx, pointsy, m, q) {
  let n = pointsx.length
  let totalCost = 0

  for (var i = 0; i < n; i++) {
    let h = pointsx[i] * m + q
    totalCost += Math.pow(h - pointsy[i], 2)
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
function update(pointsx, pointsy, m, q) {
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
function gradientDescent(pointsx, pointsy, animate, log) {
  let m = 0;
  let q = 0;
  let numIterations = 0
  clearLog()
  if (log) {
	  printlog(pointsAsString())
	  printlog('Starting gradient descent: m = 0, q = 0')
  }
  
	while (true) {
	  if(animate){
		animateLine(m,q)
	  }
	  let prevCost = cost(pointsx, pointsy, m, q) //Cost for the current values of m and q
	  let updated = update(pointsx, pointsy, m, q) // Calculating new values for m and q
	  let newCost = cost(pointsx, pointsy, updated.newm, updated.newq) // Cost after update
	  
	  numIterations ++
	  
	  while(newCost > prevCost) { // If the cost doesn't decrease, we reduce the learning rate
		  printlog('LEARNING RATE TOO HIGH: COST IS INCREASING!')
		  learningRate = learningRate/2
		  printlog('LEARNING RATE DECREASED: '+learningRate)
		  setLearningRate(''+learningRate)
		  updated = update(pointsx, pointsy, m, q)
		  newCost = cost(pointsx, pointsy, updated.newm, updated.newq) // Until new cost is lower
	  }
	  
	  m = updated.newm
	  q = updated.newq	  
	  currLine = getLine(m, q)
	  let improv = Math.abs(newCost - prevCost)
	  if(log)printlog('Iteration '+numIterations+' m = '+m.toFixed(3)+', q = '+q.toFixed(3)+', cost decreased by '+improv.toFixed(8))
	  
	  if (improvement && improv <improvement) {
		  console.log('Program finished because of improvement')
		  break
	  }

	  if (maxIterations && numIterations === maxIterations) {
		  console.log('Program finished because of iterations')
		  break
	  }
  }
  if(log)printlog('Finished gradient descent: m = '+m+'   q = '+q)
  return { m: m, q: q, iterations: numIterations}
}

function pointExists(x, y) {
	for (let i = 0; i < scatter.x.length; i++) {
		if (scatter.x[i] === x && scatter.y[i] === y)
			return true
	}
	return false
}

function addPoint() {
	readInput()
	let xstr = document.getElementById('pointx').value
	let ystr = document.getElementById('pointy').value
	if(!xstr || !ystr) {
		console.log('Empty input')
		return
	}
	let newx = Number(xstr)
	let newy = Number(ystr)
  
	if (pointExists(newx, newy)) {
		console.log('Already exists '+newx+'  '+newy)
		return
	}
	
	scatter.x.push(newx)
	scatter.y.push(newy)
  
	let result = gradientDescent(scatter.x, scatter.y, false, true)
	console.log('Gradient descent stopped after '+result.iterations+' iterations.   m: '+result.m+'  q: '+result.q)
	
	let m = result.m
	let q = result.q
	
	createGraph(scatter, currLine)
  }

function getLine(m, q) {
  min = Math.min(...scatter.x)
  max = Math.max(...scatter.x)
  
  let line = {
  x: [],
  y: [],
  mode: 'lines',
  name: 'Fitting'
  }

  range = (max - min) ? (max - min) : 1
  lineStart = (min - range * 0.2) > 0 ? 0 : (min - range * 0.2)
  lineEnd = (max + range * 0.2) < 0 ? 0 : (max + range * 0.2)
  line.x = []
  line.y = []
  
  line.x.push(lineStart)
  line.y.push(m * lineStart + q)

  line.x.push(lineEnd)
  line.y.push(m * lineEnd + q)
  return line
}

function createGraph(scatter, line) {
	minX = Math.min(...scatter.x)
	maxX = Math.max(...scatter.x)
	minY = Math.min(...scatter.y)
	maxY = Math.max(...scatter.y)
	
	minX = minX > 0 ? 0 : minX*0.8 
	maxX = maxX < 0 ? 0 : maxX*1.2
	minY = minY > 0 ? 0 : minY*0.8
	maxY = maxY < 0 ? 0 : maxY*1.2
	console.log('rangex: '+minX+','+maxX+'    rangey: '+minY+','+maxY)
	let layout = {
		autosize: false,
		xaxis: {range: [minX, maxX]},
		yaxis: {range: [minY, maxY]}
	}
	Plotly.newPlot(graphDiv, [scatter, line], layout, {responsive: true});
}

function runAnimation(){
	readInput()
	createGraph(scatter, getLine(0, 0))
	gradientDescent(scatter.x, scatter.y, true, true)
}

function animateLine(m, q) {
	let line = getLine(m,q)
		  Plotly.animate(graphDiv,
			{
				data: [line],
				traces: [1],
				layout: {}
			},
			{
				transition: {
				duration: 2000- Number(document.getElementById('myRange').value)	
			},
				frame: {
					duration: 2000 - Number(document.getElementById('myRange').value),
					redraw: true
				}
			}
		  )
}

function readInput() {
	learningRate = Number(document.getElementById('learningRate').value)
	iterationsRadio = document.getElementById('iterationsRadio')
	improvementRadio = document.getElementById('improvementRadio')
	iterationsInput = document.getElementById('iterationsNumber')
	improvementInput = document.getElementById('improvementValue')
	
	if(iterationsRadio.checked) {
		maxIterations = Number(iterationsInput.value)
		improvement = undefined
	} else {
		improvement = Number(improvementInput.value)
		maxIterations = undefined
	}
}

function recompute() {
	result = gradientDescent(scatter.x, scatter.y, false, true)
	currLine = getLine(result.m, result.q)
	createGraph(scatter, currLine)
}

function removePointButton() {
	let x = Number(document.getElementById('pointx').value)
	let y = Number(document.getElementById('pointy').value)
	removePoint(x,y)
	recompute()
}

function removePoint(x, y) {
	for (let i = 0; i < scatter.x.length; i++) {
		if (scatter.x[i] === x && scatter.y[i] === y) {
			scatter.x.splice(i, 1)
			scatter.y.splice(i, 1)
			recompute()
		}
	}
}

function printlog(val) {
	document.getElementById('resultlog').value += val+'\n'
}

function clearLog() {
	document.getElementById('resultlog').value = '\n'	
}

function setLearningRate(rate) {
	document.getElementById('learningRate').value = rate
}

function pointsAsString() {
	str = 'Points: '
	for (let i = 0; i < scatter.x.length; i++) {
		str += '('+scatter.x[i]+', '+scatter.y[i]+') '
	}
	return str
}
