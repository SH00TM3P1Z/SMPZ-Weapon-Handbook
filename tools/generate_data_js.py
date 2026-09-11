# SMPZ Modpack -> data.js Automated Data Generator

import os
import glob
import re
import csv
import json
import math
import argparse
import urllib.request
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

DEFAULT_DATA_JS_PATH = os.path.join(PROJECT_ROOT, 'data.js')
DEFAULT_METADATA_JS_PATH = os.path.join(PROJECT_ROOT, 'metadata.js')
DEFAULT_ASSETS_DIR = os.path.join(PROJECT_ROOT, 'assets')
DEFAULT_MODELS_DIR = os.path.join(DEFAULT_ASSETS_DIR, 'models')
CACHE_DIR = os.path.join(SCRIPT_DIR, '.cache')
CONFIG_FILE = os.path.join(SCRIPT_DIR, '.config.json')

CATEGORY_MAP = {
    '돌격 소총': 'assault_rifle',
    '저격 소총': 'sniper_rifle',
    '기관단총': 'submachine_gun',
    '산탄총': 'shotgun',
    '권총': 'pistol',
    '경기관총': 'light_machine_gun',
    '유탄 발사기': 'grenade_launcher',
    '가스 블록': 'gas_block',
    '개머리판': 'buttstock',
    '광학 조준경': 'optic_scope',
    '권총 손잡이': 'pistol_grip',
    '기계식 조준기': 'iron_sight',
    '도트/홀로그램': 'reflex_sight',
    '레이저 표적기': 'laser_pointer',
    '리시버': 'receiver',
    '마운트': 'mount',
    '방아쇠': 'trigger',
    '버퍼 튜브': 'buffer_tube',
    '소염기 / 머즐': 'muzzle_device',
    '소음기': 'suppressor',
    '양각대': 'bipod',
    '장전 손잡이': 'charging_handle',
    '전방 손잡이': 'foregrip',
    '전술 플래시': 'tactical_flashlight',
    '총열': 'barrel',
    '탄창': 'magazine',
    '해머': 'hammer',
    '핸드가드': 'handguard',
    '헬멧': 'helmet',
    '헬멧 부착물': 'helmet_attachment',
    '전신 방탄복': 'full_body_armor',
    '플레이트 캐리어': 'plate_carrier',
    '체스트 리그': 'chest_rig',
    '마스크': 'mask',
    '백팩': 'backpack'
}

ATTACHMENT_PREFIXES = (
    'SMPZ_Mag_', 'SMPZ_Bipod', 'SMPZ_Optic', 'SMPZ_Scope', 'SMPZ_Sight',
    'SMPZ_Suppressor', 'SMPZ_Muzzle', 'SMPZ_Handguard', 'SMPZ_Stock',
    'SMPZ_Grip', 'SMPZ_Trigger', 'SMPZ_Buffer', 'SMPZ_Charging',
    'SMPZ_GasBlock', 'SMPZ_Foregrip', 'SMPZ_Flashlight', 'SMPZ_Laser',
    'SMPZ_Lasers_', 'SMPZ_Mount', 'SMPZ_Hammer', 'SMPZ_Barrel',
    'SMPZ_Receiver', 'SMPZ_Buttstock', 'SMPZ_Attachments_', 'SMPZ_Att_', 'SMPZ_Misc_'
)

_WEAPON_VARIANT_RE = re.compile(
    r'(_\d+mm(?:_RAL8000|_Black|_FDE)?|_FDE|_Black|_RAL8000|_Red|_Mountain_Flora|_SURPAT|_Alpine|_UCP|_Multicam|_NoFS(?:_RAL8000)?|_Short|_Long|_Sawedoff|_A2)$',
    re.IGNORECASE
)

COLOR_SUFFIXES = [
    ('_Mountain_Flora', 'Mountain Flora'),
    ('_Digital_Flora', 'Digital Flora'),
    ('_Multicam_Alpine', 'MultiCam Alpine'),
    ('_Multicam_Black', 'MultiCam Black'),
    ('_Multicam_Tropic', 'MultiCam Tropic'),
    ('_Multicam_HoundWolfSquad', 'Hound Wolf Squad'),
    ('_Black_HoundWolfSquad', 'Hound Wolf Squad (Black)'),
    ('_Alpine_HoundWolfSquad', 'Hound Wolf Squad (Alpine)'),
    ('_HoundWolfSquad', 'Hound Wolf Squad'),
    ('_MARPAT_Woodland', 'MARPAT Woodland'),
    ('_MARPAT_Desert', 'MARPAT Desert'),
    ('_Killa_White', 'Killa White'),
    ('_EMR_Syria', 'EMR Syria'),
    ('_EMR_Spring', 'EMR Spring'),
    ('_EMR_Artic', 'EMR Arctic'),
    ('_EMR_Arctic', 'EMR Arctic'),
    ('_WinterCamo', 'Winter Camo'),
    ('_Flecktarn', 'Flecktarn'),
    ('_SURPAT', 'SURPAT'),
    ('_RAL8000', 'RAL 8000'),
    ('_Multicam', 'MultiCam'),
    ('_Alpine', 'MultiCam Alpine'),
    ('_Black', 'Black'),
    ('_FDE', 'FDE'),
    ('_Red', 'Red'),
    ('_UCP', 'UCP'),
    ('_Gold', 'Gold'),
    ('_Tan', 'Tan'),
    ('_OliveDrab', 'Olive Drab'),
    ('_Olive_Drab', 'Olive Drab'),
    ('_OD', 'Olive Drab'),
    ('_Olive', 'Olive Drab'),
    ('_MAS_Gray', 'MAS Gray'),
    ('_Grey', 'Grey'),
    ('_Gray', 'Gray'),
    ('_AOR2', 'AOR 2'),
    ('_EMR', 'EMR'),
    ('_ISB_V2', 'ISB V2'),
    ('_ISB', 'ISB'),
    ('_M81', 'M81'),
    ('_Coyote', 'Coyote'),
    ('_Killa', 'Killa'),
    ('_Green', 'Green'),
    ('_White', 'White'),
    ('_DryEarth', 'Dry Earth'),
    ('_Dry_Earth', 'Dry Earth'),
    ('_Lizard', 'Lizard'),
    ('_Multitarn', 'MultiTarn'),
    ('_CetreEurope', 'Centre Europe'),
    ('_Badlands', 'Badlands'),
    ('_MilSpec', 'Mil Spec+'),
    ('_Mil_Spec', 'Mil Spec+'),
    ('_Moss', 'Moss'),
    ('_ATACS_AU', 'A-TACS AU'),
    ('_ATACS', 'A-TACS'),
    ('_RUSS', 'Russian Flora'),
    ('_Taupe', 'Taupe'),
    ('_CB', 'Coyote Brown'),
    ('_PB', 'Patriot Brown'),
    ('_DDC', 'DDC'),
    ('_Silver', 'Silver'),
    ('_Yellow', 'Yellow'),
    ('_Plum', 'Plum'),
    ('_SG', 'Stealth Grey'),
    ('_MountFDE', 'FDE Mount'),
    ('_FG', 'Forest Green'),
    ('_GG', 'Ghillie Green'),
    ('_RangerGreen', 'Ranger Green'),
    ('_Ranger_Green', 'Ranger Green'),
    ('_Smog', 'Smog'),
    ('_SKWoodland', 'SK Woodland'),
    ('_SK_Woodland', 'SK Woodland'),
    ('_Foliage', 'Foliage'),
    ('_ESTDCU', 'ESTDCU'),
    ('_GreenZone', 'GreenZone'),
    ('_M05', 'M05'),
    ('_Vz95', 'Vz95'),
    ('_Violet', 'Violet'),
    ('_Skull', 'Skull'),
    ('_Shark', 'Shark'),
    ('_Venom', 'Venom'),
    ('_Venom_Tooth', 'Venom Tooth'),
    ('_Venon_White', 'Venom White'),
    ('_Gorilla', 'Gorilla'),
    ('_UBEY', 'UBEY'),
    ('_VSR98_Mountain_Flora', 'VSR-98 Mountain Flora'),
    ('_Speaki_2', 'Trickcal Speaki v2'),
    ('_Speaki_3', 'Trickcal Speaki v3'),
    ('_Speaki', 'Trickcal Speaki'),
]

COLOR_KEYWORDS = [
    r'Mountain\s*Flora', r'Digital\s*Flora', r'MultiCam(?:\s*Alpine|\s*Black|\s*Tropic|\s*HoundWolfSquad)?',
    r'Alpine(?:\s*HoundWolfSquad)?', r'Black(?:\s*HoundWolfSquad)?', r'Hound\s*Wolf\s*Squad',
    r'MARPAT\s*(?:Woodland|Desert)', r'Killa(?:\s*White)?', r'EMR(?:\s*Syria|\s*Spring|\s*Artic|\s*Arctic)?',
    r'Winter\s*Camo', r'Flecktarn', r'SURPAT', r'RAL\s*8000', r'Black', r'FDE', r'Red', r'UCP',
    r'Gold', r'Tan', r'Olive\s*Drab', r'OD', r'MAS\s*Gray', r'Grey', r'Gray', r'AOR\s*2', r'AOR2',
    r'ISB(?:\s*V2)?', r'Intelligence\s*Support\s*Bureau(?:\s*V2)?',
    r'M81(?:\s*-\s*Woodland)?', r'Coyote\s*Brown', r'Coyote\s*Tan', r'Coyote', r'Forest\s*Green', r'Ghillie\s*Green', r'Green', r'White', r'Dry\s*Earth', r'DryEarth', r'Lizard',
    r'MultiTarn', r'Centre\s*Europe', r'CetreEurope', r'Badlands', r'Mil\s*Spec\+?', r'MilSpec\+?',
    r'Moss', r'ATACS(?:\s*AU)?', r'RUSS',
    r'Taupe', r'Patriot\s*Brown', r'DDC', r'Silver', r'Yellow',
    r'Plum', r'Stealth\s*Grey', r'Mount\s*FDE',
    r'Ranger\s*Green', r'Smog', r'SK\s*Woodland', r'Foliage', r'ESTDCU', r'GreenZone', r'M05',
    r'VSR-?98\s*Mountain(?:\s*-\s*|\s*)Flora', r'Vz95', r'Violet',
    r'Skull', r'Shark', r'Venom(?:\s*Tooth|\s*White\s*Ver\.?)?', r'Gorilla', r'UBEY',
    r'Trickcal\s*-\s*Speaki(?:\s*ver\.\d+)?'
]
_COLOR_PATTERNS_COMBINED = '|'.join(COLOR_KEYWORDS)

def sanitize_display_name(disp_name):
    if not disp_name:
        return ""
    return re.sub(r'Strandh[^\s]+gg', 'Strandhögg', disp_name)

def extract_color_from_name(disp_name):
    disp_name = sanitize_display_name(disp_name)
    m = re.search(rf'\(\s*({_COLOR_PATTERNS_COMBINED})\s*\)$', disp_name, re.I)
    if m:
        return m.group(1).strip()
    m2 = re.search(rf'[-–—:]\s*({_COLOR_PATTERNS_COMBINED})\s*$', disp_name, re.I)
    if m2:
        return m2.group(1).strip()
    m3 = re.search(rf'\s+({_COLOR_PATTERNS_COMBINED})\s*$', disp_name, re.I)
    if m3:
        return m3.group(1).strip()
    return None

def extract_color_for_item(cid, raw_disp_name):
    col = extract_color_from_name(raw_disp_name)
    if col:
        return col
    if cid != 'SMPZ_Weapon_UCP':
        for sfx, clabel in COLOR_SUFFIXES:
            if cid.endswith(sfx):
                return clabel
    return None

def clean_display_name(disp_name):
    disp_name = sanitize_display_name(disp_name)
    pattern = rf'(?:\s*[-–—:]\s*|\s+)?(?:\((?:{_COLOR_PATTERNS_COMBINED})\)|(?:{_COLOR_PATTERNS_COMBINED}))\s*$'
    cleaned = re.sub(pattern, '', disp_name, flags=re.I)
    cleaned = re.sub(r'[\s\-–—:]+$', '', cleaned).strip()
    return cleaned

# ---------------------------------------------------------------------------
# TRANSLATION & UTILITIES
# ---------------------------------------------------------------------------
def google_translate(text, target_lang='ko', source_lang='auto'):
    if not text or not text.strip():
        return ""
    clean_text = text.replace('\r\n', ' ').replace('\n', ' ').strip()
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={source_lang}&tl={target_lang}&dt=t&q={urllib.parse.quote(clean_text)}"
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            res_bytes = response.read()
            res_json = json.loads(res_bytes.decode('utf-8'))
            translated_pieces = [sentence[0] for sentence in res_json[0] if sentence[0]]
            return "".join(translated_pieces).strip()
    except Exception as e:
        print(f"[번역] 경고: {e}")
        return clean_text

def parse_paint_recipes(smpz_dir):
    smpz_class_re = re.compile(r'"(SMPZ_[A-Za-z0-9_]+)"')
    paintable_classes = set()
    c_files = glob.glob(os.path.join(smpz_dir, '**', '*.c'), recursive=True)

    paint_files_count = 0
    for f in c_files:
        fl = f.lower()
        is_paint_file = False
        if os.path.sep + 'paint' + os.path.sep in fl or '/paint/' in fl or '\\paint\\' in fl:
            is_paint_file = True
        elif 'paint' in os.path.basename(fl):
            is_paint_file = True
        else:
            try:
                with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                    head = fp.read(1500)
                    if 'RecipeBase' in head and ('Spraycan' in head or 'Paint' in head or 'paint' in head):
                        is_paint_file = True
            except Exception:
                continue

        if not is_paint_file or 'pluginrecipesmanager' in fl:
            continue

        paint_files_count += 1
        try:
            with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
        except Exception:
            continue

        matches = smpz_class_re.findall(content)
        for m in matches:
            if not m.startswith('SMPZ_Spraycan'):
                paintable_classes.add(m)

    print(f"[*] 도색 레시피({paint_files_count}개 스크립트 파일) 파싱 완료: 도색 가능 클래스 {len(paintable_classes)}개 추출")
    return paintable_classes

def barrel_adjustment_sort_key(label):
    match = re.search(r'(\d+(?:\.\d+)?)\s*(mm|inch)', label, re.I)
    if not match:
        return (1, math.inf, label.lower())
    length = float(match.group(1))
    if match.group(2).lower() == 'inch':
        length *= 25.4
    return (0, length, label.lower())

def sort_barrel_adjustments(adjustments):
    return sorted(set(adjustments), key=barrel_adjustment_sort_key)

def normalize_barrel_spec(label):
    match = re.search(r'(\d+(?:\.\d+)?)\s*(mm|inch)', label, re.I)
    if not match:
        return ('label', label.lower()), label

    millimeters = float(match.group(1))
    if match.group(2).lower() == 'inch':
        millimeters *= 25.4

    rounded = round(millimeters)
    display_value = str(rounded) if abs(millimeters - rounded) < 0.05 else f"{millimeters:g}"
    is_a2 = bool(re.search(r'\bA2\b', label, re.I))
    suffix = ' A2' if is_a2 else ''
    return ('length_mm', round(millimeters, 3), is_a2), f"{display_value}mm{suffix}"

def parse_barrel_adjustment_recipes(smpz_dir):
    adjustments_by_class = {}
    barrel_recipes = []
    barrel_files = []

    for filepath in glob.glob(os.path.join(smpz_dir, '**', '*.c'), recursive=True):
        path_parts = filepath.lower().replace('\\', '/').split('/')
        if 'recipes' in path_parts and any(part in ('barrel_short', 'barrel_long') for part in path_parts):
            barrel_files.append(filepath)

    class_re = re.compile(r'\bclass\s+[A-Za-z0-9_]+\s+extends\s+RecipeBase\s*\{', re.I)
    name_re = re.compile(r'\bm_Name\s*=\s*"([^"]+)"', re.I)
    ingredient_re = re.compile(r'\bInsertIngredient\s*\(\s*0\s*,\s*"([^"]+)"\s*\)', re.I)
    result_re = re.compile(r'\bTurnItemIntoItemLambda\s*\(\s*ingredients\s*\[\s*0\s*\]\s*,\s*"([^"]+)"', re.I)

    for filepath in barrel_files:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
        except Exception:
            continue

        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        content = re.sub(r'//.*', '', content)
        pos = 0

        while True:
            class_match = class_re.search(content, pos)
            if not class_match:
                break

            body_start = class_match.end() - 1
            brace_count = 1
            cursor = body_start + 1
            while cursor < len(content) and brace_count > 0:
                if content[cursor] == '{':
                    brace_count += 1
                elif content[cursor] == '}':
                    brace_count -= 1
                cursor += 1

            if brace_count != 0:
                break

            body = content[body_start + 1:cursor - 1]
            pos = cursor
            name_match = name_re.search(body)
            if not name_match or 'barrel' not in name_match.group(1).lower():
                continue

            recipe_name = name_match.group(1).strip()
            adjustment = re.sub(r'^Make\s+', '', recipe_name, flags=re.I)
            adjustment = re.sub(r'\s+Barrel$', '', adjustment, flags=re.I).strip()
            if not adjustment:
                continue

            weapon_classes = [
                weapon_class for weapon_class in ingredient_re.findall(body)
                if weapon_class.startswith('SMPZ_Weapon_')
            ]
            result_match = result_re.search(body)
            result_class = result_match.group(1) if result_match else None

            for weapon_class in weapon_classes:
                if weapon_class.startswith('SMPZ_Weapon_'):
                    adjustments_by_class.setdefault(weapon_class, set()).add(adjustment)

            if result_class and result_class.startswith('SMPZ_Weapon_'):
                barrel_recipes.append({
                    'sources': weapon_classes,
                    'target': result_class,
                    'adjustment': adjustment
                })

    result = {
        weapon_class: sort_barrel_adjustments(adjustments)
        for weapon_class, adjustments in adjustments_by_class.items()
    }
    print(
        f"[*] 총열 레시피({len(barrel_files)}개 스크립트 파일) 파싱 완료: "
        f"조절 가능 클래스 {len(result)}개 추출"
    )
    return result, barrel_recipes

def build_barrel_variant_data(barrel_recipes, all_classes):
    graph = {}
    labels_by_class = {}

    for recipe in barrel_recipes:
        target = recipe['target']
        labels_by_class.setdefault(target, recipe['adjustment'])
        graph.setdefault(target, set())
        for source in recipe['sources']:
            graph.setdefault(source, set()).add(target)
            graph[target].add(source)

    def class_color(class_id):
        props = get_inherited_props(class_id, all_classes)
        configured_color = props.get('color')
        if configured_color:
            return str(configured_color).strip().lower()

        class_id_lower = class_id.lower()
        for suffix, color_label in COLOR_SUFFIXES:
            if class_id_lower.endswith(suffix.lower()):
                return color_label.lower()
        return ''

    def class_family(class_id):
        family_id = class_id
        while True:
            normalized = _WEAPON_VARIANT_RE.sub('', family_id)
            if normalized == family_id:
                return normalized.lower()
            family_id = normalized

    def label_for_class(class_id):
        if class_id in labels_by_class:
            return labels_by_class[class_id]

        props = get_inherited_props(class_id, all_classes)
        barrel_length = props.get('barrelLengthMm')
        if barrel_length is not None:
            try:
                length_label = f"{int(float(barrel_length))}mm"
            except (ValueError, TypeError):
                length_label = f"{barrel_length}mm"
            if str(props.get('IsA2Barrel', '0')) in ('1', '1.0'):
                return f"{length_label} A2"
            return length_label

        configured_length = props.get('barrelLength')
        if configured_length:
            mm_match = re.search(r'(\d+(?:\.\d+)?)\s*mm', str(configured_length), re.I)
            if mm_match:
                millimeters = float(mm_match.group(1))
                length_label = f"{millimeters:g}mm"
                if str(props.get('IsA2Barrel', '0')) in ('1', '1.0'):
                    return f"{length_label} A2"
                return length_label

        return '기본형'

    variants_by_class = {}
    for start_class in graph:
        component = set()
        pending = [start_class]
        while pending:
            class_id = pending.pop()
            if class_id in component:
                continue
            component.add(class_id)
            pending.extend(graph.get(class_id, []))

        start_color = class_color(start_class)
        start_family = class_family(start_class)
        variants_by_spec = {}
        for class_id in component:
            if class_id not in all_classes:
                continue

            props = get_inherited_props(class_id, all_classes)
            stats = extract_weapon_stats(class_id, props, all_classes)
            weight = props.get('weight')
            if weight is not None:
                try:
                    stats['weight'] = int(float(weight))
                except (ValueError, TypeError):
                    pass

            variant = {
                'name': label_for_class(class_id),
                'id': class_id,
                'stats': clean_item_stats(stats),
                '_color': class_color(class_id)
            }

            item_size = props.get('itemSize')
            if item_size and len(item_size) >= 2:
                try:
                    variant['itemSize'] = [int(item_size[0]), int(item_size[1])]
                    variant['itemSlots'] = int(item_size[0]) * int(item_size[1])
                except (ValueError, TypeError):
                    pass

            candidate_priority = (
                0 if class_id == start_class else 1,
                0 if class_family(class_id) == start_family else 1,
                0 if start_color and variant['_color'] == start_color else
                1 if not start_color and not variant['_color'] else
                2,
                1 if str(props.get('IsA2Barrel', '0')) in ('1', '1.0') else 0,
                class_id.lower()
            )
            spec_key, display_name = normalize_barrel_spec(variant['name'])
            variant['name'] = display_name
            existing = variants_by_spec.get(spec_key)
            if existing is None or candidate_priority < existing[0]:
                variants_by_spec[spec_key] = (candidate_priority, variant)

        variants = [entry[1] for entry in variants_by_spec.values()]
        for variant in variants:
            variant.pop('_color', None)
        variants.sort(key=lambda variant: barrel_adjustment_sort_key(variant['name']))
        variants_by_class[start_class] = variants

    return variants_by_class

# ---------------------------------------------------------------------------
# C++ PARSING ENGINE
# ---------------------------------------------------------------------------
def parse_cpp_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
    except Exception:
        return {}

    text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
    text = re.sub(r'//.*', '', text)

    classes = {}
    pos = 0
    while True:
        m = re.search(r'\bclass\s+([A-Za-z0-9_]+)(?:\s*:\s*([A-Za-z0-9_]+))?\s*\{', text[pos:])
        if not m:
            break
        class_name = m.group(1)
        parent_name = m.group(2)
        start_idx = pos + m.end() - 1

        brace_count = 1
        i = start_idx + 1
        while i < len(text) and brace_count > 0:
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
            i += 1

        if brace_count == 0:
            body = text[start_idx+1:i-1]
            classes[class_name] = {
                'name': class_name,
                'parent': parent_name,
                'body': body,
                'source_file': filepath
            }
            pos = pos + m.start() + len(m.group(0))
        else:
            pos = pos + m.end()

    return classes


# ---------------------------------------------------------------------------
# DAYZ RUNTIME SCRIPT ATTACHMENT RULE PARSING
# ---------------------------------------------------------------------------
def _strip_c_comments(text):
    """Remove comments without changing quoted strings."""
    result = []
    i = 0
    quote = None
    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ''
        if quote:
            result.append(ch)
            if ch == '\\' and i + 1 < len(text):
                result.append(text[i + 1])
                i += 2
                continue
            if ch == quote:
                quote = None
            i += 1
            continue
        if ch in ('"', "'"):
            quote = ch
            result.append(ch)
            i += 1
            continue
        if ch == '/' and nxt == '/':
            i += 2
            while i < len(text) and text[i] not in '\r\n':
                i += 1
            continue
        if ch == '/' and nxt == '*':
            i += 2
            while i + 1 < len(text) and not (text[i] == '*' and text[i + 1] == '/'):
                i += 1
            i += 2
            continue
        result.append(ch)
        i += 1
    return ''.join(result)


def _find_balanced_end(text, start, opening='{', closing='}'):
    """Return the index just after a balanced block beginning at start."""
    if start >= len(text) or text[start] != opening:
        return None
    depth = 1
    quote = None
    i = start + 1
    while i < len(text):
        ch = text[i]
        if quote:
            if ch == '\\':
                i += 2
                continue
            if ch == quote:
                quote = None
        elif ch in ('"', "'"):
            quote = ch
        elif ch == opening:
            depth += 1
        elif ch == closing:
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return None


def parse_dayz_script_classes(smpz_dir):
    """Parse Enforce Script class inheritance and relevant method bodies."""
    classes = {}
    script_files = glob.glob(os.path.join(smpz_dir, '**', '*.c'), recursive=True)
    class_re = re.compile(
        r'\b(?:(?:modded|sealed)\s+)*class\s+([A-Za-z_][A-Za-z0-9_]*)'
        r'(?:\s*(?::|extends)\s*([A-Za-z_][A-Za-z0-9_]*))?\s*\{'
    )

    for filepath in script_files:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                text = _strip_c_comments(f.read())
        except Exception:
            continue

        pos = 0
        while True:
            match = class_re.search(text, pos)
            if not match:
                break
            block_start = match.end() - 1
            block_end = _find_balanced_end(text, block_start)
            if block_end is None:
                pos = match.end()
                continue
            class_name, parent_name = match.group(1), match.group(2)
            info = classes.setdefault(class_name, {
                'name': class_name,
                'parent': parent_name,
                'bodies': [],
                'source_files': []
            })
            if parent_name and not info.get('parent'):
                info['parent'] = parent_name
            info['bodies'].append(text[block_start + 1:block_end - 1])
            info['source_files'].append(filepath)
            pos = block_end

    return classes, len(script_files)


def _extract_method_bodies(class_body, method_name):
    method_re = re.compile(
        rf'\b(?:override\s+)?bool\s+{re.escape(method_name)}\s*\([^)]*\)\s*\{{'
    )
    methods = []
    pos = 0
    while True:
        match = method_re.search(class_body, pos)
        if not match:
            break
        block_start = match.end() - 1
        block_end = _find_balanced_end(class_body, block_start)
        if block_end is None:
            break
        methods.append(class_body[block_start + 1:block_end - 1])
        pos = block_end
    return methods


def _extract_if_branches(method_body):
    """Yield if branches together with their enclosing if conditions."""
    branches = []
    if_re = re.compile(r'\bif\s*\(')

    def scan(segment, ancestors):
        pos = 0
        while True:
            match = if_re.search(segment, pos)
            if not match:
                break
            cond_start = segment.find('(', match.start())
            cond_end = _find_balanced_end(segment, cond_start, '(', ')')
            if cond_end is None:
                break
            condition = segment[cond_start + 1:cond_end - 1]
            stmt_start = cond_end
            while stmt_start < len(segment) and segment[stmt_start].isspace():
                stmt_start += 1
            if stmt_start < len(segment) and segment[stmt_start] == '{':
                stmt_end = _find_balanced_end(segment, stmt_start)
                if stmt_end is None:
                    break
                branch_body = segment[stmt_start + 1:stmt_end - 1]
                scan(branch_body, ancestors + [condition])
            else:
                semi = segment.find(';', stmt_start)
                if semi < 0:
                    pos = cond_end
                    continue
                stmt_end = semi + 1
                branch_body = segment[stmt_start:stmt_end]
            branches.append((condition, branch_body, ancestors))
            pos = stmt_end

    scan(method_body, [])
    return branches


def _direct_return_outcome(branch_body, method_name):
    """Classify a simple guarded return, ignoring branches with other logic."""
    compact = re.sub(r'\s+', ' ', branch_body).strip()
    match = re.fullmatch(r'return\s+(.+?)\s*;', compact)
    if not match:
        return None
    expr = match.group(1).strip()
    if expr == 'false':
        return 'deny'
    if expr == 'true' or re.fullmatch(rf'super\.{re.escape(method_name)}\s*\([^;]*\)', expr):
        return 'allow'
    return None


def _extract_type_checks(condition, variable):
    """Return positive/negative IsInherited/IsKindOf roots for a pure type guard."""
    call_re = re.compile(
        rf'(!\s*)?\b{re.escape(variable)}\s*\.\s*'
        rf'(?:IsInherited|IsKindOf)\s*\(\s*'
        rf'(?:(?:"([A-Za-z_][A-Za-z0-9_]*)")|([A-Za-z_][A-Za-z0-9_]*))\s*\)'
    )
    positive = []
    negative = []
    for match in call_re.finditer(condition):
        target = match.group(2) or match.group(3)
        (negative if match.group(1) else positive).append(target)
    if not positive and not negative:
        return None

    remainder = call_re.sub(' true ', condition)
    remainder = re.sub(rf'!\s*\b{re.escape(variable)}\b|\b{re.escape(variable)}\b', ' true ', remainder)
    remainder = re.sub(r'\b(?:true|false)\b|&&|\|\||!|\(|\)|\s+', '', remainder)
    if remainder:
        return None
    return positive, negative


def _extract_top_level_if_branches(segment):
    """Return top-level if branches with source offsets inside a code segment."""
    branches = []
    i = 0
    depth = 0
    quote = None
    while i < len(segment):
        ch = segment[i]
        if quote:
            if ch == '\\':
                i += 2
                continue
            if ch == quote:
                quote = None
            i += 1
            continue
        if ch in ('"', "'"):
            quote = ch
            i += 1
            continue
        if ch == '{':
            depth += 1
            i += 1
            continue
        if ch == '}':
            depth = max(0, depth - 1)
            i += 1
            continue
        if depth != 0 or not segment.startswith('if', i):
            i += 1
            continue
        before = segment[i - 1] if i else ' '
        after = segment[i + 2] if i + 2 < len(segment) else ' '
        if (before.isalnum() or before == '_') or (after.isalnum() or after == '_'):
            i += 2
            continue
        cond_start = i + 2
        while cond_start < len(segment) and segment[cond_start].isspace():
            cond_start += 1
        if cond_start >= len(segment) or segment[cond_start] != '(':
            i += 2
            continue
        cond_end = _find_balanced_end(segment, cond_start, '(', ')')
        if cond_end is None:
            break
        stmt_start = cond_end
        while stmt_start < len(segment) and segment[stmt_start].isspace():
            stmt_start += 1
        if stmt_start < len(segment) and segment[stmt_start] == '{':
            stmt_end = _find_balanced_end(segment, stmt_start)
            if stmt_end is None:
                break
            body = segment[stmt_start + 1:stmt_end - 1]
        else:
            semi = segment.find(';', stmt_start)
            if semi < 0:
                i = cond_end
                continue
            stmt_end = semi + 1
            body = segment[stmt_start:stmt_end]
        branches.append({
            'condition': segment[cond_start + 1:cond_end - 1],
            'body': body,
            'start': i,
            'end': stmt_end
        })
        i = stmt_end
    return branches


def _extract_attachment_lookups(method_body):
    """Map local variables populated by FindAttachmentBySlotName to slot names."""
    return {
        variable: slot
        for variable, slot in re.findall(
            r'\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*'
            r'(?:this\s*\.\s*)?FindAttachmentBySlotName\s*\(\s*"([^"]+)"\s*\)',
            method_body
        )
    }


def _extract_attachment_state_condition(condition, lookups):
    """Parse a pure attached-kind presence/absence condition for a looked-up slot."""
    for variable, slot in lookups.items():
        call_re = re.compile(
            rf'(!\s*)?\b{re.escape(variable)}\s*\.\s*IsKindOf\s*\(\s*'
            rf'"([A-Za-z_][A-Za-z0-9_]*)"\s*\)'
        )
        matches = list(call_re.finditer(condition))
        if len(matches) != 1:
            continue
        root = matches[0].group(2)
        negated_kind = bool(matches[0].group(1))
        remainder = call_re.sub(' true ', condition)
        variable_negated = bool(re.search(rf'!\s*\b{re.escape(variable)}\b', remainder))
        remainder = re.sub(rf'!\s*\b{re.escape(variable)}\b|\b{re.escape(variable)}\b', ' true ', remainder)
        remainder = re.sub(r'\b(?:true|false)\b|&&|\|\||!|\(|\)|\s+', '', remainder)
        if remainder:
            continue
        return {
            'slot': slot,
            'roots': [root],
            'present': not (negated_kind or variable_negated)
        }
    return None


def _parse_candidate_policy(segment, method_name, variable):
    """Parse a candidate kind guard plus a terminal boolean fallback."""
    terminal = re.search(r'return\s+(true|false)\s*;\s*$', segment.strip())
    if not terminal:
        return None
    fallback = 'allow' if terminal.group(1) == 'true' else 'deny'
    allowed = set()
    denied = set()
    for branch in _extract_top_level_if_branches(segment):
        outcome = _direct_return_outcome(branch['body'], method_name)
        checks = _extract_type_checks(branch['condition'], variable)
        if not outcome or not checks:
            continue
        positive, negative = checks
        if negative:
            continue
        if outcome == 'allow' and fallback == 'deny':
            allowed.update(positive)
        elif outcome == 'deny' and fallback == 'allow':
            denied.update(positive)
    if not allowed and not denied:
        return None
    return {
        'fallback': fallback,
        'allowed': sorted(allowed, key=str.lower),
        'denied': sorted(denied, key=str.lower)
    }


def _parse_stateful_attachment_rules(method_body, method_name, variable):
    """Extract slot compatibility conditioned on another attachment."""
    conditional_by_slot = {}
    for condition, slot_body, ancestors in _extract_if_branches(method_body):
        target_slots = _extract_slot_checks(condition, method_body)
        if not target_slots or ancestors:
            continue
        lookups = _extract_attachment_lookups(slot_body)
        if not lookups:
            continue
        for state_branch in _extract_top_level_if_branches(slot_body):
            state = _extract_attachment_state_condition(state_branch['condition'], lookups)
            if not state:
                continue
            active_policy = _parse_candidate_policy(state_branch['body'], method_name, variable)
            inverse_policy = _parse_candidate_policy(slot_body[state_branch['end']:], method_name, variable)
            if not active_policy or not inverse_policy:
                continue
            inverse_state = dict(state)
            inverse_state['present'] = not state['present']
            for target_slot in target_slots:
                rules = conditional_by_slot.setdefault(target_slot, [])
                rules.append({'conditions': [state], **active_policy})
                rules.append({'conditions': [inverse_state], **inverse_policy})
            break
    return conditional_by_slot


def _extract_slot_checks(condition, method_body):
    """Return slot names when a condition is composed only of slot checks."""
    slots = []
    slot_patterns = (
        re.compile(r'\b(?:slotName|attachSlotName)\s*==\s*"([^"]+)"'),
        re.compile(r'"([^"]+)"\s*==\s*\b(?:slotName|attachSlotName)\b'),
        re.compile(r'\bslotId\s*==\s*InventorySlots\.GetSlotIdFromString\s*\(\s*"([^"]+)"\s*\)'),
        re.compile(r'InventorySlots\.GetSlotIdFromString\s*\(\s*"([^"]+)"\s*\)\s*==\s*\bslotId\b'),
    )
    remainder = condition
    for pattern in slot_patterns:
        slots.extend(pattern.findall(remainder))
        remainder = pattern.sub(' true ', remainder)

    local_slot_ids = {
        var_name: slot_name
        for var_name, slot_name in re.findall(
            r'\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*InventorySlots\.GetSlotIdFromString\s*\(\s*"([^"]+)"\s*\)',
            method_body
        )
    }
    for var_name, slot_name in local_slot_ids.items():
        pattern = re.compile(
            rf'(?:\bslotId\s*==\s*\b{re.escape(var_name)}\b|'
            rf'\b{re.escape(var_name)}\b\s*==\s*\bslotId\b)'
        )
        if pattern.search(remainder):
            slots.append(slot_name)
            remainder = pattern.sub(' true ', remainder)

    remainder = re.sub(r'\b(?:true|false)\b|&&|\|\||!|\(|\)|\s+', '', remainder)
    if not slots or remainder:
        return None
    return sorted(set(slots), key=str.lower)


def _extract_loops(code_text):
    loops = []
    loop_re = re.compile(r'\b(for|while)\s*\(')
    pos = 0
    while True:
        m = loop_re.search(code_text, pos)
        if not m:
            break
        cond_start = code_text.find('(', m.start())
        cond_end = _find_balanced_end(code_text, cond_start, '(', ')')
        if cond_end is None:
            pos = m.end()
            continue
        stmt_start = cond_end
        while stmt_start < len(code_text) and code_text[stmt_start].isspace():
            stmt_start += 1
        if stmt_start < len(code_text) and code_text[stmt_start] == '{':
            stmt_end = _find_balanced_end(code_text, stmt_start, '{', '}')
            if stmt_end is None:
                pos = cond_end
                continue
            loop_body = code_text[stmt_start + 1:stmt_end - 1]
            loops.append({
                'type': m.group(1),
                'condition': code_text[cond_start + 1:cond_end - 1],
                'body': loop_body,
                'start': m.start(),
                'end': stmt_end
            })
            pos = stmt_end
        else:
            pos = cond_end
    return loops


def _extract_string_arrays(code_text):
    arrays = {}
    pattern = re.compile(
        r'(?:(?:ref\s+|static\s+|const\s+|protected\s+)*array\s*<\s*string\s*>\s+)?\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{([^}]+)\};',
        re.DOTALL
    )
    for m in pattern.finditer(code_text):
        var_name = m.group(1)
        raw_items = m.group(2)
        items = re.findall(r'"([^"]+)"', raw_items)
        if items:
            arrays[var_name] = items
    return arrays


def _extract_any_method_body(class_body, method_name):
    method_re = re.compile(
        rf'\b(?:override\s+|protected\s+|private\s+)?(?:bool|void|int|string)\s+{re.escape(method_name)}\s*\([^)]*\)\s*\{{'
    )
    m = method_re.search(class_body)
    if not m:
        return None
    start = m.end() - 1
    end = _find_balanced_end(class_body, start)
    if not end:
        return None
    return class_body[start + 1:end - 1]


def _parse_array_and_helper_rules(method_body, method_name, variable, class_body=None):
    allowed = set()
    denied = set()
    allowed_by_slot = {}
    denied_by_slot = {}

    method_arrays = _extract_string_arrays(method_body)
    class_arrays = _extract_string_arrays(class_body) if class_body else {}
    all_arrays = {**class_arrays, **method_arrays}

    loops = _extract_loops(method_body)
    for loop in loops:
        loop_body = loop['body']
        arr_name = None
        direct_m = re.search(
            rf'\b{re.escape(variable)}\s*\.\s*IsKindOf\s*\(\s*([A-Za-z0-9_]+)(?:\.Get\s*\([^)]+\)|\[[^\]]+\])?\s*\)',
            loop_body
        )
        if direct_m and direct_m.group(1) in all_arrays:
            arr_name = direct_m.group(1)
        else:
            assign_m = re.search(
                r'\b([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+)(?:\.Get\s*\([^)]+\)|\[[^\]]+\])\s*;',
                loop_body
            )
            if assign_m:
                temp_var, potential_arr = assign_m.group(1), assign_m.group(2)
                if potential_arr in all_arrays and re.search(rf'\b{re.escape(variable)}\s*\.\s*IsKindOf\s*\(\s*{re.escape(temp_var)}\s*\)', loop_body):
                    arr_name = potential_arr

        if not arr_name:
            continue
        arr_items = all_arrays.get(arr_name, [])
        if not arr_items:
            continue

        inner_ret = re.search(r'return\s+(true|false)\s*;', loop_body)
        if not inner_ret:
            continue
        outcome = inner_ret.group(1)

        code_before = method_body[:loop['start']]
        enclosing_slots = []
        pos = 0
        if_re = re.compile(r'\bif\s*\(')
        while True:
            m = if_re.search(code_before, pos)
            if not m:
                break
            c_start = code_before.find('(', m.start())
            c_end = _find_balanced_end(code_before, c_start, '(', ')')
            if not c_end:
                break
            cond = code_before[c_start+1:c_end-1]
            b_start = c_end
            while b_start < len(code_before) and code_before[b_start].isspace():
                b_start += 1
            if b_start < len(code_before) and code_before[b_start] == '{':
                b_end = _find_balanced_end(code_before, b_start)
                if b_end is None or b_end > loop['start']:
                    s = _extract_slot_checks(cond, method_body)
                    if s:
                        enclosing_slots.extend(s)
            pos = c_end

        if outcome == 'true':
            if enclosing_slots:
                for s in set(enclosing_slots):
                    allowed_by_slot.setdefault(s, set()).update(arr_items)
            else:
                allowed.update(arr_items)
        elif outcome == 'false':
            if enclosing_slots:
                for s in set(enclosing_slots):
                    denied_by_slot.setdefault(s, set()).update(arr_items)
            else:
                denied.update(arr_items)

    for condition, branch_body, ancestors in _extract_if_branches(method_body):
        find_m = re.search(r'\b([A-Za-z0-9_]+)\.Find\s*\(', condition)
        if not find_m:
            continue
        arr_name = find_m.group(1)
        arr_items = all_arrays.get(arr_name, [])
        if not arr_items:
            continue

        ret_m = re.search(r'return\s+(true|false)\s*;', branch_body)
        if not ret_m:
            continue
        outcome = ret_m.group(1)

        slots = []
        for anc in ancestors:
            s = _extract_slot_checks(anc, method_body)
            if s:
                slots.extend(s)

        if outcome == 'true':
            if slots:
                for s in set(slots):
                    allowed_by_slot.setdefault(s, set()).update(arr_items)
            else:
                allowed.update(arr_items)
        elif outcome == 'false':
            if slots:
                for s in set(slots):
                    denied_by_slot.setdefault(s, set()).update(arr_items)
            else:
                denied.update(arr_items)

    if class_body:
        for condition, branch_body, ancestors in _extract_if_branches(method_body):
            ret_m = re.search(r'return\s+(true|false)\s*;', branch_body)
            if not ret_m:
                continue
            branch_outcome = ret_m.group(1)
            helper_m = re.search(rf'(!?)\s*\b([A-Za-z_][A-Za-z0-9_]*)\s*\(\s*{re.escape(variable)}\s*\)', condition)
            if not helper_m:
                continue
            is_negated = bool(helper_m.group(1))
            helper_name = helper_m.group(2)
            if helper_name in ('IsKindOf', 'IsInherited', 'Cast', 'FindAttachmentBySlotName') or helper_name == method_name or 'super.' in condition:
                continue

            helper_body = _extract_any_method_body(class_body, helper_name)
            if not helper_body:
                continue
            h_arrays = _extract_string_arrays(helper_body)
            if not h_arrays:
                continue
            h_loops = _extract_loops(helper_body)
            for h_loop in h_loops:
                h_loop_body = h_loop['body']
                h_arr_name = None
                h_direct = re.search(
                    rf'\b{re.escape(variable)}\s*\.\s*IsKindOf\s*\(\s*([A-Za-z0-9_]+)(?:\.Get\s*\([^)]+\)|\[[^\]]+\])?\s*\)',
                    h_loop_body
                )
                if h_direct and h_direct.group(1) in h_arrays:
                    h_arr_name = h_direct.group(1)
                else:
                    h_assign = re.search(
                        r'\b([A-Za-z0-9_]+)\s*=\s*([A-Za-z0-9_]+)(?:\.Get\s*\([^)]+\)|\[[^\]]+\])\s*;',
                        h_loop_body
                    )
                    if h_assign and h_assign.group(2) in h_arrays:
                        if re.search(rf'\b{re.escape(variable)}\s*\.\s*IsKindOf\s*\(\s*{re.escape(h_assign.group(1))}\s*\)', h_loop_body):
                            h_arr_name = h_assign.group(2)

                if not h_arr_name:
                    continue
                h_items = h_arrays.get(h_arr_name, [])
                if not h_items:
                    continue

                h_inner_ret = re.search(r'return\s+(true|false)\s*;', h_loop_body)
                if not h_inner_ret:
                    continue
                h_match_ret = h_inner_ret.group(1)

                slots = []
                for anc in ancestors:
                    s = _extract_slot_checks(anc, method_body)
                    if s:
                        slots.extend(s)

                if branch_outcome == 'false':
                    if h_match_ret == 'true' and not is_negated:
                        if slots:
                            for s in set(slots):
                                denied_by_slot.setdefault(s, set()).update(h_items)
                        else:
                            denied.update(h_items)
                    elif h_match_ret == 'true' and is_negated:
                        if slots:
                            for s in set(slots):
                                allowed_by_slot.setdefault(s, set()).update(h_items)
                        else:
                            allowed.update(h_items)
                    elif h_match_ret == 'false' and is_negated:
                        if slots:
                            for s in set(slots):
                                denied_by_slot.setdefault(s, set()).update(h_items)
                        else:
                            denied.update(h_items)

    return {
        'allowed': allowed,
        'denied': denied,
        'allowedBySlot': allowed_by_slot,
        'deniedBySlot': denied_by_slot
    }


def _parse_attachment_method_rule(method_body, method_name, variable, class_body=None):
    """Extract unconditional class allow/deny constraints from one method."""
    allowed = set()
    denied = set()
    allowed_by_slot = {}
    denied_by_slot = {}
    fallback_false = bool(re.search(r'return\s+false\s*;\s*$', method_body.strip()))

    for condition, branch_body, ancestors in _extract_if_branches(method_body):
        outcome = _direct_return_outcome(branch_body, method_name)
        checks = _extract_type_checks(condition, variable)
        if not outcome or not checks:
            continue
        positive, negative = checks

        slots = None
        if ancestors:
            ancestor_slots = []
            valid_slot_context = True
            for ancestor in ancestors:
                parsed_slots = _extract_slot_checks(ancestor, method_body)
                if not parsed_slots:
                    valid_slot_context = False
                    break
                ancestor_slots.extend(parsed_slots)
            if not valid_slot_context:
                # A type check nested under runtime state cannot be promoted to
                # an unconditional item-pair restriction.
                continue
            slots = sorted(set(ancestor_slots), key=str.lower)

        target_allowed = allowed
        target_denied = denied
        if slots:
            target_allowed = set()
            target_denied = set()
        if outcome == 'allow' and fallback_false:
            target_allowed.update(positive)
        elif outcome == 'deny':
            # A pure `if (!x.IsInherited(A)) return false` is a whitelist.
            target_allowed.update(negative)
            # Positive type checks are unconditional denials only when the
            # condition contains no alternative negative type requirement.
            if not negative:
                target_denied.update(positive)

        for slot in slots or []:
            allowed_by_slot.setdefault(slot, set()).update(target_allowed)
            denied_by_slot.setdefault(slot, set()).update(target_denied)

    array_rules = _parse_array_and_helper_rules(method_body, method_name, variable, class_body)
    allowed.update(array_rules.get('allowed', []))
    denied.update(array_rules.get('denied', []))
    for slot, roots in array_rules.get('allowedBySlot', {}).items():
        allowed_by_slot.setdefault(slot, set()).update(roots)
    for slot, roots in array_rules.get('deniedBySlot', {}).items():
        denied_by_slot.setdefault(slot, set()).update(roots)

    rule = {}
    if allowed:
        rule['allowed'] = sorted(allowed, key=str.lower)
    if denied:
        rule['denied'] = sorted(denied, key=str.lower)
    if allowed_by_slot:
        rule['allowedBySlot'] = {
            slot: sorted(roots, key=str.lower)
            for slot, roots in sorted(allowed_by_slot.items()) if roots
        }
    if denied_by_slot:
        rule['deniedBySlot'] = {
            slot: sorted(roots, key=str.lower)
            for slot, roots in sorted(denied_by_slot.items()) if roots
        }
    conditional_by_slot = _parse_stateful_attachment_rules(method_body, method_name, variable)
    if conditional_by_slot:
        # The trailing branch applies only when the state branch did not return.
        for slot in conditional_by_slot:
            rule.get('allowedBySlot', {}).pop(slot, None)
            rule.get('deniedBySlot', {}).pop(slot, None)
        if not rule.get('allowedBySlot'):
            rule.pop('allowedBySlot', None)
        if not rule.get('deniedBySlot'):
            rule.pop('deniedBySlot', None)
        rule['conditionalBySlot'] = conditional_by_slot
    return rule


def extract_runtime_attachment_rules(runtime_classes):
    """Collect the nearest CanPut/CanReceive class rules for runtime classes."""
    rules = {}
    method_specs = (
        ('CanPutAsAttachment', 'parent', 'parents'),
        ('CanReceiveAttachment', 'attachment', 'attachments'),
    )
    for class_name, info in runtime_classes.items():
        class_rule = {}
        for method_name, variable, rule_key in method_specs:
            method_rules = []
            for body in info.get('bodies', []):
                for method_body in _extract_method_bodies(body, method_name):
                    parsed = _parse_attachment_method_rule(method_body, method_name, variable, class_body=body)
                    if parsed:
                        method_rules.append(parsed)
            if method_rules:
                merged = {
                    'allowed': set(),
                    'denied': set(),
                    'allowedBySlot': {},
                    'deniedBySlot': {},
                    'conditionalBySlot': {}
                }
                for method_rule in method_rules:
                    merged['allowed'].update(method_rule.get('allowed', []))
                    merged['denied'].update(method_rule.get('denied', []))
                    for map_key in ('allowedBySlot', 'deniedBySlot'):
                        for slot, roots in method_rule.get(map_key, {}).items():
                            merged[map_key].setdefault(slot, set()).update(roots)
                    for slot, conditional_rules in method_rule.get('conditionalBySlot', {}).items():
                        merged['conditionalBySlot'].setdefault(slot, []).extend(conditional_rules)
                class_rule[rule_key] = {}
                for key in ('allowed', 'denied'):
                    if merged[key]:
                        class_rule[rule_key][key] = sorted(merged[key], key=str.lower)
                for map_key in ('allowedBySlot', 'deniedBySlot'):
                    if merged[map_key]:
                        class_rule[rule_key][map_key] = {
                            slot: sorted(roots, key=str.lower)
                            for slot, roots in sorted(merged[map_key].items())
                        }
                if merged['conditionalBySlot']:
                    class_rule[rule_key]['conditionalBySlot'] = {
                        slot: conditional_rules
                        for slot, conditional_rules in sorted(merged['conditionalBySlot'].items())
                    }
        if class_rule:
            rules[class_name] = class_rule
    return rules


def _class_lineage(class_name, runtime_classes, cpp_classes=None):
    """Return a class plus ancestors, preferring the runtime script graph."""
    lineage = []
    visited = set()
    current = class_name
    runtime_lookup = {name.lower(): name for name in runtime_classes}
    cpp_lookup = {name.lower(): name for name in (cpp_classes or {})}
    while current and current.lower() not in visited:
        visited.add(current.lower())
        canonical = runtime_lookup.get(current.lower()) or cpp_lookup.get(current.lower()) or current
        lineage.append(canonical)
        if canonical in runtime_classes and runtime_classes[canonical].get('parent'):
            current = runtime_classes[canonical].get('parent')
        elif cpp_classes and canonical in cpp_classes:
            current = cpp_classes[canonical].get('parent')
        else:
            current = None
    return lineage


def _class_ancestor_names(class_name, runtime_classes, cpp_classes=None):
    """Return all ancestors across both runtime and config inheritance graphs."""
    runtime_lookup = {name.lower(): name for name in runtime_classes}
    cpp_lookup = {name.lower(): name for name in (cpp_classes or {})}
    result = []
    visited = set()
    pending = [class_name]
    while pending:
        current = pending.pop(0)
        key = current.lower()
        if key in visited:
            continue
        visited.add(key)
        runtime_name = runtime_lookup.get(key)
        cpp_name = cpp_lookup.get(key)
        canonical = runtime_name or cpp_name or current
        result.append(canonical)
        if runtime_name and runtime_classes[runtime_name].get('parent'):
            pending.append(runtime_classes[runtime_name]['parent'])
        if cpp_name and cpp_classes and cpp_classes[cpp_name].get('parent'):
            pending.append(cpp_classes[cpp_name]['parent'])
    return result


def _nearest_runtime_rule(class_name, rule_key, runtime_classes, runtime_rules, cpp_classes):
    for ancestor in _class_lineage(class_name, runtime_classes, cpp_classes):
        class_rule = runtime_rules.get(ancestor, {}).get(rule_key)
        if class_rule:
            return class_rule
    return None


def apply_runtime_attachment_constraints(data_groups, runtime_classes, runtime_rules, cpp_classes):
    """Resolve script class roots to concrete IDs used by the generated site."""
    items = []
    for groups in data_groups:
        for group_items in groups.values():
            items.extend(group_items)

    item_info = []
    representative_by_alias = {}
    for item in items:
        aliases = [item.get('id')]
        aliases.extend(
            variant.get('id') for variant in item.get('color', [])
            if isinstance(variant, dict) and variant.get('id')
        )
        aliases = list(dict.fromkeys(alias for alias in aliases if alias))
        lineage = set()
        for alias in aliases:
            lineage.update(name.lower() for name in _class_ancestor_names(alias, runtime_classes, cpp_classes))
            representative_by_alias[alias.lower()] = item['id']
        item_info.append({'item': item, 'aliases': aliases, 'lineage': lineage})

    def matching_item_ids(class_roots):
        roots = {root.lower() for root in class_roots}
        return sorted({
            info['item']['id'] for info in item_info
            if roots.intersection(info['lineage'])
        }, key=str.lower)

    item_info_by_id = {info['item']['id']: info for info in item_info}

    def representative_for_class(class_name):
        for ancestor in _class_ancestor_names(class_name, runtime_classes, cpp_classes):
            representative = representative_by_alias.get(ancestor.lower())
            if representative:
                return representative
        return None

    def slot_candidate_ids(item, slot):
        if slot.lower() == 'magazine':
            candidates = {
                representative_for_class(class_name)
                for class_name in item.get('magazines', [])
            }
            return sorted((candidate for candidate in candidates if candidate), key=str.lower)
        return sorted({
            candidate_info['item']['id']
            for candidate_info in item_info
            if slot in (candidate_info['item'].get('inventorySlots') or [])
        }, key=str.lower)

    def roots_match_candidates(class_roots, candidate_ids):
        roots = {root.lower() for root in class_roots}
        return {
            candidate_id for candidate_id in candidate_ids
            if roots.intersection(item_info_by_id[candidate_id]['lineage'])
        }

    constrained_items = 0
    for info in item_info:
        item = info['item']

        put_rules = [
            rule for alias in info['aliases']
            if (rule := _nearest_runtime_rule(alias, 'parents', runtime_classes, runtime_rules, cpp_classes))
        ]
        if put_rules:
            allowed_rule_sets = [set(rule['allowed']) for rule in put_rules if rule.get('allowed')]
            if allowed_rule_sets and len(allowed_rule_sets) == len(put_rules):
                allowed_roots = set().union(*allowed_rule_sets)
                item['allowedParents'] = matching_item_ids(allowed_roots)
            denied_roots = set().union(*(set(rule.get('denied', [])) for rule in put_rules))
            if denied_roots:
                item['deniedParents'] = matching_item_ids(denied_roots)

        receive_rules = [
            rule for alias in info['aliases']
            if (rule := _nearest_runtime_rule(alias, 'attachments', runtime_classes, runtime_rules, cpp_classes))
        ]
        if receive_rules:
            allowed_rule_sets = [set(rule['allowed']) for rule in receive_rules if rule.get('allowed')]
            if allowed_rule_sets and len(allowed_rule_sets) == len(receive_rules):
                allowed_roots = set().union(*allowed_rule_sets)
                item['allowedAttachments'] = matching_item_ids(allowed_roots)
            denied_roots = set().union(*(set(rule.get('denied', [])) for rule in receive_rules))
            if denied_roots:
                item['deniedAttachments'] = matching_item_ids(denied_roots)

            for rule_key, item_key in (
                ('allowedBySlot', 'allowedAttachmentsBySlot'),
                ('deniedBySlot', 'deniedAttachmentsBySlot')
            ):
                roots_by_slot = {}
                for rule in receive_rules:
                    for slot, roots in rule.get(rule_key, {}).items():
                        roots_by_slot.setdefault(slot, set()).update(roots)
                if roots_by_slot:
                    item[item_key] = {
                        slot: matching_item_ids(roots)
                        for slot, roots in sorted(roots_by_slot.items())
                    }


            conditional_by_slot = {}
            for receive_rule in receive_rules:
                for slot, conditional_rules in receive_rule.get('conditionalBySlot', {}).items():
                    explicit_roots = set()
                    for conditional_rule in conditional_rules:
                        explicit_roots.update(conditional_rule.get('allowed', []))
                        explicit_roots.update(conditional_rule.get('denied', []))
                    universe = sorted(set(slot_candidate_ids(item, slot)).union(
                        matching_item_ids(explicit_roots)
                    ), key=str.lower)
                    if not universe:
                        continue
                    universe_set = set(universe)
                    for conditional_rule in conditional_rules:
                        resolved_conditions = []
                        for condition in conditional_rule.get('conditions', []):
                            condition_items = matching_item_ids(condition.get('roots', []))
                            if not condition_items:
                                resolved_conditions = []
                                break
                            resolved_conditions.append({
                                'type': 'attachment',
                                'slot': condition['slot'],
                                'operator': 'isKindOf',
                                'items': condition_items,
                                'present': bool(condition.get('present'))
                            })
                        if not resolved_conditions:
                            continue
                        allowed = set(universe) if conditional_rule.get('fallback') == 'allow' else set()
                        allowed.update(roots_match_candidates(conditional_rule.get('allowed', []), universe))
                        allowed.difference_update(roots_match_candidates(conditional_rule.get('denied', []), universe))
                        conditional_by_slot.setdefault(slot, []).append({
                            'conditions': resolved_conditions,
                            'mode': 'replace',
                            'allowed': sorted(allowed, key=str.lower),
                            'denied': sorted(universe_set - allowed, key=str.lower)
                        })
            if conditional_by_slot:
                deduplicated_by_slot = {}
                for slot, rules in sorted(conditional_by_slot.items()):
                    seen_rules = set()
                    unique_rules = []
                    for resolved_rule in rules:
                        rule_key = json.dumps(resolved_rule, sort_keys=True, ensure_ascii=True)
                        if rule_key in seen_rules:
                            continue
                        seen_rules.add(rule_key)
                        unique_rules.append(resolved_rule)
                    deduplicated_by_slot[slot] = unique_rules
                item['conditionalAttachmentsBySlot'] = deduplicated_by_slot

        if any(key in item for key in (
            'allowedParents', 'deniedParents', 'allowedAttachments', 'deniedAttachments',
            'allowedAttachmentsBySlot', 'deniedAttachmentsBySlot', 'conditionalAttachmentsBySlot'
        )):
            constrained_items += 1

    return constrained_items

def parse_array_value(raw_val):
    raw = raw_val.strip().strip('{}')
    if not raw:
        return []
    items = []
    for part in raw.split(','):
        part = part.strip()
        if not part:
            continue
        if part.startswith('"') and part.endswith('"'):
            items.append(part[1:-1])
        elif part.isdigit():
            items.append(int(part))
        else:
            try:
                items.append(float(part))
            except ValueError:
                items.append(part.strip('"'))
    return items

def extract_properties(body):
    props = {}
    for m in re.finditer(r'([A-Za-z0-9_]+)\[\]\s*=\s*\{([^}]*)\};', body):
        props[m.group(1)] = parse_array_value(m.group(2))

    clean_body = re.sub(r'[A-Za-z0-9_]+\[\]\s*=\s*\{[^}]*\};', '', body)
    clean_body = re.sub(r'class\s+[A-Za-z0-9_]+(?:\s*:\s*[A-Za-z0-9_]+)?\s*\{[^}]*\}', '', clean_body)
    for m in re.finditer(r'([A-Za-z0-9_]+)\s*=\s*([^;]+);', clean_body):
        k = m.group(1)
        v = m.group(2).strip()
        if v.startswith('"') and v.endswith('"'):
            v = v[1:-1]
        elif v.isdigit():
            v = int(v)
        else:
            try:
                v = float(v)
            except Exception:
                pass
        props[k] = v
    return props

def load_stringtables(smpz_dir):
    strings = {}
    csv_files = glob.glob(os.path.join(smpz_dir, '**', '*.csv'), recursive=True)
    for cf in csv_files:
        try:
            with open(cf, 'r', encoding='utf-8-sig', errors='ignore') as f:
                reader = csv.reader(f)
                for row in reader:
                    if len(row) >= 2 and row[0].strip():
                        key = row[0].strip().lstrip('$')
                        orig = row[1].strip().strip('"')
                        eng = row[2].strip().strip('"') if len(row) > 2 and row[2].strip() else orig
                        strings[key] = eng if eng else orig
        except Exception:
            pass
    return strings

def load_asset_files(assets_dir):
    file_map = {}
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                base = os.path.splitext(f)[0].lower()
                file_map[base] = f"assets/{f}"
    return file_map

def load_model_files(models_dir):
    model_map = {}
    if os.path.exists(models_dir):
        for root, _, files in os.walk(models_dir):
            for f in files:
                if f.lower().endswith(('.glb', '.gltf')):
                    rel_path = os.path.relpath(os.path.join(root, f), PROJECT_ROOT).replace('\\', '/')
                    base = os.path.splitext(f)[0].lower()
                    model_map[base] = rel_path
                    clean_key = re.sub(r'[^a-z0-9]', '', base)
                    if clean_key and clean_key != base:
                        model_map[clean_key] = rel_path
    return model_map

def match_model_for_item(item_id, item_name, model_map, sec_type='weapon'):
    if not model_map:
        return None

    id_lower = item_id.lower()
    if id_lower in model_map:
        return model_map[id_lower]

    id_cleaned = re.sub(r'^(smpz_weapon_|smpz_gear_|smpz_optics_|smpz_attachments_|smpz_)', '', id_lower)
    if id_cleaned in model_map:
        return model_map[id_cleaned]

    clean_alphanum = re.sub(r'[^a-z0-9]', '', id_cleaned)
    if clean_alphanum in model_map:
        return model_map[clean_alphanum]

    if sec_type == 'weapon':
        for key, path in model_map.items():
            if len(key) >= 2:
                pattern = r'^' + re.escape(key) + r'(?:[a-z]|_|$)'
                if re.match(pattern, id_cleaned) or re.match(pattern, clean_alphanum):
                    if key[-1].isdigit() and len(clean_alphanum) > len(key):
                        next_char = clean_alphanum[len(key)]
                        if next_char.isdigit():
                            continue
                    return path

        if item_name:
            name_lower = item_name.lower()
            name_words = re.findall(r'[a-z0-9]+', name_lower)
            for w in name_words:
                if w in model_map and len(w) >= 2:
                    return model_map[w]
                for key, path in model_map.items():
                    if len(key) >= 2:
                        pattern = r'^' + re.escape(key) + r'(?:[a-z]|_|$)'
                        if re.match(pattern, w):
                            if key[-1].isdigit() and len(w) > len(key) and w[len(key)].isdigit():
                                continue
                            return path

    return None

# ---------------------------------------------------------------------------
# CONFIG, CACHE & METADATA
# ---------------------------------------------------------------------------
def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_config(cfg):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[설정] 저장 실패: {e}")

def load_google_translation_cache():
    cache_path = os.path.join(CACHE_DIR, 'google_translation_cache.json')
    if os.path.exists(cache_path):
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_google_translation_cache(cache):
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_path = os.path.join(CACHE_DIR, 'google_translation_cache.json')
    try:
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump(cache, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[캐시] 저장 실패: {e}")

def load_metadata(filepath):
    if not os.path.exists(filepath):
        return {}
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        m = re.search(r'(?:const\s+metadata\s*=\s*|export\s+default\s+)(\{.*?\});', text, re.DOTALL)
        if m:
            return json.loads(m.group(1))
        return json.loads(text)
    except Exception as e:
        print(f"[메타데이터] 로드 실패: {e}")
        return {}

def _merge_manual_fields(item_obj, meta_dict, fallback_ids=None):
    iid = item_obj.get('id')
    keys_to_check = [iid] if iid else []
    if fallback_ids:
        keys_to_check.extend([fid for fid in fallback_ids if fid and fid != iid])

    for kid in keys_to_check:
        if kid not in meta_dict:
            continue
        meta = meta_dict[kid]
        for fld in ('description', 'manufacturer', 'manufacturerLogo', 'manufacturerUrl', 'image', 'images'):
            if fld in meta and meta[fld] and not item_obj.get(fld):
                item_obj[fld] = meta[fld]
        if 'stats' in meta and isinstance(meta['stats'], dict):
            item_obj.setdefault('stats', {}).update(meta['stats'])

def is_valid_smpz_dir(path):
    if not path or not os.path.isdir(path):
        return False
    has_subpkg = any(os.path.exists(os.path.join(path, pkg)) for pkg in ['SMPZ_Weapons', 'SMPZ_More_Weapons', 'SMPZ_More_Attachment', 'SMPZ_Gears'])
    if has_subpkg:
        return True
    cpp_files = glob.glob(os.path.join(path, '**', '*.cpp'), recursive=True)
    return len(cpp_files) > 0

def prompt_folder_dialog(title="SMPZ 모드팩 루트 디렉토리를 선택해주세요", initial_dir=None):
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()
        root.attributes('-topmost', True)
        selected = filedialog.askdirectory(title=title, initialdir=initial_dir or PROJECT_ROOT)
        root.destroy()
        return selected if selected else None
    except Exception as e:
        print(f"[GUI] 폴더 선택 다이얼로그 실행 실패: {e}")
        return None

def resolve_smpz_dir(cli_dir=None, force_select=False, no_gui=False):
    config = load_config()

    if cli_dir:
        if is_valid_smpz_dir(cli_dir):
            config['smpz_dir'] = os.path.abspath(cli_dir)
            save_config(config)
            return os.path.abspath(cli_dir)
        else:
            print(f"[경고] 지정된 경로가 유효한 SMPZ 모드팩 디렉토리가 아닙니다: {cli_dir}")

    if force_select and not no_gui:
        print("[*] SMPZ 모드팩 폴더 선택 창을 엽니다...")
        selected = prompt_folder_dialog(initial_dir=config.get('smpz_dir'))
        if selected and is_valid_smpz_dir(selected):
            config['smpz_dir'] = os.path.abspath(selected)
            save_config(config)
            return os.path.abspath(selected)
        elif selected:
            print(f"[경고] 선택한 폴더에 SMPZ 모드 파일이 없습니다: {selected}")
        else:
            print("[*] 폴더 선택이 취소되었습니다.")

    saved_dir = config.get('smpz_dir')
    if saved_dir and is_valid_smpz_dir(saved_dir):
        return saved_dir

    env_dir = os.environ.get('SMPZ_DIR') or os.environ.get('SMPZ_MOD_PATH')
    if env_dir and is_valid_smpz_dir(env_dir):
        config['smpz_dir'] = os.path.abspath(env_dir)
        save_config(config)
        return os.path.abspath(env_dir)

    candidates = [
        os.path.join(PROJECT_ROOT, 'SMPZ'),
        os.path.join(PROJECT_ROOT, '..', 'SMPZ'),
        os.path.join(PROJECT_ROOT, 'mod_source', 'SMPZ'),
    ]
    for cand in candidates:
        if is_valid_smpz_dir(cand):
            config['smpz_dir'] = os.path.abspath(cand)
            save_config(config)
            return os.path.abspath(cand)

    if not no_gui:
        print("[*] SMPZ 모드팩 경로를 찾을 수 없어 폴더 선택 창을 엽니다...")
        selected = prompt_folder_dialog()
        if selected and is_valid_smpz_dir(selected):
            config['smpz_dir'] = os.path.abspath(selected)
            save_config(config)
            return os.path.abspath(selected)
        elif selected:
            print(f"[경고] 선택한 폴더에 SMPZ 모드 파일이 없습니다: {selected}")

    return None

# ---------------------------------------------------------------------------
# INHERITANCE & SCOPE RESOLUTION
# ---------------------------------------------------------------------------
def get_scope(cname, all_classes):
    curr = cname
    visited = set()
    while curr and curr not in visited:
        visited.add(curr)
        if curr in all_classes:
            props = all_classes[curr].get('props', {})
            if 'scope' in props:
                try:
                    return int(props['scope'])
                except (ValueError, TypeError):
                    pass
            curr = all_classes[curr].get('parent')
        else:
            break
    return 0

def get_inherited_props(cname, all_classes):
    curr = cname
    visited = set()
    chain = []
    while curr and curr not in visited and curr in all_classes:
        visited.add(curr)
        chain.append(curr)
        curr = all_classes[curr].get('parent')
    merged = {}
    for c in reversed(chain):
        merged.update(all_classes[c].get('props', {}))
    return merged

# ---------------------------------------------------------------------------
# CATEGORY CLASSIFIERS
# ---------------------------------------------------------------------------
def classify_weapon(wid, props, src_file):
    wt = (props.get('weaponType') or '').lower()
    src = src_file.lower().replace('\\', '/')
    if wt == 'assaultrifle' or '/assaultrifle/' in src:
        return 'assault_rifle'
    if wt == 'sniperrifle' or '/sniperrifle/' in src:
        return 'sniper_rifle'
    if wt == 'smg' or '/smg/' in src:
        return 'submachine_gun'
    if wt == 'shotgun' or '/shotgun/' in src:
        return 'shotgun'
    if wt == 'pistol' or '/pistol/' in src:
        return 'pistol'
    if wt == 'lmg' or '/lmg/' in src:
        return 'light_machine_gun'
    if wt == 'grenadelauncher' or '/launcher/' in src or 'm32' in src:
        return 'grenade_launcher'
    return None

def is_excluded_weapon_variant(cid, all_classes):
    if cid == 'SMPZ_Weapon_Tagilla_Hammer' or cid == 'SMPZ_Weapon_KRISS_Vector_FDE':
        return True
    m = _WEAPON_VARIANT_RE.search(cid)
    if not m:
        return False
    base_name = cid[:m.start()]
    parent = all_classes[cid].get('parent')
    parent_is_scope2 = (get_scope(parent, all_classes) == 2) if parent else False
    base_exists_scope2 = (get_scope(base_name, all_classes) == 2)
    if parent_is_scope2 or base_exists_scope2:
        return True
    return False

def classify_gear(cid):
    cid_lower = cid.lower()
    if cid_lower.startswith(('smpz_backpack_', 'smpz_pack_')) or any(k in cid_lower for k in ['backpack', 'pack_', 'rush100', 'rush24', 'rush72', 'bag_']):
        return 'backpack'
    if cid_lower.startswith(('smpz_chestrig_', 'smpz_cr_')):
        return 'chest_rig'
    if cid_lower.startswith('smpz_mask_'):
        return 'mask'
    if any(k in cid_lower for k in ['visor', 'helmetplate', 'helmetaventail', 'helmetstrap', 'helmetmandible', 'helmetvisor', 'mandible']):
        return 'helmet_attachment'
    if any(k in cid_lower for k in ['helmet', 'altyn', 'maska', 'kiver']):
        return 'helmet'
    if any(k in cid_lower for k in ['mask', 'gasmask', 'balaclava']):
        return 'mask'
    if any(k in cid_lower for k in ['chestrig', 'cr_']):
        return 'chest_rig'
    if 'vest' in cid_lower or 'armor' in cid_lower:
        full_body_keywords = ['6b13', '6b2', '6b23', '6b43', '6b45', 'zhuk', 'gladiators', 'redutm', 'redutt5', 'iotv', 'thor', 'sieger', 'mmac', 'tasmanian_tiger', 'lbt6094a']
        if any(k in cid_lower for k in full_body_keywords):
            return 'full_body_armor'
        return 'plate_carrier'
    return None

def is_preset_magazine(cname, all_classes):
    if not cname.startswith('SMPZ_Mag_'):
        return False
    direct_props = all_classes.get(cname, {}).get('props', {})
    direct_scope = direct_props.get('scope')
    if direct_scope is None or str(direct_scope) != '2':
        return True
    parent = all_classes.get(cname, {}).get('parent')
    parent_direct_scope = all_classes.get(parent, {}).get('props', {}).get('scope')
    if parent_direct_scope in (2, '2') and 'displayName' not in direct_props:
        return True
    return False

def is_magnified_optic(mag_val):
    if not mag_val:
        return False
    if isinstance(mag_val, (int, float)):
        return mag_val > 1.05
    if isinstance(mag_val, list):
        return any(isinstance(x, (int, float)) and x > 1.05 for x in mag_val)
    if isinstance(mag_val, str):
        nums = [float(x) for x in re.findall(r'\d+(?:\.\d+)?', mag_val)]
        return any(x > 1.05 for x in nums)
    return False

def classify_attachment(aid, props, src_file, mag_val=None):
    aid_lower = aid.lower()
    src_lower = src_file.lower().replace('\\', '/')
    inv = [str(s).lower() for s in (props.get('inventorySlot') or [])]
    inv_str = ' '.join(inv)

    if aid.startswith('SMPZ_Mag_') or '/magazine/' in src_lower or 'magazine' in inv:
        return 'magazine'

    if aid.startswith(('SMPZ_Optic', 'SMPZ_Scope', 'SMPZ_Sight')) or '/optics/' in src_lower:
        if 'carryhandle' in aid_lower:
            return 'iron_sight'
        if is_magnified_optic(mag_val):
            return 'optic_scope'
        return 'reflex_sight'

    if aid.startswith('SMPZ_Flashlight') or '/flashlights/' in src_lower:
        return 'tactical_flashlight'

    if aid_lower.startswith(('smpz_lasers_', 'smpz_laser_')) or '/laser/' in src_lower:
        return 'laser_pointer'

    if any(k in aid_lower for k in ['_tubebuffer', '_tubebuff', 'smpz_buffer']) or 'tubebuffer' in inv_str or '/attachments/buffer/' in src_lower:
        return 'buffer_tube'

    if '/pistolgrip/' in src_lower or any(k in aid_lower for k in ['_pistolgrip', 'pistol_grip']) or any('pistolgrip' in s for s in inv):
        if 'cqr_pistolgrip' not in aid_lower and 'cqr47_pistolgrip' not in aid_lower:
            return 'pistol_grip'

    if ('suppressor' in aid_lower or '/suppressor/' in src_lower) and not aid_lower.endswith('_cap'):
        return 'suppressor'

    if any(k in aid_lower for k in ['_muzzlebrake', '_muzzle_device', '_muzzle', '_choke', 'compensator']) or '/muzzle/' in src_lower:
        return 'muzzle_device'

    if any('suppressor' in s for s in inv) and not aid_lower.endswith('_cap'):
        return 'suppressor'

    if any('muzzle' in s or 'adapter' in s for s in inv):
        return 'muzzle_device'

    if (aid.startswith('SMPZ_Bipod') or '/bipod/' in src_lower) and '/mount/' not in src_lower and '/mounts/' not in src_lower:
        return 'bipod'

    if ('/gasblock/' in src_lower or '/gasblocks/' in src_lower or 'gasblock' in aid_lower or any('gasblock' in s for s in inv)) and 'hndgrd' not in aid_lower:
        return 'gas_block'

    if aid.startswith('SMPZ_Charging') or '/charginghandle/' in src_lower or 'charginghandle' in aid_lower or any('charginghandle' in s for s in inv):
        return 'charging_handle'

    if aid.startswith('SMPZ_Trigger') or '/trigger/' in src_lower or 'trigger' in aid_lower or any('trigger' in s for s in inv):
        return 'trigger'

    if aid.startswith('SMPZ_Hammer') or '/hammer/' in src_lower or 'hammer' in aid_lower or any('hammer' in s for s in inv):
        return 'hammer'

    if aid.startswith('SMPZ_Barrel') or '/barrel/' in src_lower or 'barrel' in aid_lower or 'm203' in aid_lower or any('barrel' in s or 'm203' in s for s in inv):
        return 'barrel'

    if '/mounts/' in src_lower or '/mount/' in src_lower or '/sidemount/' in src_lower or 'mount' in aid_lower or '_riser' in aid_lower or 'rail_panel' in aid_lower:
        return 'mount'

    if '/receiver/' in src_lower or any(k in aid_lower for k in ['_receiver', '_dustcover', '_cover', '_slide']) or any('receiver' in s or 'dustcover' in s or 'glockslide' in s for s in inv):
        return 'receiver'

    if '/hndgrd/' in src_lower or any(k in aid_lower for k in ['_hndgrd', '_handguard', 'smpz_handguard']) or any('handguard' in s for s in inv):
        return 'handguard'

    if 'cqr_pistolgrip' in aid_lower or 'cqr47_pistolgrip' in aid_lower:
        return 'buttstock'

    if '/grips/' in src_lower or 'foregrip' in aid_lower or any('grip' in s for s in inv):
        return 'foregrip'

    if '/buttstock/' in src_lower or any(k in aid_lower for k in ['_buttstock', '_stock', 'smpz_stock', 'smpz_buttstock']) or any('stock' in s or 'chassis' in s for s in inv):
        return 'buttstock'

    if 'carryhandle' in aid_lower or '/ironsights/' in src_lower or any(k in aid_lower for k in ['_frontsight', '_rearsight', 'front_sight', 'rear_sight']) or any('frontsight' in s or 'rearsight' in s for s in inv):
        return 'iron_sight'

    if 'optic' in aid_lower or 'sight' in aid_lower or any('optic' in s for s in inv):
        if is_magnified_optic(mag_val):
            return 'optic_scope'
        return 'reflex_sight'

    return None

# ---------------------------------------------------------------------------
# SUB-CATEGORY CLASSIFIERS
# ---------------------------------------------------------------------------
def classify_mount_type(item_obj):
    att = [s.lower() for s in item_obj.get('attachmentSlots', [])]
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    item_id = item_obj.get('id', '').lower()
    name = item_obj.get('name', '').lower()

    if any('buffer' in s or 'stock' in s for s in att) or \
       any('buttstock' in s for s in inv) or \
       'stock_adapter' in item_id or 'buffer_adapter' in item_id:
        return 'stock_adapter'

    if any('bipod' in s for s in att) or 'bipod_adapter' in item_id or 'bipod' in name:
        return 'bipod_adapter'

    has_optic_slot = any('optic' in s or 'aimpoint' in s or 'ffp3' in s for s in att)
    if not has_optic_slot and (any('flashlight' in s or 'wf501b' in s for s in att) or 'ring_mount' in item_id or 'ring mount' in name or 'sprut' in name):
        return 'flashlight_mount'

    if not has_optic_slot and ('cover' in item_id or 'panel' in item_id or 'panel' in name or 'grip' in att):
        return 'rail_panel'

    return 'scope_mount'

def classify_ironsight_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    item_id = item_obj.get('id', '').lower()
    name = item_obj.get('name', '').lower()

    if 'carry handle' in name or 'carryhandle' in item_id:
        return 'carry_handle'
    if any('front' in s for s in inv) or 'frontsight' in item_id or 'front sight' in name:
        return 'front_sight'
    return 'rear_sight'

def classify_pistolgrip_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    item_id = item_obj.get('id', '').lower()
    name = item_obj.get('name', '').lower()

    if any('arpistolgrip' in s for s in inv) or 'ar15_' in item_id or 'm4_' in item_id:
        return 'ar15_m4'
    if any('akpistolgrip' in s for s in inv) or 'ak_' in item_id or 'akm_' in item_id or 'ak74_' in item_id or 'ak-' in name or 'akm' in name or 'ak ' in name:
        return 'ak'
    return 'other'

def classify_dotsight_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    micro_slots = {'pistoloptics', 'nomountrmroptics', 'aimpointacro', 'ffp3'}
    if any(s in micro_slots for s in inv):
        return 'micro_dot'
    if any('weaponopticsak' in s for s in inv) and not any(s == 'weaponoptics' for s in inv):
        return 'dovetail'
    return 'picatinny'

def classify_helmet_attachment_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    item_id = item_obj.get('id', '').lower()

    if any('visor' in s for s in inv) or 'visor' in item_id:
        return 'visor'
    if any('helmetplate' in s for s in inv) or 'slaap' in item_id or 'helmetplate' in item_id:
        return 'armor_plate'
    if any(s in ('mandible', 'afmlokchops') for s in inv) or 'mandible' in item_id or 'chops' in item_id:
        return 'mandible'
    return 'other'

def classify_foregrip_type(item_obj, all_classes):
    item_id = item_obj.get('id', '')
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]

    curr = item_id
    chain = []
    visited = set()
    while curr and curr not in visited and curr in all_classes:
        visited.add(curr)
        chain.append(curr)
        curr = all_classes[curr].get('parent')

    item_id_lower = item_id.lower()

    if any('mlok' in c.lower() for c in chain) or '_mlok_' in item_id_lower:
        return 'mlok'
    if any('keymod' in c.lower() for c in chain) or '_keymod_' in item_id_lower:
        return 'keymod'
    if any('urxstopper' in s for s in inv) or 'stopper' in item_id_lower:
        return 'urx'
    return 'picatinny'

def classify_receiver_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    item_id = item_obj.get('id', '').lower()
    name = item_obj.get('name', '').lower()

    if any('m4receiver' in s for s in inv) or 'ar15_' in item_id:
        return 'ar15_upper'
    if any('glockslide' in s for s in inv) or 'glock_' in item_id or 'slide' in name:
        return 'pistol_slide'
    if any('akcover' in s or 'aks74u' in s for s in inv) or 'ak_' in item_id or 'dust cover' in name:
        return 'ak_dustcover'
    return 'other'

def classify_stock_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    item_id = item_obj.get('id', '').lower()
    name = item_obj.get('name', '').lower()

    if any(s in ('chassis', 'mosinstock', 'sksstock', 'm1achassis', 'cncchassis', 'cncstock') for s in inv) or 'chassis' in name or 'monte carlo' in name or 'mod*x' in name:
        return 'chassis'
    if any('ak' in s or 'rpk' in s for s in inv) or ('cqr47' in item_id) or 'akzenit' in item_id:
        return 'ak'
    if any(s in ('arbuttstock', 'arbuttstocksecond', 'weaponbuttstockm4', 'arbuffer', 'prsstock', 'umsbuttstock') for s in inv) or ('cqr' in item_id and 'cqr47' not in item_id) or 'ar-15' in name or 'ar 15' in name:
        return 'buffer_tube'
    return 'custom'

def classify_muzzle_type(item_obj):
    inv = [s.lower() for s in item_obj.get('inventorySlots', [])]
    name = item_obj.get('name', '').lower()

    if 'multi-caliber' in name or 'multi_caliber' in name or len(inv) >= 3 or (('762suppressor' in inv or 'spearsuppressor' in inv) and 'weaponmuzzlem4' in inv):
        return 'multi_caliber'

    big_slots = {'338muzzle', 'm107a1muzzle', 'xm109muzzle', '12gamuzzle', '300winsuppressor', 'm200muzzle'}
    ak_slots = {'weaponmuzzleakm', 'weaponmuzzleak74', 'cncadapter', '308adapter', '366muzzle', 'pkmsuppressor', 'rpdmuzzle'}
    special_slots = {'glocksuppressor', 'm1911ao', 'mp7suppressor', 'asvalmod4jb', 'asvalmod4muzzle', 'p90suppressor'}

    if any(s in big_slots for s in inv) or '.338' in name or 'm82' in name or '12ga' in name or 'xm109' in name or 'm200' in name:
        return 'heavy_shotgun'
    if any(s in ak_slots for s in inv) or 'akm' in name or 'ak ' in name or 'zenit dtk' in name or 'pkm' in name or 'rpd' in name or 'vpo' in name:
        return 'ak'
    if any(s in special_slots for s in inv) or 'glock' in name or '1911' in name or 'mp7' in name or 'as val' in name or 'p90' in name:
        return 'pistol_smg_other'
    if any(s in ('762suppressor', 'spearsuppressor') for s in inv) or '7.62' in name or 'ar-10' in name or 'm110' in name:
        return '762_ar10'
    return '556_ar15'

def classify_suppressor_type(item_obj):
    raw_slots = item_obj.get('inventorySlots', [])
    if isinstance(raw_slots, str):
        inv = [raw_slots.lower()]
    else:
        inv = [s.lower() for s in raw_slots]
    name = item_obj.get('name', '').lower()

    if 'multi-caliber' in name or 'hybrid 46' in name or len(inv) >= 4 or (('762suppressor' in inv or 'spearsuppressor' in inv) and 'weaponmuzzlem4' in inv):
        return 'multi_caliber'

    big_slots = {'338muzzle', '338suppressor', 'm107a1muzzle', 'm200muzzle', '12gamuzzle', '300winsuppressor', 'mosinsuppressor', 'sv98suppressor', '308suppressor', 'xm109muzzle', 'ash12suppressor'}
    if any(s in big_slots for s in inv) or '12ga' in name or '.338' in name or '.50' in name or '.408' in name or 'mosin' in name or 'sv-98' in name or 'msr' in name or 'xm109' in name or 'ash-12' in name or 'ash12' in name:
        return 'heavy_shotgun'

    smg_slots = {'glocksuppressor', 'glocksuppressorsecond', '45acpsuppressor', 'mp7suppressor', 'p90suppressor', 'mpxsd', 'smgsuppressor', 'fssuppressor', 'mp9suppressor', 'sr1mpsuppressor', 'sr2msuppressor', 'ucpsuppressor'}
    if any(s in smg_slots for s in inv) or 'vityaz' in name or 'glock' in name or 'osprey' in name or 'p90' in name or 'mp7' in name or 'mpx' in name or 'illusion' in name or 'five-seven' in name or 'five seven' in name or 'sfn-57' in name or 'mp9' in name or 'sr-1mp' in name or 'sr1mp' in name or 'sr-2m' in name or 'sr2m' in name or 'ucp' in name:
        return 'pistol_smg_other'

    ak_slots = {'weaponmuzzleakm', 'weaponmuzzleak74', 'weaponmuzzleak', 'aksuppressor', '366muzzle', 'pkmsuppressor', 'pkpsuppressor', 'ak12muzzle', 'ak308muzzle', '762x54suppressor', 'sr3msuppressor'}
    if any(s in ak_slots for s in inv) or 'pbs-' in name or 'wafflemaker' in name or 'rotor 43' in name or 'akm' in name or 'ak-74' in name or 'ak-12' in name or 'ak12' in name or 'ak-308' in name or 'ak308' in name or 'pkm' in name or 'pkp' in name or 'sr-3m' in name or 'sr3m' in name or '7.62x54' in name:
        return 'ak'

    if '5.56' in name or '556' in name or 'weaponmuzzlem4' in inv or 'augmuzzle' in inv:
        return '556_ar15'

    rifle_762_slots = {'762suppressor', 'spearsuppressor', 'mcxsuppressor'}
    if any(s in rifle_762_slots for s in inv) or '7.62' in name or 'sr-25' in name or 'huxwrx' in name or 'srd762' in name or 'm110' in name or 'ar-10' in name:
        return '762_ar10'

    return '556_ar15'

def extract_weapon_stats(cname, props, all_classes):
    stats = {}
    rec = props.get('recoilModifier')
    if rec and isinstance(rec, list) and len(rec) > 0:
        try:
            stats['recoil'] = round(float(rec[0]) * 100)
        except (ValueError, TypeError):
            pass

    sway = props.get('swayModifier')
    if sway and isinstance(sway, list) and len(sway) > 0:
        try:
            stats['sway'] = round(sum(float(x) for x in sway) / len(sway) * 100)
        except (ValueError, TypeError):
            pass

    aim = props.get('aimSpeedModifier')
    if aim and isinstance(aim, list) and len(aim) > 0:
        try:
            stats['ergonomics'] = round((1.0 - float(aim[0])) * 100)
        except (ValueError, TypeError):
            pass

    disp = props.get('dispersion')
    if disp is not None:
        try:
            stats['accuracy'] = round(float(disp) * (180.0 / math.pi) * 60.0, 2)
        except (ValueError, TypeError):
            stats['accuracy'] = 6.88
    else:
        stats['accuracy'] = 6.88

    spd = props.get('initSpeedMultiplier', 1.0)
    try:
        stats['velocityMultiplier'] = round(float(spd), 3)
    except (ValueError, TypeError):
        stats['velocityMultiplier'] = 1.0

    return stats

def _damage_coefficient_to_protection(raw_value):
    try:
        coefficient = float(raw_value)
    except (ValueError, TypeError):
        return None
    if coefficient <= 0:
        return 0
    return max(0, min(100, round((1.0 - coefficient) * 100)))


def _extract_armor_protection(body, damage_type, channel):
    damage_match = re.search(
        rf'class\s+{re.escape(damage_type)}\b[^{{]*\{{([^{{}}]*(?:\{{[^{{}}]*\}}[^{{}}]*)*)\}}',
        body
    )
    if not damage_match:
        return None
    channel_match = re.search(
        rf'class\s+{re.escape(channel)}\b[^{{]*\{{[^}}]*damage\s*=\s*([^;]+);',
        damage_match.group(1)
    )
    if not channel_match:
        return None
    return _damage_coefficient_to_protection(channel_match.group(1))


def _inherits_config_class(cname, target, all_classes):
    curr = cname
    target_lower = target.lower()
    visited = set()
    while curr and curr.lower() not in visited:
        if curr.lower() == target_lower:
            return True
        visited.add(curr.lower())
        curr = all_classes.get(curr, {}).get('parent')
    return False


def _uses_projectile_protection(cname, cat, all_classes):
    if cat in ('helmet', 'helmet_attachment', 'full_body_armor', 'plate_carrier'):
        return True
    if cat == 'mask':
        return _inherits_config_class(cname, 'SMPZ_Balistic_Mask_Base', all_classes)
    return False


def extract_gear_stats(cname, props, all_classes, cat):
    stats = {}
    curr = cname
    visited = set()
    hitpoints = None
    projectile_health_prot = None
    projectile_blood_prot = None
    projectile_shock_prot = None
    melee_health_prot = None
    melee_blood_prot = None
    melee_shock_prot = None

    while curr and curr not in visited and curr in all_classes:
        visited.add(curr)
        c_info = all_classes[curr]
        body = c_info.get('body', '')

        if hitpoints is None:
            m_hp = re.search(r'class\s+Health\b[^{]*\{[^}]*hitpoints\s*=\s*([^;]+);', body)
            if m_hp:
                try:
                    hitpoints = int(float(m_hp.group(1)))
                except (ValueError, TypeError):
                    pass

        if projectile_health_prot is None:
            projectile_health_prot = _extract_armor_protection(body, 'Projectile', 'Health')
        if projectile_blood_prot is None:
            projectile_blood_prot = _extract_armor_protection(body, 'Projectile', 'Blood')
        if projectile_shock_prot is None:
            projectile_shock_prot = _extract_armor_protection(body, 'Projectile', 'Shock')
        if melee_health_prot is None:
            melee_health_prot = _extract_armor_protection(body, 'Melee', 'Health')
        if melee_blood_prot is None:
            melee_blood_prot = _extract_armor_protection(body, 'Melee', 'Blood')
        if melee_shock_prot is None:
            melee_shock_prot = _extract_armor_protection(body, 'Melee', 'Shock')

        curr = c_info.get('parent')

    has_projectile_protection = any(value is not None for value in (
        projectile_health_prot, projectile_blood_prot, projectile_shock_prot
    ))
    has_melee_protection = any(value is not None for value in (
        melee_health_prot, melee_blood_prot, melee_shock_prot
    ))
    uses_projectile_protection = _uses_projectile_protection(cname, cat, all_classes)

    if has_projectile_protection or has_melee_protection:
        stats['bulletDamageProtection'] = (
            projectile_health_prot if uses_projectile_protection and projectile_health_prot is not None else 0
        )
        selected_blood_prot = projectile_blood_prot if uses_projectile_protection else melee_blood_prot
        selected_shock_prot = projectile_shock_prot if uses_projectile_protection else melee_shock_prot
        stats['bloodDamageProtection'] = selected_blood_prot if selected_blood_prot is not None else 0
        stats['shockDamageProtection'] = selected_shock_prot if selected_shock_prot is not None else 0
    elif cat in ('chest_rig', 'mask'):
        stats['bulletDamageProtection'] = 0
        stats['bloodDamageProtection'] = 0
        stats['shockDamageProtection'] = 0

    if melee_health_prot is not None:
        stats['healthDamageProtection'] = melee_health_prot

    if hitpoints is not None:
        stats['hitpoints'] = hitpoints

    w_val = props.get('weight')
    if w_val is not None:
        try:
            stats['weight'] = int(float(w_val) / 1000)
        except (ValueError, TypeError):
            pass

    return stats

def extract_attachment_stats(cname, props, all_classes, cat, mag_val=None):
    stats = {}
    rec = props.get('recoilModifier')
    if rec and isinstance(rec, list) and len(rec) > 0:
        try:
            val = round((float(rec[0]) - 1.0) * 100)
            if val != 0:
                stats['recoil'] = int(val)
        except (ValueError, TypeError):
            pass

    sway = props.get('swayModifier')
    if sway and isinstance(sway, list) and len(sway) > 0:
        try:
            val = round((sum(float(x) for x in sway) / len(sway) - 1.0) * 100)
            if val != 0:
                stats['sway'] = int(val)
        except (ValueError, TypeError):
            pass

    if cat == 'magazine' or cname.startswith('SMPZ_Mag_'):
        cnt = props.get('count')
        if cnt is not None:
            try:
                stats['capacity'] = int(cnt)
            except (ValueError, TypeError):
                pass

    w_val = props.get('weight')
    if w_val is not None:
        try:
            stats['weight'] = int(float(w_val))
        except (ValueError, TypeError):
            pass

    if 'Flashlight' in cname or cat == 'tactical_flashlight':
        desc_short = str(props.get('descriptionShort', ''))
        m_dist = re.search(r'(?:Max light distance|distance)[:\s]*(\d+)\s*m', desc_short, re.I)
        if m_dist:
            stats['lightDistance'] = int(m_dist.group(1))

    if cat in ('optic_scope', 'reflex_sight') and mag_val:
        stats['magnification'] = mag_val

    return stats

def clean_item_stats(stats):
    if not isinstance(stats, dict):
        return stats
    cleaned = {}
    for k, v in stats.items():
        if v is None:
            continue
        if k == 'capacity':
            m = re.search(r'\d+', str(v))
            if m:
                cleaned[k] = int(m.group(0))
        elif k == 'accuracy':
            m = re.search(r'[\d.]+', str(v))
            if m:
                try:
                    cleaned[k] = float(m.group(0))
                except ValueError:
                    pass
        elif k == 'weight':
            m = re.search(r'\d+', str(v))
            if m:
                cleaned[k] = int(m.group(0))
        elif k == 'lightDistance':
            m = re.search(r'\d+', str(v))
            if m:
                cleaned[k] = int(m.group(0))
        elif k in ('recoil', 'sway', 'ergonomics', 'bulletDamageProtection', 'healthDamageProtection', 'bloodDamageProtection', 'shockDamageProtection', 'hitpoints'):
            m = re.search(r'-?\d+', str(v).strip())
            if m:
                try:
                    cleaned[k] = int(m.group(0))
                except ValueError:
                    cleaned[k] = v
            else:
                cleaned[k] = v
        elif k == 'velocityMultiplier':
            try:
                cleaned[k] = float(v)
            except (ValueError, TypeError):
                cleaned[k] = v
        elif k == 'magnification':
            if isinstance(v, list):
                cleaned[k] = [int(x) if isinstance(x, (int, float)) and float(x).is_integer() else (float(x) if isinstance(x, (int, float)) else x) for x in v]
            elif isinstance(v, (int, float)):
                cleaned[k] = [int(v) if float(v).is_integer() else float(v)]
            elif isinstance(v, str):
                nums = [float(x) for x in re.findall(r'\d+(?:\.\d+)?', v)]
                if len(nums) == 1:
                    cleaned[k] = [int(nums[0]) if nums[0].is_integer() else nums[0]]
                elif len(nums) >= 2:
                    cleaned[k] = [int(nums[0]) if nums[0].is_integer() else nums[0], int(nums[1]) if nums[1].is_integer() else nums[1]]
                else:
                    cleaned[k] = v
            else:
                cleaned[k] = v
        else:
            cleaned[k] = v
    return cleaned

def extract_optic_magnification(item_id, all_classes):
    props = get_inherited_props(item_id, all_classes)
    mag_mult_raw = props.get('magnifierMultiplier')
    if mag_mult_raw:
        try:
            val = float(mag_mult_raw)
            if val > 0:
                mag_val = round(1.0 / val)
                return [int(mag_val)]
        except Exception:
            pass

    curr = item_id
    visited = set()
    oi_body = None
    while curr and curr not in visited and curr in all_classes:
        visited.add(curr)
        body = all_classes[curr].get('body', '')
        if 'class OpticsInfo' in body:
            m = re.search(r'\bclass\s+OpticsInfo\b[^{]*\{', body)
            if m:
                start_idx = m.end() - 1
                depth = 1
                i = start_idx + 1
                n = len(body)
                while i < n and depth > 0:
                    if body[i] == '{': depth += 1
                    elif body[i] == '}': depth -= 1
                    i += 1
                oi_body = body[start_idx+1:i-1]
                break
        curr = all_classes[curr].get('parent')

    if not oi_body:
        return None

    def eval_safe(s):
        cleaned = re.sub(r'[^0-9+\-*/.()]', '', s)
        if not cleaned: return None
        try: return eval(cleaned, {"__builtins__": None}, {})
        except: return None

    def parse_zoom_val(s):
        s = s.strip().strip('"\'')
        if '/' in s:
            parts = s.split('/')
            denom = eval_safe(parts[1])
            if denom and denom > 0:
                return float(denom)
        val = eval_safe(s)
        if val is not None and val > 0:
            if abs(val - 0.5236) < 0.01 or abs(val - 0.3926) < 0.01:
                return 1.0
            if val <= 0.6:
                return round(0.3926 / val, 1) if abs(0.3926 / val - round(0.3926 / val)) < 0.2 else round(0.5236 / val, 1)
            return float(val)
        return 1.0

    dfov_m = re.search(r'discretefov\[\]\s*=\s*\{([^}]+)\};', oi_body, re.IGNORECASE)
    if dfov_m:
        raw_list = [x.strip().strip('"\'') for x in dfov_m.group(1).split(',')]
        zooms = []
        for r in raw_list:
            z = parse_zoom_val(r)
            if z: zooms.append(z)
        if zooms:
            min_z = min(zooms)
            max_z = max(zooms)
            min_num = int(min_z) if min_z.is_integer() else min_z
            max_num = int(max_z) if max_z.is_integer() else max_z
            return [min_num] if min_num == max_num else [min_num, max_num]

    min_m = re.search(r'opticsZoomMin\s*=\s*["\']?([^;"\']+)["\']?;', oi_body)
    max_m = re.search(r'opticsZoomMax\s*=\s*["\']?([^;"\']+)["\']?;', oi_body)
    if min_m and max_m:
        z1 = parse_zoom_val(min_m.group(1))
        z2 = parse_zoom_val(max_m.group(1))
        min_z = min(z1, z2)
        max_z = max(z1, z2)
        min_num = int(min_z) if min_z.is_integer() else min_z
        max_num = int(max_z) if max_z.is_integer() else max_z
        return [min_num] if min_num == max_num else [min_num, max_num]

    return [1]

def normalize_ammo_caliber(raw_str):
    if not raw_str:
        return None
    raw = str(raw_str).lower().replace(' ', '').replace('_', '').replace('-', '')
    raw_lower = str(raw_str).lower()

    if '50ae' in raw or 'actionexpress' in raw:
        return '.50 AE'
    if '50bmg' in raw or '12.7x99' in raw or '12.7x108' in raw or (('50cal' in raw or '.50' in raw_lower) and 'bmg' in raw_lower):
        return '.50 BMG'
    if '12ga' in raw or '12gauge' in raw or '12x70' in raw or '12/70' in raw:
        return '12 Gauge'
    if '127x55' in raw or '12.7x55' in raw_lower or 'sts130' in raw or 'ash12' in raw:
        return '12.7x55mm'
    if '300blk' in raw or '300aac' in raw or '300blackout' in raw or '300whisper' in raw or '300vmax' in raw or '300bcp' in raw:
        return '.300 BLK'
    if '68x51' in raw or '6.8x51' in raw_lower or '277fury' in raw or '277sig' in raw:
        return '6.8x51mm'
    if '366tkm' in raw or '.366' in raw_lower:
        return '.366 TKM'
    if '556x45' in raw or '5.56x45' in raw_lower or '556nato' in raw or '223rem' in raw:
        return '5.56x45mm'
    if '545x39' in raw or '5.45x39' in raw_lower:
        return '5.45x39mm'
    if '762x39' in raw or '7.62x39' in raw_lower:
        return '7.62x39mm'
    if '762x51' in raw or '7.62x51' in raw_lower or '308win' in raw or '.308' in raw_lower:
        return '7.62x51mm'
    if '762x54' in raw or '7.62x54' in raw_lower:
        return '7.62x54mmR'
    if '762x25' in raw or '7.62x25' in raw_lower or 'tokarev' in raw:
        return '7.62x25mm'
    if '9x19' in raw or 'parabellum' in raw or 'luger' in raw:
        return '9x19mm'
    if '9x39' in raw:
        return '9x39mm'
    if '9x18' in raw or 'makarov' in raw:
        return '9x18mm'
    if '9x21' in raw or 'gyurza' in raw:
        return '9x21mm'
    if '45acp' in raw or '.45acp' in raw_lower or '11.43x23' in raw:
        return '.45 ACP'
    if '57x28' in raw or '5.7x28' in raw_lower:
        return '5.7x28mm'
    if '46x30' in raw or '4.6x30' in raw_lower:
        return '4.6x30mm'
    if '338' in raw or 'lapua' in raw:
        return '.338 Lapua'
    if '300win' in raw or '300wm' in raw:
        return '.300 Win'
    if '408ct' in raw or 'cheytac' in raw or 'm200' in raw:
        return '.408 CheyTac'
    if '357' in raw or 'magnum' in raw:
        return '.357 Magnum'
    if '22lr' in raw:
        return '.22 LR'
    if '40mm' in raw or 'grenade' in raw:
        return '40mm'

    return None

def extract_weapon_primary_caliber_from_cpp(item_id, item_obj, props):
    c_name = props.get('caliberName')
    if c_name:
        cal = normalize_ammo_caliber(c_name)
        if cal:
            return [cal]

    b_type = props.get('bulletType')
    if b_type:
        cal = normalize_ammo_caliber(b_type)
        if cal:
            return [cal]

    chamber = props.get('chamberableFrom') or item_obj.get('chamberableFrom', [])
    if chamber:
        cals = []
        for ammo in chamber:
            cal = normalize_ammo_caliber(ammo)
            if cal and cal not in cals:
                cals.append(cal)
        if len(cals) == 1:
            return cals
        elif len(cals) > 1:
            return [cals[0]]

    return []

def extract_weapon_velocity_multiplier(props):
    mult = props.get('initSpeedMultiplier', 1.0)
    try:
        mult = float(mult)
    except (ValueError, TypeError):
        mult = 1.0
    return round(mult, 3)

def enrich_magazine_calibers(weaponsData, attachmentData):
    mag_to_calibers = {}
    for cat, weapons in weaponsData.items():
        for weapon in weapons:
            w_mags = weapon.get('magazines') or []
            w_chamber = weapon.get('chamberableFrom') or []
            w_cals = [normalize_ammo_caliber(a) for a in w_chamber]
            w_cals = [c for c in w_cals if c]

            for m_id in w_mags:
                if m_id not in mag_to_calibers:
                    mag_to_calibers[m_id] = set()
                for c in w_cals:
                    mag_to_calibers[m_id].add(c)

    mag_items = attachmentData.get('magazine') or attachmentData.get('탄창') or []
    for mag in mag_items:
        m_id = mag.get('id', '')
        cals_set = mag_to_calibers.get(m_id, set())

        if not cals_set:
            id_lower = m_id.lower()
            name_lower = str(mag.get('name', '')).lower()
            all_str = f"{id_lower} {name_lower}"

            if any(k in all_str for k in ['stanag', '556', 'ar15', 'pmag_40', 'drumpmag556', 'beta_cmag_556', 'troy_battlemag', 'l5awm']):
                cals_set = {'5.56x45mm', '.300 BLK'}
            elif any(k in all_str for k in ['762x51', '68x51', 'l7awm', 'drum_x25', 'sr25', 'm110', 'kac_steel', '308']):
                cals_set = {'6.8x51mm', '7.62x51mm'}
            elif any(k in all_str for k in ['762x39', 'akms', 'aka16', 'ultimag_762', '6l10', '6p2', 'x47']):
                cals_set = {'7.62x39mm', '.366 TKM'}
            else:
                single_cal = normalize_ammo_caliber(all_str)
                if single_cal:
                    cals_set = {single_cal}

        if cals_set:
            mag['calibers'] = sorted(list(cals_set))

# ---------------------------------------------------------------------------
# DATASET GENERATION PIPELINE
# ---------------------------------------------------------------------------
def build_data_js(smpz_dir, assets_dir=DEFAULT_ASSETS_DIR, models_dir=DEFAULT_MODELS_DIR, metadata_js_path=DEFAULT_METADATA_JS_PATH):
    print("=" * 70)
    print("  SMPZ 모드팩: data.js 독립 클린 빌더")
    print("  (C++ scope=2 기준 단독 빌드 + metadata.js 자동 병합)")
    print("=" * 70)

    # 1. Load Stringtables, Assets, Models, Metadata, and Translation Cache
    str_table = load_stringtables(smpz_dir)
    file_map = load_asset_files(assets_dir)
    model_map = load_model_files(models_dir)
    metadata = load_metadata(metadata_js_path)
    google_cache = load_google_translation_cache()

    print(f"[*] 로컬라이제이션 스트링테이블 {len(str_table)}개 항목 로드 완료.")
    print(f"[*] 에셋 이미지 인덱싱 완료 ({len(file_map)}개 파일): {assets_dir}")
    print(f"[*] 3D 모델 인덱싱 완료 ({len(model_map)}개 키): {models_dir}")
    print(f"[*] 메타데이터 항목 {len(metadata)}개 로드 완료: {metadata_js_path}")
    print(f"[*] 캐시된 구글 번역 {len(google_cache)}개 로드 완료.")

    paintable_classes = parse_paint_recipes(smpz_dir)
    barrel_adjustments_by_class, barrel_recipes = parse_barrel_adjustment_recipes(smpz_dir)

    # 2. Parse C++ Classes across SMPZ packages
    target_dirs = ['SMPZ_Weapons', 'SMPZ_More_Weapons', 'SMPZ_More_Attachment', 'SMPZ_Gears']
    all_classes = {}
    for td in target_dirs:
        p = os.path.join(smpz_dir, td)
        cpp_files = glob.glob(os.path.join(p, '**', '*.cpp'), recursive=True)
        print(f"[*] {td} 파싱 중 ({len(cpp_files)}개 cpp 파일)...")
        for cf in cpp_files:
            cls_map = parse_cpp_file(cf)
            for cname, cinfo in cls_map.items():
                if cname not in all_classes:
                    all_classes[cname] = cinfo
                    all_classes[cname]['props'] = extract_properties(cinfo['body'])
                else:
                    new_props = extract_properties(cinfo['body'])
                    all_classes[cname]['props'].update(new_props)
                    if cinfo.get('parent') and not all_classes[cname].get('parent'):
                        all_classes[cname]['parent'] = cinfo['parent']
                    if len(cinfo['body']) > len(all_classes[cname].get('body', '')):
                        all_classes[cname]['body'] = cinfo['body']
                        all_classes[cname]['source_file'] = cinfo['source_file']

    print(f"[*] 파싱된 고유 클래스 총 {len(all_classes)}개")

    barrel_variants_by_class = build_barrel_variant_data(barrel_recipes, all_classes)

    def get_barrel_fields(class_id):
        variants = []
        for source_variant in barrel_variants_by_class.get(class_id, []):
            variant = dict(source_variant)
            variant['isDefault'] = source_variant['id'] == class_id
            variants.append(variant)

        adjustments = [variant['name'] for variant in variants if not variant['isDefault']]
        return {
            'canAdjustBarrel': class_id in barrel_adjustments_by_class,
            'barrelAdjustments': sort_barrel_adjustments(adjustments),
            'barrelVariants': variants
        }

    # Runtime Enforce Script classes carry the attachment restrictions that
    # config.cpp inventory slot names cannot express.
    runtime_classes, runtime_file_count = parse_dayz_script_classes(smpz_dir)
    runtime_rules = extract_runtime_attachment_rules(runtime_classes)
    print(
        f"[*] 런타임 스크립트 {runtime_file_count}개 파싱 완료: "
        f"클래스 {len(runtime_classes)}개, 장착 제약 클래스 {len(runtime_rules)}개"
    )

    stats_summary = {
        'existing': 0,
        'google_translate': 0,
        'empty': 0,
        'cargo_items': 0,
        'models_linked': 0,
        'slots_linked': 0,
        'protection_items': 0,
        'health_protection_items': 0,
        'optics_magnification': 0,
        'mount_types': 0,
        'ironsight_types': 0,
        'pistolgrip_types': 0,
        'dotsight_types': 0,
        'helmet_types': 0,
        'foregrip_types': 0,
        'receiver_types': 0,
        'stock_types': 0,
        'muzzle_types': 0,
        'suppressor_types': 0,
        'colors_linked': 0,
        'paintable_items': 0,
        'barrel_adjustable_items': 0,
        'runtime_constrained_items': 0
    }

    def resolve_desc(item_obj, props):
        if item_obj.get('description'):
            stats_summary['existing'] += 1
            return
        raw_desc_key = str(props.get('descriptionShort', '')).lstrip('$')
        raw_desc = str_table.get(raw_desc_key, raw_desc_key)
        if not raw_desc or raw_desc.startswith('$STR_') or raw_desc == 'None' or not raw_desc.strip():
            stats_summary['empty'] += 1
            return
        clean_raw = raw_desc.replace('\r\n', ' ').replace('\n', ' ').strip()
        if clean_raw in google_cache:
            item_obj['description'] = google_cache[clean_raw]
            stats_summary['google_translate'] += 1
        else:
            tr = google_translate(clean_raw)
            google_cache[clean_raw] = tr
            item_obj['description'] = tr
            stats_summary['google_translate'] += 1

    # 3. BUILD WEAPONS
    weapons_data = {}
    weapon_scope2 = [c for c in all_classes if c.startswith('SMPZ_Weapon_') and get_scope(c, all_classes) == 2]

    weapon_color_map = {}
    weapon_variant_ids = set()
    for cid in sorted(weapon_scope2):
        if cid == 'SMPZ_Weapon_UCP' or cid == 'SMPZ_Weapon_Tagilla_Hammer':
            continue
        matched = None
        for sfx, color_label in COLOR_SUFFIXES:
            if cid.endswith(sfx):
                matched = (sfx, color_label)
                break
        if not matched:
            continue
        sfx, color_label = matched
        base_cand = cid[:-len(sfx)]
        if base_cand == 'SMPZ_Weapon_KRISS_Vector':
            base_id = 'SMPZ_Weapon_KRISS_Vector_Black'
            if cid == 'SMPZ_Weapon_KRISS_Vector_Black':
                continue
        elif base_cand in all_classes and get_scope(base_cand, all_classes) == 2:
            base_id = base_cand
        else:
            parent = all_classes[cid].get('parent')
            if parent and get_scope(parent, all_classes) == 2 and not any(parent.endswith(s[0]) for s in COLOR_SUFFIXES):
                base_id = parent
            elif base_cand in all_classes:
                base_id = base_cand
            else:
                continue

        if _WEAPON_VARIANT_RE.search(base_id) and ('mm' in base_id or 'Sawedoff' in base_id or 'NoFS' in base_id):
            continue

        if base_id and base_id != cid:
            weapon_variant_ids.add(cid)
            v_props = get_inherited_props(cid, all_classes)
            v_disp_key = str(v_props.get('displayName', '')).lstrip('$')
            v_disp = str_table.get(v_disp_key, cid)
            v_col = extract_color_from_name(v_disp) or color_label
            weapon_color_map.setdefault(base_id, []).append({
                'name': v_col,
                'id': cid,
                'image': file_map.get(cid.lower(), '')
            })

    for cname in sorted(weapon_scope2):
        if is_excluded_weapon_variant(cname, all_classes) or cname in weapon_variant_ids:
            continue
        props = get_inherited_props(cname, all_classes)
        src_file = all_classes[cname].get('source_file', '')
        cat = classify_weapon(cname, props, src_file)
        if not cat:
            continue

        disp_key = str(props.get('displayName', '')).lstrip('$')
        raw_disp_name = str_table.get(disp_key, props.get('displayName', cname))
        disp_name = clean_display_name(raw_disp_name) if cname in weapon_color_map else raw_disp_name

        item_obj = {
            'id': cname,
            'name': disp_name,
            'category': cat,
            'description': '',
        }

        w_stats = extract_weapon_stats(cname, props, all_classes)
        w_val = props.get('weight')
        if w_val is not None:
            try:
                w_stats['weight'] = int(float(w_val))
            except Exception:
                pass
        if w_stats:
            item_obj['stats'] = w_stats

        cs = props.get('itemsCargoSize') or props.get('itemCargoSize')
        if cs and len(cs) >= 2:
            try:
                item_obj['cargoSize'] = [int(cs[0]), int(cs[1])]
                item_obj['cargoSlots'] = int(cs[0]) * int(cs[1])
                stats_summary['cargo_items'] += 1
            except Exception: pass

        isz = props.get('itemSize')
        if isz and len(isz) >= 2:
            try:
                item_obj['itemSize'] = [int(isz[0]), int(isz[1])]
                item_obj['itemSlots'] = int(isz[0]) * int(isz[1])
            except Exception: pass

        for prop_key, obj_key in [('inventorySlot', 'inventorySlots'), ('attachments', 'attachmentSlots'),
                                  ('magazines', 'magazines'), ('chamberableFrom', 'chamberableFrom')]:
            v = props.get(prop_key)
            if v:
                item_obj[obj_key] = v
                if prop_key == 'inventorySlot': stats_summary['slots_linked'] += 1

        w_cals = extract_weapon_primary_caliber_from_cpp(cname, item_obj, props)
        if w_cals: item_obj['calibers'] = w_cals

        modes_arr = props.get('modes')
        if modes_arr and isinstance(modes_arr, list):
            item_obj['modes'] = modes_arr

        m_img = file_map.get(cname.lower())
        if m_img:
            item_obj['image'] = m_img
            item_obj['images'] = [m_img]
        m_mdl = match_model_for_item(cname, disp_name, model_map, sec_type='weapon')
        if m_mdl:
            item_obj['model'] = m_mdl
            stats_summary['models_linked'] += 1

        is_base_paintable = cname in paintable_classes
        base_barrel_fields = get_barrel_fields(cname)
        if cname in weapon_color_map:
            variants = weapon_color_map[cname]
            base_col = extract_color_from_name(raw_disp_name) or '기본형'
            base_img = file_map.get(cname.lower(), '')
            formatted_vars = []
            for v in variants:
                variant_barrel_fields = get_barrel_fields(v['id'])
                formatted_vars.append({
                    'name': v['name'],
                    'id': v['id'],
                    'image': v['image'],
                    'canBePainted': v['id'] in paintable_classes,
                    **variant_barrel_fields
                })
            item_obj['color'] = [{
                'name': base_col,
                'id': cname,
                'image': base_img,
                'canBePainted': is_base_paintable,
                **base_barrel_fields
            }] + formatted_vars
            stats_summary['colors_linked'] += 1
        elif cname != 'SMPZ_Weapon_UCP':
            single_col = extract_color_for_item(cname, raw_disp_name)
            cleaned_n = clean_display_name(raw_disp_name)
            if single_col and (cleaned_n != raw_disp_name or any(cname.endswith(s[0]) for s in COLOR_SUFFIXES)):
                base_img = file_map.get(cname.lower(), '')
                item_obj['color'] = [{
                    'name': single_col,
                    'id': cname,
                    'image': base_img,
                    'canBePainted': is_base_paintable,
                    **base_barrel_fields
                }]
                item_obj['name'] = cleaned_n
                stats_summary['colors_linked'] += 1

        has_paint = is_base_paintable or (isinstance(item_obj.get('color'), list) and any(c.get('canBePainted') for c in item_obj['color']))
        item_obj['canBePainted'] = has_paint
        if has_paint:
            stats_summary['paintable_items'] += 1

        item_obj.update(base_barrel_fields)
        barrel_adjustments = list(item_obj['barrelAdjustments'])
        has_adjustable_variant = item_obj['canAdjustBarrel']
        if isinstance(item_obj.get('color'), list):
            for color_variant in item_obj['color']:
                barrel_adjustments.extend(color_variant.get('barrelAdjustments', []))
                has_adjustable_variant = has_adjustable_variant or color_variant.get('canAdjustBarrel', False)
        item_obj['barrelAdjustments'] = sort_barrel_adjustments(barrel_adjustments)
        item_obj['canAdjustBarrel'] = bool(has_adjustable_variant)
        if item_obj['canAdjustBarrel']:
            stats_summary['barrel_adjustable_items'] += 1

        fallback_ids = [v['id'] for v in weapon_color_map.get(cname, [])]
        _merge_manual_fields(item_obj, metadata, fallback_ids=fallback_ids)
        resolve_desc(item_obj, props)

        if 'stats' in item_obj:
            item_obj['stats'] = clean_item_stats(item_obj['stats'])

        weapons_data.setdefault(cat, []).append(item_obj)

    # 4. BUILD GEARS
    gear_data = {}
    gear_scope2 = [c for c in all_classes if c.startswith('SMPZ_') and 'SMPZ_Gears' in all_classes[c].get('source_file', '') and get_scope(c, all_classes) == 2]
    by_parent = {}
    for c in gear_scope2:
        p = all_classes[c].get('parent')
        by_parent.setdefault(p, []).append(c)

    for p, kids in by_parent.items():
        chosen_id = kids[0]
        cat = classify_gear(chosen_id)
        if not cat:
            continue

        props = get_inherited_props(chosen_id, all_classes)
        disp_key = str(props.get('displayName', '')).lstrip('$')
        raw_disp_name = str_table.get(disp_key, props.get('displayName', chosen_id))
        disp_name = clean_display_name(raw_disp_name) if len(kids) > 1 else raw_disp_name

        item_obj = {
            'id': chosen_id,
            'name': disp_name,
            'category': cat,
            'description': '',
        }

        g_stats = extract_gear_stats(chosen_id, props, all_classes, cat)
        if g_stats:
            item_obj['stats'] = g_stats
            if 'healthDamageProtection' in g_stats:
                stats_summary['health_protection_items'] += 1

        cs = props.get('itemsCargoSize') or props.get('itemCargoSize')
        if cs and len(cs) >= 2:
            try:
                item_obj['cargoSize'] = [int(cs[0]), int(cs[1])]
                item_obj['cargoSlots'] = int(cs[0]) * int(cs[1])
                stats_summary['cargo_items'] += 1
            except Exception: pass

        isz = props.get('itemSize')
        if isz and len(isz) >= 2:
            try:
                item_obj['itemSize'] = [int(isz[0]), int(isz[1])]
                item_obj['itemSlots'] = int(isz[0]) * int(isz[1])
            except Exception: pass

        for prop_key, obj_key in [('inventorySlot', 'inventorySlots'), ('attachments', 'attachmentSlots')]:
            v = props.get(prop_key)
            if v:
                item_obj[obj_key] = v
                if prop_key == 'inventorySlot': stats_summary['slots_linked'] += 1

        prot_areas = props.get('ProtectionAreas')
        if prot_areas and isinstance(prot_areas, list):
            item_obj['protectionAreas'] = prot_areas
            stats_summary['protection_items'] += 1

        if cat == 'helmet_attachment':
            item_obj['subCategory'] = classify_helmet_attachment_type(item_obj)
            stats_summary['helmet_types'] += 1

        m_img = file_map.get(chosen_id.lower())
        if m_img:
            item_obj['image'] = m_img
            item_obj['images'] = [m_img]
        m_mdl = match_model_for_item(chosen_id, disp_name, model_map, sec_type='gear')
        if m_mdl:
            item_obj['model'] = m_mdl
            stats_summary['models_linked'] += 1

        is_base_paintable = chosen_id in paintable_classes
        if len(kids) > 1:
            gear_colors = []
            for k in kids:
                k_props = get_inherited_props(k, all_classes)
                k_disp_key = str(k_props.get('displayName', '')).lstrip('$')
                k_disp = str_table.get(k_disp_key, k)
                k_col = extract_color_for_item(k, k_disp) or '기본형'
                gear_colors.append({
                    'name': k_col,
                    'id': k,
                    'image': file_map.get(k.lower(), ''),
                    'canBePainted': k in paintable_classes
                })
            item_obj['color'] = gear_colors
            stats_summary['colors_linked'] += 1
        else:
            single_col = extract_color_for_item(chosen_id, raw_disp_name)
            cleaned_n = clean_display_name(raw_disp_name)
            if single_col and (cleaned_n != raw_disp_name or any(chosen_id.endswith(s[0]) for s in COLOR_SUFFIXES)):
                item_obj['color'] = [{
                    'name': single_col,
                    'id': chosen_id,
                    'image': file_map.get(chosen_id.lower(), ''),
                    'canBePainted': is_base_paintable
                }]
                item_obj['name'] = cleaned_n
                stats_summary['colors_linked'] += 1

        has_paint = is_base_paintable or (isinstance(item_obj.get('color'), list) and any(c.get('canBePainted') for c in item_obj['color']))
        item_obj['canBePainted'] = has_paint
        if has_paint:
            stats_summary['paintable_items'] += 1

        _merge_manual_fields(item_obj, metadata, fallback_ids=kids)
        resolve_desc(item_obj, props)

        if 'stats' in item_obj:
            item_obj['stats'] = clean_item_stats(item_obj['stats'])

        gear_data.setdefault(cat, []).append(item_obj)

    # 5. BUILD ATTACHMENTS
    attachment_data = {}
    valid_att_classes = []
    for cname in sorted(all_classes.keys()):
        if not any(cname.startswith(pfx) for pfx in ATTACHMENT_PREFIXES):
            continue
        if get_scope(cname, all_classes) != 2:
            continue
        if cname.startswith('Slot_') or cname in ('Inventory_Base', 'ItemSuppressor', 'Clothing_Base', 'Weapon_Base', 'Rifle_Base'):
            continue
        if is_preset_magazine(cname, all_classes):
            continue
        props = get_inherited_props(cname, all_classes)
        inv = props.get('inventorySlot')
        if not inv and not cname.startswith('SMPZ_Mag_'):
            continue
        valid_att_classes.append(cname)

    att_scope2_set = set(valid_att_classes)
    att_color_map = {}
    att_variant_set = set()

    for cid in valid_att_classes:
        matched = None
        for sfx, color_label in COLOR_SUFFIXES:
            if cid.endswith(sfx):
                matched = (sfx, color_label)
                break
        if not matched:
            continue
        sfx, color_label = matched
        base_cand = cid[:-len(sfx)]
        parent = all_classes[cid].get('parent')

        base_id = None
        if base_cand in att_scope2_set:
            base_id = base_cand
        elif parent in att_scope2_set and not any(parent.endswith(s[0]) for s in COLOR_SUFFIXES):
            base_id = parent
        else:
            cand_black = base_cand + '_Black'
            if cand_black in att_scope2_set:
                base_id = cand_black
            else:
                for s2, _ in COLOR_SUFFIXES:
                    cand_sib = base_cand + s2
                    if cand_sib in att_scope2_set:
                        base_id = cand_sib
                        break

        if base_id and base_id != cid:
            att_variant_set.add(cid)
            v_props = get_inherited_props(cid, all_classes)
            v_disp_key = str(v_props.get('displayName', '')).lstrip('$')
            v_disp = str_table.get(v_disp_key, cid)
            v_col = extract_color_from_name(v_disp) or color_label
            att_color_map.setdefault(base_id, []).append({
                'name': v_col,
                'id': cid,
                'image': file_map.get(cid.lower(), '')
            })

    for cname in valid_att_classes:
        if cname in att_variant_set:
            continue
        props = get_inherited_props(cname, all_classes)
        src_file = all_classes[cname].get('source_file', '')
        mag_val = extract_optic_magnification(cname, all_classes)
        cat = classify_attachment(cname, props, src_file, mag_val)
        if not cat:
            continue

        disp_key = str(props.get('displayName', '')).lstrip('$')
        raw_disp_name = str_table.get(disp_key, props.get('displayName', cname))
        disp_name = clean_display_name(raw_disp_name) if cname in att_color_map else raw_disp_name

        item_obj = {
            'id': cname,
            'name': disp_name,
            'category': cat,
            'description': '',
        }

        a_stats = extract_attachment_stats(cname, props, all_classes, cat, mag_val)
        if a_stats:
            item_obj['stats'] = a_stats
            if 'magnification' in a_stats:
                stats_summary['optics_magnification'] += 1

        cs = props.get('itemsCargoSize') or props.get('itemCargoSize')
        if cs and len(cs) >= 2:
            try:
                item_obj['cargoSize'] = [int(cs[0]), int(cs[1])]
                item_obj['cargoSlots'] = int(cs[0]) * int(cs[1])
                stats_summary['cargo_items'] += 1
            except Exception: pass

        isz = props.get('itemSize')
        if isz and len(isz) >= 2:
            try:
                item_obj['itemSize'] = [int(isz[0]), int(isz[1])]
                item_obj['itemSlots'] = int(isz[0]) * int(isz[1])
            except Exception: pass

        for prop_key, obj_key in [('inventorySlot', 'inventorySlots'), ('attachments', 'attachmentSlots'),
                                  ('magazines', 'magazines'), ('chamberableFrom', 'chamberableFrom')]:
            v = props.get(prop_key)
            if v:
                item_obj[obj_key] = v
                if prop_key == 'inventorySlot': stats_summary['slots_linked'] += 1

        if cat == 'mount':
            item_obj['subCategory'] = classify_mount_type(item_obj)
            stats_summary['mount_types'] += 1
        elif cat == 'iron_sight':
            item_obj['subCategory'] = classify_ironsight_type(item_obj)
            stats_summary['ironsight_types'] += 1
        elif cat == 'pistol_grip':
            item_obj['subCategory'] = classify_pistolgrip_type(item_obj)
            stats_summary['pistolgrip_types'] += 1
        elif cat == 'reflex_sight':
            item_obj['subCategory'] = classify_dotsight_type(item_obj)
            stats_summary['dotsight_types'] += 1
        elif cat == 'foregrip':
            item_obj['subCategory'] = classify_foregrip_type(item_obj, all_classes)
            stats_summary['foregrip_types'] += 1
        elif cat == 'receiver':
            item_obj['subCategory'] = classify_receiver_type(item_obj)
            stats_summary['receiver_types'] += 1
        elif cat == 'buttstock':
            item_obj['subCategory'] = classify_stock_type(item_obj)
            stats_summary['stock_types'] += 1
        elif cat == 'muzzle_device':
            item_obj['subCategory'] = classify_muzzle_type(item_obj)
            stats_summary['muzzle_types'] += 1
        elif cat == 'suppressor':
            item_obj['subCategory'] = classify_suppressor_type(item_obj)
            stats_summary['suppressor_types'] += 1

        m_img = file_map.get(cname.lower())
        if m_img:
            item_obj['image'] = m_img
            item_obj['images'] = [m_img]
        m_mdl = match_model_for_item(cname, disp_name, model_map, sec_type='attachment')
        if m_mdl:
            item_obj['model'] = m_mdl
            stats_summary['models_linked'] += 1

        is_base_paintable = cname in paintable_classes
        if cname in att_color_map:
            variants = att_color_map[cname]
            base_col = extract_color_from_name(raw_disp_name) or '기본형'
            base_img = file_map.get(cname.lower(), '')
            formatted_vars = []
            for v in variants:
                formatted_vars.append({
                    'name': v['name'],
                    'id': v['id'],
                    'image': v['image'],
                    'canBePainted': v['id'] in paintable_classes
                })
            item_obj['color'] = [{
                'name': base_col,
                'id': cname,
                'image': base_img,
                'canBePainted': is_base_paintable
            }] + formatted_vars
            stats_summary['colors_linked'] += 1
        else:
            single_col = extract_color_for_item(cname, raw_disp_name)
            cleaned_n = clean_display_name(raw_disp_name)
            if single_col and (cleaned_n != raw_disp_name or any(cname.endswith(s[0]) for s in COLOR_SUFFIXES)):
                base_img = file_map.get(cname.lower(), '')
                item_obj['color'] = [{
                    'name': single_col,
                    'id': cname,
                    'image': base_img,
                    'canBePainted': is_base_paintable
                }]
                item_obj['name'] = cleaned_n
                stats_summary['colors_linked'] += 1

        has_paint = is_base_paintable or (isinstance(item_obj.get('color'), list) and any(c.get('canBePainted') for c in item_obj['color']))
        item_obj['canBePainted'] = has_paint
        if has_paint:
            stats_summary['paintable_items'] += 1

        fallback_ids = [v['id'] for v in att_color_map.get(cname, [])]
        _merge_manual_fields(item_obj, metadata, fallback_ids=fallback_ids)
        resolve_desc(item_obj, props)

        if 'stats' in item_obj:
            item_obj['stats'] = clean_item_stats(item_obj['stats'])

        attachment_data.setdefault(cat, []).append(item_obj)

    # 6. ENRICH MAGAZINES
    enrich_magazine_calibers(weapons_data, attachment_data)

    stats_summary['runtime_constrained_items'] = apply_runtime_attachment_constraints(
        (weapons_data, gear_data, attachment_data),
        runtime_classes,
        runtime_rules,
        all_classes
    )

    save_google_translation_cache(google_cache)

    print("-" * 70)
    print("[*] 데이터 생성 및 처리 통계:")
    print(f"    - 기존/메타데이터 설명 보존:     {stats_summary['existing']}개")
    print(f"    - 구글 번역(캐시 및 신규 번역):  {stats_summary['google_translate']}개")
    print(f"    - 설명 없음 / 비어있음:          {stats_summary['empty']}개")
    print(f"    - 가방/수납 크기 파싱 완료:      {stats_summary['cargo_items']}개")
    print(f"    - 슬롯(inventorySlots) 연동:     {stats_summary['slots_linked']}개")
    print(f"    - 방호 부위(ProtectionAreas) 연동: {stats_summary['protection_items']}개")
    print(f"    - 체력 보호율 파싱 완료:         {stats_summary['health_protection_items']}개")
    print(f"    - 조준경 C++ 배율 연동:          {stats_summary['optics_magnification']}개")
    print(f"    - 지원 색상(color) 그룹화 연동:  {stats_summary['colors_linked']}개")
    print(f"    - 도색 가능(canBePainted) 연동:   {stats_summary['paintable_items']}개")
    print(f"    - 총열 조절(canAdjustBarrel) 연동: {stats_summary['barrel_adjustable_items']}개")
    print(f"    - 마운트 하위 분류(mountType):   {stats_summary['mount_types']}개")
    print(f"    - 기계식 조준기 분류(sightType): {stats_summary['ironsight_types']}개")
    print(f"    - 권총 손잡이 분류(gripPlatform): {stats_summary['pistolgrip_types']}개")
    print(f"    - 도트/홀로그램 분류(dotType):   {stats_summary['dotsight_types']}개")
    print(f"    - 전방 손잡이 분류(foregripType): {stats_summary['foregrip_types']}개")
    print(f"    - 리시버 분류(receiverType):     {stats_summary['receiver_types']}개")
    print(f"    - 개머리판 분류(stockType):      {stats_summary['stock_types']}개")
    print(f"    - 소염기/머즐 분류(muzzleType):  {stats_summary['muzzle_types']}개")
    print(f"    - 소음기 분류(suppressorType):   {stats_summary['suppressor_types']}개")
    print(f"    - 헬멧 부착물 분류:              {stats_summary['helmet_types']}개")
    print(f"    - 런타임 장착 제약 연동:         {stats_summary['runtime_constrained_items']}개")
    print(f"    - 3D 모델(.glb) 자동 연결:       {stats_summary['models_linked']}개")
    print("-" * 70)

    return weapons_data, gear_data, attachment_data

def save_data_js(weaponsData, gearData, attachmentData, output_file=DEFAULT_DATA_JS_PATH):
    output_content = f"""// 무기 데이터 (자동 동기화 빌드)
// 이제 데이터는 이 파일에 저장됩니다
const weaponsData = {json.dumps(weaponsData, indent=4, ensure_ascii=False)};

// 기어 데이터 (자동 동기화 빌드)
const gearData = {json.dumps(gearData, indent=4, ensure_ascii=False)};

// 부착물 데이터 (자동 동기화 빌드)
const attachmentData = {json.dumps(attachmentData, indent=4, ensure_ascii=False)};
"""
    with open(output_file, 'w', encoding='utf-8', newline='\n') as f:
        f.write(output_content)
    print(f"\n[✓] data.js 파일 생성 완료: {output_file}")

def main():
    parser = argparse.ArgumentParser(description="SMPZ 모드팩 data.js 자동 생성 도구 (독립 클린 빌더)")
    parser.add_argument('--smpz-dir', help="SMPZ 모드팩 루트 디렉토리 경로 (직접 지정 시 저장됨)")
    parser.add_argument('--select-dir', action='store_true', help="GUI 폴더 선택 창을 띄워 SMPZ 모드팩 경로를 새로 지정합니다")
    parser.add_argument('--no-gui', action='store_true', help="GUI 다이얼로그를 띄우지 않고 콘솔만 사용합니다")
    parser.add_argument('--assets-dir', default=DEFAULT_ASSETS_DIR, help="assets 디렉토리 경로")
    parser.add_argument('--models-dir', default=DEFAULT_MODELS_DIR, help="assets/models 디렉토리 경로")
    parser.add_argument('--metadata', default=DEFAULT_METADATA_JS_PATH, help="수동 큐레이션 메타데이터 파일 (metadata.js)")
    parser.add_argument('--output', default=DEFAULT_DATA_JS_PATH, help="출력할 data.js 파일 경로")
    args = parser.parse_args()

    smpz_dir = resolve_smpz_dir(cli_dir=args.smpz_dir, force_select=args.select_dir, no_gui=args.no_gui)
    if not smpz_dir:
        print("\n[오류] 유효한 SMPZ 모드팩 디렉토리를 찾을 수 없습니다.")
        print("  - GUI 창에서 SMPZ 모드팩 폴더를 선택하거나,")
        print("  - --smpz-dir 옵션을 사용하여 경로를 지정해주세요.")
        print('  예: python tools/generate_data_js.py --smpz-dir "path/to/SMPZ"')
        sys.exit(1)

    print(f"[*] 사용 중인 SMPZ 모드팩 경로: {smpz_dir}")

    weapons, gear, attachments = build_data_js(
        smpz_dir=smpz_dir,
        assets_dir=args.assets_dir,
        models_dir=args.models_dir,
        metadata_js_path=args.metadata
    )

    save_data_js(weapons, gear, attachments, output_file=args.output)
    print("\n[✓] 모든 작업이 성공적으로 완료되었습니다!")

if __name__ == '__main__':
    main()
