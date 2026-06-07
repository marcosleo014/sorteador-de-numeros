const quantityInput = document.querySelector('#numbers');
const minValueInput = document.querySelector('#minValue');
const maxValueInput = document.querySelector('#maxValue');
const repeatCheckbox = document.querySelector('#repeatCheckbox');
const resultListElement = document.querySelector('.result-list');
const drawButton = document.querySelector('.btn-draw');
const drawRepeatButton = document.querySelector('.draw-repeat');
const drawSection = document.querySelector('.draw');
const resultSection = document.querySelector('.result');
const form = document.querySelector('form')


drawButton.onclick = (event) => {
    event.preventDefault();

    // Construção do Array com número sorteado
    const drawnNumbers = [];
    const quantity = Number(quantityInput.value);
    const min = Number(minValueInput.value);
    const max = Number(maxValueInput.value);

    console.log(max == '' || min == '' || quantity == '')

    if (max == '' || min == '' || quantity == '') {
        alert('Preencha todos os campos antes de sortear');
        return;
    }

    if (max <= min) {
        alert('Esses limites para o sorteio não fazem nenhum sentido')
        maxValueInput.value = '';
        minValueInput.value = '';
        return;
    }
    if ((quantity > max - min + 1) && repeatCheckbox.checked) {
        alert('A quantidade de números sorteados ultrapassa a quantidade de números disponíveis')
        quantityInput.value = '';
        return;
    }


    while (drawnNumbers.length < quantity) {
        const number = generateRandomNumber(min, max);
        if (repeatCheckbox.checked && drawnNumbers.includes(number)) {
            continue;
        };
        drawnNumbers.push(number)
    };  
    // --------------------------------------

    // adicionar os números sorteados na ul
    drawnNumbers.forEach(number => {
        addDrawnNumber(number);
    })
    // -------------------------------------------------

    toggleSections();
    console.log(drawnNumbers);
};

// ----------------- repetir sorteio -----------------------
drawRepeatButton.onclick = (event) => {

    resultListElement.replaceChildren();
    toggleSections();
}
// --------------------------------------------------------


// validação dos inputs 
[quantityInput, maxValueInput, minValueInput].forEach(input => {
    input.oninput = (event) => {
        event.target.value = event.target.value.replace(/\D+/g, '');
    }
})



function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function toggleSections() {
    const toggle = resultSection.hasAttribute('hidden');
    if (toggle) {
        drawSection.hidden = true;
        resultSection.hidden = false;
    } else {
        drawSection.hidden = false;
        resultSection.hidden = true;
    };
};

function addDrawnNumber(number) {
    const li = document.createElement('li');
    li.innerText = number.toString();
    resultListElement.append(li);
};