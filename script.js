
// 전역 상태 변수
let currentCategory = null;
let currentWeapon = null;
let currentPanel = 'weapon';
let currentGear = null;
let lastGalleryImageIndex = 0;
let lastGridScrollY = 0;
let compareTarget = null;
let activeDetailModal = null;
let detailModalReturnFocus = null;
const APP_STATE_KEY = 'smpz_handbook_state';

// 네비게이션 히스토리 스택
let navStack = [];
let isNavigatingHistory = false;

// 브라우저 기본 스크롤 자동 복원 간섭 방지 (SPA 맞춤 스크롤 복원 제어)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// 카테고리 식별자 한국어 라벨 매핑
const CATEGORY_LABELS = {
    // Weapons
    assault_rifle: '돌격 소총',
    sniper_rifle: '저격 소총',
    submachine_gun: '기관단총',
    shotgun: '산탄총',
    pistol: '권총',
    light_machine_gun: '경기관총',
    grenade_launcher: '유탄 발사기',

    // Attachments
    gas_block: '가스 블록',
    buttstock: '개머리판',
    optic_scope: '광학 조준경',
    pistol_grip: '권총 손잡이',
    iron_sight: '기계식 조준기',
    reflex_sight: '도트/홀로그램',
    laser_pointer: '레이저 표적기',
    receiver: '리시버',
    mount: '마운트',
    trigger: '방아쇠',
    buffer_tube: '버퍼 튜브',
    muzzle_device: '소염기 / 머즐',
    suppressor: '소음기',
    bipod: '양각대',
    charging_handle: '장전 손잡이',
    foregrip: '전방 손잡이',
    tactical_flashlight: '전술 플래시',
    barrel: '총열',
    magazine: '탄창',
    hammer: '해머',
    handguard: '핸드가드',

    // Gears
    helmet: '헬멧',
    helmet_attachment: '헬멧 부착물',
    full_body_armor: '전신 방탄복',
    plate_carrier: '플레이트 캐리어',
    chest_rig: '체스트 리그',
    mask: '마스크',
    backpack: '백팩'
};

function getCategoryLabel(categoryKey) {
    if (!categoryKey) return '';
    return CATEGORY_LABELS[categoryKey] || categoryKey;
}

function formatSize(size) {
    if (!size) return '';
    if (Array.isArray(size)) return size.join('x');
    return String(size);
}

function formatMagnification(mag) {
    if (!mag && mag !== 0) return '';
    if (typeof mag === 'number') return `${mag}x`;
    if (Array.isArray(mag)) {
        if (mag.length === 0) return '';
        if (mag.length === 1) return `${mag[0]}x`;
        return mag[0] === mag[1] ? `${mag[0]}x` : `${mag[0]}-${mag[1]}x`;
    }
    const s = String(mag).trim();
    if (!s) return '';
    return s.endsWith('x') ? s : `${s}x`;
}

// 슬롯명 한국어 매핑 사전
const slotNameMap = {
    '12gaMuzzle': '소음기',
    '300WinSuppressor': '.300 Win 총구 부착물 & 소음기',
    '308Adapter': 'Kiba 총구 부착물 Device 어댑터',
    '338Muzzle': '소음기',
    '366Muzzle': '.366 TKM 소음기',
    '417Buffer': 'HK 417 & G28 버퍼 튜브',
    '417Handguard': 'HK 417 & G28 핸드가드',
    '45ACPSuppressor': '.45 ACP 총구 부착물 / 소음기',
    '590A1Hndgrd': '590A1 Magpul MOE Forestock',
    '590A1Mount': '590A1 Tactical 레일',
    '590A1Stock': '590A1 Magpul SGA 개머리판',
    '762Suppressor': '7.62 총구 부착물 & 소음기',
    '762x54Suppressor': 'SVD 소음기',
    'AFMLOKChops': 'AirFrame M-LOK 턱 보호대',
    'AimpointACRO': 'Aimpoint ACRO P-1 relfex sight',
    'AimpointT1': 'Aimpoint Micro T-1 reflex sight',
    'AK12Cover': 'AK-12 dust cover',
    'AK12Handguard': 'AK-12 핸드가드',
    'AK12Muzzle': '소음기',
    'AK308Cover': 'AK-308 먼지 덮개',
    'AK308Handguard': 'AK-308 핸드가드',
    'AK308Muzzle': 'AK-308 소염기 / 소음기',
    'AK50Cover': 'AK-50 먼지 덮개',
    'AK50Hndgrd': 'AK-50 가스 튜브 with 핸드가드',
    'AK74MBuffer': 'AK-74M 버퍼 튜브',
    'AK74MButtstock': 'AK-74M 개머리판',
    'AKButtpad': 'AK Recoil Pad',
    'AKButtstock': 'AK 개머리판 / 어댑터',
    'AKChargingHandle': 'AK 장전 손잡이',
    'AKCover': 'AK 먼지 덮개 (Dust Cover)',
    'AKHandguard': 'AK 핸드가드',
    'AKMSStock': 'AKMS Folding 개머리판',
    'AKpistolgrip': 'AK 피스톨 그립',
    'AKRearsight': 'AK 가늠자',
    'AKS74UButtstock': 'AKS-74U 개머리판',
    'AKS74UCover': 'AKS-74U 먼지 덮개',
    'AKS74UHandguard': 'AKS-74U 핸드가드',
    'AKSidemount': 'AK 도브테일 사이드 마운트',
    'AKZenitStock': 'Zenit PT 개머리판',
    'AN94Buttstock': 'AN-94 개머리판',
    'AR10Gasblock': 'AR10 가스 블록',
    'AR10Handguard': 'AR-10 핸드가드',
    'ARBuffer': 'AR-15 버퍼 튜브 / 개머리판',
    'ARButtstock': 'AR-15 개머리판',
    'ARChargingHandle': 'AR-15 장전 손잡이',
    'ARGasblock': '가스 블록',
    'ARIntegratedStock': 'Integrated AR-15 개머리판',
    'ARpistolgrip': 'AR-15 피스톨 그립',
    'ASH12Suppressor': 'ASh-12 소음기',
    'ASVALMod4Handguard': 'VAL MOD.4 Kit 핸드가드',
    'ASVALMod4Muzzle': 'VAL MOD.4 총구 부착물',
    'AUGMount': 'Corvus Defensio Forward 레일',
    'AUGMuzzle': 'Sight 레일 마운트',
    'AUGOptic': 'AUG 조준경 Sight',
    'AUGReceiver': 'Sight 레일 마운트',
    'AXMCButtstock': 'AXMC 개머리판',
    'AXMCHandguard': 'AXMC 핸드가드',
    'B51Mount': 'Zenit B-51 Top 레일 마운트',
    'BatteryD': 'Battery D',
    'Bipod': '양각대',
    'BipodDVL10': 'Harris S-BRM 양각대',
    'BipodKeymod': 'Keymod 양각대',
    'BipodKeymodMLOKMount': 'M-LOK 양각대 마운트',
    'BipodKeymodMount': 'Keymod 양각대 마운트',
    'BottomRailCover': 'Bottom 레일 커버',
    'CantedMount': 'Canted 마운트',
    'Case_Front': '전면 케이스',
    'Chemlight': '케미라이트',
    'CNCAdapter': 'CNC 총구 부착물 Device 어댑터',
    'CNCChassis': 'CNC OV Chassis',
    'CNCHandguard': 'CNC OV 핸드가드',
    'CNCstock': 'CN Cstock',
    'CRDMuzzle': 'Ferfrans Concussion Reduction Device',
    'DD12LowerHandguard': '12.5 inch Lower 핸드가드',
    'DD9LowerHandguard': '9.5 inch Lower 핸드가드',
    'DDCover': 'Daniel Defense 레일 Panel',
    'DDCover2': 'Daniel Defense 레일 Panel',
    'DRGMount': 'SVD CAA DRG L-1 마운트',
    'F2000Handguard': 'FN F2000 Standard 핸드가드',
    'F2000Rearsight': 'FN F2000 가늠자',
    'FFP3': 'Burris FastFire 3 Reflex Sight',
    'Flashlight': '전술 조명',
    'Frontsight': '가늠쇠',
    'FSBarrel': 'Threaded Barrel',
    'FSRMRMount': 'FN 5.7 RMR 마운트',
    'FSSuppressor': 'Five Seven 소음기',
    'G36Buttstock': 'G36 개머리판',
    'G36Frontsight': 'KAC G36 Front Flip UP Sight',
    'G36Handguard': 'G36 핸드가드',
    'G36Magwell': 'G36 STANAG Magwell',
    'G36Optic': 'G36 HKV Reflex 조준경',
    'GlockBarrel': 'Glock Barrel',
    'GlockButtstock': 'GLR 개머리판',
    'GlockFrontsight': '가늠쇠',
    'GlockGrip': 'Tactical Grip Glove',
    'GlockMount': 'Glock Shark Sight 마운트',
    'GlockOptics': '조준경 / 조준경 마운트',
    'GlockRearsight': '가늠자',
    'GlockSlide': 'Glock Slide',
    'GlockSuppressor': '소음기',
    'Grip': '전방 손잡이',
    'GripCASV': '전방 손잡이',
    'HelmetAventail': '방탄 목가리개',
    'HelmetHeadset': '헤드셋',
    'HelmetPlate': '헬멧 방탄 플레이트',
    'HK416Handguard': 'HK 416 핸드가드',
    'HydraOptics': '하이드라 조준경',
    'JailBreakMuzzle': 'SAI JailBreak 총구 부착물 Device',
    'LeftRailCover': 'Left 레일 커버',
    'LPTBuffer': 'SIG SA LPT 버퍼',
    'M107A1Bipod': 'Barrett M107A1 양각대',
    'M107A1Cheek': 'Barrett M107A1 Cheek Rest',
    'M107A1Frontsight': 'Barrett M107A1 가늠쇠',
    'M107A1Muzzle': 'Barrett .50 BMG 소염기 / 머즐 브레이크',
    'M107A1Rearsight': 'Barrett M107A1 가늠자',
    'M16Mount': 'Delta Style 조준경 마운트',
    'M1911AO': 'M1911 AO 소염기 / 머즐 브레이크',
    'M1911Mount': 'M1911 마운트',
    'M1AChassis': 'M1A/M14 Chassis',
    'M1AScopeMount': 'M14 조준경 마운트',
    'M1AUpper': 'M1A Upper 마운트',
    'M200Handguard': 'CheyTac M200 Intervention 핸드가드',
    'M200Muzzle': 'CheyTac M200 Intervention 소염기 / 머즐 브레이크',
    'M200Stock': 'CheyTac M200 Intervention 개머리판',
    'M203': 'M203 40mm UBGL',
    'M32Optics': '조준경 / 조준경 마운트',
    'M4Handguard': 'AR-15 핸드가드',
    'M4Receiver': 'AR-15 상부 리시버',
    'M60Bipod': 'M60 양각대',
    'M60Buttstock': 'M60 개머리판',
    'M60Frontsight': 'M60 가늠쇠 레일',
    'M60Handguard': 'M60 핸드가드',
    'M60Pistolgrip': 'M60 피스톨 그립',
    'M60PistolgripGroup': 'M60 Trigger Group',
    'M9A3Mount': 'M9A3 Sight 마운트 Rear Sight 마운트',
    'MagnifierCompatOptics': '1x 조준경',
    'Mandible': 'Mandible 턱 보호대',
    'MasadaButtstock': 'Magpul Masada Polymer Folding 개머리판',
    'MasadaHandguard': 'Magpul Masada Polymer 핸드가드',
    'MCXButtstock': 'MCX/MPX 개머리판 / 버퍼',
    'MCXHandguard': 'MCX Gen1 핸드가드',
    'MDRHandguard': 'MDR 핸드가드',
    'MjolnirHndgrd': 'Mk-18 18 inch 핸드가드',
    'MosinPatriot': 'Patriot 레일 마운트',
    'MosinRearsight': 'Mosin Nagant 가늠자',
    'MosinStock': 'ATI Monte Carlo 개머리판',
    'MosinSuppressor': '소음기',
    'MP133Hndgrd': 'Plastic 레일 핸드가드',
    'MP133Stock': 'Plastic 개머리판',
    'MP18Hndgrd': 'MP-18 Polymer 핸드가드',
    'MP18Stock': 'MP-18 Polymer 개머리판',
    'MP5Handguard': 'MP5 핸드가드',
    'MP5Mount': 'MP5 MTI 조준경 마운트',
    'MP5Rearsight': 'MP5 Drum 가늠자',
    'MP5Stock': 'MP5 개머리판',
    'MP7Stock': 'MP7 개머리판',
    'MP7Suppressor': 'MP7 소음기',
    'MP7SureFireSuppressor': 'SureFire 5.56 소음기',
    'MP9Suppressor': 'B&T MP9 소음기',
    'MPXChargingHandle': 'MPX 장전 손잡이',
    'MPXHandguard': 'MPX 핸드가드',
    'MPXSD': 'MPX-SD 소음기',
    'MSRStock': 'MSR 개머리판',
    'noMountRMROptics': '권총 / RMR 직결 조준경',
    'NVG': '야간 투시경 (NVG)',
    'OpticsOnAKHndgrd': '조준경 / 조준경 마운트',
    'P90Optic': 'P90 Reflex Sight',
    'P90Receiver': 'P90 EFFEN 상부 리시버',
    'P90Suppressor': 'P90 소음기',
    'PatchLarge': '패치',
    'pistolOptics': 'pistol Optics',
    'PKBipod': 'PK 양각대',
    'PKButtstock': 'PKM & PKP 개머리판',
    'PKHandguard': 'Zenit B-50 핸드가드',
    'PKMSuppressor': 'PKM 총구 부착물 / 소음기',
    'PKPSuppressor': 'PKP Hexagon DTKP 7.62x54 소음기',
    'PKRearsight': 'PK 가늠자',
    'Pouch_IFAK': 'IFAK 파우치',
    'PP19Cover': 'PP-19-01 먼지 덮개',
    'PP19Stock': 'PP-19-01 개머리판',
    'PRSStock': 'AR-15 Magpul PRS 개머리판',
    'RAPTAR': 'RAPTAR RangeFinder',
    'RAPTARSecond': 'RAPTAR RangeFinder',
    'RD704Handguard': 'RD-704 SLR ION 핸드가드',
    'Rearsight': '가늠자',
    'RightRailCover': 'Right 레일 커버',
    'RiserMount': 'Riser 마운트',
    'ROF90Mount': 'ROF-90 RMR 마운트',
    'RPDBipod': 'RPD 양각대',
    'RPDHandguard': 'RPD 핸드가드',
    'RPDMuzzle': '7.62x39mm 총구 / 소음기',
    'RPDRearsight': 'RPD 가늠자',
    'RPDStock': 'RPD 개머리판',
    'RPK16Buffer': 'RPK-16 버퍼',
    'RPK16Cover': 'RPK-16 먼지 덮개',
    'RPK16Hndgrd': 'RPK-16 핸드가드',
    'SA58Cover': 'SA58/FAL 커버',
    'SA58Handguard': 'SA58/FAL 핸드가드',
    'SA58Pistolgrip': 'SA58/FAL 피스톨 그립',
    'SA58Stock': 'SA58/FAL 개머리판',
    'SaigaButtstock': 'Saiga 개머리판',
    'SaigaCover': 'Saiga 먼지 덮개',
    'SaigaHandguard': 'Saiga 핸드가드',
    'SaigaRearsight': 'Saiga 가늠자',
    'SCARBuffer': 'SCAR 버퍼 튜브',
    'SCARButtstock': 'SCAR Folding Polymer 개머리판',
    'SCARHandguard': 'SCAR 핸드가드',
    'SCARHandguardCASV': 'CASV 핸드가드',
    'Shoulder': '어깨',
    'SKSHandguard': 'SKS 가스 튜브 커버',
    'SKSMount': 'UTG SOCOM 레일 마운트',
    'SKSRearsight': 'SKS 가늠자',
    'SKSReceiver': 'MTU017 커버 마운트',
    'SKSStock': 'ATI Monte Carlo 개머리판',
    'SMRRailMountUnder': 'Geissele HK Long 레일 마운트',
    'SMRShortRailMountLeft': 'Geissele HK Short 레일 마운트',
    'SMRShortRailMountRight': 'Geissele HK Short 레일 마운트',
    'SMRShortRailMountUnder': 'Geissele HK Short 레일 마운트',
    'SPEARHandguard': 'MCX Spear 핸드가드',
    'SPEARSuppressor': 'MCX Spear 소음기',
    'SprutMount': 'Sprut Shotgun 마운트',
    'SR1MPSidemount': 'SR-1MP Quad 레일 마운트',
    'SR1MPSuppressor': 'SR-1MP 소음기',
    'SR2MSuppressor': 'SR-2M 소음기',
    'SR3MSuppressor': 'SR-3M 소음기',
    'SV98Bipod': 'SV-98 양각대',
    'SV98Suppressor': 'SV-98 소음기',
    'SVDAdapter': 'SVD 어댑터 System',
    'SVDButtstock': 'SVDS Polymer 개머리판',
    'SVDCover': 'SVD Custom Cut 먼지 덮개',
    'SVDHandguard': 'SVD 핸드가드',
    'SVDMK1ChassisUpperBand': 'Upper Band / MK1 Chassis',
    'SVDStock': 'SVD Stock',
    'SVTMount': 'SVT-40 Addley Precision Steel 조준경 마운트',
    'SVTOptic': 'SVT-40 & AVT-40 PU 조준경',
    'SVTStock': 'SVT-40 SVD Style 개머리판',
    'Tourniquet': 'CAT 지혈대',
    'TRGHandguard': 'TRG M10 핸드가드',
    'TRGPad': 'TRG M10 Grip Pad',
    'UCPMount': 'HK UCP Rear Sight 레일 마운트',
    'UCPPistolgrip': 'HK UCP Tactical Grip Glove',
    'UCPSuppressor': 'HK UCP 소음기',
    'UCSPad': '완충 패드',
    'UlitmaMount': 'Ultima Top 레일 마운트',
    'UltimaHndgrd': 'Ultima Polymer Fore 개머리판',
    'UltimaPistolgrip': 'Ultima 피스톨 그립',
    'UltimaStock': 'Ultima Polymer 개머리판',
    'UMSButtstock': 'Phase5 Universal Mini 개머리판',
    'URXPanel': 'KAC URX Panel',
    'URXPanel2': 'KAC URX Panel',
    'URXStopper': 'KAC URX Stopper Panel',
    'USBM': 'Universal Shotgun 마운트',
    'USPMount': 'HK USP Red Dot Sight 마운트',
    'VALAdapter': 'AS VAL 피스톨 그립 어댑터',
    'VALButtstock': 'AS VAL 개머리판',
    'VectorStock': 'Vector Folding 개머리판',
    'VestHolster': '권총 홀스터',
    'Visor': '바이저 (안면 보호대)',
    'VPO101Cover': 'VPO-101 먼지 덮개',
    'VSSCover': '커버',
    'VSSHandguard': '핸드가드',
    'VSSMount': '6P29M 마운트',
    'VSSRearsight': 'VSS/VAL 가늠자',
    'WalkieTalkie': '무전기',
    'weaponFlashlight': '전술 조명',
    'weaponFlashlightFifth': '전술 장비',
    'weaponFlashlightFirst': '전술 레이저 / 조명',
    'weaponFlashlightFourth': '전술 장비',
    'weaponFlashlightSecond': '전술 조명',
    'weaponFlashlightThird': '전술 장비',
    'weaponMuzzleAK74': '5.45x39mm 총구 / 소음기',
    'weaponMuzzleAKM': '7.62x39mm 총구 / 소음기',
    'weaponMuzzleM4': '5.56mm 총구 부착물 / 소음기',
    'weaponOptics': '조준경 / 마운트',
    'weaponOpticsAK': 'AK 도브테일 조준경 / 마운트',
    'weaponOpticsMosin': 'weapon Optics Mosin',
    'weaponOpticsSecond': '보조 조준경',
    'weaponWrap': '총기 랩',
    'WF501B': 'WF-501B 전술 조명',
    'X17Receiver': 'X-17 하부 리시버',
    'XM109Muzzle': '25x59mm 총구 부착물 / 소음기'
};

// 하위 분류 식별자 한국어 라벨 매핑 사전 (프레젠테이션 레이어)
const SUBCATEGORY_LABELS = {
    'scope_mount': '조준경 마운트',
    'stock_adapter': '개머리판 어댑터',
    'flashlight_mount': '플래시라이트 마운트',
    'bipod_adapter': '바이포드 어댑터',
    'rail_panel': '기타 레일/패널',
    'rear_sight': '가늠자',
    'front_sight': '가늠쇠',
    'carry_handle': '캐링 핸들',
    'ar15_m4': 'AR-15 / M4 계열',
    'ak': 'AK 계열',
    'picatinny': '피카티니 규격',
    'micro_dot': '권총 / 마이크로 도트',
    'dovetail': 'AK 도브테일',
    'visor': '안면 바이저',
    'armor_plate': '증가 장갑판',
    'mandible': '턱 보호구',
    'mlok': 'M-LOK 규격',
    'keymod': 'KeyMod 규격',
    'urx': 'URX 규격',
    'ar15_upper': 'AR-15 상부 리시버',
    'ak_dustcover': 'AK 더스트 커버',
    'pistol_slide': '권총 슬라이드',
    'buffer_tube': 'AR-15 / 버퍼 튜브 규격',
    'custom': '전용 총기 규격',
    'chassis': '샤시 일체형',
    '556_ar15': '5.56mm / AR-15 규격',
    '762_ar10': '7.62mm / AR-10 규격',
    'heavy_shotgun': '대구경 / 산탄총 규격',
    'pistol_smg_other': '권총 / SMG / 기타',
    'multi_caliber': '멀티 캘리버',
    'other': '기타'
};

function getSubCategoryLabel(item) {
    if (!item) return '';
    const sub = typeof item === 'string' ? item : item.subCategory;
    if (!sub) return '';
    const cat = typeof item === 'object' ? item.category : '';

    if ((cat === 'buttstock' || cat === '개머리판') && sub === 'ak') return 'AK 계열 규격';
    if ((cat === 'muzzle_device' || cat === 'suppressor' || cat === '소염기 / 머즐' || cat === '소음기') && sub === 'ak') return 'AK 계열 규격';
    if ((cat === 'pistol_grip' || cat === '권총 손잡이') && sub === 'other') return '기타 총기류';
    if ((cat === 'receiver' || cat === '리시버') && sub === 'other') return '기타 총기 리시버';

    return SUBCATEGORY_LABELS[sub] || sub;
}

// 슬롯 그룹 매핑 (동일 규격의 1번/2번/3번 슬롯들을 하나의 대표 그룹으로 묶음)
const slotGroupMap = {
    // 전방 손잡이 (동일 번호/규격)
    'Grip': 'grip_group',
    'GripCASV': 'grip_group',
    'GripThird': 'grip_group',
    'GripFourth': 'grip_group',

    // 전술 조명 (1번~11번 및 범용 조명)
    'weaponFlashlight': 'flashlight_group',
    'weaponFlashlightFirst': 'flashlight_group',
    'weaponFlashlightSecond': 'flashlight_group',
    'weaponFlashlightThird': 'flashlight_group',
    'weaponFlashlightFourth': 'flashlight_group',
    'weaponFlashlightFifth': 'flashlight_group',
    'weaponFlashlightSix': 'flashlight_group',
    'weaponFlashlightSeven': 'flashlight_group',
    'weaponFlashlightEight': 'flashlight_group',
    'weaponFlashlightNine': 'flashlight_group',
    'weaponFlashlightTen': 'flashlight_group',
    'weaponFlashlightEleven': 'flashlight_group',
    'Flashlight': 'flashlight_group',

    // DD 레일 커버 1, 2
    'DDCover': 'ddcover_group',
    'DDCover2': 'ddcover_group',

    // URX 패널 1, 2
    'URXPanel': 'urxpanel_group',
    'URXPanel2': 'urxpanel_group',

    // RAPTAR 레이저 1, 2
    'RAPTAR': 'raptar_group',
    'RAPTARSecond': 'raptar_group'
};

// 그룹 정의 (표시 이름 및 포함되는 슬롯 키 목록)
const slotGroupDefinitions = {
    'grip_group': {
        name: '전방 손잡이',
        slots: ['Grip', 'GripCASV', 'GripThird', 'GripFourth']
    },
    'flashlight_group': {
        name: '전술 조명',
        slots: [
            'weaponFlashlight', 'weaponFlashlightFirst', 'weaponFlashlightSecond',
            'weaponFlashlightThird', 'weaponFlashlightFourth', 'weaponFlashlightFifth',
            'weaponFlashlightSix', 'weaponFlashlightSeven', 'weaponFlashlightEight',
            'weaponFlashlightNine', 'weaponFlashlightTen', 'weaponFlashlightEleven',
            'Flashlight'
        ]
    },
    'ddcover_group': {
        name: 'DD 레일 커버',
        slots: ['DDCover', 'DDCover2']
    },
    'urxpanel_group': {
        name: 'URX 패널',
        slots: ['URXPanel', 'URXPanel2']
    },
    'raptar_group': {
        name: 'RAPTAR 레이저',
        slots: ['RAPTAR', 'RAPTARSecond']
    }
};

// 슬롯명 표시 라벨 반환
function getSlotDisplayName(slotName) {
    if (!slotName) return '';
    if (slotNameMap[slotName]) {
        return slotNameMap[slotName];
    }
    return slotName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
}

// 전체 데이터베이스 아이템 수집
function getAllDatabaseItems() {
    const items = [];
    if (typeof weaponsData !== 'undefined' && weaponsData) {
        items.push(...Object.values(weaponsData).flat());
    }
    if (typeof gearData !== 'undefined' && gearData) {
        items.push(...Object.values(gearData).flat());
    }
    if (typeof attachmentData !== 'undefined' && attachmentData) {
        items.push(...Object.values(attachmentData).flat());
    }
    return items;
}

function getItemClassIds(item) {
    if (!item) return [];
    const ids = [];
    if (item.id) ids.push(item.id);
    if (Array.isArray(item.color)) {
        item.color.forEach(variant => {
            if (variant && variant.id) ids.push(variant.id);
        });
    }
    return [...new Set(ids)];
}

function constraintContainsItem(constraintIds, item) {
    if (!Array.isArray(constraintIds)) return false;
    const itemIds = getItemClassIds(item);
    return itemIds.some(id => constraintIds.includes(id));
}

function getDatabaseItemByConstraintId(id) {
    return getAllDatabaseItems().find(item => getItemClassIds(item).includes(id)) || null;
}

function getItemsByConstraintIds(ids) {
    if (!Array.isArray(ids)) return [];
    const idSet = new Set(ids);
    const seen = new Set();
    return getAllDatabaseItems().filter(item => {
        if (!item || seen.has(item.id) || !getItemClassIds(item).some(id => idSet.has(id))) return false;
        seen.add(item.id);
        return true;
    });
}

function getConditionalRulesForSlot(parentItem, slot) {
    const bySlot = parentItem?.conditionalAttachmentsBySlot;
    return bySlot && Array.isArray(bySlot[slot]) ? bySlot[slot] : [];
}

// 장착 상태가 조건을 만족하는지 확인한다.
function isConditionalCompatibilityRuleActive(rule, equippedBySlot = {}) {
    if (!rule || !Array.isArray(rule.conditions)) return false;
    return rule.conditions.every(condition => {
        if (condition.type !== 'attachment' || condition.operator !== 'isKindOf') return false;
        const rawEquipped = equippedBySlot[condition.slot];
        const equipped = Array.isArray(rawEquipped) ? rawEquipped : (rawEquipped ? [rawEquipped] : []);
        const hasMatchingKind = equipped.some(item => constraintContainsItem(condition.items, item));
        return condition.present ? hasMatchingKind : !hasMatchingKind;
    });
}

function getActiveConditionalRule(parentItem, slot, equippedBySlot = {}) {
    return getConditionalRulesForSlot(parentItem, slot)
        .find(rule => isConditionalCompatibilityRuleActive(rule, equippedBySlot)) || null;
}

function getConditionLabel(rule) {
    if (!rule || !Array.isArray(rule.conditions)) return '';
    return rule.conditions.map(condition => {
        const conditionItem = Array.isArray(condition.items)
            ? getDatabaseItemByConstraintId(condition.items[0])
            : null;
        const itemName = conditionItem?.name || getSlotDisplayName(condition.slot);
        return condition.present ? `${itemName} 장착 시` : '기본 장착';
    }).filter(Boolean).join(' + ');
}

// config.cpp 슬롯 매칭 후 런타임 CanPutAsAttachment / CanReceiveAttachment
// 클래스 제약까지 양방향으로 확인한다. 빈 allow 목록은 명시적인 호환 대상 없음이다.
function isRuntimeAttachmentCompatible(parentItem, attachmentItem, candidateSlots = null, equippedBySlot = {}) {
    if (!parentItem || !attachmentItem) return false;

    if (Array.isArray(attachmentItem.allowedParents) &&
        !constraintContainsItem(attachmentItem.allowedParents, parentItem)) {
        return false;
    }
    if (constraintContainsItem(attachmentItem.deniedParents, parentItem)) {
        return false;
    }
    if (Array.isArray(parentItem.allowedAttachments) &&
        !constraintContainsItem(parentItem.allowedAttachments, attachmentItem)) {
        return false;
    }
    if (constraintContainsItem(parentItem.deniedAttachments, attachmentItem)) {
        return false;
    }

    const parentSlots = new Set(Array.isArray(parentItem.attachmentSlots) ? parentItem.attachmentSlots : []);
    const requestedSlots = candidateSlots ? new Set(candidateSlots) : null;
    const sharedSlots = (Array.isArray(attachmentItem.inventorySlots) ? attachmentItem.inventorySlots : [])
        .filter(slot => parentSlots.has(slot) && (!requestedSlots || requestedSlots.has(slot)));
    if (sharedSlots.length === 0) return false;

    return sharedSlots.some(slot => {
        const allowedBySlot = parentItem.allowedAttachmentsBySlot;
        if (allowedBySlot && Object.prototype.hasOwnProperty.call(allowedBySlot, slot) &&
            !constraintContainsItem(allowedBySlot[slot], attachmentItem)) {
            return false;
        }
        const deniedBySlot = parentItem.deniedAttachmentsBySlot;
        if (deniedBySlot && Object.prototype.hasOwnProperty.call(deniedBySlot, slot) &&
            constraintContainsItem(deniedBySlot[slot], attachmentItem)) {
            return false;
        }
        const activeConditionalRule = getActiveConditionalRule(parentItem, slot, equippedBySlot);
        if (activeConditionalRule) {
            if (Array.isArray(activeConditionalRule.allowed) &&
                !constraintContainsItem(activeConditionalRule.allowed, attachmentItem)) {
                return false;
            }
            if (constraintContainsItem(activeConditionalRule.denied, attachmentItem)) {
                return false;
            }
        }
        return true;
    });
}

// 복수 슬롯 키 중 하나라도 만족하고 런타임 제약도 통과하는 아이템 목록
function getItemsForSlotKeys(slotKeys, parentItem = null) {
    const all = getAllDatabaseItems();
    const results = [];
    const seen = new Set();
    const keysSet = new Set(slotKeys);
    for (const item of all) {
        if (item && Array.isArray(item.inventorySlots)) {
            if (item.inventorySlots.some(s => keysSet.has(s)) &&
                (!parentItem || isRuntimeAttachmentCompatible(parentItem, item, slotKeys))) {
                if (!seen.has(item.id)) {
                    seen.add(item.id);
                    results.push(item);
                }
            }
        }
    }
    return results;
}


// 아이템의 attachmentSlots를 그룹화하여 중복 슬롯을 하나로 통합 (부모가 실제 보유한 슬롯만 안전하게 검색)
function getGroupedAttachmentSlots(rawSlots) {
    if (!Array.isArray(rawSlots)) return [];
    const groups = [];
    const seenGroupIds = new Set();
    const rawSlotsSet = new Set(rawSlots);

    for (const slot of rawSlots) {
        const groupId = slotGroupMap[slot];
        if (groupId && slotGroupDefinitions[groupId]) {
            if (!seenGroupIds.has(groupId)) {
                seenGroupIds.add(groupId);
                const groupDef = slotGroupDefinitions[groupId];
                // 중요: 부모 아이템이 실제로 가지고 있는 슬롯들만 필터링(교집합)하여 검색 대상 지정
                const activeSlotsInParent = groupDef.slots.filter(s => rawSlotsSet.has(s));
                groups.push({
                    id: groupId,
                    name: groupDef.name,
                    slotKeys: activeSlotsInParent
                });
            }
        } else {
            const singleId = 'single_' + slot;
            if (!seenGroupIds.has(singleId)) {
                seenGroupIds.add(singleId);
                groups.push({
                    id: singleId,
                    name: getSlotDisplayName(slot),
                    slotKeys: [slot]
                });
            }
        }
    }
    return groups;
}

// 아이템의 패널 타입 및 카테고리 자동 판별
function getItemTypeAndCategory(item) {
    if (!item) return { panelType: 'weapon', category: 'all' };
    if (item.category && typeof attachmentData !== 'undefined' && attachmentData[item.category]) {
        return { panelType: 'attachment', category: item.category };
    }
    if (item.category && typeof gearData !== 'undefined' && gearData[item.category]) {
        return { panelType: 'gear', category: item.category };
    }
    if (item.category && typeof weaponsData !== 'undefined' && weaponsData[item.category]) {
        return { panelType: 'weapon', category: item.category };
    }

    if (typeof attachmentData !== 'undefined') {
        for (const [cat, list] of Object.entries(attachmentData)) {
            if (list.some(x => x.id === item.id)) return { panelType: 'attachment', category: cat };
        }
    }
    if (typeof gearData !== 'undefined') {
        for (const [cat, list] of Object.entries(gearData)) {
            if (list.some(x => x.id === item.id)) return { panelType: 'gear', category: cat };
        }
    }
    if (typeof weaponsData !== 'undefined') {
        for (const [cat, list] of Object.entries(weaponsData)) {
            if (list.some(x => x.id === item.id)) return { panelType: 'weapon', category: cat };
        }
    }
    return { panelType: 'attachment', category: item.category || 'all' };
}

// 아이템 상세 화면 자동 렌더링
function showItemDetailAuto(item, categoryKey, galleryIndex = 0) {
    const info = getItemTypeAndCategory(item);
    const cat = categoryKey || info.category;
    if (info.panelType === 'gear') {
        showGearDetail(item, cat, galleryIndex);
    } else if (info.panelType === 'weapon') {
        showWeaponDetail(item, cat, galleryIndex);
    } else {
        showAttachmentDetail(item, cat, galleryIndex);
    }
}

// 네비게이션 스택 푸시
function pushNavState(viewState) {
    if (isNavigatingHistory) return;
    if (!viewState || viewState.type === 'empty') return;
    history.replaceState(viewState, '', window.location.hash || '');
    navStack.push(viewState);
}

// 현재 렌더링된 화면 상태를 브라우저 History에 등록
function recordCurrentViewHistory(hash = '') {
    if (isNavigatingHistory) return;
    const currentView = captureCurrentView();
    if (!currentView || currentView.type === 'empty') return;
    if (!history.state) {
        history.replaceState(currentView, '', hash || window.location.hash || '');
    } else {
        history.pushState(currentView, '', hash);
    }
    updateFloatingNav();
}

// 네비게이션 스택 팝 (이전 화면으로 복귀)
function popNavState() {
    if (window.history.length > 1 && (navStack.length > 0 || currentWeapon || preSearchView)) {
        window.history.back();
    } else {
        if (preSearchView) {
            const view = preSearchView;
            preSearchView = null;
            const searchInput = document.getElementById('itemSearch');
            if (searchInput) searchInput.value = '';
            restoreView(view);
            updateFloatingNav();
            return;
        }
        backToGrid();
        updateFloatingNav();
    }
}

function isSubGridCategory(categoryKey) {
    if (!categoryKey || typeof categoryKey !== 'string') return false;
    return categoryKey.startsWith('slot_group_') ||
           categoryKey.startsWith('weapon_magazines_') ||
           categoryKey.startsWith('parent_cat_');
}

// 최초 루트 그리드/목록으로 한 번에 복귀
function resetToRootGrid() {
    let targetView = null;
    if (Array.isArray(navStack) && navStack.length > 0) {
        const rootInStack = navStack.find(s => s && s.type === 'grid' && !isSubGridCategory(s.categoryKey));
        if (rootInStack) {
            targetView = rootInStack;
        }
    }
    if (!targetView && rootGridState) {
        targetView = { ...rootGridState, type: 'grid' };
    }
    if (!targetView && Array.isArray(navStack) && navStack.length > 0 && navStack[0]?.type === 'grid') {
        targetView = navStack[0];
    }

    navStack = [];
    preSearchView = null;
    compareTarget = null;

    const searchInput = document.getElementById('itemSearch');
    if (searchInput && targetView?.categoryKey !== 'search') {
        searchInput.value = '';
    }

    if (targetView) {
        restoreView(targetView);
        lastGridState = {
            title: targetView.title,
            items: targetView.items,
            categoryKey: targetView.categoryKey,
            panelType: targetView.panelType,
            searchQuery: targetView.searchQuery || '',
            sortMetric: targetView.sortMetric,
            sortOrder: targetView.sortOrder,
            activeChips: targetView.activeChips
        };
    } else {
        renderItemGrid('all', 'weapon');
    }

    try {
        history.pushState(captureCurrentView(), '', window.location.pathname);
    } catch (e) {}

    updateFloatingNav();
}

// 호환 아이템 그리드 표시
function showSlotGroupAttachments(parentItem, groupName, slotKeys) {
    pushNavState(captureCurrentView());
    const matchedItems = getItemsForSlotKeys(slotKeys, parentItem);
    const parentName = parentItem && parentItem.name ? parentItem.name : '';
    const fullTitle = parentName ? `${parentName} > ${groupName}` : groupName;
    showGridView(fullTitle, matchedItems, 'slot_group_' + slotKeys[0], 'attachment');
    recordCurrentViewHistory('');
}


// 장착 가능한 부착물 슬롯 UI 섹션 생성 (동일 종류 통합 렌더링 + 호환 탄창 포함)
function createAttachmentSlotsSection(item) {
    const rawSlots = Array.isArray(item?.attachmentSlots) ? item.attachmentSlots : [];
    const groupedSlots = getGroupedAttachmentSlots(rawSlots);
    const magazineGroups = getMagazineCompatibilityGroups(item);

    if (groupedSlots.length === 0 && magazineGroups.length === 0) {
        return null;
    }

    const container = document.createElement('div');
    container.className = 'attachment-slots-container';

    const header = document.createElement('div');
    header.className = 'weapon-stats-header';
    const title = document.createElement('h3');
    title.className = 'weapon-stats-title';
    title.textContent = '이 아이템에 장착 가능한 부착물';
    header.appendChild(title);
    container.appendChild(header);

    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'attachment-slots-grid';

    groupedSlots.forEach(group => {
        const matchedItems = getItemsForSlotKeys(group.slotKeys, item);
        const count = matchedItems.length;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'attachment-slot-btn';
        if (count === 0) {
            btn.classList.add('empty-slot');
        }

        const slotLabel = document.createElement('span');
        slotLabel.className = 'slot-label';
        slotLabel.textContent = group.name;

        const slotCount = document.createElement('span');
        slotCount.className = 'slot-count';
        slotCount.textContent = `(${count})`;

        btn.appendChild(slotLabel);
        btn.appendChild(slotCount);

        btn.onclick = () => {
            showSlotGroupAttachments(item, group.name, group.slotKeys);
        };

        slotsGrid.appendChild(btn);
    });

    magazineGroups.forEach((magazineGroup, groupIndex) => {
        const matchedMags = magazineGroup.items;
        const magBtn = document.createElement('button');
        magBtn.type = 'button';
        magBtn.className = 'attachment-slot-btn weapon-mag-btn';
        if (magazineGroup.conditional) magBtn.classList.add('conditional-slot-btn');

        const magLabel = document.createElement('span');
        magLabel.className = 'slot-label';
        magLabel.textContent = magazineGroup.label;

        const magCount = document.createElement('span');
        magCount.className = 'slot-count';
        magCount.textContent = `(${matchedMags.length})`;

        magBtn.appendChild(magLabel);
        magBtn.appendChild(magCount);

        magBtn.onclick = () => {
            pushNavState(captureCurrentView());
            const fullTitle = item.name ? `${item.name} > ${magazineGroup.label}` : magazineGroup.label;
            showGridView(fullTitle, matchedMags, `weapon_magazines_${item.id}_${groupIndex}`, 'attachment');
        };

        slotsGrid.appendChild(magBtn);
    });

    container.appendChild(slotsGrid);
    return container;
}

// 특정 총기에서 사용 가능한 탄창 아이템 목록 검색
function getCompatibleMagazinesForWeapon(weapon) {
    if (!weapon || !Array.isArray(weapon.magazines) || weapon.magazines.length === 0) {
        return [];
    }
    const activeRule = getActiveConditionalRule(weapon, 'magazine', {});
    const magIdSet = new Set(activeRule?.allowed || weapon.magazines);
    const allItems = getAllDatabaseItems();
    const matchedMags = [];
    const seen = new Set();

    for (const item of allItems) {
        if (!item || item.id === weapon.id) continue;
        const isMatch = magIdSet.has(item.id) || (Array.isArray(item.color) && item.color.some(c => magIdSet.has(c.id)));
        if (isMatch) {
            if (!seen.has(item.id)) {
                seen.add(item.id);
                matchedMags.push(item);
            }
        }
    }
    return matchedMags;
}

function getMagazineCompatibilityGroups(weapon) {
    if (!weapon || !Array.isArray(weapon.magazines) || weapon.magazines.length === 0) return [];
    const rules = getConditionalRulesForSlot(weapon, 'magazine');
    if (rules.length === 0) {
        const items = getCompatibleMagazinesForWeapon(weapon);
        return items.length ? [{ label: '탄창', items, conditional: false, rule: null }] : [];
    }

    const groups = [];
    const seen = new Set();
    rules.forEach(rule => {
        const items = getItemsByConstraintIds(rule.allowed);
        const label = getConditionLabel(rule) || '조건부 장착';
        const key = `${label}:${items.map(item => item.id).sort().join(',')}`;
        if (items.length === 0 || seen.has(key)) return;
        seen.add(key);
        groups.push({
            label: label === '기본 장착' ? '탄창 (기본)' : `탄창 (${label})`,
            items,
            conditional: label !== '기본 장착',
            rule
        });
    });
    return groups;
}

function getWeaponMagazineCompatibility(weapon, targetItem) {
    const rules = getConditionalRulesForSlot(weapon, 'magazine');
    if (rules.length === 0) {
        const targetIds = getItemClassIds(targetItem);
        return {
            compatible: Array.isArray(weapon.magazines) && weapon.magazines.some(id => targetIds.includes(id)),
            note: ''
        };
    }
    const matchingRules = rules.filter(rule => constraintContainsItem(rule.allowed, targetItem));
    if (matchingRules.length === 0) return { compatible: false, note: '' };
    const defaultRule = getActiveConditionalRule(weapon, 'magazine', {});
    if (defaultRule && matchingRules.includes(defaultRule)) return { compatible: true, note: '' };
    return {
        compatible: true,
        note: matchingRules.map(getConditionLabel).filter(Boolean).join(' / ')
    };
}

// 특정 아이템을 장착할 수 있는 상위 부모 아이템 목록 필터링 (슬롯 및 탄창 양방향 지원)
function getCompatibleParentItems(targetItem) {
    if (!targetItem) return [];
    const allItems = getAllDatabaseItems();
    const parentMatches = [];
    const seen = new Set();

    // 1. 슬롯 기반 매칭 (inventorySlots ↔ attachmentSlots)
    if (Array.isArray(targetItem.inventorySlots) && targetItem.inventorySlots.length > 0) {
        const targetSlotsSet = new Set(targetItem.inventorySlots);
        for (const item of allItems) {
            if (!item || item.id === targetItem.id) continue;
            if (Array.isArray(item.attachmentSlots) &&
                item.attachmentSlots.some(s => targetSlotsSet.has(s)) &&
                isRuntimeAttachmentCompatible(item, targetItem)) {
                if (!seen.has(item.id)) {
                    seen.add(item.id);
                    parentMatches.push(item);
                }
            }
        }
    }

    // 2. 탄창 전용 매칭 (targetItem.id ↔ weapon.magazines)
    if (typeof weaponsData !== 'undefined' && weaponsData) {
        const allWeapons = Object.values(weaponsData).flat();
        for (const weapon of allWeapons) {
            if (!weapon || weapon.id === targetItem.id) continue;
            const compatibility = getWeaponMagazineCompatibility(weapon, targetItem);
            if (compatibility.compatible) {
                if (!seen.has(weapon.id)) {
                    seen.add(weapon.id);
                    parentMatches.push(compatibility.note
                        ? { ...weapon, compatibilityNote: compatibility.note }
                        : weapon);
                }
            }
        }
    }

    return parentMatches;
}

// 상위 부모 아이템들을 카테고리별로 그룹화 및 정렬
function getGroupedParentCategories(targetItem) {
    const parentItems = getCompatibleParentItems(targetItem);
    if (parentItems.length === 0) return [];

    const categoryMap = new Map();
    for (const item of parentItems) {
        const itemInfo = getItemTypeAndCategory(item);
        const catName = item.category || itemInfo.category || '기타';
        if (!categoryMap.has(catName)) {
            categoryMap.set(catName, {
                category: catName,
                panelType: itemInfo.panelType,
                items: []
            });
        }
        categoryMap.get(catName).items.push(item);
    }

    // 패널 우선순위 (무기 -> 기어 -> 부착물)
    const panelPriority = { 'weapon': 1, 'gear': 2, 'attachment': 3 };
    const groups = Array.from(categoryMap.values());
    groups.sort((a, b) => {
        const pA = panelPriority[a.panelType] || 99;
        const pB = panelPriority[b.panelType] || 99;
        if (pA !== pB) return pA - pB;
        const labelA = getCategoryLabel(a.category);
        const labelB = getCategoryLabel(b.category);
        return labelA.localeCompare(labelB, 'ko');
    });

    return groups;
}

// 상위 아이템 그리드 표시
function showParentCategoryItems(sourceItem, categoryName, items, panelType) {
    pushNavState(captureCurrentView());
    const sourceName = sourceItem && sourceItem.name ? sourceItem.name : '';
    const catLabel = getCategoryLabel(categoryName);
    const fullTitle = sourceName ? `${sourceName} > ${catLabel}` : catLabel;
    showGridView(fullTitle, items, 'parent_cat_' + categoryName, panelType || 'weapon');
    recordCurrentViewHistory('');
}

// 이 아이템을 장착할 수 있는 아이템 (상위 아이템) 슬롯 UI 섹션 생성
function createParentCompatibleSection(item) {
    if (!item) return null;

    const groupedCategories = getGroupedParentCategories(item);
    if (groupedCategories.length === 0) {
        return null;
    }

    const container = document.createElement('div');
    container.className = 'attachment-slots-container parent-compatible-container';

    const header = document.createElement('div');
    header.className = 'weapon-stats-header';
    const title = document.createElement('h3');
    title.className = 'weapon-stats-title';
    title.textContent = '이 아이템을 장착할 수 있는 대상';
    header.appendChild(title);
    container.appendChild(header);

    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'attachment-slots-grid';

    groupedCategories.forEach(group => {
        const count = group.items.length;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'attachment-slot-btn parent-slot-btn';
        if (count === 0) {
            btn.classList.add('empty-slot');
        }

        const slotLabel = document.createElement('span');
        slotLabel.className = 'slot-label';
        slotLabel.textContent = getCategoryLabel(group.category);

        const slotCount = document.createElement('span');
        slotCount.className = 'slot-count';
        slotCount.textContent = `(${count})`;

        btn.appendChild(slotLabel);
        btn.appendChild(slotCount);

        btn.onclick = () => {
            showParentCategoryItems(item, group.category, group.items, group.panelType);
        };

        slotsGrid.appendChild(btn);
    });

    container.appendChild(slotsGrid);
    return container;
}



function saveAppState() {
    const state = {
        panel: currentPanel,
        category: currentCategory,
        itemId: currentWeapon ? currentWeapon.id : (currentGear ? currentGear.id : null),
        galleryIndex: lastGalleryImageIndex
    };
    sessionStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

function restoreAppState() {
    const raw = sessionStorage.getItem(APP_STATE_KEY);
    if (!raw) return false;
    try {
        const state = JSON.parse(raw);
        if (state.panel) {
            switchPanel(state.panel);
        }
        const showDetail = (it, cat) => {
            if (state.panel === 'gear') {
                showGearDetail(it, cat, state.galleryIndex || 0);
            } else if (state.panel === 'attachment') {
                showAttachmentDetail(it, cat, state.galleryIndex || 0);
            } else {
                showWeaponDetail(it, cat, state.galleryIndex || 0);
            }
        };
        if (state.category && state.category !== 'search' && state.itemId) {
            const dataSource = state.panel === 'gear' ? gearData : (state.panel === 'attachment' ? attachmentData : weaponsData);
            if (state.category === 'all') {
                for (const cat of Object.keys(dataSource)) {
                    const it = dataSource[cat].find(x => x.id === state.itemId);
                    if (it) {
                        renderItemGrid('all', state.panel);
                        showDetail(it, 'all');
                        return true;
                    }
                }
            } else if (dataSource[state.category]) {
                const it = dataSource[state.category].find(x => x.id === state.itemId);
                if (it) {
                    renderItemGrid(state.category, state.panel);
                    showDetail(it, state.category);
                    return true;
                }
            }
        }
    } catch(e) {}
    return false;
}

let currentDropdownPanel = null;

function showDropdownPanel(panel) {
    currentDropdownPanel = panel;
    const weaponPanel = document.getElementById('weaponPanel');
    const gearPanel = document.getElementById('gearPanel');
    const attachmentPanel = document.getElementById('attachmentPanel');
    
    if (weaponPanel) weaponPanel.style.display = panel === 'weapon' ? 'block' : 'none';
    if (gearPanel) gearPanel.style.display = panel === 'gear' ? 'block' : 'none';
    if (attachmentPanel) attachmentPanel.style.display = panel === 'attachment' ? 'block' : 'none';

    const dropdown = document.getElementById('categoryDropdown');
    if (dropdown && dropdown.classList.contains('open')) {
        document.querySelectorAll('.panel-btn').forEach(btn => {
            btn.classList.toggle('dropdown-open', btn.dataset.panel === panel);
        });
    }
}

function switchPanel(panel) {
    currentPanel = panel;
    saveAppState();
    
    document.querySelectorAll('.panel-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.panel === panel);
    });
    
    showDropdownPanel(panel);
    
    clearDetail();
    
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) searchInput.value = '';
}


function createWebSearchButton(itemName) {
    const link = document.createElement('a');
    link.href = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(itemName)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'item-web-search-btn';
    link.title = 'Google 이미지에서 검색';
    link.setAttribute('aria-label', `${itemName} Google 이미지 검색`);
    link.innerHTML = `
        <svg class="item-web-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
    `;
    return link;
}

function arrangeDetailCard(card, item, categoryKey, panelType) {
    const toolbar = document.createElement('div');
    toolbar.className = 'detail-toolbar';
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'detail-back-btn';
    backButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg><span>이전으로</span>';
    backButton.title = '직전에 보던 화면으로 돌아가기';
    backButton.addEventListener('click', popNavState);
    const context = document.createElement('div');
    context.className = 'detail-context';
    const panelLabel = document.createElement('span');
    panelLabel.textContent = { weapon: 'SMPZ 웨폰', attachment: 'SMPZ 부착물', gear: 'SMPZ 기어' }[panelType];
    const category = document.createElement('span');
    category.className = 'detail-category';
    category.textContent = getCategoryLabel(item.category || categoryKey);
    context.append(panelLabel, category);
    const searchLink = card.querySelector('.item-web-search-btn');
    if (searchLink) context.appendChild(searchLink);
    toolbar.append(backButton, context);
    card.prepend(toolbar);

    const heading = card.querySelector('.weapon-detail-name-container');
    const gallery = card.querySelector('.gallery-panel-wrapper');
    const descriptionContainer = card.querySelector('.weapon-detail-description-container');
    const stats = card.querySelector('.weapon-stats-container');
    const compatibility = [...card.querySelectorAll('.attachment-slots-container')];
    const filterPanel = card.querySelector('.gear-filter-charge-panel');

    const layout = document.createElement('div');
    layout.className = 'detail-overview';
    const media = document.createElement('div');
    media.className = 'detail-media-column';
    media.appendChild(gallery);

    const description = descriptionContainer.querySelector('.weapon-detail-description, .weapon-description-placeholder');
    if (description) {
        const section = document.createElement('section');
        section.className = 'detail-description-section';
        const title = document.createElement('h3');
        title.className = 'weapon-stats-title';
        title.textContent = '아이템 소개';
        if (description.classList.contains('weapon-description-placeholder')) {
            description.textContent = '등록된 설명이 없습니다.';
        }
        section.append(title, description);
        media.appendChild(section);
    }
    layout.appendChild(media);

    if (stats) {
        const list = stats.querySelector('.weapon-stats-list');
        // 수치 행과 뒤따르는 게이지를 하나의 항목으로 묶는다.
        [...list.children].forEach(row => {
            if (!row.classList.contains('weapon-stat-row')) return;
            const metric = document.createElement('div');
            metric.className = 'detail-stat-item';
            row.before(metric);
            metric.appendChild(row);
            while (metric.nextElementSibling?.matches('.weapon-stat-bar, .detail-compare-value')) {
                metric.appendChild(metric.nextElementSibling);
                metric.classList.add('detail-stat-item-meter');
            }
        });
        if (panelType === 'weapon' && compareTarget?.weapon && compareTarget.weapon.id !== item.id) {
            const legend = document.createElement('div');
            legend.className = 'detail-compare-legend';
            [`기준 · ${item.name}`, `비교 · ${compareTarget.weapon.name}`, '초록: 비교 대상 우세 · 빨강: 비교 대상 열세'].forEach(text => {
                const line = document.createElement('span');
                line.textContent = text;
                legend.appendChild(line);
            });
            list.before(legend);
        }
        layout.appendChild(stats);
    } else {
        layout.classList.add('detail-overview-no-stats');
    }

    const related = document.createElement('div');
    related.className = 'detail-related';
    related.append(...compatibility);
    if (filterPanel) related.prepend(filterPanel);
    descriptionContainer.remove();

    const sectionNav = document.createElement('nav');
    sectionNav.className = 'detail-section-nav';
    sectionNav.setAttribute('aria-label', '상세 정보 바로가기');
    const sections = [{ label: '개요', target: gallery }];
    if (stats) sections.push({ label: '능력치', target: stats });
    if (related.children.length) sections.push({ label: '호환 정보', target: related });
    sections.forEach(({ label, target }, index) => {
        target.id = `detail-section-${index}`;
        target.tabIndex = -1;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.setAttribute('aria-controls', target.id);
        button.addEventListener('click', () => {
            target.focus({ preventScroll: true });
            target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
        });
        sectionNav.appendChild(button);
    });
    heading.after(sectionNav);
    card.appendChild(layout);
    if (related.children.length) card.appendChild(related);
}

function showAttachmentDetail(attachment, categoryKey, initialGalleryIndex = 0) {
    const weaponDetail = showDetailContainer();
    currentCategory = categoryKey;
    currentWeapon = attachment;
    lastGalleryImageIndex = initialGalleryIndex;
    saveAppState();

    document.querySelectorAll('.grid-card').forEach(item => {
        item.classList.remove('active');
        if ((item.dataset.weaponId || item.dataset.itemId) === attachment.id) {
            item.classList.add('active');
        }
    });

    weaponDetail.innerHTML = '';
    const detailCard = document.createElement('div');
    detailCard.className = 'weapon-detail-card';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'weapon-detail-name-container';
    const name = document.createElement('h2');
    name.className = 'weapon-detail-name';
    const nameWrap = document.createElement('div');
    nameWrap.className = 'weapon-name-wrap';
    const nameText = document.createElement('span');
    nameText.className = 'weapon-name-text';
    nameText.textContent = attachment.name;
    nameWrap.appendChild(nameText);
    nameWrap.appendChild(createWebSearchButton(attachment.name));
    name.appendChild(nameWrap);
    nameContainer.appendChild(name);
    detailCard.appendChild(nameContainer);
    
    
    const imagePanel = createImagePanelWithArrows(attachment, attachment.name, initialGalleryIndex, (idx) => {
        lastGalleryImageIndex = idx;
        saveAppState();
    });
    detailCard.appendChild(imagePanel);
    
    const descContainer = document.createElement('div');
    descContainer.className = 'weapon-detail-description-container';
    if (attachment.description) {
        const desc = document.createElement('div');
        desc.className = 'weapon-detail-description';
        desc.innerHTML = attachment.description;
        descContainer.appendChild(desc);
    } else {
        descContainer.innerHTML = '<div class="weapon-description-placeholder">해당 부착물의 설명</div>';
    }
    detailCard.appendChild(descContainer);
    
    const hasAttachmentStats = Boolean(attachment.stats);
    const hasAttachmentSpecs = Boolean(attachment.itemSize || attachment.itemSlots || attachment.cargoSize || attachment.cargoSlots);
    if (hasAttachmentStats || hasAttachmentSpecs) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'weapon-stats-container';
        
        const statsHeader = document.createElement('div');
        statsHeader.className = 'weapon-stats-header';
        const statsTitle = document.createElement('h3');
        statsTitle.className = 'weapon-stats-title';
        statsTitle.textContent = '능력치';
        statsHeader.appendChild(statsTitle);
        statsContainer.appendChild(statsHeader);
        
        const statsList = document.createElement('div');
        statsList.className = 'weapon-stats-list';

        // 카테고리 표시
        const catRow = document.createElement('div');
        catRow.className = 'weapon-stat-row';
        const catLabel = document.createElement('span');
        catLabel.className = 'weapon-stat-label';
        catLabel.textContent = '카테고리:';
        const catValue = document.createElement('span');
        catValue.className = 'weapon-stat-value';
        catValue.textContent = getCategoryLabel(attachment.category) || getCategoryLabel(categoryKey) || '-';
        catRow.appendChild(catLabel);
        catRow.appendChild(catValue);
        statsList.appendChild(catRow);
        
        if (attachment.stats) {
            const statLabels = {
                'recoil': '반동',
                'sway': '흔들림',
                'weight': '무게',
                'capacity': '탄창 용량',
                'magnification': '배율'
            };
            
            Object.keys(attachment.stats).forEach(key => {
                if (key === 'lightDistance' || key === 'velocityMultiplier') return;
                const row = document.createElement('div');
                row.className = 'weapon-stat-row';
                
                const label = document.createElement('span');
                label.className = 'weapon-stat-label';
                label.textContent = `${statLabels[key] || key}:`;
                
                const value = document.createElement('span');
                value.className = 'weapon-stat-value';
                const raw = attachment.stats[key];
                let displayVal = '-';
                if (raw !== undefined && raw !== null && raw !== '') {
                    if (key === 'capacity') {
                        displayVal = `${raw}발`;
                    } else if (key === 'weight') {
                        displayVal = `${raw}g`;
                    } else if (key === 'recoil' || key === 'sway') {
                        displayVal = typeof raw === 'number' ? `${raw > 0 ? '+' : ''}${raw}%` : String(raw);
                    } else if (key === 'magnification') {
                        displayVal = formatMagnification(raw);
                    } else {
                        displayVal = String(raw);
                    }
                }
                value.textContent = displayVal;
                
                row.appendChild(label);
                row.appendChild(value);
                statsList.appendChild(row);
            });
        }

        appendItemSpecRows(statsList, attachment);

        statsContainer.appendChild(statsList);

        const statsParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        statsParent.appendChild(statsContainer);
    }

    const slotsSection = createAttachmentSlotsSection(attachment);
    if (slotsSection) {
        const slotsParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        slotsParent.appendChild(slotsSection);
    }

    const parentSection = createParentCompatibleSection(attachment);
    if (parentSection) {
        const slotsParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        slotsParent.appendChild(parentSection);
    }
    
    arrangeDetailCard(detailCard, attachment, categoryKey, 'attachment');
    weaponDetail.appendChild(detailCard);
    updateFloatingNav();
    recordCurrentViewHistory('#' + attachment.id);
}


// 카테고리 드롭다운 내 현재 선택된 항목 하이라이트 갱신
function updateCategoryDropdownActive() {
    const activePanel = currentGridPanelType || currentPanel;
    const activeCategory = currentGridCategoryKey || currentCategory || 'all';

    document.querySelectorAll('.category-item').forEach(li => {
        const itemPanel = li.dataset.panelType;
        const itemCat = li.dataset.category;
        const link = li.querySelector('.category-link');
        if (link) {
            const isActive = (itemPanel === activePanel && itemCat === activeCategory);
            link.classList.toggle('active', isActive);
        }
    });
}

// 카테고리 드롭다운 열기/닫기 (상단바 버튼 클릭 시 내려오는 목록)
function openDropdown(panel) {
    if (panel) {
        showDropdownPanel(panel);
    }
    updateCategoryDropdownActive();
    const dropdown = document.getElementById('categoryDropdown');
    if (dropdown) dropdown.classList.add('open');
    document.querySelectorAll('.panel-btn').forEach(btn => {
        btn.classList.toggle('dropdown-open', btn.dataset.panel === (panel || currentDropdownPanel));
    });
}

function closeDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    if (dropdown) dropdown.classList.remove('open');
    currentDropdownPanel = null;
    document.querySelectorAll('.panel-btn').forEach(btn => {
        btn.classList.remove('dropdown-open');
    });
}

// 그리드/상세 영역 전환 헬퍼
function showDetailContainer() {
    const gridView = document.getElementById('gridView');
    const isFromGrid = gridView && gridView.style.display !== 'none';
    if (isFromGrid) {
        lastGridScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    if (gridView) gridView.style.display = 'none';
    const weaponDetail = document.getElementById('weaponDetail');
    weaponDetail.style.display = 'flex';

    if (isFromGrid) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    return weaponDetail;
}

// 플로팅 네비게이션 독 갱신 (이전으로 / 목록으로 / 맨 위로)
function updateFloatingNav() {
    let dock = document.getElementById('floatingNav');
    if (!dock) {
        dock = document.createElement('nav');
        dock.id = 'floatingNav';
        dock.className = 'floating-nav-dock';
        dock.setAttribute('aria-label', '화면 이동');
        document.body.appendChild(dock);
    }

    dock.innerHTML = '';

    const isDetailView = !!currentWeapon;
    const hasNavStack = navStack.length > 0;
    const hasPreSearch = !!preSearchView;

    // "목록으로" 버튼 노출 조건 (상세 화면 또는 서브 네비게이션 시 최상위 목록 복귀)
    const showRoot = hasNavStack || isDetailView || hasPreSearch;
    
    // 현재 스크롤 위치 (맨 위로 버튼 노출 판단용)
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const isScrolled = scrollY > 120;

    // 네비게이션 액션도 없고 스크롤도 안 된 경우 숨김
    if (!showRoot && !isScrolled) {
        dock.classList.remove('visible');
        return;
    }

    let hasAnyBtn = false;

    // 1. "목록으로" 버튼 (최초 목록으로 원클릭 복귀)
    if (showRoot) {
        const btnRoot = document.createElement('button');
        btnRoot.type = 'button';
        btnRoot.className = 'floating-nav-btn primary';
        btnRoot.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>목록으로</span>
        `;
        btnRoot.title = '최초 목록으로 돌아가기';
        btnRoot.onclick = (e) => {
            e.preventDefault();
            resetToRootGrid();
        };
        dock.appendChild(btnRoot);
        hasAnyBtn = true;
    }

    // 2. 구분선 및 "맨 위로" 버튼
    if (hasAnyBtn && isScrolled) {
        const divider = document.createElement('div');
        divider.className = 'floating-nav-divider';
        dock.appendChild(divider);
    }

    if (isScrolled) {
        const btnTop = document.createElement('button');
        btnTop.type = 'button';
        btnTop.className = 'floating-nav-btn floating-top-btn';
        btnTop.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        btnTop.title = '맨 위로 스크롤';
        btnTop.onclick = (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        dock.appendChild(btnTop);
        hasAnyBtn = true;
    }

    if (hasAnyBtn) {
        dock.classList.add('visible');
    } else {
        dock.classList.remove('visible');
    }
}


// 마지막으로 표시된 그리드 상태 (상세 화면에서 "목록으로" 이동 시 사용)
let lastGridState = null;
let rootGridState = null;

// 검색 시작 직전의 화면 상태 (검색창을 비우면 이 화면으로 복귀)
let preSearchView = null;

// 현재 그리드에 로드된 원본 아이템 목록 및 인라인 검색 상태
let currentGridRawItems = [];
let currentGridCategoryKey = null;
let currentGridPanelType = null;
let currentGridSortMetric = 'name';
let currentGridSortOrder = 'asc';
let currentGridActiveChips = new Set();

// ===========================================================================
// 데이터 정규화 및 정렬/필터 엔진
// ===========================================================================

const ATTACHMENT_CATEGORY_SET = new Set([
    'gas_block', 'buttstock', 'optic_scope', 'pistol_grip', 'iron_sight', 'reflex_sight',
    'laser_pointer', 'receiver', 'mount', 'trigger', 'buffer_tube', 'muzzle_device',
    'suppressor', 'bipod', 'charging_handle', 'foregrip', 'tactical_flashlight', 'barrel',
    'magazine', 'hammer', 'handguard',
    '가스 블록', '개머리판', '광학 조준경', '권총 손잡이', '기계식 조준기', '도트/홀로그램',
    '레이저 표적기', '리시버', '마운트', '방아쇠', '버퍼 튜브', '소염기 / 머즐',
    '소음기', '양각대', '장전 손잡이', '전방 손잡이', '전술 플래시', '총열', '탄창', '해머', '핸드가드'
]);

function isAttachmentItem(item) {
    if (!item) return false;
    if (item.category && ATTACHMENT_CATEGORY_SET.has(item.category)) return true;
    if (typeof attachmentData !== 'undefined' && item.category && attachmentData[item.category]) return true;
    return false;
}

function isWeaponItem(item) {
    if (!item) return false;
    if (typeof weaponsData !== 'undefined' && item.category && weaponsData[item.category]) return true;
    return false;
}

function isGearItem(item) {
    if (!item) return false;
    if (typeof gearData !== 'undefined' && item.category && gearData[item.category]) return true;
    return false;
}

const DataParsers = {
    weight: (item) => {
        const val = item?.stats?.weight;
        if (typeof val === 'number') return val;
        if (!val) return null;
        const str = String(val).toLowerCase();
        const num = parseFloat(str.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return null;
        if (str.includes('kg')) return num * 1000;
        return num;
    },
    capacity: (item) => {
        const val = item?.stats?.capacity;
        if (typeof val === 'number') return val;
        if (!val) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
    },
    // 부착물 반동 보정율 (-% 값, 없는 부착물은 0%)
    recoilReduction: (item) => {
        if (!isAttachmentItem(item)) return null;
        const val = item?.stats?.recoil;
        if (val !== undefined && val !== null && val !== '') {
            if (typeof val === 'number') return val;
            const str = String(val).trim();
            const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
            return isNaN(num) ? null : num;
        }
        return 0;
    },
    // 부착물 흔들림 보정율 (음수일수록 우수, 없는 부착물은 0%, 양수는 페널티)
    swayReduction: (item) => {
        if (!isAttachmentItem(item)) return null;
        const val = item?.stats?.sway;
        if (val !== undefined && val !== null && val !== '') {
            if (typeof val === 'number') return val;
            const str = String(val).trim();
            const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
            return isNaN(num) ? null : num;
        }
        return 0;
    },
    // 전술 플래시 조사 거리 (m 단위)
    lightDistance: (item) => {
        const val = item?.stats?.lightDistance;
        if (typeof val === 'number') return val;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    // 총기 기본 반동 (퍼센트 없는 수치)
    weaponRecoil: (item) => {
        if (!isWeaponItem(item)) return null;
        const val = item?.stats?.recoil;
        if (val === undefined || val === null || val === '') return null;
        const str = String(val).trim();
        if (str.includes('%')) return null;
        const num = parseFloat(str.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    // 총기 기본 흔들림 (퍼센트 없는 수치)
    weaponSway: (item) => {
        if (!isWeaponItem(item)) return null;
        const val = item?.stats?.sway;
        if (val === undefined || val === null || val === '') return null;
        const str = String(val).trim();
        if (str.includes('%')) return null;
        const num = parseFloat(str.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    accuracy: (item) => {
        if (!isWeaponItem(item)) return null;
        const val = item?.stats?.accuracy;
        if (typeof val === 'number') return val;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    velocity: (item) => {
        if (!isWeaponItem(item)) return null;
        if (item?.stats?.velocity) {
            const num = parseFloat(String(item.stats.velocity).replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) return num;
        }
        const cal = item?.calibers?.[0];
        const baseSpeed = cal ? (CALIBER_BASE_SPEEDS[cal] || (cal === '7.62x51mm' ? CALIBER_BASE_SPEEDS['.308 WIN'] : 0)) : 0;
        const mult = item?.stats?.velocityMultiplier !== undefined ? item.stats.velocityMultiplier : 1.0;
        return baseSpeed > 0 ? Math.round(baseSpeed * mult) : null;
    },
    ergonomics: (item) => {
        if (!isWeaponItem(item)) return null;
        const val = item?.stats?.ergonomics;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    bulletProtection: (item) => {
        const val = item?.stats?.bulletDamageProtection;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    healthProtection: (item) => {
        const val = item?.stats?.healthDamageProtection;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    shockProtection: (item) => {
        const val = item?.stats?.shockDamageProtection;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    hitpoints: (item) => {
        const val = item?.stats?.hitpoints;
        if (!val) return null;
        const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
        return isNaN(num) ? null : num;
    },
    itemSlots: (item) => {
        return (item?.itemSlots !== undefined && item?.itemSlots !== null) ? Number(item.itemSlots) : null;
    },
    cargoSlots: (item) => {
        return (item?.cargoSlots !== undefined && item?.cargoSlots !== null) ? Number(item.cargoSlots) : null;
    },
    magnification: (item) => {
        const mag = item?.stats?.magnification;
        if (!mag && mag !== 0) return null;
        if (typeof mag === 'number') return mag;
        if (Array.isArray(mag)) {
            return mag.length > 0 ? Math.max(...mag) : null;
        }
        const m = /(\d+(?:\.\d+)?)/g;
        const matches = [...String(mag).matchAll(m)].map(x => parseFloat(x[0]));
        return matches.length > 0 ? Math.max(...matches) : null;
    },
    has3dModel: (item) => {
        return Boolean(item?.model || item?.model3d);
    },
    canBePainted: (item) => {
        return Boolean(item?.canBePainted || (Array.isArray(item?.color) && item.color.some(c => c.canBePainted))) ? 1 : 0;
    }
};

// 정렬 기준 설정
const SORT_METRICS = {
    name: {
        id: 'name',
        label: '이름',
        group: 'common',
        defaultOrder: 'asc',
        compare: (a, b, order) => {
            const res = (a.name || '').localeCompare(b.name || '', 'ko', { numeric: true, sensitivity: 'base' });
            return order === 'desc' ? -res : res;
        },
        badge: null
    },
    category: {
        id: 'category',
        label: '종류',
        group: 'common',
        defaultOrder: 'asc',
        compare: (a, b, order) => {
            const catA = getCategoryLabel(a.category) || a.category || '';
            const catB = getCategoryLabel(b.category) || b.category || '';
            const res = catA.localeCompare(catB, 'ko', { numeric: true, sensitivity: 'base' });
            if (res !== 0) {
                return order === 'desc' ? -res : res;
            }
            return (a.name || '').localeCompare(b.name || '', 'ko', { numeric: true, sensitivity: 'base' });
        },
        badge: (item) => item?.category ? getCategoryLabel(item.category) : null
    },
    weight: {
        id: 'weight',
        label: '무게',
        group: 'common',
        parser: DataParsers.weight,
        defaultOrder: 'asc',
        badge: (item) => item?.stats?.weight ? `${item.stats.weight}g` : null
    },
    item_slots: {
        id: 'item_slots',
        label: '크기',
        group: 'common',
        parser: DataParsers.itemSlots,
        defaultOrder: 'asc',
        badge: (item, val) => val ? `${val}칸` : null
    },
    can_be_painted: {
        id: 'can_be_painted',
        label: '도색 가능',
        group: 'common',
        parser: DataParsers.canBePainted,
        defaultOrder: 'desc',
        badge: (item, val) => val ? '도색 가능' : null
    },

    // 기어 수납
    cargo_slots: {
        id: 'cargo_slots',
        label: '수납 크기',
        group: 'gear',
        parser: DataParsers.cargoSlots,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `수납 ${val}칸` : null
    },

    // 부착물 성능 및 탄창
    capacity: {
        id: 'capacity',
        label: '탄창 용량',
        group: 'attachment',
        parser: DataParsers.capacity,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `${val}발` : null
    },

    // 부착물 성능
    recoil_reduction: {
        id: 'recoil_reduction',
        label: '반동 보정',
        group: 'attachment',
        parser: DataParsers.recoilReduction,
        defaultOrder: 'asc',
        badge: (item) => item?.stats?.recoil !== undefined ? `반동 ${typeof item.stats.recoil === 'number' ? `${item.stats.recoil > 0 ? '+' : ''}${item.stats.recoil}%` : item.stats.recoil}` : (isAttachmentItem(item) ? '반동 0%' : null)
    },
    sway_reduction: {
        id: 'sway_reduction',
        label: '흔들림 보정',
        group: 'attachment',
        parser: DataParsers.swayReduction,
        defaultOrder: 'asc',
        badge: (item) => item?.stats?.sway !== undefined ? `흔들림 ${typeof item.stats.sway === 'number' ? `${item.stats.sway > 0 ? '+' : ''}${item.stats.sway}%` : item.stats.sway}` : (isAttachmentItem(item) ? '흔들림 0%' : null)
    },
    light_distance: {
        id: 'light_distance',
        label: '조사 거리',
        group: 'attachment',
        parser: DataParsers.lightDistance,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `${val}m` : null
    },
    magnification: {
        id: 'magnification',
        label: '조준경 배율',
        group: 'attachment',
        parser: DataParsers.magnification,
        defaultOrder: 'desc',
        badge: (item) => item?.stats?.magnification ? `배율 ${formatMagnification(item.stats.magnification)}` : null
    },

    // 방어구 성능
    bullet_protection: {
        id: 'bullet_protection',
        label: '방탄 보호율',
        group: 'gear',
        parser: DataParsers.bulletProtection,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `방탄 ${val}%` : null
    },
    health_protection: {
        id: 'health_protection',
        label: '체력 보호율',
        group: 'gear',
        parser: DataParsers.healthProtection,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `체력 ${val}%` : null
    },
    shock_protection: {
        id: 'shock_protection',
        label: '쇼크 보호율',
        group: 'gear',
        parser: DataParsers.shockProtection,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `쇼크 ${val}%` : null
    },
    hitpoints: {
        id: 'hitpoints',
        label: '내구도',
        group: 'gear',
        parser: DataParsers.hitpoints,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `내구도 ${val}` : null
    },

    // 총기 성능
    moa: {
        id: 'moa',
        label: 'MOA',
        group: 'weapon',
        parser: DataParsers.accuracy,
        defaultOrder: 'asc',
        badge: (item) => item?.stats?.accuracy ? `${item.stats.accuracy} MOA` : null
    },
    velocity: {
        id: 'velocity',
        label: '포구초속',
        group: 'weapon',
        parser: DataParsers.velocity,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `${val} m/s` : null
    },
    weapon_recoil: {
        id: 'weapon_recoil',
        label: '반동',
        group: 'weapon',
        parser: DataParsers.weaponRecoil,
        defaultOrder: 'asc',
        badge: (item) => item?.stats?.recoil ? `반동 ${item.stats.recoil}` : null
    },
    weapon_sway: {
        id: 'weapon_sway',
        label: '흔들림',
        group: 'weapon',
        parser: DataParsers.weaponSway,
        defaultOrder: 'asc',
        badge: (item) => item?.stats?.sway ? `흔들림 ${item.stats.sway}` : null
    },
    ergonomics: {
        id: 'ergonomics',
        label: '인체공학',
        group: 'weapon',
        parser: DataParsers.ergonomics,
        defaultOrder: 'desc',
        badge: (item, val) => val ? `에르고 ${val}` : null
    }
};

// 아이템이 지원/호환하는 모든 탄종 목록 추출 (data.js의 calibers 필드 직결)
function getItemCalibers(item) {
    if (!item?.calibers || !Array.isArray(item.calibers)) return [];
    return item.calibers;
}

// 단일/대표 탄종 문자열 반환 (UI 표시용)
function getItemCaliber(item) {
    const cals = getItemCalibers(item);
    return cals.length > 0 ? cals.join(', ') : null;
}

// 광학 조준경 배율 추출 (data.js의 stats.magnification 직결)
function getOpticMagnification(item) {
    return formatMagnification(item?.stats?.magnification);
}

// 대표 스펙 추출
function getItemCoreSpecs(item, categoryKey, panelType, activeMetricKey = currentGridSortMetric) {
    if (!item) return [];
    const specs = [];
    const cat = item.category || categoryKey || '';
    const pType = panelType || currentPanel;

    const isWeapon = pType === 'weapon' || Boolean(weaponsData[cat] || item.modes);

    // 1. 무기 (사용 탄종 - 탄종별 1칸씩 분리 표시)
    if (isWeapon) {
        const cals = getItemCalibers(item);
        cals.forEach(cal => {
            specs.push({ metricKey: 'caliber', label: '탄종', text: cal, tagClass: 'spec-caliber' });
        });
    }

    // 2. 전술 플래시 (조사 거리)
    if (cat === 'tactical_flashlight' || cat === '전술 플래시' || item.stats?.lightDistance) {
        const dist = item.stats?.lightDistance ? `${item.stats.lightDistance}m` : (DataParsers.lightDistance(item) ? `${DataParsers.lightDistance(item)}m` : null);
        if (dist) {
            specs.push({ metricKey: 'light_distance', label: '조사거리', text: dist, tagClass: 'spec-light' });
        }
    }

    // 3. 광학 조준경 및 도트/홀로그램 (배율)
    if (cat === 'optic_scope' || cat === 'reflex_sight' || cat === '광학 조준경' || cat === '도트/홀로그램') {
        const mag = getOpticMagnification(item);
        if (mag) {
            specs.push({ metricKey: 'magnification', label: '배율', text: mag, tagClass: 'spec-optic' });
        }
    }

    // 4. 기어 (방탄복, 헬멧, 가방, 체스트 리그 등)
    const isGear = pType === 'gear' || ['full_body_armor', 'plate_carrier', 'helmet', 'helmet_attachment', 'mask', 'backpack', 'chest_rig', '전신 방탄복', '플레이트 캐리어', '방탄복', '헬멧', '헬멧 부착물', '마스크', '백팩', '체스트 리그'].includes(cat);
    if (isGear) {
        const bProt = DataParsers.bulletProtection(item);
        const hProt = DataParsers.healthProtection(item);
        const sProt = DataParsers.shockProtection(item);
        const cargo = DataParsers.cargoSlots(item);

        if (bProt !== null && bProt > 0) {
            specs.push({ metricKey: 'bullet_protection', label: '방탄', text: `방탄 ${bProt}%`, tagClass: 'spec-armor' });
        }
        if (hProt !== null && hProt > 0) {
            specs.push({ metricKey: 'health_protection', label: '체력', text: `체력 ${hProt}%`, tagClass: 'spec-health' });
        }
        if (sProt !== null && sProt > 0) {
            specs.push({ metricKey: 'shock_protection', label: '쇼크', text: `쇼크 ${sProt}%`, tagClass: 'spec-shock' });
        }
        if (cargo && cargo > 0) {
            const cargoText = item.cargoSize ? `수납 ${formatSize(item.cargoSize)} (${cargo}칸)` : `수납 ${cargo}칸`;
            specs.push({ metricKey: 'cargo_slots', label: '수납', text: cargoText, tagClass: 'spec-cargo' });
        }
    }

    // 5. 탄창 (탄종 - 탄종별 1칸씩 분리 표시)
    if (cat === 'magazine' || cat === '탄창') {
        const cals = getItemCalibers(item);
        cals.forEach(cal => {
            if (!specs.some(s => s.metricKey === 'caliber' && s.text === cal)) {
                specs.push({ metricKey: 'caliber', label: '탄종', text: cal, tagClass: 'spec-caliber' });
            }
        });
    }

    // 6. 부착물 성능 (반동, 흔들림, 탄창 용량)
    const rec = item.stats?.recoil;
    const swy = item.stats?.sway;
    const cap = item.stats?.capacity;

    if (!isWeapon && rec !== undefined && rec !== null && rec !== 0) {
        const recText = typeof rec === 'number' ? `${rec > 0 ? '+' : ''}${rec}%` : String(rec);
        specs.push({ metricKey: 'recoil_reduction', label: '반동', text: `반동 ${recText}`, tagClass: 'spec-recoil' });
    }
    if (!isWeapon && swy !== undefined && swy !== null && swy !== 0) {
        const swyText = typeof swy === 'number' ? `${swy > 0 ? '+' : ''}${swy}%` : String(swy);
        specs.push({ metricKey: 'sway_reduction', label: '흔들림', text: `흔들림 ${swyText}`, tagClass: 'spec-sway' });
    }
    if (cap && !specs.some(s => s.metricKey === 'capacity')) {
        const capText = `${cap}발`;
        specs.push({ metricKey: 'capacity', label: '용량', text: capText, tagClass: 'spec-capacity' });
    }

    if (item.subCategory) {
        specs.push({ metricKey: 'sub_category', label: '분류', text: getSubCategoryLabel(item), tagClass: 'spec-mount' });
    }

    // 7. 현재 정렬 기준이 기본 스펙 목록에 없는 경우 동적으로 추가
    if (activeMetricKey && activeMetricKey !== 'name' && activeMetricKey !== 'category') {
        const alreadyHasMetric = specs.some(s => s.metricKey === activeMetricKey);
        if (!alreadyHasMetric) {
            if (isWeapon) {
                if (activeMetricKey === 'moa' && item.stats?.accuracy) {
                    specs.push({ metricKey: 'moa', label: 'MOA', text: `${item.stats.accuracy} MOA`, tagClass: 'spec-moa' });
                } else if (activeMetricKey === 'velocity') {
                    const vel = DataParsers.velocity(item);
                    if (vel !== null) {
                        specs.push({ metricKey: 'velocity', label: '탄속', text: `${vel} m/s`, tagClass: 'spec-velocity' });
                    }
                } else if (activeMetricKey === 'weapon_recoil' && item.stats?.recoil) {
                    specs.push({ metricKey: 'weapon_recoil', label: '반동', text: `반동 ${item.stats.recoil}`, tagClass: 'spec-recoil' });
                } else if (activeMetricKey === 'weapon_sway' && item.stats?.sway) {
                    specs.push({ metricKey: 'weapon_sway', label: '흔들림', text: `흔들림 ${item.stats.sway}`, tagClass: 'spec-sway' });
                } else if (activeMetricKey === 'ergonomics' && item.stats?.ergonomics) {
                    specs.push({ metricKey: 'ergonomics', label: '에르고', text: `에르고 ${item.stats.ergonomics}`, tagClass: 'spec-ergo' });
                }
            }
            if (activeMetricKey === 'weight' && item.stats?.weight) {
                specs.push({ metricKey: 'weight', label: '무게', text: `${item.stats.weight}g`, tagClass: 'spec-weight' });
            } else if (activeMetricKey === 'item_slots' && (item.itemSlots !== undefined && item.itemSlots !== null)) {
                const slotText = item.itemSize ? `${formatSize(item.itemSize)} (${item.itemSlots}칸)` : `${item.itemSlots}칸`;
                specs.push({ metricKey: 'item_slots', label: '크기', text: slotText, tagClass: 'spec-size' });
            } else if (activeMetricKey === 'hitpoints') {
                const hp = DataParsers.hitpoints(item);
                if (hp !== null) {
                    specs.push({ metricKey: 'hitpoints', label: '내구도', text: `내구도 ${hp}`, tagClass: 'spec-durability' });
                }
            } else if (activeMetricKey === 'cargo_slots') {
                const cargo = DataParsers.cargoSlots(item);
                if (cargo !== null && cargo > 0) {
                    const cargoText = item.cargoSize ? `수납 ${formatSize(item.cargoSize)} (${cargo}칸)` : `수납 ${cargo}칸`;
                    specs.push({ metricKey: 'cargo_slots', label: '수납', text: cargoText, tagClass: 'spec-cargo' });
                }
            }
        }
    }

    return specs;
}

// 정렬 그룹 설정
const SORT_GROUPS = [
    { key: 'common', label: '공통' },
    { key: 'attachment', label: '부착물' },
    { key: 'gear', label: '기어' },
    { key: 'weapon', label: '웨폰' }
];

// 고정 필터 칩 설정 (기어 및 무기 발사모드)
const STATIC_FILTER_CHIPS = [
    // 1. 무기 탭: 발사 모드 필터 (단발 전용, 점사, 연사)
    {
        id: 'mode_single',
        label: '단발 전용',
        group: 'mode',
        panels: ['weapon'],
        filter: (item) => {
            const m = item.modes || [];
            // 연사(FullAuto)가 없고 단발(Single/SemiAuto)만 가능한 단발 전용 화기
            return m.length > 0 && m.every(mode => ['Single', 'SemiAuto', 'Double'].includes(mode));
        }
    },
    {
        id: 'mode_burst',
        label: '점사',
        group: 'mode',
        panels: ['weapon'],
        filter: (item) => {
            const m = item.modes || [];
            return m.some(mode => mode === 'Burst');
        }
    },
    {
        id: 'mode_fullauto',
        label: '연사',
        group: 'mode',
        panels: ['weapon'],
        filter: (item) => {
            const m = item.modes || [];
            return m.some(mode => mode === 'FullAuto');
        }
    },

    // 2. 기어 탭: 방탄 및 수납 공간 보유 필터
    {
        id: 'is_armor',
        label: '방탄',
        group: 'gear',
        panels: ['gear'],
        filter: (item) => (DataParsers.bulletProtection(item) || 0) > 0
    },
    {
        id: 'gear_health_protection',
        label: '체력 보호',
        group: 'gear',
        panels: ['gear'],
        filter: (item) => (DataParsers.healthProtection(item) || 0) > 0
    },
    {
        id: 'is_storage',
        label: '수납 공간 보유',
        group: 'gear',
        panels: ['gear'],
        filter: (item) => (DataParsers.cargoSlots(item) || 0) > 0
    },

    // 3. 공통: 도색 가능 필터
    {
        id: 'can_be_painted',
        label: '도색 가능',
        group: 'paint',
        panels: ['weapon', 'gear', 'attachment'],
        filter: (item) => Boolean(item?.canBePainted || (Array.isArray(item?.color) && item.color.some(c => c.canBePainted)))
    },

    // 4. 무기 탭: 총열 조절 가능 필터
    {
        id: 'can_adjust_barrel',
        label: '총열 조절 가능',
        group: 'barrel',
        panels: ['weapon'],
        filter: (item) => Boolean(item?.canAdjustBarrel || (Array.isArray(item?.color) && item.color.some(c => c.canAdjustBarrel)))
    }
];

// 그리드 아이템 텍스트 필터링 헬퍼
function filterGridItems(items, query) {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(item => {
        const nameMatch = item.name && item.name.toLowerCase().includes(q);
        const keywordMatch = item.keyword && item.keyword.toLowerCase().includes(q);
        const mfgMatch = item.manufacturer && item.manufacturer.toLowerCase().includes(q);
        const catMatch = item.category && item.category.toLowerCase().includes(q);
        return nameMatch || keywordMatch || mfgMatch || catMatch;
    });
}

// 아이템 목록 정렬 함수 (2단계 정렬: metricKey + order)
function sortGridItemList(items, metricKey, order = 'desc') {
    const metric = SORT_METRICS[metricKey] || SORT_METRICS.name;

    return [...items].sort((a, b) => {
        if (metric.compare) {
            return metric.compare(a, b, order);
        }

        const valA = metric.parser(a);
        const valB = metric.parser(b);

        const aValid = valA !== null && valA !== undefined && !isNaN(valA);
        const bValid = valB !== null && valB !== undefined && !isNaN(valB);

        // 1. 둘 다 값이 없음 -> 2차 정렬 (이름순)
        if (!aValid && !bValid) {
            return (a.name || '').localeCompare(b.name || '', 'ko', { numeric: true, sensitivity: 'base' });
        }
        // 2. a만 없음 -> 뒤로
        if (!aValid) return 1;
        // 3. b만 없음 -> 뒤로
        if (!bValid) return -1;

        // 4. 값 비교
        if (valA !== valB) {
            return order === 'asc' ? valA - valB : valB - valA;
        }

        // 5. 동점 시 2차 정렬 (이름순)
        return (a.name || '').localeCompare(b.name || '', 'ko', { numeric: true, sensitivity: 'base' });
    });
}

// 특정 정렬 기준에 대해 현재 목록의 아이템 중 유효한 값이 존재하는지 확인
function hasAnyValidValueForMetric(items, metric) {
    if (metric.compare) return true; // 이름순은 항상 유효
    if (!items || items.length === 0) return false;

    if (metric.group === 'weapon' && !items.some(isWeaponItem)) return false;
    if (metric.group === 'attachment' && !items.some(isAttachmentItem)) return false;
    if (metric.group === 'gear' && !items.some(isGearItem)) return false;

    // 부착물 반동/흔들림의 경우, 실제로 stats에 관련 보정치/페널티 데이터가 1개라도 존재하는지 확인
    if (metric.id === 'recoil_reduction') {
        return items.some(item => {
            if (!isAttachmentItem(item)) return false;
            const str = String(item?.stats?.recoil || '').trim();
            return str.includes('%') || str.startsWith('-') || str.startsWith('+') || (typeof item?.stats?.recoil === 'number' && item.stats.recoil !== 0);
        });
    }
    if (metric.id === 'sway_reduction') {
        return items.some(item => {
            if (!isAttachmentItem(item)) return false;
            const str = String(item?.stats?.sway || '').trim();
            return str.includes('%') || str.startsWith('-') || str.startsWith('+') || (typeof item?.stats?.sway === 'number' && item.stats.sway !== 0);
        });
    }
    if (metric.id === 'magnification') {
        return items.some(item => {
            return (item.category === 'optic_scope' || item.category === 'reflex_sight' || item.category === '광학 조준경' || item.category === '도트/홀로그램' || Boolean(item?.stats?.magnification)) && DataParsers.magnification(item) !== null;
        });
    }
    if (metric.id === 'light_distance') {
        return items.some(item => {
            return (item.category === 'tactical_flashlight' || item.category === '전술 플래시' || Boolean(item?.stats?.lightDistance)) && DataParsers.lightDistance(item) !== null;
        });
    }
    if (metric.id === 'capacity') {
        return items.some(item => {
            return (item.category === 'magazine' || item.category === '탄창' || Boolean(item?.stats?.capacity)) && DataParsers.capacity(item) !== null;
        });
    }
    if (metric.id === 'bullet_protection' || metric.id === 'health_protection' || metric.id === 'shock_protection') {
        return items.some(item => {
            const val = metric.parser ? metric.parser(item) : null;
            return val !== null && val > 0;
        });
    }
    if (metric.id === 'can_be_painted') {
        return items.some(item => Boolean(item?.canBePainted || (Array.isArray(item?.color) && item.color.some(c => c.canBePainted))));
    }

    return items.some(item => {
        if (!metric.parser) return false;
        const val = metric.parser(item);
        return val !== null && val !== undefined && !isNaN(val);
    });
}

// 카테고리별 추천 기본 정렬 기준 및 방향 결정
function getCategoryDefaultSort(panelType, categoryKey) {
    if (categoryKey === 'magazine' || categoryKey === '탄창') {
        return { metric: 'capacity', order: 'desc' };
    }
    if (['foregrip', 'pistol_grip', 'suppressor', 'muzzle_device', 'buttstock', 'handguard', 'bipod', '전방 손잡이', '권총 손잡이', '소음기', '소염기 / 머즐', '개머리판', '핸드가드', '양각대'].includes(categoryKey)) {
        return { metric: 'recoil_reduction', order: 'asc' };
    }
    if (categoryKey === 'tactical_flashlight' || categoryKey === '전술 플래시') {
        return { metric: 'light_distance', order: 'desc' };
    }
    if (['helmet', 'helmet_attachment', 'full_body_armor', 'plate_carrier', 'mask', '헬멧', '헬멧 부착물', '전신 방탄복', '플레이트 캐리어', '마스크'].includes(categoryKey)) {
        return { metric: 'bullet_protection', order: 'desc' };
    }
    if (['backpack', 'chest_rig', '백팩', '체스트 리그'].includes(categoryKey)) {
        return { metric: 'cargo_slots', order: 'desc' };
    }
    return { metric: 'name', order: 'asc' };
}

// 정렬 옵션 드롭다운 갱신 (null만 있는 정렬 카테고리는 표시하지 않음)
function updateSortOptionsDropdown(panelType, categoryKey, preferredMetric, preferredOrder, items) {
    const metricSelect = document.getElementById('gridSortSelect');
    const orderSelect = document.getElementById('gridSortOrderSelect');
    if (!metricSelect) return;

    metricSelect.innerHTML = '';

    const itemsToCheck = items || currentGridRawItems || [];
    const defaultSort = getCategoryDefaultSort(panelType, categoryKey);

    const availableMetricIds = new Set();

    SORT_GROUPS.forEach(group => {
        const groupMetrics = Object.values(SORT_METRICS).filter(m => m.group === group.key);
        // 현재 아이템 목록에서 유효한 값이 1개라도 있는 설정만 필터링
        const validMetrics = groupMetrics.filter(metric => hasAnyValidValueForMetric(itemsToCheck, metric));
        if (validMetrics.length === 0) return;

        const optgroup = document.createElement('optgroup');
        optgroup.label = group.label;

        validMetrics.forEach(metric => {
            availableMetricIds.add(metric.id);
            const option = document.createElement('option');
            option.value = metric.id;
            option.textContent = metric.label;
            optgroup.appendChild(option);
        });

        metricSelect.appendChild(optgroup);
    });

    // 레거시 키 호환 지원 (예: 'name_desc' -> metric='name', order='desc')
    let reqMetric = preferredMetric;
    let reqOrder = preferredOrder;
    if (typeof reqMetric === 'string' && reqMetric.includes('_') && !SORT_METRICS[reqMetric]) {
        if (reqMetric.endsWith('_asc')) {
            const mKey = reqMetric.replace('_asc', '');
            reqMetric = mKey;
            reqOrder = 'asc';
        } else if (reqMetric.endsWith('_desc')) {
            const mKey = reqMetric.replace('_desc', '');
            reqMetric = mKey;
            reqOrder = 'desc';
        }
    }

    // 정렬 메트릭 결정
    let targetMetric = reqMetric || currentGridSortMetric || defaultSort.metric;
    if (!availableMetricIds.has(targetMetric)) {
        targetMetric = availableMetricIds.has(defaultSort.metric) ? defaultSort.metric : 'name';
    }

    // 정렬 방향 결정
    let targetOrder = reqOrder || currentGridSortOrder;
    if (!targetOrder) {
        targetOrder = SORT_METRICS[targetMetric]?.defaultOrder || defaultSort.order || 'desc';
    }

    currentGridSortMetric = targetMetric;
    currentGridSortOrder = targetOrder;

    metricSelect.value = currentGridSortMetric;
    if (orderSelect) {
        orderSelect.value = currentGridSortOrder;
    }
}

function createSubCategoryChipsRow(labelTitle, prefix, types, itemsToCheck) {
    const wrap = document.createElement('div');
    wrap.className = 'grid-filter-groups';

    const row = document.createElement('div');
    row.className = 'grid-filter-row';

    const label = document.createElement('span');
    label.className = 'grid-filter-row-label';
    label.textContent = `${labelTitle}:`;
    row.appendChild(label);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'grid-filter-chips-list';

    const counts = { all: itemsToCheck.length };
    types.forEach(t => {
        counts[t] = itemsToCheck.filter(it => it.subCategory === t).length;
    });

    const anySpecificActive = Array.from(currentGridActiveChips).some(id => id.startsWith(`${prefix}_`) && id !== `${prefix}_all`);

    const subChips = [
        { id: `${prefix}_all`, label: `전체 (${counts['all']})`, isAll: true },
        ...types.filter(t => (counts[t] || 0) > 0).map(t => {
            const labelText = getSubCategoryLabel({ subCategory: t, category: itemsToCheck[0]?.category });
            return {
                id: `${prefix}_${t}`,
                label: `${labelText} (${counts[t]})`,
                type: t
            };
        })
    ];

    subChips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = chip.isAll ? !anySpecificActive : currentGridActiveChips.has(chip.id);
        btn.className = `grid-filter-chip ${isActive ? 'active' : ''}`;
        btn.dataset.chipId = chip.id;
        btn.innerHTML = `<span>${chip.label}</span>`;

        btn.addEventListener('click', () => {
            if (chip.isAll) {
                Array.from(currentGridActiveChips).forEach(id => {
                    if (id.startsWith(`${prefix}_`)) currentGridActiveChips.delete(id);
                });
            } else {
                if (currentGridActiveChips.has(chip.id)) {
                    currentGridActiveChips.delete(chip.id);
                } else {
                    currentGridActiveChips.add(chip.id);
                }
            }

            const isAnySpecific = Array.from(currentGridActiveChips).some(id => id.startsWith(`${prefix}_`) && id !== `${prefix}_all`);
            chipsWrap.querySelectorAll('.grid-filter-chip').forEach(b => {
                const cId = b.dataset.chipId;
                if (cId === `${prefix}_all`) {
                    b.classList.toggle('active', !isAnySpecific);
                } else {
                    b.classList.toggle('active', currentGridActiveChips.has(cId));
                }
            });

            applyGridSortAndFilters();
        });

        chipsWrap.appendChild(btn);
    });

    row.appendChild(chipsWrap);
    wrap.appendChild(row);

    const traitRow = createTraitFilterRow(itemsToCheck);
    if (traitRow) {
        wrap.appendChild(traitRow);
    }

    return wrap;
}

function createTraitFilterRow(itemsToCheck) {
    const traitChips = STATIC_FILTER_CHIPS.filter(chip =>
        ['can_be_painted', 'can_adjust_barrel'].includes(chip.id) && itemsToCheck.some(item => chip.filter(item))
    );
    if (traitChips.length === 0) return null;

    const row = document.createElement('div');
    row.className = 'grid-filter-row';

    const label = document.createElement('span');
    label.className = 'grid-filter-row-label';
    label.textContent = '특성:';
    row.appendChild(label);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'grid-filter-chips-list';

    traitChips.forEach(chip => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `grid-filter-chip ${currentGridActiveChips.has(chip.id) ? 'active' : ''}`;
        btn.dataset.chipId = chip.id;
        btn.innerHTML = `<span>${chip.label}</span>`;

        btn.addEventListener('click', () => {
            if (currentGridActiveChips.has(chip.id)) {
                currentGridActiveChips.delete(chip.id);
                btn.classList.remove('active');
            } else {
                currentGridActiveChips.add(chip.id);
                btn.classList.add('active');
            }
            applyGridSortAndFilters();
        });

        chipsWrap.appendChild(btn);
    });

    row.appendChild(chipsWrap);
    return row;
}

// 빠른 필터 칩 바 갱신
function updateFilterChipsBar(panelType, categoryKey, items) {
    const container = document.getElementById('gridFilterChips');
    if (!container) return;
    container.innerHTML = '';

    const itemsToCheck = items || currentGridRawItems || [];
    const effectivePanel = (categoryKey === 'search' || panelType === 'search') ? 'all' : panelType;
    const isWeaponView = effectivePanel === 'weapon' || (effectivePanel === 'all' && itemsToCheck.some(it => !!it.modes || !!it.chamberableFrom));
    const isGearView = effectivePanel === 'gear';
    const isMagazineOnlyView = !isWeaponView && (categoryKey === 'magazine' || categoryKey === '탄창' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'magazine' || it.category === '탄창')));

    // 1. 무기 탭 필터
    if (isWeaponView) {
        const wrap = document.createElement('div');
        wrap.className = 'grid-filter-groups';

        // 1행: 사용 탄종
        const availableCalibers = Array.from(
            new Set(itemsToCheck.flatMap(getItemCalibers).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        if (availableCalibers.length > 0) {
            const calRow = document.createElement('div');
            calRow.className = 'grid-filter-row';

            const label = document.createElement('span');
            label.className = 'grid-filter-row-label';
            label.textContent = '사용 탄종:';
            calRow.appendChild(label);

            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'grid-filter-chips-list';

            availableCalibers.forEach(cal => {
                const chipId = `cal_${cal}`;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `grid-filter-chip grid-filter-chip-cal ${currentGridActiveChips.has(chipId) ? 'active' : ''}`;
                btn.dataset.chipId = chipId;
                btn.innerHTML = `<span>${cal}</span>`;

                btn.addEventListener('click', () => {
                    if (currentGridActiveChips.has(chipId)) {
                        currentGridActiveChips.delete(chipId);
                        btn.classList.remove('active');
                    } else {
                        currentGridActiveChips.add(chipId);
                        btn.classList.add('active');
                    }
                    applyGridSortAndFilters();
                });

                chipsWrap.appendChild(btn);
            });

            calRow.appendChild(chipsWrap);
            wrap.appendChild(calRow);
        }

        // 2행: 발사 모드
        const modeChips = STATIC_FILTER_CHIPS.filter(c => c.group === 'mode');
        const availableModes = modeChips.filter(chip => itemsToCheck.some(it => chip.filter(it)));

        if (availableModes.length > 0) {
            const modeRow = document.createElement('div');
            modeRow.className = 'grid-filter-row';

            const label = document.createElement('span');
            label.className = 'grid-filter-row-label';
            label.textContent = '발사 모드:';
            modeRow.appendChild(label);

            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'grid-filter-chips-list';

            availableModes.forEach(chip => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `grid-filter-chip ${currentGridActiveChips.has(chip.id) ? 'active' : ''}`;
                btn.dataset.chipId = chip.id;
                btn.innerHTML = `<span>${chip.label}</span>`;

                btn.addEventListener('click', () => {
                    if (currentGridActiveChips.has(chip.id)) {
                        currentGridActiveChips.delete(chip.id);
                        btn.classList.remove('active');
                    } else {
                        currentGridActiveChips.add(chip.id);
                        btn.classList.add('active');
                    }
                    applyGridSortAndFilters();
                });

                chipsWrap.appendChild(btn);
            });

            modeRow.appendChild(chipsWrap);
            wrap.appendChild(modeRow);
        }

        const traitRow = createTraitFilterRow(itemsToCheck);
        if (traitRow) {
            wrap.appendChild(traitRow);
        }

        container.appendChild(wrap);
        return;
    }

    // 2. 탄창 전용 탭/목록: 사용 탄종 필터 칩 바
    if (isMagazineOnlyView) {
        const wrap = document.createElement('div');
        wrap.className = 'grid-filter-groups';

        const availableCalibers = Array.from(
            new Set(itemsToCheck.flatMap(getItemCalibers).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        if (availableCalibers.length > 0) {
            const calRow = document.createElement('div');
            calRow.className = 'grid-filter-row';

            const label = document.createElement('span');
            label.className = 'grid-filter-row-label';
            label.textContent = '사용 탄종:';
            calRow.appendChild(label);

            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'grid-filter-chips-list';

            availableCalibers.forEach(cal => {
                const chipId = `cal_${cal}`;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `grid-filter-chip grid-filter-chip-cal ${currentGridActiveChips.has(chipId) ? 'active' : ''}`;
                btn.dataset.chipId = chipId;
                btn.innerHTML = `<span>${cal}</span>`;

                btn.addEventListener('click', () => {
                    if (currentGridActiveChips.has(chipId)) {
                        currentGridActiveChips.delete(chipId);
                        btn.classList.remove('active');
                    } else {
                        currentGridActiveChips.add(chipId);
                        btn.classList.add('active');
                    }
                    applyGridSortAndFilters();
                });

                chipsWrap.appendChild(btn);
            });

            calRow.appendChild(chipsWrap);
            wrap.appendChild(calRow);
        }

        const traitRow = createTraitFilterRow(itemsToCheck);
        if (traitRow) {
            wrap.appendChild(traitRow);
        }

        container.appendChild(wrap);
        return;
    }

    // 3. 기어 탭: 방탄 / 수납 공간 보유 / 도색 가능
    if (isGearView) {
        if (categoryKey === 'helmet_attachment' || categoryKey === '헬멧 부착물' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'helmet_attachment' || it.category === '헬멧 부착물'))) {
            const helmTypes = ['visor', 'armor_plate', 'mandible', 'other'];
            container.appendChild(createSubCategoryChipsRow('부착물 분류', 'helm', helmTypes, itemsToCheck));
            return;
        }

        const wrap = document.createElement('div');
        wrap.className = 'grid-filter-groups';

        const gearRow = document.createElement('div');
        gearRow.className = 'grid-filter-row';

        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'grid-filter-chips-list';

        const gearChips = STATIC_FILTER_CHIPS.filter(c => c.group === 'gear' || c.group === 'paint');
        gearChips.forEach(chip => {
            if (!itemsToCheck.some(it => chip.filter(it))) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `grid-filter-chip ${currentGridActiveChips.has(chip.id) ? 'active' : ''}`;
            btn.dataset.chipId = chip.id;
            btn.innerHTML = `<span>${chip.label}</span>`;

            btn.addEventListener('click', () => {
                if (currentGridActiveChips.has(chip.id)) {
                    currentGridActiveChips.delete(chip.id);
                    btn.classList.remove('active');
                } else {
                    currentGridActiveChips.add(chip.id);
                    btn.classList.add('active');
                }
                applyGridSortAndFilters();
            });

            chipsWrap.appendChild(btn);
        });

        gearRow.appendChild(chipsWrap);
        wrap.appendChild(gearRow);
        container.appendChild(wrap);
        return;
    }

    // 4. 마운트 전용 탭: 하위 분류 필터 칩 바
    const isMountOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'mount' || categoryKey === '마운트' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'mount' || it.category === '마운트')));

    if (isMountOnlyView) {
        const mountTypes = ['scope_mount', 'stock_adapter', 'flashlight_mount', 'bipod_adapter', 'rail_panel'];
        container.appendChild(createSubCategoryChipsRow('마운트 분류', 'mount', mountTypes, itemsToCheck));
        return;
    }

    // 5. 기계식 조준기 전용 탭: 하위 분류 필터 칩 바
    const isIronSightOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'iron_sight' || categoryKey === '기계식 조준기' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'iron_sight' || it.category === '기계식 조준기')));

    if (isIronSightOnlyView) {
        const sightTypes = ['rear_sight', 'front_sight', 'carry_handle'];
        container.appendChild(createSubCategoryChipsRow('조준기 분류', 'sight', sightTypes, itemsToCheck));
        return;
    }

    // 6. 권총 손잡이 전용 탭: 하위 분류 필터 칩 바
    const isPistolGripOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'pistol_grip' || categoryKey === '권총 손잡이' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'pistol_grip' || it.category === '권총 손잡이')));

    if (isPistolGripOnlyView) {
        const gripTypes = ['ar15_m4', 'ak', 'other'];
        container.appendChild(createSubCategoryChipsRow('손잡이 분류', 'grip', gripTypes, itemsToCheck));
        return;
    }

    // 7. 도트/홀로그램 전용 탭: 하위 분류 필터 칩 바
    const isDotSightOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'reflex_sight' || categoryKey === '도트/홀로그램' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'reflex_sight' || it.category === '도트/홀로그램')));

    if (isDotSightOnlyView) {
        const dotTypes = ['picatinny', 'micro_dot', 'dovetail'];
        container.appendChild(createSubCategoryChipsRow('도트/홀로그램 분류', 'dot', dotTypes, itemsToCheck));
        return;
    }

    // 8. 헬멧 부착물 전용 탭: 하위 분류 필터 칩 바
    const isHelmetAttachmentOnlyView = !isWeaponView && !isMagazineOnlyView && 
        (categoryKey === 'helmet_attachment' || categoryKey === '헬멧 부착물' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'helmet_attachment' || it.category === '헬멧 부착물')));

    if (isHelmetAttachmentOnlyView) {
        const helmTypes = ['visor', 'armor_plate', 'mandible', 'other'];
        container.appendChild(createSubCategoryChipsRow('부착물 분류', 'helm', helmTypes, itemsToCheck));
        return;
    }

    // 9. 전방 손잡이 전용 탭: 하위 분류 필터 칩 바
    const isForegripOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'foregrip' || categoryKey === '전방 손잡이' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'foregrip' || it.category === '전방 손잡이')));

    if (isForegripOnlyView) {
        const foregripTypes = ['picatinny', 'mlok', 'keymod', 'urx'];
        container.appendChild(createSubCategoryChipsRow('손잡이 규격', 'fgrip', foregripTypes, itemsToCheck));
        return;
    }

    // 10. 리시버 전용 탭: 하위 분류 필터 칩 바
    const isReceiverOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'receiver' || categoryKey === '리시버' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'receiver' || it.category === '리시버')));

    if (isReceiverOnlyView) {
        const receiverTypes = ['ar15_upper', 'ak_dustcover', 'pistol_slide', 'other'];
        container.appendChild(createSubCategoryChipsRow('리시버 분류', 'rcv', receiverTypes, itemsToCheck));
        return;
    }

    // 11. 개머리판 전용 탭: 하위 분류 필터 칩 바
    const isStockOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'buttstock' || categoryKey === '개머리판' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'buttstock' || it.category === '개머리판')));

    if (isStockOnlyView) {
        const stockTypes = ['buffer_tube', 'custom', 'ak', 'chassis'];
        container.appendChild(createSubCategoryChipsRow('개머리판 규격', 'stk', stockTypes, itemsToCheck));
        return;
    }

    // 12. 소염기 / 머즐 전용 탭: 하위 분류 필터 칩 바
    const isMuzzleOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'muzzle_device' || categoryKey === '소염기 / 머즐' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'muzzle_device' || it.category === '소염기 / 머즐')));

    if (isMuzzleOnlyView) {
        const muzzleTypes = ['556_ar15', '762_ar10', 'heavy_shotgun', 'multi_caliber', 'pistol_smg_other', 'ak'];
        container.appendChild(createSubCategoryChipsRow('머즐 규격', 'mzl', muzzleTypes, itemsToCheck));
        return;
    }

    // 13. 소음기 전용 탭: 하위 분류 필터 칩 바
    const isSuppressorOnlyView = !isWeaponView && !isMagazineOnlyView && !isGearView && 
        (categoryKey === 'suppressor' || categoryKey === '소음기' || (itemsToCheck.length > 0 && itemsToCheck.every(it => it.category === 'suppressor' || it.category === '소음기')));

    if (isSuppressorOnlyView) {
        const suppressorTypes = ['556_ar15', '762_ar10', 'heavy_shotgun', 'multi_caliber', 'pistol_smg_other', 'ak'];
        container.appendChild(createSubCategoryChipsRow('소음기 규격', 'sup', suppressorTypes, itemsToCheck));
        return;
    }

    // 14. 일반 카테고리 및 검색 뷰 기본 처리
    const traitRow = createTraitFilterRow(itemsToCheck);
    if (traitRow) {
        const wrap = document.createElement('div');
        wrap.className = 'grid-filter-groups';
        wrap.appendChild(traitRow);
        container.appendChild(wrap);
    }
}

// 그리드 정렬 및 필터 적용 메인 파이프라인
function applyGridSortAndFilters() {
    const gridCount = document.getElementById('gridCount');
    const resetBtn = document.getElementById('gridFilterResetBtn');
    const inlineInput = document.getElementById('gridInlineSearch');
    const searchQuery = inlineInput ? inlineInput.value.trim() : '';

    let items = currentGridRawItems || [];

    // 1. 검색어 필터링 (다중 검색어 AND)
    if (searchQuery) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
        items = items.filter(item => {
            const name = (item.name || '').toLowerCase();
            const id = (item.id || '').toLowerCase();
            const cat = (item.category || '').toLowerCase();
            const catLabel = getCategoryLabel(item.category).toLowerCase();
            const subKey = (item.subCategory || '').toLowerCase();
            const subLabel = getSubCategoryLabel(item).toLowerCase();
            const cal = (getItemCalibers(item) || []).join(' ').toLowerCase();
            const searchTarget = `${name} ${id} ${cat} ${catLabel} ${subKey} ${subLabel} ${cal}`;
            return terms.every(t => searchTarget.includes(t));
        });
    }

    // 2. 활성 필터 칩 적용 (탄종 OR, 발사모드 OR, 기어 AND)
    if (currentGridActiveChips.size > 0) {
        const activeCalibers = [];
        const activeModes = [];
        const activeGear = [];
        let activePaint = false;
        let activeBarrelAdjustment = false;
        const activeSubFilters = new Map();

        currentGridActiveChips.forEach(chipId => {
            if (chipId.startsWith('cal_')) {
                activeCalibers.push(chipId.replace('cal_', ''));
            } else if (chipId.startsWith('mode_')) {
                activeModes.push(chipId);
            } else if (chipId.startsWith('gear_') || chipId === 'is_armor' || chipId === 'is_storage') {
                activeGear.push(chipId);
            } else if (chipId === 'can_be_painted') {
                activePaint = true;
            } else if (chipId === 'can_adjust_barrel') {
                activeBarrelAdjustment = true;
            } else {
                const underscoreIdx = chipId.indexOf('_');
                if (underscoreIdx > 0) {
                    const prefix = chipId.substring(0, underscoreIdx);
                    const val = chipId.substring(underscoreIdx + 1);
                    if (val !== 'all') {
                        if (!activeSubFilters.has(prefix)) {
                            activeSubFilters.set(prefix, []);
                        }
                        activeSubFilters.get(prefix).push(val);
                    }
                }
            }
        });

        items = items.filter(item => {
            // 2-1. 탄종 필터 (선택된 탄종들 중 하나라도 일치하면 통과)
            if (activeCalibers.length > 0) {
                const itemCals = getItemCalibers(item);
                if (!itemCals || !itemCals.some(c => activeCalibers.includes(c))) {
                    return false;
                }
            }

            // 2-2. 발사 모드 필터 (선택된 발사모드들 중 하나라도 만족하면 통과)
            if (activeModes.length > 0) {
                const passMode = activeModes.some(mId => {
                    const chip = STATIC_FILTER_CHIPS.find(c => c.id === mId);
                    return chip ? chip.filter(item) : false;
                });
                if (!passMode) return false;
            }

            // 2-3. 기어 필터 (선택된 모든 기어 조건 충족)
            if (activeGear.length > 0) {
                const passGear = activeGear.every(gId => {
                    const chip = STATIC_FILTER_CHIPS.find(c => c.id === gId);
                    return chip ? chip.filter(item) : true;
                });
                if (!passGear) return false;
            }

            // 2-4. 하위 분류 필터 (선택된 하위 분류들 중 하나라도 일치하면 통과)
            if (activeSubFilters.size > 0) {
                for (const [prefix, vals] of activeSubFilters.entries()) {
                    const itemVal = item.subCategory;
                    if (!itemVal || !vals.includes(itemVal)) {
                        return false;
                    }
                }
            }

            // 2-5. 도색 가능 필터
            if (activePaint) {
                const passPaint = Boolean(item.canBePainted || (Array.isArray(item.color) && item.color.some(c => c.canBePainted)));
                if (!passPaint) return false;
            }

            // 2-6. 총열 조절 가능 필터
            if (activeBarrelAdjustment) {
                const passBarrelAdjustment = Boolean(item.canAdjustBarrel || (Array.isArray(item.color) && item.color.some(c => c.canAdjustBarrel)));
                if (!passBarrelAdjustment) return false;
            }

            return true;
        });
    }

    // 3. 정렬 적용 (2단계 정렬: metric + order)
    const sortedItems = sortGridItemList(items, currentGridSortMetric, currentGridSortOrder);

    // 4. 개수 텍스트 업데이트
    const isFiltered = searchQuery || currentGridActiveChips.size > 0;
    if (gridCount) {
        if (isFiltered) {
            gridCount.textContent = `조건 결과 ${sortedItems.length}개 / 전체 ${currentGridRawItems.length}개`;
        } else {
            gridCount.textContent = `${currentGridRawItems.length}개`;
        }
    }

    // 5. 필터 초기화 버튼 표시 여부
    const isDefaultSort = currentGridSortMetric === 'name' && currentGridSortOrder === 'asc';
    if (resetBtn) {
        resetBtn.style.display = (isFiltered || !isDefaultSort) ? 'flex' : 'none';
    }

    // 6. 렌더링
    renderGridCards(sortedItems, currentGridCategoryKey, currentGridPanelType);

    if (lastGridState) {
        lastGridState.searchQuery = searchQuery;
        lastGridState.sortMetric = currentGridSortMetric;
        lastGridState.sortOrder = currentGridSortOrder;
        lastGridState.activeChips = Array.from(currentGridActiveChips);
    }
}

// 그리드 카드 렌더링 헬퍼
function renderGridCards(items, categoryKey, panelType) {
    const grid = document.getElementById('itemGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!items || items.length === 0) {
        grid.innerHTML = '<p class="empty-message">조건에 부합하는 항목이 없습니다.</p>';
        return;
    }

    items.forEach(item => {
        grid.appendChild(createGridCard(item, categoryKey, panelType));
    });
}

// 그리드 인라인 검색 및 정렬/필터 초기화 및 이벤트 등록
function initGridInlineSearch() {
    const input = document.getElementById('gridInlineSearch');
    const clearBtn = document.getElementById('gridInlineSearchClear');
    const sortSelect = document.getElementById('gridSortSelect');
    const sortOrderSelect = document.getElementById('gridSortOrderSelect');
    const resetBtn = document.getElementById('gridFilterResetBtn');

    if (input) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (clearBtn) {
                clearBtn.style.display = query ? 'flex' : 'none';
            }
            applyGridSortAndFilters();
        });
    }

    if (clearBtn && input) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.style.display = 'none';
            applyGridSortAndFilters();
            input.focus();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentGridSortMetric = e.target.value;
            // 메트릭 변경 시 해당 메트릭의 defaultOrder를 기본값으로 자동 설정
            if (SORT_METRICS[currentGridSortMetric]) {
                currentGridSortOrder = SORT_METRICS[currentGridSortMetric].defaultOrder || 'desc';
                if (sortOrderSelect) {
                    sortOrderSelect.value = currentGridSortOrder;
                }
            }
            applyGridSortAndFilters();
        });
    }

    if (sortOrderSelect) {
        sortOrderSelect.addEventListener('change', (e) => {
            currentGridSortOrder = e.target.value;
            applyGridSortAndFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (input) {
                input.value = '';
                if (clearBtn) clearBtn.style.display = 'none';
            }
            currentGridActiveChips.clear();
            document.querySelectorAll('.grid-filter-chip').forEach(btn => {
                if (btn.dataset.chipId && btn.dataset.chipId.endsWith('_all')) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            currentGridSortMetric = 'name';
            currentGridSortOrder = 'asc';
            if (sortSelect) sortSelect.value = 'name';
            if (sortOrderSelect) sortOrderSelect.value = 'asc';
            applyGridSortAndFilters();
        });
    }
}

function captureCurrentView() {
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const inlineSearchQuery = (document.getElementById('gridInlineSearch')?.value || '').trim();
    if (currentWeapon) {
        return { type: 'detail', panel: currentPanel, category: currentCategory, item: currentWeapon, galleryIndex: lastGalleryImageIndex, scrollY: currentScrollY };
    }
    if (lastGridState) {
        lastGridScrollY = currentScrollY;
        return {
            type: 'grid',
            title: lastGridState.title,
            items: lastGridState.items,
            categoryKey: lastGridState.categoryKey,
            panelType: lastGridState.panelType,
            scrollY: currentScrollY,
            searchQuery: inlineSearchQuery || lastGridState.searchQuery || '',
            sortMetric: currentGridSortMetric,
            sortOrder: currentGridSortOrder,
            activeChips: Array.from(currentGridActiveChips)
        };
    }
    return { type: 'empty' };
}

function restoreView(view) {
    if (!view || view.type === 'empty') {
        clearDetail();
        return;
    }
    if (view.type === 'detail') {
        showItemDetailAuto(view.item, view.category, view.galleryIndex || 0);
        if (view.scrollY) {
            const targetY = view.scrollY;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
                });
            });
        }
    } else if (view.type === 'grid') {
        lastGridScrollY = view.scrollY || 0;
        showGridView(view.title, view.items, view.categoryKey, view.panelType, true, view.searchQuery || '', view.sortMetric, view.sortOrder, view.activeChips);
    }
}

function backToGrid() {
    if (lastGridState) {
        showGridView(lastGridState.title, lastGridState.items, lastGridState.categoryKey, lastGridState.panelType, true, lastGridState.searchQuery || '', lastGridState.sortMetric, lastGridState.sortOrder, lastGridState.activeChips);
    } else {
        clearDetail();
    }
}

// 카테고리 선택 시 해당 항목들을 메인 영역에 그리드로 표시
function renderItemGrid(categoryKey, panelType) {
    panelType = panelType || currentPanel;
    closeDropdown();

    // 카테고리 전환 시 히스토리 스택 초기화
    navStack = [];

    // 검색 중이 아닌 실제 카테고리 진입이므로 검색 상태를 초기화
    preSearchView = null;
    const searchInput = document.getElementById('itemSearch');
    if (searchInput && searchInput.value) searchInput.value = '';

    const dataSource = panelType === 'gear' ? gearData : (panelType === 'attachment' ? attachmentData : weaponsData);
    let items;
    let title;
    if (categoryKey === 'all') {
        items = Object.values(dataSource).flat();
        title = panelType === 'gear' ? '기어 전체' : (panelType === 'attachment' ? '부착물 전체' : '웨폰 전체');
    } else {
        items = dataSource[categoryKey] || [];
        title = getCategoryLabel(categoryKey);
    }

    showGridView(title, items, categoryKey, panelType);
}

// 이미 계산된 항목 목록을 그리드로 표시 (검색 결과 등에도 사용)
function showGridView(title, items, categoryKey, panelType, shouldRestoreScroll = false, savedSearchQuery = '', savedSortMetric = null, savedSortOrder = null, savedActiveChips = null) {
    lastGridState = {
        title,
        items,
        categoryKey,
        panelType,
        searchQuery: savedSearchQuery,
        sortMetric: savedSortMetric,
        sortOrder: savedSortOrder,
        activeChips: savedActiveChips
    };
    if (!isSubGridCategory(categoryKey)) {
        rootGridState = { ...lastGridState };
    }
    currentPanel = panelType;
    currentCategory = categoryKey;
    currentWeapon = null;
    currentGridRawItems = items || [];
    currentGridCategoryKey = categoryKey;
    currentGridPanelType = panelType;

    if (savedActiveChips && Array.isArray(savedActiveChips)) {
        currentGridActiveChips = new Set(savedActiveChips);
    } else if (!savedActiveChips && !shouldRestoreScroll) {
        currentGridActiveChips = new Set();
    }

    saveAppState();

    document.querySelectorAll('.panel-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.panel === panelType);
    });
    updateCategoryDropdownActive();

    const gridView = document.getElementById('gridView');
    const weaponDetail = document.getElementById('weaponDetail');
    if (gridView) gridView.style.display = 'block';
    weaponDetail.style.display = 'none';
    weaponDetail.innerHTML = '';

    const gridTitle = document.getElementById('gridTitle');
    if (gridTitle) gridTitle.textContent = title;

    // 인라인 검색창 placeholder 동적 설정 및 이전 검색어 복원
    const inlineSearchInput = document.getElementById('gridInlineSearch');
    const inlineClearBtn = document.getElementById('gridInlineSearchClear');
    if (inlineSearchInput) {
        let targetName = title;
        if (categoryKey === 'search') {
            targetName = '검색 결과';
        } else if (title.includes('>')) {
            const parts = title.split('>');
            targetName = parts[parts.length - 1].trim();
        }
        inlineSearchInput.placeholder = `${targetName}에서 검색...`;
        inlineSearchInput.value = savedSearchQuery || '';
        if (inlineClearBtn) {
            inlineClearBtn.style.display = savedSearchQuery ? 'flex' : 'none';
        }
    }

    // 정렬 옵션 및 필터 칩 바 초기화/갱신
    updateSortOptionsDropdown(panelType, categoryKey, savedSortMetric, savedSortOrder, currentGridRawItems);
    updateFilterChipsBar(panelType, categoryKey, currentGridRawItems);

    // 필터 및 정렬 적용하여 그리드 렌더링
    applyGridSortAndFilters();

    if (shouldRestoreScroll && lastGridScrollY > 0) {
        const targetY = lastGridScrollY;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
            });
        });
    } else if (!shouldRestoreScroll) {
        lastGridScrollY = 0;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    updateFloatingNav();
}

const CATEGORY_PLACEHOLDER_FILES = {
    // Gears
    backpack: 'assets/placeholders/gear-backpack.png',
    helmet: 'assets/placeholders/gear-helmet.png',
    helmet_attachment: 'assets/placeholders/gear-visor.png',
    full_body_armor: 'assets/placeholders/gear-full-armor.png',
    plate_carrier: 'assets/placeholders/gear-plate-carrier.png',
    chest_rig: 'assets/placeholders/gear-chest-rig.png',
    mask: 'assets/placeholders/gear-mask.png',

    // Attachments
    magazine: 'assets/placeholders/att-magazine.png',
    optic_scope: 'assets/placeholders/att-optic.png',
    reflex_sight: 'assets/placeholders/att-dot.png',
    iron_sight: 'assets/placeholders/att-iron-sight.png',
    suppressor: 'assets/placeholders/att-suppressor.png',
    muzzle_device: 'assets/placeholders/att-muzzle.png',
    buttstock: 'assets/placeholders/att-stock.png',
    handguard: 'assets/placeholders/att-handguard.png',
    barrel: 'assets/placeholders/att-barrel.png',
    receiver: 'assets/placeholders/att-receiver.png',
    pistol_grip: 'assets/placeholders/att-pistol-grip.png',
    foregrip: 'assets/placeholders/att-foregrip.png',
    bipod: 'assets/placeholders/att-bipod.png',
    laser_pointer: 'assets/placeholders/att-laser.png',
    tactical_flashlight: 'assets/placeholders/att-flashlight.png',
    mount: 'assets/placeholders/att-mount.png',
    buffer_tube: 'assets/placeholders/att-buffer-tube.png',
    gas_block: 'assets/placeholders/att-gas-block.png',
    charging_handle: 'assets/placeholders/att-charging-handle.png',
    trigger: 'assets/placeholders/att-trigger.png',
    hammer: 'assets/placeholders/att-hammer.png',

    // Weapons
    assault_rifle: 'assets/ar.png',
    sniper_rifle: 'assets/sr.png',
    submachine_gun: 'assets/smg.png',
    shotgun: 'assets/shotgun.png',
    pistol: 'assets/pistol.png',
    light_machine_gun: 'assets/lmg.png',
    grenade_launcher: 'assets/gl.png',

    // 한글 호환
    '백팩': 'assets/placeholders/gear-backpack.png',
    '헬멧': 'assets/placeholders/gear-helmet.png',
    '헬멧 부착물': 'assets/placeholders/gear-visor.png',
    '전신 방탄복': 'assets/placeholders/gear-full-armor.png',
    '플레이트 캐리어': 'assets/placeholders/gear-plate-carrier.png',
    '체스트 리그': 'assets/placeholders/gear-chest-rig.png',
    '마스크': 'assets/placeholders/gear-mask.png',
    '탄창': 'assets/placeholders/att-magazine.png',
    '광학 조준경': 'assets/placeholders/att-optic.png',
    '도트/홀로그램': 'assets/placeholders/att-dot.png',
    '기계식 조준기': 'assets/placeholders/att-iron-sight.png',
    '소음기': 'assets/placeholders/att-suppressor.png',
    '소염기 / 머즐': 'assets/placeholders/att-muzzle.png',
    '개머리판': 'assets/placeholders/att-stock.png',
    '핸드가드': 'assets/placeholders/att-handguard.png',
    '총열': 'assets/placeholders/att-barrel.png',
    '리시버': 'assets/placeholders/att-receiver.png',
    '권총 손잡이': 'assets/placeholders/att-pistol-grip.png',
    '전방 손잡이': 'assets/placeholders/att-foregrip.png',
    '양각대': 'assets/placeholders/att-bipod.png',
    '레이저 표적기': 'assets/placeholders/att-laser.png',
    '전술 플래시': 'assets/placeholders/att-flashlight.png',
    '마운트': 'assets/placeholders/att-mount.png',
    '버퍼 튜브': 'assets/placeholders/att-buffer-tube.png',
    '가스 블록': 'assets/placeholders/att-gas-block.png',
    '장전 손잡이': 'assets/placeholders/att-charging-handle.png',
    '방아쇠': 'assets/placeholders/att-trigger.png',
    '해머': 'assets/placeholders/att-hammer.png',
    '돌격 소총': 'assets/ar.png',
    '저격 소총': 'assets/sr.png',
    '기관단총': 'assets/smg.png',
    '산탄총': 'assets/shotgun.png',
    '권총': 'assets/pistol.png',
    '경기관총': 'assets/lmg.png',
    '유탄 발사기': 'assets/gl.png'
};

const DEFAULT_PLACEHOLDER_FILE = 'assets/placeholders/default.svg';

function getPlaceholderIconHtml(item, categoryKey, panelType, context = 'card') {
    const rawCategory = (item && item.category) || (categoryKey !== 'all' && categoryKey !== 'search' ? categoryKey : '') || '';
    const cat = rawCategory.trim();

    let filePath = CATEGORY_PLACEHOLDER_FILES[cat];
    if (!filePath) {
        if (panelType === 'gear') {
            filePath = CATEGORY_PLACEHOLDER_FILES['backpack'] || CATEGORY_PLACEHOLDER_FILES['백팩'];
        } else if (panelType === 'attachment') {
            filePath = CATEGORY_PLACEHOLDER_FILES['mount'] || CATEGORY_PLACEHOLDER_FILES['마운트'];
        } else {
            filePath = CATEGORY_PLACEHOLDER_FILES['assault_rifle'] || CATEGORY_PLACEHOLDER_FILES['돌격 소총'];
        }
    }
    if (!filePath) {
        filePath = DEFAULT_PLACEHOLDER_FILE;
    }

    const imgClass = context === 'detail' ? 'detail-placeholder-img' : 'grid-card-placeholder-img';
    const altText = cat || '아이템';

    if (context === 'detail') {
        return `<img src="${filePath}" alt="${altText}" class="${imgClass}">`;
    }
    return `<div class="grid-card-placeholder-wrap"><img src="${filePath}" alt="${altText}" class="${imgClass}" loading="lazy" decoding="async"></div>`;
}

// 그리드 카드 생성 (이미지 + 이름 + 동적 스펙 뱃지)
function createGridCard(item, categoryKey, panelType) {
    const card = document.createElement('div');
    card.className = 'grid-card';
    card.dataset.itemId = item.id;
    card.dataset.weaponId = item.id;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'grid-card-image';
    const images = getItemImages(item);
    if (images.length > 0) {
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.src = images[0];
        img.alt = item.name;
        img.onerror = function() {
            imgWrap.innerHTML = getPlaceholderIconHtml(item, categoryKey, panelType, 'card');
        };
        imgWrap.appendChild(img);
    } else {
        imgWrap.innerHTML = getPlaceholderIconHtml(item, categoryKey, panelType, 'card');
    }

    // 3D 모델 보유 뱃지 (좌측 상단)
    if (item.model || item.model3d) {
        const modelBadge = document.createElement('span');
        modelBadge.className = 'grid-card-badge badge-model';
        modelBadge.textContent = '3D';
        modelBadge.title = '3D 모델 지원';
        imgWrap.appendChild(modelBadge);
    }

    // 카테고리 뱃지 상시 표시 (우측 상단)
    const itemCat = item.category || (categoryKey !== 'all' && categoryKey !== 'search' ? categoryKey : '') || '';
    if (itemCat) {
        const catLabel = getCategoryLabel(itemCat);
        const catBadge = document.createElement('span');
        catBadge.className = 'grid-card-badge grid-card-category-badge';
        catBadge.textContent = catLabel;
        catBadge.title = `카테고리: ${catLabel}`;
        imgWrap.appendChild(catBadge);
    }

    card.appendChild(imgWrap);

    const nameEl = document.createElement('div');
    nameEl.className = 'grid-card-name';
    nameEl.textContent = item.name;
    card.appendChild(nameEl);

    if (item.compatibilityNote) {
        const compatibilityNote = document.createElement('div');
        compatibilityNote.className = 'grid-card-compatibility-note';
        compatibilityNote.textContent = item.compatibilityNote;
        compatibilityNote.title = `조건부 호환: ${item.compatibilityNote}`;
        card.appendChild(compatibilityNote);
    }

    // 대표 스펙 태그 표시
    const coreSpecs = getItemCoreSpecs(item, categoryKey, panelType, currentGridSortMetric);
    if (coreSpecs.length > 0) {
        const specsContainer = document.createElement('div');
        specsContainer.className = 'grid-card-core-specs';
        coreSpecs.forEach(spec => {
            const isHighlighted = Boolean(spec.metricKey && currentGridSortMetric && spec.metricKey === currentGridSortMetric);
            const tag = document.createElement('span');
            tag.className = `core-spec-tag ${spec.tagClass || ''} ${isHighlighted ? 'spec-highlight' : ''}`;
            tag.textContent = spec.text;
            tag.title = `${spec.label}: ${spec.text}`;
            specsContainer.appendChild(tag);
        });
        card.appendChild(specsContainer);
    }

    const realCategoryKey = item.category || categoryKey;
    card.addEventListener('click', () => {
        compareTarget = null;
        pushNavState(captureCurrentView());
        showItemDetailAuto(item, realCategoryKey);
    });

    return card;
}

// 그리드가 특정 카테고리를 표시 중이면 최신 데이터로 새로고침
function refreshGridIfShowing(categoryKey, panelType) {
    if (lastGridState && lastGridState.panelType === panelType &&
        (lastGridState.categoryKey === categoryKey || lastGridState.categoryKey === 'all')) {
        renderItemGrid(lastGridState.categoryKey, panelType);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 모든 모달 닫기 (안전장치)
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
        if (modal.id === 'imageModal') {
            modal.style.setProperty('display', 'none', 'important');
        } else {
            modal.style.display = 'none';
        }
    });
    
    renderCategories();
    renderGearCategories();
    renderAttachmentCategories();
    setupEventListeners();

    const hashHandled = handleInitialUrlHash();
    if (!hashHandled) {
        const restored = restoreAppState();
        if (!restored) {
            renderItemGrid('all', 'weapon');
        }
    }
});

// URL 해시 기반 초기 딥링크 복원
function handleInitialUrlHash() {
    const hash = (window.location.hash || '').replace(/^#/, '').trim();
    if (!hash) return false;

    const allItems = getAllDatabaseItems();
    const targetItem = allItems.find(it => it.id === hash);
    if (targetItem) {
        const info = getItemTypeAndCategory(targetItem);
        switchPanel(info.panelType);
        renderItemGrid(info.category, info.panelType);
        showItemDetailAuto(targetItem, info.category);
        return true;
    }
    return false;
}











// 카테고리 렌더링
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    if (!categoryList) return;
    categoryList.innerHTML = '';

    // 전체 웨폰 카테고리 추가
    const totalCount = Object.values(weaponsData).reduce((sum, weapons) => sum + weapons.length, 0);
    const allCategory = createCategoryItem('웨폰 전체', totalCount, 'all', 'weapon');
    categoryList.appendChild(allCategory);

    // 각 카테고리 추가
    Object.keys(weaponsData).forEach(key => {
        const count = weaponsData[key]?.length || 0;
        const item = createCategoryItem(getCategoryLabel(key), count, key, 'weapon');
        categoryList.appendChild(item);
    });
}

// 기어 카테고리 렌더링
function renderGearCategories() {
    const categoryList = document.getElementById('gearCategoryList');
    if (!categoryList) return;
    categoryList.innerHTML = '';

    const totalCount = Object.values(gearData).reduce((sum, items) => sum + items.length, 0);
    const allCategory = createCategoryItem('기어 전체', totalCount, 'all', 'gear');
    categoryList.appendChild(allCategory);

    Object.keys(gearData).forEach(key => {
        const count = gearData[key]?.length || 0;
        const item = createCategoryItem(getCategoryLabel(key), count, key, 'gear');
        categoryList.appendChild(item);
    });
}

// 부착물 카테고리 렌더링 (공통 createCategoryItem 템플릿 사용)
function renderAttachmentCategories() {
    const categoryList = document.getElementById('attachmentCategoryList');
    if (!categoryList) return;
    categoryList.innerHTML = '';

    const totalCount = Object.values(attachmentData).reduce((sum, items) => sum + items.length, 0);
    const allCategory = createCategoryItem('부착물 전체', totalCount, 'all', 'attachment');
    categoryList.appendChild(allCategory);

    Object.keys(attachmentData).forEach(key => {
        const count = attachmentData[key]?.length || 0;
        const item = createCategoryItem(getCategoryLabel(key), count, key, 'attachment');
        categoryList.appendChild(item);
    });
}

// 카테고리 아이템 생성
function createCategoryItem(name, count, key, panelType) {
    panelType = panelType || 'weapon';
    const li = document.createElement('li');
    li.className = 'category-item';
    li.dataset.category = key;
    li.dataset.panelType = panelType;
    
    const link = document.createElement('div');
    link.className = 'category-link';
    link.dataset.category = key;
    
    const iconPath = CATEGORY_PLACEHOLDER_FILES[key];
    if (iconPath) {
        const iconImg = document.createElement('img');
        iconImg.src = iconPath;
        iconImg.alt = name;
        iconImg.className = 'category-icon';
        const largeIcons = [
            'assault_rifle', 'submachine_gun', 'sniper_rifle', 'shotgun', 'light_machine_gun', 'grenade_launcher', 'barrel', 'handguard',
            '돌격 소총', '기관단총', '저격 소총', '산탄총', '경기관총', '유탄 발사기', '총열', '핸드가드'
        ];
        if (largeIcons.includes(key)) {
            iconImg.classList.add('category-icon-large');
        }
        link.appendChild(iconImg);
    }
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'category-name';
    nameSpan.textContent = name;
    
    const countSpan = document.createElement('span');
    countSpan.className = 'category-count';
    countSpan.textContent = `(${count})`;
    
    link.appendChild(nameSpan);
    link.appendChild(countSpan);
    li.appendChild(link);

    // 카테고리 클릭 시 해당 항목들을 메인 영역에 그리드로 표시
    link.addEventListener('click', (e) => {
        e.stopPropagation();
        renderItemGrid(key, panelType);
    });

    return li;
}

// 아이템 이미지 배열 추출 (image 단일 또는 images 배열 지원)
function getItemImages(item) {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        return item.images;
    }
    if (item.image) {
        return [item.image];
    }
    return [];
}

// 한글 동적 번역 매핑 (순수 원본 데이터에서 UI 라벨로 변환)
const PROTECTION_AREAS_KO_MAP = {
    Neck: '목',
    Torso: '흉부',
    Back: '등',
    LeftShoulder: '좌측 어깨',
    RightShoulder: '우측 어깨',
    Stomach: '복부',
    LeftSide: '좌측 옆구리',
    RightSide: '우측 옆구리',
    Groin: '낭심',
    Head: '머리',
    Face: '안면',
    Ears: '귀',
    Eyes: '눈',
    Arms: '팔',
    Legs: '다리',
    Feet: '발',
    Hands: '손'
};

const FIRE_MODES_KO_MAP = {
    Single: '단발',
    SemiAuto: '단발',
    Burst: '점사',
    FullAuto: '연사',
    Double: '더블'
};

// 아이템 크기 및 수납 공간 행 추가
function appendItemSpecRows(statsList, item, options = {}) {
    if (!item || !statsList) return;

    // 사용 탄종 / 삽탄가능 탄종
    const isMag = item.category === 'magazine' || item.category === '탄창';
    const isWeapon = !isMag && Boolean(weaponsData[item.category] || currentPanel === 'weapon' || item.modes);

    if (isWeapon || isMag) {
        const calibers = getItemCalibers(item);
        if (calibers && calibers.length > 0) {
            const row = document.createElement('div');
            row.className = 'weapon-stat-row weapon-stat-row-areas';

            const label = document.createElement('span');
            label.className = 'weapon-stat-label';
            label.textContent = isMag ? '삽탄가능 탄종:' : '사용 탄종:';

            const chipsWrap = document.createElement('div');
            chipsWrap.className = 'protection-chips-wrapper';

            calibers.forEach(cal => {
                const chip = document.createElement('span');
                chip.className = 'protection-area-chip';
                chip.textContent = cal;
                chipsWrap.appendChild(chip);
            });

            row.appendChild(label);
            row.appendChild(chipsWrap);
            statsList.appendChild(row);
        }
    }

    // 아이템 크기
    if (item.itemSize || (item.itemSlots !== undefined && item.itemSlots !== null)) {
        const row = document.createElement('div');
        row.className = 'weapon-stat-row';

        const label = document.createElement('span');
        label.className = 'weapon-stat-label';
        label.textContent = '아이템 크기:';

        const value = document.createElement('span');
        value.className = 'weapon-stat-value';
        value.dataset.itemSizeValue = 'true';
        const sizeStr = item.itemSize ? formatSize(item.itemSize) : '';
        const slotStr = (item.itemSlots !== undefined && item.itemSlots !== null) ? `${item.itemSlots}칸` : '';
        value.textContent = sizeStr ? (slotStr ? `${sizeStr} (${slotStr})` : sizeStr) : slotStr;

        row.appendChild(label);
        row.appendChild(value);
        statsList.appendChild(row);
    }

    // 수납 공간 (수납 공간이 있는 아이템만)
    if (item.cargoSize || (item.cargoSlots !== undefined && item.cargoSlots !== null)) {
        const row = document.createElement('div');
        row.className = 'weapon-stat-row';

        const label = document.createElement('span');
        label.className = 'weapon-stat-label';
        label.textContent = '수납 공간:';

        const value = document.createElement('span');
        value.className = 'weapon-stat-value';
        const cargoSizeStr = item.cargoSize ? formatSize(item.cargoSize) : '';
        const cargoSlotStr = (item.cargoSlots !== undefined && item.cargoSlots !== null) ? `${item.cargoSlots}칸` : '';
        value.textContent = cargoSizeStr ? (cargoSlotStr ? `${cargoSizeStr} (${cargoSlotStr})` : cargoSizeStr) : cargoSlotStr;

        row.appendChild(label);
        row.appendChild(value);
        statsList.appendChild(row);
    }

    // 조사 거리 (전술 플래시)
    if (item.stats?.lightDistance) {
        const row = document.createElement('div');
        row.className = 'weapon-stat-row';

        const label = document.createElement('span');
        label.className = 'weapon-stat-label';
        label.textContent = '조사 거리:';

        const value = document.createElement('span');
        value.className = 'weapon-stat-value';
        value.textContent = `${item.stats.lightDistance}m`;

        row.appendChild(label);
        row.appendChild(value);
        statsList.appendChild(row);
    }

    // 발사 모드 (Weapon Fire Modes)
    if (item.modes && Array.isArray(item.modes) && item.modes.length > 0) {
        const row = document.createElement('div');
        row.className = 'weapon-stat-row weapon-stat-row-areas';

        const label = document.createElement('span');
        label.className = 'weapon-stat-label';
        label.textContent = '발사 모드:';

        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'protection-chips-wrapper';

        item.modes.forEach(mode => {
            const koLabel = FIRE_MODES_KO_MAP[mode] || mode;
            const chip = document.createElement('span');
            chip.className = 'protection-area-chip';
            chip.textContent = koLabel;
            chipsWrap.appendChild(chip);
        });

        row.appendChild(label);
        row.appendChild(chipsWrap);
        statsList.appendChild(row);
    }

    // 방호 부위 (Protection Areas)
    const protAreas = item.protectionAreas;
    if (protAreas && Array.isArray(protAreas) && protAreas.length > 0) {
        const row = document.createElement('div');
        row.className = 'weapon-stat-row weapon-stat-row-areas';

        const label = document.createElement('span');
        label.className = 'weapon-stat-label';
        label.textContent = '방호 부위:';

        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'protection-chips-wrapper';

        protAreas.forEach(area => {
            const koLabel = PROTECTION_AREAS_KO_MAP[area] || area;
            const chip = document.createElement('span');
            chip.className = 'protection-area-chip';
            chip.textContent = koLabel;
            chipsWrap.appendChild(chip);
        });

        row.appendChild(label);
        row.appendChild(chipsWrap);
        statsList.appendChild(row);
    }

    // 도색 여부 (Can Be Painted)
    const paintRow = document.createElement('div');
    paintRow.className = 'weapon-stat-row weapon-stat-row-areas';

    const paintLabel = document.createElement('span');
    paintLabel.className = 'weapon-stat-label';
    paintLabel.textContent = '도색 여부:';

    const paintChipsWrap = document.createElement('div');
    paintChipsWrap.className = 'protection-chips-wrapper';

    const paintChip = document.createElement('span');
    paintChip.className = 'protection-area-chip paint-status-chip';

    const colors = item.color;
    const initialPaintStatus = (colors && colors.length > 0 && colors[0].canBePainted !== undefined)
        ? Boolean(colors[0].canBePainted)
        : Boolean(item.canBePainted);

    function updatePaintBadge(isPaintable) {
        paintChip.className = `protection-area-chip paint-status-chip ${isPaintable ? 'paint-status-yes' : 'paint-status-no'}`;
        paintChip.textContent = isPaintable ? '가능' : '불가능';
    }

    updatePaintBadge(initialPaintStatus);
    paintChipsWrap.appendChild(paintChip);
    paintRow.appendChild(paintLabel);
    paintRow.appendChild(paintChipsWrap);
    statsList.appendChild(paintRow);

    let updateBarrelAdjustment = null;
    if (isWeaponItem(item)) {
        const barrelRow = document.createElement('div');
        barrelRow.className = 'weapon-stat-row weapon-stat-row-areas';

        const barrelLabel = document.createElement('span');
        barrelLabel.className = 'weapon-stat-label';
        barrelLabel.textContent = '총열 조절:';

        const barrelChipsWrap = document.createElement('div');
        barrelChipsWrap.className = 'protection-chips-wrapper';

        const barrelStatusChip = document.createElement('span');
        barrelStatusChip.className = 'protection-area-chip barrel-status-chip';

        updateBarrelAdjustment = (canAdjust, variants) => {
            barrelChipsWrap.innerHTML = '';
            barrelStatusChip.className = `protection-area-chip barrel-status-chip ${canAdjust ? 'barrel-status-yes' : 'barrel-status-no'}`;
            barrelStatusChip.textContent = canAdjust ? '가능' : '불가능';
            barrelChipsWrap.appendChild(barrelStatusChip);

            if (canAdjust && Array.isArray(variants)) {
                variants.forEach(variant => {
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'protection-area-chip barrel-adjustment-chip';
                    chip.textContent = variant.name;
                    chip.setAttribute('title', variant.isDefault ? `${variant.name} (기본 스폰)` : variant.name);
                    chip.setAttribute('aria-pressed', String(Boolean(variant.isDefault)));
                    if (variant.isDefault) chip.classList.add('active');

                    chip.addEventListener('click', (event) => {
                        event.stopPropagation();
                        barrelChipsWrap.querySelectorAll('.barrel-adjustment-chip').forEach(button => {
                            button.classList.remove('active');
                            button.setAttribute('aria-pressed', 'false');
                        });
                        chip.classList.add('active');
                        chip.setAttribute('aria-pressed', 'true');
                        if (typeof options.onBarrelVariantChange === 'function') {
                            options.onBarrelVariantChange(variant);
                        }
                    });
                    barrelChipsWrap.appendChild(chip);
                });
            }
        };

        const initialBarrelVariant = colors && colors.length > 0 ? colors[0] : item;
        updateBarrelAdjustment(
            Boolean(initialBarrelVariant.canAdjustBarrel),
            initialBarrelVariant.barrelVariants
        );

        barrelRow.appendChild(barrelLabel);
        barrelRow.appendChild(barrelChipsWrap);
        statsList.appendChild(barrelRow);
    }

    // 지원 색상 (Color Variants)
    if (colors && Array.isArray(colors) && colors.length > 0) {
        const row = document.createElement('div');
        row.className = 'weapon-stat-row weapon-stat-row-areas';

        const label = document.createElement('span');
        label.className = 'weapon-stat-label';
        label.textContent = '지원 색상:';

        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'protection-chips-wrapper';

        colors.forEach((c, idx) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.setAttribute('aria-pressed', String(idx === 0));
            chip.className = 'protection-area-chip color-variant-chip';
            if (idx === 0) chip.classList.add('active');
            chip.textContent = c.name;
            chip.setAttribute('title', c.id || c.name);

            chip.onclick = (e) => {
                e.stopPropagation();
                chipsWrap.querySelectorAll('.color-variant-chip').forEach(ch => {
                    ch.classList.remove('active');
                    ch.setAttribute('aria-pressed', 'false');
                });
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');

                if (c.image) {
                    const detailCard = statsList.closest('.weapon-detail-card') || document.querySelector('.weapon-detail-card');
                    const mainImg = detailCard ? detailCard.querySelector('.weapon-detail-image') : null;
                    if (mainImg) {
                        mainImg.src = c.image;
                    }
                }

                if (c.canBePainted !== undefined) {
                    updatePaintBadge(Boolean(c.canBePainted));
                }

                if (updateBarrelAdjustment) {
                    updateBarrelAdjustment(Boolean(c.canAdjustBarrel), c.barrelVariants);
                    const defaultBarrelVariant = Array.isArray(c.barrelVariants)
                        ? c.barrelVariants.find(variant => variant.isDefault)
                        : null;
                    if (defaultBarrelVariant && typeof options.onBarrelVariantChange === 'function') {
                        options.onBarrelVariantChange(defaultBarrelVariant);
                    }
                }
            };
            chipsWrap.appendChild(chip);
        });

        row.appendChild(label);
        row.appendChild(chipsWrap);
        statsList.appendChild(row);
    }
}

let modelViewerLoadingPromise = null;
function ensureModelViewerLoaded() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.customElements && window.customElements.get('model-viewer')) {
        return Promise.resolve();
    }
    if (modelViewerLoadingPromise) {
        return modelViewerLoadingPromise;
    }
    modelViewerLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
        script.onload = () => resolve();
        script.onerror = (err) => {
            modelViewerLoadingPromise = null;
            reject(err);
        };
        document.head.appendChild(script);
    });
    return modelViewerLoadingPromise;
}

// 이미지/3D 패널 생성 (갤러리 타이틀 + 화살표 + 3D 인스펙트 뷰어 지원)
function createImagePanelWithArrows(item, itemName, initialImageIndex = 0, onImageIndexChange = null) {
    const images = getItemImages(item);
    const hasModel = Boolean(item && item.model);
    const galleryWrapper = document.createElement('div');
    galleryWrapper.className = 'gallery-panel-wrapper';
    
    // 갤러리 헤더 (타이틀 + 모드 스위치)
    const headerRow = document.createElement('div');
    headerRow.className = 'gallery-header-row';
    
    const galleryTitle = document.createElement('h3');
    galleryTitle.className = 'gallery-title';
    galleryTitle.textContent = '갤러리';
    headerRow.appendChild(galleryTitle);
    
    let is3DMode = false;
    let modelViewerEl = null;

    if (hasModel) {
        const modeSwitch = document.createElement('div');
        modeSwitch.className = 'gallery-mode-switch';
        
        const btn2D = document.createElement('button');
        btn2D.type = 'button';
        btn2D.className = 'gallery-mode-btn active';
        btn2D.textContent = '사진';
        btn2D.setAttribute('aria-pressed', 'true');
        
        const btn3D = document.createElement('button');
        btn3D.type = 'button';
        btn3D.className = 'gallery-mode-btn';
        btn3D.textContent = '3D';
        btn3D.setAttribute('aria-pressed', 'false');
        
        modeSwitch.appendChild(btn2D);
        modeSwitch.appendChild(btn3D);
        headerRow.appendChild(modeSwitch);
        
        btn2D.onclick = () => switchMode(false);
        btn3D.onclick = () => switchMode(true);
    }
    galleryWrapper.appendChild(headerRow);
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'weapon-detail-image-container';
    
    // 2D 뷰 요소들
    const hasMultiple = images.length > 1;
    const arrowLeft = document.createElement('button');
    arrowLeft.type = 'button';
    arrowLeft.className = 'image-nav-arrow image-nav-left';
    arrowLeft.innerHTML = '‹';
    arrowLeft.setAttribute('aria-label', '이전 이미지');
    if (!hasMultiple) {
        arrowLeft.classList.add('image-nav-disabled');
        arrowLeft.style.display = 'none';
    }
    
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'weapon-detail-image-wrapper';
    const img = document.createElement('img');
    img.className = 'weapon-detail-image';
    let currentIndex = Math.max(0, Math.min(initialImageIndex, Math.max(0, images.length - 1)));
    const galleryFooter = document.createElement('div');
    galleryFooter.className = 'gallery-footer';
    const imageCounter = document.createElement('span');
    imageCounter.className = 'gallery-counter';
    imageCounter.setAttribute('aria-live', 'polite');
    imageCounter.textContent = images.length ? `${currentIndex + 1} / ${images.length}` : '등록된 이미지가 없습니다';
    const zoomButton = document.createElement('button');
    zoomButton.type = 'button';
    zoomButton.className = 'gallery-zoom-btn';
    zoomButton.textContent = '이미지 확대';
    zoomButton.hidden = !images.length;
    zoomButton.addEventListener('click', () => openImageModal(img.src, itemName));
    galleryFooter.append(imageCounter, zoomButton);
    if (images.length > 0) {
        img.src = images[currentIndex];
        img.alt = itemName;
        img.style.cursor = 'pointer';
    }
    const placeholder = document.createElement('div');
    placeholder.className = 'weapon-image-placeholder';
    placeholder.innerHTML = getPlaceholderIconHtml(item, item?.category, currentPanel, 'detail');
    placeholder.style.display = images.length === 0 ? 'flex' : 'none';
    imgWrapper.appendChild(placeholder);
    
    if (images.length > 0) {
        img.onerror = function() {
            this.style.display = 'none';
            placeholder.style.display = 'flex';
            imageCounter.textContent = '이미지를 불러올 수 없습니다';
            zoomButton.hidden = true;
        };
        img.onload = () => {
            img.style.display = '';
            placeholder.style.display = 'none';
            imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
            zoomButton.hidden = false;
        };
        img.onclick = function() {
            openImageModal(img.src, itemName);
        };
        imgWrapper.appendChild(img);
    }
    
    const arrowRight = document.createElement('button');
    arrowRight.type = 'button';
    arrowRight.className = 'image-nav-arrow image-nav-right';
    arrowRight.innerHTML = '›';
    arrowRight.setAttribute('aria-label', '다음 이미지');
    if (!hasMultiple) {
        arrowRight.classList.add('image-nav-disabled');
        arrowRight.style.display = 'none';
    }
    
    function updateImage() {
        if (images.length === 0) return;
        img.src = images[currentIndex];
        img.alt = itemName;
        img.style.display = '';
        placeholder.style.display = 'none';
        imageCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    if (hasMultiple) {
        const notifyChange = () => {
            if (typeof onImageIndexChange === 'function') onImageIndexChange(currentIndex);
        };
        arrowLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
            notifyChange();
        });
        arrowRight.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
            notifyChange();
        });
    }
    
    imageContainer.appendChild(arrowLeft);
    imageContainer.appendChild(imgWrapper);
    imageContainer.appendChild(arrowRight);
    
    // 3D 뷰 요소 (hasModel일 때 준비)
    let modelViewerContainer = null;
    if (hasModel) {
        ensureModelViewerLoaded();
        modelViewerContainer = document.createElement('div');
        modelViewerContainer.className = 'model-viewer-container';
        modelViewerContainer.style.display = 'none';
        
        modelViewerEl = document.createElement('model-viewer');
        modelViewerEl.className = 'weapon-model-viewer';
        modelViewerEl.setAttribute('src', item.model);
        modelViewerEl.setAttribute('alt', `${itemName} 3D 모델`);
        if (images.length > 0) {
            modelViewerEl.setAttribute('poster', images[0]);
        }
        modelViewerEl.setAttribute('camera-controls', '');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            modelViewerEl.setAttribute('auto-rotate', '');
        }
        modelViewerEl.setAttribute('auto-rotate-delay', '3000');
        modelViewerEl.setAttribute('rotation-per-second', '30deg');
        modelViewerEl.setAttribute('shadow-intensity', '1');
        modelViewerEl.setAttribute('shadow-softness', '0.5');
        modelViewerEl.setAttribute('exposure', '1.0');
        modelViewerEl.setAttribute('camera-orbit', '45deg 75deg auto');
        modelViewerEl.setAttribute('interaction-prompt', 'none');
        
        const bottomBar = document.createElement('div');
        bottomBar.className = 'model-viewer-bottom-bar';
        
        const bgPresets = [
            {
                name: '다크',
                background: 'radial-gradient(circle at center, #1f1f1f 0%, #0a0a0a 100%)',
                exposure: '1.0',
                shadowIntensity: '1.0',
                shadowSoftness: '0.5'
            },
            {
                name: '하늘',
                background: 'linear-gradient(180deg, #1d6fa5 0%, #4a9fd5 45%, #9fd3f7 80%, #cfe8fb 100%)',
                exposure: '1.15',
                shadowIntensity: '1.4',
                shadowSoftness: '0.4'
            },
            {
                name: '노을',
                background: 'linear-gradient(180deg, #201e2b 0%, #3a2e3d 35%, #5d434a 65%, #8a5d53 90%, #a8796b 100%)',
                exposure: '1.08',
                shadowIntensity: '1.4',
                shadowSoftness: '0.4'
            },
            {
                name: '화이트',
                background: 'radial-gradient(circle at center, #ffffff 0%, #e2e8f0 100%)',
                exposure: '1.05',
                shadowIntensity: '1.2',
                shadowSoftness: '0.6'
            },
            {
                name: '야전',
                background: 'radial-gradient(circle at center, #243526 0%, #101a11 100%)',
                exposure: '1.0',
                shadowIntensity: '1.3',
                shadowSoftness: '0.5'
            }
        ];
        
        let currentBgIndex = 0;
        const bgBtn = document.createElement('button');
        bgBtn.type = 'button';
        bgBtn.className = 'model-viewer-bg-btn';
        bgBtn.title = '배경 및 조명 변경';
        bgBtn.innerHTML = `
            <svg class="bg-btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            <span class="bg-btn-text">배경</span>
        `;
        
        bgBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentBgIndex = (currentBgIndex + 1) % bgPresets.length;
            const preset = bgPresets[currentBgIndex];
            modelViewerContainer.style.background = preset.background;
            modelViewerEl.setAttribute('exposure', preset.exposure);
            modelViewerEl.setAttribute('shadow-intensity', preset.shadowIntensity);
            modelViewerEl.setAttribute('shadow-softness', preset.shadowSoftness);
        });
        
        const controlsHint = document.createElement('div');
        controlsHint.className = 'model-viewer-controls-hint';
        controlsHint.innerHTML = '<span>좌클릭 회전</span><span>우클릭 이동</span><span>휠 줌</span>';
        
        bottomBar.appendChild(bgBtn);
        bottomBar.appendChild(controlsHint);
        
        modelViewerContainer.appendChild(modelViewerEl);
        modelViewerContainer.appendChild(bottomBar);
        imageContainer.appendChild(modelViewerContainer);
    }
    
    function switchMode(to3D) {
        is3DMode = to3D;
        const btn2D = headerRow.querySelector('.gallery-mode-btn:first-child');
        const btn3D = headerRow.querySelector('.gallery-mode-btn:last-child');
        if (btn2D) btn2D.classList.toggle('active', !to3D);
        if (btn3D) btn3D.classList.toggle('active', to3D);
        btn2D?.setAttribute('aria-pressed', String(!to3D));
        btn3D?.setAttribute('aria-pressed', String(to3D));
        galleryFooter.hidden = to3D;
        
        if (to3D) {
            ensureModelViewerLoaded();
            imgWrapper.style.display = 'none';
            arrowLeft.style.display = 'none';
            arrowRight.style.display = 'none';
            if (modelViewerContainer) modelViewerContainer.style.display = 'flex';
        } else {
            imgWrapper.style.display = 'flex';
            if (hasMultiple) {
                arrowLeft.style.display = 'flex';
                arrowRight.style.display = 'flex';
            }
            if (modelViewerContainer) modelViewerContainer.style.display = 'none';
        }
    }
    
    galleryWrapper.appendChild(imageContainer);
    galleryWrapper.appendChild(galleryFooter);
    return galleryWrapper;
}

const CALIBER_BASE_SPEEDS = {
    '5.56x45mm': 850,
    '.308 WIN': 770,
    '7.62x51mm': 770,
    '5.45x39mm': 880,
    '7.62x39mm': 640,
    '7.62x54mmR': 785,
    '.300 BLK': 442,
    '9x39mm': 280,
    '9x19mm': 350,
    '.45 ACP': 260,
    '.357 Magnum': 440,
    '12 Gauge': 340,
    '.338 Lapua': 900,
    '.50 BMG': 887,
    '.408 CheyTac': 998,
    '.366 TKM': 580,
    '6.8x51mm': 899,
    '5.7x28mm': 715,
    '4.6x30mm': 620,
    '7.62x25mm': 425,
    '9x21mm': 410,
    '.50 AE': 440,
    '12.7x55mm': 285,
    '.300 Win': 895,
    '.22 LR': 320,
    '40mm': 76
};

// 무기 상세 정보 표시
function getWeaponDetailStatState(weapon, stat) {
    const raw = weapon?.stats?.[stat.key];
    let displayText = raw !== undefined && raw !== null && raw !== '' ? String(raw) : '-';
    let numericValue = NaN;
    let footnoteTooltip = '';

    if (stat.key === 'velocity') {
        const primaryCaliber = weapon?.calibers?.[0];
        const baseSpeed = primaryCaliber ? (CALIBER_BASE_SPEEDS[primaryCaliber] || 0) : 0;
        const multiplier = weapon?.stats?.velocityMultiplier !== undefined ? weapon.stats.velocityMultiplier : 1.0;
        const calculatedSpeed = baseSpeed > 0 ? Math.round(baseSpeed * multiplier) : (raw ? parseFloat(raw) : 0);
        if (calculatedSpeed > 0) {
            displayText = `${calculatedSpeed} m/s`;
            numericValue = calculatedSpeed;
            if (baseSpeed > 0 && weapon?.stats?.velocityMultiplier !== undefined) {
                footnoteTooltip = `기준 탄속 ${baseSpeed} m/s × 무기 탄속 배율 ${Number(multiplier)}배`;
            }
        }
    } else if (raw !== undefined && raw !== null && raw !== '') {
        numericValue = parseFloat(String(raw).replace(/[^0-9.-]/g, ''));
        if (stat.isMoa) {
            displayText = `${raw} MOA`;
            if (!isNaN(numericValue) && numericValue > 0) {
                const d100 = Number((numericValue * 2.9).toFixed(1));
                const d300 = Number((numericValue * 2.9 * 3).toFixed(1));
                const d500 = Number((numericValue * 2.9 * 5).toFixed(1));
                footnoteTooltip = `100m 탄착군 지름 약 ${d100}cm\n300m 탄착군 지름 약 ${d300}cm\n500m 탄착군 지름 약 ${d500}cm`;
            }
        }
    }

    let percent = 0;
    if (!isNaN(numericValue) && stat.max > 0) {
        percent = stat.invert
            ? 100 - (numericValue / stat.max * 100)
            : (numericValue / stat.max) * 100;
        percent = Math.max(0, Math.min(100, percent));
    }

    return { displayText, numericValue, percent, footnoteTooltip };
}

function updateWeaponDetailStats(statsList, baseWeapon, barrelVariant, statsDefs) {
    if (!statsList || !barrelVariant) return;

    const selectedWeapon = {
        ...baseWeapon,
        id: barrelVariant.id || baseWeapon.id,
        stats: barrelVariant.stats || baseWeapon.stats,
        itemSize: barrelVariant.itemSize || baseWeapon.itemSize,
        itemSlots: barrelVariant.itemSlots ?? baseWeapon.itemSlots
    };

    statsDefs.forEach(stat => {
        const state = getWeaponDetailStatState(selectedWeapon, stat);
        const value = statsList.querySelector(`[data-weapon-stat-value="${stat.key}"]`);
        const barFill = statsList.querySelector(`[data-weapon-stat-fill="${stat.key}"]`);

        if (value) {
            value.textContent = state.displayText;
            if (state.footnoteTooltip) {
                const footnote = document.createElement('button');
                footnote.type = 'button';
                footnote.className = 'stat-footnote';
                footnote.textContent = '*';
                footnote.setAttribute('data-tooltip', state.footnoteTooltip);
                footnote.setAttribute('aria-label', footnote.dataset.tooltip);
                value.appendChild(footnote);
            }
        }
        if (barFill) {
            barFill.style.width = `${state.percent}%`;
        }

        const compareFill = statsList.querySelector(`[data-weapon-compare-fill="${stat.key}"]`);
        if (compareFill && compareTarget?.weapon) {
            const compareState = getWeaponDetailStatState(compareTarget.weapon, stat);
            compareFill.classList.remove('stat-better', 'stat-worse', 'stat-equal');
            if (!isNaN(state.numericValue) && !isNaN(compareState.numericValue)) {
                const lowerIsBetter = stat.key === 'recoil' || stat.key === 'sway' || stat.isMoa;
                const isBetter = lowerIsBetter
                    ? compareState.numericValue < state.numericValue
                    : compareState.numericValue > state.numericValue;
                const isWorse = lowerIsBetter
                    ? compareState.numericValue > state.numericValue
                    : compareState.numericValue < state.numericValue;
                compareFill.classList.add(isBetter ? 'stat-better' : (isWorse ? 'stat-worse' : 'stat-equal'));
            }
        }
    });

    const itemSizeValue = statsList.querySelector('[data-item-size-value="true"]');
    if (itemSizeValue) {
        const sizeText = selectedWeapon.itemSize ? formatSize(selectedWeapon.itemSize) : '';
        const slotText = selectedWeapon.itemSlots !== undefined && selectedWeapon.itemSlots !== null
            ? `${selectedWeapon.itemSlots}칸`
            : '';
        itemSizeValue.textContent = sizeText ? (slotText ? `${sizeText} (${slotText})` : sizeText) : slotText;
    }
}

function showWeaponDetail(weapon, categoryKey, initialGalleryIndex = 0) {
    const weaponDetail = showDetailContainer();

    // 현재 기준 무기/카테고리 갱신
    currentCategory = categoryKey;
    currentWeapon = weapon;
    lastGalleryImageIndex = initialGalleryIndex;
    saveAppState();
    // 그리드의 선택된 무기 하이라이트
    document.querySelectorAll('.grid-card').forEach(item => {
        item.classList.remove('active');
        if ((item.dataset.weaponId || item.dataset.itemId) === weapon.id) {
            item.classList.add('active');
        }
    });

    weaponDetail.innerHTML = '';

    const detailCard = document.createElement('div');
    detailCard.className = 'weapon-detail-card';

    // 무기 이름 (로고 포함)
    const nameContainer = document.createElement('div');
    nameContainer.className = 'weapon-detail-name-container';
    
    const name = document.createElement('h2');
    name.className = 'weapon-detail-name';
    
    // 제조사 로고가 있으면 표시
    if (weapon.manufacturerLogo) {
        const logoImg = document.createElement('img');
        logoImg.className = 'weapon-manufacturer-logo';
        // 특정 로고 원본 색상 유지
        const logosWithoutFilter = ['ai-logo', 'TsNIITochMash-logo', 'hk-logo', 'radian-logo', 'milkor-logo', 'kalashnikov-logo', 'mf-logo', 'dsarms-logo', 'barrett-logo', 'cheytac-logo'];
        if (logosWithoutFilter.some(logo => weapon.manufacturerLogo.includes(logo))) {
            logoImg.classList.add('logo-no-filter');
        }
        logoImg.src = weapon.manufacturerLogo;
        logoImg.alt = weapon.manufacturer || '';
        
        // 제조사 URL이 있으면 링크로 감싸기
        if (weapon.manufacturerUrl) {
            const logoLink = document.createElement('a');
            logoLink.href = weapon.manufacturerUrl;
            logoLink.target = '_blank';
            logoLink.rel = 'noopener noreferrer';
            logoLink.appendChild(logoImg);
            logoImg.onerror = function() {
                // 로고 이미지 로드 실패 시 제조사 이름만 텍스트로 표시
                logoLink.style.display = 'none';
                if (weapon.manufacturer) {
                    const manufacturerText = document.createElement('span');
                    manufacturerText.className = 'weapon-manufacturer-text';
                    manufacturerText.textContent = weapon.manufacturer;
                    name.appendChild(manufacturerText);
                }
            };
            name.appendChild(logoLink);
        } else {
            // URL이 없으면 그냥 이미지만 추가
            logoImg.onerror = function() {
                // 로고 이미지 로드 실패 시 제조사 이름만 텍스트로 표시
                this.style.display = 'none';
                if (weapon.manufacturer) {
                    const manufacturerText = document.createElement('span');
                    manufacturerText.className = 'weapon-manufacturer-text';
                    manufacturerText.textContent = weapon.manufacturer;
                    name.appendChild(manufacturerText);
                }
            };
            name.appendChild(logoImg);
        }
    } else if (weapon.manufacturer) {
        // 로고가 없으면 제조사 이름만 텍스트로 표시
        // URL이 있으면 링크로 감싸기
        if (weapon.manufacturerUrl) {
            const manufacturerLink = document.createElement('a');
            manufacturerLink.href = weapon.manufacturerUrl;
            manufacturerLink.target = '_blank';
            manufacturerLink.rel = 'noopener noreferrer';
            manufacturerLink.className = 'weapon-manufacturer-text';
            manufacturerLink.textContent = weapon.manufacturer;
            manufacturerLink.style.textDecoration = 'none';
            manufacturerLink.style.color = 'inherit';
            name.appendChild(manufacturerLink);
        } else {
            const manufacturerText = document.createElement('span');
            manufacturerText.className = 'weapon-manufacturer-text';
            manufacturerText.textContent = weapon.manufacturer;
            name.appendChild(manufacturerText);
        }
    }
    
    const nameWrap = document.createElement('div');
    nameWrap.className = 'weapon-name-wrap';
    const nameText = document.createElement('span');
    nameText.className = 'weapon-name-text';
    nameText.textContent = weapon.name;
    nameWrap.appendChild(nameText);
    nameWrap.appendChild(createWebSearchButton(weapon.name));
    name.appendChild(nameWrap);
    
    nameContainer.appendChild(name);
    detailCard.appendChild(nameContainer);
    
    
    // 총기 사진 (화살표로 다중 이미지 탐색)
    const weaponImagePanel = createImagePanelWithArrows(weapon, weapon.name, initialGalleryIndex, (idx) => {
        lastGalleryImageIndex = idx;
        saveAppState();
    });
    detailCard.appendChild(weaponImagePanel);
    
    // 설명란
    const descContainer = document.createElement('div');
    descContainer.className = 'weapon-detail-description-container';
    if (weapon.description) {
        const desc = document.createElement('div');
        desc.className = 'weapon-detail-description';
        desc.innerHTML = weapon.description;
        descContainer.appendChild(desc);
    } else {
        // 설명이 없을 경우 플레이스홀더
        descContainer.innerHTML = '<div class="weapon-description-placeholder">해당 총기의 설명</div>';
    }

    detailCard.appendChild(descContainer);

    // 능력치 섹션
    if (weapon.stats) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'weapon-stats-container';

        // 헤더: 제목 + 비교 버튼
        const statsHeader = document.createElement('div');
        statsHeader.className = 'weapon-stats-header';

        const statsHeaderSpacer = document.createElement('div');
        statsHeaderSpacer.className = 'weapon-stats-spacer';

        const statsTitle = document.createElement('h3');
        statsTitle.className = 'weapon-stats-title';
        statsTitle.textContent = '능력치';

        const compareBtn = document.createElement('button');
        compareBtn.type = 'button';
        compareBtn.className = 'weapon-compare-btn';
        // 비교 대상이 설정되어 있으면 "비교 해제"로 표시
        const hasCompare = !!(compareTarget && compareTarget.weapon);
        compareBtn.textContent = hasCompare ? '비교 해제' : '무기 비교';
        compareBtn.onclick = () => {
            if (compareTarget && compareTarget.weapon) {
                // 비교 해제: 비교 대상 초기화 후 현재 무기 다시 렌더링
                compareTarget = null;
                showWeaponDetail(weapon, categoryKey);
            } else {
                // 비교 시작: 모달 열기
                openCompareModal();
            }
        };

        statsHeader.appendChild(statsHeaderSpacer);
        statsHeader.appendChild(statsTitle);
        statsHeader.appendChild(compareBtn);
        statsContainer.appendChild(statsHeader);

        const statsList = document.createElement('div');
        statsList.className = 'weapon-stats-list';

        // 카테고리 표시
        const catRow = document.createElement('div');
        catRow.className = 'weapon-stat-row';
        const catLabel = document.createElement('span');
        catLabel.className = 'weapon-stat-label';
        catLabel.textContent = '카테고리:';
        const catValue = document.createElement('span');
        catValue.className = 'weapon-stat-value';
        catValue.textContent = getCategoryLabel(weapon.category) || getCategoryLabel(categoryKey) || '-';
        catRow.appendChild(catLabel);
        catRow.appendChild(catValue);
        statsList.appendChild(catRow);

        // 각 능력치별 최대값과 스케일 정의
        const statsDefs = [
            { key: 'recoil',      label: '반동',     max: 120,  invert: false },
            { key: 'sway',        label: '흔들림',   max: 210,  invert: false },
            { key: 'ergonomics',  label: '인체공학', max: 100,  invert: false },
            // DayZ 소스코드 기준: 일반 무기는 maxMOA = 25.0
            { key: 'accuracy',    label: '명중률',   max: 25.0, invert: true, isMoa: true },
            { key: 'velocity',    label: '탄속',     max: 1200, invert: false }
        ];

        statsDefs.forEach(stat => {
            const row = document.createElement('div');
            row.className = 'weapon-stat-row';

            const label = document.createElement('span');
            label.className = 'weapon-stat-label';
            label.textContent = `${stat.label}:`;

            const value = document.createElement('span');
            value.className = 'weapon-stat-value';
            value.dataset.weaponStatValue = stat.key;
            const raw = weapon.stats[stat.key];
            let displayText = raw !== undefined && raw !== null && raw !== "" ? String(raw) : '-';
            let calcSpeed = 0;
            let baseSpeed = 0;

            if (stat.key === 'velocity') {
                const primaryCal = weapon.calibers && weapon.calibers[0];
                baseSpeed = primaryCal ? (CALIBER_BASE_SPEEDS[primaryCal] || 0) : 0;
                const mult = (weapon.stats && weapon.stats.velocityMultiplier !== undefined) ? weapon.stats.velocityMultiplier : 1.0;
                calcSpeed = baseSpeed > 0 ? Math.round(baseSpeed * mult) : (raw ? parseFloat(raw) : 0);
                if (calcSpeed > 0) {
                    displayText = `${calcSpeed} m/s`;
                }
            } else if (stat.key === 'accuracy' && raw !== undefined && raw !== null && raw !== '') {
                displayText = `${raw} MOA`;
            }

            value.textContent = displayText;

            if (stat.key === 'velocity' && calcSpeed > 0 && weapon.stats && weapon.stats.velocityMultiplier !== undefined && baseSpeed > 0) {
                const footnote = document.createElement('button');
                footnote.type = 'button';
                footnote.className = 'stat-footnote';
                footnote.textContent = '*';
                const multStr = Number(weapon.stats.velocityMultiplier).toString();
                footnote.setAttribute('data-tooltip', `기준 탄속 ${baseSpeed} m/s × 무기 탄속 배율 ${multStr}배`);
                footnote.setAttribute('aria-label', footnote.dataset.tooltip);
                value.appendChild(footnote);
            }

            if (stat.key === 'accuracy' && raw) {
                const match = /([\d.]+)/.exec(String(raw));
                if (match) {
                    const moaNum = parseFloat(match[1]);
                    if (!isNaN(moaNum) && moaNum > 0) {
                        const footnote = document.createElement('button');
                        footnote.type = 'button';
                        footnote.className = 'stat-footnote';
                        footnote.textContent = '*';
                        const d100 = Number((moaNum * 2.9).toFixed(1));
                        const d300 = Number((moaNum * 2.9 * 3).toFixed(1));
                        const d500 = Number((moaNum * 2.9 * 5).toFixed(1));
                        const tooltipText = `100m 탄착군 지름 약 ${d100}cm\n300m 탄착군 지름 약 ${d300}cm\n500m 탄착군 지름 약 ${d500}cm`;
                        footnote.setAttribute('data-tooltip', tooltipText);
                        footnote.setAttribute('aria-label', footnote.dataset.tooltip);
                        value.appendChild(footnote);
                    }
                }
            }

            row.appendChild(label);
            row.appendChild(value);
            statsList.appendChild(row);

            // 게이지 바 계산 (기준 무기)
            let numericValue = NaN;
            if (stat.key === 'velocity') {
                numericValue = calcSpeed > 0 ? calcSpeed : NaN;
            } else if (raw !== undefined && raw !== null && raw !== "") {
                if (stat.isMoa) {
                    // "1.24 MOA" 같은 문자열에서 숫자만 추출
                    const match = /([\d.]+)/.exec(String(raw));
                    if (match) numericValue = parseFloat(match[1]);
                } else {
                    numericValue = parseFloat(raw);
                }
            }

            let percent = 0;
            if (!isNaN(numericValue) && stat.max > 0) {
                if (stat.invert) {
                    // 값이 낮을수록 좋은 경우 (예: MOA)
                    percent = 100 - (numericValue / stat.max * 100);
                } else {
                    percent = (numericValue / stat.max) * 100;
                }
                percent = Math.max(0, Math.min(100, percent));
            }

            const bar = document.createElement('div');
            bar.className = 'weapon-stat-bar';

            const barFill = document.createElement('div');
            barFill.className = 'weapon-stat-bar-fill';
            barFill.dataset.weaponStatFill = stat.key;
            barFill.style.width = `${percent}%`;

            bar.appendChild(barFill);
            statsList.appendChild(bar);

            // 비교 대상이 있는 경우, 두 번째 게이지 바 추가
            const compareWeapon = compareTarget && compareTarget.weapon ? compareTarget.weapon : null;
            if (compareWeapon && compareWeapon.stats && compareWeapon.id !== weapon.id) {
                const rawCompare = compareWeapon.stats[stat.key];
                let numericCompare = NaN;
                if (stat.key === 'velocity') {
                    const compCal = compareWeapon.calibers && compareWeapon.calibers[0];
                    const compBase = compCal ? (CALIBER_BASE_SPEEDS[compCal] || 0) : 0;
                    const compMult = (compareWeapon.stats && compareWeapon.stats.velocityMultiplier !== undefined) ? compareWeapon.stats.velocityMultiplier : 1.0;
                    const compSpeed = compBase > 0 ? Math.round(compBase * compMult) : (rawCompare ? parseFloat(rawCompare) : 0);
                    numericCompare = compSpeed > 0 ? compSpeed : NaN;
                } else if (rawCompare !== undefined && rawCompare !== null && rawCompare !== "") {
                    if (stat.isMoa) {
                        const match2 = /([\d.]+)/.exec(String(rawCompare));
                        if (match2) numericCompare = parseFloat(match2[1]);
                    } else {
                        numericCompare = parseFloat(rawCompare);
                    }
                }

                let percentCompare = 0;
                if (!isNaN(numericCompare) && stat.max > 0) {
                    if (stat.invert) {
                        percentCompare = 100 - (numericCompare / stat.max * 100);
                    } else {
                        percentCompare = (numericCompare / stat.max) * 100;
                    }
                    percentCompare = Math.max(0, Math.min(100, percentCompare));
                }

                let diffClass = '';
                if (!isNaN(numericValue) && !isNaN(numericCompare)) {
                    let better = false;
                    let worse = false;

                    // 반동, 흔들림, 명중률(MOA)은 값이 낮을수록 좋음
                    // 실제 숫자 값을 비교해야 함 (percent는 invert 적용되어 있어서 잘못된 비교가 됨)
                    if (stat.key === 'recoil' || stat.key === 'sway' || stat.isMoa) {
                        better = numericCompare < numericValue;  // 비교값이 기준값보다 낮으면 좋음
                        worse = numericCompare > numericValue;   // 비교값이 기준값보다 높으면 나쁨
                    } else {
                        // 나머지(인체공학, 탄속)는 값이 높을수록 좋음
                        better = numericCompare > numericValue;  // 비교값이 기준값보다 높으면 좋음
                        worse = numericCompare < numericValue;   // 비교값이 기준값보다 낮으면 나쁨
                    }

                    if (better) {
                        diffClass = 'better';
                    } else if (worse) {
                        diffClass = 'worse';
                    } else {
                        diffClass = 'equal';
                    }
                }

                const compareBar = document.createElement('div');
                compareBar.className = 'weapon-stat-bar weapon-stat-bar-compare';
                const compareValue = document.createElement('div');
                compareValue.className = 'detail-compare-value';
                compareValue.textContent = `비교 · ${getWeaponDetailStatState(compareWeapon, stat).displayText}`;
                statsList.appendChild(compareValue);

                const compareFill = document.createElement('div');
                compareFill.className = 'weapon-stat-bar-fill';
                compareFill.dataset.weaponCompareFill = stat.key;
                if (diffClass) {
                    compareFill.classList.add(`stat-${diffClass}`);
                }
                compareFill.style.width = `${percentCompare}%`;

                compareBar.appendChild(compareFill);
                statsList.appendChild(compareBar);
            }
        });

        appendItemSpecRows(statsList, weapon, {
            onBarrelVariantChange: (barrelVariant) => {
                updateWeaponDetailStats(statsList, weapon, barrelVariant, statsDefs);
            }
        });

        statsContainer.appendChild(statsList);

        // 설명 박스와 완전히 같은 폭으로 보이도록,
        // 설명 컨테이너 안에 능력치 섹션을 넣는다.
        const statsParent = weapon.description
            ? detailCard.querySelector('.weapon-detail-description-container')
            : detailCard;
        if (statsParent) {
            statsParent.appendChild(statsContainer);
        } else {
            detailCard.appendChild(statsContainer);
        }
    }

    const slotsSection = createAttachmentSlotsSection(weapon);
    if (slotsSection) {
        const slotsParent = weapon.description
            ? detailCard.querySelector('.weapon-detail-description-container')
            : detailCard;
        if (slotsParent) {
            slotsParent.appendChild(slotsSection);
        } else {
            detailCard.appendChild(slotsSection);
        }
    }

    const parentSection = createParentCompatibleSection(weapon);
    if (parentSection) {
        const slotsParent = weapon.description
            ? detailCard.querySelector('.weapon-detail-description-container')
            : detailCard;
        if (slotsParent) {
            slotsParent.appendChild(parentSection);
        } else {
            detailCard.appendChild(parentSection);
        }
    }
    
    arrangeDetailCard(detailCard, weapon, categoryKey, 'weapon');
    weaponDetail.appendChild(detailCard);
    updateFloatingNav();
    recordCurrentViewHistory('#' + weapon.id);
}

// 기어 상세 정보 표시
function showGearDetail(gear, categoryKey, initialGalleryIndex = 0) {
    const weaponDetail = showDetailContainer();

    currentCategory = categoryKey;
    currentWeapon = gear;
    lastGalleryImageIndex = initialGalleryIndex;
    saveAppState();

    document.querySelectorAll('.grid-card').forEach(item => {
        item.classList.remove('active');
        if ((item.dataset.weaponId || item.dataset.itemId) === gear.id) {
            item.classList.add('active');
        }
    });

    weaponDetail.innerHTML = '';

    const detailCard = document.createElement('div');
    detailCard.className = 'weapon-detail-card';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'weapon-detail-name-container';

    const name = document.createElement('h2');
    name.className = 'weapon-detail-name';

    if (gear.manufacturerLogo) {
        const logoImg = document.createElement('img');
        logoImg.className = 'weapon-manufacturer-logo';
        const logosWithoutFilter = [
            'avon-logo',
            '511tac-logo'
        ];
        if (logosWithoutFilter.some(logo => gear.manufacturerLogo.includes(logo))) {
            logoImg.classList.add('logo-no-filter');
        }
        logoImg.src = gear.manufacturerLogo;
        logoImg.alt = gear.manufacturer || '';
        if (gear.manufacturerUrl) {
            const logoLink = document.createElement('a');
            logoLink.href = gear.manufacturerUrl;
            logoLink.target = '_blank';
            logoLink.rel = 'noopener noreferrer';
            logoLink.appendChild(logoImg);
            name.appendChild(logoLink);
        } else {
            name.appendChild(logoImg);
        }
    } else if (gear.manufacturer) {
        if (gear.manufacturerUrl) {
            const manufacturerLink = document.createElement('a');
            manufacturerLink.href = gear.manufacturerUrl;
            manufacturerLink.target = '_blank';
            manufacturerLink.rel = 'noopener noreferrer';
            manufacturerLink.className = 'weapon-manufacturer-text';
            manufacturerLink.textContent = gear.manufacturer;
            manufacturerLink.style.textDecoration = 'none';
            manufacturerLink.style.color = 'inherit';
            name.appendChild(manufacturerLink);
        } else {
            const manufacturerText = document.createElement('span');
            manufacturerText.className = 'weapon-manufacturer-text';
            manufacturerText.textContent = gear.manufacturer;
            name.appendChild(manufacturerText);
        }
    }
    
    const nameWrap = document.createElement('div');
    nameWrap.className = 'weapon-name-wrap';
    const nameText = document.createElement('span');
    nameText.className = 'weapon-name-text';
    nameText.textContent = gear.name;
    nameWrap.appendChild(nameText);
    nameWrap.appendChild(createWebSearchButton(gear.name));
    name.appendChild(nameWrap);
    
    nameContainer.appendChild(name);
    detailCard.appendChild(nameContainer);
    
    
    // 기어 사진 (화살표로 다중 이미지 탐색)
    const gearImagePanel = createImagePanelWithArrows(gear, gear.name, initialGalleryIndex, (idx) => {
        lastGalleryImageIndex = idx;
        saveAppState();
    });
    detailCard.appendChild(gearImagePanel);
    
    const descContainer = document.createElement('div');
    descContainer.className = 'weapon-detail-description-container';
    if (gear.description) {
        const desc = document.createElement('div');
        desc.className = 'weapon-detail-description';
        desc.innerHTML = gear.description;
        descContainer.appendChild(desc);
    } else {
        descContainer.innerHTML = '<div class="weapon-description-placeholder">해당 기어의 설명</div>';
    }

    detailCard.appendChild(descContainer);
    
    // 기어 능력치 및 규격 섹션
    const hasGearStats = Boolean(gear.stats) || Boolean(gear.category);
    const hasGearSpecs = Boolean(gear.itemSize || gear.itemSlots || gear.cargoSize || gear.cargoSlots);
    if (hasGearStats || hasGearSpecs) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'weapon-stats-container';

        const statsHeader = document.createElement('div');
        statsHeader.className = 'weapon-stats-header';
        const statsHeaderSpacer = document.createElement('div');
        statsHeaderSpacer.className = 'weapon-stats-spacer';
        const statsTitle = document.createElement('h3');
        statsTitle.className = 'weapon-stats-title';
        statsTitle.textContent = '능력치';
        const statsHeaderSpacerRight = document.createElement('div');
        statsHeaderSpacerRight.className = 'weapon-stats-spacer';
        statsHeader.appendChild(statsHeaderSpacer);
        statsHeader.appendChild(statsTitle);
        statsHeader.appendChild(statsHeaderSpacerRight);
        statsContainer.appendChild(statsHeader);

        const statsList = document.createElement('div');
        statsList.className = 'weapon-stats-list';

        // 카테고리 표시
        const catRow = document.createElement('div');
        catRow.className = 'weapon-stat-row';
        const catLabel = document.createElement('span');
        catLabel.className = 'weapon-stat-label';
        catLabel.textContent = '카테고리:';
        const catValue = document.createElement('span');
        catValue.className = 'weapon-stat-value';
        catValue.textContent = getCategoryLabel(gear.category) || getCategoryLabel(categoryKey) || '-';
        catRow.appendChild(catLabel);
        catRow.appendChild(catValue);
        statsList.appendChild(catRow);

        if (gear.stats) {
            const hasProtectionStats = ['bulletDamageProtection', 'healthDamageProtection', 'bloodDamageProtection', 'shockDamageProtection'].some(k => gear.stats[k] !== undefined);
            if (hasProtectionStats) {
                const gearStatsDefs = [
                    { key: 'bulletDamageProtection', label: '총탄 데미지 보호률' },
                    { key: 'healthDamageProtection', label: '체력 데미지 보호률' },
                    { key: 'bloodDamageProtection', label: '유혈 데미지 보호률' },
                    { key: 'shockDamageProtection', label: '충격 데미지 보호률' }
                ];

                gearStatsDefs.forEach(stat => {
                    const row = document.createElement('div');
                    row.className = 'weapon-stat-row';

                    const label = document.createElement('span');
                    label.className = 'weapon-stat-label';
                    label.textContent = `${stat.label}:`;

                    const raw = gear.stats[stat.key];
                    const displayText = raw !== undefined && raw !== null && raw !== "" ? `${String(raw)}%` : '-';

                    const value = document.createElement('span');
                    value.className = 'weapon-stat-value';
                    value.textContent = displayText;

                    row.appendChild(label);
                    row.appendChild(value);
                    statsList.appendChild(row);

                    let numericValue = NaN;
                    if (raw !== undefined && raw !== null && raw !== "") {
                        numericValue = parseFloat(String(raw));
                    }
                    const percent = (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100)
                        ? Math.min(100, Math.max(0, numericValue)) : 0;

                    const bar = document.createElement('div');
                    bar.className = 'weapon-stat-bar';

                    const barFill = document.createElement('div');
                    barFill.className = 'weapon-stat-bar-fill';
                    barFill.style.width = `${percent}%`;

                    bar.appendChild(barFill);
                    statsList.appendChild(bar);
                });
            }

            if (gear.stats.hitpoints && gear.stats.hitpoints !== '-') {
                const row = document.createElement('div');
                row.className = 'weapon-stat-row';
                const label = document.createElement('span');
                label.className = 'weapon-stat-label';
                label.textContent = '내구도:';
                const value = document.createElement('span');
                value.className = 'weapon-stat-value';
                value.textContent = gear.stats.hitpoints;
                row.appendChild(label);
                row.appendChild(value);
                statsList.appendChild(row);
            }

            if (gear.stats.weight && gear.stats.weight !== '-') {
                const row = document.createElement('div');
                row.className = 'weapon-stat-row';
                const label = document.createElement('span');
                label.className = 'weapon-stat-label';
                label.textContent = '무게:';
                const value = document.createElement('span');
                value.className = 'weapon-stat-value';
                value.textContent = `${gear.stats.weight}g`;
                row.appendChild(label);
                row.appendChild(value);
                statsList.appendChild(row);
            }
        }

        appendItemSpecRows(statsList, gear);

        statsContainer.appendChild(statsList);

        const statsParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        statsParent.appendChild(statsContainer);
    }
    
    // 차콜 테블릿 필터 충전 패널 (호흡기, 방독면, Gas mask, respirator - 이름 또는 설명에 포함 시)
    const filterKeywords = ['호흡기', '방독면', 'gas mask', 'respirator'];
    const gearText = `${gear.name || ''} ${gear.description || ''}`.toLowerCase();
    const hasFilterKeyword = filterKeywords.some(kw => gearText.includes(kw.toLowerCase()));
    if (hasFilterKeyword) {
        const filterPanel = document.createElement('div');
        filterPanel.className = 'gear-filter-charge-panel';
        
        const filterHeader = document.createElement('div');
        filterHeader.className = 'weapon-stats-header';
        const filterSpacer = document.createElement('div');
        filterSpacer.className = 'weapon-stats-spacer';
        const filterTitle = document.createElement('h3');
        filterTitle.className = 'weapon-stats-title';
        filterTitle.textContent = '필터 충전';
        const filterSpacerRight = document.createElement('div');
        filterSpacerRight.className = 'weapon-stats-spacer';
        filterHeader.appendChild(filterSpacer);
        filterHeader.appendChild(filterTitle);
        filterHeader.appendChild(filterSpacerRight);
        filterPanel.appendChild(filterHeader);
        
        const charcoalRow = document.createElement('div');
        charcoalRow.className = 'gear-filter-charge-row';
        const charcoalImg = document.createElement('img');
        charcoalImg.src = 'assets/charcoal.png';
        charcoalImg.alt = '차콜 테블릿';
        charcoalImg.className = 'gear-charcoal-img';
        charcoalRow.appendChild(charcoalImg);
        
        const filterValue = document.createElement('span');
        filterValue.className = 'gear-filter-value';
        const fc = (gear.filterChargeable || '').toLowerCase();
        if (fc === 'yes') {
            filterValue.textContent = '가능';
            filterValue.classList.add('filter-yes');
        } else if (fc === 'no') {
            filterValue.textContent = '불가능';
            filterValue.classList.add('filter-no');
        } else {
            filterValue.textContent = '미설정';
            filterValue.classList.add('filter-unset');
        }
        charcoalRow.appendChild(filterValue);
        
        filterPanel.appendChild(charcoalRow);
        
        const filterParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        filterParent.appendChild(filterPanel);
    }

    const slotsSection = createAttachmentSlotsSection(gear);
    if (slotsSection) {
        const slotsParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        slotsParent.appendChild(slotsSection);
    }

    const parentSection = createParentCompatibleSection(gear);
    if (parentSection) {
        const slotsParent = detailCard.querySelector('.weapon-detail-description-container') || detailCard;
        slotsParent.appendChild(parentSection);
    }
    
    arrangeDetailCard(detailCard, gear, categoryKey, 'gear');
    weaponDetail.appendChild(detailCard);
    updateFloatingNav();
    recordCurrentViewHistory('#' + gear.id);
}


// 상세 정보 초기화 (무기/기어 공통)
function clearDetail() {
    const gridView = document.getElementById('gridView');
    if (gridView) gridView.style.display = 'none';
    const weaponDetail = document.getElementById('weaponDetail');
    weaponDetail.style.display = 'flex';
    const msg = currentPanel === 'gear'
        ? '상단 메뉴에서 카테고리를 선택하고 기어를 클릭하여 정보를 확인하세요.'
        : '상단 메뉴에서 카테고리를 선택하고 항목을 클릭하여 정보를 확인하세요.';
    weaponDetail.innerHTML = '<p class="empty-message">' + msg + '</p>';

    document.querySelectorAll('.grid-card').forEach(item => {
        item.classList.remove('active');
    });

    currentWeapon = null;
    currentCategory = null;
    lastGridState = null;
    preSearchView = null;
    navStack = [];
    lastGridScrollY = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    updateFloatingNav();
}


// 홈 화면으로 이동 (SMPZ 웨폰 전체 화면)
function goToHomePage() {
    closeDropdown();
    navStack = [];
    preSearchView = null;
    compareTarget = null;
    
    // 전체 검색창 및 인라인 검색창 초기화
    const mainSearchInput = document.getElementById('itemSearch');
    if (mainSearchInput) mainSearchInput.value = '';
    const inlineSearchInput = document.getElementById('gridInlineSearch');
    if (inlineSearchInput) inlineSearchInput.value = '';
    const inlineClearBtn = document.getElementById('gridInlineSearchClear');
    if (inlineClearBtn) inlineClearBtn.style.display = 'none';

    // 웨폰 전체 화면 렌더링
    renderItemGrid('all', 'weapon');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    initGridInlineSearch();

    // 좌측 상단 로고/타이틀 클릭 시 최초 홈 화면(웨폰 전체)으로 이동
    const homeLogoBtn = document.getElementById('homeLogoBtn') || document.querySelector('.topbar-title');
    if (homeLogoBtn) {
        homeLogoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToHomePage();
        });
        homeLogoBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToHomePage();
            }
        });
    }

    // 스크롤 시 플로팅 네비게이션 독 갱신 (맨 위로 버튼 등)
    window.addEventListener('scroll', () => {
        updateFloatingNav();
    }, { passive: true });

    // 패널 전환 버튼 (클릭 시 드롭다운 토글)
    document.querySelectorAll('.panel-btn').forEach(btn => {
        const panel = btn.dataset.panel;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = document.getElementById('categoryDropdown');
            const isOpen = dropdown && dropdown.classList.contains('open');

            if (isOpen && currentDropdownPanel === panel) {
                closeDropdown();
            } else {
                openDropdown(panel);
            }
        });
    });

    // 드롭다운 바깥을 클릭하면 닫기
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('categoryDropdown');
        if (!dropdown || !dropdown.classList.contains('open')) return;
        if (dropdown.contains(e.target)) return;
        if (e.target.closest('.panel-btn')) return;
        closeDropdown();
    });
    
    // 검색창 이벤트 리스너
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchItems(e.target.value);
        });
    }
    
    // 모달 닫기
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            closeDetailModal(e.target.closest('.modal'));
        });
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeDetailModal(e.target);
        }
    });
    
    // 이미지 확대 모달 닫기
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        // 모달이 기본적으로 닫혀있도록 보장
        imageModal.style.display = 'none';
        
        const closeImageBtn = document.querySelector('.close-image');
        if (closeImageBtn) {
            closeImageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeDetailModal(imageModal);
            });
        }
        
        // 이미지 모달 외부 클릭 시 닫기
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('image-modal')) {
                closeDetailModal(imageModal);
            }
        });
    }
    
    // ESC 키로 모든 모달 닫기 및 이전 화면 복귀
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && activeDetailModal) {
            const controls = [...activeDetailModal.querySelectorAll('button, a[href], input, select, [tabindex="0"]')]
                .filter(element => !element.disabled && element.getClientRects().length > 0);
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        }
        if (e.key === 'Escape') {
            if (document.activeElement?.classList.contains('stat-footnote')) {
                document.activeElement.blur();
                return;
            }
            let closedSomething = false;

            const dropdown = document.getElementById('categoryDropdown');
            if (dropdown && dropdown.classList.contains('open')) {
                closeDropdown();
                closedSomething = true;
            }

            const imageModal = document.getElementById('imageModal');
            if (imageModal) {
                const computedStyle = window.getComputedStyle(imageModal);
                if (computedStyle.display !== 'none') {
                    closeDetailModal(imageModal);
                    closedSomething = true;
                }
            }

            // 다른 모달들도 닫기
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.id !== 'imageModal') {
                    const computedStyle = window.getComputedStyle(modal);
                    if (computedStyle.display !== 'none') {
                        closeDetailModal(modal);
                        closedSomething = true;
                    }
                }
            });

            if (closedSomething) return;

            // 텍스트 인풋 포커스 해제
            if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                document.activeElement.blur();
                return;
            }

            // 상세 화면이나 검색 그리드 등에서 이전 화면으로 복귀
            const isDetailView = !!currentWeapon;
            const isSearchGrid = currentGridCategoryKey === 'search' || (lastGridState && lastGridState.categoryKey === 'search');
            if (isDetailView || navStack.length > 0 || isSearchGrid || preSearchView) {
                popNavState();
            }
        }
    });

    // 브라우저 뒤로가기/앞으로가기 표준 이벤트 연동 (마우스 4/5번, 브라우저 화살표, 모바일 제스처)
    window.addEventListener('popstate', (e) => {
        isNavigatingHistory = true;
        try {
            if (navStack.length > 0) {
                navStack.pop();
            }
            if (e.state && e.state.type !== 'empty') {
                restoreView(e.state);
            } else {
                backToGrid();
            }
        } finally {
            isNavigatingHistory = false;
            updateFloatingNav();
        }
    });
}

function openDetailModal(modal, display) {
    detailModalReturnFocus = document.activeElement;
    activeDetailModal = modal;
    modal.style.setProperty('display', display, 'important');
    document.body.classList.add('detail-modal-open');
    modal.querySelector('button')?.focus({ preventScroll: true });
}

function closeDetailModal(modal) {
    modal.style.setProperty('display', 'none', 'important');
    if (activeDetailModal !== modal) return;
    activeDetailModal = null;
    document.body.classList.remove('detail-modal-open');
    if (detailModalReturnFocus?.isConnected) {
        detailModalReturnFocus.focus({ preventScroll: true });
    }
    detailModalReturnFocus = null;
}

// 이미지 확대 모달 열기
function openImageModal(imageSrc, imageAlt) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (imageModal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        openDetailModal(imageModal, 'flex');
    }
}



// 능력치 비교 모달 열기
function openCompareModal() {
    const modal = document.getElementById('compareModal');
    const listContainer = document.getElementById('compareWeaponList');
    const currentLabel = document.getElementById('compareCurrentWeapon');

    if (!modal || !listContainer) return;
    if (!currentWeapon) {
        alert('먼저 기준이 될 무기를 선택해주세요.');
        return;
    }

    listContainer.innerHTML = '';
    if (currentLabel) {
        // 기준 무기 표시
        currentLabel.textContent = `기준 무기: ${currentWeapon.name}`;
    }

    // 모든 카테고리의 무기 목록을 모아서 표시
    Object.keys(weaponsData).forEach(categoryKey => {
        const list = weaponsData[categoryKey] || [];
        list.forEach(w => {
            // 스탯이 있는 무기만 대상, 자기 자신 제외
            if (!w.stats || (currentWeapon && w.id === currentWeapon.id)) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'compare-weapon-item';
            // 비교 대상 무기 목록 생성
            btn.textContent = w.name;
            btn.onclick = () => {
                compareTarget = { weapon: w, categoryKey };
                closeDetailModal(modal);
                // 현재 무기를 다시 렌더링하여 비교 바를 표시
                if (currentWeapon && currentCategory) {
                    showWeaponDetail(currentWeapon, currentCategory);
                    document.querySelector('.weapon-compare-btn')?.focus({ preventScroll: true });
                }
            };
            listContainer.appendChild(btn);
        });
    });

    openDetailModal(modal, 'block');
}

// 무기/부착물/기어 전체 검색 함수 (검색 결과를 그리드로 표시)
function searchItems(query) {
    const trimmed = (query || '').trim();
    if (!trimmed) {
        // 검색창이 비면 검색 시작 전 화면으로 복귀
        if (preSearchView) {
            const view = preSearchView;
            preSearchView = null;
            restoreView(view);
            updateFloatingNav();
        }
        return;
    }

    // 검색을 처음 시작하는 시점의 화면을 기억해둔다
    if (!preSearchView) {
        preSearchView = captureCurrentView();
    }

    const lowerQuery = trimmed.toLowerCase();
    const matches = [];
    const seenIds = new Set();

    const dataSources = [
        typeof weaponsData !== 'undefined' ? weaponsData : {},
        typeof attachmentData !== 'undefined' ? attachmentData : {},
        typeof gearData !== 'undefined' ? gearData : {}
    ];

    dataSources.forEach(source => {
        Object.keys(source).forEach(categoryKey => {
            const list = source[categoryKey];
            if (Array.isArray(list)) {
                list.forEach(item => {
                    if (!item) return;
                    if (item.id) {
                        if (seenIds.has(item.id)) return;
                        seenIds.add(item.id);
                    }
                    const nameMatch = item.name && item.name.toLowerCase().includes(lowerQuery);
                    const keywordMatch = item.keyword && item.keyword.toLowerCase().includes(lowerQuery);
                    const manufacturerMatch = item.manufacturer && item.manufacturer.toLowerCase().includes(lowerQuery);
                    const categoryMatch = (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
                                          (getCategoryLabel(item.category) && getCategoryLabel(item.category).toLowerCase().includes(lowerQuery));
                    if (nameMatch || keywordMatch || manufacturerMatch || categoryMatch) {
                        matches.push(item);
                    }
                });
            }
        });
    });

    closeDropdown();
    showGridView(`"${trimmed}" 검색 결과`, matches, 'search', 'search');
}

