#!/usr/bin/env python3
import re

# Leggi il file HTML
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Sentiero 2 - Aggiungi immagine e durata
content = re.sub(
    r'(<!-- Sentiero 2 -->\s*<div class="trail-card" data-difficolta="T">)',
    r'<!-- Sentiero 2 -->\n                <div class="trail-card" data-difficolta="T" data-duration="60">\n                    <div class="trail-image" style="background-image: url(\'images/sentiero-maesta.jpg\'); height: 200px; background-size: cover; background-position: center; border-radius: var(--border-radius); margin-bottom: 1rem;"></div>',
    content,
    count=1
)

# Fix 2: Sentiero 3 - Aggiungi immagine e durata  
content = re.sub(
    r'(<!-- Sentiero 3 -->\s*<div class="trail-card" data-difficolta="T">)',
    r'<!-- Sentiero 3 -->\n                <div class="trail-card" data-difficolta="T" data-duration="90">\n                    <div class="trail-image" style="background-image: url(\'images/sentiero-metati.jpg\'); height: 200px; background-size: cover; background-position: center; border-radius: var(--border-radius); margin-bottom: 1rem;"></div>',
    content,
    count=1
)

# Fix 3: Sentiero 4 - Aggiungi immagine e durata
content = re.sub(
    r'(<!-- Sentiero 4 -->\s*<div class="trail-card" data-difficolta="E">)',
    r'<!-- Sentiero 4 -->\n                <div class="trail-card" data-difficolta="E" data-duration="150">\n                    <div class="trail-image" style="background-image: url(\'images/sentiero-eremo.jpg\'); height: 200px; background-size: cover; background-position: center; border-radius: var(--border-radius); margin-bottom: 1rem;"></div>',
    content,
    count=1
)

# Fix 4: Sentiero 6 - Aggiungi immagine e durata
content = re.sub(
    r'(<!-- Sentiero 6 -->\s*<div class="trail-card" data-difficolta="E">)',
    r'<!-- Sentiero 6 -->\n                <div class="trail-card" data-difficolta="E" data-duration="150">\n                    <div class="trail-image" style="background-image: url(\'images/sentiero-sassatecchia.jpg\'); height: 200px; background-size: cover; background-position: center; border-radius: var(--border-radius); margin-bottom: 1rem;"></div>',
    content,
    count=1
)

# Fix 5: Sentiero 7 - Aggiungi immagine e durata
content = re.sub(
    r'(<!-- Sentiero 7 -->\s*<div class="trail-card" data-difficolta="E">)',
    r'<!-- Sentiero 7 -->\n                <div class="trail-card" data-difficolta="E" data-duration="210">\n                    <div class="trail-image" style="background-image: url(\'images/sentiero-mulini.jpg\'); height: 200px; background-size: cover; background-position: center; border-radius: var(--border-radius); margin-bottom: 1rem;"></div>',
    content,
    count=1
)

# Fix 6: Sentiero 8 (Caprasecca) - Aggiungi immagine e durata
content = re.sub(
    r'(<!-- Collegamento Caprasecca -->\s*<div class="trail-card" data-difficolta="T">)',
    r'<!-- Collegamento Caprasecca -->\n                <div class="trail-card" data-difficolta="T" data-duration="60">\n                    <div class="trail-image" style="background-image: url(\'images/sentiero-caprasecca.jpg\'); height: 200px; background-size: cover; background-position: center; border-radius: var(--border-radius); margin-bottom: 1rem;"></div>',
    content,
    count=1
)

# Fix 7: Correggi nome file immagine sentiero 1 (era maesta invece di rogazioni) e durata
content = content.replace("url('images/sentiero-maesta.jpg')", "url('images/sentiero-rogazioni.jpg')", 1)
content = content.replace('data-duration="60">\n                    <div class="trail-image"\n                        style="background-image: url(\'images/sentiero-rogazioni.jpg\')', 
                          'data-duration="30">\n                    <div class="trail-image"\n                        style="background-image: url(\'images/sentiero-rogazioni.jpg\')', 1)

# Fix 8: Sentiero 5 era mulini invece di bargecchia
content = content.replace('sentiero-mulini.jpg', 'sentiero-bargecchia.jpg', 1)
content = re.sub(r'data-duration="210"', 'data-duration="120"', content, count=1)

# Fix 9: Fix bike image (remove img-placeholder class)
content = re.sub(
    r'<div class="bike-image img-placeholder img-container"[^>]*>',
    r'<div class="bike-image img-container" style="background-image: url(\'images/sillico-mtb.jpg\'); height: 350px;">',
    content
)

# Fix 10: Fix mura medievali image
content = re.sub(
    r'<div class="attraction-image[^"]*"[^>]*data-alt="Mura medievali[^>]*>',
    r'<div class="attraction-image" style="background-image: url(\'images/torre-medioevale-sillico.jpg\'); height: 220px; background-size: cover; background-position: center; border-radius: var(--border-radius);">',
    content
)

# Fix 11: Rimuovi img-placeholder da Chi Siamo
content = re.sub(
    r'<div class="about-image img-placeholder img-container"',
    r'<div class="about-image img-container"',
    content
)

# Fix 12: Fix eventi.md URLs (correggi nomi file)
with open('eventi.md', 'r', encoding='utf-8') as f:
    eventi_content = f.read()

eventi_content = eventi_content.replace('/images/evento-banditi.jpg', '/images/evento-banditi-del-sillico.jpg')
eventi_content = eventi_content.replace('/images/evento-sentieri.jpg', '/images/evento-sentieri-e-sapori.jpg')
eventi_content = eventi_content.replace('/images/evento-divini.jpg', '/images/evento-divini-e-sapori.jpg')
eventi_content = eventi_content.replace('/images/evento-trekking-lame.jpg', '/images/evento-trekking-alle-lame.jpg')
eventi_content = eventi_content.replace('/images/evento-concerto.jpg', '/images/evento-concerto-banda.jpg')
eventi_content = eventi_content.replace('/images/evento-pittura.jpg', '/images/evento-estemporanea-pittura.jpg')

with open('eventi.md', 'w', encoding='utf-8') as f:
    f.write(eventi_content)

# Scrivi il file aggiornato
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ HTML aggiornato con successo!")
print("✅ File eventi.md aggiornato con URL immagini corretti!")
