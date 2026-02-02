# Sillico da Scoprire 🏔️

Sito web ufficiale del borgo medievale di Sillico in Garfagnana, Toscana.

## Descrizione

**Sillico da Scoprire** è un progetto dedicato alla valorizzazione del territorio di Sillico, un suggestivo borgo medievale situato in Garfagnana. Il sito presenta:

- 🥾 **Sentieri del Moro**: 7 percorsi escursionistici tra natura e storia
- 🚴 **Bike Rent**: noleggio mountain bike per esplorare i sentieri
- 🎭 **Eventi**: calendario degli eventi locali
- 🏰 **Patrimonio culturale**: chiese, palazzi storici e torri medievali
- 🏡 **Ospitalità**: strutture ricettive del territorio
- 📍 **Informazioni**: contatti delle associazioni locali

## Struttura del Progetto

```
sillico-da-scoprire/
├── index.html              # Pagina principale
├── css/
│   └── style.css          # Stili del sito
├── js/
│   ├── main.js            # Logica principale
│   ├── marked.min.js      # Parser Markdown
│   └── fontawesome.min.js # Icone Font Awesome
├── images/                # Immagini del sito
├── gpx/                   # File GPX dei sentieri
├── eventi.md              # Database eventi in Markdown
└── LISTA_IMMAGINI.md      # Elenco asset necessari
```

## Tecnologie Utilizzate

- **HTML5**: Struttura semantica e SEO-friendly
- **CSS3**: Design responsive con animazioni moderne
- **JavaScript Vanilla**: Nessuna dipendenza da framework esterni
- **Marked.js**: Parsing dinamico degli eventi da Markdown
- **Font Awesome**: Icone vettoriali

## Funzionalità

### 📱 Responsive Design
Il sito è completamente responsive e ottimizzato per tutti i dispositivi.

### 🎨 Design Moderno
- Palette di colori "warm" ispirata ai toni della Garfagnana
- Animazioni fluide e transizioni
- Effetti hover interattivi
- Tipografia curata con Google Fonts (Playfair Display + Lato)

### ⚡ Performance
- Lazy loading delle immagini
- Tag canonical per SEO
- Gestione ottimizzata delle risorse

### 🔍 Funzionalità Dinamiche
- **Filtri sentieri**: filtra i percorsi per difficoltà (facile, medio, difficile)
- **Parsing eventi**: caricamento dinamico degli eventi da file Markdown
- **Lightbox**: visualizzazione ingrandita delle immagini degli eventi
- **Menu mobile**: navigazione ottimizzata per smartphone

## Avviare il Progetto Localmente

### 1. Clona il repository
```bash
git clone https://github.com/your-username/sillico-da-scoprire.git
cd sillico-da-scoprire
```

### 2. Avvia un server locale
```bash
# Usando Python 3
python3 -m http.server 8080

# Oppure con Node.js
npx http-server -p 8080
```

### 3. Apri il browser
Visita `http://localhost:8080`

## File GPX

I file GPX dei sentieri sono disponibili nella cartella `/gpx/` e possono essere scaricati gratuitamente per l'uso con app di navigazione outdoor (Komoot, Wikiloc, Garmin, ecc.).

## Eventi

Gli eventi sono gestiti tramite il file `eventi.md` in formato Markdown tabellare. Per aggiungere un nuovo evento, modifica il file seguendo la struttura esistente:

```markdown
| Titolo Evento | YYYY-MM-DD | nome-immagine.jpg | Descrizione breve |
```

## Contribuire

Questo progetto è gestito dalle associazioni locali **Polis Sillico** e **Terre del Moro**. Per segnalazioni, contatti o contributi:

- 📧 Email: polissillico@gmail.com
- 📱 WhatsApp: +39 331 476 6056
- 📘 Facebook: [Sillico da Scoprire](https://www.facebook.com/sillicodascoprire)
- 📷 Instagram: [@sillicodascoprire](https://www.instagram.com/sillicodascoprire)

## Licenza

© 2026 Sillico da Scoprire - Tutti i diritti riservati.

---

**Realizzato con ❤️ per la valorizzazione del territorio della Garfagnana**
