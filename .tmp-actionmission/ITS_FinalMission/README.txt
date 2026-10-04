MISIÓN FINAL — OPERACIÓN ANTIBIÓTICO
====================================

Esta versión convierte la misión final en un videojuego de acción 2D.

CONCEPTO
- El jugador controla a un doctor.
- El doctor dispone de un arma que dispara proyectiles de antibiótico.
- Los objetivos que aparecen en el campo NO indican si son bacterias o virus.
- El jugador debe decidir y disparar sin recibir pistas visuales.
- Si el proyectil impacta una bacteria, el Boss pierde vida.
- Si el proyectil impacta un virus, la población pierde protección.
- Si un objetivo alcanza la zona protegida, la población también pierde protección.
- Hay 3 niveles y 3 oleadas por nivel.
- El Boss final tiene 100 de vida y se va debilitando al eliminar bacterias.
- La población comienza con 100 de protección.
- Al llegar el Boss a 0 aparece la pantalla de victoria.
- Si la población llega a 0 aparece la pantalla de derrota.

CONTENIDO EDUCATIVO
Bacterias utilizadas en la lógica del juego:
- Gonorrea
- Sífilis
- Clamidia

Virus utilizados como objetivos trampa:
- VIH
- VPH
- Hepatitis B
- Herpes

IMPORTANTE
Durante la partida no se muestran los nombres ni se da una pista visual sobre la categoría del objetivo.
Después de un impacto incorrecto se informa al jugador qué objetivo era y por qué el antibiótico no era la herramienta adecuada.

JUGABILIDAD
- WASD o flechas: mover al doctor.
- Ratón: apuntar.
- Clic izquierdo mantenido: disparar.
- Los proyectiles salen desde el arma del doctor.
- El objetivo es reducir la vida del Boss a 0 antes de que la población quede sin protección.

AUDIO
- Assets/Resources/TensionLoop.wav contiene la música instrumental de tensión.
- Se reproduce en loop durante la misión.
- No se utiliza el audio hablado del material anterior.

INTERFAZ
- HUD de nivel y oleada.
- Barra de vida del Boss.
- Barra de protección de la población.
- Puntaje y combo.
- Mensajes de impacto.
- Pantalla de inicio.
- Pantalla de victoria: “¡MISIÓN COMPLETADA! Lograste superar todos los niveles”.
- Pantalla de derrota con opción de volver a intentar.

REQUISITOS
- Unity 2022.3 LTS o compatible.
- Abrir Assets/Scenes/FinalMission.unity y presionar Play.

La interfaz y los gráficos principales se generan por código, por lo que no es necesario configurar prefabs manualmente.
