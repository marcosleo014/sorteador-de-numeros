const quantityInput = document.querySelector('#numbers');
const minValueInput = document.querySelector('#minValue');
const maxValueInput = document.querySelector('#maxValue');
const repeatCheckbox = document.querySelector('#repeatCheckbox');
const resultListElement = document.querySelector('.result-list');
const drawButton = document.querySelector('.btn-draw');
const drawRepeatButton = document.querySelector('.draw-repeat');
const skipAnimationButton = document.querySelector('.skip-animation');
const drawSection = document.querySelector('.draw');
const resultSection = document.querySelector('.result');
const form = document.querySelector('form');
const msgToastContainer = document.querySelector('.msg-toast');
const btnToast = document.querySelector('.close-toast');
let timeoutId;

drawButton.onclick = (event) => {
    event.preventDefault();

    // Construção do Array com número sorteado
    const drawnNumbers = [];
    const quantity = Number(quantityInput.value);
    const min = Number(minValueInput.value);
    const max = Number(maxValueInput.value);

    console.log(max == '' || min == '' || quantity == '')

    if (quantity == '') {
        toastMsg('Escolha a quantidade de números sorteados');
        quantityInput.focus();
        return;
    }
    if (min == '') {
        toastMsg('Determine o valor mínimo para o sorteio');
        minValueInput.focus();
        return;
    }
    if (max == '') {
        toastMsg('Determine o valor máximo para o sorteio');
        maxValueInput.focus();
        return;
    }

    if (max <= min) {
        toastMsg('Os limites para o sorteio não fazem sentido')
        maxValueInput.value = '';
        minValueInput.value = '';
        minValueInput.focus();
        return;
    }
    if ((quantity > max - min + 1) && repeatCheckbox.checked) {
        toastMsg('Não é possível sortear essa quantidade sem repetir')
        quantityInput.value = '';
        quantityInput.focus();
        return;
    }


    while (drawnNumbers.length < quantity) {
        const number = generateRandomNumber(min, max);
        if (repeatCheckbox.checked && drawnNumbers.includes(number)) {
            continue;
        };
        drawnNumbers.push(number);
    };
    // --------------------------------------

    // adicionar os números sorteados na ul
    drawnNumbers.forEach(number => {
        addDrawnNumber(number);
    })
    // -------------------------------------------------
    document.querySelectorAll('li').forEach(li => {
        //evento que add a class finished quando a animação termina
        li.addEventListener('animationstart', () => {
            console.log('animação concluída')
            li.classList.add('finished');
        });
    });
    toggleSections();

    // animação do resultado do sorteio
    timeoutId = toggleButton(drawnNumbers.length * 2000);
    document.querySelectorAll('li').forEach((element, index) => {
        startAnimation(element, 2 * index);
    })
};

//  ------- slider para configurar a repetição de números no sorteio
repeatCheckbox.onchange = (event) => {
    if (repeatCheckbox.checked) {
        toastMsg('Não será permitido números sorteados repetidos')
    } else {
        toastMsg('Será permitido números sorteados repetidos')
    }
};

// ----------------- refazer sorteio -----------------------
drawRepeatButton.onclick = (event) => {

    resultListElement.replaceChildren();
    toggleButton()
    toggleSections();
}

// -------------------- pular animação de sorteio ----------------
skipAnimationButton.onclick = (event) => {
    document.querySelectorAll('li:not(.finished)').forEach(li => {
        li.style.animation = 'none';
        li.style.animation = 'skipAnimation 1s both';
        li.firstElementChild.style.animation = 'none';

    })
    clearTimeout(timeoutId);
    toggleButton();
};


// validação dos inputs 
[quantityInput, maxValueInput, minValueInput].forEach(input => {
    input.oninput = (event) => {
        event.target.value = event.target.value.replace(/\D+/g, '');
    }
})


// -------------------- toast msg -----------------
let toastTimeout;

function toastMsg(msg) {
    btnToast.closest('aside').style.display = 'flex';
    msgToastContainer.innerText = msg;
    const toastContainer = msgToastContainer.closest('.toast-notification');
    toastContainer.classList.remove('toast-off');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toastContainer.classList.add('toast-off');
    }, 6000);
}

// --------------- button close of toast ----------------
btnToast.addEventListener('click', () => {
    btnToast.closest('aside').style.display = 'none'
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
    const span = document.createElement('span')
    li.innerText = number.toString();
    li.append(span)
    resultListElement.append(li);
};

function startAnimation(element, delay) {
    element.style.animationDelay = `${delay}s`
    element.firstElementChild.style.animationDelay = `${delay}s`
    element.classList.add('number');
    element.firstElementChild.classList.add('backgroundNumber');
}

function toggleButton(time = 0) {
    const timeoutId = setTimeout(() => {
        if (getComputedStyle(drawRepeatButton).display == 'none') {
            skipAnimationButton.style.display = 'none';
            drawRepeatButton.style.display = 'flex';
        } else {
            skipAnimationButton.style.display = 'flex';
            drawRepeatButton.style.display = 'none';
        }
    }, time);
    return timeoutId;
}



