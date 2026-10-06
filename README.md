# JOB QUEST

JOB QUEST: Build Your Future es un juego educativo en inglés pensado para reforzar vocabulario laboral, comunicación en el trabajo, comportamiento profesional y preparación para entrevistas.

El juego sigue una estructura de misión: el jugador comienza eligiendo un avatar y un nombre, luego avanza por desafíos relacionados con trabajos, situaciones del entorno laboral, práctica de should/shouldn’t, preparación para entrevistas y una misión final que integra todo lo aprendido.

## Objetivos principales de aprendizaje

- Reconocer y usar vocabulario relacionado con profesiones.
- Comprender descripciones simples de diferentes trabajos.
- Identificar comportamientos apropiados en el lugar de trabajo.
- Usar should y shouldn’t en situaciones reales.
- Prepararse para una entrevista de trabajo con respuestas claras y profesionales.
- Reflexionar sobre el aprendizaje y el progreso.

## Flujo del juego

1. Pantalla de inicio
2. Introducción de la historia
3. Nivel 1: Jobs
4. Nivel 2: Workplace Decisions
5. Nivel 3: Career Center
6. Nivel 4: Final Mission
7. Resultado y reflexión

## Editar los escenarios del modo prueba

En los escenarios explorables abiertos desde **Modo prueba** (Career Clues, Workplace Decisions y Career Center), elegí **NPC y pistas** para abrir el editor. Con **Mover/editar**, arrastrá los NPC, carteles y pistas existentes o hacé clic sobre uno para cambiar su nombre/título, emoji, diálogo o contenido. También podés usar la lista para editar o eliminar elementos, o elegir NPC/Pista para agregar nuevos.

El botón **Desafío** permite editar preguntas existentes, opciones, respuesta correcta y explicación; agregar o quitar preguntas; crear un desafío para un NPC o quitarle el que tiene. Los desafíos de los carteles también se pueden editar y asignar a un NPC. La herramienta **Salida** permite reubicar la salida. Movete por el mapa con WASD o las flechas antes de abrir el lápiz. Mientras el lápiz esté abierto, el juego queda pausado y las teclas se pueden usar para escribir.

Al crear o editar un NPC, el editor permite elegir presentación, tono de piel, largo y color del cabello, y color de ropa. El ícono del NPC es opcional y se muestra junto al personaje.

Cada cambio confirmado con el lápiz de NPC y pistas (crear, editar, mover, eliminar y guardar desafíos) se escribe inmediatamente en `src/editorData.json` dentro del proyecto. El editor muestra el estado del guardado y avisa si falla. Los cambios de muros se guardan al cerrar su lápiz. No se guardan solo en el navegador. Ejecutá `npm run dev` para editar y luego incluí `src/editorData.json` en el proyecto/versionado y generá el build para publicar los cambios.

## Ejecutar localmente

```bash
npm install
npm run dev
```
