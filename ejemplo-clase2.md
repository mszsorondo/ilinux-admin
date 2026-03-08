=== DATOS PARA CARGAR EN EL ADMIN ===

Video URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Meeting URL: https://meet.google.com/abc-defg-hij

Markdown:
---

# Clase 2: Instalación del Sistema Operativo

## Objetivos

- Comprender los diferentes métodos de instalación de Linux
- Realizar una instalación completa de Debian 12 en VirtualBox
- Configurar particiones, usuarios y red durante la instalación

## Métodos de instalación

| Método | Descripción | Caso de uso |
|---|---|---|
| Instalación gráfica | Asistente visual paso a paso | Escritorios, principiantes |
| Instalación por texto | Menús en modo texto | Servidores sin entorno gráfico |
| Netinstall | ISO mínima, descarga paquetes de red | Instalaciones personalizadas |
| PXE / Red | Boot por red sin medio físico | Despliegue masivo en datacenters |
| Preseed / Kickstart | Instalación automatizada con archivo de respuestas | Infraestructura como código |

## Preparación de VirtualBox

### Crear la máquina virtual

1. Abrir VirtualBox y hacer click en **Nueva**
2. Nombre: `debian12-lab`
3. Tipo: **Linux**, Versión: **Debian (64-bit)**
4. Asignar **2048 MB** de RAM (mínimo 1024 MB)
5. Crear disco virtual **VDI dinámico** de **20 GB**

### Configuración de red

Para las prácticas de networking del curso, configurar **dos adaptadores**:

- **Adaptador 1**: NAT (acceso a internet)
- **Adaptador 2**: Red interna (comunicación entre VMs)

## Proceso de instalación de Debian 12

### Paso 1 — Boot desde la ISO

Montar la ISO de Debian 12 en el lector virtual y arrancar la VM. Seleccionar **Graphical Install**.

### Paso 2 — Idioma y ubicación

- Idioma: **Español**
- Ubicación: **Argentina** (o tu país)
- Teclado: **Latinoamericano**

### Paso 3 — Configuración de red

- Hostname: `debian12`
- Dominio: dejar vacío

### Paso 4 — Usuarios

- Contraseña de **root**: elegir una segura y anotarla
- Crear usuario normal con tu nombre

### Paso 5 — Particionado

Para el curso usaremos **particionado manual** con este esquema:

| Partición | Punto de montaje | Tamaño | Tipo |
|---|---|---|---|
| `/dev/sda1` | `/boot` | 512 MB | ext4 |
| `/dev/sda2` | swap | 1 GB | swap |
| `/dev/sda3` | `/` | resto | ext4 |

> **Nota:** En las clases de LVM y RAID veremos esquemas más avanzados.

### Paso 6 — Selección de paquetes

Desmarcar todo excepto:

- **SSH server**
- **Utilidades estándar del sistema**

No instalar entorno de escritorio — trabajaremos por consola.

### Paso 7 — GRUB

Instalar GRUB en `/dev/sda`. Confirmar y reiniciar.

## Post-instalación

Una vez reiniciado, loguearse como root y verificar:

```bash
# Verificar versión del sistema
cat /etc/debian_version

# Verificar interfaces de red
ip addr show

# Verificar espacio en disco
df -h

# Verificar memoria
free -m
```

## Comandos útiles vistos en clase

```bash
# Apagar la máquina
shutdown -h now

# Reiniciar
reboot

# Ver información del kernel
uname -a
```

## Recursos

- [Guía oficial de instalación de Debian](https://www.debian.org/releases/stable/installmanual)
- [Descargar Debian 12 (Bookworm)](https://www.debian.org/download)
- [Manual de VirtualBox](https://www.virtualbox.org/manual/)
- [Esquemas de particionado recomendados](https://wiki.debian.org/PartitioningSchemes)

## Tarea

1. Instalar Debian 12 en VirtualBox siguiendo los pasos de la clase
2. Verificar que los comandos post-instalación funcionan correctamente
3. Tomar una **snapshot** de la VM limpia (la usaremos como base en clases futuras)
