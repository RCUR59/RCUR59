# Vitanova - Gestión Integral de Vida (Life OS)

Una plataforma web integral para la administración personal: tareas con matriz de Eisenhower, finanzas personales y presupuestos, salud y bienestar diario, metas vitales con hitos y temporizador Pomodoro.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu computadora:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).
- Un gestor de paquetes como `npm` (incluido con Node), `pnpm` o `bun`.

---

## 💻 Instalación y Ejecución Local

### 1. Descargar el código
Si descargaste el archivo `.zip` desde Google AI Studio:
1. Descomprime el archivo `.zip` en la carpeta que prefieras en tu computadora.
2. Abre tu terminal o consola de comandos (Command Prompt / PowerShell en Windows, o Terminal en Mac/Linux).
3. Navega hasta la carpeta del proyecto:
   ```bash
   cd ruta/a/tu/carpeta
   ```

### 2. Instalar las dependencias
Ejecuta el siguiente comando en la terminal:
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo local
Una vez finalizada la instalación, ejecuta:
```bash
npm run dev
```

Verás una salida similar a:
```
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Abre tu navegador web e ingresa a: **`http://localhost:3000`**.

---

## 📦 Construir para Producción (Build)

Si deseas generar los archivos estáticos listos para desplegar en cualquier hosting (Netlify, Vercel, GitHub Pages, o un servidor propio):

```bash
npm run build
```

Esto creará la carpeta optimizada `dist/` con todo el HTML, CSS y JavaScript minificado.

---

## 💾 Persistencia de Datos y Respaldo

- Todos tus datos (tareas, gastos, hábitos, salud y objetivos) se guardan automáticamente en el almacenamiento local del navegador (`LocalStorage`).
- Puedes ir a **Ajustes** en cualquier momento para:
  - **Exportar JSON:** Descargar un archivo de copia de seguridad con todos tus datos.
  - **Importar JSON:** Restaurar tus datos en otra computadora o navegador.
  - **Restablecer datos:** Volver a la plantilla de ejemplo cuando quieras.

---

## 🛠️ Tecnologías Utilizadas

- **React 19** + **TypeScript**
- **Vite** (bundler rápido)
- **Tailwind CSS v4**
- **Lucide React** (iconos limpios)
- **Web Audio API** (efectos de sonido para Pomodoro y completitud sin librerías externas)
