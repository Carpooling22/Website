var logs

function preload() {
    data = loadJSON("log.json")
}



let bDay, bMonth, bYear, eDay, eMonth, eYear, button

var inputStartPositionX = 40
var inputStartPositionY = 20

var inputSize = 50

var distancePerTrip = 25

let beginTime = 0, endTime = 0



var passenger_data = [
    Bob = {
        name: "Bob",
        price: 0.20 * distancePerTrip,
        driven: 0,
        taken: 0,
        debt: 0,
    },
    Matthias = {
        name: "Matthias",
        price: 0.20 * distancePerTrip,
        driven: 0,
        taken: 0,
        debt: 0,
    },
    Arthur = {
        name: "Arthur",
        price: 0.18 * distancePerTrip,
        driven: 0,
        taken: 0,
        debt: 0,
    },
    Gerben = {
        name: "Gerben",
        price: 0,
        driven: 0,
        taken: 0,
        debt: 0,
    },
    Robbe = {
        name: "Robbe",
        price: 0,
        driven: 0,
        taken: 0,
        debt: 0,
    },
    Hannes = {
        name: "Hannes",
        price: 0,
        driven: 0,
        taken: 0,
        debt: 0,
    }
]

function printError(message) {
    background('#add8e6')
    fill(0);
    rect(bYear.x + bYear.width + inputSize / 2, inputStartPositionY + bYear.height / 2 - inputSize / 20, inputSize / 2, inputSize / 10, 4);
    textSize(inputSize)
    fill(255, 0, 0)
    text(message, button.x + button.width + inputSize / 2, inputStartPositionY + inputSize)
    drawLastDate()
}

function daysInMonth(m, y) { // m is 0 indexed: 0-11
    switch (m) {
        case 2:
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28
        case 9: case 4: case 6: case 11:
            return 30
        default:
            return 31
    }
}

function isValid(d, m, y) {
    return m > 0 && m <= 12 && d > 0 && d <= daysInMonth(m, y);
}

function getDates() {
    bDayValue = parseInt(bDay.value())
    bMonthValue = parseInt(bMonth.value())
    bYearValue = parseInt(bYear.value())

    eDayValue = parseInt(eDay.value())
    eMonthValue = parseInt(eMonth.value())
    eYearValue = parseInt(eYear.value())

    if (isValid(bDayValue, bMonthValue, bYearValue) && isValid(eDayValue, eMonthValue, eYearValue) && (convertToTimestamp(eDayValue, eMonthValue, eYearValue) - convertToTimestamp(bDayValue, bMonthValue, bYearValue) >= 0)) {
        beginTime = convertToTimestamp(bDayValue, bMonthValue, bYearValue) / 1000
        endTime = convertToTimestamp(eDayValue, eMonthValue, eYearValue) / 1000 + 86400
        console.log(beginTime); console.log(endTime)
        if (calculatePrice(beginTime, endTime)) {
            console.log('calculatedPrice: ' + calculatePrice(beginTime, endTime))
            calculateDebts(beginTime, endTime)
            drawResults()
        }
        else {
            printError('No Data Availabe')
        }
    }
    else {
        printError('Wrong Data Input')
    }


}

function createInputs() {

    TextSize = String(inputSize * 0.6) + 'px'

    bDay = createInput().attribute('placeholder', 'DD');
    bDay.size(inputSize, inputSize);
    bDay.style('font-size', TextSize)
    bDay.position(inputStartPositionX, inputStartPositionY);

    bMonth = createInput().attribute('placeholder', 'MM');
    bMonth.size(inputSize, inputSize)
    bMonth.style('font-size', TextSize)
    bMonth.position(bDay.x + bDay.width, inputStartPositionY);

    bYear = createInput().attribute('placeholder', 'YYYY');
    bYear.size(inputSize * 2, inputSize)
    bYear.style('font-size', TextSize)
    bYear.position(bMonth.x + bMonth.width, inputStartPositionY);

    fill(0);
    rect(bYear.x + bYear.width + inputSize / 2, inputStartPositionY + bYear.height / 2 - inputSize / 20, inputSize / 2, inputSize / 10, 2);

    eDay = createInput().attribute('placeholder', 'DD');
    eDay.size(inputSize, inputSize);
    eDay.style('font-size', TextSize)
    eDay.position(bYear.x + bYear.width + inputSize * 3 / 2, inputStartPositionY);

    eMonth = createInput().attribute('placeholder', 'MM');
    eMonth.size(inputSize, inputSize)
    eMonth.style('font-size', TextSize)
    eMonth.position(eDay.x + eDay.width, inputStartPositionY);

    eYear = createInput().attribute('placeholder', 'YYYY');
    eYear.size(inputSize * 2, inputSize)
    eYear.style('font-size', TextSize)
    eYear.position(eMonth.x + eMonth.width, inputStartPositionY);

    button = createButton('submit');
    button.size(eYear.height * 3, eYear.height)
    button.position(eYear.x + eYear.width + inputSize / 2, inputStartPositionY);
    button.mousePressed(getDates);

    drawLastDate();
}

function convertToTimestamp(d, m, y) {

    // Unixtimestamp
    var year = y
    var month = m - 1;
    if (!month) {
        year = year - 1;
        year = year.toString();
        month = 12;
        //console.log("ok")
    }
    month = month.toString();
    var day = String(d);
    var hour = '0';
    var minutes = '0';
    var seconds = '1';

    // Convert timestamp to milliseconds
    var datum = new Date(Date.UTC(year, month, day, hour, minutes, seconds));

    var timestamp = datum.getTime()

    return timestamp

}


function addUp(beginTime, endTime) {

    for (let i = 0; i < passenger_data.length; i++) {
        passenger_data[i].taken = 0
        passenger_data[i].driven = 0
    }

    for (let j = 0; j < logs.length; j++) {
        r = logs[j]
        if (r.time > beginTime && r.time <= endTime) {

            for (let i = 0; i < passenger_data.length; i++) {
                passenger_data[i].counted = 0
            }

            for (let i = 0; i < passenger_data.length; i++) {
                if (passenger_data[i].name == r.driver) {
                    passenger_data[i].driven += 1;
                }
                for (let k = 0; k < r.passenger.length && !passenger_data[i].counted; k++) {
                    if (passenger_data[i].name == r.passenger[k]) {
                        passenger_data[i].taken += 1
                        passenger_data[i].counted = 1;
                    }
                }
            }
        }
    }

}

function calculatePrice(beginTime, endTime) {
    let totalPrice = 0
    addUp(beginTime, endTime)

    for (let i = 0; i < passenger_data.length; i++) {
        if (passenger_data[i].driven && passenger_data[i].price) {
            totalPrice += (passenger_data[i].price * passenger_data[i].driven)
        }
    }

    return totalPrice
}

function calculateDebts(beginTime, endTime) {
    let totalPrice = calculatePrice(beginTime, endTime)
    let totalRides = 0
    for (let i = 0; i < passenger_data.length; i++) {
        totalRides += (passenger_data[i].driven + passenger_data[i].taken)
    }
    if (totalRides) {
        for (let i = 0; i < passenger_data.length; i++) {
            passenger_data[i].debt = ((passenger_data[i].driven + passenger_data[i].taken) * totalPrice / totalRides) - passenger_data[i].driven * passenger_data[i].price
        }
    }
}

function drawLastDate() {
    textSize(20)
    fill(0)
    textAlign(LEFT)
    pretext = "Up to date t.e.m. : ";
    text(pretext, bDay.x, bDay.y + bDay.height + 21)
    textStyle(BOLD)
    text(latestTime(), bDay.x + pretext.length * 9, bDay.y + bDay.height + 21)
    textStyle(NORMAL)
    console.log(bDay.x + pretext.length * 9)
}

function drawResults() {

    nameSize = 20*inputSize/50;

    let totalTrips = 0

    for (let i = 0; i < passenger_data.length; i++) {
        totalTrips += passenger_data[i].driven

    }

    let totalPrice = 0

    for (let i = 0; i < passenger_data.length; i++) {
        if (passenger_data[i].driven && passenger_data[i].price) {
            totalPrice += (passenger_data[i].price * passenger_data[i].driven)
        }
    }

    let totalDistance = 0;

    let column_width = 0;

    for (let i = 0; i < passenger_data.length; i++) {
        totalDistance += (passenger_data[i].driven * distancePerTrip)
        column_width = max(column_width, passenger_data[i].name.length * nameSize)
    }

    background('#add8e6')
    fill(0);
    rect(bYear.x + bYear.width + inputSize / 2, inputStartPositionY + bYear.height / 2 - inputSize / 20, inputSize / 2, inputSize / 10, 4);

    margin = 20
    column_count = 3
    row_height = nameSize
    passenger_amount = passenger_data.length
    start_y = inputStartPositionY + bDay.height + margin * 4
    //column_height = windowHeight - (inputStartPositionY + bDay.height + 3 * margin + column_width)

    header = ["", "Gereden", "Mee gereden", "Prijs/km", "Te betalen"]
    footer = ["Totaal", totalTrips * distancePerTrip + "km", "/", totalPrice / (totalTrips * distancePerTrip) + "€/km", totalPrice+"€"]

    fill(0)
    textAlign(CENTER)
    textSize(nameSize)
    textStyle(BOLD)
    y_position = start_y

    for (let i = 0; i < header.length; i++) {
        text(header[i], margin + i * (column_width + margin) + column_width / 2, y_position)
    }

    textStyle(NORMAL)

    for (let i = 0; i < passenger_data.length; i++) {

        y_position = start_y + (i + 1) * (row_height + margin * 2)

        if (passenger_data[i].debt) {
            if (passenger_data[i].debt > 0) {
                fill('#ff3030')
            }
            else {
                fill('#5ed15e')
            }
        }
        else {
            fill('#828282')
        }
        rect(margin + 4 * (column_width + margin), y_position + nameSize / 2, column_width, -(row_height + nameSize), 8)

        fill(0)
        textAlign(CENTER)
        textSize(nameSize)
        text(passenger_data[i].name, margin + column_width / 2, y_position)

        text(passenger_data[i].driven, margin + (column_width + margin) + column_width / 2, y_position)

        text(passenger_data[i].taken, margin + 2 * (column_width + margin) + column_width / 2, y_position)

        if (passenger_data[i].price) {
            fill(0)
            textAlign(CENTER)
            textSize(nameSize)
            text(passenger_data[i].price / distancePerTrip, margin + 3 * (column_width + margin) + column_width / 2, y_position)
        }

        text(-Math.round((passenger_data[i].debt + 0.00001) * 100) / 100 + " €", margin + 4 * (column_width + margin) + column_width / 2, y_position)
        textAlign(LEFT)
    }

    y_position = start_y + (passenger_data.length + 2) * (row_height + margin * 2)
    fill('#828282')
    rect(margin, y_position + nameSize / 2, column_width + 4 * (column_width + margin), -(row_height + nameSize), 8)

    fill(0)
    textAlign(CENTER)
    textSize(nameSize)
    textStyle(BOLD);

    for (let i = 0; i < footer.length; i++) {
        text(footer[i], margin + i * (column_width + margin) + column_width / 2, y_position)
    }

    textStyle(NORMAL)

    drawLastDate()

}

function latestTime() {
    max_time = 0
    for (let i = 0; i < logs.length; i++) {
        max_time = max(max_time, logs[i].time)
    }
    console.log(max_time)
    return convertToUTC(max_time)
}

function convertToUTC(unixtimestamp) {
    var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var date = new Date(unixtimestamp * 1000)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var convdataTime = day + ' / ' + month + ' / ' + year

    return convdataTime

}

function setup() {
    inputSize *= windowWidth/1920
    logs = data.logs
    // create canvas
    createCanvas(windowWidth, windowHeight)
    background('#add8e6')
    createInputs()
}

function draw() {

}
