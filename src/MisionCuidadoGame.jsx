import React, { useState, useRef, useEffect, useCallback } from "react";

const publicAsset = (path) => `${import.meta.env.BASE_URL}${path}`;

/* ================================================================
   MISIÓN CUIDADO: SALUD EN ACCIÓN
   Videojuego educativo 2D de exploración (React + Canvas)
   ================================================================
   Estructura del archivo (pensada para separarse en carpetas
   reales cuando se integre a la plataforma:

   - DATOS EDUCATIVOS  -> data/myths.js, data/trueFalse.js,
                          data/questions.js, data/its.js,
                          data/contraceptiveMethods.js,
                          data/scenarios.js, data/missions.js
   - CONFIG DE NIVELES -> scenes/level1.js, scenes/level2.js, ...
   - SISTEMAS          -> systems/collision.js, systems/camera.js
   - COMPONENTES       -> components/Player, NPC, Dialogue,
                          Interaction, Collectible, Star, HUD,
                          Map, LevelComplete, Feedback, PauseMenu...

   NOTA PARA LA DOCENTE:
   El contenido científico (mitos, verdadero/falso, ITS, métodos
   anticonceptivos, escenarios de decisión) se ubica todo en el
   bloque "DATOS EDUCATIVOS" de más abajo. Se puede reemplazar por
   el material real de cátedra sin tocar el resto del código: cada
   objeto tiene la misma forma (shape) para que el motor del juego
   siga funcionando igual.
   ================================================================ */

/* ================================================================
   DATOS EDUCATIVOS
   ================================================================ */

// data/myths.js — Nivel 1: MITO o REALIDAD
const MYTHS_DATA = [
  {
    id: "myth1",
    text: "El VIH se transmite por dar la mano, abrazar o compartir el mate con alguien.",
    answer: "mito",
    explanation:
      "El VIH se transmite por sangre, semen, fluidos vaginales y leche materna. El contacto cotidiano (abrazos, mate, pileta) no transmite el virus.",
  },
  {
    id: "myth2",
    text: "Una persona puede tener una ITS y no presentar ningún síntoma.",
    answer: "realidad",
    explanation:
      "Muchas ITS son asintomáticas durante un tiempo. Por eso son tan importantes los controles y las pruebas periódicas, aunque no haya molestias.",
  },
  {
    id: "myth3",
    text: "El preservativo, usado correctamente desde el inicio hasta el final de la relación, es uno de los métodos más eficaces para prevenir ITS y embarazos.",
    answer: "realidad",
    explanation:
      "Es el único método que protege al mismo tiempo de un embarazo no planificado y de la mayoría de las ITS.",
  },
  {
    id: "myth4",
    text: "Solamente las personas con muchas parejas sexuales pueden contagiarse una ITS.",
    answer: "mito",
    explanation:
      "Cualquier persona sexualmente activa que no se cuide puede contraer una ITS, sin importar la cantidad de parejas que haya tenido.",
  },
  {
    id: "myth5",
    text: "La anticoncepción de emergencia (pastilla del día después) puede usarse como método anticonceptivo habitual.",
    answer: "mito",
    explanation:
      "Es un recurso para situaciones puntuales de emergencia. Tiene menor eficacia que los métodos regulares y no debe reemplazarlos.",
  },
];

// data/trueFalse.js + data/questions.js — Nivel 2: Rumores en Red
const TRUEFALSE_DATA = [
  {
    id: "tf1",
    npc: "Sofía",
    text: "Usar dos preservativos al mismo tiempo da doble protección.",
    answer: false,
    explanation:
      "Al contrario: la fricción entre ambos aumenta el riesgo de que se rompan. Se recomienda usar uno solo, correctamente.",
  },
  {
    id: "tf2",
    npc: "Bruno",
    text: "Los síntomas de una ITS siempre son visibles a simple vista.",
    answer: false,
    explanation:
      "Muchas ITS no presentan signos visibles. La única forma segura de saber es haciéndose los controles correspondientes.",
  },
  {
    id: "tf3",
    npc: "Facu",
    text: "El coito interrumpido (retirar el pene antes de eyacular) es un método anticonceptivo confiable.",
    answer: false,
    explanation:
      "Es uno de los métodos menos confiables: puede haber liberación de fluido preseminal con espermatozoides antes de la eyaculación.",
  },
];

const MC_QUESTIONS = [
  {
    id: "mc1",
    npc: "Male",
    text: "¿Cuál de estas opciones NO previene infecciones de transmisión sexual?",
    options: [
      "Preservativo",
      "Pastillas anticonceptivas",
      "Abstinencia",
      "Barrera de látex bucal",
    ],
    correctIndex: 1,
    explanation:
      "Las pastillas anticonceptivas previenen el embarazo, pero no protegen frente a las ITS. Para eso hace falta un método de barrera.",
  },
  {
    id: "mc2",
    npc: "Ana",
    text: "Si tenés dudas sobre tu salud sexual, ¿a quién es mejor consultar?",
    options: [
      "A un horóscopo o influencer",
      "A un centro de salud o profesional de la salud",
      "A un foro anónimo de internet",
      "A nadie, mejor no preguntar",
    ],
    correctIndex: 1,
    explanation:
      "Un centro de salud o un profesional pueden dar información confiable, actualizada y adaptada a tu situación.",
  },
];

// data/its.js — Nivel 3, Sala 1
const ITS_DATA = [
  {
    id: "vih",
    name: "VIH",
    transmission: "Sangre, semen, fluidos vaginales y leche materna.",
    prevention: "Uso correcto del preservativo, no compartir agujas, controles periódicos.",
    note: "Puede no dar síntomas durante años. Solo un test lo confirma.",
  },
  {
    id: "sifilis",
    name: "Sífilis",
    transmission: "Contacto sexual sin protección con una persona infectada.",
    prevention: "Preservativo y controles periódicos, incluso sin síntomas.",
    note: "Puede aparecer una lesión indolora que desaparece sola, aunque la infección sigue activa.",
  },
  {
    id: "gonorrea",
    name: "Gonorrea",
    transmission: "Contacto sexual sin protección.",
    prevention: "Preservativo y realizar controles ante cualquier duda.",
    note: "En muchos casos no presenta síntomas, sobre todo en personas con vulva.",
  },
  {
    id: "vph",
    name: "VPH",
    transmission: "Contacto piel a piel en la zona genital, con o sin penetración.",
    prevention: "Preservativo (reduce el riesgo, aunque no lo elimina del todo) y vacunación.",
    note: "Existe una vacuna que previene los tipos más frecuentes asociados a esta infección.",
  },
];

const ITS_QUIZ = [
  {
    id: "itsq1",
    text: "¿Por qué es importante hacerse controles de ITS aunque no haya síntomas?",
    options: [
      "Porque muchas ITS no presentan signos visibles",
      "Porque es obligatorio por ley",
      "Porque así se cura automáticamente",
      "No es importante si uno se siente bien",
    ],
    correctIndex: 0,
    explanation:
      "La ausencia de síntomas no significa ausencia de infección. Los controles son la única forma de saber con certeza.",
  },
  {
    id: "itsq2",
    text: "¿Qué previene la vacuna disponible relacionada con ITS mencionada en las fichas?",
    options: [
      "La sífilis",
      "El VIH",
      "Los tipos más frecuentes de VPH",
      "La gonorrea",
    ],
    correctIndex: 2,
    explanation: "La vacuna contra el VPH previene los tipos de este virus más asociados a enfermedad.",
  },
];

// data/contraceptiveMethods.js — Nivel 3, Sala 2
const CONTRACEPTIVE_METHODS = [
  { id: "preservativoM", name: "Preservativo masculino", category: "barrera" },
  { id: "preservativoF", name: "Preservativo femenino", category: "barrera" },
  { id: "pastillas", name: "Pastillas anticonceptivas", category: "hormonal" },
  { id: "implante", name: "Implante subdérmico", category: "hormonal" },
  { id: "diuCobre", name: "DIU de cobre", category: "dispositivo" },
  { id: "diuHormonal", name: "DIU hormonal", category: "dispositivo" },
  { id: "permanente", name: "Métodos permanentes (ligadura / vasectomía)", category: "permanente" },
  { id: "emergencia", name: "Anticoncepción de emergencia", category: "emergencia" },
];

const METHOD_CATEGORIES = [
  { id: "barrera", label: "Métodos de barrera" },
  { id: "hormonal", label: "Métodos hormonales" },
  { id: "dispositivo", label: "Dispositivos (DIU)" },
  { id: "permanente", label: "Métodos permanentes" },
  { id: "emergencia", label: "Anticoncepción de emergencia" },
];

// data/scenarios.js — Nivel 3, Sala 3 y decisiones de otros niveles
const SCENARIOS_DATA = [
  {
    id: "scen1",
    text: "Vas a tener una relación sexual con tu pareja y no sabés si alguno de los dos tiene alguna ITS. ¿Qué es lo más recomendable?",
    options: [
      "No hablar del tema para no incomodar",
      "Usar preservativo y proponer hacerse controles juntos",
      "Confiar en que como se ven bien, no puede pasar nada",
      "Preguntarle a amigos qué opinan",
    ],
    correctIndex: 1,
    explanation:
      "Hablarlo abiertamente, usar preservativo y hacerse controles es la forma más responsable de cuidar a ambas personas.",
  },
  {
    id: "scen2",
    text: "Una amiga te cuenta que dejó de tomar la pastilla anticonceptiva por su cuenta porque escuchó rumores en redes. ¿Qué le sugerís?",
    options: [
      "Que confíe en lo que vio en un video viral",
      "Que consulte con un profesional de la salud antes de decidir",
      "Que directamente no use ningún método",
      "Que se lo pregunte a otras amigas",
    ],
    correctIndex: 1,
    explanation:
      "Ante dudas sobre un método, lo más seguro es consultar con un profesional de salud, no basarse en rumores.",
  },
  {
    id: "scen_liceo",
    text: "Un compañero te cuenta algo raro sobre el VIH que escuchó y no sabés si es cierto. ¿Qué hacés?",
    options: [
      "Le creés sin verificar nada",
      "Buscás información en una fuente confiable, como el centro de salud",
      "Lo ignorás y no volvés a pensar en el tema",
      "Se lo repetís a más gente sin confirmarlo",
    ],
    correctIndex: 1,
    explanation:
      "Verificar la información en fuentes confiables evita que los mitos se sigan repitiendo.",
  },
  {
    id: "scen_red",
    text: "Te llega un mensaje reenviado que dice cosas alarmantes sobre un método anticonceptivo. ¿Qué es lo mejor que podés hacer?",
    options: [
      "Reenviarlo para que otros se cuiden",
      "Contrastarlo con una fuente confiable antes de creerlo o compartirlo",
      "Borrarlo sin pensarlo más",
      "Creerlo porque lo mandó un amigo",
    ],
    correctIndex: 1,
    explanation:
      "Antes de creer o reenviar información sensible, conviene verificarla en fuentes confiables (centro de salud, profesionales, organismos oficiales).",
  },
];

// data/missions.js — Nivel 4: fragmentos de la misión final
const MISSIONS_DATA = [
  {
    id: "frag_its",
    label: "ITS",
    emoji: "🧬",
    challenge: {
      type: "mc",
      text: "¿Cuál de estas afirmaciones sobre las ITS es correcta?",
      options: [
        "Todas duelen desde el primer día",
        "Algunas pueden no dar síntomas visibles",
        "Solo afectan a personas adultas",
        "Se curan solas sin control médico",
      ],
      correctIndex: 1,
      explanation: "Varias ITS pueden cursar sin síntomas visibles; por eso importan los controles.",
    },
  },
  {
    id: "frag_prevencion",
    label: "Prevención",
    emoji: "🛡️",
    challenge: {
      type: "truefalse",
      text: "Usar preservativo correctamente reduce el riesgo de ITS y de embarazo no planificado.",
      answer: true,
      explanation: "Es el único método que cuida frente a ambas cosas al mismo tiempo.",
    },
  },
  {
    id: "frag_metodos",
    label: "Métodos anticonceptivos",
    emoji: "💊",
    challenge: {
      type: "mc",
      text: "¿Qué grupo de métodos incluye al DIU de cobre y al DIU hormonal?",
      options: ["Métodos de barrera", "Dispositivos intrauterinos", "Métodos permanentes", "Anticoncepción de emergencia"],
      correctIndex: 1,
      explanation: "Ambos DIU son dispositivos que se colocan dentro del útero.",
    },
  },
  {
    id: "frag_mitos",
    label: "Mitos y realidades",
    emoji: "💭",
    challenge: {
      type: "mito",
      text: "Si dos personas recién se conocen, no hace falta cuidarse la primera vez.",
      answer: "mito",
      explanation: "El riesgo de ITS o embarazo no depende de cuánto tiempo se conocen las personas, sino de si se cuidan o no.",
    },
  },
  {
    id: "frag_autocuidado",
    label: "Autocuidado",
    emoji: "💚",
    challenge: {
      type: "mc",
      text: "¿Cuál de estas actitudes forma parte del autocuidado en las relaciones?",
      options: [
        "Hacer algo aunque no tengas ganas para no incomodar",
        "Poder decir que no y que se respete tu decisión",
        "Evitar hablar de lo que sentís",
        "Guardarte las dudas para no parecer inexperto/a",
      ],
      correctIndex: 1,
      explanation: "El consentimiento y la comunicación son parte central del autocuidado y del cuidado del otro.",
    },
  },
];

const BONUS_FRAGMENT = {
  id: "frag_bonus",
  label: "Dato extra",
  emoji: "✨",
  text: "Dato encontrado: pedir ayuda o hacer una consulta a tiempo también es una forma de cuidarse.",
};

const FINAL_MISSION_TARGETS = [
  { id: "gonorrea", name: "Gonorrea", kind: "bacteria", icon: "🦠", color: "#FFB347" },
  { id: "sifilis", name: "Sífilis", kind: "bacteria", icon: "🧫", color: "#FFB347" },
  { id: "clamidia", name: "Clamidia", kind: "bacteria", icon: "🧬", color: "#FFB347" },
  { id: "vih", name: "VIH", kind: "virus", icon: "🧪", color: "#B78CFF" },
  { id: "vph", name: "VPH", kind: "virus", icon: "🧬", color: "#B78CFF" },
  { id: "hepatitis-b", name: "Hepatitis B", kind: "virus", icon: "🧪", color: "#B78CFF" },
  { id: "herpes", name: "Herpes", kind: "virus", icon: "🔬", color: "#B78CFF" },
];

/* ================================================================
   PERSONAJES SELECCIONABLES
   ================================================================ */
const CHARACTERS = [
  { id: "avatar_g1", emoji: "👧🏻", color: "#7CE0C6", skin: "#F6C9A7", hair: "#342B35", hairStyle: "long", gender: "girl" },
  { id: "avatar_g2", emoji: "👧🏽", color: "#FF8FB1", skin: "#B97850", hair: "#4A261D", hairStyle: "long", gender: "girl" },
  { id: "avatar_g3", emoji: "👧🏾", color: "#C6F135", skin: "#8D5524", hair: "#201A1C", hairStyle: "long", gender: "girl" },
  { id: "avatar_b1", emoji: "👦🏾", color: "#FFD166", skin: "#8D5524", hair: "#201A1C", hairStyle: "short", gender: "boy" },
  { id: "avatar_b2", emoji: "👦🏼", color: "#8DB4FF", skin: "#D39A73", hair: "#5A3A2E", hairStyle: "short", gender: "boy" },
  { id: "avatar_b3", emoji: "👦🏻", color: "#B78CFF", skin: "#F6C9A7", hair: "#342B35", hairStyle: "short", gender: "boy" },
];

/* ================================================================
   SISTEMAS: colisiones y utilidades
   ================================================================ */
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function borderWalls(width, height, t = 24) {
  return [
    { x: 0, y: 0, w: width, h: t },
    { x: 0, y: height - t, w: width, h: t },
    { x: 0, y: 0, w: t, h: height },
    { x: width - t, y: 0, w: t, h: height },
  ];
}

function roomWalls(x, y, w, h, side, doorStart, doorSize, t = 18, bottomDoorStart = null, bottomDoorSize = 0) {
  const doorEnd = doorStart + doorSize;
  if (side === "right" || side === "left") {
    const wallX = side === "right" ? x + w - t : x;
    const wallW = t;
    return [
      { x, y, w, h: t },
      { x: wallX, y, w: wallW, h: Math.max(0, doorStart - y) },
      { x: wallX, y: doorEnd, w: wallW, h: Math.max(0, y + h - doorEnd) },
      { x, y: y + h - t, w: Math.max(0, bottomDoorStart === null ? w : bottomDoorStart - x), h: t },
      ...(bottomDoorStart === null
        ? []
        : [{
            x: bottomDoorStart + bottomDoorSize,
            y: y + h - t,
            w: Math.max(0, x + w - bottomDoorStart - bottomDoorSize),
            h: t,
          }]),
    ];
  }
  return [
    { x, y, w, h: t },
    { x, y, w: t, h },
    { x: x + w - t, y, w: t, h },
    { x, y: y + h - t, w: Math.max(0, doorStart - x), h: t },
    { x: doorEnd, y: y + h - t, w: Math.max(0, x + w - doorEnd), h: t },
  ];
}

function buildLiceoCollisionWalls(width, height) {
  const walls = [];
  const addHorizontal = (y, segments, h = 24) => segments.forEach(([x, w]) => walls.push({ x, y, w, h }));
  const addVertical = (x, segments, w = 24) => segments.forEach(([y, h]) => walls.push({ x, y, w, h }));

  // Contorno rojo del hall real: izquierda 420, derecha 1110, arriba 310 y abajo 610.
  // El hueco superior coincide con la escalera; el inferior, con la puerta principal.
  addHorizontal(310, [[420, 300], [850, 260]]);
  addVertical(420, [[310, 300]]);
  addVertical(1110, [[310, 300]]);
  addHorizontal(610, [[420, 220], [900, 210]]);

  // La galeria superior se alcanza unicamente por la escalera central.
  addHorizontal(270, [[420, 300], [850, 260]]);

  // Pared inferior de 1A-1D. Los cuatro huecos coinciden con las puertas visibles.
  addHorizontal(185, [[300, 95], [490, 130], [730, 130], [970, 130], [1210, 80]]);

  // Divisiones entre aulas superiores, sin cerrar la galeria inferior.
  addVertical(300, [[25, 160]]);
  addVertical(540, [[25, 160]]);
  addVertical(780, [[25, 160]]);
  addVertical(1020, [[25, 160]]);
  addVertical(1260, [[25, 160]]);
  return walls;
}

/* ================================================================
   AUDIO — placeholders sintetizados (sin archivos externos)
   ================================================================ */
function useSound() {
  const ctxRef = useRef(null);
  const play = useCallback((type) => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctxRef.current = new AC();
      }
      const ctx = ctxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      const presets = {
        pickup: { freq: 660, dur: 0.12, type: "triangle" },
        correct: { freq: 880, dur: 0.18, type: "sine" },
        incorrect: { freq: 160, dur: 0.22, type: "sawtooth" },
        star: { freq: 1040, dur: 0.28, type: "sine" },
        unlock: { freq: 520, dur: 0.3, type: "square" },
        complete: { freq: 720, dur: 0.4, type: "sine" },
        step: { freq: 220, dur: 0.03, type: "square" },
      };
      const p = presets[type] || presets.pickup;
      o.type = p.type;
      o.frequency.setValueAtTime(p.freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.06, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
      o.start(now);
      o.stop(now + p.dur + 0.02);
    } catch (e) {
      /* audio no disponible: placeholder silencioso */
    }
  }, []);
  return play;
}

/* ================================================================
   CONFIGURACIÓN DE NIVELES (scenes/*)
   ================================================================ */
function buildLevels() {
  const W1 = 1536, H1 = 1024;
  const level1 = {
    id: "liceo",
    name: "El Liceo",
    subtitle: "Mitos y realidades",
    width: W1,
    height: H1,
    backgroundImage: publicAsset("liceo.png"),
    floorColor: "#EDE6D6",
    accent: "#C6F135",
    spawn: { x: 735, y: 780 },
    walls: [
      ...borderWalls(W1, H1),
      // frente de aulas superiores, con puertas entre el pasillo y cada salon
      { x: 28, y: 270, w: 150, h: 24 },
      { x: 250, y: 270, w: 70, h: 24 },
      { x: 380, y: 270, w: 50, h: 24 },
      { x: 500, y: 270, w: 70, h: 24 },
      { x: 630, y: 270, w: 50, h: 24 },
      { x: 750, y: 270, w: 70, h: 24 },
      { x: 880, y: 270, w: 50, h: 24 },
      { x: 1000, y: 270, w: 70, h: 24 },
      { x: 1130, y: 270, w: 50, h: 24 },
      { x: 1250, y: 270, w: 222, h: 24 },
      // divisiones de aulas, dejando un vano de puerta en cada acceso
      { x: 230, y: 28, w: 24, h: 105 },
      { x: 230, y: 190, w: 24, h: 80 },
      { x: 480, y: 28, w: 24, h: 105 },
      { x: 480, y: 190, w: 24, h: 80 },
      { x: 730, y: 28, w: 24, h: 105 },
      { x: 730, y: 190, w: 24, h: 80 },
      { x: 980, y: 28, w: 24, h: 105 },
      { x: 980, y: 190, w: 24, h: 80 },
      { x: 1230, y: 28, w: 24, h: 105 },
      { x: 1230, y: 190, w: 24, h: 80 },
      // aulas laterales del segundo piso
      { x: 28, y: 470, w: 65, h: 24 },
      { x: 145, y: 470, w: 93, h: 24 },
      { x: 28, y: 680, w: 65, h: 24 },
      { x: 145, y: 680, w: 93, h: 24 },
      { x: 1260, y: 470, w: 65, h: 24 },
      { x: 1377, y: 470, w: 95, h: 24 },
      { x: 1260, y: 680, w: 65, h: 24 },
      { x: 1377, y: 680, w: 95, h: 24 },
      { x: 238, y: 300, w: 24, h: 130 },
      { x: 238, y: 500, w: 24, h: 150 },
      { x: 1238, y: 300, w: 24, h: 130 },
      { x: 1238, y: 500, w: 24, h: 150 },
      // biblioteca, direccion y secretaria en los laterales inferiores
      { x: 28, y: 760, w: 210, h: 24 },
      { x: 1260, y: 760, w: 212, h: 24 },
      { x: 238, y: 710, w: 24, h: 150 },
      { x: 1238, y: 710, w: 24, h: 150 },
      // hall central y escalera
      { x: 330, y: 360, w: 380, h: 24 },
      { x: 790, y: 360, w: 380, h: 24 },
      { x: 330, y: 360, w: 24, h: 150 },
      { x: 1146, y: 360, w: 24, h: 150 },
    ],
    collisionWalls: [
      { x: 420, y: 310, w: 300, h: 24 },
      { x: 850, y: 310, w: 260, h: 24 },
      { x: 420, y: 310, w: 24, h: 300 },
      { x: 420, y: 610, w: 220, h: 24 },
      { x: 900, y: 610, w: 210, h: 24 },
      { x: 300, y: 185, w: 95, h: 24 },
      { x: 490, y: 185, w: 130, h: 24 },
      { x: 1210, y: 185, w: 80, h: 24 },
      { x: 300, y: 25, w: 24, h: 160 },
      { x: 75.94006238425663, y: 532.1354163805343, w: 238, h: 8 },
      { x: 70.60673413718632, y: 390.1354011217452, w: 9.333328247070312, h: 309.3333282470703 },
      { x: 75.27340589011601, y: 690.802103392253, w: 236, h: 8 },
      { x: 321.273405890116, y: 608.1354163805343, w: 111.33334350585938, h: 11.33331298828125 },
      { x: 298.6067493959754, y: 612.8020728746749, w: 14.666656494140625, h: 78.66665649414062 },
      { x: 73.94006238425663, y: 360.51472936881146, w: 228.66668701171875, h: 8.66668701171875 },
      { x: 307.273405890116, y: 367.18139063132367, w: 12, h: 48.66668701171875 },
      { x: 69.33334350585938, y: 195.3333282470703, w: 8.666656494140625, h: 168.66668701171875 },
      { x: 72, y: 186.6666717529297, w: 238.66668701171875, h: 12 },
      { x: 311.3333435058594, y: 204.87853881594475, w: 12.666656494140625, h: 48.666656494140625 },
      { x: 313.3333435058594, y: 4.6666717529296875, w: 446.6666564941406, h: 11.333328247070312 },
      { x: 518, y: 13.333328247070312, w: 8.66668701171875, h: 102 },
      { x: 758.2813119648073, y: 2.6666717529296875, w: 12.66668701171875, h: 171.33334350585938 },
      { x: 697.6146859882448, y: 172.00001525878906, w: 170, h: 20.666656494140625 },
      { x: 770.8830093017267, y: 0.6666717529296875, w: 455.33331298828136, h: 11.333328247070312 },
      { x: 1214.216322290008, y: 13.333328247070312, w: 14.66668701171875, h: 96 },
      { x: 993.5496963134455, y: 9.333328247070312, w: 24.6666259765625, h: 103.33334350585938 },
      { x: 934.8830093134455, y: 167.3333282470703, w: 130.66668701171886, h: 17.333343505859375 },
      { x: 1142.8830093012268, y: 168.00001525878906, w: 62, h: 15.33331298828125 },
      { x: 1207.3333740234375, y: 205.3973704504868, w: 22, h: 53.33332824707031 },
      { x: 1293.3333740234375, y: 193.3973704504868, w: 164, h: 14.666671752929688 },
      { x: 1216.6666870117188, y: 359.39738570927585, w: 238.66668701171875, h: 13.33331298828125 },
      { x: 1209.3333740234375, y: 335.39737070927585, w: 22.6666259765625, h: 92.66665649414062 },
      { x: 1450.6666870117188, y: 196.06404220341648, w: 20, h: 350.66665649414057 },
      { x: 1216.6666870117188, y: 530.0640727209945, w: 237.33331298828125, h: 15.33331298828125 },
      { x: 1212.6666870117188, y: 512.0640727209945, w: 16.66668701171875, h: 47.33331298828125 },
      { x: 1229.3333740234375, y: 9.93026885804312, w: 229.33331298828125, h: 16.666671752929688 },
      { x: 1452.6666870117188, y: 13.263597105113433, w: 16, h: 186 },
      { x: 1455.3333740234375, y: 547.85362285432, w: 20.6666259765625, h: 158 },
      { x: 1211.3333740234375, y: 686.5203098660387, w: 244, h: 14 },
      { x: 1121.3333740234375, y: 605.85362285432, w: 104.6666259765625, h: 16 },
      { x: 1208, y: 622.5202793484606, w: 29.3333740234375, h: 63.333343505859375 },
      { x: 1069.3333740234375, y: 335.5255237536139, w: 25.33331298828125, h: 274.6666717529297 },
    ],
    decorations: [
      { x: 55, y: 60, emoji: "📚", kind: "books", size: 34 },
      { x: 300, y: 60, emoji: "🪑", kind: "desk", size: 28 },
      { x: 550, y: 60, emoji: "🪑", kind: "desk", size: 28 },
      { x: 800, y: 60, emoji: "🪑", kind: "desk", size: 28 },
      { x: 1050, y: 60, emoji: "🪑", kind: "desk", size: 28 },
      { x: 1300, y: 60, emoji: "📚", kind: "books", size: 34 },
      { x: 70, y: 330, emoji: "🪑", kind: "desk", size: 28 },
      { x: 70, y: 530, emoji: "🪑", kind: "desk", size: 28 },
      { x: 1300, y: 330, emoji: "🪑", kind: "desk", size: 28 },
      { x: 1300, y: 530, emoji: "🪑", kind: "desk", size: 28 },
      { x: 420, y: 470, emoji: "🌳", kind: "tree", size: 38 },
      { x: 1080, y: 470, emoji: "🌳", kind: "tree", size: 38 },
      { x: 650, y: 580, emoji: "🪑", kind: "desk", size: 30 },
      { x: 820, y: 580, emoji: "🪑", kind: "desk", size: 30 },
      { x: 90, y: 800, emoji: "📚", kind: "books", size: 34 },
      { x: 1290, y: 800, emoji: "📚", kind: "books", size: 34 },
    ],
    labels: [
      { x: 55, y: 45, text: "BAÑOS" },
      { x: 285, y: 45, text: "1A" },
      { x: 535, y: 45, text: "1B" },
      { x: 785, y: 45, text: "1C" },
      { x: 1035, y: 45, text: "1D" },
      { x: 1290, y: 45, text: "SALA DOCENTE" },
      { x: 55, y: 315, text: "2A" },
      { x: 55, y: 515, text: "2B" },
      { x: 1290, y: 315, text: "2C" },
      { x: 1290, y: 515, text: "2D" },
      { x: 410, y: 345, text: "HALL CENTRAL" },
      { x: 55, y: 745, text: "DIRECCION" },
      { x: 1290, y: 745, text: "SECRETARIA" },
      { x: 55, y: H1 - 90, text: "ENTRADA" },
    ],
    npcs: [
      {
        id: "prof_ana",
        x: 735,
        y: 500,
        name: "Prof. Ariana",
        emoji: "👩🏽‍🏫",
        color: "#FFD166",
        dialogue: [
          "Llegaste justo a tiempo. En el liceo aparecieron mensajes con información mezclada: algunos ayudan y otros pueden confundir.",
          "Tu misión es recorrer cada espacio, hablar con quienes encuentres y revisar los cinco carteles antes de sacar conclusiones.",
          "Cuando tengas las ideas claras, vení a conversar con Cami en la entrada. Recién ahí vas a poder entregar la misión y seguir la ruta.",
        ],
      },
      {
        id: "cami_decision",
        x: 735,
        y: 560,
        name: "Cami",
        emoji: "🧑🏽",
        color: "#FF8FB1",
        dialogue: [
          "Che, ¿puedo preguntarte algo?",
        ],
        challenge: { type: "decision", scenarioId: "scen_liceo", starIndex: 3 },
      },
    ],
    objects: [
      { id: "msg1", x: 380, y: 90, type: "mito", emoji: "📄", label: "Cartel del aula 1A", dataId: "myth1" },
      { id: "msg2", x: 610, y: 90, type: "mito", emoji: "📄", label: "Cartel del aula 1B", dataId: "myth2" },
      { id: "msg3", x: 850, y: 90, type: "mito", emoji: "📄", label: "Cartel del aula 1C", dataId: "myth3" },
      { id: "msg4", x: 1090, y: 90, type: "mito", emoji: "📄", label: "Cartel del aula 1D", dataId: "myth4" },
      { id: "msg5", x: 1360, y: 500, type: "mito", emoji: "📄", label: "Cartel del aula 2D", dataId: "myth5" },
      {
        id: "hidden_book",
        x: 1360,
        y: 590,
        type: "pista",
        emoji: "📖",
        label: "Libro",
        text: "Pista secreta: el consentimiento y el diálogo también son parte del autocuidado.",
        starIndex: 2,
      },
    ],
    exit: { x: 640, y: 590, w: 260, h: 40, label: "PUERTA PRINCIPAL" },
    objectivesRequired: ["msg1", "msg2", "msg3", "msg4", "msg5"],
  };

  const W2 = 1152, H2 = 768;
  const level2 = {
    id: "rumores",
    name: "Rumores en Red",
    subtitle: "Prevención y toma de decisiones",
    width: W2,
    height: H2,
    backgroundImage: publicAsset("plaza.png"),
    floorColor: "#DCEFE3",
    accent: "#FF4D8D",
    spawn: { x: 540, y: 650 },
    walls: [
      { x: 0, y: 0, w: 1152, h: 24 },
      { x: 0, y: 744, w: 1152, h: 24 },
      { x: 0, y: 0, w: 24, h: 768 },
      { x: 1128, y: 0, w: 24, h: 768 },
      { x: 500, y: 285, w: 155, h: 150 },
      { x: 530, y: 82, w: 95, h: 125 },
      { x: 155, y: 115, w: 115, h: 135 },
      { x: 805, y: 130, w: 185, h: 155 },
      { x: 92, y: 365, w: 270, h: 205 },
      { x: 790, y: 365, w: 270, h: 205 },
      { x: 80, y: 610, w: 420, h: 26 },
      { x: 700, y: 610, w: 370, h: 26 },
      { x: 438.3333435058594, y: 482.0000190734863, w: 97.33334350585938, h: 86 },
      { x: 615, y: 478.66667556762695, w: 100, h: 91.33334350585938 },
    ],
    decorations: [],
    labels: [],
    npcs: [
      {
        id: "sofia",
        x: 220,
        y: 285,
        name: "Sofía",
        emoji: "🧑🏻",
        color: "#7CE0C6",
        skin: "#F6C9A7",
        hair: "#342B35",
        dialogue: ["Che, ¿es verdad lo que me dijeron por el chat?"],
        challenge: { type: "truefalse", dataId: "tf1", starIndex: 1 },
      },
      {
        id: "bruno",
        x: 680,
        y: 225,
        name: "Bruno",
        emoji: "🧑🏾",
        color: "#FFD166",
        skin: "#8D5524",
        hair: "#201A1C",
        dialogue: ["Tengo una duda de algo que leí por ahí."],
        challenge: { type: "truefalse", dataId: "tf2", starIndex: 1 },
      },
      {
        id: "facu",
        x: 955,
        y: 300,
        name: "Facu",
        emoji: "🧑🏼",
        color: "#8DB4FF",
        skin: "#D39A73",
        hair: "#5A3A2E",
        dialogue: ["Un amigo me contó cómo se cuida y no sé si es tan así."],
        challenge: { type: "truefalse", dataId: "tf3", starIndex: 1 },
      },
      {
        id: "male",
        x: 345,
        y: 245,
        name: "Male",
        emoji: "🧑🏽",
        color: "#FF8FB1",
        skin: "#B97850",
        hair: "#342B35",
        dialogue: ["¿Vos sabés bien cuáles son los métodos de prevención?"],
        challenge: { type: "mc", dataId: "mc1", starIndex: 1 },
      },
      {
        id: "ana",
        x: 960,
        y: 535,
        name: "Ana",
        emoji: "🧑🏻",
        color: "#C6F135",
        skin: "#F6C9A7",
        hair: "#6B3F2A",
        dialogue: ["Si tenés dudas de verdad, ¿a quién le preguntás?"],
        challenge: { type: "mc", dataId: "mc2", starIndex: 1 },
      },
      {
        id: "vero",
        x: 440,
        y: 430,
        name: "Vero",
        emoji: "🧑🏾",
        color: "#FF8FB1",
        skin: "#8D5524",
        hair: "#201A1C",
        dialogue: ["Me llegó un mensaje que me dejó re preocupada, no sé qué hacer."],
        challenge: { type: "decision", scenarioId: "scen_red", starIndex: 3 },
      },
    ],
    objects: [
      {
        id: "hidden_phone",
        x: 285,
        y: 250,
        type: "pista",
        emoji: "📱",
        label: "Celular perdido",
        text: "Pista secreta: antes de reenviar algo, revisá si viene de una fuente confiable.",
        starIndex: 2,
      },
    ],
    exit: { x: 510, y: 650, w: 130, h: 40, label: "SALIDA" },
    objectivesRequired: ["sofia", "bruno", "facu", "male", "ana"],
    objectivesAreNpcs: true,
  };

  const W3 = 1152, H3 = 768;
  const level3 = {
    id: "centro",
    name: "Centro de Salud",
    subtitle: "ITS y métodos anticonceptivos",
    width: W3,
    height: H3,
    backgroundImage: publicAsset("hospital.png"),
    floorColor: "#E4EEFB",
    accent: "#8DB4FF",
    spawn: { x: 535, y: 665 },
    walls: [
      { x: 0, y: 0, w: 1152, h: 24 },
      { x: 0, y: 744, w: 1152, h: 24 },
      { x: 0, y: 0, w: 24, h: 768 },
      { x: 1128, y: 0, w: 24, h: 768 },
      { x: 105, y: 18, w: 260, h: 18 },
      { x: 347, y: 18, w: 18, h: 70 },
      { x: 382, y: 18, w: 238, h: 18 },
      { x: 650, y: 18, w: 270, h: 18 },
      { x: 930, y: 100, w: 190, h: 18 },
      { x: 930, y: 100, w: 18, h: 70 },
      { x: 930, y: 265, w: 18, h: 165 },
      { x: 930, y: 412, w: 190, h: 18 },
      { x: 317, y: 180, w: 18, h: 40 },
      { x: 700, y: 180, w: 18, h: 40 },
      { x: 700, y: 432, w: 220, h: 18 },
      { x: 420, y: 190, w: 205, h: 18 },
      { x: 350, y: 410, w: 105, h: 28 },
      { x: 625, y: 410, w: 75, h: 28 },
      { x: 815, y: 475, w: 250, h: 24 },
      { x: 893.7866634437322, y: 38, w: 10.66668701171875, h: 107.33332824707031 },
      { x: 896.0898841402447, y: 320.1645558931794, w: 17.3333740234375, h: 104.66665649414062 },
      { x: 899.4232581636822, y: 198.1645558931794, w: 13.33331298828125, h: 96 },
      { x: 707.4232581636822, y: 284.83121238732, w: 196, h: 20 },
      { x: 702.7565711519635, y: 168.1645558931794, w: 210, h: 9.333343505859375 },
      { x: 896.0898841402447, y: 140.83121238732002, w: 18, h: 58.66668701171875 },
      { x: 633.7223344233155, y: 28.666671752929688, w: 20.6666259765625, h: 84.66665649414062 },
      { x: 599.0556474115967, y: 102.00001525878906, w: 48.66668701171875, h: 15.33331298828125 },
      { x: 483.72230390573736, y: 106.66667175292969, w: 66, h: 17.333343505859375 },
      { x: 483.72230390573736, y: 37.33332824707031, w: 60.666656494140625, h: 78 },
      { x: 364.8774665095533, y: 30, w: 28.666656494140625, h: 83.33332824707031 },
      { x: 102.8774665095533, y: 161.3333282470703, w: 228, h: 20 },
      { x: 110.66667175292969, y: 32.00000286102295, w: 14.666671752929688, h: 252.00000762939453 },
      { x: 116, y: 286.6666669845581, w: 212.66668701171875, h: 12.66668701171875 },
      { x: 319.3333435058594, y: 260.6666669845581, w: 12, h: 65.33334350585938 },
      { x: 324, y: 379.33335399627686, w: 16, h: 53.33331298828125 },
      { x: 109.33334350585938, y: 416.6666669845581, w: 212, h: 18 },
      { x: 107.33334350585938, y: 282.0000104904175, w: 12.666656494140625, h: 139.33334350585938 },
      { x: 492, y: 321.3333282470703, w: 60.66668701171875, h: 8 },
      { x: 610.6666870117188, y: 332.00001525878906, w: 42.66668701171875, h: 8 },
      { x: 403.3333435058594, y: 354.00001525878906, w: 35.333343505859375, h: 12.666656494140625 },
      { x: 408, y: 324.00001525878906, w: 35.333343505859375, h: 10 },
      { x: 612, y: 360.6666717529297, w: 34.66668701171875, h: 9.333343505859375 },
      { x: 459.53463874183467, y: 234.92057926467822, w: 118.00003051757812, h: 13.333343505859375 },
    ],
    decorations: [
      { x: 470, y: 315, emoji: "🪑", size: 30 },
      { x: 570, y: 315, emoji: "🪑", size: 30 },
      { x: 475, y: 350, emoji: "🪑", size: 30 },
      { x: 575, y: 350, emoji: "🪑", size: 30 },
    ],
    labels: [
      { x: 140, y: 45, text: "SALA 1 · ITS" },
      { x: 735, y: 45, text: "SALA 2 · MÉTODOS" },
      { x: 385, y: 520, text: "SALA 3 · DECISIONES" },
    ],
    npcs: [
      {
        id: "enfermera_rosa",
        x: 775,
        y: 235,
        name: "Enf. Rosa",
        emoji: "🧑🏽‍⚕️",
        color: "#8DB4FF",
        dialogue: [
          "Leé las cuatro fichas de ITS que están en la sala y después charlamos.",
        ],
        challenge: { type: "quiz_multi", dataKey: "ITS_QUIZ", starIndex: 1, requires: ["its_vih", "its_sifilis", "its_gonorrea", "its_vph"] },
      },
      {
        id: "doctor_lucas",
        x: 500,
        y: 335,
        name: "Dr. Lucas",
        emoji: "🧑🏾‍⚕️",
        color: "#C6F135",
        dialogue: ["Te propongo pensar juntos un par de situaciones de la vida real."],
        challenge: { type: "scenarios_multi", scenarioIds: ["scen1", "scen2"], starIndex: 3 },
      },
    ],
    objects: [
      { id: "its_vih", x: 150, y: 70, type: "infocard", emoji: "🗂️", label: "Ficha", dataId: "vih" },
      { id: "its_sifilis", x: 775, y: 70, type: "infocard", emoji: "🗂️", label: "Ficha", dataId: "sifilis" },
      { id: "its_gonorrea", x: 150, y: 245, type: "infocard", emoji: "🗂️", label: "Ficha", dataId: "gonorrea" },
      { id: "its_vph", x: 150, y: 385, type: "infocard", emoji: "🗂️", label: "Ficha", dataId: "vph" },
      {
        id: "dragdrop_station",
        x: 790,
        y: 385,
        type: "dragdrop",
        emoji: "🗃️",
        label: "Mesa de clasificación",
        starIndex: 2,
      },
    ],
    exit: { x: 510, y: 700, w: 130, h: 40, label: "SALIDA" },
    objectivesRequired: ["enfermera_rosa_done", "dragdrop_done", "doctor_lucas_done"],
    customObjectives: true,
  };

  const W4 = 1500, H4 = 950;
  const level4 = {
    id: "mision",
    name: "La Misión Final",
    subtitle: "Información confiable para el liceo",
    width: W4,
    height: H4,
    floorColor: "#EAF7EC",
    accent: "#FFD166",
    spawn: { x: 120, y: H4 - 120 },
    walls: [...borderWalls(W4, H4), { x: 700, y: 350, w: 24, h: 300 }],
    decorations: [
      { x: 300, y: 200, emoji: "🌳", size: 36 },
      { x: 1200, y: 200, emoji: "🌳", size: 36 },
      { x: 300, y: 750, emoji: "🌳", size: 36 },
      { x: 1200, y: 750, emoji: "🌳", size: 36 },
    ],
    labels: [{ x: 40, y: 40, text: "PLAZOLETA DEL LICEO" }],
    npcs: [
      {
        id: "marcos",
        x: 250,
        y: 250,
        name: "Coord. Marcos",
        emoji: "🧑🏻‍🏫",
        color: "#FFD166",
        dialogue: [
          "Che, necesitamos armar información confiable para compartir en el liceo.",
          "Recorré la plazoleta y conseguí los cinco fragmentos: ITS, prevención, métodos, mitos y autocuidado.",
          "Cada uno está protegido por un desafío. ¡Suerte!",
        ],
      },
    ],
    objects: [
      { id: "frag_its", x: 300, y: 700, type: "fragment", missionId: "frag_its" },
      { id: "frag_prevencion", x: 1300, y: 300, type: "fragment", missionId: "frag_prevencion" },
      { id: "frag_metodos", x: 1300, y: 700, type: "fragment", missionId: "frag_metodos" },
      { id: "frag_mitos", x: 750, y: 150, type: "fragment", missionId: "frag_mitos" },
      { id: "frag_autocuidado", x: 750, y: 800, type: "fragment", missionId: "frag_autocuidado" },
      {
        id: "frag_bonus",
        x: 60,
        y: 60,
        type: "bonus",
        emoji: "✨",
        label: "???",
        starIndex: 2,
      },
    ],
    exit: { x: 1400, y: 40, w: 90, h: 40, label: "SALIDA" },
    objectivesRequired: ["frag_its", "frag_prevencion", "frag_metodos", "frag_mitos", "frag_autocuidado"],
  };

  return { liceo: level1, rumores: level2, centro: level3, mision: level4 };
}

const LEVEL_ORDER = ["liceo", "rumores", "centro", "mision"];

/* ================================================================
   CONSTANTES DE MOTOR
   ================================================================ */
const VIEW_W = 900;
const VIEW_H = 540;
const PLAYER_SIZE = 34;
const PLAYER_SPEED = 230;
const INTERACT_RADIUS = 60;

function areLevelObjectivesComplete(levelConfig, runtime) {
  const required = levelConfig.objectivesRequired;
  return levelConfig.customObjectives
    ? required.every((key) => runtime.doneObjects[key])
    : levelConfig.objectivesAreNpcs
    ? required.every((id) => runtime.doneNpcs[id])
    : required.every((id) => runtime.doneObjects[id]);
}

/* ================================================================
   COMPONENTES DE UI
   ================================================================ */

function StarRow({ count, size = 18 }) {
  return (
    <span style={{ letterSpacing: 2 }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ fontSize: size, opacity: i <= count ? 1 : 0.28 }}>
          {i <= count ? "⭐" : "☆"}
        </span>
      ))}
    </span>
  );
}

function PixelPanel({ children, style }) {
  return (
    <div
      style={{
        background: "rgba(16, 22, 58, 0.92)",
        border: "3px solid #C6F135",
        borderRadius: 14,
        boxShadow: "0 8px 0 rgba(0,0,0,0.35)",
        color: "#F5F5F5",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BigButton({ children, onClick, color = "#C6F135", dark = false, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        cursor: "pointer",
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 700,
        fontSize: 16,
        padding: "10px 22px",
        borderRadius: 10,
        border: "none",
        background: color,
        color: dark ? "#F5F5F5" : "#10163A",
        boxShadow: "0 4px 0 rgba(0,0,0,0.35)",
        transition: "transform 0.08s ease",
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
    >
      {children}
    </button>
  );
}

/* ---------- Pantalla de selección de personaje ---------- */
function CharacterSelectScreen({ onSelect }) {
  const [hover, setHover] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(CHARACTERS[0]);
  const [playerName, setPlayerName] = useState("");

  function startGame() {
    const name = playerName.trim();
    if (!name) return;
    onSelect({ ...selectedAvatar, name });
  }

  return (
    <div style={styles.centerScreen}>
      <h1 style={styles.title}>MISIÓN CUIDADO</h1>
      <p style={styles.subtitle}>— LA RUTA DEL CUIDADO —</p>
      <p style={{ color: "#C9CFEA", marginBottom: 28, fontFamily: "'Inter', sans-serif" }}>
        Explorá. Descubrí. Decidí.
      </p>
      <PixelPanel style={{ padding: 28, maxWidth: 560 }}>
        <p style={{ marginTop: 0, marginBottom: 18, fontFamily: "'Inter', sans-serif" }}>
          Escribí tu nombre y elegí un avatar:
        </p>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && startGame()}
          placeholder="Tu nombre"
          maxLength={24}
          aria-label="Nombre del jugador"
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 18,
            borderRadius: 8,
            border: "2px solid #8DB4FF",
            background: "rgba(255,255,255,0.08)",
            color: "#F5F5F5",
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
          }}
        />
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {CHARACTERS.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedAvatar(c)}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
              style={{
                cursor: "pointer",
                width: 108,
                padding: "16px 8px",
                borderRadius: 12,
                background: hover === c.id ? c.color : "rgba(255,255,255,0.06)",
                border: `3px solid ${selectedAvatar.id === c.id ? "#C6F135" : c.color}`,
                textAlign: "center",
                transform: hover === c.id || selectedAvatar.id === c.id ? "translateY(-4px)" : "none",
                transition: "all 0.12s ease",
              }}
            >
              <div style={{ fontSize: 44 }}>{c.emoji}</div>
              <div
                style={{
                  margin: "10px auto 0",
                  width: 28,
                  height: 6,
                  borderRadius: 4,
                  background: c.color,
                }}
              />
            </div>
          ))}
        </div>
        <BigButton
          onClick={startGame}
          color={playerName.trim() ? "#C6F135" : "#788594"}
          style={{ marginTop: 24, cursor: playerName.trim() ? "pointer" : "not-allowed" }}
        >
          Comenzar como {playerName.trim() || "jugador"}
        </BigButton>
      </PixelPanel>
    </div>
  );
}

/* ---------- Pantalla de mapa general ---------- */
function MapScreen({ progress, onEnterLevel, character }) {
  const nodes = [
    { id: "liceo", icon: "🏫", label: "El Liceo" },
    { id: "rumores", icon: "🗣️", label: "Rumores en Red" },
    { id: "centro", icon: "🏥", label: "Centro de Salud" },
    { id: "mision", icon: "🎯", label: "La Misión Final" },
  ];
  return (
    <div style={styles.centerScreen}>
      <h1 style={{ ...styles.title, fontSize: 40 }}>MAPA DE MISIÓN CUIDADO</h1>
      <p style={{ color: "#C9CFEA", marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
        Jugando como {character.emoji} {character.name}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 220px)",
          gap: 22,
        }}
      >
        {nodes.map((n) => {
          const p = progress[n.id];
          const locked = !p.unlocked;
          return (
            <div
              key={n.id}
              onClick={() => !locked && onEnterLevel(n.id)}
              style={{
                cursor: locked ? "not-allowed" : "pointer",
                background: locked ? "rgba(255,255,255,0.05)" : "rgba(198,241,53,0.12)",
                border: `3px solid ${locked ? "#3A4270" : "#C6F135"}`,
                borderRadius: 16,
                padding: "20px 14px",
                textAlign: "center",
                opacity: locked ? 0.55 : 1,
                transition: "transform 0.12s ease",
              }}
              onMouseEnter={(e) => !locked && (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ fontSize: 40 }}>{locked ? "🔒" : n.icon}</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, marginTop: 6, color: "#F5F5F5" }}>
                {n.label}
              </div>
              <div style={{ marginTop: 6 }}>
                {locked ? (
                  <span style={{ fontSize: 12, color: "#8891C4" }}>Bloqueado</span>
                ) : (
                  <StarRow count={p.stars} size={16} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <PixelPanel style={{ marginTop: 26, padding: "14px 18px", borderColor: "#FFB347", textAlign: "center" }}>
        <div style={{ color: "#FFB347", fontWeight: 700, marginBottom: 8 }}>MODO PRUEBA</div>
        <div style={{ color: "#C9CFEA", fontSize: 12, marginBottom: 10 }}>
          Acceso rápido para probar cualquier mapa sin completar los anteriores.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {nodes.map((n) => (
            <BigButton
              key={`test-${n.id}`}
              onClick={() => onEnterLevel(n.id)}
              color="#FFB347"
              style={{ fontSize: 13, padding: "7px 12px" }}
            >
              Probar {n.label}
            </BigButton>
          ))}
        </div>
      </PixelPanel>
      <p style={{ marginTop: 28, color: "#8891C4", fontFamily: "'Inter', sans-serif", fontSize: 13, maxWidth: 480, textAlign: "center" }}>
        Nivel 3 se desbloquea al reunir al menos 4 estrellas entre El Liceo y Rumores en Red.
        Nivel 4 se desbloquea al completar los tres niveles anteriores.
      </p>
    </div>
  );
}

function FinalMissionScreen({ character, onComplete }) {
  const arenaRef = useRef(null);
  const keysRef = useRef(new Set());
  const audioRef = useRef(null);
  const stateRef = useRef({
    player: { x: 105, y: 250, direction: "right", action: "idle", actionUntil: 0, frame: 0 },
    targets: [],
    projectiles: [],
    lastSpawn: 0,
    spawned: 0,
  });
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [wave, setWave] = useState(1);
  const [targets, setTargets] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [player, setPlayer] = useState({ x: 105, y: 250 });
  const [bossHealth, setBossHealth] = useState(100);
  const [populationHealth, setPopulationHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [certificateError, setCertificateError] = useState("");

  useEffect(() => {
    const down = (event) => keysRef.current.add(event.key.toLowerCase());
    const up = (event) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (!started || result) return undefined;
    audioRef.current?.play().catch(() => {});
    let raf;
    let last = performance.now();
    const loop = (time) => {
      const dt = Math.min((time - last) / 1000, 0.04);
      last = time;
      const state = stateRef.current;
      const keys = keysRef.current;
      const speed = 260 * dt;
      const moving = keys.has("w") || keys.has("arrowup") || keys.has("s") || keys.has("arrowdown")
        || keys.has("a") || keys.has("arrowleft") || keys.has("d") || keys.has("arrowright");
      if (keys.has("w") || keys.has("arrowup")) {
        state.player.y -= speed;
        state.player.direction = "up";
      }
      if (keys.has("s") || keys.has("arrowdown")) {
        state.player.y += speed;
        state.player.direction = "down";
      }
      if (keys.has("a") || keys.has("arrowleft")) {
        state.player.x -= speed;
        state.player.direction = "left";
      }
      if (keys.has("d") || keys.has("arrowright")) {
        state.player.x += speed;
        state.player.direction = "right";
      }
      if (moving && time > state.player.actionUntil) state.player.action = "walk";
      if (!moving && time > state.player.actionUntil) state.player.action = "idle";
      state.player.frame = Math.floor(time / 120) % 12;
      state.player.x = Math.max(40, Math.min(860, state.player.x));
      state.player.y = Math.max(35, Math.min(465, state.player.y));
      state.lastSpawn += dt;
      const spawnRate = Math.max(0.35, 1.05 - level * 0.12 - wave * 0.08);
      const waveTotal = 8 + level * 2 + wave;
      if (state.lastSpawn > spawnRate && state.targets.length < 10 && state.spawned < waveTotal) {
        state.lastSpawn = 0;
        state.spawned += 1;
        const bacteria = Math.random() < 0.48;
        const diseases = bacteria ? ["Gonorrea", "Sífilis", "Clamidia"] : ["VIH", "VPH", "Hepatitis B", "Herpes"];
        let spawnY = 60 + Math.random() * 380;
        for (let attempt = 0; attempt < 8; attempt += 1) {
          if (state.targets.every((target) => Math.abs(target.y - spawnY) >= 78)) break;
          spawnY = 60 + Math.random() * 380;
        }
        state.targets.push({
          id: `${time}-${Math.random()}`,
          x: 875,
          y: spawnY,
          disease: diseases[Math.floor(Math.random() * diseases.length)],
          bacteria,
          kind: bacteria ? "bacteria" : "virus",
          speed: 45 + level * 12 + wave * 8,
        });
      }
      state.targets.forEach((target) => { target.x -= target.speed * dt; });
      const nextProjectiles = [];
      state.projectiles.forEach((shot) => {
        shot.x += shot.vx * dt;
        shot.y += shot.vy * dt;
        const hit = state.targets.find((target) => Math.hypot(target.x - shot.x, target.y - shot.y) < 38);
        if (hit) {
          hit.hit = true;
          if (hit.bacteria) {
            setBossHealth((value) => {
              const next = Math.max(0, value - 10);
              if (next === 0) setResult("victory");
              return next;
            });
            setScore((value) => value + 100);
            setCombo((value) => value + 1);
            setMessage(`Impacto efectivo: bacteria eliminada`);
          } else {
            setPopulationHealth((value) => {
              const next = Math.max(0, value - 20);
              if (next === 0) setResult("defeat");
              return next;
            });
            setCombo(0);
            setMessage(`¡Objetivo equivocado! Era ${hit.disease}: un virus`);
          }
        } else if (shot.x < 920 && shot.y > -30 && shot.y < 530) nextProjectiles.push(shot);
      });
      state.projectiles = nextProjectiles;
      state.targets = state.targets.filter((target) => {
        if (target.hit) return false;
        if (target.x < 45) {
          if (target.bacteria) {
            setPopulationHealth((value) => {
              const next = Math.max(0, value - 12);
              if (next === 0) setResult("defeat");
              return next;
            });
            setCombo(0);
            setMessage(`¡La bacteria ${target.disease} alcanzó la zona protegida!`);
          }
          return false;
        }
        return true;
      });
      if (state.spawned >= waveTotal && state.targets.length === 0 && state.projectiles.length === 0) {
        state.spawned = 0;
        if (wave < 3) {
          setWave((value) => value + 1);
          setMessage("Oleada superada. Preparando la siguiente...");
        } else if (level < 3) {
          setLevel((value) => value + 1);
          setWave(1);
          setMessage("Nivel superado. La amenaza se acelera...");
        } else if (bossHealth > 0) {
          setResult("defeat");
        }
      }
      setPlayer({ ...state.player });
      setTargets(state.targets.map((target) => ({ ...target })));
      setProjectiles(state.projectiles.map((shot) => ({ ...shot })));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, result, level, wave]);

  function startMission() {
    stateRef.current = {
      player: { x: 105, y: 250, direction: "right", action: "idle", actionUntil: 0, frame: 0 },
      targets: [],
      projectiles: [],
      lastSpawn: 0,
      spawned: 0,
    };
    setStarted(true);
  }

  function shoot(event) {
    if (!started || result || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const sx = player.x;
    const sy = player.y;
    const tx = ((event.clientX - rect.left) / rect.width) * 900;
    const ty = ((event.clientY - rect.top) / rect.height) * 500;
    const distanceToTarget = Math.hypot(tx - sx, ty - sy) || 1;
    stateRef.current.player.action = "shoot";
    stateRef.current.player.actionUntil = performance.now() + 220;
    stateRef.current.projectiles.push({ x: sx, y: sy, vx: ((tx - sx) / distanceToTarget) * 760, vy: ((ty - sy) / distanceToTarget) * 760 });
  }

  function downloadCertificate() {
    setCertificateError("");
    const image = new Image();
    image.src = publicAsset("final-mission/certificate-template.png");
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        setCertificateError("No se pudo preparar el certificado para descargar.");
        return;
      }
      context.drawImage(image, 0, 0);
      context.fillStyle = "#123B73";
      context.font = "700 42px Inter, Arial, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(character.name, canvas.width / 2, 320);
      const link = document.createElement("a");
      link.download = `certificado-mision-cuidado-${character.name.trim().replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    image.onerror = () => setCertificateError("No se pudo cargar la plantilla del certificado.");
  }

  if (result) {
    const victory = result === "victory";
    return (
      <div style={styles.finalMission} className="final-mission">
        <div style={styles.finalMissionOverlay}>
          <h1 style={{ ...styles.title, color: victory ? "#7CE0C6" : "#FF8FB1" }}>
            {victory ? "¡MISIÓN COMPLETADA!" : "MISIÓN FALLIDA"}
          </h1>
          <p>{victory ? "Lograste superar los niveles y usar el antibiótico contra las bacterias." : "Una bacteria alcanzó la población antes de que pudieras eliminarla."}</p>
          {victory && (
            <div style={styles.certificateBox}>
              <div style={styles.certificatePreview}>
                <img src={publicAsset("final-mission/certificate-template.png")} alt="Certificado de logro" style={styles.certificatePreviewImage} />
                <span style={styles.certificateName}>{character.name}</span>
              </div>
              <BigButton onClick={downloadCertificate} color="#1BA7E1">
                Descargar certificado
              </BigButton>
              {certificateError && <p style={styles.certificateError}>{certificateError}</p>}
            </div>
          )}
          <BigButton onClick={() => onComplete(victory ? 3 : 0)} color={victory ? "#C6F135" : "#FF8FB1"}>Volver al mapa</BigButton>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={styles.finalMission} className="final-mission">
        <div style={styles.finalMissionOverlay}>
          <h1 style={styles.title}>MISIÓN FINAL</h1>
          <p>La amenaza está formada por bacterias y virus.</p>
          <div style={styles.finalMissionIntro}>
            <div style={styles.finalMissionIntroDoctor}>
              <img
                src={publicAsset("final-mission/doctor.png")}
                alt="Doctor preparado para combatir las ITS"
                style={styles.finalMissionIntroDoctorImage}
              />
            </div>
            <p>{character.name}, mové al doctor con WASD o flechas y dispará con el mouse.</p>
          </div>
          <p style={{ color: "#C6F135", maxWidth: 560 }}>
            El antibiótico cura Gonorrea, Sífilis y Clamidia. Si disparás a VIH, VPH, Hepatitis B o Herpes,
            perdés protección porque son virus. Si un virus pasa de largo, no daña a la población.
          </p>
          <BigButton onClick={startMission}>Comenzar misión</BigButton>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.finalMission} className="final-mission">
      <div style={styles.finalMissionHeader}>
        <strong>MISIÓN FINAL · ATAQUE ANTIBIÓTICO</strong>
        <span>NIVEL {level}/3 · OLEADA {wave}/3 · COMBO x{combo}</span>
      </div>
      <div style={styles.finalMissionLayout}>
        <div style={styles.finalMissionVisuals}>
          <img src={publicAsset("final-mission/doctor.png")} alt="Dr. Vega" style={{ ...styles.finalMissionDoctor, filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))" }} />
          <img src={publicAsset("final-mission/city.png")} alt="Población" style={styles.finalMissionCity} />
        </div>
        <div style={styles.finalMissionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <strong style={{ color: "#FF4D8D" }}>BOSS {Math.max(0, Math.round(bossHealth))}/100</strong>
            <strong style={{ color: "#7CE0C6" }}>POBLACIÓN {populationHealth}/100</strong>
          </div>
          <div style={styles.finalMissionBar}><span style={{ width: `${bossHealth}%`, background: "#FF4D8D" }} /></div>
          <div style={styles.finalMissionBar}><span style={{ width: `${populationHealth}%`, background: "#7CE0C6" }} /></div>
          <p style={{ color: "#8DB4FF", marginBottom: 4 }}>WASD / flechas: mover · Mouse: apuntar y disparar</p>
          <p style={{ marginTop: 0, color: "#C9CFEA", fontSize: 13 }}>
            Leé el nombre de cada objetivo y elegí con cuidado: todos se muestran de la misma forma.
          </p>
          <div ref={arenaRef} style={styles.finalMissionArena} onClick={shoot}>
            <div
              style={{
                ...styles.finalMissionPlayer,
                left: `${(player.x / 900) * 100}%`,
                top: `${(player.y / 500) * 100}%`,
                backgroundImage: `url('/final-mission/${player.action === "shoot" ? "doctor-shoot" : "doctor-idle-walk"}.png')`,
                backgroundPosition: `-${((player.action === "walk" ? 3 : 0) + (player.frame % 3)) * 108.6}px 0`,
                transform: `translate(-50%, -50%)${player.direction === "left" ? " scaleX(-1)" : ""}`,
              }}
            />
            {projectiles.map((shot) => <div key={`${shot.x}-${shot.y}`} style={{ ...styles.finalMissionProjectile, left: `${(shot.x / 900) * 100}%`, top: `${(shot.y / 500) * 100}%` }}>💊</div>)}
            {targets.map((target) => (
              <div
                key={target.id}
                style={{
                  ...styles.finalMissionTarget,
                  left: `${(target.x / 900) * 100}%`,
                  top: `${(target.y / 500) * 100}%`,
                }}
              >
                {target.disease}
              </div>
            ))}
          </div>
          <div style={{ minHeight: 25, marginTop: 8, color: message.includes("equivocado") || message.includes("alcanzó") ? "#FF8FB1" : "#C6F135", fontSize: 13 }}>{message}</div>
        </div>
        <div style={styles.finalMissionBossPanel}>
          <img src={publicAsset("final-mission/boss.png")} alt="Amenaza final" style={styles.finalMissionBoss} />
        </div>
      </div>
      <audio ref={audioRef} src={publicAsset("final-mission/TensionLoop.wav")} loop preload="auto" />
    </div>
  );
}

/* ---------- HUD ---------- */
function HUD({ level, stars, missionText, inventoryCount, onOpenInventory, onPause }) {
  return (
    <div style={styles.hudBar}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <PixelPanel style={{ padding: "6px 14px" }}>
          <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700 }}>{level.name}</span>
        </PixelPanel>
        <PixelPanel style={{ padding: "6px 14px" }}>🎯 {missionText}</PixelPanel>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <PixelPanel style={{ padding: "6px 14px" }}>
          <StarRow count={stars} size={16} />
        </PixelPanel>
        <button onClick={onOpenInventory} style={styles.iconButton}>
          🎒 {inventoryCount}
        </button>
        <button onClick={onPause} style={styles.iconButton}>
          ⏸
        </button>
      </div>
    </div>
  );
}

/* ---------- Prompt de interacción ---------- */
function InteractPrompt({ label }) {
  if (!label) return null;
  return (
    <div style={styles.interactPrompt}>
      <span style={{ background: "#C6F135", color: "#10163A", borderRadius: 6, padding: "2px 8px", fontWeight: 800, marginRight: 8 }}>
        E
      </span>
      {label}
    </div>
  );
}

/* ---------- Toast de feedback rápido (pickup, etc) ---------- */
function Toast({ text }) {
  if (!text) return null;
  return <div style={styles.toast}>{text}</div>;
}

/* ---------- Modal genérico ---------- */
function ModalShell({ title, children, accent = "#C6F135" }) {
  return (
    <div style={styles.modalOverlay}>
      <PixelPanel style={{ maxWidth: 520, width: "92%", padding: 22, borderColor: accent }}>
        {title && (
          <h3 style={{ marginTop: 0, fontFamily: "'Baloo 2', sans-serif", color: accent }}>{title}</h3>
        )}
        {children}
      </PixelPanel>
    </div>
  );
}

/* ---------- Modal de diálogo NPC (secuencial) ---------- */
function DialogueModal({ npc, lineIndex, onNext }) {
  const line = npc.dialogue[lineIndex];
  const isLast = lineIndex >= npc.dialogue.length - 1;
  return (
    <ModalShell accent={npc.color}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ fontSize: 40 }}>{npc.emoji}</div>
        <div>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, marginBottom: 6 }}>
            {npc.name}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{line}</div>
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: 18 }}>
        <BigButton onClick={onNext} color={npc.color}>
          {isLast ? "Continuar" : "Siguiente"}
        </BigButton>
      </div>
    </ModalShell>
  );
}

/* ---------- Modal de desafío MITO/REALIDAD ---------- */
function MitoModal({ data, onAnswer, feedback, onRetry, onClose }) {
  return (
    <ModalShell title="¿MITO O REALIDAD?" accent="#FFD166">
      <p style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{data.text}</p>
      {!feedback ? (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 14 }}>
          <BigButton color="#FF4D8D" onClick={() => onAnswer("mito")}>
            MITO
          </BigButton>
          <BigButton color="#8DB4FF" onClick={() => onAnswer("realidad")}>
            REALIDAD
          </BigButton>
        </div>
      ) : (
        <FeedbackBlock feedback={feedback} onRetry={onRetry} onClose={onClose} />
      )}
    </ModalShell>
  );
}

/* ---------- Modal Verdadero/Falso ---------- */
function TrueFalseModal({ data, onAnswer, feedback, onRetry, onClose }) {
  return (
    <ModalShell title="VERDADERO O FALSO" accent="#8DB4FF">
      <p style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{data.text}</p>
      {!feedback ? (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 14 }}>
          <BigButton color="#8DB4FF" onClick={() => onAnswer(true)}>
            VERDADERO
          </BigButton>
          <BigButton color="#FF4D8D" onClick={() => onAnswer(false)}>
            FALSO
          </BigButton>
        </div>
      ) : (
        <FeedbackBlock feedback={feedback} onRetry={onRetry} onClose={onClose} />
      )}
    </ModalShell>
  );
}

/* ---------- Modal Opción múltiple ---------- */
function MCModal({ data, onAnswer, feedback, onRetry, onClose }) {
  return (
    <ModalShell title="RESPONDÉ" accent="#C6F135">
      <p style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{data.text}</p>
      {!feedback ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {data.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 8,
                border: "2px solid #C6F135",
                background: "rgba(255,255,255,0.06)",
                color: "#F5F5F5",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <FeedbackBlock feedback={feedback} onRetry={onRetry} onClose={onClose} />
      )}
    </ModalShell>
  );
}

/* ---------- Bloque de feedback compartido ---------- */
function FeedbackBlock({ feedback, onRetry, onClose }) {
  const ok = feedback.correct;
  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          background: ok ? "rgba(198,241,53,0.15)" : "rgba(255,77,141,0.15)",
          border: `2px solid ${ok ? "#C6F135" : "#FF4D8D"}`,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <strong>{ok ? "¡Correcto!" : "Revisá esta idea."}</strong>
        <div style={{ marginTop: 6, lineHeight: 1.5 }}>{feedback.explanation}</div>
      </div>
      <div style={{ textAlign: "right", marginTop: 14 }}>
        {ok ? (
          <BigButton onClick={onClose}>Continuar</BigButton>
        ) : (
          <BigButton color="#8DB4FF" onClick={onRetry}>
            Intentar de nuevo
          </BigButton>
        )}
      </div>
    </div>
  );
}

/* ---------- Modal ficha informativa (ITS) ---------- */
function InfoCardModal({ data, onClose }) {
  return (
    <ModalShell title={`FICHA · ${data.name}`} accent="#8DB4FF">
      <div style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
        <p>
          <strong>Transmisión:</strong> {data.transmission}
        </p>
        <p>
          <strong>Prevención:</strong> {data.prevention}
        </p>
        <p style={{ color: "#C9CFEA" }}>{data.note}</p>
      </div>
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <BigButton onClick={onClose}>Cerrar</BigButton>
      </div>
    </ModalShell>
  );
}

/* ---------- Modal quiz múltiple (varias preguntas seguidas) ---------- */
function MultiQuizModal({ questions, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const q = questions[idx];
  const answer = (i) => {
    const correct = i === q.correctIndex;
    setFeedback({ correct, explanation: q.explanation });
  };
  const next = () => {
    setFeedback(null);
    if (idx + 1 >= questions.length) onFinish();
    else setIdx(idx + 1);
  };
  return (
    <MCModal
      data={{ text: `(${idx + 1}/${questions.length}) ${q.text}`, options: q.options }}
      onAnswer={answer}
      feedback={feedback}
      onRetry={() => setFeedback(null)}
      onClose={next}
    />
  );
}

/* ---------- Modal de escenarios de decisión (uno o varios) ---------- */
function ScenarioModal({ scenarios, onFinish }) {
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const s = scenarios[idx];
  const answer = (i) => {
    const correct = i === s.correctIndex;
    setFeedback({ correct, explanation: s.explanation });
  };
  const next = () => {
    setFeedback(null);
    if (idx + 1 >= scenarios.length) onFinish();
    else setIdx(idx + 1);
  };
  return (
    <ModalShell title="SITUACIÓN" accent="#FF8FB1">
      <p style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>{s.text}</p>
      {!feedback ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
          {s.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: 8,
                border: "2px solid #FF8FB1",
                background: "rgba(255,255,255,0.06)",
                color: "#F5F5F5",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <FeedbackBlock feedback={feedback} onRetry={() => setFeedback(null)} onClose={next} />
      )}
    </ModalShell>
  );
}

/* ---------- Modal Drag & Drop (clasificación de métodos) ---------- */
function DragDropModal({ onFinish }) {
  const [placed, setPlaced] = useState({}); // methodId -> categoryId
  const [checked, setChecked] = useState(false);
  const [dragId, setDragId] = useState(null);

  const remaining = CONTRACEPTIVE_METHODS.filter((m) => !(m.id in placed));

  const handleDrop = (categoryId) => {
    if (!dragId) return;
    setPlaced((p) => ({ ...p, [dragId]: categoryId }));
    setDragId(null);
    setChecked(false);
  };

  const correctCount = CONTRACEPTIVE_METHODS.filter((m) => placed[m.id] === m.category).length;
  const allPlaced = Object.keys(placed).length === CONTRACEPTIVE_METHODS.length;
  const allCorrect = checked && correctCount === CONTRACEPTIVE_METHODS.length;

  return (
    <div style={styles.modalOverlay}>
      <PixelPanel style={{ maxWidth: 720, width: "94%", padding: 20, borderColor: "#8DB4FF" }}>
        <h3 style={{ marginTop: 0, fontFamily: "'Baloo 2', sans-serif", color: "#8DB4FF" }}>
          CLASIFICÁ LOS MÉTODOS
        </h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#C9CFEA" }}>
          Arrastrá cada tarjeta a la categoría que corresponda.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, minHeight: 40, marginBottom: 14 }}>
          {remaining.map((m) => (
            <div
              key={m.id}
              draggable
              onDragStart={() => setDragId(m.id)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "#232B5E",
                border: "2px solid #C6F135",
                cursor: "grab",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
              }}
            >
              {m.name}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10 }}>
          {METHOD_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(cat.id)}
              style={{
                minHeight: 100,
                border: "2px dashed #8DB4FF",
                borderRadius: 10,
                padding: 8,
                background: "rgba(141,180,255,0.08)",
              }}
            >
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 13, marginBottom: 6 }}>
                {cat.label}
              </div>
              {CONTRACEPTIVE_METHODS.filter((m) => placed[m.id] === cat.id).map((m) => {
                const isCorrect = checked ? m.category === cat.id : null;
                return (
                  <div
                    key={m.id}
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                      marginBottom: 4,
                      borderRadius: 6,
                      background:
                        isCorrect === null ? "#10163A" : isCorrect ? "rgba(198,241,53,0.25)" : "rgba(255,77,141,0.25)",
                      border: `1px solid ${isCorrect === null ? "#3A4270" : isCorrect ? "#C6F135" : "#FF4D8D"}`,
                    }}
                  >
                    {m.name}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "right", marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {!allCorrect && (
            <BigButton
              color="#8DB4FF"
              onClick={() => setChecked(true)}
              style={{ opacity: allPlaced ? 1 : 0.5, pointerEvents: allPlaced ? "auto" : "none" }}
            >
              Verificar
            </BigButton>
          )}
          {checked && !allCorrect && (
            <BigButton
              color="#FF4D8D"
              onClick={() => {
                setPlaced({});
                setChecked(false);
              }}
            >
              Reintentar
            </BigButton>
          )}
          {allCorrect && <BigButton onClick={onFinish}>¡Listo! Continuar</BigButton>}
        </div>
      </PixelPanel>
    </div>
  );
}

/* ---------- Modal de fragmento (misión final) ---------- */
function FragmentModal({ mission, onFinish }) {
  const c = mission.challenge;
  const [feedback, setFeedback] = useState(null);

  const finishWithResult = (correct, explanation) => setFeedback({ correct, explanation });

  if (c.type === "mito") {
    return (
      <MitoModal
        data={c}
        feedback={feedback}
        onAnswer={(a) => finishWithResult(a === c.answer, c.explanation)}
        onRetry={() => setFeedback(null)}
        onClose={() => onFinish(feedback.correct)}
      />
    );
  }
  if (c.type === "truefalse") {
    return (
      <TrueFalseModal
        data={c}
        feedback={feedback}
        onAnswer={(a) => finishWithResult(a === c.answer, c.explanation)}
        onRetry={() => setFeedback(null)}
        onClose={() => onFinish(feedback.correct)}
      />
    );
  }
  return (
    <MCModal
      data={c}
      feedback={feedback}
      onAnswer={(i) => finishWithResult(i === c.correctIndex, c.explanation)}
      onRetry={() => setFeedback(null)}
      onClose={() => onFinish(feedback.correct)}
    />
  );
}

/* ---------- Pantalla de pausa ---------- */
function PauseMenu({ onResume, onMap }) {
  return (
    <div style={styles.modalOverlay}>
      <PixelPanel style={{ padding: 28, width: 300, textAlign: "center" }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", marginTop: 0 }}>PAUSA</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          <BigButton onClick={onResume}>Continuar</BigButton>
          <BigButton color="#8DB4FF" onClick={onMap}>
            Volver al mapa
          </BigButton>
        </div>
      </PixelPanel>
    </div>
  );
}

/* ---------- Panel de inventario ---------- */
function InventoryPanel({ items, onClose }) {
  return (
    <div style={styles.modalOverlay}>
      <PixelPanel style={{ padding: 22, width: 360, maxHeight: "70vh", overflowY: "auto" }}>
        <h3 style={{ fontFamily: "'Baloo 2', sans-serif", marginTop: 0 }}>🎒 INVENTARIO</h3>
        {items.length === 0 && (
          <p style={{ color: "#8891C4", fontFamily: "'Inter', sans-serif" }}>
            Todavía no encontraste objetos. ¡Seguí explorando!
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #3A4270",
                borderRadius: 8,
                padding: "8px 10px",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
              }}
            >
              <strong>{it.emoji} {it.label}</strong>
              <div style={{ color: "#C9CFEA", marginTop: 4 }}>{it.text}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 16 }}>
          <BigButton onClick={onClose}>Cerrar</BigButton>
        </div>
      </PixelPanel>
    </div>
  );
}

/* ---------- Pantalla de nivel completado ---------- */
function LevelCompleteScreen({ levelName, stars, onContinue, justUnlocked }) {
  return (
    <div style={styles.centerScreen}>
      <PixelPanel style={{ padding: 32, textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 44 }}>🏁</div>
        <h2 style={{ fontFamily: "'Baloo 2', sans-serif", margin: "8px 0" }}>¡NIVEL COMPLETADO!</h2>
        <p style={{ color: "#C9CFEA", fontFamily: "'Inter', sans-serif" }}>{levelName}</p>
        <div style={{ margin: "18px 0" }}>
          <StarRow count={stars} size={40} />
        </div>
        {justUnlocked && (
          <p style={{ color: "#C6F135", fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
            🔓 ¡Se desbloqueó "{justUnlocked}"!
          </p>
        )}
        <BigButton onClick={onContinue}>Volver al mapa</BigButton>
      </PixelPanel>
    </div>
  );
}

/* ================================================================
   PANTALLA DE JUEGO (canvas + lógica de exploración)
   ================================================================ */
function GameScreen({ levelConfig, character, onExitToMap, onLevelFinished, playSound }) {
  const canvasRef = useRef(null);
  const keysRef = useRef(new Set());
  const playerRef = useRef({ x: levelConfig.spawn.x, y: levelConfig.spawn.y, dir: "down", moving: false });
  const cameraRef = useRef({ x: 0, y: 0 });
  const runtimeRef = useRef({
    doneObjects: {}, // id -> true
    doneNpcs: {}, // id -> true
    stars: { 1: false, 2: false, 3: false },
  });
  const pausedRef = useRef(false);
  const modalOpenRef = useRef(false);

  const [, forceTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [nearby, setNearby] = useState(null); // {label, ref}
  const [modal, setModal] = useState(null); // {kind, payload}
  const [toast, setToast] = useState("");
  const [levelDone, setLevelDone] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [editorWalls, setEditorWalls] = useState(() => {
    try {
      const saved = localStorage.getItem(`zelia-walls-${levelConfig.id}`);
      if (!saved) return [...(levelConfig.collisionWalls || levelConfig.walls)];
      const walls = JSON.parse(saved);
      const cleanedWalls = walls.filter((wall) => wall.w * wall.h >= 500);
      if (cleanedWalls.length !== walls.length) {
        localStorage.setItem(`zelia-walls-${levelConfig.id}`, JSON.stringify(cleanedWalls));
      }
      return cleanedWalls;
    } catch {
      return [...(levelConfig.collisionWalls || levelConfig.walls)];
    }
  });
  const toastTimer = useRef(null);

  useEffect(() => {
    if (levelConfig.id === "liceo") {
      const guide = levelConfig.npcs.find((npc) => npc.id === "prof_ana");
      if (guide) setModal({ kind: "dialogue", npc: guide, lineIndex: 0 });
    }
  }, [levelConfig]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    modalOpenRef.current = !!modal || inventoryOpen;
  }, [modal, inventoryOpen]);

  const showToast = useCallback((text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  }, []);

  // --- keyboard ---
  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(k)) {
        keysRef.current.add(k);
        e.preventDefault();
      }
      if (k === "e") handleInteractKey();
      if (k === "escape") setPaused((p) => !p);
      if (k === "i") setInventoryOpen((o) => !o);
    };
    const up = (e) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearby, modal]);

  const nearbyRef = useRef(null);
  useEffect(() => {
    nearbyRef.current = nearby;
  }, [nearby]);

  function handleInteractKey() {
    if (modalOpenRef.current || pausedRef.current) return;
    const n = nearbyRef.current;
    if (!n) return;
    openInteraction(n.target);
  }

  function collectInventoryItem(item) {
    setInventory((inv) => [...inv, item]);
  }

  function markStar(idx) {
    if (!runtimeRef.current.stars[idx]) {
      runtimeRef.current.stars[idx] = true;
      playSound("star");
      showToast(`⭐ ¡Estrella ${idx} conseguida!`);
    }
  }

  function currentStarCount() {
    const s = runtimeRef.current.stars;
    return (s[1] ? 1 : 0) + (s[2] ? 1 : 0) + (s[3] ? 1 : 0);
  }

  function checkExit() {
    if (!areLevelObjectivesComplete(levelConfig, runtimeRef.current)) {
      showToast("Todavía hay cosas por resolver en este nivel 🔎");
      return;
    }
    markStar(1);
    playSound("complete");
    setLevelDone(true);
  }

  function updateEditorWalls(nextWalls) {
    setEditorWalls(nextWalls);
    localStorage.setItem(`zelia-walls-${levelConfig.id}`, JSON.stringify(nextWalls));
  }

  function resetEditorWalls() {
    updateEditorWalls([...(levelConfig.collisionWalls || levelConfig.walls)]);
  }

  /* ---------- abrir interacción según tipo de entidad ---------- */
  function openInteraction(target) {
    if (target.kind === "npc") {
      const npc = target.data;
      if (npc.dialogue && !runtimeRef.current.doneNpcs[npc.id + "_talked"]) {
        setModal({ kind: "dialogue", npc, lineIndex: 0 });
      } else if (npc.challenge) {
        openChallengeForNpc(npc);
      }
      return;
    }
    if (target.kind === "exit") {
      checkExit();
      return;
    }
    const obj = target.data;
    if (runtimeRef.current.doneObjects[obj.id] && obj.type !== "infocard") return;

    switch (obj.type) {
      case "mito": {
        const data = MYTHS_DATA.find((m) => m.id === obj.dataId);
        setModal({ kind: "mito", obj, data, feedback: null });
        break;
      }
      case "pista": {
        runtimeRef.current.doneObjects[obj.id] = true;
        collectInventoryItem({ emoji: obj.emoji, label: obj.label, text: obj.text });
        playSound("pickup");
        showToast(`📌 Pista encontrada: ${obj.label}`);
        if (obj.starIndex) markStar(obj.starIndex);
        forceTick((t) => t + 1);
        break;
      }
      case "bonus": {
        runtimeRef.current.doneObjects[obj.id] = true;
        collectInventoryItem({ emoji: BONUS_FRAGMENT.emoji, label: BONUS_FRAGMENT.label, text: BONUS_FRAGMENT.text });
        playSound("pickup");
        showToast("✨ ¡Encontraste algo extra!");
        if (obj.starIndex) markStar(obj.starIndex);
        forceTick((t) => t + 1);
        break;
      }
      case "infocard": {
        const data = ITS_DATA.find((d) => d.id === obj.dataId);
        runtimeRef.current.doneObjects[obj.id] = true;
        setModal({ kind: "infocard", data });
        forceTick((t) => t + 1);
        break;
      }
      case "dragdrop": {
        setModal({ kind: "dragdrop" });
        break;
      }
      case "fragment": {
        const mission = MISSIONS_DATA.find((m) => m.id === obj.missionId);
        setModal({ kind: "fragment", obj, mission });
        break;
      }
      default:
        break;
    }
  }

  function openChallengeForNpc(npc) {
    const ch = npc.challenge;
    if (ch.type === "truefalse") {
      const data = TRUEFALSE_DATA.find((d) => d.id === ch.dataId);
      setModal({ kind: "truefalse", npc, data, feedback: null });
    } else if (ch.type === "mc") {
      const data = MC_QUESTIONS.find((d) => d.id === ch.dataId);
      setModal({ kind: "mc", npc, data, feedback: null });
    } else if (ch.type === "decision") {
      const scenario = SCENARIOS_DATA.find((s) => s.id === ch.scenarioId);
      setModal({ kind: "scenario_single", npc, scenario, ch });
    } else if (ch.type === "quiz_multi") {
      setModal({ kind: "quiz_multi", npc, ch });
    } else if (ch.type === "scenarios_multi") {
      setModal({ kind: "scenarios_multi", npc, ch });
    }
  }

  function closeModal() {
    setModal(null);
    forceTick((t) => t + 1);
  }

  function resolveMitoOrTF(correct) {
    setModal((m) => ({ ...m, feedback: { correct, explanation: m.data.explanation } }));
    playSound(correct ? "correct" : "incorrect");
  }

  function finalizeSimpleObjective(obj, npc) {
    if (obj) {
      runtimeRef.current.doneObjects[obj.id] = true;
    }
    if (npc) {
      runtimeRef.current.doneNpcs[npc.id] = true;
      if (npc.challenge && npc.challenge.starIndex) markStar(npc.challenge.starIndex);
    }
    closeModal();
  }

  return (
    <div style={{ position: "relative", width: VIEW_W, height: VIEW_H, margin: "0 auto" }}>
      <HUD
        level={levelConfig}
        stars={currentStarCount()}
        missionText={levelConfig.subtitle}
        inventoryCount={inventory.length}
        onOpenInventory={() => setInventoryOpen(true)}
        onPause={() => setPaused(true)}
      />
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 12,
          zIndex: 50,
          pointerEvents: "auto",
        }}
      >
        <BigButton
          onClick={() => setEditorMode((value) => !value)}
          color={editorMode ? "#FFB347" : "#8DB4FF"}
          style={{ fontSize: 12, padding: "6px 10px" }}
        >
          {editorMode ? "Cerrar editor" : "✏ Editar muros"}
        </BigButton>
        {editorMode && (
          <PixelPanel style={{ marginTop: 8, padding: 10, width: 235, borderColor: "#FFB347", fontSize: 11 }}>
            Arrastrá para dibujar un muro. Clic derecho para borrarlo.
            <br />
            Los cambios se guardan en este navegador.
            <button
              onClick={resetEditorWalls}
              style={{ marginTop: 8, padding: "5px 8px", cursor: "pointer", borderRadius: 6, border: 0 }}
            >
              Restaurar muros originales
            </button>
          </PixelPanel>
        )}
      </div>
      <GameCanvas
        canvasRef={canvasRef}
        levelConfig={levelConfig}
        character={character}
        playerRef={playerRef}
        cameraRef={cameraRef}
        keysRef={keysRef}
        runtimeRef={runtimeRef}
        pausedRef={pausedRef}
        modalOpenRef={modalOpenRef}
        setNearby={setNearby}
        playSound={playSound}
        editorMode={editorMode}
        editorWalls={editorWalls}
        onEditorWallsChange={updateEditorWalls}
      />
      <InteractPrompt label={nearby ? nearby.label : null} />
      <Toast text={toast} />

      {paused && !modal && (
        <PauseMenu onResume={() => setPaused(false)} onMap={() => onExitToMap(runtimeRef.current)} />
      )}
      {inventoryOpen && <InventoryPanel items={inventory} onClose={() => setInventoryOpen(false)} />}

      {modal && modal.kind === "dialogue" && (
        <DialogueModal
          npc={modal.npc}
          lineIndex={modal.lineIndex}
          onNext={() => {
            if (modal.lineIndex + 1 >= modal.npc.dialogue.length) {
              runtimeRef.current.doneNpcs[modal.npc.id + "_talked"] = true;
              if (modal.npc.challenge) {
                openChallengeForNpc(modal.npc);
              } else {
                closeModal();
              }
            } else {
              setModal({ ...modal, lineIndex: modal.lineIndex + 1 });
            }
          }}
        />
      )}

      {modal && modal.kind === "mito" && (
        <MitoModal
          data={modal.data}
          feedback={modal.feedback}
          onAnswer={(a) => resolveMitoOrTF(a === modal.data.answer)}
          onRetry={() => setModal((m) => ({ ...m, feedback: null }))}
          onClose={() => finalizeSimpleObjective(modal.obj, null)}
        />
      )}

      {modal && modal.kind === "truefalse" && (
        <TrueFalseModal
          data={modal.data}
          feedback={modal.feedback}
          onAnswer={(a) => resolveMitoOrTF(a === modal.data.answer)}
          onRetry={() => setModal((m) => ({ ...m, feedback: null }))}
          onClose={() => finalizeSimpleObjective(null, modal.npc)}
        />
      )}

      {modal && modal.kind === "mc" && (
        <MCModal
          data={modal.data}
          feedback={modal.feedback}
          onAnswer={(i) => resolveMitoOrTF(i === modal.data.correctIndex)}
          onRetry={() => setModal((m) => ({ ...m, feedback: null }))}
          onClose={() => finalizeSimpleObjective(null, modal.npc)}
        />
      )}

      {modal && modal.kind === "infocard" && <InfoCardModal data={modal.data} onClose={closeModal} />}

      {modal && modal.kind === "dragdrop" && (
        <DragDropModal
          onFinish={() => {
            runtimeRef.current.doneObjects["dragdrop_done"] = true;
            markStar(2);
            playSound("correct");
            closeModal();
          }}
        />
      )}

      {modal && modal.kind === "quiz_multi" && (
        <MultiQuizModal
          questions={ITS_QUIZ}
          onFinish={() => {
            runtimeRef.current.doneObjects["enfermera_rosa_done"] = true;
            runtimeRef.current.doneNpcs[modal.npc.id] = true;
            markStar(1);
            playSound("correct");
            closeModal();
          }}
        />
      )}

      {modal && modal.kind === "scenarios_multi" && (
        <ScenarioModal
          scenarios={modal.ch.scenarioIds.map((id) => SCENARIOS_DATA.find((s) => s.id === id))}
          onFinish={() => {
            runtimeRef.current.doneObjects["doctor_lucas_done"] = true;
            runtimeRef.current.doneNpcs[modal.npc.id] = true;
            markStar(3);
            playSound("correct");
            closeModal();
          }}
        />
      )}

      {modal && modal.kind === "scenario_single" && (
        <ScenarioModal
          scenarios={[modal.scenario]}
          onFinish={() => {
            runtimeRef.current.doneNpcs[modal.npc.id] = true;
            if (modal.ch.starIndex) markStar(modal.ch.starIndex);
            playSound("correct");
            closeModal();
          }}
        />
      )}

      {modal && modal.kind === "fragment" && (
        <FragmentModal
          mission={modal.mission}
          onFinish={(correct) => {
            if (correct) {
              runtimeRef.current.doneObjects[modal.obj.id] = true;
              collectInventoryItem({ emoji: modal.mission.emoji, label: modal.mission.label, text: "Fragmento conseguido." });
              showToast(`${modal.mission.emoji} Fragmento "${modal.mission.label}" conseguido`);
              playSound("pickup");
            }
            closeModal();
          }}
        />
      )}

      {levelDone && (
        <LevelDoneOverlay
          levelConfig={levelConfig}
          stars={currentStarCount()}
          onContinue={() => onLevelFinished(levelConfig.id, currentStarCount())}
        />
      )}
    </div>
  );
}

function LevelDoneOverlay({ levelConfig, stars, onContinue }) {
  return (
    <div style={styles.modalOverlay}>
      <LevelCompleteScreen levelName={levelConfig.name} stars={stars} onContinue={onContinue} />
    </div>
  );
}

/* ================================================================
   CANVAS DE JUEGO: render + loop + colisiones + cámara
   ================================================================ */
function GameCanvas({
  canvasRef,
  levelConfig,
  character,
  playerRef,
  cameraRef,
  keysRef,
  runtimeRef,
  pausedRef,
  modalOpenRef,
  setNearby,
  playSound,
  editorMode,
  editorWalls,
  onEditorWallsChange,
}) {
  const lastNearbyId = useRef(null);
  const stepSoundTimer = useRef(0);
  const editorDragRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const backgroundImage = levelConfig.backgroundImage ? new Image() : null;
    if (backgroundImage) backgroundImage.src = levelConfig.backgroundImage;
    let raf;
    let lastTime = performance.now();

    function getInteractables() {
      const list = [];
      const exitReady = areLevelObjectivesComplete(levelConfig, runtimeRef.current);
      levelConfig.npcs.forEach((npc) => {
        list.push({ kind: "npc", x: npc.x, y: npc.y, w: 40, h: 40, data: npc, label: `HABLAR CON ${npc.name.toUpperCase()}` });
      });
      levelConfig.objects.forEach((obj) => {
        if (runtimeRef.current.doneObjects[obj.id] && obj.type !== "infocard" && obj.type !== "dragdrop") return;
        const labelMap = {
          mito: "INVESTIGAR CARTEL",
          pista: "RECOGER PISTA",
          bonus: "INVESTIGAR",
          infocard: "LEER FICHA",
          dragdrop: "USAR MESA",
          fragment: "INVESTIGAR",
        };
        list.push({ kind: "object", x: obj.x, y: obj.y, w: 36, h: 36, data: obj, label: labelMap[obj.type] || "INTERACTUAR" });
      });
      const ex = levelConfig.exit;
      list.push({
        kind: "exit",
        x: ex.x,
        y: ex.y,
        w: ex.w,
        h: ex.h,
        data: ex,
        label: exitReady ? "SALIR / ENTREGAR" : "SALIDA BLOQUEADA",
      });
      return list;
    }

    function update(dt) {
      const keys = keysRef.current;
      let dx = 0,
        dy = 0;
      if (keys.has("arrowup") || keys.has("w")) dy -= 1;
      if (keys.has("arrowdown") || keys.has("s")) dy += 1;
      if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
      if (keys.has("arrowright") || keys.has("d")) dx += 1;

      const moving = dx !== 0 || dy !== 0;
      const player = playerRef.current;
      player.moving = moving;

      if (moving) {
        const len = Math.hypot(dx, dy) || 1;
        dx = (dx / len) * PLAYER_SPEED * dt;
        dy = (dy / len) * PLAYER_SPEED * dt;
        if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? "right" : "left";
        else if (dy !== 0) player.dir = dy > 0 ? "down" : "up";

        const walls = editorWalls;
        const box = () => ({ x: player.x, y: player.y, w: PLAYER_SIZE, h: PLAYER_SIZE });

        player.x += dx;
        let b = box();
        for (const w of walls) {
          if (rectsOverlap(b, w)) {
            player.x -= dx;
            break;
          }
        }
        player.y += dy;
        b = box();
        for (const w of walls) {
          if (rectsOverlap(b, w)) {
            player.y -= dy;
            break;
          }
        }
        player.x = Math.max(4, Math.min(levelConfig.width - PLAYER_SIZE - 4, player.x));
        player.y = Math.max(4, Math.min(levelConfig.height - PLAYER_SIZE - 4, player.y));

        stepSoundTimer.current += dt;
        if (stepSoundTimer.current > 0.28) {
          stepSoundTimer.current = 0;
        }
      }

      // camara
      const cam = cameraRef.current;
      cam.x = Math.max(0, Math.min(levelConfig.width - VIEW_W, player.x + PLAYER_SIZE / 2 - VIEW_W / 2));
      cam.y = Math.max(0, Math.min(levelConfig.height - VIEW_H, player.y + PLAYER_SIZE / 2 - VIEW_H / 2));

      // proximidad
      const interactables = getInteractables();
      const pcx = player.x + PLAYER_SIZE / 2;
      const pcy = player.y + PLAYER_SIZE / 2;
      let best = null;
      let bestDist = INTERACT_RADIUS;
      for (const it of interactables) {
        const cx = it.x + it.w / 2;
        const cy = it.y + it.h / 2;
        const d = distance(pcx, pcy, cx, cy);
        if (d < bestDist) {
          bestDist = d;
          best = it;
        }
      }
      const bestId = best ? (best.data.id || "exit") : null;
      if (bestId !== lastNearbyId.current) {
        lastNearbyId.current = bestId;
        setNearby(best ? { label: best.label, target: best } : null);
      } else if (best) {
        // actualizar referencia target por si cambió estado interno
        setNearby((prev) => (prev ? { ...prev, target: best } : prev));
      }
    }

    function draw() {
      const cam = cameraRef.current;
      const player = playerRef.current;
      ctx.clearRect(0, 0, VIEW_W, VIEW_H);
      ctx.save();
      ctx.translate(-cam.x, -cam.y);

      if (backgroundImage) {
        if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
          ctx.drawImage(backgroundImage, 0, 0, levelConfig.width, levelConfig.height);
        } else {
          ctx.fillStyle = levelConfig.floorColor;
          ctx.fillRect(0, 0, levelConfig.width, levelConfig.height);
        }
      } else {
        // piso
        ctx.fillStyle = levelConfig.floorColor;
        ctx.fillRect(0, 0, levelConfig.width, levelConfig.height);
        // grilla suave
        ctx.strokeStyle = "rgba(0,0,0,0.04)";
        for (let gx = 0; gx < levelConfig.width; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, levelConfig.height);
          ctx.stroke();
        }
        for (let gy = 0; gy < levelConfig.height; gy += 40) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(levelConfig.width, gy);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(16,22,58,0.35)";
        ctx.font = "700 13px 'Baloo 2', sans-serif";
        (levelConfig.labels || []).forEach((l) => ctx.fillText(l.text, l.x, l.y));
        (levelConfig.decorations || []).forEach((d) => drawDecoration(ctx, d));
        ctx.fillStyle = "#788594";
        levelConfig.walls.forEach((w) => {
          ctx.fillRect(w.x, w.y, w.w, w.h);
          ctx.strokeStyle = "#26344A";
          ctx.strokeRect(w.x, w.y, w.w, w.h);
        });
      }

      // objetos
      levelConfig.objects.forEach((obj) => {
        const done = runtimeRef.current.doneObjects[obj.id];
        if (done && obj.type !== "infocard" && obj.type !== "dragdrop") return;
        drawInteractable(ctx, obj, levelConfig.accent, done);
      });

      // NPCs
      levelConfig.npcs.forEach((npc) => {
        drawNpc(ctx, npc);
      });

      // salida
      const ex = levelConfig.exit;
      const exitReady = areLevelObjectivesComplete(levelConfig, runtimeRef.current);
      ctx.fillStyle = exitReady ? "rgba(198,241,53,0.25)" : "rgba(120,133,148,0.2)";
      ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
      ctx.strokeStyle = exitReady ? "#C6F135" : "#788594";
      ctx.lineWidth = 2;
      ctx.strokeRect(ex.x, ex.y, ex.w, ex.h);
      ctx.fillStyle = exitReady ? "#10163A" : "#4D5866";
      ctx.font = "700 11px 'Inter', sans-serif";
      ctx.fillText(exitReady ? ex.label : "SALIDA BLOQUEADA", ex.x + 4, ex.y + ex.h + 14);

      if (editorMode) {
        ctx.save();
        ctx.fillStyle = "rgba(255,179,71,0.38)";
        ctx.strokeStyle = "#FFB347";
        ctx.lineWidth = 2;
        editorWalls.forEach((wall) => {
          ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
          ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
        });
        ctx.restore();
      }

      // jugador
      const bob = player.moving ? Math.sin(performance.now() / 90) * 3 : 0;
      drawPlayer(ctx, player.x, player.y - bob, character.color, character.id, character);

      ctx.restore();
    }

    function loop(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!pausedRef.current && !modalOpenRef.current && !editorMode) {
        update(dt);
      }
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelConfig, editorMode, editorWalls]);

  return (
    <canvas
      ref={canvasRef}
      width={VIEW_W}
      height={VIEW_H}
      style={{
        display: "block",
        borderRadius: "0 0 14px 14px",
        boxShadow: "0 10px 0 rgba(0,0,0,0.35)",
        cursor: editorMode ? "crosshair" : "default",
      }}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (!editorMode) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const scaleX = VIEW_W / rect.width;
        const scaleY = VIEW_H / rect.height;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const worldX = x * scaleX + cameraRef.current.x;
        const worldY = y * scaleY + cameraRef.current.y;
        if (event.button === 2) {
          const index = editorWalls.findIndex((wall) => rectsOverlap({ x: worldX, y: worldY, w: 1, h: 1 }, wall));
          if (index >= 0) onEditorWallsChange(editorWalls.filter((_, wallIndex) => wallIndex !== index));
          return;
        }
        editorDragRef.current = { x: worldX, y: worldY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        if (!editorMode || !editorDragRef.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const scaleX = VIEW_W / rect.width;
        const scaleY = VIEW_H / rect.height;
        const endX = (event.clientX - rect.left) * scaleX + cameraRef.current.x;
        const endY = (event.clientY - rect.top) * scaleY + cameraRef.current.y;
        const start = editorDragRef.current;
        editorDragRef.current = null;
        const wall = {
          x: Math.max(0, Math.min(start.x, endX)),
          y: Math.max(0, Math.min(start.y, endY)),
          w: Math.min(levelConfig.width, Math.abs(endX - start.x)),
          h: Math.min(levelConfig.height, Math.abs(endY - start.y)),
        };
        if (wall.w >= 8 && wall.h >= 8) {
          onEditorWallsChange([...editorWalls, wall]);
        }
      }}
    />
  );
}

function drawDecoration(ctx, decoration) {
  const { x, y, emoji, size = 28 } = decoration;
  const kind = decoration.kind || emoji;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(16,22,58,0.22)";
  ctx.fillStyle = "rgba(16,22,58,0.12)";
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size + 5, size / 2, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  if (kind === "tree" || kind === "🌳") {
    ctx.fillStyle = "#6B4F3A";
    ctx.fillRect(x + size * 0.4, y + size * 0.48, size * 0.2, size * 0.46);
    ctx.fillStyle = "#4E9B70";
    ctx.beginPath();
    ctx.arc(x + size * 0.5, y + size * 0.3, size * 0.33, 0, Math.PI * 2);
    ctx.arc(x + size * 0.28, y + size * 0.48, size * 0.23, 0, Math.PI * 2);
    ctx.arc(x + size * 0.72, y + size * 0.48, size * 0.23, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "desk" || kind === "🪑") {
    ctx.fillStyle = "#B9794D";
    ctx.fillRect(x + 3, y + 8, size - 6, size * 0.35);
    ctx.fillRect(x + 6, y + size * 0.43, 4, size * 0.5);
    ctx.fillRect(x + size - 10, y + size * 0.43, 4, size * 0.5);
    ctx.strokeRect(x + 3, y + 8, size - 6, size * 0.35);
  } else if (kind === "books" || kind === "📚") {
    ["#FF8FB1", "#8DB4FF", "#C6F135"].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(x + index * (size * 0.25), y + size * (0.55 - index * 0.08), size * 0.22, size * (0.35 + index * 0.08));
    });
  } else if (kind === "fountain" || kind === "⛲") {
    ctx.fillStyle = "#8DB4FF";
    ctx.beginPath();
    ctx.ellipse(x + size / 2, y + size * 0.72, size * 0.43, size * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + size * 0.4, y + size * 0.38, size * 0.2, size * 0.32);
    ctx.strokeStyle = "#E4EEFB";
    ctx.beginPath();
    ctx.moveTo(x + size * 0.5, y + size * 0.38);
    ctx.quadraticCurveTo(x + size * 0.32, y + size * 0.1, x + size * 0.2, y + size * 0.3);
    ctx.moveTo(x + size * 0.5, y + size * 0.38);
    ctx.quadraticCurveTo(x + size * 0.68, y + size * 0.1, x + size * 0.8, y + size * 0.3);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#FFD166";
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawInteractable(ctx, obj, accent, done) {
  const x = obj.x;
  const y = obj.y;
  const size = 36;
  const color = done ? "#8891C4" : accent;
  ctx.save();
  ctx.globalAlpha = done ? 0.45 : 1;
  ctx.fillStyle = "rgba(16,22,58,0.18)";
  ctx.beginPath();
  ctx.ellipse(x + size / 2, y + size + 5, size / 2.3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.strokeStyle = "#10163A";
  ctx.lineWidth = 2;
  if (obj.type === "mito") {
    ctx.fillRect(x + 5, y + 3, size - 10, size - 4);
    ctx.strokeRect(x + 5, y + 3, size - 10, size - 4);
    ctx.fillStyle = "#10163A";
    ctx.fillRect(x + 11, y + 11, size - 22, 2);
    ctx.fillRect(x + 11, y + 18, size - 16, 2);
  } else if (obj.type === "infocard") {
    ctx.fillRect(x + 3, y + 5, size - 6, size - 7);
    ctx.strokeRect(x + 3, y + 5, size - 6, size - 7);
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(x + 9, y + 12, size - 18, 3);
    ctx.fillRect(x + 9, y + 19, size - 13, 3);
  } else if (obj.type === "fragment") {
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-11, -11, 22, 22);
    ctx.strokeRect(-11, -11, 22, 22);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = "#10163A";
    ctx.font = "700 18px sans-serif";
    ctx.fillText("+", -5, 6);
  } else {
    ctx.fillRect(x + 5, y + 8, size - 10, size - 12);
    ctx.strokeRect(x + 5, y + 8, size - 10, size - 12);
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(x + 11, y + 14, size - 22, 3);
    ctx.fillRect(x + 11, y + 21, size - 16, 3);
  }
  ctx.restore();
}

function drawNpc(ctx, npc) {
  drawPlayer(ctx, npc.x, npc.y, npc.color, npc.id, npc);
  ctx.save();
  ctx.fillStyle = "rgba(16,22,58,0.82)";
  ctx.font = "700 11px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(npc.name, npc.x + 20, npc.y - 7);
  ctx.restore();
}

function drawPlayer(ctx, x, y, color, id, appearance = {}) {
  ctx.save();
  ctx.fillStyle = "rgba(16,22,58,0.18)";
  ctx.beginPath();
  ctx.ellipse(x + 17, y + 39, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color || "#C6F135";
  ctx.beginPath();
  ctx.roundRect(x + 7, y + 18, 20, 18, 6);
  ctx.fill();
  ctx.fillStyle = appearance.skin || "#F6C9A7";
  ctx.beginPath();
  ctx.arc(x + 17, y + 12, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = appearance.hair || (id.includes("cami") ? "#4C315E" : "#342B35");
  ctx.beginPath();
  ctx.arc(
    x + 17,
    y + 9,
    appearance.hairStyle === "long" ? 11 : 9,
    Math.PI,
    Math.PI * 2,
  );
  ctx.fill();
  if (appearance.hairStyle === "long") {
    ctx.fillRect(x + 7, y + 9, 5, 16);
    ctx.fillRect(x + 22, y + 9, 5, 16);
  }
  ctx.fillStyle = "#10163A";
  ctx.fillRect(x + 10, y + 36, 5, 5);
  ctx.fillRect(x + 19, y + 36, 5, 5);
  ctx.restore();
}

/* ================================================================
   COMPONENTE PRINCIPAL
   ================================================================ */
const LEVELS = buildLevels();

export default function MisionCuidadoGame() {
  const [screen, setScreen] = useState("select"); // select | map | game
  const [character, setCharacter] = useState(null);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [lastResult, setLastResult] = useState(null); // {levelId, stars}
  const playSound = useSound();

  const [progress, setProgress] = useState({
    liceo: { unlocked: true, stars: 0, completed: false },
    rumores: { unlocked: false, stars: 0, completed: false },
    centro: { unlocked: false, stars: 0, completed: false },
    mision: { unlocked: false, stars: 0, completed: false },
  });

  function computeUnlocks(p) {
    const np = { ...p, liceo: { ...p.liceo, unlocked: true } };
    np.rumores = { ...np.rumores, unlocked: np.liceo.completed };
    const combo = np.liceo.stars + np.rumores.stars;
    np.centro = { ...np.centro, unlocked: combo >= 4 };
    np.mision = { ...np.mision, unlocked: np.liceo.completed && np.rumores.completed && np.centro.completed };
    return np;
  }

  function handleSelectCharacter(c) {
    setCharacter(c);
    setScreen("map");
  }

  function handleEnterLevel(levelId) {
    setCurrentLevelId(levelId);
    setScreen("game");
  }

  function handleExitToMap() {
    setScreen("map");
    setCurrentLevelId(null);
  }

  function handleLevelFinished(levelId, stars) {
    setProgress((p) => {
      const updated = {
        ...p,
        [levelId]: { ...p[levelId], stars: Math.max(p[levelId].stars, stars), completed: true },
      };
      return computeUnlocks(updated);
    });
    setLastResult({ levelId, stars });
    playSound("unlock");
    setScreen("map");
    setCurrentLevelId(null);
  }

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

      {screen === "select" && <CharacterSelectScreen onSelect={handleSelectCharacter} />}

      {screen === "map" && character && (
        <MapScreen progress={progress} onEnterLevel={handleEnterLevel} character={character} />
      )}

      {screen === "game" && currentLevelId && (
        currentLevelId === "mision" ? (
          <FinalMissionScreen
            character={character}
            onComplete={(stars) => handleLevelFinished("mision", stars)}
          />
        ) : (
          <GameScreen
            key={currentLevelId}
            levelConfig={LEVELS[currentLevelId]}
            character={character}
            onExitToMap={handleExitToMap}
            onLevelFinished={handleLevelFinished}
            playSound={playSound}
          />
        )
      )}
    </div>
  );
}

/* ================================================================
   ESTILOS BASE
   ================================================================ */
const styles = {
  app: {
    minHeight: "100vh",
    width: "100%",
    overflowY: "auto",
    background: "radial-gradient(circle at 20% 20%, #1A2258 0%, #10163A 60%, #0B0F2A 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    color: "#F5F5F5",
  },
  finalMission: {
    position: "relative",
    width: "calc(100vw - 24px)",
    maxWidth: 1800,
    minHeight: "min(900px, 97vh)",
    boxSizing: "border-box",
    overflow: "visible",
    borderRadius: 18,
    background: "#09152F url('/final-mission/background.png') center / cover",
    boxShadow: "0 12px 0 rgba(0,0,0,0.35)",
    padding: 22,
    fontFamily: "'Inter', sans-serif",
  },
  finalMissionOverlay: {
    minHeight: "min(700px, 86vh)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: 30,
    background: "rgba(5,12,32,0.72)",
    borderRadius: 14,
  },
  certificateBox: {
    width: "min(760px, 92vw)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    margin: "12px 0 18px",
  },
  certificatePreview: {
    position: "relative",
    width: "100%",
    lineHeight: 0,
    borderRadius: 10,
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,.35)",
  },
  certificatePreviewImage: {
    display: "block",
    width: "100%",
    height: "auto",
  },
  certificateName: {
    position: "absolute",
    left: "22%",
    top: "37.5%",
    width: "56%",
    color: "#123B73",
    fontFamily: "'Inter', sans-serif",
    fontSize: "clamp(16px, 3.3vw, 42px)",
    fontWeight: 700,
    lineHeight: 1.1,
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  certificateError: {
    color: "#FFB4C6",
    fontSize: 13,
    margin: 0,
  },
  finalMissionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    color: "#F5F5F5",
    fontSize: 15,
    letterSpacing: 1,
    padding: "8px 12px 20px",
  },
  finalMissionLayout: {
    display: "grid",
    gridTemplateColumns: "minmax(150px, .55fr) minmax(0, 2.5fr) minmax(190px, .8fr)",
    alignItems: "center",
    gap: 18,
    minHeight: 700,
  },
  finalMissionVisuals: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  finalMissionDoctor: { width: "min(190px, 100%)", maxHeight: 330, objectFit: "contain" },
  finalMissionIntro: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    maxWidth: 760,
    margin: "8px auto 14px",
  },
  finalMissionIntroDoctor: {
    position: "relative",
    width: 300,
    height: 390,
    overflow: "hidden",
    flexShrink: 0,
    borderRadius: 14,
    background: "rgba(0,0,0,.22)",
  },
  finalMissionIntroDoctorImage: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  finalMissionCity: { width: "100%", maxWidth: 360, marginTop: 12, objectFit: "contain" },
  finalMissionBoss: { width: "min(300px, 100%)", maxHeight: 360, objectFit: "contain", justifySelf: "center" },
  finalMissionBossPanel: {
    minHeight: 430,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 16,
    background: "rgba(4,12,30,.35)",
  },
  finalMissionCard: {
    minWidth: 0,
    background: "rgba(10,20,42,0.94)",
    border: "2px solid #8DB4FF",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 8px 0 rgba(0,0,0,.28)",
  },
  finalMissionBar: {
    height: 12,
    marginTop: 9,
    background: "rgba(255,255,255,.12)",
    borderRadius: 8,
    overflow: "hidden",
  },
  finalMissionAnswer: {
    textAlign: "left",
    border: "2px solid #8DB4FF",
    borderRadius: 9,
    padding: "11px 13px",
    background: "rgba(141,180,255,.1)",
    color: "#F5F5F5",
    cursor: "pointer",
    fontSize: 14,
  },
  finalMissionArena: {
    position: "relative",
    height: "min(440px, 52vh)",
    minHeight: 260,
    marginTop: 14,
    border: "2px dashed rgba(141,180,255,.55)",
    borderRadius: 12,
    background: "linear-gradient(rgba(4,16,7,.46), rgba(4,16,7,.46)), url('/final-mission/arena-organisms.png') center / cover",
    overflow: "hidden",
  },
  finalMissionTarget: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    minWidth: 140,
    minHeight: 48,
    padding: "12px 16px",
    border: "2px solid #8DB4FF",
    borderRadius: 10,
    background: "rgba(16,22,58,.95)",
    color: "#F5F5F5",
    cursor: "crosshair",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  finalMissionPlayer: {
    position: "absolute",
    width: 110,
    height: 145,
    backgroundImage: "url('/final-mission/doctor-idle-walk.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1303px 145px",
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 3,
    filter: "drop-shadow(0 3px 3px rgba(0,0,0,.5))",
  },
  finalMissionProjectile: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    fontSize: 20,
    zIndex: 2,
  },
  centerScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 10px",
  },
  title: {
    fontFamily: "'Baloo 2', sans-serif",
    fontWeight: 800,
    fontSize: 56,
    margin: 0,
    letterSpacing: 2,
    color: "#C6F135",
    textShadow: "0 4px 0 rgba(0,0,0,0.4)",
  },
  subtitle: {
    fontFamily: "'Baloo 2', sans-serif",
    color: "#FF8FB1",
    marginTop: 4,
    letterSpacing: 3,
    fontSize: 14,
  },
  hudBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    gap: 8,
  },
  iconButton: {
    background: "rgba(16,22,58,0.92)",
    border: "2px solid #C6F135",
    borderRadius: 10,
    color: "#F5F5F5",
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 13,
  },
  interactPrompt: {
    position: "absolute",
    bottom: 18,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(16,22,58,0.92)",
    border: "2px solid #C6F135",
    borderRadius: 10,
    padding: "6px 14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    display: "flex",
    alignItems: "center",
  },
  toast: {
    position: "absolute",
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(198,241,53,0.95)",
    color: "#10163A",
    borderRadius: 10,
    padding: "8px 16px",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 13,
    boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
  },
  modalOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(5,8,26,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    zIndex: 20,
    padding: 14,
  },
};
