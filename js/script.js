// ---------- EFECTO DE TIPEO EN EL CUADRO DE DIÁLOGO ----------
const dialogueText = document.getElementById('dialogueText');
const cursor = document.getElementById('cursor');

const frases = {
  intro: "Recuerda: en este mundo, es matar o perdonar. La bondad deja huella tanto como la violencia.",
  fight: "* Elegís pelear. El alma se pone rígida... pero todavía podés arrepentirte.",
  act: "* Observás con atención. A veces hablar dice más que cualquier golpe.",
  item: "* Revisás tu inventario. Un caramelo casi vacío... suficiente para seguir un poco más.",
  mercy: "* Bajás la guardia. El monstruo frente a vos también parece dudar."
};

let escribiendo = false;

function escribirTexto(texto) {
  if (escribiendo) return;
  escribiendo = true;
  dialogueText.textContent = "";
  let i = 0;
  const intervalo = setInterval(() => {
    dialogueText.textContent += texto.charAt(i);
    i++;
    if (i >= texto.length) {
      clearInterval(intervalo);
      escribiendo = false;
    }
  }, 28);
}

// arranca con la frase inicial apenas carga la página
window.addEventListener('DOMContentLoaded', () => {
  escribirTexto(frases.intro);
});

// ---------- MENÚ DE COMBATE (FIGHT / ACT / ITEM / MERCY) ----------
const botonesMenu = document.querySelectorAll('.menu-btn');
const soul = document.getElementById('soul');

botonesMenu.forEach(boton => {
  boton.addEventListener('click', () => {
    const accion = boton.dataset.action;
    escribirTexto(frases[accion]);

    // pequeño feedback visual en el alma según la acción elegida
    soul.classList.remove('latido');
    void soul.offsetWidth; // fuerza reinicio de la animación
    soul.classList.add('latido');
  });
});

// ---------- MOVER EL ALMA DENTRO DE LA CAJA ----------
const soulWrap = document.getElementById('soulWrap');
const limite = { min: 6, max: 190 }; // margen dentro de la caja (220px - tamaño del alma)

soulWrap.addEventListener('mousemove', (e) => {
  const rect = soulWrap.getBoundingClientRect();
  let x = e.clientX - rect.left - 12;
  let y = e.clientY - rect.top - 12;

  x = Math.max(limite.min, Math.min(limite.max, x));
  y = Math.max(limite.min, Math.min(limite.max, y));

  soul.style.left = x + "px";
  soul.style.top = y + "px";
});

// también se puede mover con las flechas del teclado, como en el juego
let posX = 98, posY = 88;
document.addEventListener('keydown', (e) => {
  const paso = 12;
  if (e.key === 'ArrowUp') posY -= paso;
  if (e.key === 'ArrowDown') posY += paso;
  if (e.key === 'ArrowLeft') posX -= paso;
  if (e.key === 'ArrowRight') posX += paso;

  posX = Math.max(limite.min, Math.min(limite.max, posX));
  posY = Math.max(limite.min, Math.min(limite.max, posY));

  soul.style.left = posX + "px";
  soul.style.top = posY + "px";
});

// cuando el mouse sale de la caja, el alma vuelve a latir tranquila en su lugar
soulWrap.addEventListener('mouseleave', () => {
  soul.classList.add('latido');
});
soulWrap.addEventListener('mouseenter', () => {
  soul.classList.remove('latido');
});
soul.classList.add('latido'); // estado inicial

// ---------- BOTÓN PRINCIPAL: baja suavemente hacia la info ----------
document.getElementById('ctaBtn').addEventListener('click', () => {
  document.querySelector('.info').scrollIntoView({ behavior: 'smooth' });
});

// ---------- REVELAR TARJETAS AL HACER SCROLL ----------
const tarjetas = document.querySelectorAll('.card');

const observer = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
      observer.unobserve(entrada.target);
    }
  });
}, { threshold: 0.2 });

tarjetas.forEach(tarjeta => observer.observe(tarjeta));

// ---------- PESTAÑAS DE RUTAS (PACIFISTA / NEUTRAL / GENOCIDA) ----------
const rutaTabs = document.querySelectorAll('.route-tab');
const routeText = document.getElementById('routeText');

const textosRuta = {
  pacifista: "No lastimás a nadie. Hablás, escuchás y perdonás hasta el final. Es la ruta pensada para conocer a cada personaje sin perder a ninguno.",
  neutral: "Un poco de todo: quizás perdonás a algunos y en otros combates no tenés opción. La mayoría de las primeras partidas terminan acá, con un final agridulce.",
  genocida: "El camino opuesto a la piedad. Vaciar cada zona tiene consecuencias que el juego no deja pasar por alto, y que se recuerdan mucho después de terminarlo."
};

rutaTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    rutaTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const ruta = tab.dataset.route;
    routeText.textContent = textosRuta[ruta];
  });
});

// ---------- ACORDEÓN DE DATOS CURIOSOS ----------
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const body = header.nextElementSibling;
    const estabaAbierto = header.classList.contains('open');

    // cierra los demás para que se vea como un acordeón prolijo
    accordionHeaders.forEach(h => {
      h.classList.remove('open');
      h.nextElementSibling.style.maxHeight = null;
    });

    if (!estabaAbierto) {
      header.classList.add('open');
      body.style.maxHeight = body.scrollHeight + "px";
    }
  });
});