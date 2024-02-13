window.onload = start;

const operationSigns = ['+', '-', '*', ':'];
const operations = {
    '+': addition,
    '-': substruction,
    '*': multiplication,
    ':': division
};

const randomFloat = function () {
    const int = window.crypto.getRandomValues(new Uint32Array(1))[0]
    return int / 2 ** 32
}

const randomInt = function (min, max) {
    const range = max - min
    return Math.floor(randomFloat() * range + min)
}

function start(){
    const examples = document.getElementById('examples');
    const iterations = 100;
    let examplesString = '';

    for (let index = 0; index < iterations; index++) {
        const operator = operationSigns[randomInt(0, operationSigns.length)];
        const operands = operations[operator]();
        examplesString += `<p>${index + 1}) ${operands[0]} ${operator} ${operands[1]} =</p>`;
    }
    
    examples.innerHTML = examplesString;
}

function numberDimension(n, s){
    const startFrom = !s ? 1 : s;
    const dimension = '9'.repeat(n);
    return randomInt(startFrom, Number(dimension))
}

function addition(){
    return [numberDimension(3), numberDimension(3)]
}

function substruction(){
    const operand1 = numberDimension(3);
    const operand2 = generateSmallerOperands(operand1);

    return [operand1, operand2];
}

function multiplication(){
    return [numberDimension(2), numberDimension(1)]
}

function division(){
    const operand1 = numberDimension(2);
    const operand2 = generateWoReminder(operand1);

    return [operand1, operand2];
}


function generateSmallerOperands(operand){
    let operand2;
    do {
        operand2 = numberDimension(3);
    } while (operand2 > operand)
    return operand2;
}

function generateWoReminder(operand){
    let operand2;
    let i = 0;
    do {
        operand2 = numberDimension(1, 2);
        i++;
    } while (operand % operand2 != 0 && i < 100);
    if(i === 100) {
        operand2 = operand;
    }
    return operand2;
}