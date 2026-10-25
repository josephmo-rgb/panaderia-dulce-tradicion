/* Actividades locales: sin bibliotecas ni solicitudes de red. */
(() => {
  'use strict';
  const page = document.body.dataset.page;

  if (page === 'caja') {
    const form = document.querySelector('#caja-form');
    const inputs = [...form.querySelectorAll('[data-price]')];
    const amount = document.querySelector('#caja-cantidad');
    const total = document.querySelector('#caja-total');
    const validQuantity = input => Math.min(30, Math.max(0, Math.floor(Number(input.value) || 0)));
    const update = () => {
      let pieces = 0;
      let price = 0;
      inputs.forEach(input => {
        const quantity = validQuantity(input);
        pieces += quantity;
        price += quantity * Number(input.dataset.price);
      });
      amount.textContent = pieces + (pieces === 1 ? ' pieza en tu caja' : ' piezas en tu caja');
      total.textContent = '$' + price.toLocaleString('es-MX') + ' MXN';
    };
    form.addEventListener('input', event => {
      const input = event.target;
      if (!input.matches('[data-price]')) return;
      if (input.value !== '') input.value = validQuantity(input);
      update();
    });
    form.addEventListener('change', event => {
      if (event.target.matches('[data-price]')) event.target.value = validQuantity(event.target);
      update();
    });
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', () => { inputs.forEach(input => { input.value = 0; }); update(); });
    update();
  }

  if (page === 'reto') {
    const questions = [
      { question: '¿Qué ingrediente ayuda a que la masa fermente?', options: ['La sal', 'La levadura', 'La mantequilla'], answer: 1, explanation: 'La levadura produce gas durante la fermentación y ayuda a que la masa aumente su volumen.' },
      { question: '¿Qué pan de nuestro catálogo tiene una cubierta de azúcar?', options: ['La concha tradicional', 'El bolillo clásico', 'La baguette'], answer: 0, explanation: 'La concha tradicional se reconoce por su cubierta dulce, que suele decorarse con líneas.' },
      { question: '¿Para qué se amasa el pan?', options: ['Para enfriarlo', 'Para decorarlo', 'Para lograr una masa uniforme y elástica'], answer: 2, explanation: 'El amasado combina los ingredientes y desarrolla una textura uniforme y elástica.' },
      { question: '¿Qué conviene hacer antes de guardar pan recién horneado?', options: ['Encerrarlo de inmediato', 'Dejar que se enfríe', 'Mojarlo con agua'], answer: 1, explanation: 'Dejar que se enfríe permite que salga el vapor y evita acumular humedad al guardarlo.' },
      { question: '¿Todos los panes llevan los mismos ingredientes?', options: ['No, dependen de la receta', 'Sí, siempre', 'Solo cambia la forma'], answer: 0, explanation: 'Las recetas cambian: algunos panes llevan huevo, leche o mantequilla y otros se elaboran con ingredientes diferentes.' }
    ];
    const quiz = document.querySelector('#quiz');
    const result = document.querySelector('#quiz-result');
    const questionTitle = document.querySelector('#quiz-question');
    const options = document.querySelector('#quiz-options');
    const feedback = document.querySelector('#quiz-feedback');
    const progress = document.querySelector('#quiz-progress');
    const next = document.querySelector('#quiz-next');
    let index = 0;
    let score = 0;
    let answered = false;

    const render = (focus = false) => {
      answered = false;
      const item = questions[index];
      document.querySelector('#quiz-step').textContent = 'Pregunta ' + (index + 1) + ' de ' + questions.length;
      progress.value = index;
      progress.textContent = index + ' de ' + questions.length;
      questionTitle.textContent = item.question;
      options.replaceChildren();
      feedback.textContent = '';
      next.hidden = true;
      next.textContent = index === questions.length - 1 ? 'Ver resultado' : 'Siguiente pregunta';
      item.options.forEach((text, number) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'choice';
        button.textContent = text;
        button.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const correct = number === item.answer;
          if (correct) score++;
          [...options.children].forEach((option, optionIndex) => {
            option.disabled = true;
            if (optionIndex === item.answer) option.classList.add('is-selected');
          });
          feedback.textContent = (correct ? '¡Correcto! ' : 'La respuesta es: ' + item.options[item.answer] + '. ') + item.explanation;
          progress.value = index + 1;
          progress.textContent = (index + 1) + ' de ' + questions.length;
          next.hidden = false;
        });
        options.append(button);
      });
      if (focus) questionTitle.focus();
    };
    next.addEventListener('click', () => {
      if (!answered) return;
      if (index < questions.length - 1) { index++; render(true); return; }
      quiz.hidden = true;
      result.hidden = false;
      document.querySelector('#quiz-score').textContent = 'Obtuviste ' + score + ' de ' + questions.length + ' respuestas correctas.';
      document.querySelector('#quiz-result-title').focus();
    });
    document.querySelector('#quiz-restart').addEventListener('click', () => {
      index = 0; score = 0; result.hidden = true; quiz.hidden = false; render(true);
    });
    quiz.hidden = false;
    render();
  }

  if (page === 'combinaciones') {
    const pairings = {
      cafe: {
        description: 'Para tu café: prueba notas de canela, hojaldre y nuez en estas tres combinaciones.',
        breads: [
          ['Oreja crujiente', 'Su hojaldre azucarado aporta un contraste crujiente a cada sorbo.', 15],
          ['Roles de canela', 'El aroma de la canela acompaña el sabor de un café al gusto.', 20],
          ['Pan de nuez', 'Los trozos de nuez dan textura a una pausa tranquila.', 22]
        ]
      },
      chocolate: {
        description: 'Para tu chocolate caliente: una selección suave y dulce para disfrutar sin prisa.',
        breads: [
          ['Concha tradicional', 'La cubierta de azúcar y la miga suave forman una combinación clásica.', 12],
          ['Cuernito de mantequilla', 'Su aroma y textura suave acompañan una bebida de chocolate.', 16],
          ['Pan de elote', 'Su sabor a maíz ofrece una alternativa para variar tu merienda.', 25]
        ]
      },
      leche: {
        description: 'Para tu vaso de leche: elige entre chocolate, fruta y una textura suave y quebradiza.',
        breads: [
          ['Dona de chocolate', 'La cubierta de chocolate suma un toque dulce a tu bebida.', 18],
          ['Polvorón', 'Su textura quebradiza invita a disfrutarlo poco a poco.', 10],
          ['Empanada de piña', 'El relleno de fruta aporta una nota diferente a la combinación.', 15]
        ]
      }
    };
    const selector = document.querySelector('#bebida-selector');
    const result = document.querySelector('#combinacion-resultado');
    const cards = document.querySelector('#combinacion-panes');
    const choose = key => {
      const pairing = pairings[key];
      selector.querySelectorAll('[data-bebida]').forEach(button => {
        const selected = button.dataset.bebida === key;
        button.classList.toggle('is-selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      document.querySelector('#bebida-descripcion').textContent = pairing.description;
      cards.replaceChildren();
      pairing.breads.forEach(([name, description, price]) => {
        const card = document.createElement('article');
        card.className = 'feature-card';
        const title = document.createElement('h3'); title.textContent = name;
        const text = document.createElement('p'); text.textContent = description;
        const cost = document.createElement('p'); cost.className = 'pill'; cost.textContent = '$' + price + ' MXN';
        card.append(title, text, cost); cards.append(card);
      });
    };
    selector.addEventListener('click', event => {
      const button = event.target.closest('[data-bebida]');
      if (button) choose(button.dataset.bebida);
    });
    selector.hidden = false;
    result.hidden = false;
    choose('cafe');
  }
})();