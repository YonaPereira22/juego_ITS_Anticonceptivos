# Misión Cuidado: Salud en Acción



**Misión Cuidado: Salud en Acción** es un videojuego educativo 2D sobre salud sexual, prevención de infecciones de transmisión sexual (ITS), anticoncepción, consentimiento y autocuidado. La persona jugadora recorre escenarios, conversa con personajes, analiza información, resuelve preguntas y toma decisiones. La aventura culmina en una misión de acción que refuerza la diferencia entre bacterias y virus y la importancia de usar correctamente la información sobre tratamientos.

Al comenzar, se ingresa un nombre y se elige uno de seis avatares. El recorrido normal se completa en orden, consiguiendo estrellas y desbloqueando nuevas etapas. El mapa también ofrece un modo de prueba para entrar directamente a cualquiera de los niveles.

## Niveles

### 1. El Liceo: mitos y realidades

La aventura comienza en el liceo. La profesora Ariana pide investigar mensajes que circulan por la escuela. Hay que recorrer el mapa, leer cinco carteles y conversar con Cami para responder una situación sobre un rumor relacionado con el VIH. Cada cartel plantea un mito o una realidad y, al responder, el juego explica por qué la afirmación es correcta o incorrecta.

Los temas incluyen las formas de transmisión del VIH, las ITS que pueden no presentar síntomas, el uso del preservativo, los prejuicios sobre quién puede contraer una ITS y el uso de la anticoncepción de emergencia. También se puede encontrar una pista adicional sobre consentimiento y diálogo como parte del autocuidado.

### 2. Rumores en Red: prevención y toma de decisiones

En este escenario, varios personajes tienen dudas que nacieron de mensajes, conversaciones o información incompleta. La persona jugadora responde tres preguntas de verdadero o falso y dos preguntas de opción múltiple, y ayuda a Vero a decidir qué hacer ante un mensaje alarmante.

Se aprende que usar dos preservativos a la vez no ofrece doble protección, que algunas ITS no tienen signos visibles, que el coito interrumpido no es un método confiable y que las pastillas anticonceptivas no previenen ITS. El nivel también destaca la importancia de consultar fuentes confiables y verificar la información antes de creerla o reenviarla. Un celular escondido ofrece una pista extra sobre este último punto.

### 3. Centro de Salud: ITS y métodos anticonceptivos

El centro de salud tiene tres espacios de trabajo:

- **Sala de ITS:** se consultan fichas sobre VIH, sífilis, gonorrea y VPH, con información sobre transmisión, prevención y aspectos importantes de cada infección. Después se responden preguntas sobre la ausencia de síntomas y la vacuna contra el VPH.
- **Sala de métodos:** se clasifican métodos anticonceptivos en categorías de barrera, hormonales, dispositivos intrauterinos, permanentes y de emergencia. La actividad muestra que los métodos tienen propósitos distintos y que no todos protegen frente a las ITS.
- **Sala de decisiones:** se resuelven dos situaciones prácticas: cómo conversar con una pareja sobre prevención y controles, y cómo acompañar a una amiga que tiene dudas sobre un método anticonceptivo. El nivel promueve el diálogo y la consulta con profesionales de salud.

Para completar el nivel hay que revisar las fichas, terminar la clasificación y resolver las situaciones propuestas por el doctor Lucas y la enfermera Rosa.

### 4. La Misión Final: Operación Antibiótico

Este nivel cambia la exploración por una misión de acción. El jugador controla a un doctor y protege a la población durante tres niveles de dificultad creciente, cada uno con tres oleadas. Los objetivos aparecen sin indicar visualmente si son bacterias o virus, así que hay que decidir con lo aprendido:

- **Gonorrea, sífilis y clamidia** son los objetivos bacterianos del juego. Acertarles reduce la vida del boss.
- **VIH, VPH, hepatitis B y herpes** son los objetivos virales. Dispararles por error reduce la protección de la población.
- Si una bacteria atraviesa la arena y llega a la zona protegida, la población también pierde protección. Los virus que pasan de largo no la dañan.
- La misión se gana al reducir a cero la vida del boss. Se pierde si la protección de la población llega a cero o si se terminan las oleadas sin derrotar al boss.

La misión muestra puntaje, combo, vida del boss y protección de la población. Tras una victoria se presenta un certificado personalizado con el nombre elegido al inicio, descargable en formato PNG.

## Progresión y objetivos

El recorrido recomendado es **El Liceo → Rumores en Red → Centro de Salud → La Misión Final**. El Centro de Salud se desbloquea al reunir al menos cuatro estrellas entre los dos primeros niveles. La Misión Final se desbloquea al completar los tres niveles anteriores. El modo de prueba permite saltarse estos requisitos para probar mapas.

Los mapas de exploración se completan conversando con personajes, interactuando con objetos y terminando sus objetivos. Las respuestas incluyen explicaciones educativas. El sistema de estrellas refleja los desafíos y pistas opcionales encontrados durante cada etapa.

## Controles

### Mapas explorables

- **WASD o flechas:** mover al personaje.
- **E:** interactuar con objetos y personajes.
- **I:** abrir el inventario.
- **Escape:** pausar.

### Operación Antibiótico

- **WASD o flechas:** mover al doctor.
- **Mouse:** apuntar.
- **Clic izquierdo:** disparar.

## Herramientas de desarrollo

El juego permite editar muros en los mapas compatibles: `Editar muros` activa la edición, arrastrar con el botón izquierdo crea muros y hacer clic derecho los elimina. Las modificaciones se guardan localmente por mapa en el navegador.

## Ejecutar el proyecto

Requisitos:

- Node.js
- npm

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor local:

```bash
npm run dev
```

Luego abrir la URL indicada por Vite, normalmente:

```text
http://localhost:5173/
```

Crear una compilación de producción:

```bash
npm run build
```

## Estructura principal

```text
.
├── public/
│   ├── final-mission/
│   │   ├── arena-organisms.png
│   │   ├── boss.png
│   │   ├── certificate-template.png
│   │   ├── city.png
│   │   ├── doctor.png
│   │   ├── doctor-actions.png
│   │   ├── doctor-idle-walk.png
│   │   ├── doctor-jump-fall.png
│   │   ├── doctor-shoot.png
│   │   └── TensionLoop.wav
│   ├── hospital.png
│   └── plaza.png
├── src/
│   ├── MisionCuidadoGame.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## Persistencia local

Los muros editados se guardan en `localStorage` del navegador mediante claves asociadas a cada nivel. Borrar los datos del sitio puede eliminar las modificaciones realizadas desde el editor.

## Recursos de la misión final

- `doctor.png`: imagen completa del doctor para la presentación y el panel lateral.
- `doctor-actions.png`: hoja original de movimientos.
- `doctor-idle-walk.png`: fila separada para quieto y caminata.
- `doctor-shoot.png`: fila separada para disparo.
- `doctor-jump-fall.png`: fila separada para salto y caída.
- `arena-organisms.png`: fondo de la arena.
- `boss.png`: amenaza final.
- `city.png`: población protegida.
- `TensionLoop.wav`: música de tensión.
- `certificate-template.png`: plantilla del certificado descargable.

## Verificación

La compilación actual se valida con:

```bash
npm run build
```

El estado actual compila correctamente con Vite y no presenta errores de diagnóstico en el archivo principal.
