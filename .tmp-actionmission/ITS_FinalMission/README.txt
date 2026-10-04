MISIÓN CUIDADO: SALUD EN ACCIÓN
================================

RESUMEN
-------
Videojuego educativo 2D sobre salud sexual, prevención de infecciones de transmisión sexual (ITS), métodos anticonceptivos, consentimiento y autocuidado. El jugador crea su perfil con un nombre y uno de seis avatares, explora escenarios, conversa con personajes, revisa objetos, responde preguntas y toma decisiones. El recorrido termina con una misión de acción que pone a prueba lo aprendido.

El juego está desarrollado con React y Vite. La ruta normal tiene cuatro niveles, que se desbloquean progresivamente. El mapa incluye un modo de prueba para acceder a cualquier nivel directamente.

NIVELES
-------

1. EL LICEO — MITOS Y REALIDADES
La profesora Ariana pide revisar mensajes que circulan en el liceo. El jugador recorre el mapa, consulta cinco carteles y ayuda a Cami a decidir cómo verificar una afirmación sobre el VIH. Los carteles tratan sobre transmisión del VIH, ITS sin síntomas, preservativos, prejuicios sobre quién puede contraer una ITS y anticoncepción de emergencia. Cada respuesta explica el contenido. Un libro escondido brinda una pista adicional sobre consentimiento y diálogo.

2. RUMORES EN RED — PREVENCIÓN Y TOMA DE DECISIONES
Los personajes comparten dudas surgidas de chats y conversaciones. El jugador resuelve tres preguntas de verdadero o falso y dos de opción múltiple, y ayuda a Vero a decidir qué hacer con un mensaje alarmante. Se abordan el uso de preservativos, la posibilidad de tener una ITS sin síntomas visibles, la baja confiabilidad del coito interrumpido, la diferencia entre anticoncepción y prevención de ITS, y la consulta con profesionales o fuentes confiables. Un celular escondido ofrece una pista sobre verificar antes de reenviar información.

3. CENTRO DE SALUD — ITS Y MÉTODOS ANTICONCEPTIVOS
El nivel se divide en tres espacios:
- Sala de ITS: consultar fichas sobre VIH, sífilis, gonorrea y VPH, y responder preguntas sobre controles y vacunación contra el VPH.
- Sala de métodos: clasificar métodos de barrera, hormonales, dispositivos intrauterinos, permanentes y de emergencia. Se trabaja que los métodos tienen distintos propósitos y que no todos previenen ITS.
- Sala de decisiones: resolver situaciones sobre hablar con una pareja de prevención y controles, y acompañar a una amiga que tiene dudas sobre anticoncepción. Se refuerzan el diálogo y la consulta profesional.

Para completar el nivel hay que leer las cuatro fichas, terminar la clasificación y responder los desafíos de la enfermera Rosa y el doctor Lucas.

4. LA MISIÓN FINAL — OPERACIÓN ANTIBIÓTICO
Este nivel cambia la exploración por una misión de acción con tres niveles y tres oleadas por nivel. El doctor se mueve por la arena y dispara mientras protege a la población. Los objetivos no muestran su categoría:
- Gonorrea, sífilis y clamidia son bacterias; acertarles reduce la vida del boss.
- VIH, VPH, hepatitis B y herpes son virus; dispararles por error reduce la protección de la población.
- Si una bacteria llega a la zona protegida, también reduce la protección. Los virus que pasan de largo no causan daño.
- La población comienza con 100 puntos de protección y el boss con 100 puntos de vida. La partida se gana al derrotar al boss y se pierde si la protección llega a cero o si se terminan las oleadas sin derrotarlo.

Al ganar, aparece un certificado con el nombre elegido al inicio, que puede descargarse como PNG.

PROGRESIÓN
----------
Orden recomendado: El Liceo → Rumores en Red → Centro de Salud → La Misión Final. El Centro de Salud se desbloquea al reunir al menos cuatro estrellas entre los dos primeros niveles. La Misión Final requiere completar los tres niveles previos. El modo de prueba permite saltar estos requisitos.

CONTROLES
---------
Mapas explorables:
- WASD o flechas: mover al personaje.
- E: interactuar con objetos y personajes.
- I: abrir el inventario.
- Escape: pausar.

Operación Antibiótico:
- WASD o flechas: mover al doctor.
- Mouse: apuntar.
- Clic izquierdo: disparar.

EJECUTAR EL PROYECTO
--------------------
Requisitos: Node.js y npm.

Instalar dependencias: npm install
Iniciar en desarrollo: npm run dev
Compilar para producción: npm run build
