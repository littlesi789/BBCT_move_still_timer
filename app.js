document.getElementById('beginButton').addEventListener('click', switchDataCollect)
document.getElementById('collectStart').addEventListener('click', startButton)
document.getElementById('collectStop').addEventListener('click', stopButton)
document.getElementById('downloadButton').addEventListener('click', downloadCSV)

document.getElementById('x').addEventListener('change', testingAcross, false)
document.getElementById('y').addEventListener('change', testingAcross, false)

function testingAcross() {
    dir = document.querySelector('input[name="dir"]:checked').value
    if (dir == 'x') {
        document.getElementById('dirSpan').innerHTML = 'Y'
    } else {
        document.getElementById('dirSpan').innerHTML = 'X'
    }
}

let index = 1
let csv = ''
let constDir = 'x'
let xCoords = 0
let yCoords = 0
let coordInd = 0
const directions = ['N', 'E', 'S', 'W']
let dirInd = 0

let timerStart = Date.now()
let timerInterval

function switchDataCollect() {
    constDir = document.querySelector('input[name="dir"]:checked').value
    if (constDir === 'x') {
        xCoords = Number(document.getElementById('constValInput').value)
        yCoords = document
            .getElementById('rangeValues')
            .value.split(',')
            .map((num) => Number(num))
    } else {
        yCoords = Number(document.getElementById('constValInput').value)
        xCoords = document
            .getElementById('rangeValues')
            .value.split(',')
            .map((num) => Number(num))
    }
    document.getElementById('entry').style.display = 'none'
    document.getElementById('collection').style.display = 'block'
    document.getElementById('currX').innerText =
        typeof xCoords === 'number' ? xCoords : xCoords[0]
    document.getElementById('currY').innerText =
        typeof yCoords === 'number' ? yCoords : yCoords[0]
    document.getElementById('currDir').innerText = directions[0]
    document.getElementById('timer').innerText = '0.0'
    addCSVHead()
}

function startButton() {
    const timestamp = getTimestamp()
    timerStart = Date.now()
    timerInterval = window.setInterval(setTimer, 50)
    const x = typeof xCoords === 'number' ? xCoords : xCoords[coordInd]
    const y = typeof yCoords === 'number' ? yCoords : yCoords[coordInd]
    const dir = directions[dirInd]
    let tableRow = document.createElement('tr')
    tableRow.innerHTML = `<td>${index}</td><td>${timestamp}</td><td>${x}</td><td>${y}</td><td>${dir}</td><td>start</td>`
    document.getElementById('table-body').appendChild(tableRow)
    document.getElementById('collectStart').style.display = 'none'
    document.getElementById('collectStop').style.display = 'inline-block'
    addToCSV(index, timestamp, x, y, dir, 'start')
    index++
}

function stopButton() {
    const timestamp = getTimestamp()
    window.clearInterval(timerInterval)
    const x = typeof xCoords === 'number' ? xCoords : xCoords[coordInd]
    const y = typeof yCoords === 'number' ? yCoords : yCoords[coordInd]
    const dir = directions[dirInd]
    let tableRow = document.createElement('tr')
    tableRow.innerHTML = `<td>${index}</td><td>${timestamp}</td><td>${x}</td><td>${y}</td><td>${dir}</td><td>end</td>`
    document.getElementById('table-body').appendChild(tableRow)
    document.getElementById('collectStart').style.display = 'inline-block'
    document.getElementById('collectStop').style.display = 'none'
    addToCSV(index, timestamp, x, y, dir, 'end')
    index++
    nextPos()
}

function getTimestamp() {
    return new Date().toLocalISOString()
}

function addCSVHead() {
    csv = 'Index,Timestamp,X,Y,Direction,s/e\n'
}

function addToCSV(index, timestamp, x, y, dir, se) {
    csv += `${index},${timestamp},${x},${y},${dir},${se}\n`
}

function nextPos() {
    dirInd++
    if (dirInd >= directions.length) {
        dirInd = 0
        coordInd++
    }
    if (constDir == 'x') {
        if (coordInd >= yCoords.length) {
            downloadCSV()
        }
    } else {
        if (coordInd >= xCoords.length) {
            downloadCSV()
        }
    }
    document.getElementById('currX').innerText =
        typeof xCoords === 'number' ? xCoords : xCoords[coordInd]
    document.getElementById('currY').innerText =
        typeof yCoords === 'number' ? yCoords : yCoords[coordInd]
    document.getElementById('currDir').innerText = directions[dirInd]
}

function downloadCSV() {
    let link = document.createElement('a')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    link.setAttribute('download', 'data.csv')
    link.click()
    reset()
    document.getElementById('entry').style.display = 'block'
    document.getElementById('collection').style.display = 'none'
}

function reset() {
    index = 1
    csv = ''
    constDir = 'x'
    xCoords = 0
    yCoords = 0
    coordInd = 0
    dirInd = 0
    document.getElementById('table-body').innerHTML = ''
}

function setTimer() {
    document.getElementById('timer').innerText = (
        (Date.now() - timerStart) /
        1000
    ).toFixed(1)
}

Date.prototype.toLocalISOString = function () {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
            var norm = Math.floor(Math.abs(num))
            return (norm < 10 ? '0' : '') + norm
        }
    return (
        this.getFullYear() +
        '-' +
        pad(this.getMonth() + 1) +
        '-' +
        pad(this.getDate()) +
        'T' +
        pad(this.getHours()) +
        ':' +
        pad(this.getMinutes()) +
        ':' +
        pad(this.getSeconds()) +
        '.' +
        (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
    )
}
