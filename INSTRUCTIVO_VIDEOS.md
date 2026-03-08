# Cómo subir videos de clase a YouTube

## 1. Subir el video

1. Ir a [YouTube Studio](https://studio.youtube.com)
2. Click en **Crear** (botón con ícono de cámara, arriba a la derecha)
3. Seleccionar **Subir video**
4. Arrastrar o seleccionar el archivo de video
5. Completar:
   - **Título**: `Clase X - [Nombre de la clase]` (ej: `Clase 2 - Instalación del Sistema Operativo`)
   - **Descripción**: opcional, puede dejarse vacío
   - **Miniatura**: opcional
6. En la sección **Visibilidad**, seleccionar **No listado**
   - Esto hace que el video solo sea accesible con el link directo
   - No aparece en búsquedas de YouTube ni en el canal
7. Click en **Publicar**

## 2. Copiar el link

Una vez publicado:

1. Ir al video en YouTube Studio
2. Click en **Compartir** o copiar la URL de la barra del navegador
3. El link tiene este formato: `https://www.youtube.com/watch?v=XXXXXXXXXXX`

## 3. Cargar en el panel admin

1. Ir al panel admin (`localhost:3001` en desarrollo)
2. Click en **Editar** en la clase correspondiente
3. Pegar el link de YouTube en el campo **Link del video**
4. Click en **Guardar cambios**

El video se va a mostrar embebido directamente en la página de la clase para los alumnos.

## Formatos de link aceptados

Cualquiera de estos formatos funciona:

- `https://www.youtube.com/watch?v=XXXXXXXXXXX`
- `https://youtu.be/XXXXXXXXXXX`
- `https://www.youtube.com/embed/XXXXXXXXXXX`

## Recomendaciones

- **Resolución**: subir en la mayor calidad posible (1080p o superior), YouTube se encarga de generar las versiones en menor calidad
- **Formato**: MP4 con codec H.264 es el más compatible
- **Visibilidad**: siempre usar **No listado** para que solo accedan desde la plataforma
- **Playlist**: opcionalmente se puede crear una playlist privada en YouTube para organizar todas las clases
