# -*- coding: utf-8 -*-
"""
================================================================================
DayZ Modpack Unpacker & Decompiler
================================================================================
"""

import os
import sys
import glob
import json
import struct
import io
import re
import argparse
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))


def get_steam_library_paths() -> list:
    """Steam 레지스트리 및 libraryfolders.vdf를 조회하여 등록된 모든 라이브러리 디렉터리 목록을 반환합니다."""
    libraries = []

    try:
        import winreg
        for subkey in [r"Software\Valve\Steam", r"SOFTWARE\WOW6432Node\Valve\Steam"]:
            try:
                key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, subkey)
                val, _ = winreg.QueryValueEx(key, "SteamPath")
                if val and os.path.isdir(val):
                    norm = os.path.normpath(val)
                    if norm.lower() not in [p.lower() for p in libraries]:
                        libraries.append(norm)
            except Exception:
                pass
    except ImportError:
        pass

    drives = [f"{d}:" for d in "CDEFGHIJKLMNOPQRSTUVWXYZ" if os.path.exists(f"{d}:\\")]
    common_subs = [
        os.path.join("Program Files (x86)", "Steam"),
        os.path.join("Program Files", "Steam"),
        "Steam",
        "SteamLibrary"
    ]
    for drive in drives:
        for sub in common_subs:
            candidate = os.path.join(drive, os.sep, sub)
            if os.path.isdir(candidate) and candidate.lower() not in [p.lower() for p in libraries]:
                libraries.append(candidate)

    extra_libs = []
    for base_lib in libraries:
        vdf_path = os.path.join(base_lib, "steamapps", "libraryfolders.vdf")
        if os.path.isfile(vdf_path):
            try:
                with open(vdf_path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        match = re.search(r'"path"\s+"([^"]+)"', line)
                        if match:
                            found_p = os.path.normpath(match.group(1).replace("\\\\", "\\"))
                            if os.path.isdir(found_p) and found_p.lower() not in [p.lower() for p in libraries + extra_libs]:
                                extra_libs.append(found_p)
            except Exception:
                pass

    return libraries + extra_libs


def find_dayz_workshop_directories() -> list:
    workshop_dirs = []
    for lib in get_steam_library_paths():
        ws_path = os.path.join(lib, "steamapps", "common", "DayZ", "!Workshop")
        if os.path.isdir(ws_path) and ws_path.lower() not in [w.lower() for w in workshop_dirs]:
            workshop_dirs.append(ws_path)
    return workshop_dirs


def scan_installed_mods() -> list:
    found_mods = []
    for ws in find_dayz_workshop_directories():
        try:
            for item in os.listdir(ws):
                if item.startswith("@"):
                    full_p = os.path.join(ws, item)
                    if os.path.isdir(full_p):
                        found_mods.append(full_p)
        except Exception:
            pass
    return sorted(found_mods, key=lambda x: os.path.basename(x).lower())


class RapReader:
    """Bohemia raP 바이너리 포맷(config.bin)을 C++ 구조로 디코딩합니다."""
    def __init__(self, data: bytes):
        self.data = data
        self.enum_offset = 0

    def read_cstring(self, offset: int):
        end = self.data.find(b"\x00", offset)
        if end == -1:
            return "", offset
        return self.data[offset:end].decode("latin-1", errors="replace"), end + 1

    def read_compact_int(self, offset: int):
        val = 0
        shift = 0
        while True:
            if offset >= len(self.data):
                break
            b = self.data[offset]
            offset += 1
            val |= (b & 0x7F) << shift
            if not (b & 0x80):
                break
            shift += 7
        return val, offset

    def parse_value(self, subtype: int, offset: int):
        if subtype == 0:
            val, offset = self.read_cstring(offset)
            escaped = val.replace('"', '""')
            return f'"{escaped}"', offset
        elif subtype == 1:
            val = struct.unpack("<f", self.data[offset:offset+4])[0]
            return f"{val:.6g}", offset + 4
        elif subtype == 2:
            val = struct.unpack("<i", self.data[offset:offset+4])[0]
            return str(val), offset + 4
        elif subtype == 3:
            val, offset = self.read_cstring(offset)
            return val, offset
        elif subtype == 4:
            val = struct.unpack("<q", self.data[offset:offset+8])[0]
            return str(val), offset + 8
        else:
            return f"/* unknown subtype {subtype} */", offset

    def parse_class_body(self, offset: int, indent: int = 0):
        lines = []
        ind = "  " * indent
        
        if offset >= len(self.data):
            return "", lines
            
        inherits, offset = self.read_cstring(offset)
        num_entries, offset = self.read_compact_int(offset)
        
        for _ in range(num_entries):
            if offset >= len(self.data):
                break
            entry_type = self.data[offset]
            offset += 1
            
            if entry_type == 0:
                class_name, offset = self.read_cstring(offset)
                if offset + 4 > len(self.data):
                    break
                class_body_offset = struct.unpack("<I", self.data[offset:offset+4])[0]
                offset += 4
                
                sub_inherits, sub_lines = self.parse_class_body(class_body_offset, indent + 1)
                inherit_str = f" : {sub_inherits}" if sub_inherits else ""
                lines.append(f"{ind}class {class_name}{inherit_str}")
                lines.append(f"{ind}{{")
                lines.extend(sub_lines)
                lines.append(f"{ind}}};")
                
            elif entry_type == 1:
                subtype = self.data[offset]
                offset += 1
                var_name, offset = self.read_cstring(offset)
                val_str, offset = self.parse_value(subtype, offset)
                lines.append(f"{ind}{var_name} = {val_str};")
                
            elif entry_type == 2:
                var_name, offset = self.read_cstring(offset)
                num_elems, offset = self.read_compact_int(offset)
                elems = []
                for _ in range(num_elems):
                    if offset >= len(self.data):
                        break
                    elem_type = self.data[offset]
                    offset += 1
                    elem_val, offset = self.parse_value(elem_type, offset)
                    elems.append(elem_val)
                lines.append(f"{ind}{var_name}[] = {{{', '.join(elems)}}};")
                
            elif entry_type == 3:
                class_name, offset = self.read_cstring(offset)
                lines.append(f"{ind}class {class_name};")
            elif entry_type == 4:
                class_name, offset = self.read_cstring(offset)
                lines.append(f"{ind}delete {class_name};")
            else:
                lines.append(f"{ind}// Unknown entry type {entry_type}")
                break
                
        return inherits, lines

    def parse(self) -> str:
        if not self.data.startswith(b"\x00raP"):
            return self.data.decode("utf-8", errors="replace")
        
        if len(self.data) >= 16:
            self.enum_offset = struct.unpack("<I", self.data[12:16])[0]
        offset = 16
        _, lines = self.parse_class_body(offset, 0)
        return "\n".join(lines)


def derap_file(in_path: str) -> str:
    with open(in_path, "rb") as f:
        data = f.read()
    reader = RapReader(data)
    return reader.parse()


def extract_single_pbo(pbo_path: str, target_dir: str) -> bool:
    os.makedirs(target_dir, exist_ok=True)

    try:
        from dayz_dev_tools import pbo_reader, extract_pbo
        orig_cwd = os.getcwd()
        try:
            with open(pbo_path, "rb") as f:
                reader = pbo_reader.PBOReader(f)
                os.chdir(target_dir)
                extract_pbo.extract_pbo(
                    reader,
                    [],
                    verbose=False,
                    deobfuscate=True,
                    cfgconvert=None
                )
        finally:
            os.chdir(orig_cwd)
        return True
    except ImportError:
        return _fallback_unpack_pbo(pbo_path, target_dir)


def _fallback_unpack_pbo(pbo_path: str, target_dir: str) -> bool:
    with open(pbo_path, "rb") as f:
        def read_cstring():
            chars = []
            while True:
                c = f.read(1)
                if not c or c == b"\x00":
                    break
                chars.append(c)
            return b"".join(chars).decode("latin-1", errors="replace")

        first = True
        entries = []
        while True:
            filename = read_cstring()
            hdr_bytes = f.read(20)
            if len(hdr_bytes) < 20:
                break
            packing_method, original_size, reserved, timestamp, data_size = struct.unpack("<5I", hdr_bytes)
            if first:
                first = False
                if filename == "" and packing_method == 0x56657273:
                    while True:
                        k = read_cstring()
                        if not k:
                            break
                        _ = read_cstring()
                    continue
                elif filename == "":
                    break
            if filename == "" and packing_method == 0 and data_size == 0:
                break
            entries.append((filename, packing_method, data_size))

        for filename, _, data_size in entries:
            name = filename.replace("\\", os.sep).replace("/", os.sep).strip("\t ")
            data = f.read(data_size)
            if not name:
                continue
            out_file = os.path.join(target_dir, name)
            os.makedirs(os.path.dirname(out_file), exist_ok=True)
            with open(out_file, "wb") as out_fp:
                out_fp.write(data)
    return True


def process_extracted_directory(output_dir: str):
    print("\n[*] 언팩 데이터 후처리 작업 진행 중 (raP 역컴파일 & 인코딩 정규화)...")
    decompiled_count = 0
    stringtable_count = 0

    for root, _, files in os.walk(output_dir):
        for file in files:
            fl = file.lower()
            full_path = os.path.join(root, file)

            if fl == "config.bin":
                try:
                    cpp_content = derap_file(full_path)
                    decompiled_cpp_path = os.path.join(root, "config_decompiled.cpp")
                    with open(decompiled_cpp_path, "w", encoding="utf-8") as cpp_fp:
                        cpp_fp.write(cpp_content)

                    std_cpp_path = os.path.join(root, "config.cpp")
                    if not os.path.exists(std_cpp_path):
                        with open(std_cpp_path, "w", encoding="utf-8") as std_cpp_fp:
                            std_cpp_fp.write(cpp_content)

                    decompiled_count += 1
                except Exception as e:
                    print(f"  [!] raP 디컴파일 실패: {full_path} ({e})")

            elif "stringtable" in fl and (fl.endswith(".csv") or fl.endswith(".xml")):
                try:
                    with open(full_path, "rb") as fp:
                        raw_data = fp.read()
                    text = raw_data.decode("utf-8", errors="replace")
                    with open(full_path, "w", encoding="utf-8-sig") as out_fp:
                        out_fp.write(text)
                    stringtable_count += 1
                except Exception as e:
                    print(f"  [!] stringtable 인코딩 변환 실패: {full_path} ({e})")

    print(f"  [✓] raP 설정 역컴파일 완료: {decompiled_count}개 파일")
    print(f"  [✓] stringtable 인코딩(UTF-8 BOM) 변환 완료: {stringtable_count}개 파일")


def prompt_gui_folder_dialog(title="폴더를 선택하세요", initial_dir=None) -> str:
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)
        selected = filedialog.askdirectory(title=title, initialdir=initial_dir or PROJECT_ROOT)
        root.destroy()
        return os.path.abspath(selected) if selected else ""
    except Exception as e:
        print(f"[GUI] 다이얼로그 실행 불가: {e}")
        return ""


def select_input_mod_dir(cli_dir=None, force_gui=False) -> str:
    if cli_dir and os.path.isdir(cli_dir):
        return os.path.abspath(cli_dir)

    workshop_dirs = find_dayz_workshop_directories()
    initial_search_dir = workshop_dirs[0] if workshop_dirs else PROJECT_ROOT

    if force_gui:
        selected = prompt_gui_folder_dialog(
            title="언팩할 DayZ 모드팩 폴더 선택",
            initial_dir=initial_search_dir
        )
        if selected and os.path.isdir(selected):
            return os.path.abspath(selected)

    installed_mods = scan_installed_mods()

    print("\n" + "=" * 70)
    print("  DayZ Modpack 언팩 & 전처리 도구")
    print("=" * 70)

    if installed_mods:
        print(f"[*] 감지된 DayZ 모드팩 목록 ({len(installed_mods)}개):")
        for idx, mod_path in enumerate(installed_mods, 1):
            print(f"  [{idx:2d}] {os.path.basename(mod_path):<35} ({mod_path})")
        menu_opt_gui = len(installed_mods) + 1
        menu_opt_manual = menu_opt_gui + 1
    else:
        print("[*] DayZ Workshop 디렉터리를 자동 감지할 수 없습니다.")
        menu_opt_gui = 1
        menu_opt_manual = 2

    print(f"  [{menu_opt_gui:2d}] GUI 폴더 선택창 열기")
    print(f"  [{menu_opt_manual:2d}] 직접 경로 입력")

    try:
        choice = input(f"\n모드팩 번호를 선택하세요 (기본값: 1): ").strip()
    except (EOFError, KeyboardInterrupt):
        choice = "1"

    if not choice:
        choice = "1"

    if choice.isdigit():
        num = int(choice)
        if installed_mods and 1 <= num <= len(installed_mods):
            return os.path.abspath(installed_mods[num - 1])
        elif num == menu_opt_gui:
            selected = prompt_gui_folder_dialog(
                title="언팩할 DayZ 모드팩 폴더 선택",
                initial_dir=initial_search_dir
            )
            if selected and os.path.isdir(selected):
                return os.path.abspath(selected)
        elif num == menu_opt_manual:
            custom_path = input("모드팩 디렉터리 경로를 입력하세요: ").strip().strip('"')
            if os.path.isdir(custom_path):
                return os.path.abspath(custom_path)

    if installed_mods:
        return os.path.abspath(installed_mods[0])

    selected = prompt_gui_folder_dialog(
        title="언팩할 DayZ 모드팩 폴더 선택",
        initial_dir=initial_search_dir
    )
    if selected and os.path.isdir(selected):
        return os.path.abspath(selected)

    raise ValueError("유효한 모드팩 디렉터리를 선택하지 않았습니다.")


def select_output_dir(mod_dir: str, cli_out=None, force_gui=False) -> str:
    if cli_out:
        return os.path.abspath(cli_out)

    orig_folder_name = os.path.basename(os.path.normpath(mod_dir))
    default_out = os.path.join(os.getcwd(), "extracted", orig_folder_name)

    if force_gui:
        print("\n[*] 언팩 결과 저장 폴더 선택 창을 엽니다...")
        selected = prompt_gui_folder_dialog(
            title="언팩 결과를 저장할 대상 폴더 선택",
            initial_dir=default_out
        )
        if selected:
            return os.path.abspath(selected)
        print(f"[*] 취소되어 기본 경로를 사용합니다: {default_out}")
        return os.path.abspath(default_out)

    print("\n" + "-" * 70)
    print(f"[*] 기본 언팩 출력 경로: {default_out}")
    print("  [1] 기본 경로 사용")
    print("  [2] GUI 폴더 선택창 열기")
    print("  [3] 직접 경로 입력")

    try:
        choice = input("출력 경로 옵션을 선택하세요 (기본값: 1): ").strip()
    except (EOFError, KeyboardInterrupt):
        choice = "1"

    if not choice:
        choice = "1"

    if choice == "2":
        selected = prompt_gui_folder_dialog(
            title="언팩 결과를 저장할 대상 폴더 선택",
            initial_dir=default_out
        )
        if selected:
            return os.path.abspath(selected)
        print(f"[*] 취소되어 기본 경로를 사용합니다: {default_out}")
        return os.path.abspath(default_out)
    elif choice == "3":
        custom_out = input("저장할 폴더 경로를 입력하세요: ").strip().strip('"')
        if custom_out:
            return os.path.abspath(custom_out)

    return os.path.abspath(default_out)


def unpack_modpack(mod_dir: str, output_dir: str):
    print("\n" + "=" * 70)
    print(f"[*] 모드팩 원본 경로: {mod_dir}")
    print(f"[*] 언팩 출력 경로:   {output_dir}")
    print("=" * 70)

    addons_dir = os.path.join(mod_dir, "addons")
    search_dir = addons_dir if os.path.isdir(addons_dir) else mod_dir

    pbo_files = sorted(glob.glob(os.path.join(search_dir, "*.pbo")))
    if not pbo_files:
        pbo_files = sorted(glob.glob(os.path.join(mod_dir, "**", "*.pbo"), recursive=True))

    if not pbo_files:
        print(f"\n[오류] '{mod_dir}' 경로에서 .pbo 파일을 찾을 수 없습니다.")
        sys.exit(1)

    print(f"[*] 총 {len(pbo_files)}개의 PBO 아카이브를 발견했습니다.")
    os.makedirs(output_dir, exist_ok=True)

    for i, pbo_path in enumerate(pbo_files, 1):
        pbo_name = os.path.basename(pbo_path)
        sub_folder = os.path.splitext(pbo_name)[0]
        target_sub_dir = os.path.join(output_dir, sub_folder)
        pbo_size_mb = os.path.getsize(pbo_path) / (1024 * 1024)

        print(f"  [{i:02d}/{len(pbo_files)}] 언팩 중: {pbo_name:<35} ({pbo_size_mb:>6.1f} MB)...", end="", flush=True)
        try:
            extract_single_pbo(pbo_path, target_sub_dir)
            print(" [성공]")
        except Exception as e:
            print(f" [실패: {e}]")

    process_extracted_directory(output_dir)

    print("\n" + "=" * 70)
    print("  [✓] 모드팩 전체 언팩 및 전처리 작업이 성공적으로 완료되었습니다!")
    print(f"  - 언팩된 파일 위치: {os.path.abspath(output_dir)}")
    print("=" * 70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="DayZ Modpack 범용 올인원 언패커 & C++ 역컴파일러"
    )
    parser.add_argument(
        "-i", "--input", "--mod-dir",
        dest="mod_dir",
        help="언팩할 DayZ 모드팩 원본 폴더 경로 (@모드명 폴더)"
    )
    parser.add_argument(
        "-o", "--output", "--output-dir",
        dest="output_dir",
        default=None,
        help="언팩된 결과물이 저장될 출력 디렉토리 (기본값: <실행경로>/extracted/<원본폴더명>)"
    )
    parser.add_argument(
        "--gui",
        action="store_true",
        help="원본 모드 폴더 및 출력 폴더를 GUI 다이얼로그로 선택합니다."
    )
    parser.add_argument(
        "--gui-output",
        action="store_true",
        help="출력 저장 폴더를 GUI 다이얼로그로 선택합니다."
    )
    args = parser.parse_args()

    try:
        mod_dir = select_input_mod_dir(cli_dir=args.mod_dir, force_gui=args.gui)
        output_dir = select_output_dir(
            mod_dir=mod_dir,
            cli_out=args.output_dir,
            force_gui=(args.gui or args.gui_output)
        )
        unpack_modpack(mod_dir, output_dir)
    except Exception as err:
        print(f"\n[오류 발생] {err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
