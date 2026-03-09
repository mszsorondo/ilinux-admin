# Deploy de ilinux en servidor Instituto Linux

## Requisitos previos

El servidor debe tener instalado:

### 1. Docker Engine

```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Docker Compose v1 (1.29.2)

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Agregar usuario al grupo docker

```bash
sudo usermod -aG docker ilcampus
```

Cerrar sesion y volver a conectarse para que tome efecto.

### 4. Verificar instalacion

```bash
docker --version
docker-compose --version
```

---

## Deploy paso a paso

### 1. Clonar repositorios

```bash
cd ~
git clone https://github.com/mszsorondo/ilinux.git
git clone https://github.com/mszsorondo/ilinux-admin.git
```

### 2. Crear archivo de variables de entorno

Crear el archivo `~/env.prod` con las siguientes variables:

```bash
# === PLATAFORMA (ilinux) ===
JWT_SECRET=CAMBIAR_POR_UN_STRING_ALEATORIO_DE_32_CARACTERES
MERCADOPAGO_ACCESS_TOKEN=PEGAR_ACCESS_TOKEN_DE_PRODUCCION
RESEND_API_KEY=PEGAR_API_KEY_DE_RESEND

# === PANEL ADMIN (ilinux-admin) ===
ADMIN_JWT_SECRET=CAMBIAR_POR_OTRO_STRING_ALEATORIO_DE_32_CARACTERES
```

> **MERCADOPAGO_ACCESS_TOKEN**: lo obtienen desde su cuenta de MercadoPago → Tus integraciones → Credenciales de producción → Access Token.
> **RESEND_API_KEY**: lo obtienen desde su cuenta de Resend (https://resend.com) → API Keys. Tambien deben configurar su dominio propio en Resend para que los emails salgan desde @institutolinux.com.

### 3. Ejecutar el schema en la base de datos

La base de datos ya existe en el servidor (campus_il_db). Ejecutar el schema para crear las tablas:

```bash
psql -h localhost -U campus_user -d campus_il_db -f ~/ilinux/src/db/schema.sql
```

Password: `awIt7[;SMGeIk7`

> Esto crea las tablas, el curso con 24 clases, y el usuario admin (admin@institutolinux.com).

### 4. Copiar el docker-compose de produccion

El archivo esta incluido en el repositorio ilinux-admin. Copiarlo al directorio home (donde estan ambos repos):

```bash
cp ~/ilinux-admin/docker-compose.prod.yml ~/docker-compose.prod.yml
```

### 5. Levantar los servicios

```bash
cd ~
docker-compose -f docker-compose.prod.yml --env-file env.prod up -d --build
```

Esto construye y levanta:
- **Plataforma** en puerto 3000 (campus.institutolinux.com)
- **Panel admin** en puerto 3001 (acceso interno solamente)

### 6. Verificar que funcione

```bash
# Ver que los containers estan corriendo
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f admin
```

Probar acceso local:
```bash
curl http://localhost:3000
curl http://localhost:3001
```

---

## Configurar Nginx como reverse proxy (HTTPS)

### 1. Instalar Nginx y Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Crear configuracion de Nginx

```bash
sudo nano /etc/nginx/sites-available/campus
```

Pegar este contenido:

```nginx
server {
    listen 80;
    server_name campus.institutolinux.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Activar el sitio

```bash
sudo ln -s /etc/nginx/sites-available/campus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Obtener certificado SSL (HTTPS)

```bash
sudo certbot --nginx -d campus.institutolinux.com
```

Seguir las instrucciones. Certbot configura HTTPS automaticamente y renueva el certificado.

### 5. Verificar

Abrir en el navegador: https://campus.institutolinux.com

---

## Variables de entorno - referencia

| Variable | Servicio | Descripcion |
|---|---|---|
| `DATABASE_URL` | ambos | Conexion a PostgreSQL (ya configurada en docker-compose.prod.yml) |
| `JWT_SECRET` | plataforma | Secreto para firmar tokens JWT de alumnos |
| `MERCADOPAGO_ACCESS_TOKEN` | plataforma | Token de acceso de produccion de MercadoPago (lo obtienen de su cuenta MP) |
| `NEXT_PUBLIC_BASE_URL` | plataforma | URL publica (ya configurada: https://campus.institutolinux.com) |
| `RESEND_API_KEY` | plataforma | API key de Resend (lo obtienen de su cuenta Resend, con dominio propio configurado) |
| `ADMIN_JWT_SECRET` | admin | Secreto para firmar tokens JWT del admin |

---

## Credenciales del panel admin

- **URL**: http://localhost:3001 (acceso solo desde el servidor o VPN)
- **Email**: admin@institutolinux.com
- **Password**: QcGA3duOlBA5JlZ

---

## Comandos utiles

```bash
# Ver estado
docker-compose -f docker-compose.prod.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar todo
docker-compose -f docker-compose.prod.yml restart

# Actualizar codigo (pull + rebuild)
cd ~/ilinux && git pull && cd ~/ilinux-admin && git pull
cd ~ && docker-compose -f docker-compose.prod.yml up -d --build

# Parar todo
docker-compose -f docker-compose.prod.yml down
```

---

## DNS

El dominio `campus.institutolinux.com` debe tener un registro A apuntando a la IP del servidor:

```
campus.institutolinux.com → 158.69.202.9
```

Esto lo configura quien administra el DNS del dominio institutolinux.com.
