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

## Editar el escenario 1

Dentro del primer nivel, elegí **NPC y pistas** para abrir el lápiz de edición. Seleccioná NPC o Pista y hacé clic en el mapa para ubicarlo; después completá el nombre o título y el diálogo o contenido. También podés borrar elementos existentes desde la lista.

La herramienta **Salida** permite reubicarla. Por defecto aparece sobre el cartel “Exit” de `public/liceo.png`. Movete por el mapa con WASD o las flechas para llegar a otras zonas mientras editás.

Al cerrar cualquiera de los lápices, los cambios se guardan en `src/editorData.json` dentro del proyecto, no en el almacenamiento del navegador. Los lápices de muros y de NPC/pistas son independientes; editar contenido no modifica los muros. Esta función de guardado requiere ejecutar el proyecto con `npm run dev`.

## Ejecutar localmente

```bash
npm install
npm run dev
```
