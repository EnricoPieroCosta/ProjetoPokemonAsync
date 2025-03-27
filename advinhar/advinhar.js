const paiDosInputs = document.getElementById('paiDosInputs');
const botao = document.getElementById('botao');
const geral = document.getElementsByClassName('geral')[0];
const numAleatorio = Math.floor(Math.random() * 101);
const divLetrasCertas = document.getElementById('letrasCertas');

let nomePokemon; 
let qntInputs;
let input;
let imgPokemon;

fetch(`https://pokeapi.co/api/v2/pokemon/${numAleatorio}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    nomePokemon = data.name;
    imgPokemon = data.sprites.front_default;
    const img = document.createElement('img');
    img.classList.add('image');
    img.style.filter = 'blur(15px)';
    img.src = imgPokemon;
    geral.appendChild(img);

    console.log('Pokémon encontrado:', nomePokemon);
    qntInputs = nomePokemon.length;
    console.log(nomePokemon.length);

    for (let i = 0; i < qntInputs; i++) {
      input = document.createElement('input');
      input.type = "text";
      input.maxLength = "1";
      input.classList.add('input');
      
      input.addEventListener('input', (event) => {
        const currentInput = event.target;
        const nextInput = currentInput.nextElementSibling;
        const prevInput = currentInput.previousElementSibling;

        if (currentInput.value.length === 1 && nextInput && nextInput.tagName === 'INPUT') {
          nextInput.focus();
        }
        else if (currentInput.value.length === 0 && prevInput && prevInput.tagName === 'INPUT') {
          prevInput.focus();
        }

        arrayLetras[i] = currentInput.value;
        console.log(arrayLetras);
      });

      paiDosInputs.appendChild(input);
    }
  })
  .catch(error => console.error('Erro ao buscar o Pokémon:', error));

botao.addEventListener('click', async () => {
  let cont = 0;
  const arrayLetras2 = [];
  const corCerta = [];
  arrayLetras2.length = 0;
  corCerta.length = 0;

  const paiDeTodos = document.getElementById('paiDosInputs');
  
  
  divLetrasCertas.innerHTML = '';

  for (let j = 0; j < nomePokemon.length; j++) {
    console.log(nomePokemon[j]);
    console.log(paiDeTodos.children[j].value);
    if(nomePokemon.includes(paiDeTodos.children[j].value)){
        corCerta.push('yellow')
        arrayLetras2.push(paiDeTodos.children[j].value.toLowerCase());
        if (nomePokemon[j].toLowerCase() === paiDeTodos.children[j].value.toLowerCase()) {
          cont++;
          corCerta.pop();
          corCerta.push('green');
          arrayLetras2.pop()
          arrayLetras2.push(paiDeTodos.children[j].value.toLowerCase());
        }
    }else {
      corCerta.push('');
      arrayLetras2.push(' ');
    }
  }

  if (cont === nomePokemon.length) {
    for (let j = 0; j < arrayLetras2.length; j++) {
      const div = document.createElement('div')
      div.classList.add('divizinha')
      const p = document.createElement('p');
      p.textContent = arrayLetras2[j];
      p.style.backgroundColor = corCerta[j]; 
      div.appendChild(p)
      divLetrasCertas.appendChild(div);
    }
    setTimeout(() => {
      alert('Você acertou o Pokémon!');
      location.reload();
    }, 2000);
  
  } else {
    for (let j = 0; j < arrayLetras2.length; j++) {
      const div = document.createElement('div')
      div.classList.add('divizinha')
      const p = document.createElement('p');
      p.textContent = arrayLetras2[j];
      p.style.backgroundColor = corCerta[j]; 
      div.appendChild(p)
      divLetrasCertas.appendChild(div);
    }
  }
});
