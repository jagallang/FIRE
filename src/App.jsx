import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import WildfireMap from './components/WildfireMap'
import WildfireDataTable from './components/WildfireDataTable'
import ExcelUploader from './components/ExcelUploader'
import './App.css'

// 샘플 데이터 (2024-2025년 주요 산불 사례)
const sampleWildfireData = [
  {
    id: 'sample-1',
    date: '2025-03-22',
    location: '경북 의성군',
    latitude: 36.3529,
    longitude: 128.6989,
    area: 99490,
    cause: '실화 + 강풍',
    amount: 67000000,
    casualties: '사망 28명, 부상 32명',
    occuYear: 2025
  },
  {
    id: 'sample-2',
    date: '2024-04-05',
    location: '강원 강릉시',
    latitude: 37.7519,
    longitude: 128.8761,
    area: 850,
    cause: '쓰레기 소각',
    amount: 15000,
    occuYear: 2024
  },
  {
    id: 'sample-3',
    date: '2024-03-28',
    location: '경북 안동시',
    latitude: 36.5684,
    longitude: 128.7294,
    area: 1250,
    cause: '입산자 실화',
    amount: 28000,
    occuYear: 2024
  },
  {
    id: 'sample-4',
    date: '2024-04-15',
    location: '강원 삼척시',
    latitude: 37.4500,
    longitude: 129.1656,
    area: 420,
    cause: '담뱃불',
    amount: 8500,
    occuYear: 2024
  },
  {
    id: 'sample-5',
    date: '2024-03-10',
    location: '경북 영주시',
    latitude: 36.8056,
    longitude: 128.6239,
    area: 680,
    cause: '논밭두렁 소각',
    amount: 12000,
    occuYear: 2024
  },
  {
    id: 'sample-6',
    date: '2024-04-22',
    location: '강원 영월군',
    latitude: 37.1836,
    longitude: 128.4614,
    area: 350,
    cause: '건축물 화재',
    amount: 6800,
    occuYear: 2024
  },
  {
    id: 'sample-7',
    date: '2024-03-18',
    location: '경북 봉화군',
    latitude: 36.8929,
    longitude: 128.7326,
    area: 520,
    cause: '입산자 실화',
    amount: 9200,
    occuYear: 2024
  },
  {
    id: 'sample-8',
    date: '2024-04-08',
    location: '강원 속초시',
    latitude: 38.2070,
    longitude: 128.5918,
    area: 290,
    cause: '쓰레기 소각',
    amount: 5500,
    occuYear: 2024
  }
];

function App() {
  const [wildfireData, setWildfireData] = useState(sampleWildfireData)
  const [activeSection, setActiveSection] = useState('map')

  // Excel 데이터 로드 핸들러
  const handleExcelDataLoaded = useCallback((excelData, fileName) => {
    console.log(`📁 Excel 파일 로드: ${fileName}, ${excelData.length}건`);

    setWildfireData(prevData => {
      const mergedData = [...prevData, ...excelData];
      mergedData.sort((a, b) => b.date.localeCompare(a.date));
      console.log(`✅ 총 ${mergedData.length}건의 데이터 (기존 ${prevData.length} + 신규 ${excelData.length})`);
      return mergedData;
    });
  }, [])

  // Excel 다운로드 핸들러
  const handleDownloadExcel = useCallback(() => {
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(wildfireData.map(fire => ({
        '발생일자': fire.date,
        '위치': fire.location,
        '면적(ha)': fire.area,
        '원인': fire.cause,
        '피해액(천원)': fire.amount,
        '인명피해': fire.casualties || '-',
        '연도': fire.occuYear
      })));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '산불데이터');

      const fileName = `산불통계_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    });
  }, [wildfireData])

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-b border-white/10 z-50 shadow-2xl">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* 로고 */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🔥</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                FIRE_ZERO
              </div>
            </div>

            {/* 탭 버튼들 */}
            <div className="flex gap-2 items-center">
              {[
                { id: 'map', label: '산불지도' },
                { id: 'case', label: '사례' },
                { id: 'background', label: '배경' },
                { id: 'problem', label: '문제점' },
                { id: 'solution', label: '해결방안' },
                { id: 'product', label: '제품소개' },
                { id: 'effect', label: '기대효과' },
                { id: 'contact', label: '연락하기' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/40 scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/10 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <span className="relative z-10">{section.label}</span>
                  {activeSection === section.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </button>
              ))}

              {/* IR 대시보드 버튼 */}
              <a
                href="/ir-dashboard.html"
                target="_blank"
                className="ml-3 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-110 flex items-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                <span className="relative z-10">📊</span>
                <span className="relative z-10">IR 대시보드</span>
              </a>
            </div>
          </div>
        </div>

        {/* 하단 그라디언트 보더 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="pt-20">
        {/* 1. 산불지도 (메인) */}
        <section id="map" className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
          {/* 배경 애니메이션 효과 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="text-7xl">🔥</span>
              </div>
              <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 bg-clip-text text-transparent">
                대한민국 산불 현황 실시간 분석
              </h1>
              <p className="text-3xl text-gray-400 font-light">AI 기반 산불 예방·대응 통합 플랫폼</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/10">
              {/* 안내 메시지 */}
              {wildfireData.length === sampleWildfireData.length && (
                <div className="mb-4 p-4 bg-blue-500/20 border border-blue-400/40 rounded-xl text-center">
                  <p className="text-blue-200 text-sm">
                    📍 <strong>샘플 데이터</strong>가 표시되고 있습니다. 아래 <strong>Excel 업로드</strong>로 더 많은 데이터를 추가하세요.
                  </p>
                </div>
              )}
              <WildfireMap wildfireData={wildfireData.slice(0, 100)} />
            </div>
          </div>
        </section>

        {/* 2. 사례 */}
        <section id="case" className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center">
          <div className="container mx-auto px-8 py-32">
            <h2 className="text-6xl font-bold text-white mb-20 text-center">
              <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">사례</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {/* 2025년 의성 산불 */}
              <Link to="/case/uiseong-2025" className="block group bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-start gap-6 mb-6">
                  <div className="text-6xl">🔥</div>
                  <div className="flex-1">
                    <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">2025년</div>
                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      경북 의성발(發) 초대형 산불 →
                    </h3>
                    <p className="text-lg text-orange-400 mb-4">대한민국 정부 수립 이래 최악의 산불 재난</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 rounded-xl p-5">
                    <p className="text-gray-300"><strong className="text-orange-400">발화:</strong> 2025.03.22 경북 의성군</p>
                    <p className="text-gray-300"><strong className="text-red-400">피해:</strong> 99,490 ha 소실, 사망 28명</p>
                    <p className="text-gray-300"><strong className="text-yellow-400">원인:</strong> 실화 + 강풍 + 가뭄</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
                    <p className="text-sm text-gray-400">정부 수립 이래 최악의 소실 면적 기록. 야간 진화 역량 한계 노출. 지휘 체계 통합 필요성 제기.</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span className="text-orange-400 text-base font-semibold">자세히 보기 →</span>
                </div>
              </Link>

              {/* 2024년 산불 통계 */}
              <Link to="/case/gangwon-2024" className="block group bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-sm rounded-2xl p-10 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="flex items-start gap-6 mb-6">
                  <div className="text-6xl">🔥</div>
                  <div className="flex-1">
                    <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">2024년</div>
                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      강원·경북 동해안권 산불 →
                    </h3>
                    <p className="text-lg text-orange-400 mb-4">546건 발생, 4,003ha 소실</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/30 rounded-xl p-5">
                    <p className="text-gray-300"><strong className="text-orange-400">발생:</strong> 2024년 총 546건 (3~4월 집중)</p>
                    <p className="text-gray-300"><strong className="text-red-400">피해:</strong> 4,003 ha 소실, 다수 시설 피해</p>
                    <p className="text-gray-300"><strong className="text-yellow-400">원인:</strong> 부주의 75% (불법소각, 실화 등)</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl p-4 border border-orange-500/30">
                    <p className="text-sm text-gray-400">야간산불 10년간 28% 증가. 관리 시스템 우수하나 예방 체계 한계 노출.</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span className="text-orange-400 text-base font-semibold">자세히 보기 →</span>
                </div>
              </Link>
            </div>

          </div>
        </section>

        {/* 3. 배경 */}
        <section id="background" className="min-h-screen bg-gradient-to-b from-gray-900 via-orange-950 to-gray-900 flex items-center">
          <div className="container mx-auto px-8 py-32">
            <h2 className="text-6xl font-bold text-white mb-20 text-center">
              <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">배경</span>
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
                <h3 className="text-4xl font-bold text-white mb-10">왜 산불 문제가 심각한가?</h3>
                <ul className="space-y-6 text-xl text-gray-300">
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span><strong className="text-white">최근 3년간 역대급 피해:</strong> 2022~2025년 총 2,028건 발생, 134,932ha 소실, 피해액 <span className="text-red-400 font-bold">8조 3,414억원</span></span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span><strong className="text-white">2025년 급증 현황:</strong> 경북 초대형 산불로 피해 면적 <span className="text-red-400 font-bold">795.9배 증가</span>, 피해액 <span className="text-red-400 font-bold">725.8배 급증</span> (전년 대비)</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span><strong className="text-white">인명 피해:</strong> 3년간 사망 37명, 부상 164명 - 인간 부주의(입산자 25.5%, 쓰레기 소각 10.3%)가 주요 원인</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span><strong className="text-white">복구 위기:</strong> 전체 복구율 19.5%, 2025년 피해 104,004ha 중 <span className="text-red-400 font-bold">단 1ha도 복구되지 않음</span> - 예산 집행 80%지만 실적 0%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 문제점 */}
        <section id="problem" className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center">
          <div className="container mx-auto px-8 py-32">
            <h2 className="text-6xl font-bold text-white mb-20 text-center">
              <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">문제점</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="group bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-2xl p-10 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">⏰</div>
                <h3 className="text-2xl font-bold text-white mb-6">계절·시간 집중</h3>
                <p className="text-gray-400 text-lg">3~4월·주말·특정 시간대 집중 발생 → 인력·장비 과부하 및 대응 효율 저하. 토·일 95건 vs 평일 35건 (2.7배)</p>
              </div>
              <div className="group bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm rounded-2xl p-10 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🚫</div>
                <h3 className="text-2xl font-bold text-white mb-6">원인 통제의 어려움</h3>
                <p className="text-gray-400 text-lg">입산자 실화 25.5%, 쓰레기 소각 10.3%, 담뱃불 8.7% - 부주의형 비중이 높아 선제 통제 한계. 성묘객 실화는 3%지만 피해 면적 34.7%</p>
              </div>
              <div className="group bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm rounded-2xl p-10 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-2xl font-bold text-white mb-6">데이터 단절</h3>
                <p className="text-gray-400 text-lg">기관별 데이터 표준 불일치·실시간 공유 미흡 → 판단·대응 지연. 통합 관제 시스템 부재로 골든타임 놓침</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 해결방안 */}
        <section id="solution" className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black flex items-center">
          <div className="container mx-auto px-8 py-32">
            <h2 className="text-6xl font-bold text-white mb-20 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">해결방안</span>
            </h2>
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="group bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-10 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 flex items-start gap-8 hover:scale-105">
                <div className="text-7xl group-hover:scale-110 transition-transform">🚁</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">AI 드론 순찰 시스템</h3>
                  <p className="text-gray-400 text-lg">24시간 자동 감시로 조기 발견률 90% 향상. 열화상 카메라·AI 영상 분석으로 야간·원거리 산불 실시간 탐지. 자동 경보 및 초기 대응 가능</p>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-cyan-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 flex items-start gap-8 hover:scale-105">
                <div className="text-7xl group-hover:scale-110 transition-transform">📡</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">IoT 센서 네트워크</h3>
                  <p className="text-gray-400 text-lg">산림 전역에 온도·습도·연기 감지 센서 설치. 실시간 데이터 수집 및 위험도 예측 모델 적용. 기상 조건 연동으로 산불 발생 72시간 전 예보</p>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-teal-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl p-10 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 flex items-start gap-8 hover:scale-105">
                <div className="text-7xl group-hover:scale-110 transition-transform">🎯</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">통합 관제 시스템</h3>
                  <p className="text-gray-400 text-lg">산림청·소방청·기상청 데이터 통합. 빅데이터 기반 위험도 예측 및 자동 대응 지시. 실시간 지휘 본부로 골든타임 확보 및 인명 피해 최소화</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 제품소개 */}
        <section id="product" className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center">
          <div className="container mx-auto px-8 py-32">
            <h2 className="text-6xl font-bold text-white mb-20 text-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">제품소개</span>
            </h2>
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-3xl p-16 shadow-2xl text-white mb-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="text-7xl mb-6">🔥</div>
                  <h3 className="text-5xl font-bold mb-4">FireVision AI Platform</h3>
                  <p className="text-2xl font-light opacity-90">AI·IoT 기반 산불 예방·대응 통합 솔루션</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                  <h4 className="text-2xl font-bold text-white mb-3">실시간 산불 지도</h4>
                  <p className="text-gray-400">Google Maps 기반 산불 위치 시각화. 발생일시, 피해 규모, 원인 등 상세 정보 제공. 필터링 및 검색 기능 지원</p>
                </div>
                <div className="group bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                  <h4 className="text-2xl font-bold text-white mb-3">통계 대시보드</h4>
                  <p className="text-gray-400">연도별·월별·원인별 통계 분석. Chart.js 기반 인터랙티브 차트. IR 투자자용 대시보드 제공</p>
                </div>
                <div className="group bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📥</div>
                  <h4 className="text-2xl font-bold text-white mb-3">Excel 데이터 관리</h4>
                  <p className="text-gray-400">Excel 파일 업로드/다운로드 지원. 대용량 데이터 실시간 처리. 자동 통계 생성 및 보고서 출력</p>
                </div>
                <div className="group bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                  <h4 className="text-2xl font-bold text-white mb-3">AI 위험도 예측</h4>
                  <p className="text-gray-400">기상 데이터·과거 통계 기반 산불 위험도 예측. 계절별·지역별 맞춤형 경보. 머신러닝으로 정확도 지속 향상</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 기대효과 */}
        <section id="effect" className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black flex items-center">
          <div className="container mx-auto px-8 py-32">
            <h2 className="text-6xl font-bold text-white mb-20 text-center">
              <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">기대효과</span>
            </h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm rounded-2xl p-10 border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
                <h3 className="text-3xl font-bold text-white mb-4">조기 발견률 향상</h3>
                <p className="text-gray-400 text-lg">AI 드론 및 IoT 센서로 24시간 감시. 발견 시간 <strong className="text-green-400">90% 단축</strong>. 골든타임 확보로 초기 진화 성공률 대폭 향상</p>
              </div>
              <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl p-10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">💰</div>
                <h3 className="text-3xl font-bold text-white mb-4">피해액 절감</h3>
                <p className="text-gray-400 text-lg">연간 평균 피해액 2,269억원 → <strong className="text-emerald-400">70% 감소 예상</strong>. 조기 진화로 대형 산불 방지. 복구 비용 및 산림 자원 손실 최소화</p>
              </div>
              <div className="group bg-gradient-to-br from-teal-500/10 to-teal-500/5 backdrop-blur-sm rounded-2xl p-10 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">👥</div>
                <h3 className="text-3xl font-bold text-white mb-4">인명 피해 최소화</h3>
                <p className="text-gray-400 text-lg">실시간 경보 시스템으로 대피 시간 확보. 3년간 사망 37명 → <strong className="text-teal-400">제로 목표</strong>. 스마트 대피 경로 안내로 이재민 감소</p>
              </div>
              <div className="group bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm rounded-2xl p-10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🌲</div>
                <h3 className="text-3xl font-bold text-white mb-4">생태계 복원력 강화</h3>
                <p className="text-gray-400 text-lg">피해 면적 감소로 복구율 19.5% → <strong className="text-cyan-400">80% 이상 향상</strong>. 산림 생태계 보호 및 탄소 흡수원 유지. 생물 다양성 보전</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. 연락하기 */}
        <section id="contact" className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-red-600 rounded-full filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-8 py-32 relative z-10">
            <h2 className="text-6xl font-bold mb-20 text-center">
              <span className="bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">연락하기</span>
            </h2>
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="space-y-8">
                <div className="group">
                  <h3 className="text-2xl font-bold mb-3 text-orange-400">팀명</h3>
                  <p className="text-gray-300 text-xl">FIRE_ZERO</p>
                </div>
                <div className="group">
                  <h3 className="text-2xl font-bold mb-3 text-orange-400">이메일</h3>
                  <p className="text-gray-300 text-xl">episode0611@gmail.com</p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/20">
                <p className="text-center text-gray-400 text-lg leading-relaxed">
                  AI 기반 산불 예방·대응 통합 플랫폼으로<br/>
                  더 안전한 대한민국을 만들어갑니다
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-gray-500 py-8 border-t border-gray-800">
        <div className="container mx-auto px-8 text-center">
          <p className="text-sm">© 2024-2025 FIRE Platform | AI 기반 산불 예방·대응 통합 솔루션</p>
          <p className="text-xs mt-2 text-gray-600">Built with React + Vite | Powered by Firebase</p>
        </div>
      </footer>
    </div>
  )
}

export default App
