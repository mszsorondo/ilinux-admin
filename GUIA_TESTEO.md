# Guia de testeo - Plataforma Instituto Linux

Esta guia es para que el equipo de Instituto Linux pruebe todos los flujos de la plataforma en el entorno de testeo (Railway).

## URLs del entorno de testeo

- **Plataforma (alumnos):** https://ilinux-production.up.railway.app
- **Panel admin:** https://ilinux-admin-production.up.railway.app

---

## Credenciales

### Panel admin

- **Email:** admin@institutolinux.com
- **Password:** QcGA3duOlBA5JlZ

### MercadoPago (pagos de prueba)

Para simular pagos se usa un usuario comprador de prueba. Al llegar al checkout de MercadoPago, usar estos datos:

- **Tarjeta Mastercard:** `5031 7557 3453 0604`
- **Tarjeta Visa:** `4509 9535 6623 3704`
- **CVV:** `123`
- **Vencimiento:** `11/30`
- **Nombre del titular:** `APRO` (esto hace que el pago se apruebe)
- **DNI:** `12345678`

> **Importante:** El nombre del titular DEBE ser `APRO` para que MercadoPago apruebe el pago de prueba. Si se pone otro nombre el pago sera rechazado.

---

## Flujo 1: Visitante recorre la plataforma

**Objetivo:** Verificar que las paginas publicas se ven correctamente.

1. Abrir https://ilinux-production.up.railway.app
2. Verificar que se ve la pagina de inicio con:
   - Logo de Instituto Linux
   - Descripcion del curso
   - Galeria de certificaciones LPI
   - Planes de precio
   - Boton "Ver curso"
3. Hacer click en "Ver curso"
4. Verificar que se ve la pagina del curso con:
   - Titulo "Diplomado Administrador de Redes Linux..."
   - Las 24 clases listadas
   - Boton de compra/inscripcion
5. Verificar que el header tiene links a Login y Registro

**Resultado esperado:** Todas las paginas publicas cargan correctamente, la informacion del curso se muestra completa.

---

## Flujo 2: Registro de alumno

**Objetivo:** Verificar el flujo completo de registro con verificacion de email.

1. Ir a la pagina de registro (click en "Registrarse" en el header)
2. Completar el formulario:
   - Nombre: (cualquier nombre de prueba)
   - Apellido: (cualquier apellido)
   - Email: (usar un email real al que tengan acceso, para recibir el mail de verificacion)
   - Password: (minimo 8 caracteres)
   - Confirmar password
3. Click en "Registrarse"
4. Verificar que redirige a la pagina de "Verificar email"
5. Ir a la bandeja de entrada del email usado
6. Abrir el email de "Instituto Linux - Verificar email"
7. Click en el link de verificacion
8. Verificar que se confirma la verificacion
9. Ir a la pagina de login e ingresar con las credenciales registradas
10. Verificar que redirige a "Mis cursos"

**Resultado esperado:** El alumno se registra, recibe email de verificacion, confirma, y puede loguearse.

> **Nota:** Si no llega el email, revisar carpeta de spam. El remitente es no-reply@intuitiv-ai.com (esto cambiara al dominio de Instituto Linux en produccion).

---

## Flujo 3: Login y recuperacion de contrasena

### 3a: Login normal

1. Ir a /login
2. Ingresar email y password de un usuario registrado
3. Click en "Iniciar sesion"
4. Verificar que redirige a "Mis cursos"

### 3b: Login con email no verificado

1. Registrar un usuario nuevo pero NO verificar el email
2. Intentar loguearse
3. Verificar que muestra mensaje indicando que debe verificar el email
4. Verificar que hay opcion de reenviar el email de verificacion

### 3c: Recuperacion de contrasena

1. Ir a /login
2. Click en "Olvidaste tu contrasena?"
3. Ingresar el email del usuario
4. Verificar que muestra mensaje de "Se envio un email de recuperacion"
5. Ir a la bandeja de entrada
6. Abrir el email de recuperacion
7. Click en el link
8. Ingresar nueva contrasena
9. Verificar que redirige a login con mensaje de exito
10. Loguearse con la nueva contrasena

**Resultado esperado:** El flujo de recuperacion funciona de punta a punta.

---

## Flujo 4: Compra del curso

**Objetivo:** Verificar el flujo de pago con MercadoPago (modo test).

### 4a: Compra exitosa

1. Loguearse con un usuario que NO haya comprado el curso
2. En "Mis cursos" verificar que aparece el mensaje de que no tiene cursos
3. Ir a la pagina del curso (/curso)
4. Click en el boton de compra/inscripcion
5. Se redirige a MercadoPago Checkout
6. En MercadoPago, usar los datos de prueba:
   - Tarjeta: `5031 7557 3453 0604`
   - CVV: `123`
   - Vencimiento: `11/30`
   - Titular: `APRO`
   - DNI: `12345678`
7. Confirmar pago
8. Verificar que redirige a la pagina de confirmacion de compra
9. La pagina deberia mostrar "Pago aprobado"
10. Click en "Ir al curso" o "Mis cursos"
11. Verificar que el curso aparece en "Mis cursos" con barra de progreso

### 4b: Intento de compra duplicada

1. Con el mismo usuario que ya compro, ir a /curso
2. Verificar que el boton ahora dice "Ir al curso" (no "Comprar")
3. No debe permitir comprar dos veces

**Resultado esperado:** El pago se procesa correctamente, el alumno obtiene acceso al curso, y no puede comprar dos veces.

---

## Flujo 5: Alumno navega el curso

**Objetivo:** Verificar que el alumno ve las clases correctamente.

1. Loguearse con un usuario que haya comprado el curso
2. Ir a "Mis cursos"
3. Click en el curso
4. Verificar que se ve la lista de 24 clases
5. La clase actual debe estar destacada
6. Las clases publicadas (con video y material) deben ser accesibles
7. Las clases futuras (despues de la clase actual) deben mostrar "Proximamente"
8. Click en una clase publicada
9. Verificar que se ve:
   - Video embebido (si es YouTube) o link al video
   - Contenido en Markdown renderizado
   - Link de reunion virtual (si existe)
10. Navegar entre clases con los botones Anterior/Siguiente

**Resultado esperado:** El alumno puede ver las clases publicadas hasta la clase actual, el contenido se renderiza correctamente.

---

## Flujo 6: Admin - Gestion de clases

**Objetivo:** Verificar que el admin puede gestionar el contenido del curso.

### 6a: Login admin

1. Ir a https://ilinux-admin-production.up.railway.app
2. Ingresar las credenciales admin:
   - Email: admin@institutolinux.com
   - Password: QcGA3duOlBA5JlZ
3. Verificar que se ve el dashboard con las 24 clases
4. Verificar que se muestra la clase actual y el estado de cada clase

### 6b: Subir contenido a una clase

1. En el dashboard, click en "Editar" en la clase actual (o la que quieran editar)
2. Completar los campos:
   - **Video URL:** pegar un link de YouTube (ej: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
   - **Markdown:** escribir contenido de la clase (se puede usar formato Markdown: titulos con #, listas con -, **negrita**, etc.)
   - **Meeting URL:** pegar un link de Zoom/Google Meet (opcional)
3. Click en "Guardar cambios"
4. Verificar que los cambios se guardan exitosamente
5. Volver al dashboard y verificar que la clase ahora muestra estado "Publicada"

### 6c: Avance automatico de clase actual

1. Si la clase que se edito es la clase actual Y se le cargo video + markdown:
   - Verificar que la clase actual avanzo automaticamente al siguiente numero
2. Verificar en el dashboard que el indicador de clase actual se actualizo

### 6d: Marcar clase como completada manualmente

1. Ir a editar la clase actual
2. Click en "Marcar como completada"
3. Verificar que la clase actual avanza al siguiente numero
4. Este boton es util cuando la clase se dicto en vivo y no necesita tener video/markdown cargado

### 6e: Verificar como alumno

1. Abrir la plataforma (https://ilinux-production.up.railway.app) en otra pestana o navegador
2. Loguearse como alumno
3. Ir al curso y verificar que las clases editadas ahora muestran el contenido actualizado
4. Verificar que la clase actual coincide con lo que se configuro en el admin

**Resultado esperado:** El admin puede cargar contenido, la clase actual avanza correctamente, y los cambios se reflejan inmediatamente en la plataforma del alumno.

---

## Flujo 7: Perfil, facturas y certificado

### 7a: Perfil del alumno

1. Loguearse como alumno con curso comprado
2. Click en "Perfil"
3. Verificar que se muestran los datos del alumno (nombre, email, fecha de registro)
4. Verificar que se muestra la clase actual del curso

### 7b: Facturas

1. En el perfil, ir a "Facturas"
2. Verificar que aparece la factura de la compra
3. El estado puede ser "Disponible" o "Pendiente"

### 7c: Certificado

1. En el perfil, ir a "Certificado"
2. Si el curso NO esta finalizado: debe mostrar el progreso ("Clase X de 24")
3. Si el curso esta finalizado (clase actual llego a 24): debe mostrar el certificado disponible para descarga

**Resultado esperado:** El alumno puede ver su perfil, facturas y estado del certificado.

---

## Flujo 8: Accesos no autorizados (seguridad)

**Objetivo:** Verificar que los accesos estan protegidos.

1. **Sin login, acceder a /mis-cursos:** debe redirigir a login
2. **Sin login, acceder a /curso/clases:** debe redirigir a login
3. **Sin login, acceder a /perfil:** debe redirigir a login
4. **Con login pero sin compra, acceder a /curso/clases:** debe mostrar mensaje de acceso restringido
5. **En el admin, sin login, acceder al dashboard:** debe redirigir a login del admin

**Resultado esperado:** Todas las rutas protegidas redirigen correctamente.

---

## Checklist rapido

| # | Test | Estado |
|---|------|--------|
| 1 | Paginas publicas cargan correctamente | ☐ |
| 2 | Registro + verificacion de email | ☐ |
| 3 | Login funciona | ☐ |
| 4 | Login rechaza email no verificado | ☐ |
| 5 | Recuperacion de contrasena funciona | ☐ |
| 6 | Compra con MercadoPago test se aprueba | ☐ |
| 7 | No permite compra duplicada | ☐ |
| 8 | Alumno ve clases publicadas | ☐ |
| 9 | Alumno NO ve clases futuras | ☐ |
| 10 | Video embebido se reproduce | ☐ |
| 11 | Markdown se renderiza bien | ☐ |
| 12 | Admin puede loguearse | ☐ |
| 13 | Admin puede subir video + markdown | ☐ |
| 14 | Clase actual avanza automaticamente | ☐ |
| 15 | Marcar como completada funciona | ☐ |
| 16 | Cambios del admin se ven en plataforma alumno | ☐ |
| 17 | Facturas se muestran | ☐ |
| 18 | Certificado muestra estado correcto | ☐ |
| 19 | Rutas protegidas redirigen a login | ☐ |
| 20 | Logout funciona (plataforma y admin) | ☐ |

---

## Problemas conocidos

- Los emails se envian desde `no-reply@intuitiv-ai.com`. En produccion se cambiara al dominio de Instituto Linux.
- El precio del curso esta en modo test (ARS 100). En produccion se actualizara a ARS 89.000.
- Las credenciales de MercadoPago son de prueba. En produccion se usaran las credenciales reales de Instituto Linux.
