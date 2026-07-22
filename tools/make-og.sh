#!/usr/bin/env bash
# Génère les images de partage (og:image) 1200x630 des publications.
#
# Elles ne peuvent pas être les couvertures elles-mêmes : celles-ci sont au
# format portrait, alors que les aperçus de WhatsApp, Facebook et LinkedIn
# attendent du 1200x630. Une couverture portrait y est recadrée n'importe
# comment. Ce script compose donc une carte au format attendu à partir du
# gabarit tools/og-card.html.
#
# Prérequis : ImageMagick, et le Chrome fourni par Puppeteer (ou toute autre
# installation de Chrome — ajuster CHROME ci-dessous).
#
# Usage, depuis la racine du site :
#     bash tools/make-og.sh
#
# Ajouter une publication : compléter le tableau CARDS ci-dessous, relancer,
# puis pointer og:image et twitter:image de sa page vers le fichier produit.

set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-$HOME/.cache/puppeteer/chrome/win64-121.0.6167.85/chrome-win64/chrome.exe}"
PORT="${PORT:-8099}"

# identifiant | surtitre | titre | couverture
CARDS=(
  "apres-cfa|CAHIER STRATÉGIQUE N°001|Le Cameroun construit-il l'après-CFA ?|assets/apres-cfa-cover.webp"
  "corridor-atlantique|CAHIER STRATÉGIQUE N°002|Corridor Atlantique Camerounais (Limbé-Douala-Edéa-Kribi)|assets/corridor-atlantique-cover.webp"
  "secteur-minier|ARTICLE|Secteur minier : le Cameroun veut reprendre le contrôle de son sous-sol|assets/secteur-minier-cover.webp"
  "afd-diaspora|ARTICLE|Pourquoi l'AFD est-elle associée au projet de mobilisation de 2 000 milliards FCFA auprès de la diaspora ?|assets/afd-diaspora-cover.webp"
)

# Encodage des paramètres d'URL.
urlenc() { python -c "import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1],safe=''))" "$1"; }

python -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 2

TMP="$(mktemp -d)"
for card in "${CARDS[@]}"; do
  IFS='|' read -r id kicker title cover <<< "$card"
  url="http://localhost:$PORT/tools/og-card.html?kicker=$(urlenc "$kicker")&title=$(urlenc "$title")&cover=$(urlenc "$cover")"
  # Fenêtre volontairement plus grande que la carte : en mode headless, une
  # partie de la fenêtre est réservée et la capture serait tronquée. On
  # recadre ensuite exactement la carte, rendue en double densité.
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
            --force-device-scale-factor=2 --window-size=1420,820 \
            --virtual-time-budget=9000 --screenshot="$TMP/$id.png" "$url" 2>/dev/null
  magick "$TMP/$id.png" -gravity NorthWest -crop 2400x1260+0+0 +repage \
         -resize 1200x630 -strip -quality 88 "assets/og-$id.jpg"
  printf '  assets/og-%-22s %s octets\n' "$id.jpg" "$(stat -c%s "assets/og-$id.jpg")"
done
rm -rf "$TMP"
echo "Terminé."
