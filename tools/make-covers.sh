#!/usr/bin/env bash
# Génère les couvertures typographiques (format portrait 1060x1590) des
# publications qui n'ont pas de visuel dédié.
#
# Les couvertures « photographiques » des premières publications ont été
# produites hors chaîne. Pour les suivantes, tools/cover-card.html compose
# une couverture dans la charte du site, dont le bas reprend un schéma de
# chiffres tiré du document lui-même.
#
# Prérequis : ImageMagick, et le Chrome fourni par Puppeteer (ou toute autre
# installation de Chrome — ajuster CHROME ci-dessous).
#
# Usage, depuis la racine du site :
#     bash tools/make-covers.sh
#
# Ajouter une publication : définir son schéma dans FIGURES (cover-card.html),
# compléter le tableau COVERS ci-dessous, puis relancer. La page de lecture
# pointe ensuite vers assets/<id>-cover.webp.

set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-$HOME/.cache/puppeteer/chrome/win64-121.0.6167.85/chrome-win64/chrome.exe}"
PORT="${PORT:-8098}"

# identifiant | surtitre | titre | points-clés (séparés par « ; ») | schéma
COVERS=(
  "conjoncture-2025|ARTICLE · CONJONCTURE|Conjoncture 2025 : et si le Cameroun comptait son économie selon le SCN 2025 ?|Le PIB n’augmente pas : c’est sa mesure qui change;La valeur du capital naturel n’est jamais additionnée au PIB;Un ratio de dette qui baisse n’est pas un désendettement|conjoncture"
)

# Encodage des paramètres d'URL.
urlenc() { python -c "import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1],safe=''))" "$1"; }

python -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 2

TMP="$(mktemp -d)"
for cover in "${COVERS[@]}"; do
  IFS='|' read -r id kicker title points figure <<< "$cover"
  url="http://localhost:$PORT/tools/cover-card.html?kicker=$(urlenc "$kicker")&title=$(urlenc "$title")&points=$(urlenc "$points")&figure=$(urlenc "$figure")"
  # Même précaution que pour les cartes de partage : la fenêtre est plus
  # grande que la couverture, en mode headless une partie est réservée et la
  # capture serait tronquée. On recadre ensuite exactement la couverture,
  # rendue en double densité.
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
            --force-device-scale-factor=2 --window-size=1240,1760 \
            --virtual-time-budget=9000 --screenshot="$TMP/$id.png" "$url" 2>/dev/null
  magick "$TMP/$id.png" -gravity NorthWest -crop 2120x3180+0+0 +repage \
         -resize 1060x -strip -quality 85 "assets/$id-cover.jpg"
  magick "assets/$id-cover.jpg" -strip -quality 82 -define webp:method=6 "assets/$id-cover.webp"
  printf '  assets/%-26s %s octets\n' "$id-cover.jpg" "$(stat -c%s "assets/$id-cover.jpg")"
  printf '  assets/%-26s %s octets\n' "$id-cover.webp" "$(stat -c%s "assets/$id-cover.webp")"
done
rm -rf "$TMP"
echo "Terminé."
