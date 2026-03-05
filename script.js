// 데이터 저장소 (실제로는 서버나 로컬스토리지 사용)
let weaponsData = {
    "권총": [
        {
            id: "1",
            keyword: "세르듀코프 규르자 굴자 결자 ",
            name: "Serdyukov SR-1MP Gyurza",
            manufacturer: "Serdyukov",
            manufacturerLogo: "assets/TsNIITochMash-logo.png",
            manufacturerUrl: "",
            image: "assets/sr1mp.png",
            description: "SR-1MP 권총(그라우 지수 6P53)은 ‘규르자(Gyurza, 독사)’ 또는 SPS(Serdyukov Semiautomatic Pistol)로도 알려져 있으며, 세르듀코프(P. Serdyukov)와 벨랴예프(I. Belyaev)가 강력한 9x21mm 탄을 사용하도록 설계한 모델입니다. 이 권총은 러시아 연방 특수부대가 사용하던 APS 기관권총을 대체하기 위해 개발되었습니다. SR-1MP는 추가 장비를 장착하기 위한 마운트 세트를 부착할 수 있으며, 소음기 설치용 기반으로도 활용될 수 있습니다.",
            stats: {
                recoil: "80",
                sway: "80",
                ergonomics: "85",
                accuracy: "7.49 MOA",
                velocity: "413 m/s",
                rpm: "480"
            }
        },
        {
            id: "2",
            keyword: "데저트 이글 엘6 데저트 이글 엘식 엘식 엘식 데글 디글",
            name: "Magnum Research Desert Eagle L6",
            manufacturer: "Magnum Research",
            manufacturerLogo: "assets/magnumresearch-logo.png",
            manufacturerUrl: "https://www.magnumresearch.com/",
            image: "assets/deaglel6.png",
            description: "데저트 이글 L6는 Magnum Research가 제작한 .50 액션 익스프레스(.50 AE) 탄을 사용하는 스포츠·헌팅용 권총의 개량형입니다. 이 권총은 크고 무거우며, 실사용 면에서 가장 실용적이지는 않지만, 다른 어떤 권총과도 비교할 수 없는 독특한 형태를 지녀 그 거대한 외형과 위압감 덕분에 수많은 비디오 게임에서 자주 등장하는 아이콘이 되었습니다. 군용 채택에는 실패했지만, 세계에서 가장 유명한 권총 중 하나라는 명성은 충분히 누리고 있습니다.",
            stats: {
                recoil: "120",
                sway: "116",
                ergonomics: "85",
                accuracy: "10.31 MOA",
                velocity: "440 m/s",
                rpm: "375"
            }
        },
        {
            id: "3",
            keyword: "데저트 이글 엘5 데저트 이글 엘식 엘식 엘식 데글 디글",
            name: "Magnum Research Desert Eagle L5 .50 AE",
            manufacturer: "Magnum Research",
            manufacturerLogo: "assets/magnumresearch-logo.png",
            manufacturerUrl: "https://www.magnumresearch.com/",
            image: "assets/deaglel5_50ae.png",
            description: "데저트 이글 L5는 Magnum Research가 제작한 .50 액션 익스프레스(.50 AE) 탄을 사용하는 스포츠·헌팅용 권총의 개량형입니다. 이 권총은 크고 무거우며, 실사용 면에서 가장 실용적이지는 않지만, 다른 어떤 권총과도 비교할 수 없는 독특한 형태를 지녀 그 거대한 외형과 위압감 덕분에 수많은 비디오 게임에서 자주 등장하는 아이콘이 되었습니다. 군용 채택에는 실패했지만, 세계에서 가장 유명한 권총 중 하나라는 명성은 충분히 누리고 있습니다.",
            stats: {
                recoil: "150",
                sway: "116",
                ergonomics: "85",
                accuracy: "8.25 MOA",
                velocity: "440 m/s",
                rpm: "375"
            }
        },
        {
            id: "4",
            keyword: "데저트 이글 엘5 데저트 이글 엘식 엘식 엘식 데글 디글",
            name: "Magnum Research Desert Eagle L5 .357",
            manufacturer: "Magnum Research",
            manufacturerLogo: "assets/magnumresearch-logo.png",
            manufacturerUrl: "https://www.magnumresearch.com/",
            image: "assets/deaglel5_357.png",
            description: "데저트 이글 L5는 Magnum Research가 제작한 .357 매그넘 탄을 사용하는 스포츠·헌팅용 권총의 개량형입니다. 이 권총은 크고 무거우며, 실사용 면에서 가장 실용적이지는 않지만, 다른 어떤 권총과도 비교할 수 없는 독특한 형태를 지녀 그 거대한 외형과 위압감 덕분에 수많은 비디오 게임에서 자주 등장하는 아이콘이 되었습니다. 군용 채택에는 실패했지만, 세계에서 가장 유명한 권총 중 하나라는 명성은 충분히 누리고 있습니다.",
            stats: {
                recoil: "117",
                sway: "116",
                ergonomics: "85",
                accuracy: "8.94 MOA",
                velocity: "440 m/s",
                rpm: "375"
            }
        },
        {
            id: "5",
            name: "HK USP",
            manufacturer: "Heckler & Koch",
            manufacturerLogo: "assets/hk-logo.png",
            manufacturerUrl: "https://www.heckler-koch.com/en",
            image: "assets/usp.png",
            description: "헤클러 앤 코흐에서 제작한 HK USP(Universelle Selbstladepistole, ‘범용 자동 장전 권총’)는 HK P7 시리즈 권총을 대체하기 위해 개발된 후속 모델입니다. 정확성과 뛰어난 신뢰성을 갖춘 권총으로 국제적으로 높은 평가를 받고 있습니다. 개량형 브라우닝식 작동 구조와 특허받은 반동 감소 시스템을 채택해, 권총 부품에 가해지는 반동 부담을 줄이는 동시에 사수가 느끼는 반동도 효과적으로 낮췄습니다.",
            stats: {
                recoil: "100",
                sway: "90",
                ergonomics: "89",
                accuracy: "9.63 MOA",
                velocity: "260 m/s",
                rpm: "480"
            }
        }
    ],
    "돌격 소총": [
        {
            id: "1",
            keyword: "콜트 칼트 엠심육에이원 예비군",
            name: "Colt M16A1",
            manufacturer: "Colt",
            manufacturerLogo: "assets/colt-logo.png",
            manufacturerUrl: "https://www.colt.com/",
            image: "assets/m16a1.png",
            description: "1960년대 후반에 Colt가 개발한 5.56x45mm 돌격 소총이자 AR-15/M16의 개량형입니다. M16A1은 베트남 전쟁 중 미군의 표준 제식 소총이 되었고, 신뢰성 향상을 위한 개량이 이루어졌습니다. 현대의 기준으로는 구식이지만, 수집가나 사격 애호가에게 높이 평가되고 있습니다. 또한 대한민국에서는 일부 예비군 부대에서 M16A1이 아직도 운용되고 있는 것으로 알려져 있습니다.",
            stats: {
                recoil: "120",
                sway: "200",
                ergonomics: "61",
                accuracy: "1.24 MOA",
                velocity: "1020 m/s",
                rpm: "900"
            }
        },
        {
            id: "2",
            keyword: "콜트 칼트 엠심육에이투 예비군",
            name: "Colt M16A2",
            manufacturer: "Colt",
            manufacturerLogo: "assets/colt-logo.png",
            manufacturerUrl: "https://www.colt.com/",
            image: "assets/m16a2.png",
            description: "M16 플랫폼의 후기 발전형인 M16A2는 3점사 기능과 향상된 부품을 도입하여 제어성과 내구성을 크게 개선한 모델입니다. 5.56x45mm NATO 탄을 사용하며 1980~1990년대 동안 미군의 주요 제식 소총으로 운용되었습니다. 높은 정확도와 신뢰성으로 잘 알려져 있으며, 현대 돌격 소총 설계의 기준점으로 평가받고 있습니다.",
            stats: {
                recoil: "115",
                sway: "200",
                ergonomics: "47",
                accuracy: "1.24 MOA",
                velocity: "1020 m/s",
                rpm: "900"
            }
        },
        {
            id: "3",
            keyword: "콜트 칼트 엠포 엠포에이원",
            name: "Colt M4A1",
            manufacturer: "Colt",
            manufacturerLogo: "assets/colt-logo.png",
            manufacturerUrl: "https://www.colt.com/",
            image: "assets/m4a1.png",
            description: "Colt M4A1은 5.56x45mm NATO탄을 사용하는 AR-15를 기반으로 미국에서 개발된 돌격 소총(카빈) 입니다. 본디 일반 소총보다 가볍고 작으면서도 같은 탄약을 사용하는 소총이 필요한 차량 승무원들과 화력지원반을 위해 개발되었으나, US SOCOM(미합중국 특수작전사령부) 이 특수작전에서도 사용하기 적합할 것이라 생각하여 곧바로 모든 하위 부대에게 M4A1을 보급하였고, 이어 미 육군 및 해병대도 사용하기 시작했습니다.",
            stats: {
                recoil: "115",
                sway: "170",
                ergonomics: "47",
                accuracy: "1.82 MOA",
                velocity: "850 m/s",
                rpm: "900"
            }
        },
        {
            id: "4",
            keyword: "시그 시그 사우어 지그 사우어 지그 자우어 엠씨엑스 블랙아웃",
            name: "SIG MCX",
            manufacturer: "SIG Sauer",
            manufacturerLogo: "assets/sigsauer-logo.png",
            manufacturerUrl: "https://www.sigsauer.com/",
            image: "assets/mcx.png",
            description: ".300 블랙아웃 MCX 라인은 SIG Sauer에서 설계·제작한 모델로, 반자동과 완전 자동 버전 모두 존재합니다. 이 총기는 이전의 SIG MPX 기관단총에서 이어진 쇼트 스트로크 가스 피스톤 시스템을 특징으로 합니다. .300 블랙아웃 탄약과 MCX는 모든 AR-15 규격의 탄창과 호환됩니다.",
            stats: {
                recoil: "114",
                sway: "120",
                ergonomics: "62",
                accuracy: "2.75 MOA",
                velocity: "397 m/s",
                rpm: "900"
            }
        },
        {
            id: "5",
            keyword: "시그 시그 사우어 지그 사우어 지그 자우어 스피어 68 육팔 퓨리",
            name: "SIG MCX-SPEAR",
            manufacturer: "SIG Sauer",
            manufacturerLogo: "assets/sigsauer-logo.png",
            manufacturerUrl: "https://www.sigsauer.com/",
            image: "assets/mcxspear.png",
            description: "MCX SPEAR는 SIG Sauer가 MCX 돌격 소총을 기반으로 설계·제작한 다구경 돌격 소총입니다. 기본적으로 새로운 6.8x51mm(.277 FURY) 탄을 사용하도록 제작되었으며, M4 카빈을 대체하도록 미군이 요구한 기준에 맞춰 특별히 설계되었습니다.",
            stats: {
                recoil: "125",
                sway: "113",
                ergonomics: "58",
                accuracy: "1.43 MOA",
                velocity: "988 m/s",
                rpm: "900"
            }
        },
        {
            id: "6",
            keyword: "에이치케이 흥국 흥국416 김흥국 헤클러 앤 코흐",
            name: "HK 416A5",
            manufacturer: "Heckler & Koch",
            manufacturerLogo: "assets/hk-logo.png",
            manufacturerUrl: "https://www.heckler-koch.com/en",
            image: "assets/hk416a5.png",
            description: "HK416 A5는 헤클러 앤 코흐에서 제작한 5.56x45 mm NATO 탄을 사용하는 HK416 돌격 소총의 추가 개량된 모델입니다. 이전 버전과 비교하여 가장 인상적인 변화는 시장성이 좋은 AR 플랫폼을 탑재했다는 점입니다. 소음기를 사용할 때 도구 없이 가스 조절이 가능하게 개선된 가스 조절기를 탑재하였으며, 사용자를 위하여 재설계된 하부 총몸은 완벽한 양손 조작이 가능하게 최적화되었습니다. 또한 실제 작동 조건에서 사용자의 안전, 신뢰성, 탄창의 호환성 및 내구성 등 기술적인 부분이 많이 개선되었습니다.",
            stats: {
                recoil: "113",
                sway: "135",
                ergonomics: "64",
                accuracy: "1.93 MOA",
                velocity: "850 m/s",
                rpm: "1000"
            }
        },
        {
            id: "7",
            name: "Radian Weapons Model 1",
            manufacturer: "Radian Weapons",
            manufacturerLogo: "assets/radian-logo.png",
            manufacturerUrl: "https://www.radianweapons.com/",
            image: "assets/radianmodel1.png",
            description: "Radian Weapons에서 제작한 Radian Model 1은 5.56x45 NATO탄을 사용하는 AR-15 플랫폼 돌격 소총입니다. 이 라이플은 전문가 및 스포츠 용도를 위한 신뢰성이 높고 고품질의 정확한 시스템으로 평가됩니다. 또한 Radian의 ADAC 시스템이 채택되어 있어 노리쇠 후퇴 고정 조작을 보다 신속하고 직관적으로 수행할 수 있도록 설계되었습니다. 이 시스템의 핵심은 오른손 검지 만으로 탄창 멈치와 노리쇠 멈치를 동시에 조작할 수 있다는 점입니다. 특히 탄 걸림(기능 고장) 발생 시, 사격 자세를 유지한 채 최소한의 움직임으로 안전하게 약실을 개방할 수 있어 극한의 전술 상황에서 진가가 발휘됩니다. 또한, 완전한 양손잡이(Ambidextrous) 설계로 왼손잡이 유저도 불편함 없이 모든 조작이 가능합니다.",
            stats: {
                recoil: "102",
                sway: "185",
                ergonomics: "51",
                accuracy: "1.66 MOA",
                velocity: "918 m/s",
                rpm: "900"
            }
        },
        {
            id: "8",
            name: "Radian Weapons Model 1 FA",
            manufacturer: "Radian Weapons",
            manufacturerLogo: "assets/radian-logo.png",
            manufacturerUrl: "https://www.radianweapons.com/",
            image: "assets/radianmodel1.png",
            description: "Radian Weapons에서 제작한 Radian Model 1은 5.56x45 NATO탄을 사용하는 AR-15 플랫폼 돌격 소총입니다. 이 라이플은 전문가 및 스포츠 용도를 위한 신뢰성이 높고 고품질의 정확한 시스템으로 평가됩니다. 또한 Radian의 ADAC 시스템이 채택되어 있어 노리쇠 후퇴 고정 조작을 보다 신속하고 직관적으로 수행할 수 있도록 설계되었습니다. 이 시스템의 핵심은 오른손 검지 만으로 탄창 멈치와 노리쇠 멈치를 동시에 조작할 수 있다는 점입니다. 특히 탄 걸림(기능 고장) 발생 시, 사격 자세를 유지한 채 최소한의 움직임으로 안전하게 약실을 개방할 수 있어 극한의 전술 상황에서 진가가 발휘됩니다. 또한, 완전한 양손잡이(Ambidextrous) 설계로 왼손잡이 유저도 불편함 없이 모든 조작이 가능합니다. 이 모델은 풀 오토 기능을 갖춘 Talon 조정간이 탑재되어 있습니다.",
            stats: {
                recoil: "102",
                sway: "185",
                ergonomics: "51",
                accuracy: "1.66 MOA",
                velocity: "918 m/s",
                rpm: "900"
            }
        },
        {
            id: "9",
            name: "Steyr AUG A3",
            manufacturer: "Steyr Mannlicher",
            manufacturerLogo: "assets/steyr-logo.png",
            manufacturerUrl: "https://www.steyr-arms.com/en/",
            image: "assets/auga3.png",
            description: "Steyr AUG A3는 오스트리아의 Steyr-Daimler-Puch에서 개발한 5.56x45mm 불펍 돌격 소총입니다. AUG는 우수한 인체공학적 설계, 준수한 명중률, 낮은 반동, 그리고 충분한 신뢰성으로 잘 알려져 있으며, 미래지향적인 디자인이 특징입니다. 또한 A3 버전에는 노리쇠 멈치가 탑재되어있습니다.",
            stats: {
                recoil: "100",
                sway: "40",
                ergonomics: "81",
                accuracy: "1.58 MOA",
                velocity: "850 m/s",
                rpm: "715"
            }
        },
        {
            id: "10",
            name: "ASh-12",
            manufacturer: "Izhmash",
            manufacturerLogo: "assets/izhmash-logo.png",
            manufacturerUrl: "",
            image: "assets/ash12.png",
            description: "ASh-12.7 (Avtomat Shturmovoy 12 - \"Assault Automatic Rifle 12\") 불펍 돌격소총은 CQB 및 시가전을 위해 개발된 소총으로, 러시아 연방보안국의 요청으로 Tula의 KBP 디자인 관리국의 자회사인 TsKIB SOO (총기 디자인 및 연구 중앙 관리국)에서 설계하고 이즈마쉬(Izhmash)에서 생산되었습니다. FSB 요원들이 시가전에서 수월하게 교전할 수 있도록 대인 저지력을 극대화했습니다.\n12.7×55mm STs-130이라는 전용 대구경 탄환을 사용하여 최대 100~300m 거리에서 압도적인 저지력을 발휘합니다. 또한, 일반적인 돌격소총과 달리 가스 작동식이 아닌 쇼트 리코일(Short Recoil) 방식으로 작동하여 반동 제어에 도움을 줍니다. 안전장치와 사격 모드 선택 레버가 분리되어 있어, 사수는 원하는 사격 모드를 빠르게 선택할 수 있습니다.",
            stats: {
                recoil: "100",
                sway: "166",
                ergonomics: "65",
                accuracy: "1.63 MOA",
                velocity: "327 m/s",
                rpm: "650"
            }
        },
        {
            id: "11",
            name: "CMMG Mk47 Mutant",
            manufacturer: "CMMG",
            manufacturerLogo: "assets/cmmg-logo.png",
            manufacturerUrl: "https://cmmg.com/",
            image: "assets/mk47.png",
            description: "CMMG Mk47 Mutant는 미국의 CMMG Inc.에서 제작한 7.62x39mm 구경의 카빈으로, 강철·폴리머·드럼 타입을 포함한 모든 종류의 AK 탄창과 호환이 가능한 특징을 가지고 있습니다. 이 카빈은 뛰어난 신뢰성을 입증했으며, AR 시스템 특유의 클래식한 조작성과 결합되어 우수한 성능을 보여주는 대표적인 총기로 평가되고 있습니다. 이 변형 모델은 완전자동 사격 모드를 갖추고 있으며, 법 집행기관 및 군용으로만 사용이 허가됩니다.",
            stats: {
                recoil: "150",
                sway: "125",
                ergonomics: "59",
                accuracy: "2.48 MOA",
                velocity: "697 m/s",
                rpm: "650"
            }
        },
        {
            id: "12",
            name: "Kalashnikov AK-74",
            manufacturer: "Izhmash",
            manufacturerLogo: "assets/kalashnikov-logo.png",
            manufacturerUrl: "https://en.kalashnikovgroup.ru/",
            image: "assets/ak74.png",
            description: "AK-74(Avtomat Kalashnikova 74 – ‘칼라시니코프 자동소총 74’) 5.45x39mm 돌격 소총은 군에서 새로운 5.45x39 탄약을 채용함에 따라, 1970년 미하일 칼라시니코프에 의해 AKM을 더욱 발전시킨 형태로 개발되었습니다. AK-74는 새로운 개머리판과 핸드가드(기존 AKM과 동일한 손가락 굴곡부 유지), 그리고 가스 실린더가 적용되었습니다. 개머리판은 AKM과는 다른 형태의 어깨받침을 사용하며, 고무 재질에 톱니 형태의 표면 처리가 되어 사수가 어깨에 더 안정적으로 고정할 수 있게 설계했습니다. 또한 개머리판 양측에는 경량화를 위한 컷이 존재합니다. 초기에는 개머리판, 하부 핸드가드, 상부 히트가드가 적층 목재로 제작되었으나, 이후 자주빛 또는 짙은 갈색의 합성 섬유(유리섬유) 재질로 변경되었습니다.",
            stats: {
                recoil: "113",
                sway: "110",
                ergonomics: "49",
                accuracy: "1.99 MOA",
                velocity: "880 m/s",
                rpm: "612"
            }
        },
        {
            id: "13",
            name: "Kalashnikov AKM",
            manufacturer: "Izhmash",
            manufacturerLogo: "assets/kalashnikov-logo.png",
            manufacturerUrl: "https://en.kalashnikovgroup.ru/",
            image: "assets/akm.png",
            description: "AKM(Avtomát Kaláshnikova Modernizírovanny – ‘현대화된 칼라시니코프 자동소총’) 7.62x39mm 자동 소총은 1959년 소련군의 표준 제식 소총으로 AK를 대체하기 위해 채용되었습니다. AK와 비교했을 때 주요 차이점은 향상된 명중 사거리, 더 가벼운 중량, 새로 설계된 개머리판과 방아쇠 구조, 해머 지연장치, 보정기(Muzzle Compensator), 그리고 소총의 효율을 개선하기 위한 기타 설계 변경점들입니다.",
            stats: {
                recoil: "129",
                sway: "115",
                ergonomics: "47",
                accuracy: "2.3 MOA",
                velocity: "775 m/s",
                rpm: "612"
            }
        },
        {
            id: "14",
            name: "Kalashnikov AKMN",
            manufacturer: "Izhmash",
            manufacturerLogo: "assets/kalashnikov-logo.png",
            manufacturerUrl: "https://en.kalashnikovgroup.ru/",
            image: "assets/akmn.png",
            description: "AKMN(Avtomat Kalashnikova Modernizirovanny Nochnoy – ‘야간용으로 현대화된 칼라시니코프 자동소총’)은 NSP 계열의 야간 투시 장비(NSP-2, NSP-3, NSP-3A, NSPU, NSPU-M)를 장착할 수 있도록 도브테일 마운트가 추가된 개량형 AKM 자동 소총입니다.",
            stats: {
                recoil: "120",
                sway: "115",
                ergonomics: "47",
                accuracy: "2.3 MOA",
                velocity: "775 m/s",
                rpm: "612"
            }
        },
        {
            id: "15",
            name: "AS VAL",
            manufacturer: "TsNIITochMash",
            manufacturerLogo: "assets/TsNIITochMash-logo.png",
            manufacturerUrl: "",
            image: "assets/asval.png",
            description: "AS VAL(Avtomat Specialniy VAL - \"특수 자동 소총 VAL\")은 TsNIITochMash(츠니토치마쉬)에서 특수부대를 위해 VSS 빈토레즈 플랫폼을 기반으로 설계 및 제작된 일체형 소음기를 갖춘 자동 소총입니다.",
            stats: {
                recoil: "80",
                sway: "110",
                ergonomics: "58",
                accuracy: "3.44 MOA",
                velocity: "280 m/s",
                rpm: "900"
            }
        },
        {
            id: "16",
            name: "VSS Vintorez",
            manufacturer: "TsNIITochMash",
            manufacturerLogo: "assets/TsNIITochMash-logo.png",
            manufacturerUrl: "",
            image: "assets/vss.png",
            description: "VSS (Vintovka Sniperskaya Specialnaya - \"특수 저격 소총\")는 일체형 소음기 특수 저격 소총이며, 1980년대에 특수 목적 팀과 태스크 포스를 위해 TsNIITochMash(츠니토치마쉬)에서 설계 및 제작되었습니다.",
            stats: {
                recoil: "75",
                sway: "101",
                ergonomics: "61",
                accuracy: "3.44 MOA",
                velocity: "280 m/s",
                rpm: "900"
            }
        },
        {
            id: "17",
            name: "SR-3M",
            manufacturer: "TsNIITochMash",
            manufacturerLogo: "assets/TsNIITochMash-logo.png",
            manufacturerUrl: "",
            image: "assets/sr3m.png",
            description: "SR-3M은 TsNIITochMash(츠니토치마쉬)에서 AS VAL 돌격 소총을 기반으로 개발된 강력한 돌격소총으로, 기관단총과 비슷할 정도로 매우 컴팩트한 크기를 갖고 있지만, 특수 철갑 탄약을 사용하기 때문에 화력 면에서는 확연히 더 뛰어난 특징이 있습니다. 또한 SR-3M은 러시아 특수부대가 은닉 휴대용 무기 사용 목적으로 사용하고 있습니다.",
            stats: {
                recoil: "70",
                sway: "108",
                ergonomics: "68",
                accuracy: "5.02 MOA",
                velocity: "280 m/s",
                rpm: "923"
            }
        },
        {
            id: "18",
            name: "DS Arms SA58",
            manufacturer: "DS Arms",
            manufacturerLogo: "assets/dsarms-logo.png",
            manufacturerUrl: "https://dsarms.com/",
            image: "assets/sa58.png",
            description: "SA58 OSW(Operations Specialist Weapon)는 미국 회사 DSA(또는 DS Arms, David Selvaggio Arms)가 제조한 소총으로, FAL의 합법적인 복제 모델입니다. 이 소총은 과거 StG-58에 사용된 것과 동일한 Steyr-Daimler-Puch 생산 설비로 제작되어 높은 신뢰성을 자랑합니다. 총열 길이는 여러 가지로 제공되며, 알루미늄 합금 하부 리시버와 유리섬유 강화 나일론 재질의 개량된 스톡과 핸드가드를 갖추고 있습니다. 민수용 모델은 반자동 전용이지만, 군과 법 집행 기관용으로는 분당 750발의 완전 자동 연사 속도를 지닌 선택 사격(Select-fire) 모델도 조달할 수 있습니다. DSA58은 모든 미터 규격의 FAL 탄창을 사용할 수 있습니다.",
            stats: {
                recoil: "182",
                sway: "150",
                ergonomics: "55",
                accuracy: "2.61 MOA",
                velocity: "839 m/s",
                rpm: "750"
            }
        }
    ],
    "기관단총": [
        {
            id: "1",
            name: "SIG MPX",
            manufacturer: "SIG Sauer",
            manufacturerLogo: "assets/sigsauer-logo.png",
            manufacturerUrl: "https://www.sigsauer.com/",
            image: "assets/mpx.png",
            description: "SIG MPX는 SIG Sauer가 제작한 빠른 발사속도를 자랑하고, 기존의 AR 계열 총기와 유사한 외형을 지닌 기관단총입니다. SIG MPX는 쇼트-스트로크 가스 피스톤 작동 방식을 사용하여 가스 조절기의 조정 없이 다양한 9mm 탄종 사용이 가능합니다. 풀사이즈의 마운트는 다양한 종류의 조준경과 조준기 장치들을 설치할 수 있게 해줍니다.",
            stats: {
                recoil: "107",
                sway: "120",
                ergonomics: "72",
                accuracy: "5 MOA",
                velocity: "374 m/s",
                rpm: "923"
            }
        },
        {
            id: "2",
            name: "FN P90",
            manufacturer: "FN Herstal",
            manufacturerLogo: "assets/fnherstal-logo.png",
            manufacturerUrl: "https://www.fnherstal.com/",
            image: "assets/p90.png",
            description: "FN Project 1990으로도 알려진 FN P90은 소형 개인방어화기(PDW)로 설계되었으며, 벨기에의 Fabrique Nationale Herstal(FN)에서 제작했습니다. 9x19mm Parabellum 탄을 사용하는 화기를 교체하려는 NATO의 요청에 따라, P90은 차량 승무원과 승무원 보조 인원, 지원부대, 특수부대, 그리고 대테러부대를 위해 작지만 강력한 화기로 만들어졌습니다.",
            stats: {
                recoil: "68",
                sway: "50",
                ergonomics: "78",
                accuracy: "3.75 MOA",
                velocity: "607 m/s",
                rpm: "923"
            }
        },
        {
            id: "3",
            name: "HK MP7A1",
            manufacturer: "Heckler & Koch",
            manufacturerLogo: "assets/hk-logo.png",
            manufacturerUrl: "https://www.heckler-koch.com/en",
            image: "assets/mp7a1.png",
            description: "헤클러 앤 코흐에서 제작한 HK MP7 기관단총은 매우 작고 가벼우며, 매우 좁은 공간에서 사용할 수 있으며, 실제로 반동이 거의 없습니다. 지속적으로 운반할 수 있다는 점이 오늘날의 군인에게 이상적인 개인화기가 되게 해주었습니다. MP7은 소지하고 있는 사람이 투입된 작전에 맞게 광범위하게 개조할 수 있습니다.",
            stats: {
                recoil: "65",
                sway: "50",
                ergonomics: "78",
                accuracy: "8.34 MOA",
                velocity: "651 m/s",
                rpm: "949"
            }
        },
        {
            id: "4",
            name: "PPSh-41",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            image: "assets/ppsh41.png",
            description: "PPSh-41(Pistolet-Pulemyot Shpagina, \"슈파긴의 기관단총\")은 소련의 기관단총으로, 게오르기 슈파긴이 PPD-40의 값비싸고 복잡한 구조를 대체하기 위해 저렴하고 신뢰성이 높으며 단순화된 설계로 개발한 무기입니다.",
            stats: {
                recoil: "52",
                sway: "50",
                ergonomics: "70",
                accuracy: "7.22 MOA",
                velocity: "454 m/s",
                rpm: "1000"
            }
        }
    ],
    "저격 소총": [
        {
            id: "1",
            name: "Accuracy International AXMC",
            manufacturer: "Accuracy International",
            manufacturerLogo: "assets/ai-logo.png",
            manufacturerUrl: "https://www.accuracyinternational.com/",
            image: "assets/axmc.png",
            description: "AXMC는 영국의 Accuracy International사가 설계·제작해 오며 실전에서 입증된 저격소총 계열의 최신 모델입니다. 기본적으로 .338 라푸아 매그넘 탄을 사용하지만, 총열·노리쇠·탄창(또는 삽입구)를 교체하면 .300 윈체스터 매그넘과 .308 윈체스터로도 빠르게 전환할 수 있습니다.",
            stats: {
                recoil: "220",
                sway: "150",
                ergonomics: "33",
                accuracy: "0.37 MOA",
                velocity: "920 m/s",
                rpm: "60"
            }
        },
        {
            id: "2",
            name: "SWORD International Mk-18 Mjölnir",
            manufacturer: "SWORD Defense Systems",
            manufacturerLogo: "assets/sword-logo.png",
            manufacturerUrl: "https://sworddefense.com/",
            image: "assets/mk18.png",
            description: "Mk-18 Mod 1 Extreme Distance Capable Semi-Automatic Rifle은 SWORD Defense Systems(구 SWORD International)이 제작한 .338 라푸아 매그넘, .338 노르마 매그넘, .300 노르마 매그넘 탄의 탄도 성능을 최대한 활용하도록 설계된 반자동 소총입니다. 이 시스템은 경량이면서도 기동성이 뛰어난 반자동 플랫폼에서 극장거리 사격 능력을 제공합니다. SWORD 고유의 쇼트 스트로크 가스 피스톤 시스템을 적용해 높은 정밀도, 신뢰성, 내구성을 갖추었으며, 양손 조작이 가능한 컨트롤과 인체공학적 설계, 모듈화 구조를 특징으로 합니다. Mk-18은 사냥꾼, 장거리 사격 애호가, 경기 사수들에게 훌륭한 선택지로 평가됩니다.",
            stats: {
                recoil: "235",
                sway: "150",
                ergonomics: "45",
                accuracy: "0.57 MOA",
                velocity: "890 m/s",
                rpm: "380"
            }
        },
        {
            id: "3",
            name: "Sako TRG M10",
            manufacturer: "Sako",
            manufacturerLogo: "assets/sako-logo.png",
            manufacturerUrl: "https://www.sako.global/",
            image: "assets/trgm10.png",
            description: "TRG M10은 Beretta Defense Technologies 그룹에 속한 Sako가 제작한 .338 라푸아 매그넘 탄을 사용하는 정밀 볼트액션 저격소총입니다. TRG M10은 매우 다재다능한 플랫폼으로, 본격적인 장거리 소총에서 더 컴팩트한 무기로 쉽게 전환할 수 있습니다. 이 소총은 여러 국가의 군, 경찰, 그리고 다양한 특수부대에서 사용하도록 설계되었습니다.",
            stats: {
                recoil: "190",
                sway: "130",
                ergonomics: "41",
                accuracy: "0.46 MOA",
                velocity: "920 m/s",
                rpm: "60"
            }
        },
        {
            id: "4",
            name: "Knight's Armament Company SR-25",
            manufacturer: "Knight's Armament Company",
            manufacturerLogo: "assets/kac-logo.png",
            manufacturerUrl: "https://www.knightarmco.com/",
            image: "assets/sr25.png",
            description: "SR-25 정밀 소총은 유진 스토너가 설계하고 나이츠 아머먼트 컴퍼니에서 제작한 7.62mm NATO 반자동 정밀 소총의 최신 발전형입니다. SR-25의 약 60%의 부품이 AR-15와 호환되고, 양손잡이용 노리쇠 멈치, 조정간, 탄창 분리 장치를 갖춰 왼손잡이 사용자도 AR-15 기반 조작계의 인체공학적 이점을 그대로 활용할 수 있습니다. 오른손잡이 사용자에게는 조작 효율을 높일 수 있는 추가적인 조작 방법을 제공합니다. 드롭-인 2단 방아쇠는 장거리 정밀 사격에 도움을 주며, 안정적이고 높은 명중률을 자랑합니다. E2 노리쇠와 가스 시스템은 소음기 장착 여부와 관계없이 우수한 신뢰성을 제공합니다.\n<em>\"아 아, 유진 스토너 그는 신이야...\"</em>",
            stats: {
                recoil: "132",
                sway: "102",
                ergonomics: "50",
                accuracy: "1.55 MOA",
                velocity: "939 m/s",
                rpm: "700"
            }
        },
        {
            id: "5",
            name: "Remington R11 RSASS",
            manufacturer: "Remington",
            manufacturerLogo: "assets/remington-logo.png",
            manufacturerUrl: "https://www.remarms.com/",
            image: "assets/rsass.png",
            description: "레밍턴 반자동 저격 시스템은 레밍턴 암즈와 JP 엔터프라이즈가 공동으로 개발한, 매우 정확하고 탁월한 완성도를 가진 고속 발사 저격소총의 결정체입니다. 이 무기는 반자동 플랫폼이 주는 전술적 이점을 유지하면서, 800미터 이상에서도 서브 MOA급의 정확도를 제공합니다.",
            stats: {
                recoil: "130",
                sway: "120",
                ergonomics: "49",
                accuracy: "0.77 MOA",
                velocity: "943 m/s",
                rpm: "700"
            }
        },
        {
            id: "6",
            name: "The AK Guy AK-50",
            manufacturer: "Brandon Herrera",
            manufacturerLogo: "assets/akguy-logo.png",
            manufacturerUrl: "https://www.theakguy.com/",
            image: "assets/ak50.png",
            description: "AK-50 반자동 대물 저격 소총은 칼라시니코프 플랫폼에 .50 BMG 탄약을 사용하도록 개조한 최초의 실험적 프로젝트입니다. AK-50은 뛰어난 관통력과 사거리를 가지고 있어, 매우 강력한 저격 소총입니다. 이 프로토타입은 총기 제조업체이자 유튜브 블로거인 브랜든 헤레라와 The AK Guy LTD의 일원으로 개발되었습니다.",
            stats: {
                recoil: "200",
                sway: "120",
                ergonomics: "40",
                accuracy: "0.31 MOA",
                velocity: "870 m/s",
                rpm: "500"
            }
        },
        {
            id: "7",
            name: "Tokarev SVT-40",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            image: "assets/svt.png",
            description: "표도르 바실리예비치 토카레프가 개발한 SVT-40은 기관단총의 대량 생산이 시작되기 전 제2차 세계대전 초기 소련군 내에서 대량 보급을 시도했던 최초의 반자동 소총이였습니다. 병사들은 이 소총을 애정을 담아 '스베타(Sveta)'라고 불렀습니다. '스베타'가 부대에 배치되자, 모든 붉은 군대 병사들이 이 무기를 진정으로 숙달할 수 있는 것은 아니라는 것이 드러났습니다. SVT는 해병 보병 부대와 저격수들이 가장 잘 활용했습니다. SVT-40의 생산은 전쟁이 끝날 때까지 계속되었으며, 이 반자동 소총은 전체 승리에 중요한 기여를 했습니다.",
            stats: {
                recoil: "102",
                sway: "102",
                ergonomics: "61",
                accuracy: "1.37 MOA",
                velocity: "965 m/s",
                rpm: "750"
            }
        },
        {
            id: "8",
            name: "Tokarev AVT-40",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            image: "assets/svt.png",
            description: "AVT-40은 제2차 세계대전 초기 권총과 기관단총의 부족을 부분적으로 보완했습니다. AVT-40은 설계 면에서 SVT-40과 유사하지만, 안전 장치 레버가 발사 모드 선택기의 역할을 수행하기 때문에 단발 사격과 연발 사격 모두 가능합니다.",
            stats: {
                recoil: "102",
                sway: "102",
                ergonomics: "61",
                accuracy: "1.37 MOA",
                velocity: "965 m/s",
                rpm: "750"
            }
        },
        {
            id: "9",
            name: "Barrett M107A1",
            manufacturer: "Barrett Firearms",
            manufacturerLogo: "assets/barrett-logo.png",
            manufacturerUrl: "https://barrett.net/",
            image: "assets/m107a1.png",
            description: "Barrett Firearms에서 제작한 M107A1은 .50 BMG탄을 사용하는 반자동 대물 저격 소총입니다. M82 계열의 최신 개량형으로, 미군 제식\n장거리 저격소총(LRSR)으로 채택되어 운용 중입니다. 이 라이플은 기존 M107보다 약 1.8kg 더 가벼워졌으며, 특히 소음기 장착에 최적화된 설계가 특징입니다. 총구에는 소음기를 즉시 장착할 수 있는 원통형 총구 제퇴기(Muzzle Brake)가 부착되어 있습니다. 알루미늄 상부 리시버와 티타늄 부품을 사용하여 내식성을 높이고 무게를 줄였으며, 기본적으로 10발들이 탄창을 사용합니다. M107A1의 유효 사거리는 약 1,829m에 달하며, 그 존재 자체만으로도 전장에서 강력한 심리적 영향을 미칩니다.",
            stats: {
                recoil: "212",
                sway: "120",
                ergonomics: "40",
                accuracy: "0.90 MOA",
                velocity: "895 m/s",
                rpm: "500"
            }
        },
        {
            id: "10",
            name: "CheyTac M200 Intervention",
            manufacturer: "CheyTac",
            manufacturerLogo: "assets/cheytac-logo.png",
            manufacturerUrl: "https://cheytac.com/",
            image: "assets/m200.png",
            description: "CheyTac USA에서 제작한 M200 Intervention은 .408 CheyTac 탄을 사용하는 볼트액션 저격 소총입니다.\n이 라이플은 EDM Arms Windrunner와 유사한 설계 철학을 공유하며, .408 CheyTac 탄환의 우수한 탄도 특성을 바탕으로, 약 2,000m에\n달하는 초장거리에서도 탄두가 초음속을 유지하며 안정적인 정밀 사격이 가능하도록 설계되었습니다. 이 총기는 특히 세계 최고 수준의\n장거리 정밀도로 명성이 높습니다. 총열 교체 및 총기 분해가 용이한 설계가 특징이며, 휴대용 탄도 계산기와 기상 측정 장비와의 연계를\n전제로 운용되는 시스템형 소총으로, 실용성을 희생하고 오직 초장거리 명중률이라는 단 하나의 목표에만 매달린 집념의 총기입니다.",
            stats: {
                recoil: "250",
                sway: "125",
                ergonomics: "38",
                accuracy: "0.3 MOA",
                velocity: "1017 m/s",
                rpm: "60"
            }
        },
        {
            id: "11",
            name: "Knight's Armament Company M110 SASS",
            manufacturer: "Knight's Armament Company",
            manufacturerLogo: "assets/kac-logo.png",
            manufacturerUrl: "https://www.knightarmco.com/",
            image: "assets/m110.png",
            description: "M110은 나이츠 아머먼트 컴퍼니에서 개발한 반자동 저격 시스템입니다. 기존 볼트액션 M24를 보완하기 위해 미 육군에 채택되었으며\n신뢰성 높은 SR-25 플랫폼을 기반으로 개발되었습니다. 시가전 등 빠른 대응이 필요한 전장에서 저격수와 지정사수에게 운용됩니다.\nFDE 색상과 전용 소음기 시스템이 특징입니다.",
            stats: {
                recoil: "131",
                sway: "98",
                ergonomics: "54",
                accuracy: "1.55 MOA",
                velocity: "939 m/s",
                rpm: "700"
            }
        }
    ],
    "산탄총": [
        {
            id: "1",
            name: "AA-12 Gen 1",
            manufacturer: "",
            manufacturerLogo: "assets/mf-logo.png",
            manufacturerUrl: "https://www.militaryfactory.com/smallarms/manufacturer.php?thisCompany=Military%20Police%20Systems",
            image: "assets/aa12.png",
            description: "AA-12 (Auto Assault-12)는 높은 신뢰성을 지닌 전자동 12게이지 산탄총입니다. 1세대 모델은 상단에 높게 부착된 일체형 기계식 조준기가 특징입니다. 이 산탄총은 반동 펄스를 누적시키는 독특한 구조로, 연사 속도와 저지력을 유지하면서도 부드러운 반동을 제공합니다. AA-12는 군과 경찰 부대를 위해 설계되었으며, Military Police Systems에서 제조되었습니다.",
            stats: {
                recoil: "95",
                sway: "100",
                ergonomics: "51",
                accuracy: "22.35 MOA",
                velocity: "436 m/s",
                rpm: "330"
            }
        },
        {
            id: "2",
            name: "AA-12 Gen 2",
            manufacturer: "",
            manufacturerLogo: "assets/mf-logo.png",
            manufacturerUrl: "https://www.militaryfactory.com/smallarms/manufacturer.php?thisCompany=Military%20Police%20Systems",
            image: "assets/aa12gen2.png",
            description: "AA-12 (Auto Assault-12)는 높은 신뢰성을 지닌 전자동 12게이지 산탄총입니다. 2세대 모델은 조준경을 부착할 수 있는 일체형 마운트가 특징입니다. 이 산탄총은 반동 펄스를 누적시키는 독특한 구조로, 연사 속도와 저지력을 유지하면서도 부드러운 반동을 제공합니다. AA-12는 군과 경찰 부대를 위해 설계되었으며, Military Police Systems에서 제조되었습니다.",
            stats: {
                recoil: "95",
                sway: "100",
                ergonomics: "51",
                accuracy: "22.35 MOA",
                velocity: "436 m/s",
                rpm: "330"
            }
        },
        {
            id: "3",
            name: "IzhMekh MP-43",
            manufacturer: "",
            manufacturerLogo: "assets/kalashnikov-logo.png",
            manufacturerUrl: "https://en.kalashnikovgroup.ru/",
            image: "assets/mp43.png",
            description: "이즈메흐에서 제작한 심플하고 우아한 클래식 더블-배럴 12게이지 샷건입니다. 모델에 따라 두 개의 방아쇠가 각각의 총열에 대응하는 방식과, 하나의 방아쇠로 발사 순서를 선택하는 단일 선택식 방아쇠 방식이 있습니다. 총열 내부는 부식 방지를 위해 크롬 도금 처리되어 내구성이 뛰어납니다.\n<em>\"더블배럴 샷건이야말로 훌륭한 대화 수단이지.\"</em>",
            stats: {
                recoil: "100",
                sway: "175",
                ergonomics: "51",
                accuracy: "13.06 MOA",
                velocity: "425 m/s",
                rpm: "기록되지않음"
            }
        }
    ],
    "경기관총": [
        {
            id: "1",
            name: "Kalashnikov PKM",
            manufacturer: "V.A. Degtyarev",
            manufacturerLogo: "assets/kalashnikov-logo.png",
            manufacturerUrl: "https://en.kalashnikovgroup.ru/",
            image: "assets/pkm.png",
            description: "PKM(Pulemyot Kalashnikova Modernizirovanny – ‘칼라시니코프의 기관총 개량형’)은 칼라시니코프 PK 기관총의 현대화 버전으로, 7.62×54R 탄약을 사용해 작동합니다. PKM은 강력하고 단순하며 신뢰성과 효율성이 뛰어난 무기로 입증되었습니다. 1960년대 후반부터 현재까지 수십 년 동안 높은 수요를 유지해왔습니다. 제조는 V.A. Degtyarev(데그탸료프) 공장에서 이루어졌습니다.",
            stats: {
                recoil: "80",
                sway: "150",
                ergonomics: "50",
                accuracy: "1.08 MOA",
                velocity: "1059 m/s",
                rpm: "649"
            }
        }
    ],
    "유탄 발사기": [
        {
            id: "1",
            name: "Milkor M32A1",
            manufacturer: "Milkor USA",
            manufacturerLogo: "assets/milkor-logo.png",
            manufacturerUrl: "https://www.milkorusa.com/",
            image: "assets/m32.png",
            description: "M32A1 MSGL은 Milkor USA에서 제조한 40mm 6연발 유탄 발사기입니다. 이 총기는 가스 작동식 반자동 회전 실린더 방식을 사용하여, 노리쇠 멈치 없이도 방아쇠를 당기는 것만으로 다음 탄이 자동으로 장전됩니다. 이 리볼버식 실린더는 총몸 옆으로 스윙아웃(Swing-out)되며, 재장전을 위해 사수가 직접 손으로 스프링을 감아줘야(수동 와인딩) 합니다. 덕분에 일반 단발 유탄 발사기보다 압도적인 화력 집중 능력을 제공하며, 장전된 유탄의 종류를 육안으로 쉽게 확인할 수 있어 다양한 전술 상황에 유연하게 대응할 수 있습니다. ",
            stats: {
                recoil: "550",
                sway: "200",
                ergonomics: "51",
                accuracy: "16.5 MOA",
                velocity: "76 m/s",
                rpm: "750"
            }
        }
    ],
    "특수": []
};

// 기어 데이터 (웨폰과 동일한 구조)
let gearData = {
    "헬멧": [
        {
            id: "1",
            keyword: "",
            name: "Altyn",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/altyn.png",
                "assets/altyn_2.png"
            ],
            description: "알틴 헬멧은 1980년대 초반 소련 KGB(국가보안위원회)의 요청에 따라 NII Stali(강철 과학 연구소)에서 개발된 특수 작전용 티타늄\n헬멧입니다. 스위스의 TIG PSH-77 헬멧을 모체로 하여 러시아의 작전 환경에 맞춰 독자적으로 개량되었으며, 1980년대 아프가니스탄\n전쟁부터 2000년대 초반까지 알파(Alfa) 및 빔펠(Vympel) 등 최정예 스페츠나츠 부대의 상징적인 장비로 운용되었습니다.",
            stats: {
                bulletDamageProtection: "90", 
                bloodDamageProtection: "0",
                shockDamageProtection: "90"   
            }
        },
        {
            id: "2",
            keyword: "",
            name: "Maska-1SCH",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/maska.png",
                "assets/maska_2.png"
            ],
            description: "마스카-1SCH 헬멧은 1990년대 초반 러시아 NII Stali에서 개발된 강철제 중장갑 헬멧입니다. 값비싼 티타늄 대신 2.5mm~3mm 두께의 강철을 사용하여 제작되었으며, 시야를 극도로 제한하는 대신 안면 전체를 완벽하게 보호하는 강철 바이저가 가장 큰 시각적 특징입니다. 주로 내무반(MVD) 산하 특수부대에서 건물 진입 및 폭동 진압용으로 사용되었으며, 특유의 투박하고 위압적인 외형 덕분에 오늘날 러시아 스페츠나츠를 상징하는 대표적인 장비로 알려져 있습니다. ",
            stats: {
                bulletDamageProtection: "90", 
                bloodDamageProtection: "0",
                shockDamageProtection: "95"   
            }
        },
        {
            id: "3",
            keyword: "킬라 킬라뚝",
            name: "Maska-1SCH (킬라)",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/maska_killa.png",
                "assets/maska_killa_2.png"
            ],
            description: "한때 한 대형 쇼핑몰을 공포로 몰아넣은 사내의 상징적인 헬멧입니다.\n기존 마스카 헬멧 전면에 그려진 세 줄무늬 도색은 그의 집요함과 냉혹한 성향을 드러냅니다.\n그래서인지 쇼핑몰에서 그에게 희생당한 자들의 비명과 슬픔이 섞인 노래가 들리는 것 같습니다.",
            stats: {
                bulletDamageProtection: "90", 
                bloodDamageProtection: "0",
                shockDamageProtection: "95"   
            }
        },
        {
            id: "4",
            keyword: "",
            name: "Tagilla's Welding Mask - Gorilla",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/tagillahelmet_gorilla.png",
                "assets/tagillahelmet_gorilla_2.png"
            ],
            description: "타길라가 사용하던 용접면입니다.\n해당 모델은 타길라의 전투 방식에서 드러나는 난폭함과 압박감을 상징하는 듯한 고릴라로 도색되어있습니다.\n현재까지도 그의 포효가 끊임없이 울리는 것 같습니다.",
            stats: {
                bulletDamageProtection: "87", 
                bloodDamageProtection: "0",
                shockDamageProtection: "90"   
            }
        },
        {
            id: "5",
            keyword: "",
            name: "Tagilla's Welding Mask - UBEY",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/tagillahelmet_ubey.png",
                "assets/tagillahelmet_ubey_2.png"
            ],
            description: "타길라가 사용하던 용접면입니다.\n해당 모델은 타길라의 광기 어린 성격과 무자비함이 적나라하게 드러나는 도색이 특징입니다.\n<em>\"УБЕЙ, УБЕЙ!\"</em>",
            stats: {
                bulletDamageProtection: "87", 
                bloodDamageProtection: "0",
                shockDamageProtection: "90"   
            }
        }
    ],
    "전신 방탄복": [
        {
            id: "1",
            keyword: "",
            name: "6B43 Zabralo-Sh",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/6b43.png",
                "assets/6b43_2.png"
            ],
            description: "6B43 자브랄로 전신 방탄복은 러시아의 Techinkom사에서 개발한 러시아군 표준 6B4 시리즈의 중전투용 방탄복입니다.\n'라트니크(Ratnik)' 차세대 전투 시스템의 일환으로 도입되었으며, 전면과 후면에 Granit(그라닛) 세라믹 플레이트를 삽입하여\n러시아 방호 규격 GOST 6A 등급을 충족, 소총탄 및 철갑탄에 대한 강력한 방어력을 제공합니다. 특히 전신 방호를 목적으로 설계되어\n목, 어깨, 사타구니를 보호하는 추가 방호 패널이 기본 적용되었으며, 습기와 열 방출을 돕는 내부 패드 시스템을 통해 장시간 전투 시 편의성을 높였습니다. 훗날 개량형인 6B45의 모태가 된 모델로, 러시아 보병 중장갑 체계의 표준을 제시한 장비입니다.",
            stats: {
                bulletDamageProtection: "98", 
                bloodDamageProtection: "0",
                shockDamageProtection: "98"   
            }
        },
        {
            id: "2",
            keyword: "",
            name: "FORT Redut-T5",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/redut_t5.png",
                "assets/redut_t5_2.png"
            ],
            description: "FORT Redut-T5는 Redut-M을 기반으로 방호 면적을 극대화한 중장갑 돌격용 모델입니다.\n기존 레두트 구조에 어깨 보호대와 확장된 하부 방호 패널을 추가하여 사수의 전신을 파편과 총탄으로부터 보호합니다.\n무게가 16kg 이상으로 매우 무거워 기동성은 낮으나, 시가전이나 건물 진입 작전에서 대원을 완벽하게 보호하는 '움직이는 요새' 역할을\n수행하기 위해 최적화된 장비입니다.",
            stats: {
                bulletDamageProtection: "93", 
                bloodDamageProtection: "0",
                shockDamageProtection: "91.5"   
            }
        },
        {
            id: "3",
            keyword: "",
            name: "FORT Redut-M",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/redut_m.png",
                "assets/redut_m_2.png",
                "assets/redut_m_3.png"
            ],
            description: "FORT Redut-M은 러시아 FORT Technology사가 FSB(연방보안국) 특수부대를 위해 개발한 전면 방호형 방탄복입니다.\n90년대 중반부터 현대까지 러시아 대테러 부대의 상징적인 장비로 사용되었으며, 흉부와 등뿐만 아니라 측면(옆구리)까지 빈틈없이 감싸는 풀 커버리지 설계가 특징입니다. 티타늄 또는 세라믹 플레이트를 결합하여 강력한 소총탄 방호력을 제공하며\n실전에서 검증된 신뢰성 덕분에 러시아 중갑 방탄복의 표준으로 자리 잡았습니다.",
            stats: {
                bulletDamageProtection: "92.5", 
                bloodDamageProtection: "0",
                shockDamageProtection: "91.5"   
            }
        },
        {
            id: "4",
            keyword: "",
            name: "6B13",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/6b13.png",
                "assets/6b13_2.png"
            ],
            description: "2000년대 초반 도입된 러시아군 표준 돌격용 방탄복입니다. 높은 목 보호대와 어깨 패드가 특징이며, 전·후면에 방탄판을 삽입하여 소총탄을 방어합니다. 몰리(MOLLE) 시스템이 없는 구형 설계지만, 특유의 견고함으로 오랜 기간 주력 장비로 사용되었습니다.",
            stats: {
                bulletDamageProtection: "80", 
                bloodDamageProtection: "0",
                shockDamageProtection: "80"   
            }
        },
        {
            id: "5",
            keyword: "킬라 킬라갑빠",
            name: "6B13 (킬라)",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/6b13_killa.png",
                "assets/6b13_killa_2.png"
            ],
            description: "한때 한 대형 쇼핑몰의 지배자가 착용했던 중장갑 방탄복입니다. 기존 6B13 방탄복보다 더 강한 방탄 성능을 가지는 것으로 확인되었습니다.\n<em>\"침입자에겐 죽음을...\"</em>",
            stats: {
                bulletDamageProtection: "93", 
                bloodDamageProtection: "0",
                shockDamageProtection: "95"   
            }
        },
        {
            id: "6",
            keyword: "",
            name: "6B23",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/6b23.png",
                "assets/6b23_2.png"
            ],
            description: "6B13을 개선하여 2000년대 중반부터 보급된 러시아군 제식 방탄복입니다. 착용감과 기동성을 대폭 향상했으며, 가슴 부위에 방탄판을 넣고 나머지 부분은 파편 보호용 소프트 아머로 구성했습니다. 몰리가 여전히 없어 별도의 전술 조끼(6Sh112 등)를 위에 겹쳐 입는 것이 일반적입니다.",
            stats: {
                bulletDamageProtection: "82", 
                bloodDamageProtection: "0",
                shockDamageProtection: "80"   
            }
        },
        {
            id: "7",
            keyword: "",
            name: "6B45",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/6b45.png"
            ],
            description: "러시아군의 차세대 보병 장비 체계인 라트니크(Ratnik)의 핵심 방탄복으로, 기존 6B23을 대체하기 위해 개발된 표준 장비입니다. 아라미드 소재의 기본 방편 성능에 더해, 전·후면 포켓에 그라니트(Granit) 세라믹 판을 삽입하여 소총탄을 방어하는 강력한 저지력을 발휘합니다.\n전신에 적용된 PALS/MOLLE 시스템으로 각종 파우치를 자유롭게 배치할 수 있으며, 목 보호대와 신속 해제 장치를 갖춰 실전에서의\n생존성과 편의성을 동시에 확보한 러시아 지상군의 주력 전술 플랫폼입니다.",
            stats: {
                bulletDamageProtection: "82", 
                bloodDamageProtection: "0",
                shockDamageProtection: "90"   
            }
        },
        {
            id: "8",
            keyword: "",
            name: "IOTV 4세대",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/iotv.png"
            ],
            description: "미 육군의 주력 표준 방탄복으로, 이전 세대 대비 무게를 획기적으로 줄이고 기동성을 개선한 4세대 개량형 모델입니다. 단일 케이블 방식의 퀵 릴리즈(신속 해제) 시스템을 적용하여 비상시 단 한 번의 조작으로 신속한 탈거가 가능합니다. 측면 방탄판 포켓이 통합된 설계와 더불어 목, 어깨, 사타구니 등 전신 방호 파츠를 자유롭게 결합할 수 있어 최상의 방어력을 제공합니다. 하중 분산을 최적화한 내부 커머번드 설계를 통해 중량급 장비임에도 장시간 작전 시 사용자의 피로도를 최소화한 핵심 전술 플랫폼입니다.",
            stats: {
                bulletDamageProtection: "90", 
                bloodDamageProtection: "0",
                shockDamageProtection: "91"   
            }
        },
        {
            id: "9",
            keyword: "",
            name: "NFM Thor Integrated Carrier",
            manufacturer: "NFM Group",
            manufacturerLogo: "assets/nfm-logo.png",
            manufacturerUrl: "https://nfm.no/",
            images: [
                "assets/thor.png",
                "assets/thor_2.png"
            ],
            description: "NFM Group사의 THOR Integrated Carrier (THOR IC)는 노르웨이 국방부와의 협업을 통해 개발된 전술 방탄복입니다.\n명칭의 'Integrated(통합)'는 소프트 아머와 하드 방탄판을 하나의 시스템으로 결합했다는 의미를 뜻합니다. 이 제품은 사용자의 몸을 360도\n전 방향에서 감싸는 설계를 통해 파편 및 권총탄으로부터 전신을 보호하며, 전·후면 및 측면 포켓에 하드 플레이트를 삽입하여 소총탄까지\n방어할 수 있습니다. 특히 인체공학적 설계와 조절 가능한 커머번드를 통해 중량급 장비임에도 기동성을 유지하며, 퀵 릴리즈 시스템을 갖춰 비상시 신속한 탈착이 가능한 현대적 전방위 방호 플랫폼입니다.",
            stats: {
                bulletDamageProtection: "93", 
                bloodDamageProtection: "0",
                shockDamageProtection: "91.5"   
            }
        }
    ],
    "플레이트 캐리어": [
        {
            id: "1",
            keyword: "",
            name: "First Spear Siege-R Optimized M.A.S.S.",
            manufacturer: "First Spear",
            manufacturerLogo: "assets/firstspear-logo.png",
            manufacturerUrl: "https://www.first-spear.com/",
            images: [
                "assets/mass.png",
                "assets/mass_2.png",
                "assets/mass_3.png"
            ],
            description: "First Spear Siege-R Optimized M.A.S.S. 플레이트 캐리어는 미국의 전술 장비 제조사인 First Spear에서 개발한 혁신적인 중량급 플레이트 캐리어입니다. 이 제품은 기존의 무거운 웨빙 대신 레이저 커팅 기술인 6/12™ 시스템을 적용하여 전체 무게를 획기적으로 줄였으며\n독자적인 Tubes™ 퀵 릴리즈 시스템을 통해 단 한 번의 조작으로 신속한 착용과 탈거가 가능합니다. 특히 M.A.S.S. 옵션을 선택할 경우\n목, 어깨, 사타구니 등 전신 방호 파츠를 추가로 결합할 수 있어, 경량화와 최대 수준의 방호력을 동시에 요구하는 특수부대 및 법 집행 기관의 중갑 대원들에게 최적화된 장비입니다.",
            stats: {
                bulletDamageProtection: "95", 
                bloodDamageProtection: "0",
                shockDamageProtection: "97"   
            }
        },
        {
            id: "2",
            keyword: "",
            name: "First Spear Strandhögg",
            manufacturer: "First Spear",
            manufacturerLogo: "assets/firstspear-logo.png",
            manufacturerUrl: "https://www.first-spear.com/",
            images: [
                "assets/strandhogg.png",
                "assets/strandhogg_2.png",
                "assets/strandhogg_3.png"
            ],
            description: "First Spear Strandhögg(스트랜드호그)는 미국의 전술 장비 제조사인 First Spear의 주력 경량 플레이트 캐리어입니다.\n이 모델은 중량급인 Siege-R과 달리, 방탄 플레이트 최소화 및 기동성에 중점을 둔 설계가 특징입니다.\n핵심 기술인 6/12™ 레이저 커팅 시스템과 Tubes™ 퀵 릴리즈 시스템을 모두 채택하여, 기존 몰리(MOLLE) 방식보다 무게는\n가볍고 탈착은 훨씬 신속합니다. 불필요한 면적을 줄인 스켈레톤 스타일의 커머번드(옆구리 스트랩)는 통기성을 극대화하며\n플레이트를 감싸는 특유의 신축성 있는 소재는 장비 착용 시 사용자의 움직임을 방해하지 않고 완벽하게 밀착되도록 설계되었습니다.\n뛰어난 착용감과 기동성으로 인해 미군 특수부대 및 다양한 법 집행 기관에서 광범위하게 사용되는 현대적인 방탄복입니다.",
            stats: {
                bulletDamageProtection: "81.5", 
                bloodDamageProtection: "0",
                shockDamageProtection: "90"   
            }
        },
        {
            id: "3",
            keyword: "",
            name: "Crye Precision AVS (타길라)",
            manufacturer: "Crye Precision",
            manufacturerLogo: "assets/crye-logo.png",
            manufacturerUrl: "https://www.cryeprecision.com/",
            images: [
                "assets/tagillaavs.png",
                "assets/tagillaavs_2.png"
            ],
            description: "타길라가 사용하던 플레이트 캐리어이며, 그의 광기가 서려있는 듯한 비주얼이 특징입니다.",
            stats: {
                bulletDamageProtection: "81.5", 
                bloodDamageProtection: "0",
                shockDamageProtection: "90"   
            }
        },
        {
            id: "4",
            keyword: "",
            name: "Ferro Concepts FCPC V5",
            manufacturer: "Ferro Concepts",
            manufacturerLogo: "assets/ferro-logo.png",
            manufacturerUrl: "https://ferroconcepts.com/",
            images: [
                "assets/fcpcv5.png"
            ],
            description: "경량 라미네이트 소재와 인체공학적 설계를 결합한 5세대 플레이트 캐리어로, ADAPT 시스템을 통해 극대화된 모듈성과 기동성을 제공하는 현대적 전술 장비의 정점입니다.",
            stats: {
                bulletDamageProtection: "70", 
                bloodDamageProtection: "0",
                shockDamageProtection: "70"   
            }
        },
        {
            id: "5",
            keyword: "",
            name: "Crye Precision JPC",
            manufacturer: "Crye Precision",
            manufacturerLogo: "assets/crye-logo.png",
            manufacturerUrl: "https://www.cryeprecision.com/",
            images: [
                "assets/jpc.png"
            ],
            description: "미국 Crye Precision사가 낙하산 강습 등 고도의 기동 작전을 위해 개발한 초경량 플레이트 캐리어입니다. 독자적인 스켈레탈(Skeletal™)\n커머번드를 적용하여 통기성을 극대화하고 무게를 극한으로 줄인 미니멀리즘 설계가 특징입니다. 특수 소재의 어깨 스트랩으로 얇은\n두께에도 안정적인 하중 분산을 제공하며, 후면 지퍼를 통한 Zip-on 패널 확장성과 신속 탈착 기능을 갖춰 전 세계 특수부대의 표준 장비로 자리 잡았습니다.",
            stats: {
                bulletDamageProtection: "55", 
                bloodDamageProtection: "0",
                shockDamageProtection: "50"   
            }
        },
        {
            id: "6",
            keyword: "",
            name: "Crye Precision JPC 2.0 MARITIME",
            manufacturer: "Crye Precision",
            manufacturerLogo: "assets/crye-logo.png",
            manufacturerUrl: "https://www.cryeprecision.com/",
            images: [
                "assets/jpc20.png"
            ],
            description: "해상 및 수륙양용 작전 최적화를 위해 JPC 2.0을 기반으로 개발된 특수 목적형 플레이트 캐리어입니다. 전체가 메시(Mesh) 소재로 제작되어 물에 젖어도 즉각적으로 배수되며, 바닷물에 의한 부식과 무게 증가를 최소화합니다. 특히 팔의 가동범위를 넓힌 스위머 컷(Swimmer Cut) 옵션을 제공해 수영이나 등반 시 활동성을 극대화했으며, 2단계 신속 해제 시스템을 갖춰 비상시 생존성을 높였습니다.\n초경량 설계와 더불어 후면 지퍼를 통한 Zip-on 패널 확장성을 유지하여, 해상 특수부대원들에게 최상의 기동성과 모듈성을 제공하는\n전문 전술 플랫폼입니다.",
            stats: {
                bulletDamageProtection: "58", 
                bloodDamageProtection: "0",
                shockDamageProtection: "50"   
            }
        },
        {
            id: "7",
            keyword: "",
            name: "Arms Arma A-18 Skanda",
            manufacturer: "Arms Arma",
            manufacturerLogo: "assets/arsarma-logo.png",
            manufacturerUrl: "https://arsarma.net/",
            images: [
                "assets/a18.png"
            ],
            description: "러시아의 전술 장비 제조사인 Ars Arma에서 독자 설계한 A-18 Skanda는 높은 범용성을 갖춘 경·중량급 모듈러 플레이트 캐리어입니다.\n기존 장비 대비 방호 면적을 약 25% 확장하여 생존성을 높였으며, 전면 패널과 커머번드를 자유롭게 교체할 수 있는 설계를 통해 임무에\n최적화된 장비 구성이 가능합니다. 러시아의 그라니트(Granit) 판부터 서방의 SAPI 방탄판까지 폭넓은 호환성을 자랑하며, 양방향 퀵 릴리즈 시스템과 인체공학적 어깨 스트랩을 적용해 실전에서의 신속한 탈착과 하중 분산 능력을 동시에 확보한 러시아 특수부대의 핵심 장비입니다.",
            stats: {
                bulletDamageProtection: "85", 
                bloodDamageProtection: "0",
                shockDamageProtection: "70"   
            }
        }
    ],
    "마스크": [
        {
            id: "1",
            keyword: "",
            name: "Gentex Ops-Core SOTR Respirator",
            manufacturer: "Gentex",
            manufacturerLogo: "assets/gentex-logo.png",
            manufacturerUrl: "https://www.gentex.com/",
            images: [
                "assets/sotr.png",
                "assets/sotr_2.png"
            ],
            filterChargeable: "yes",
            description: "Gentex에서 제작한 SOTR 호흡기는 지상 작전 전용으로 개발되었으며, 위험한 공중 유해 화합물 및 입자로부터 작업자를 보호하기 위해\n설계되었습니다. 이 제품은 납, 석면, 윤활유, 가연성 물질의 연기 등 대부분의 유해 입자에 대해 신뢰할 수 있는 여과 기능을 제공합니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "2",
            keyword: "",
            name: "Avon M53A1",
            manufacturer: "Avon Protection",
            manufacturerLogo: "assets/avon-logo.png",
            manufacturerUrl: "https://www.avon-protection.com/",
            images: [
                "assets/m53a1.png",
                "assets/m53a1_2.png"
            ],
            filterChargeable: "yes",
            description: "Avon Protection 사의 M53A1 방독면은 JSGPM(Joint Service General Purpose Mask, 통합 서비스 범용 마스크) 프로그램에 따라 개발되었습니다. 이 제품은 다양한 환경에서 가볍고 편안한 디자인을 유지하면서도, 특수 작전 부대원들에게 CBRN(화학·생물·방사능·핵) 위협으로부터 최대한의 보호를 제공하기 위해 제작되었습니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "3",
            keyword: "",
            name: "Momex Balaclava",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/momex.png",
                "assets/momex_2.png"
            ],
            description: "택티컬을 선호하는 사용자에게 딱 맞는 발라클라바입니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "4",
            keyword: "",
            name: "Crow Balaclava",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            image: "assets/crow.png",
            description: "까마귀와 흡사한 발라클라바입니다. 과연, 오늘은 어떤 사체를 찾으러 나서는 것일까요?",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        }
    ],
    "백팩": [
        {
            id: "1",
            keyword: "",
            name: "6Sh118 레이드 백팩",
            manufacturer: "",
            manufacturerLogo: "",
            manufacturerUrl: "",
            images: [
                "assets/6sh118.png",
                "assets/6sh118_2.png",
                "assets/6sh118_3.png",
                "assets/6sh118_4.png",
                "assets/6sh118_5.png",
                "assets/6sh118_6.png",
                "assets/6sh118_7.png"
            ],
            description: "러시아군 차세대 보병 체계인 '라트니크(Ratnik)'의 제식 대형 배낭입니다. 최대 120리터에 달하는 압도적인 용량을 자랑하며, 장거리 정찰 및 대규모 물자 수송 임무에 최적화되어 있습니다. 내구성이 뛰어난 강철 프레임과 하중 분산 설계 덕분에 무거운 짐을 메고도 안정적인\n기동이 가능합니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "2",
            keyword: "",
            name: "5.11 Tactical RUSH 100",
            manufacturer: "5.11 Tactical",
            manufacturerLogo: "assets/511tac-logo.png",
            manufacturerUrl: "https://www.511tactical.com/",
            images: [
                "assets/rush100.png"
            ],
            description: "미국의 유명 전술 장비 제조사 5.11 Tactical에서 제작한 대용량 군용 백팩입니다. 견고한 500D 나일론 소재와 알루미늄 프레임을 채택하여 최대 60리터의 짐을 안정적으로 지탱하며, 전신에 배치된 몰리(MOLLE) 시스템으로 높은 확장성을 자랑합니다. 특히 하단의 침낭 보관함과 탈부착 가능한 측면 파우치는 장기 생존 임무에 최적화된 설계를 보여줍니다. 거친 환경에서도 형태가 무너지지 않는 이 배낭은,\n어떠한 위기 속에서도 사용자의 생존을 끝까지 책임질 든든한 동반자입니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "3",
            keyword: "",
            name: "Mystery Ranch Blackjack 50",
            manufacturer: "Mystery Ranch",
            manufacturerLogo: "assets/mystery-logo.png",
            manufacturerUrl: "https://www.mysteryranch.com/",
            images: [
                "assets/blackjack.png",
                "assets/blackjack_2.png",
                "assets/blackjack_3.png",
                "assets/blackjack_4.png",
                "assets/blackjack_5.png"
            ],
            description: "미국 미군 특수부대(USSOCOM)의 요구 사항에 맞춰 개발된 대용량 전술 배낭입니다. 매우 튼튼한 소재와 하중 분산 기술로 유명하며, 거친 환경에서도 장비를 안정적으로 운반할 수 있습니다. 메인 수납공간은 지퍼를 통해 빠르게 열 수 있어 물품 접근성이 뛰어납니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "4",
            keyword: "",
            name: "Mystery Ranch SATL Bridger Assault Pack",
            manufacturer: "Mystery Ranch",
            manufacturerLogo: "assets/mystery-logo.png",
            manufacturerUrl: "https://www.mysteryranch.com/",
            images: [
                "assets/satl.png",
                "assets/satl_2.png",
                "assets/satl_3.png",
                "assets/satl_4.png",
                "assets/satl_5.png"
            ],
            description: "미국 특수작전사령부(USSOCOM)의 표준 장비로 채택되어 오랜 기간 전장에서 검증된 전설적인 공격용 배낭입니다.\n특수부대원들이 공수 작전과 장거리 정찰 시 필요한 탄약과 보급품을 효율적으로 운반할 수 있도록 설계되었습니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "5",
            keyword: "",
            name: "Eberlestock F4 Terminator Load Bearing",
            manufacturer: "Eberlestock",
            manufacturerLogo: "assets/eberlestock-logo.png",
            manufacturerUrl: "https://www.mysteryranch.com/",
            images: [
                "assets/terminator.png",
                "assets/terminator_2.png",
                "assets/terminator_3.png"
            ],
            description: "미국의 전술 장비 제조사인 Eberlestock에서 개발한 장거리 정찰 및 저격 작전용 초대형 백팩입니다. '터미네이터(Terminator)'라는\n이름처럼 단독으로 장기간 생존하며 임무를 수행하는 저격수와 정찰병에게 최적화된 장비입니다. 최대 100리터 이상의 압도적인\n수납 용량을 자랑하며, 모든 보급품과 저격 소총까지 안전하게 운반할 수 있습니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        },
        {
            id: "6",
            keyword: "",
            name: "Eberlestock F5 Switchblade",
            manufacturer: "Eberlestock",
            manufacturerLogo: "assets/eberlestock-logo.png",
            manufacturerUrl: "https://www.mysteryranch.com/",
            images: [
                "assets/switchblade.png",
                "assets/switchblade_2.png",
                "assets/switchblade_3.png",
                "assets/switchblade_4.png",
                "assets/switchblade_5.png"
            ],
            description: "미국의 아웃도어 및 전술 장비 전문 제조사인 Eberlestock에서 개발한 컴팩트 전술 배낭입니다.\n이름인 '스위치블레이드(Switchblade)'처럼 민첩성과 빠른 접근성에 중점을 두고 설계되었습니다.\n군용이나 장거리 레이드용 대형 배낭보다는, 은밀한 정찰, 저격 임무 또는 단기 생존 작전에 최적화된 모델입니다.",
            stats: {
                bulletDamageProtection: "0", 
                bloodDamageProtection: "0",
                shockDamageProtection: "0"   
            }
        }
    ],
    "기어 부품": []
};

let isAdmin = false;
let currentPanel = 'weapon';  // 'weapon' | 'gear'
let currentCategory = null;
let currentWeapon = null;           // 현재 선택된 무기
let compareTarget = null;           // 비교 대상 무기 (선택 시)
let editingWeaponId = null;
let editingGearId = null;

// 페이지 로드 시 초기화
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
    
    loadData();
    renderCategories();
    renderGearCategories();
    setupEventListeners();
    restoreAppState();
});

// 로컬스토리지에서 데이터 로드
function loadData() {
    const saved = localStorage.getItem('weaponsData');
    if (saved) {
        const loadedData = JSON.parse(saved);
        Object.keys(weaponsData).forEach(key => {
            if (loadedData[key] && loadedData[key].length > 0) {
                weaponsData[key] = loadedData[key];
            }
        });
    }
    const savedGear = localStorage.getItem('gearData');
    if (savedGear) {
        const loadedGear = JSON.parse(savedGear);
        Object.keys(gearData).forEach(key => {
            if (loadedGear[key] && loadedGear[key].length > 0) {
                gearData[key] = loadedGear[key];
            }
        });
    }
}

// 로컬스토리지에 데이터 저장
function saveData() {
    localStorage.setItem('weaponsData', JSON.stringify(weaponsData));
    localStorage.setItem('gearData', JSON.stringify(gearData));
}

// 앱 상태 저장 (새로고침 시 복원용)
const APP_STATE_KEY = 'smpz_appState';
function saveAppState() {
    const state = {
        panel: currentPanel,
        categoryKey: currentCategory || null,
        selectedItemId: currentWeapon ? currentWeapon.id : null,
        galleryImageIndex: typeof lastGalleryImageIndex === 'number' ? lastGalleryImageIndex : 0
    };
    try {
        localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
}

// 앱 상태 복원
let lastGalleryImageIndex = 0;
function restoreAppState() {
    try {
        const raw = localStorage.getItem(APP_STATE_KEY);
        if (!raw) return;
        const state = JSON.parse(raw);
        if (!state.panel || !state.selectedItemId) return;

        const panel = state.panel === 'gear' ? 'gear' : 'weapon';
        const dataSource = panel === 'weapon' ? weaponsData : gearData;
        let categoryKey = state.categoryKey || null;

        if (!categoryKey || categoryKey === 'all' || !dataSource[categoryKey]) {
            for (const k of Object.keys(dataSource)) {
                if (k === 'all') continue;
                const arr = dataSource[k];
                if (Array.isArray(arr) && arr.some(i => i.id === state.selectedItemId)) {
                    categoryKey = k;
                    break;
                }
            }
        }

        const items = categoryKey && dataSource[categoryKey] ? dataSource[categoryKey] : Object.values(dataSource).flat();
        const item = items.find(i => i.id === state.selectedItemId);
        if (!item) return;

        lastGalleryImageIndex = Math.max(0, parseInt(state.galleryImageIndex, 10) || 0);

        if (!categoryKey) {
            for (const k of Object.keys(dataSource)) {
                if (Array.isArray(dataSource[k]) && dataSource[k].some(i => i.id === item.id)) {
                    categoryKey = k;
                    break;
                }
            }
        }

        currentPanel = panel;
        currentCategory = categoryKey;
        currentWeapon = item;

        document.querySelectorAll('.panel-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.panel === panel);
        });
        document.getElementById('weaponPanel').style.display = panel === 'weapon' ? 'block' : 'none';
        document.getElementById('gearPanel').style.display = panel === 'gear' ? 'block' : 'none';

        renderCategories();
        renderGearCategories();
        expandCategoryAndSelectItem(panel, categoryKey, item);

        if (panel === 'gear') {
            showGearDetail(item, categoryKey, lastGalleryImageIndex);
        } else {
            showWeaponDetail(item, categoryKey, lastGalleryImageIndex);
        }
    } catch (e) { /* ignore */ }
}

function expandCategoryAndSelectItem(panelType, categoryKey, item) {
    if (!categoryKey) return;
    const listId = panelType === 'weapon' ? 'categoryList' : 'gearCategoryList';
    const list = document.getElementById(listId);
    if (!list) return;
    const catItem = list.querySelector(`.category-item[data-category="${categoryKey}"]`);
    if (!catItem) return;
    const itemListContainer = catItem.querySelector('.weapon-list-sidebar');
    if (!itemListContainer) return;
    const dataSource = panelType === 'weapon' ? weaponsData : gearData;

    const container = itemListContainer.closest('.panel-content');
    if (container) {
        container.querySelectorAll('.category-item > .weapon-list-sidebar').forEach(el => {
            el.style.display = 'none';
        });
        container.querySelectorAll('.category-link').forEach(link => { link.classList.remove('active'); });
    }
    itemListContainer.style.display = 'block';
    const categoryLink = itemListContainer.previousElementSibling;
    if (categoryLink) categoryLink.classList.add('active');

    renderItemsInSidebar(categoryKey, itemListContainer, dataSource);

    setTimeout(() => {
        document.querySelectorAll('.weapon-item-sidebar').forEach(li => {
            li.classList.toggle('active', (li.dataset.itemId || li.dataset.weaponId) === item.id);
        });
    }, 50);
}

// 카테고리 렌더링
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    // 전체 무기 카테고리 추가
    const totalCount = Object.values(weaponsData).reduce((sum, weapons) => sum + weapons.length, 0);
    const allCategory = createCategoryItem('무기', totalCount, 'all', 'weapon');
    categoryList.appendChild(allCategory);

    // 각 카테고리 추가
    const categories = [
        { key: '권총', name: '권총' },
        { key: '돌격 소총', name: '돌격 소총' },
        { key: '기관단총', name: '기관단총' },
        { key: '저격 소총', name: '저격 소총' },
        { key: '산탄총', name: '산탄총' },
        { key: '경기관총', name: '경기관총' },
        { key: '유탄 발사기', name: '유탄 발사기' },
        { key: '특수', name: '특수' }
    ];

    categories.forEach(category => {
        const count = weaponsData[category.key]?.length || 0;
        const item = createCategoryItem(category.name, count, category.key, 'weapon');
        categoryList.appendChild(item);
    });
}

// 기어 카테고리 렌더링
function renderGearCategories() {
    const categoryList = document.getElementById('gearCategoryList');
    if (!categoryList) return;
    categoryList.innerHTML = '';

    const gearCategories = [
        { key: '헬멧', name: '헬멧' },
        { key: '전신 방탄복', name: '전신 방탄복' },
        { key: '플레이트 캐리어', name: '플레이트 캐리어' },
        { key: '마스크', name: '마스크' },
        { key: '백팩', name: '백팩' },
        { key: '기어 부품', name: '기어 부품' }
    ];

    const totalCount = Object.values(gearData).reduce((sum, items) => sum + items.length, 0);
    const allCategory = createCategoryItem('기어 전체', totalCount, 'all', 'gear');
    categoryList.appendChild(allCategory);

    gearCategories.forEach(category => {
        const count = gearData[category.key]?.length || 0;
        const item = createCategoryItem(category.name, count, category.key, 'gear');
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
    
    // 카테고리별 아이콘 매핑
    const categoryIcons = {
        '권총': 'assets/pistol.png',
        '돌격 소총': 'assets/ar.png',
        '기관단총': 'assets/smg.png',
        '저격 소총': 'assets/sr.png',
        '산탄총': 'assets/shotgun.png',
        '경기관총': 'assets/lmg.png',
        '유탄 발사기': 'assets/gl.png'
    };
    
    // 아이콘 추가 (해당 카테고리에 아이콘이 있는 경우)
    if (categoryIcons[key]) {
        const iconImg = document.createElement('img');
        iconImg.src = categoryIcons[key];
        iconImg.alt = name;
        iconImg.className = 'category-icon';
        // 돌격 소총, 기관단총, 저격 소총 아이콘은 더 크게
        if (key === '돌격 소총' || key === '기관단총' || key === '저격 소총' || key === '산탄총' || key === '경기관총' || key === '유탄 발사기') {
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
    
    // "전체" 카테고리는 하위 목록 없음
    if (key !== 'all') {
        const itemListContainer = document.createElement('ul');
        itemListContainer.className = 'weapon-list-sidebar';
        itemListContainer.style.display = 'none';
        li.appendChild(itemListContainer);
        
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCategory(key, itemListContainer, panelType);
        });
    } else {
        link.style.cursor = 'default';
    }
    
    return li;
}

// 카테고리 토글 (접기/펼치기)
function toggleCategory(categoryKey, itemListContainer, panelType) {
    panelType = panelType || currentPanel;
    const isExpanded = itemListContainer.style.display !== 'none';
    
    // 현재 패널 내 카테고리만 접기
    const container = itemListContainer.closest('.panel-content');
    if (container) {
        container.querySelectorAll('.weapon-list-sidebar').forEach(list => {
            list.style.display = 'none';
        });
    }
    
    // 현재 패널 내 카테고리 링크만 비활성화
    if (container) {
        container.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });
    }
    
    if (!isExpanded) {
        itemListContainer.style.display = 'block';
        const categoryLink = itemListContainer.previousElementSibling;
        if (categoryLink) categoryLink.classList.add('active');
        
        if (panelType === 'gear') {
            renderItemsInSidebar(categoryKey, itemListContainer, gearData);
        } else {
            renderItemsInSidebar(categoryKey, itemListContainer, weaponsData);
        }
    }
    
    clearDetail();
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

// 이미지 패널 생성 (갤러리 타이틀 + 화살표 포함, 다중 이미지 지원)
function createImagePanelWithArrows(item, itemName, initialImageIndex = 0, onImageIndexChange = null) {
    const images = getItemImages(item);
    const galleryWrapper = document.createElement('div');
    galleryWrapper.className = 'gallery-panel-wrapper';
    
    const galleryTitle = document.createElement('div');
    galleryTitle.className = 'gallery-title';
    galleryTitle.textContent = '- 갤러리 -';
    galleryWrapper.appendChild(galleryTitle);
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'weapon-detail-image-container';
    
    if (images.length === 0) {
        imageContainer.innerHTML = '<div class="weapon-image-placeholder">-</div>';
        galleryWrapper.appendChild(imageContainer);
        return galleryWrapper;
    }
    
    const hasMultiple = images.length > 1;
    
    // 왼쪽 화살표
    const arrowLeft = document.createElement('button');
    arrowLeft.type = 'button';
    arrowLeft.className = 'image-nav-arrow image-nav-left';
    arrowLeft.innerHTML = '‹';
    arrowLeft.setAttribute('aria-label', '이전 이미지');
    if (!hasMultiple) {
        arrowLeft.classList.add('image-nav-disabled');
        arrowLeft.style.display = 'none';
    }
    
    // 이미지 래퍼
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'weapon-detail-image-wrapper';
    const img = document.createElement('img');
    img.className = 'weapon-detail-image';
    let currentIndex = Math.max(0, Math.min(initialImageIndex, images.length - 1));
    img.src = images[currentIndex];
    img.alt = itemName;
    img.style.cursor = 'pointer';
    const placeholder = document.createElement('div');
    placeholder.className = 'weapon-image-placeholder';
    placeholder.textContent = '-';
    placeholder.style.display = 'none';
    imgWrapper.appendChild(placeholder);
    img.onerror = function() {
        this.style.display = 'none';
        placeholder.style.display = 'flex';
    };
    img.onclick = function() {
        openImageModal(images[currentIndex], itemName);
    };
    imgWrapper.appendChild(img);
    
    // 오른쪽 화살표
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
        img.src = images[currentIndex];
        img.alt = itemName;
        img.style.display = '';
        placeholder.style.display = 'none';
        img.onclick = () => openImageModal(images[currentIndex], itemName);
    }
    
    if (hasMultiple) {
        const notifyChange = () => {
            if (typeof onImageIndexChange === 'function') onImageIndexChange(currentIndex);
        };
        const blurArrow = (e) => {
            e.target.blur();
        };
        arrowLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
            notifyChange();
            blurArrow(e);
        });
        arrowRight.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
            notifyChange();
            blurArrow(e);
        });
    }
    
    imageContainer.appendChild(arrowLeft);
    imageContainer.appendChild(imgWrapper);
    imageContainer.appendChild(arrowRight);
    
    galleryWrapper.appendChild(imageContainer);
    return galleryWrapper;
}

// 사이드바에 무기 목록 렌더링 (기존 호환용)
function renderWeaponsInSidebar(categoryKey, container) {
    renderItemsInSidebar(categoryKey, container, weaponsData);
}

// 사이드바에 아이템 목록 렌더링 (무기/기어 공통)
function renderItemsInSidebar(categoryKey, container, dataSource) {
    container.innerHTML = '';
    const items = dataSource[categoryKey] || [];

    const sortedItems = [...items].sort((a, b) => {
        return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
    });

    const isGear = dataSource === gearData;

    sortedItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'weapon-item-sidebar';
        li.textContent = item.name;
        li.dataset.itemId = item.id;
        li.dataset.weaponId = item.id;
        li.dataset.categoryKey = categoryKey;
        li.dataset.panelType = isGear ? 'gear' : 'weapon';
        li.style.cursor = 'pointer';
        li.addEventListener('click', (e) => {
            e.stopPropagation();
            compareTarget = null;
            if (isGear) {
                showGearDetail(item, categoryKey);
            } else {
                showWeaponDetail(item, categoryKey);
            }
        });
        container.appendChild(li);
    });
}

// 무기 상세 정보 표시
function showWeaponDetail(weapon, categoryKey, initialGalleryIndex = 0) {
    const weaponDetail = document.getElementById('weaponDetail');
    
    // 현재 기준 무기/카테고리 갱신
    currentCategory = categoryKey;
    currentWeapon = weapon;
    lastGalleryImageIndex = initialGalleryIndex;
    saveAppState();
    // 사이드바의 선택된 무기 하이라이트
    document.querySelectorAll('.weapon-item-sidebar').forEach(item => {
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
    
    const name = document.createElement('div');
    name.className = 'weapon-detail-name';
    
    // 제조사 로고가 있으면 표시
    if (weapon.manufacturerLogo) {
        const logoImg = document.createElement('img');
        logoImg.className = 'weapon-manufacturer-logo';
        // 특정 로고는 필터 제거 (원본 색상 유지)
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
    
    const nameText = document.createElement('span');
    nameText.className = 'weapon-name-text';
    nameText.textContent = weapon.name;
    name.appendChild(nameText);
    
    nameContainer.appendChild(name);
    detailCard.appendChild(nameContainer);
    
    // 구분선
    const divider = document.createElement('div');
    divider.className = 'weapon-detail-divider';
    detailCard.appendChild(divider);
    
    // 총기 사진 (화살표로 다중 이미지 탐색)
    const weaponImagePanel = createImagePanelWithArrows(weapon, weapon.name, initialGalleryIndex, (idx) => {
        lastGalleryImageIndex = idx;
        saveAppState();
    });
    detailCard.appendChild(weaponImagePanel);
    
    // 설명란
    if (weapon.description) {
        const descContainer = document.createElement('div');
        descContainer.className = 'weapon-detail-description-container';
        
        const desc = document.createElement('div');
        desc.className = 'weapon-detail-description';
        desc.innerHTML = weapon.description;
        descContainer.appendChild(desc);
        
        detailCard.appendChild(descContainer);
    } else {
        // 설명이 없을 경우 플레이스홀더
        const descContainer = document.createElement('div');
        descContainer.className = 'weapon-detail-description-container';
        descContainer.innerHTML = '<div class="weapon-description-placeholder">해당 총기의 설명</div>';
        detailCard.appendChild(descContainer);
    }

    // 능력치 섹션
    if (weapon.stats) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'weapon-stats-container';

        // 헤더: 제목 + 비교 버튼
        const statsHeader = document.createElement('div');
        statsHeader.className = 'weapon-stats-header';

        const statsHeaderSpacer = document.createElement('div');
        statsHeaderSpacer.className = 'weapon-stats-spacer';

        const statsTitle = document.createElement('div');
        statsTitle.className = 'weapon-stats-title';
        statsTitle.textContent = '- 능력치 -';

        const compareBtn = document.createElement('button');
        compareBtn.type = 'button';
        compareBtn.className = 'weapon-compare-btn';
        // 비교 대상이 설정되어 있으면 "비교 해제"로 표시
        const hasCompare = !!(compareTarget && compareTarget.weapon);
        compareBtn.textContent = hasCompare ? '비교 해제' : '비교';
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

        // 각 능력치별 최대값과 스케일 정의
        const statsDefs = [
            { key: 'recoil',      label: '반동',     max: 120,  invert: false },
            { key: 'sway',        label: '흔들림',   max: 210,  invert: false },
            { key: 'ergonomics',  label: '인체공학', max: 100,  invert: false },
            // DayZ 소스코드 기준: 일반 무기는 maxMOA = 25.0
            { key: 'accuracy',    label: '명중률',   max: 25.0, invert: true, isMoa: true },
            { key: 'velocity',    label: '탄속',     max: 1200, invert: false },
            { key: 'rpm',         label: 'RPM',      max: 1200, invert: false }
        ];

        statsDefs.forEach(stat => {
            const row = document.createElement('div');
            row.className = 'weapon-stat-row';

            const label = document.createElement('span');
            label.className = 'weapon-stat-label';
            label.textContent = `${stat.label}:`;

            const value = document.createElement('span');
            value.className = 'weapon-stat-value';
            const raw = weapon.stats[stat.key];
            const displayText = raw !== undefined && raw !== null && raw !== "" ? String(raw) : '-';
            value.textContent = displayText;

            row.appendChild(label);
            row.appendChild(value);
            statsList.appendChild(row);

            // 게이지 바 계산 (기준 무기)
            let numericValue = NaN;
            if (raw !== undefined && raw !== null && raw !== "") {
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
            barFill.style.width = `${percent}%`;

            bar.appendChild(barFill);
            statsList.appendChild(bar);

            // 비교 대상이 있는 경우, 두 번째 게이지 바 추가
            const compareWeapon = compareTarget && compareTarget.weapon ? compareTarget.weapon : null;
            if (compareWeapon && compareWeapon.stats && compareWeapon.id !== weapon.id) {
                const rawCompare = compareWeapon.stats[stat.key];
                let numericCompare = NaN;
                if (rawCompare !== undefined && rawCompare !== null && rawCompare !== "") {
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
                        // 나머지(인체공학, 탄속, RPM)는 값이 높을수록 좋음
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

                const compareFill = document.createElement('div');
                compareFill.className = 'weapon-stat-bar-fill';
                if (diffClass) {
                    compareFill.classList.add(`stat-${diffClass}`);
                }
                compareFill.style.width = `${percentCompare}%`;

                compareBar.appendChild(compareFill);
                statsList.appendChild(compareBar);
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
    
    // 관리자 모드일 경우 편집/삭제 버튼 표시
    if (isAdmin) {
        const actions = document.createElement('div');
        actions.className = 'weapon-detail-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '수정';
        editBtn.onclick = () => editWeapon(weapon.id, categoryKey);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteWeapon(weapon.id, categoryKey);
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        detailCard.appendChild(actions);
    }
    
    weaponDetail.appendChild(detailCard);
}

// 기어 상세 정보 표시
function showGearDetail(gear, categoryKey, initialGalleryIndex = 0) {
    const weaponDetail = document.getElementById('weaponDetail');
    
    currentCategory = categoryKey;
    currentWeapon = gear;
    lastGalleryImageIndex = initialGalleryIndex;
    saveAppState();
    
    document.querySelectorAll('.weapon-item-sidebar').forEach(item => {
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
    
    const name = document.createElement('div');
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
    
    const nameText = document.createElement('span');
    nameText.className = 'weapon-name-text';
    nameText.textContent = gear.name;
    name.appendChild(nameText);
    
    nameContainer.appendChild(name);
    detailCard.appendChild(nameContainer);
    
    const divider = document.createElement('div');
    divider.className = 'weapon-detail-divider';
    detailCard.appendChild(divider);
    
    // 기어 사진 (화살표로 다중 이미지 탐색)
    const gearImagePanel = createImagePanelWithArrows(gear, gear.name, initialGalleryIndex, (idx) => {
        lastGalleryImageIndex = idx;
        saveAppState();
    });
    detailCard.appendChild(gearImagePanel);
    
    if (gear.description) {
        const descContainer = document.createElement('div');
        descContainer.className = 'weapon-detail-description-container';
        const desc = document.createElement('div');
        desc.className = 'weapon-detail-description';
        desc.innerHTML = gear.description;
        descContainer.appendChild(desc);
        detailCard.appendChild(descContainer);
    } else {
        const descContainer = document.createElement('div');
        descContainer.className = 'weapon-detail-description-container';
        descContainer.innerHTML = '<div class="weapon-description-placeholder">해당 기어의 설명</div>';
        detailCard.appendChild(descContainer);
    }
    
    // 기어 능력치 섹션 (탄/유혈/충격 데미지 보호률)
    if (gear.stats) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'weapon-stats-container';

        const statsHeader = document.createElement('div');
        statsHeader.className = 'weapon-stats-header';
        const statsHeaderSpacer = document.createElement('div');
        statsHeaderSpacer.className = 'weapon-stats-spacer';
        const statsTitle = document.createElement('div');
        statsTitle.className = 'weapon-stats-title';
        statsTitle.textContent = '- 능력치 -';
        const statsHeaderSpacerRight = document.createElement('div');
        statsHeaderSpacerRight.className = 'weapon-stats-spacer';
        statsHeader.appendChild(statsHeaderSpacer);
        statsHeader.appendChild(statsTitle);
        statsHeader.appendChild(statsHeaderSpacerRight);
        statsContainer.appendChild(statsHeader);

        const statsList = document.createElement('div');
        statsList.className = 'weapon-stats-list';

        const gearStatsDefs = [
            { key: 'bulletDamageProtection', label: '총탄 데미지 보호률' },
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

        statsContainer.appendChild(statsList);

        const statsParent = gear.description
            ? detailCard.querySelector('.weapon-detail-description-container')
            : detailCard;
        if (statsParent) {
            statsParent.appendChild(statsContainer);
        } else {
            detailCard.appendChild(statsContainer);
        }
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
        const filterTitle = document.createElement('div');
        filterTitle.className = 'weapon-stats-title';
        filterTitle.textContent = '- 필터 충전 가능 여부 -';
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
    
    if (isAdmin) {
        const actions = document.createElement('div');
        actions.className = 'weapon-detail-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '수정';
        editBtn.onclick = () => editGear(gear.id, categoryKey);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => deleteGear(gear.id, categoryKey);
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        detailCard.appendChild(actions);
    }
    
    weaponDetail.appendChild(detailCard);
}

// 무기 상세 정보 초기화
function clearWeaponDetail() {
    clearDetail();
}

// 상세 정보 초기화 (무기/기어 공통)
function clearDetail() {
    const weaponDetail = document.getElementById('weaponDetail');
    const msg = currentPanel === 'gear'
        ? '좌측에서 카테고리를 선택하고 기어를 클릭하여 정보를 확인하세요.'
        : '좌측에서 카테고리를 선택하고 무기를 클릭하여 정보를 확인하세요.';
    weaponDetail.innerHTML = '<p class="empty-message">' + msg + '</p>';
    
    document.querySelectorAll('.weapon-item-sidebar').forEach(item => {
        item.classList.remove('active');
    });
    
    currentWeapon = null;
    currentCategory = null;
}


// 이벤트 리스너 설정
function setupEventListeners() {
    // 패널 전환 버튼
    document.querySelectorAll('.panel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.dataset.panel;
            currentPanel = panel;
            document.querySelectorAll('.panel-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('weaponPanel').style.display = panel === 'weapon' ? 'block' : 'none';
            document.getElementById('gearPanel').style.display = panel === 'gear' ? 'block' : 'none';
            document.getElementById('itemSearch').value = '';
            clearDetail();
        });
    });
    
    // 관리자 로그인 버튼
    document.getElementById('adminLoginBtn').addEventListener('click', () => {
        document.getElementById('loginModal').style.display = 'block';
    });
    
    // 로그아웃 버튼
    document.getElementById('adminLogoutBtn').addEventListener('click', logout);
    
    // 로그인 폼
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // 무기 폼
    document.getElementById('weaponForm').addEventListener('submit', handleWeaponSubmit);
    
    // 기어 폼
    document.getElementById('gearForm').addEventListener('submit', handleGearSubmit);
    
    // 기어 추가 버튼
    const gearAddBtn = document.getElementById('gearAddBtn');
    if (gearAddBtn) {
        gearAddBtn.addEventListener('click', () => openGearModal(null, null));
    }
    
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
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
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
                imageModal.style.setProperty('display', 'none', 'important');
            });
        }
        
        // 이미지 모달 외부 클릭 시 닫기
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('image-modal')) {
                imageModal.style.setProperty('display', 'none', 'important');
            }
        });
    }
    
    // ESC 키로 모든 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const imageModal = document.getElementById('imageModal');
            if (imageModal) {
                const computedStyle = window.getComputedStyle(imageModal);
                if (computedStyle.display !== 'none') {
                    imageModal.style.setProperty('display', 'none', 'important');
                }
            }
            // 다른 모달들도 닫기
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.id !== 'imageModal') {
                    const computedStyle = window.getComputedStyle(modal);
                    if (computedStyle.display !== 'none') {
                        modal.style.display = 'none';
                    }
                }
            });
        }
    });
}

// 이미지 확대 모달 열기
function openImageModal(imageSrc, imageAlt) {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (imageModal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        imageModal.style.setProperty('display', 'flex', 'important');
    }
}

// 로그인 처리
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 간단한 인증 (실제로는 서버에서 처리해야 함)
    // 기본 관리자 계정: admin / 488538
    if (username === 'admin' && password === '488538') {
        isAdmin = true;
        document.getElementById('adminLoginBtn').style.display = 'none';
        document.getElementById('adminLogoutBtn').style.display = 'block';
        document.getElementById('loginModal').style.display = 'none';
        
        const gearAddWrap = document.getElementById('gearAddBtnWrap');
        if (gearAddWrap) gearAddWrap.style.display = 'block';
        
        if (currentWeapon && currentCategory) {
            if (currentPanel === 'gear') {
                showGearDetail(currentWeapon, currentCategory);
            } else {
                showWeaponDetail(currentWeapon, currentCategory);
            }
        }
        
        alert('관리자로 로그인되었습니다.');
    } else {
        alert('잘못된 사용자명 또는 비밀번호입니다.');
    }
}

// 로그아웃
function logout() {
    isAdmin = false;
    document.getElementById('adminLoginBtn').style.display = 'block';
    document.getElementById('adminLogoutBtn').style.display = 'none';
    
    const gearAddWrap = document.getElementById('gearAddBtnWrap');
    if (gearAddWrap) gearAddWrap.style.display = 'none';
    
    if (currentWeapon && currentCategory) {
        if (currentPanel === 'gear') {
            showGearDetail(currentWeapon, currentCategory);
        } else {
            showWeaponDetail(currentWeapon, currentCategory);
        }
    }
    
    alert('로그아웃되었습니다.');
}

// 무기 모달 열기
function openWeaponModal(weaponId = null, categoryKey = null) {
    editingWeaponId = weaponId;
    const modal = document.getElementById('weaponModal');
    const title = document.getElementById('weaponModalTitle');
    
    if (weaponId) {
        title.textContent = '무기 수정';
        const weapon = weaponsData[categoryKey].find(w => w.id === weaponId);
        if (weapon) {
            document.getElementById('weaponId').value = weaponId;
            document.getElementById('weaponName').value = weapon.name;
            document.getElementById('weaponCategory').value = categoryKey;
            document.getElementById('weaponManufacturer').value = weapon.manufacturer || '';
            document.getElementById('weaponManufacturerLogo').value = weapon.manufacturerLogo || '';
            document.getElementById('weaponManufacturerUrl').value = weapon.manufacturerUrl || '';
            document.getElementById('weaponImage').value = (weapon.images && weapon.images.length) ? weapon.images.join(', ') : (weapon.image || '');
            document.getElementById('weaponDescription').value = weapon.description || '';
        }
    } else {
        title.textContent = '무기 추가';
        document.getElementById('weaponForm').reset();
        document.getElementById('weaponId').value = '';
        if (currentCategory && currentCategory !== 'all') {
            document.getElementById('weaponCategory').value = currentCategory;
        }
    }
    
    modal.style.display = 'block';
}

// 무기 모달 닫기
function closeWeaponModal() {
    document.getElementById('weaponModal').style.display = 'none';
    editingWeaponId = null;
}

// 무기 추가/수정 처리
function handleWeaponSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('weaponName').value;
    const category = document.getElementById('weaponCategory').value;
    const manufacturer = document.getElementById('weaponManufacturer').value;
    const manufacturerLogo = document.getElementById('weaponManufacturerLogo').value;
    const manufacturerUrl = document.getElementById('weaponManufacturerUrl').value;
    const imageInput = document.getElementById('weaponImage').value.trim();
    const description = document.getElementById('weaponDescription').value;
    const imagePaths = imageInput ? imageInput.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    if (!category) {
        alert('카테고리를 선택해주세요.');
        return;
    }
    
    if (editingWeaponId) {
        // 수정
        const weaponIndex = weaponsData[category].findIndex(w => w.id === editingWeaponId);
        if (weaponIndex !== -1) {
            weaponsData[category][weaponIndex].name = name;
            weaponsData[category][weaponIndex].manufacturer = manufacturer;
            weaponsData[category][weaponIndex].manufacturerLogo = manufacturerLogo;
            weaponsData[category][weaponIndex].manufacturerUrl = manufacturerUrl;
            if (imagePaths.length > 1) {
                weaponsData[category][weaponIndex].images = imagePaths;
                delete weaponsData[category][weaponIndex].image;
            } else if (imagePaths.length === 1) {
                weaponsData[category][weaponIndex].image = imagePaths[0];
                delete weaponsData[category][weaponIndex].images;
            } else {
                weaponsData[category][weaponIndex].image = '';
                delete weaponsData[category][weaponIndex].images;
            }
            weaponsData[category][weaponIndex].description = description;
        }
    } else {
        // 추가
        const newWeapon = {
            id: Date.now().toString(),
            name: name,
            manufacturer: manufacturer,
            manufacturerLogo: manufacturerLogo,
            manufacturerUrl: manufacturerUrl,
            description: description
        };
        if (imagePaths.length > 1) {
            newWeapon.images = imagePaths;
        } else if (imagePaths.length === 1) {
            newWeapon.image = imagePaths[0];
        } else {
            newWeapon.image = '';
        }
        weaponsData[category].push(newWeapon);
    }
    
    saveData();
    renderCategories();
    
    // 사이드바 무기 목록 업데이트
    const categoryItem = document.querySelector(`.category-item[data-category="${category}"]`);
    if (categoryItem) {
        const weaponListContainer = categoryItem.querySelector('.weapon-list-sidebar');
        if (weaponListContainer && weaponListContainer.style.display !== 'none') {
            renderWeaponsInSidebar(category, weaponListContainer);
        }
    }
    
    closeWeaponModal();
    
    alert(editingWeaponId ? '무기가 수정되었습니다.' : '무기가 추가되었습니다.');
    
    // 수정한 경우 현재 표시된 무기 정보 업데이트
    if (editingWeaponId) {
        const updatedWeapon = weaponsData[category].find(w => w.id === editingWeaponId);
        if (updatedWeapon) {
            showWeaponDetail(updatedWeapon, category);
        }
    }
}

// 무기 수정
function editWeapon(weaponId, categoryKey) {
    openWeaponModal(weaponId, categoryKey);
}

// 무기 삭제
function deleteWeapon(weaponId, categoryKey) {
    if (confirm('정말 이 무기를 삭제하시겠습니까?')) {
        weaponsData[categoryKey] = weaponsData[categoryKey].filter(w => w.id !== weaponId);
        saveData();
        renderCategories();
        
        // 사이드바 무기 목록 업데이트
        const categoryItem = document.querySelector(`.category-item[data-category="${categoryKey}"]`);
        if (categoryItem) {
            const weaponListContainer = categoryItem.querySelector('.weapon-list-sidebar');
            if (weaponListContainer && weaponListContainer.style.display !== 'none') {
                renderWeaponsInSidebar(categoryKey, weaponListContainer);
            }
        }
        
        // 메인 영역 초기화
        clearWeaponDetail();
        alert('무기가 삭제되었습니다.');
    }
}

// 기어 모달 열기
function openGearModal(gearId = null, categoryKey = null) {
    editingGearId = gearId;
    const modal = document.getElementById('gearModal');
    const title = document.getElementById('gearModalTitle');
    
    if (gearId) {
        title.textContent = '기어 수정';
        const gear = gearData[categoryKey].find(g => g.id === gearId);
        if (gear) {
            document.getElementById('gearId').value = gearId;
            document.getElementById('gearName').value = gear.name;
            document.getElementById('gearCategory').value = categoryKey;
            document.getElementById('gearManufacturer').value = gear.manufacturer || '';
            document.getElementById('gearManufacturerLogo').value = gear.manufacturerLogo || '';
            document.getElementById('gearManufacturerUrl').value = gear.manufacturerUrl || '';
            document.getElementById('gearImage').value = (gear.images && gear.images.length) ? gear.images.join(', ') : (gear.image || '');
            document.getElementById('gearDescription').value = gear.description || '';
            document.getElementById('gearBulletDamageProtection').value = gear.stats?.bulletDamageProtection ?? '';
            document.getElementById('gearBloodDamageProtection').value = gear.stats?.bloodDamageProtection ?? '';
            document.getElementById('gearShockDamageProtection').value = gear.stats?.shockDamageProtection ?? '';
        }
    } else {
        title.textContent = '기어 추가';
        document.getElementById('gearForm').reset();
        document.getElementById('gearId').value = '';
        if (currentCategory && currentCategory !== 'all') {
            document.getElementById('gearCategory').value = currentCategory;
        }
    }
    
    modal.style.display = 'block';
}

// 기어 모달 닫기
function closeGearModal() {
    document.getElementById('gearModal').style.display = 'none';
    editingGearId = null;
}

// 기어 추가/수정 처리
function handleGearSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('gearName').value;
    const category = document.getElementById('gearCategory').value;
    const manufacturer = document.getElementById('gearManufacturer').value;
    const manufacturerLogo = document.getElementById('gearManufacturerLogo').value;
    const manufacturerUrl = document.getElementById('gearManufacturerUrl').value;
    const gearImageInput = document.getElementById('gearImage').value.trim();
    const description = document.getElementById('gearDescription').value;
    const gearImagePaths = gearImageInput ? gearImageInput.split(',').map(s => s.trim()).filter(Boolean) : [];
    const bulletProt = document.getElementById('gearBulletDamageProtection').value.trim();
    const bloodProt = document.getElementById('gearBloodDamageProtection').value.trim();
    const shockProt = document.getElementById('gearShockDamageProtection').value.trim();

    const stats = {};
    if (bulletProt !== '') stats.bulletDamageProtection = bulletProt;
    if (bloodProt !== '') stats.bloodDamageProtection = bloodProt;
    if (shockProt !== '') stats.shockDamageProtection = shockProt;
    
    if (!category) {
        alert('카테고리를 선택해주세요.');
        return;
    }
    
    if (editingGearId) {
        const gearIndex = gearData[category].findIndex(g => g.id === editingGearId);
        if (gearIndex !== -1) {
            gearData[category][gearIndex].name = name;
            gearData[category][gearIndex].manufacturer = manufacturer;
            gearData[category][gearIndex].manufacturerLogo = manufacturerLogo;
            gearData[category][gearIndex].manufacturerUrl = manufacturerUrl;
            if (gearImagePaths.length > 1) {
                gearData[category][gearIndex].images = gearImagePaths;
                delete gearData[category][gearIndex].image;
            } else if (gearImagePaths.length === 1) {
                gearData[category][gearIndex].image = gearImagePaths[0];
                delete gearData[category][gearIndex].images;
            } else {
                gearData[category][gearIndex].image = '';
                delete gearData[category][gearIndex].images;
            }
            gearData[category][gearIndex].description = description;
            gearData[category][gearIndex].stats = Object.keys(stats).length > 0 ? stats : undefined;
        }
    } else {
        const newGear = {
            id: Date.now().toString(),
            name: name,
            manufacturer: manufacturer,
            manufacturerLogo: manufacturerLogo,
            manufacturerUrl: manufacturerUrl,
            description: description
        };
        if (gearImagePaths.length > 1) {
            newGear.images = gearImagePaths;
        } else if (gearImagePaths.length === 1) {
            newGear.image = gearImagePaths[0];
        } else {
            newGear.image = '';
        }
        if (Object.keys(stats).length > 0) {
            newGear.stats = stats;
        }
        gearData[category].push(newGear);
    }
    
    saveData();
    renderGearCategories();
    
    const gearCategoryList = document.getElementById('gearCategoryList');
    if (gearCategoryList) {
        gearCategoryList.querySelectorAll('.category-item').forEach(item => {
            if (item.dataset.category === category) {
                const itemListContainer = item.querySelector('.weapon-list-sidebar');
                if (itemListContainer && itemListContainer.style.display !== 'none') {
                    renderItemsInSidebar(category, itemListContainer, gearData);
                }
            }
        });
    }
    
    closeGearModal();
    alert(editingGearId ? '기어가 수정되었습니다.' : '기어가 추가되었습니다.');
    
    if (editingGearId) {
        const updatedGear = gearData[category].find(g => g.id === editingGearId);
        if (updatedGear) {
            showGearDetail(updatedGear, category);
        }
    }
}

// 기어 수정
function editGear(gearId, categoryKey) {
    openGearModal(gearId, categoryKey);
}

// 기어 삭제
function deleteGear(gearId, categoryKey) {
    if (confirm('정말 이 기어를 삭제하시겠습니까?')) {
        gearData[categoryKey] = gearData[categoryKey].filter(g => g.id !== gearId);
        saveData();
        renderGearCategories();
        
        const gearCategoryList = document.getElementById('gearCategoryList');
        if (gearCategoryList) {
            const categoryItem = gearCategoryList.querySelector(`.category-item[data-category="${categoryKey}"]`);
            if (categoryItem) {
                const itemListContainer = categoryItem.querySelector('.weapon-list-sidebar');
                if (itemListContainer && itemListContainer.style.display !== 'none') {
                    renderItemsInSidebar(categoryKey, itemListContainer, gearData);
                }
            }
        }
        
        clearDetail();
        alert('기어가 삭제되었습니다.');
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
        // 기준 무기 표시는 이름만 사용 (이름 안에 제조사가 포함될 수 있으므로)
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
            // 비교 목록에는 총기 이름만 표기 (이미 이름에 제조사가 포함될 수 있음)
            btn.textContent = w.name;
            btn.onclick = () => {
                compareTarget = { weapon: w, categoryKey };
                modal.style.display = 'none';
                // 현재 무기를 다시 렌더링하여 비교 바를 표시
                if (currentWeapon && currentCategory) {
                    showWeaponDetail(currentWeapon, currentCategory);
                }
            };
            listContainer.appendChild(btn);
        });
    });

    modal.style.display = 'block';
}

// 무기/기어 검색 함수
function searchItems(query) {
    const isWeaponPanel = currentPanel === 'weapon';
    const categoryList = isWeaponPanel ? document.getElementById('categoryList') : document.getElementById('gearCategoryList');
    
    if (!categoryList) return;
    
    if (!query || query.trim() === '') {
        if (isWeaponPanel) renderCategories();
        else renderGearCategories();
        return;
    }
    
    const searchTerm = query.trim().toLowerCase();
    const results = [];
    const dataSource = isWeaponPanel ? weaponsData : gearData;
    
    Object.keys(dataSource).forEach(categoryKey => {
        const items = dataSource[categoryKey] || [];
        items.forEach(item => {
            const nameMatch = item.name.toLowerCase().includes(searchTerm);
            const keywordMatch = item.keyword && item.keyword.toLowerCase().includes(searchTerm);
            if (nameMatch || keywordMatch) {
                results.push({ item, categoryKey });
            }
        });
    });
    
    categoryList.innerHTML = '';
    
    if (results.length === 0) {
        const noResult = document.createElement('li');
        noResult.className = 'category-item';
        noResult.innerHTML = '<div class="category-link" style="justify-content: center;"><span class="category-name">검색 결과가 없습니다</span></div>';
        categoryList.appendChild(noResult);
    } else {
        const groupedResults = {};
        results.forEach(({ item, categoryKey }) => {
            if (!groupedResults[categoryKey]) {
                groupedResults[categoryKey] = [];
            }
            groupedResults[categoryKey].push(item);
        });
        
        const defaultCategoryName = isWeaponPanel ? '무기' : '기어';
        
        Object.keys(groupedResults).forEach(categoryKey => {
            const items = groupedResults[categoryKey];
            const categoryName = categoryKey === 'all' ? defaultCategoryName : categoryKey;
            
            const li = document.createElement('li');
            li.className = 'category-item';
            li.dataset.category = categoryKey;
            
            const link = document.createElement('div');
            link.className = 'category-link';
            link.dataset.category = categoryKey;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'category-name';
            nameSpan.textContent = categoryName;
            
            const countSpan = document.createElement('span');
            countSpan.className = 'category-count';
            countSpan.textContent = `(${items.length})`;
            
            link.appendChild(nameSpan);
            link.appendChild(countSpan);
            li.appendChild(link);
            
            const itemListContainer = document.createElement('ul');
            itemListContainer.className = 'weapon-list-sidebar';
            itemListContainer.style.display = 'block';
            
            items.forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.className = 'weapon-item-sidebar';
                itemLi.textContent = item.name;
                itemLi.dataset.weaponId = item.id;
                itemLi.dataset.itemId = item.id;
                itemLi.dataset.categoryKey = categoryKey;
                itemLi.style.cursor = 'pointer';
                itemLi.addEventListener('click', (e) => {
                    e.stopPropagation();
                    compareTarget = null;
                    if (isWeaponPanel) {
                        showWeaponDetail(item, categoryKey);
                    } else {
                        showGearDetail(item, categoryKey);
                    }
                });
                itemListContainer.appendChild(itemLi);
            });
            
            li.appendChild(itemListContainer);
            categoryList.appendChild(li);
        });
    }
}
