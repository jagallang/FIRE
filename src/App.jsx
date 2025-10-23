import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import WildfireMap from './components/WildfireMap'
import WildfireDataTable from './components/WildfireDataTable'
import ExcelUploader from './components/ExcelUploader'
import './App.css'

function App() {
  const [wildfireData, setWildfireData] = useState([])
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
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                FIRE
              </div>
            </div>
            <div className="flex gap-8">
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
                  className={`text-sm font-medium transition-all duration-300 relative ${
                    activeSection === section.id
                      ? 'text-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {section.label}
                  {activeSection === section.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
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
                산불지도 타이틀
              </h1>
              <p className="text-3xl text-gray-400 font-light">부제목 입력</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/10">
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

            {/* 데이터 업로드 및 테이블 */}
            <div className="mt-16">
              <ExcelUploader onDataLoaded={handleExcelDataLoaded} />

              {wildfireData.length > 0 && (
                <>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-3xl font-bold text-white">산불 데이터</h3>
                        <p className="text-gray-400 mt-2 text-lg">총 {wildfireData.length}건의 산불 데이터</p>
                      </div>
                      <button
                        onClick={handleDownloadExcel}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-green-500/50"
                      >
                        <span className="text-2xl">📥</span>
                        <span className="font-semibold">Excel 다운로드</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden" style={{ height: '600px' }}>
                    <WildfireDataTable data={wildfireData} />
                  </div>
                </>
              )}
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
                <h3 className="text-4xl font-bold text-white mb-10">소제목</h3>
                <ul className="space-y-6 text-xl text-gray-300">
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span>배경 내용 1</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span>배경 내용 2</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span>배경 내용 3</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-orange-500 mr-4 text-2xl group-hover:scale-125 transition-transform">●</span>
                    <span>배경 내용 4</span>
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
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-2xl font-bold text-white mb-6">문제점 1 제목</h3>
                <p className="text-gray-400 text-lg">문제점 1 내용</p>
              </div>
              <div className="group bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm rounded-2xl p-10 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">⏰</div>
                <h3 className="text-2xl font-bold text-white mb-6">문제점 2 제목</h3>
                <p className="text-gray-400 text-lg">문제점 2 내용</p>
              </div>
              <div className="group bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm rounded-2xl p-10 border border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-6">문제점 3 제목</h3>
                <p className="text-gray-400 text-lg">문제점 3 내용</p>
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
                <div className="text-7xl group-hover:scale-110 transition-transform">1️⃣</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">해결방안 1 제목</h3>
                  <p className="text-gray-400 text-lg">해결방안 1 내용</p>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-cyan-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl p-10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 flex items-start gap-8 hover:scale-105">
                <div className="text-7xl group-hover:scale-110 transition-transform">2️⃣</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">해결방안 2 제목</h3>
                  <p className="text-gray-400 text-lg">해결방안 2 내용</p>
                </div>
              </div>
              <div className="group bg-gradient-to-r from-teal-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl p-10 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 flex items-start gap-8 hover:scale-105">
                <div className="text-7xl group-hover:scale-110 transition-transform">3️⃣</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-4">해결방안 3 제목</h3>
                  <p className="text-gray-400 text-lg">해결방안 3 내용</p>
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
                  <h3 className="text-5xl font-bold mb-4">제품명</h3>
                  <p className="text-2xl font-light opacity-90">제품 부제목</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                  <h4 className="text-2xl font-bold text-white mb-3">기능 1 제목</h4>
                  <p className="text-gray-400">기능 1 설명</p>
                </div>
                <div className="group bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                  <h4 className="text-2xl font-bold text-white mb-3">기능 2 제목</h4>
                  <p className="text-gray-400">기능 2 설명</p>
                </div>
                <div className="group bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
                  <h4 className="text-2xl font-bold text-white mb-3">기능 3 제목</h4>
                  <p className="text-gray-400">기능 3 설명</p>
                </div>
                <div className="group bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📥</div>
                  <h4 className="text-2xl font-bold text-white mb-3">기능 4 제목</h4>
                  <p className="text-gray-400">기능 4 설명</p>
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
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🌲</div>
                <h3 className="text-3xl font-bold text-white mb-4">기대효과 1 제목</h3>
                <p className="text-gray-400 text-lg">기대효과 1 내용</p>
              </div>
              <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm rounded-2xl p-10 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">💰</div>
                <h3 className="text-3xl font-bold text-white mb-4">기대효과 2 제목</h3>
                <p className="text-gray-400 text-lg">기대효과 2 내용</p>
              </div>
              <div className="group bg-gradient-to-br from-teal-500/10 to-teal-500/5 backdrop-blur-sm rounded-2xl p-10 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">👥</div>
                <h3 className="text-3xl font-bold text-white mb-4">기대효과 3 제목</h3>
                <p className="text-gray-400 text-lg">기대효과 3 내용</p>
              </div>
              <div className="group bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm rounded-2xl p-10 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📈</div>
                <h3 className="text-3xl font-bold text-white mb-4">기대효과 4 제목</h3>
                <p className="text-gray-400 text-lg">기대효과 4 내용</p>
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
                  <p className="text-gray-300 text-xl">팀명 입력</p>
                </div>
                <div className="group">
                  <h3 className="text-2xl font-bold mb-3 text-orange-400">이메일</h3>
                  <p className="text-gray-300 text-xl">이메일 입력</p>
                </div>
                <div className="group">
                  <h3 className="text-2xl font-bold mb-3 text-orange-400">전화</h3>
                  <p className="text-gray-300 text-xl">전화번호 입력</p>
                </div>
                <div className="group">
                  <h3 className="text-2xl font-bold mb-3 text-orange-400">주소</h3>
                  <p className="text-gray-300 text-xl">주소 입력</p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/20">
                <p className="text-center text-gray-400 text-lg leading-relaxed">
                  추가 메시지 1<br/>
                  추가 메시지 2
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-gray-500 py-8 border-t border-gray-800">
        <div className="container mx-auto px-8 text-center">
          <p className="text-sm">© 2024-2025 FIRE Platform | 푸터 내용</p>
        </div>
      </footer>
    </div>
  )
}

export default App
