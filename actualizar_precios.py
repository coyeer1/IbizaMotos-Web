"""
ACTUALIZADOR DE PRECIOS - IBIZA MOTOS
======================================
Lee la Hoja 2 del Excel de negocio y actualiza los precios
en el catálogo de la página web automáticamente.

Uso: Ejecutar "ACTUALIZAR PRECIOS.bat" (doble clic)
"""

import re
import sys
import os
import glob

# Fix encoding for Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace') if hasattr(sys.stderr, 'reconfigure') else None

# ── CONFIGURACIÓN ─────────────────────────────────────────────────────────────

# Ruta de la página web (relativa a este script)
MOTORCYCLES_FILE = os.path.join(os.path.dirname(__file__), 'app', 'src', 'data', 'motorcycles.ts')

# Carpeta donde buscar el Excel (Downloads del usuario actual)
DOWNLOADS = os.path.join(os.path.expanduser('~'), 'Downloads')
EXCEL_PATTERN = os.path.join(DOWNLOADS, 'HOJA DE NEGOCIO IBIZA*.xlsm')

# ── MAPEO EXCEL → NOMBRE EN LA WEB ────────────────────────────────────────────
# Clave  : nombre exacto en la columna A del Excel
# Valor  : nombre exacto del modelo en motorcycles.ts
MAPEO = {
    # AKT
    'AK125NKD CBS':                  '125 NKD CBS',
    'AK125NKD CBS FP 27 PT':         '125 NKD CBS FP',
    'AK125NKD CBS Clas V3 27 PT':    '125 NKD CBS Clásica V3',
    'AK125CHR CBS':                  '125 CHR CBS',
    '125 CR4':                       '125 CR4',
    '150 CR4':                       '150 CR4',
    '200 CR4':                       '200 CR4',
    'AKT 250 R':                     '250 R',
    'AK 110 NV CBS':                 '110 NV CBS',
    'FLEX CBS':                      'Flex CBS',
    'DYNAMIC PRO':                   'Dynamic Pro',
    'DINAMIC RX 150':                'Dinamic RX 150',
    '125 TTR CBS':                   '125 TTR CBS',
    '200 TT ABS':                    '200 TT ABS',
    'TT200 ABS RALLY':               'TT200 ABS Rally',
    # Suzuki
    'ADDRESS NM':                    'Address',
    'AX4 EIII':                      'AX4 EIII',
    'AX4 ABS':                       'AX4 ABS',
    'GN125 ABS':                     'GN125 ABS',
    'GSX-S150 ABS':                  'GSX-S150 ABS',
    'GSX-R150 ABS':                  'GSX-R150 ABS',
    'GIXXER FI ABS':                 'Gixxer FI 150 ABS',
    'GIXXER SF FI ABS':              'Gixxer SF FI 150 ABS',
    'GIXXER 250':                    'Gixxer 250',
    'GIXXER SF 250':                 'Gixxer SF 250',
    'AVENIS':                        'Avenis',
    'BURGMAN FI':                    'Burgman 200 FI',
    'BEST 125 FI':                   'BEST 125 FI',
    'GN125 EIII':                    'GN125 EIII',
    'V-STROM 250 SX':                'V-Strom 250 SX',
    'V-STROM 160':                   'V-Strom 160',
    'V-STROM 800DE':                 'V-Strom 800 DE',
    'V-STROM 1050DE':                'V-Strom 1050 DE',
    'SV650A':                        'SV650A',
    'GSX-8S':                        'GSX-8S',
    'GSX-8R':                        'GSX-8R',
    'DL650XT':                       'V-Strom 650 XT',
    'GSX-S1000':                     'GSX-S1000',
    'HAYABUSA':                      'Hayabusa',
    'GSX-R1000R':                    'GSX-R1000R',
    # Honda
    'WAVE 110S SIN CBS':             'Wave 110S',
    'CB100':                         'CB 100',
    'CB125DLX 2,0':                  'CB 125F DLX',
    'DIO DLX E3':                    'DIO LED DLX',
    'DIO STD E3':                    'DIO LED STD',
    'CB 190R 2,0':                   'CB 190R 2.0',
    'XR 150 2.0':                    'XR 150L 2.0',
    'XR190L 2.0':                    'XR 190L 2.0',
    'XBLADE':                        'X-Blade 160',
    'NX190':                         'NX 190',
    'XR 300L TORNADO':               'XR 300L Tornado',
    'NAVI 2.0':                      'Navi',
    'NAVI ADVENTURE':                'Navi Adventure',
    'NAVI MIX 2.0':                  'Navi Mix',
    'PCX 160 ABS':                   'PCX 160 ABS',
    'CB300':                         'CB 300F',
    # Bajaj
    'BOXER CT 100 KS':               'Boxer CT 100 KS',
    'BOXER CT 100 ES':               'Boxer CT 100 ES',
    'BOXER CT 125':                  'Boxer CT 125',
    'DISCOVER 125 ST-R':             'Discover 125 ST-R',
    'PULSAR NS 125 UG':              'Pulsar NS 125 UG',
    'BOXER 150X':                    'Boxer 150X',
    'PULSAR P 150 FI ABS':           'Pulsar P 150 FI ABS',
    'PULSAR N 125 FI':               'Pulsar N 125 FI',
    'PULSAR N160 PRO':               'Pulsar N160 Pro',
    'PULSAR N 160 FI DC':            'Pulsar N 160 FI DC',
    'PULSAR NS 160 FI ABS UG2':      'Pulsar NS 160 FI ABS UG2',
    'PULSAR NS  200 FI ABS UG2':     'Pulsar NS 200 FI ABS UG2',
    'PULSAR NS 200  FI SC':          'Pulsar NS 200 FI SC',
    'PULSAR RS 200  ABS':            'Pulsar RS 200 ABS',
    'PULSAR N 250 FI ABS':           'Pulsar N 250 FI ABS',
    'PULSAR NS 400Z':                'Pulsar NS 400Z',
    'DOMINAR 400 PRO TOURING':       'Dominar 400 Pro Touring',
    'DOMINAR 400 VOLCANO SIN CONTINENTAL': 'Dominar 400 Volcano',
    # Hero
    'ECO 100':                       'ECO 100',
    'ECO T 100':                     'ECO T 100',
    'ECO CW':                        'ECO CW',
    'ECO SP':                        'ECO SP',
    'SPLENDOR':                      'Splendor X Pro',
    'HUNK 125R':                     'Hunk 125R',
    'HUNK 150 XT':                   'Hunk 150 XT',
    'HUNK 160 V2':                   'Hunk 160 V2',
    'HUNK 160 4V':                   'Hunk 160 4V Pro',
    'XPULSE 200 AD':                 'XPulse 200 AD',
    'XPULSE 200 4V':                 'XPulse 200 4V',
    'XPULSE 200 PRO 4V':             'XPulse 200 Pro 4V',
    'XPULSE 200 R 4V':               'XPulse 200 R 4V',
    'XOOM 110':                      'XOOM 110',
    # Vento
    'Lithium 125':                   'Lithium 125',
    'Rapid 125':                     'Rapid 125',
    'Spirit 125':                    'Spirit 125 ZX',
    'Falkon 125':                    'Falkon 125',
    'Presley 200 ABS':               'Presley 200 ABS',
    'Screamer 250 FI':               'Screamer 250 FI',
    'GTS 300':                       'GTS 300',
    'Alpina 300 EFI':                'Alpina 300 EFI',
    'Crossmax 200':                  'CrossMax 200 Pro',
}

# ── LEER EXCEL ────────────────────────────────────────────────────────────────

def leer_excel(ruta_excel):
    """Lee la Hoja 2 del Excel y devuelve {nombre_excel: precio}"""
    try:
        import openpyxl
    except ImportError:
        print("ERROR: Falta la librería openpyxl.")
        print("Ejecuta en cmd: python -m pip install openpyxl")
        if sys.stdin.isatty():
        input("\nPresiona Enter para cerrar...")
        sys.exit(1)

    print(f"Leyendo Excel: {os.path.basename(ruta_excel)}")
    # data_only=True para leer valores calculados (no fórmulas)
    import warnings
    warnings.filterwarnings("ignore")
    wb = openpyxl.load_workbook(ruta_excel, data_only=True)
    ws = wb.worksheets[1]  # Hoja 2 (índice 1)

    precios = {}
    for row in ws.iter_rows(min_row=1, max_row=300, max_col=3):
        nombre_cell, precio_2025_cell, precio_2026_cell = row
        nombre = str(nombre_cell.value or '').strip()

        if not nombre:
            continue

        precio_2026 = precio_2026_cell.value
        precio_2025 = precio_2025_cell.value

        # Priorizar 2026, si no hay usar 2025
        precio = precio_2026 if precio_2026 else precio_2025
        if precio and isinstance(precio, (int, float)) and precio > 100000:
            precios[nombre] = int(precio)

    return precios

# ── ACTUALIZAR MOTORCYCLES.TS ─────────────────────────────────────────────────

def actualizar_precios(precios_excel):
    """Aplica los precios al archivo motorcycles.ts"""
    with open(MOTORCYCLES_FILE, 'r', encoding='utf-8') as f:
        contenido = f.read()

    actualizados = []
    sin_cambio = []
    no_encontrado = []

    for nombre_excel, nombre_web in MAPEO.items():
        precio_nuevo = precios_excel.get(nombre_excel)
        if precio_nuevo is None:
            continue

        escaped = re.escape(nombre_web)
        pattern = r'(model:\s*"' + escaped + r'",\s*\n\s*year:\s*\d+,\s*\n\s*price:\s*)(\d+)'

        match = re.search(pattern, contenido)
        if not match:
            no_encontrado.append(nombre_web)
            continue

        precio_actual = int(match.group(2))
        if precio_actual == precio_nuevo:
            sin_cambio.append(nombre_web)
            continue

        contenido = re.sub(pattern, r'\g<1>' + str(precio_nuevo), contenido)
        actualizados.append((nombre_web, precio_actual, precio_nuevo))

    with open(MOTORCYCLES_FILE, 'w', encoding='utf-8') as f:
        f.write(contenido)

    return actualizados, sin_cambio, no_encontrado

# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 55)
    print("   ACTUALIZADOR DE PRECIOS — IBIZA MOTOS")
    print("=" * 55)
    print()

    # Buscar Excel
    archivos = sorted(glob.glob(EXCEL_PATTERN), key=os.path.getmtime, reverse=True)
    if not archivos:
        print(f"❌ No se encontró el Excel en Descargas:")
        print(f"   {EXCEL_PATTERN}")
        print()
        print("Asegúrate de tener el archivo en tu carpeta de Descargas.")
        if sys.stdin.isatty():
        input("\nPresiona Enter para cerrar...")
        sys.exit(1)

    ruta_excel = archivos[0]
    if len(archivos) > 1:
        print(f"⚠️  Se encontraron {len(archivos)} archivos. Usando el más reciente:")
    print(f"   {os.path.basename(ruta_excel)}")
    print()

    # Verificar motorcycles.ts
    if not os.path.exists(MOTORCYCLES_FILE):
        print(f"❌ No se encontró el catálogo en:")
        print(f"   {MOTORCYCLES_FILE}")
        if sys.stdin.isatty():
        input("\nPresiona Enter para cerrar...")
        sys.exit(1)

    # Leer precios del Excel
    precios_excel = leer_excel(ruta_excel)
    print(f"✅ {len(precios_excel)} precios leídos del Excel")
    print()

    # Actualizar
    print("🔄 Actualizando catálogo...")
    actualizados, sin_cambio, no_encontrado = actualizar_precios(precios_excel)

    # Reporte
    print()
    print("─" * 55)
    if actualizados:
        print(f"✅ {len(actualizados)} precios ACTUALIZADOS:")
        for nombre, viejo, nuevo in sorted(actualizados):
            viejo_fmt = f"${viejo:,.0f}".replace(",", ".")
            nuevo_fmt = f"${nuevo:,.0f}".replace(",", ".")
            flecha = "↑" if nuevo > viejo else "↓"
            print(f"   {flecha} {nombre}: {viejo_fmt} → {nuevo_fmt}")
    else:
        print("✅ Todos los precios ya estaban al día. Sin cambios.")

    print()
    print(f"📋 Sin cambios: {len(sin_cambio)} modelos")

    if no_encontrado:
        print(f"⚠️  No encontrados en la web: {len(no_encontrado)} modelos")
        for m in no_encontrado:
            print(f"   - {m}")

    print()
    print("=" * 55)
    print("  ¡Listo! Recuerda hacer deploy de la página.")
    print("=" * 55)
    if sys.stdin.isatty():
        input("\nPresiona Enter para cerrar...")

if __name__ == '__main__':
    main()
