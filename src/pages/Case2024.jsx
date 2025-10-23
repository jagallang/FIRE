import { Link } from 'react-router-dom';

const Case2024 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                FIRE
              </div>
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← 돌아가기
            </Link>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-8 max-w-6xl">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <div className="text-7xl mb-6">🔥</div>
            <h1 className="text-6xl font-bold text-white mb-6">
              2024년 강원·경북 동해안권 산불
            </h1>
            <p className="text-3xl text-orange-400 mb-4">3~4월 집중 발생, 부주의 75%</p>
            <p className="text-gray-500">출처: 2024년 산불통계연보</p>
          </div>

          {/* 개요 */}
          <section className="mb-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-6">1. 개요 (Overview)</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              2024년 대한민국에서는 총 <strong className="text-orange-400">546건</strong>의 산불이 발생하여
              <strong className="text-orange-400"> 4,003ha</strong>의 산림이 소실되었습니다.
              특히 3~4월에 강원도 및 경북 동해안권을 중심으로 대형 산불이 집중 발생하였으며,
              주택·사찰·문화재·송전선로 등 주요 시설에 피해가 발생했습니다.
            </p>
            <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20">
              <p className="text-lg text-gray-300">
                <strong className="text-orange-400">⚠️ 주요 특징:</strong> 산불 원인의 75%가 부주의(불법소각, 입산자 실화, 작업장 화기 등)이며,
                야간산불 비율이 10년간 28% 증가하여 드론 및 열화상 대응 체계의 필요성이 대두되었습니다.
              </p>
            </div>
          </section>

          {/* 2024년 주요 통계 */}
          <section className="mb-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg rounded-3xl p-12 border border-orange-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">2. 2024년 주요 통계</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-orange-400 mb-6">📊 발생 현황</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xl text-gray-400">총 발생 건수</p>
                    <p className="text-5xl font-bold text-white">546건</p>
                  </div>
                  <div>
                    <p className="text-xl text-gray-400">총 소실 면적</p>
                    <p className="text-5xl font-bold text-white">4,003ha</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400">대표 사건</p>
                    <p className="text-white">강원·경북 동해안권 산불 (3~4월)</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">🔥 피해 유형</h3>
                <ul className="space-y-4 text-xl text-gray-300">
                  <li>• 주택 피해 다수</li>
                  <li>• 사찰 및 문화재 연접 피해</li>
                  <li>• 송전선로 피해</li>
                  <li>• 농업시설 소실</li>
                  <li>• 산림자원 손실</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">⚠️ 발생 원인</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">부주의</span>
                    <span className="text-white font-bold">75%</span>
                  </div>
                  <div className="bg-yellow-500/20 h-3 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="text-sm text-gray-400 space-y-2 mt-4">
                    <p>• 불법소각</p>
                    <p>• 입산자 실화</p>
                    <p>• 작업장 화기</p>
                    <p>• 담뱃불</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">🌙 야간산불 증가</h3>
                <div className="space-y-4">
                  <p className="text-4xl font-bold text-white">+28%</p>
                  <p className="text-xl text-gray-300">10년간 증가율</p>
                  <div className="mt-6 bg-blue-500/10 rounded-xl p-4">
                    <p className="text-sm text-gray-400">
                      드론 및 열화상 장비 대응 필요성 증대
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 국제 비교 */}
          <section className="mb-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl p-12 border border-purple-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">3. 국제 비교</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4 text-xl text-gray-400">국가</th>
                    <th className="p-4 text-xl text-gray-400">연평균 산불건수</th>
                    <th className="p-4 text-xl text-gray-400">피해면적(ha)</th>
                    <th className="p-4 text-xl text-gray-400">특징</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="p-4 text-xl">🇺🇸 미국</td>
                    <td className="p-4 text-xl font-bold text-white">50,000+</td>
                    <td className="p-4 text-xl font-bold text-red-400">4,000,000+</td>
                    <td className="p-4">초대형화·도심화</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-4 text-xl">🇨🇦 캐나다</td>
                    <td className="p-4 text-xl font-bold text-white">6,000+</td>
                    <td className="p-4 text-xl font-bold text-red-400">10,000,000+</td>
                    <td className="p-4">기후변화 직격</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="p-4 text-xl">🇯🇵 일본</td>
                    <td className="p-4 text-xl font-bold text-white">2,000+</td>
                    <td className="p-4 text-xl font-bold text-orange-400">1,000+</td>
                    <td className="p-4">인접 산림 화재 집중</td>
                  </tr>
                  <tr className="bg-orange-500/10">
                    <td className="p-4 text-xl">🇰🇷 한국</td>
                    <td className="p-4 text-xl font-bold text-white">546</td>
                    <td className="p-4 text-xl font-bold text-orange-400">4,003</td>
                    <td className="p-4">관리 시스템 우수하나 예방 중심 한계</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
              <p className="text-gray-300">
                <strong className="text-white">분석:</strong> 한국은 발생 건수 대비 소실 면적이 상대적으로 적어
                관리 시스템의 효율성은 검증되었으나, 인위적 부주의로 인한 발생률이 높아 예방 체계의 한계가 드러남.
              </p>
            </div>
          </section>

          {/* 발생 패턴 분석 */}
          <section className="mb-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-3xl p-12 border border-blue-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">4. 발생 패턴 분석</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-blue-400 mb-6">📅 계절별 분포</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">3~4월</span>
                      <span className="text-white font-bold">60%</span>
                    </div>
                    <div className="bg-blue-500/20 h-4 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">기타 기간</span>
                      <span className="text-white font-bold">40%</span>
                    </div>
                    <div className="bg-gray-500/20 h-4 rounded-full overflow-hidden">
                      <div className="bg-gray-500 h-full" style={{width: '40%'}}></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-6">
                    ⚠️ 계절적 집중으로 대응인력 과부하
                  </p>
                </div>
              </div>

              <div className="bg-black/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6">⏰ 진화 소요시간</h3>
                <div className="text-center mb-6">
                  <p className="text-6xl font-bold text-white mb-2">3시간+</p>
                  <p className="text-xl text-gray-300">평균 진화시간</p>
                </div>
                <div className="bg-cyan-500/10 rounded-xl p-4">
                  <p className="text-sm text-gray-400">
                    제약 요인: 험준한 지형, 기상 조건, 통신망 한계
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 주요 문제점 */}
          <section className="mb-16 bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl p-12 border border-red-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">5. 주요 문제점</h2>
            <div className="space-y-6">
              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-red-400 mb-4">🚨 개인 부주의형 재해</h3>
                <p className="text-xl text-gray-300">불법소각·입산자실화가 60%로, 개인의 부주의로 인한 재해로 사전 통제가 어려움</p>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">🌙 야간 진화 역량 부족</h3>
                <p className="text-xl text-gray-300">10년간 야간산불 30% 증가했으나 드론·열화상 장비 부족으로 대응 한계</p>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-yellow-400 mb-4">📊 정보 공유 체계 미비</h3>
                <p className="text-xl text-gray-300">소방청·산림청 등 기관별 통계가 분산되어 있어 통합 데이터 부재, 대응 지연 발생</p>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">⏱️ 계절적 과부하</h3>
                <p className="text-xl text-gray-300">3~4월에 60% 집중 발생하여 대응인력 및 자원의 계절적 과부하</p>
              </div>
            </div>
          </section>

          {/* 시사점 */}
          <section className="mb-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-3xl p-12 border border-green-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">6. 시사점</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              2024년 산불 통계는 한국의 산불 관리 시스템이 <strong className="text-orange-400">효율성 측면에서는 우수</strong>하지만,
              <strong className="text-orange-400">인위적 부주의 예방</strong>과 <strong className="text-orange-400">야간·기상악화 대응 역량</strong>
              측면에서 한계가 있음을 보여줍니다.
            </p>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30">
              <h3 className="text-3xl font-bold text-white mb-6">개선 필요 분야</h3>
              <ul className="space-y-4 text-xl text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">AI·드론 기반 24시간 감시 체계</strong> 구축</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">통합 데이터 플랫폼</strong> 구축 (기관 간 정보 공유 체계)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">국민 안전의식 향상 캠페인</strong> 강화 (부주의 예방)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">열화상·야간 진화 장비</strong> 확충</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 돌아가기 버튼 */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50"
            >
              ← 메인으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-black text-gray-500 py-8 border-t border-gray-800">
        <div className="container mx-auto px-8 text-center">
          <p className="text-sm">© 2024-2025 FIRE Platform | 데이터 출처: 2024년 산불통계연보</p>
        </div>
      </footer>
    </div>
  );
};

export default Case2024;
