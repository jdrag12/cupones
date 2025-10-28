# 🎀 Cupons d'Aniversari

Una aplicació web React minimalista i elegant per gestionar cupons d'aniversari. L'aplicació permet desbloquejar cupons mitjançant una data de naixement i canviar-los amb notificacions per correu electrònic.

## Característiques

- 🎨 Disseny minimalista amb tema pastel
- 🔐 Sistema de desbloqueig per data de naixement
- 📧 Notificacions per correu electrònic via Resend
- 📊 Persistència de dades amb Google Sheets
- 🎉 Animacions de confetti en CSS
- 📱 Disseny responsive
- 🌍 Interfície completament en català

## Tecnologies

- **Frontend**: React 18, Vite, CSS vanilla
- **Backend**: Vercel Serverless Functions
- **Base de dades**: Google Sheets API
- **Correu electrònic**: Resend API
- **Desplegament**: Vercel

## Configuració del Projecte

### 1. Clonar el repositori

```bash
git clone <repository-url>
cd CuponDescuento
```

### 2. Instal·lar dependències

```bash
npm install
```

### 3. Configurar Google Sheets

#### Crear un Service Account

1. Anar a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nou projecte o seleccionar un existent
3. Habilitar l'API de Google Sheets
4. Anar a "Credentials" → "Create Credentials" → "Service Account"
5. Donar un nom al service account (ex: "annivapp-sheets")
6. Descarregar el fitxer JSON de credencials

#### Configurar la Fulla de Càlcul

1. Crear una nova fulla de càlcul a Google Sheets
2. Anomenar la primera pestanya "coupons"
3. Afegir les següents columnes a la fila 1:
   - A: id
   - B: name
   - C: description
   - D: used
   - E: used_at
   - F: redeemed_by
4. Compartir la fulla amb l'email del service account (del fitxer JSON)
5. Donar permisos d'editor

### 4. Configurar Resend

1. Crear un compte a [Resend](https://resend.com/)
2. Generar una API key
3. Configurar el domini (opcional, es pot usar el domini per defecte)

### 5. Variables d'entorn

Crear un fitxer `.env.local` (per desenvolupament) o configurar les variables a Vercel:

```env
# Data d'aniversari en format DD/MM/YYYY
BIRTHDAY_DDMMYYYY=21/10/1993

# API key de Resend per enviar correus
RESEND_API_KEY=re_xxxxxxxxxx

# Credencials del Service Account de Google
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here with escaped newlines\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=your-google-sheets-id

# Token opcional per protegir l'endpoint de seed
SEED_TOKEN=your-secret-seed-token
```

**Important**: Quan configuris `GOOGLE_PRIVATE_KEY` a Vercel, assegura't d'escapar les salts de línia correctament:

- Reemplaça cada `\n` real per `\\n`
- Mantenir les cometes dobles al voltant de tot el valor

### 6. Sembrar dades inicials

Després de configurar Google Sheets, pots sembrar les dades inicials dels cupons:

```bash
# Opció 1: Via API (si has configurat SEED_TOKEN)
curl -X POST https://your-app.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -d '{"token": "your-secret-seed-token"}'

# Opció 2: Manualment a Google Sheets
# Afegir les dades dels cupons a la pestanya "coupons"
```

## Desplegament a Vercel

### 1. Preparar el projecte

```bash
npm run build
```

### 2. Desplegar a Vercel

1. Instal·lar Vercel CLI: `npm i -g vercel`
2. Desplegar: `vercel`
3. Configurar les variables d'entorn a la consola de Vercel
4. Re-desplegar: `vercel --prod`

### 3. Configuració de Vercel

El fitxer `vercel.json` ja està configurat per:

- Executar les funcions serverless amb Node.js 18.x
- Enrutar `/api/*` a les funcions serverless
- Servir l'SPA per a totes les altres rutes

## Estructura del Projecte

```
/
├── api/                    # Funcions serverless de Vercel
│   ├── coupons.js         # GET: llegir cupons de Google Sheets
│   ├── redeem.js          # POST: marcar cupó com a usat + enviar email
│   ├── seed.js            # POST: sembrar dades inicials
│   └── unlock.js          # GET: verificar data d'aniversari
├── src/                   # Codi font de React
│   ├── components/        # Components de React
│   │   ├── CouponCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   └── UnlockForm.jsx
│   ├── App.jsx           # Component principal
│   ├── main.jsx          # Punt d'entrada
│   └── styles.css        # Estils globals
├── index.html            # HTML principal
├── package.json          # Dependències
├── vercel.json          # Configuració de Vercel
└── vite.config.js       # Configuració de Vite
```

## API Endpoints

### `GET /api/unlock?d=DD/MM/YYYY`

Verifica si la data d'aniversari coincideix amb la configurada.

**Resposta**:

```json
{
  "success": true,
  "message": "Date matches"
}
```

### `GET /api/coupons`

Retorna tots els cupons de Google Sheets.

**Resposta**:

```json
[
  {
    "id": "massatge-relaxant",
    "name": "Massatge relaxant",
    "description": "Sessió de massatge de 45 minuts amb música suau.",
    "used": false,
    "used_at": null,
    "redeemed_by": null
  }
]
```

### `POST /api/redeem`

Marca un cupó com a usat i envia notificació per correu.

**Body**:

```json
{
  "id": "massatge-relaxant"
}
```

**Resposta**:

```json
{
  "id": "massatge-relaxant",
  "name": "Massatge relaxant",
  "description": "Sessió de massatge de 45 minuts amb música suau.",
  "used": true,
  "used_at": "2024-01-15T10:30:00.000Z",
  "redeemed_by": "AnnivApp"
}
```

### `POST /api/seed`

Sembra les dades inicials dels cupons (protegit per token).

**Body**:

```json
{
  "token": "your-secret-seed-token"
}
```

## Desenvolupament Local

```bash
# Instal·lar dependències
npm install

# Executar en mode desenvolupament
npm run dev

# Construir per producció
npm run build

# Previsualitzar construcció
npm run preview
```

## Personalització

### Canviar la data d'aniversari

Modifica la variable d'entorn `BIRTHDAY_DDMMYYYY` amb la nova data.

### Afegir nous cupons

1. Afegir manualment a Google Sheets, o
2. Modificar l'array `couponsData` a `api/seed.js` i executar l'endpoint

### Personalitzar l'email

Modifica la funció `sendEmail` a `api/redeem.js` per canviar el disseny o contingut.

### Canviar els colors

Modifica les variables CSS a `src/styles.css`:

```css
:root {
  --bg: #fef7f0; /* Color de fons */
  --accent: #f8b5c1; /* Color d'accent */
  --text: #2d3748; /* Color de text */
  /* ... */
}
```

## Solució de Problemes

### Error: "Server configuration error"

- Verifica que totes les variables d'entorn estan configurades correctament
- Assegura't que `GOOGLE_PRIVATE_KEY` té les salts de línia escapades

### Error: "Coupon not found"

- Verifica que l'ID del cupó existeix a Google Sheets
- Comprova que la fulla de càlcul té la pestanya "coupons"

### Error: "already_used"

- El cupó ja ha estat bescanviat anteriorment
- Aquest és un comportament esperat per evitar duplicats

### Problemes amb Google Sheets

- Verifica que el service account té permisos d'editor
- Comprova que l'API de Google Sheets està habilitada
- Assegura't que la fulla de càlcul existeix i té la pestanya "coupons"

## Llicència

Aquest projecte està sota la llicència MIT.
