/* Comportamiento compartido; no requiere bibliotecas ni servidor. */
(() => {
    'use strict';
    const nav = document.querySelector('nav');
    if (nav) {
        const ajustarMenu = () => document.documentElement.style.setProperty('--alto-menu', nav.offsetHeight + 'px');
        ajustarMenu();
        if ('ResizeObserver' in window) new ResizeObserver(ajustarMenu).observe(nav);
        else window.addEventListener('resize', ajustarMenu);
    }
    const catalogo = document.querySelector('.catalogo-panes');
    if (catalogo) {
        const tarjetas = [...catalogo.querySelectorAll('.pan-card')];
        const caja = document.createElement('div');
        caja.className = 'buscador';
        caja.innerHTML = '<label for="buscar-pan">Encuentra tu pan favorito</label><input id="buscar-pan" type="search" placeholder="Busca concha, bolillo, chocolate…" aria-controls="lista-panes"><p role="status" aria-live="polite"></p>';
        catalogo.id = 'lista-panes';
        catalogo.before(caja);
        const campo = caja.querySelector('input');
        const estado = caja.querySelector('p');
        const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const datos = tarjetas.map(elemento => ({elemento, texto: normalizar(elemento.textContent)}));
        const filtrar = () => {
            const consulta = normalizar(campo.value.trim());
            let total = 0;
            datos.forEach(({elemento, texto}) => {
                const coincide = texto.includes(consulta);
                elemento.hidden = !coincide;
                if (coincide) total++;
            });
            estado.textContent = total ? total + ' variedades para descubrir.' : 'No encontramos ese pan. Prueba con otro nombre.';
        };
        campo.addEventListener('input', filtrar);
        filtrar();
    }
    // Se anima una sola vez; el contenido permanece visible si JavaScript falla.
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reducir) {
        const observar = new IntersectionObserver(eventos => {
            eventos.forEach(({target, isIntersecting}) => {
                if (!isIntersecting) return;
                target.classList.add('revelar');
                observar.unobserve(target);
            });
        }, {threshold: 0.08});
        document.querySelectorAll('.pan-card, .portal-card, .extra-card, #preparacion > h3, #ingredientes li').forEach(elemento => {
            const grupo = elemento.parentElement;
            const indice = [...grupo.children].indexOf(elemento);
            elemento.style.setProperty('--retardo', (indice % 3) * 60 + 'ms');
            observar.observe(elemento);
        });
    }
})();
