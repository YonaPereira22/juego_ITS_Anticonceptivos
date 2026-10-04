# Misión Cuidado: Salud en Acción

Videojuego educativo 2D desarrollado con React y Vite. El jugador explora distintos escenarios, resuelve situaciones relacionadas con la prevención de ITS y completa una misión final de acción contra un boss.

## Estado actual

La versión actual incluye:

- Pantalla inicial con nombre libre y selección de avatar.
- Seis avatares disponibles.
- Modo prueba para acceder directamente a cualquier nivel.
- Tres mapas explorables:
  - **El Liceo**
  - **Rumores en Red**
  - **Centro de Salud**
- Objetivos educativos con diálogos, pistas, preguntas y objetos coleccionables.
- Sistema de estrellas y desbloqueo progresivo de niveles.
- Editor manual de muros:
  - `Editar muros` activa el modo de edición.
  - Arrastrar con el botón izquierdo crea muros.
  - Clic derecho elimina muros.
  - Los cambios se guardan localmente por mapa.
- Muros permanentes incorporados para los tres primeros mapas.
- Misión final tipo shooter con:
  - Tres niveles.
  - Tres oleadas por nivel.
  - Movimiento del doctor con WASD o flechas.
  - Apuntado y disparo con el mouse.
  - Barra de vida del boss.
  - Barra de protección de la población.
  - Puntaje, combo y mensajes de estado.
  - Música de tensión.
  - Personaje animado mediante sprites.
- Certificado de logro al vencer al boss final:
  - Usa el nombre ingresado al inicio.
  - Se muestra en pantalla.
  - Puede descargarse como archivo PNG.

## Regla educativa de la misión final

El antibiótico debe utilizarse únicamente contra bacterias:

- Gonorrea
- Sífilis
- Clamidia

Los siguientes objetivos son virus:

- VIH
- VPH
- Hepatitis B
- Herpes

En el juego:

- Disparar a una bacteria reduce la vida del boss.
- Disparar por error a un virus reduce la protección de la población.
- Si una bacteria llega al extremo izquierdo, la población pierde protección.
- Si un virus pasa de largo, no causa daño.
- Si la protección de la población llega a cero, la misión termina en derrota.
- Si la vida del boss llega a cero, la misión termina en victoria y se habilita el certificado.

## Controles

### Mapas explorables

- **WASD o flechas:** mover al personaje.
- **E:** interactuar con objetos y personajes.
- **I:** abrir el inventario.
- **Escape:** pausar.

### Misión final

- **WASD o flechas:** mover al doctor.
- **Mouse:** apuntar.
- **Clic izquierdo:** disparar el antibiótico.

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
