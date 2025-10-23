import { Link } from 'react-router-dom';

const CaseDetail = () => {
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
              2025년 경북 의성발(發) 초대형 산불
            </h1>
            <p className="text-3xl text-orange-400 mb-4">대한민국 정부 수립 이래 최악의 산불 재난</p>
            <p className="text-gray-500">작성일: 2025년 10월 23일 | 작성자: 산불전문가 (Gemini)</p>
          </div>

          {/* 개요 */}
          <section className="mb-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-6">1. 개요 (Overview)</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              2025년 3월 22일 경상북도 의성군에서 동시다발적으로 발생하여 경북 북부(안동, 청송, 영덕 등)로 확산된 산불은,
              대한민국 정부 수립 이래 단일 산불 기준 <strong className="text-orange-400">역대 최악의 소실 면적과 최대 규모의 인명·재산 피해</strong>를
              기록한 재난 사례입니다. 본 보고서는 '2025년 의성발 경북 산불'의 핵심 현황과 원인, 대응상 문제점을 분석하여
              향후 대형 산불 대응 전략 수립의 기초 자료로 활용하고자 합니다.
            </p>
          </section>

          {/* 발생 현황 */}
          <section className="mb-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg rounded-3xl p-12 border border-orange-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">2. 발생 현황 (Incident Details)</h2>
            <div className="space-y-4 text-xl text-gray-300">
              <p><strong className="text-orange-400">사건명:</strong> 2025년 의성발 경북 산불</p>
              <p><strong className="text-orange-400">발화 일시:</strong> 2025년 3월 22일 (토) 11시 24분경 (최초 신고)</p>
              <p><strong className="text-orange-400">발화 위치:</strong></p>
              <ul className="ml-8 space-y-2">
                <li>• 경상북도 의성군 안평면 괴산리 산61 (11:24)</li>
                <li>• 경상북도 의성군 안계면 용기리 297-3 (14:39)</li>
              </ul>
              <p><strong className="text-orange-400">주요 확산 지역:</strong> 의성군, 안동시, 청송군, 영양군, 영덕군</p>
              <p><strong className="text-orange-400">진화 완료:</strong> 2025년 3월 28일 17시 15분 (주불 진화 기준)</p>
              <p><strong className="text-orange-400">대응 단계:</strong> 산불 3단계 발령 (국가 재난 사태 선포)</p>
            </div>
          </section>

          {/* 피해 규모 */}
          <section className="mb-16 bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-lg rounded-3xl p-12 border border-red-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">3. 피해 규모 (Damage Assessment)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">📏 소실 면적</h3>
                <p className="text-5xl font-bold text-white mb-4">99,490 ha</p>
                <p className="text-xl text-gray-300">994.9 ㎢</p>
                <p className="text-gray-400 mt-4">
                  • 2000년 동해안 산불(23,794 ha)의 <strong className="text-orange-400">4.1배</strong><br/>
                  • 서울특별시 면적(605.2 ㎢)의 약 <strong className="text-orange-400">1.6배</strong>
                </p>
              </div>

              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">👥 인명 피해</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xl text-gray-400">사망</p>
                    <p className="text-4xl font-bold text-white">28명</p>
                  </div>
                  <div>
                    <p className="text-xl text-gray-400">부상</p>
                    <p className="text-4xl font-bold text-white">32명</p>
                  </div>
                  <div>
                    <p className="text-xl text-gray-400">주민 대피</p>
                    <p className="text-4xl font-bold text-white">36,674명</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">🏠 재산 피해</h3>
                <div className="space-y-3 text-xl text-gray-300">
                  <p>• 주택 <strong className="text-white">3,773개소</strong> 전소</p>
                  <p>• 사찰, 농업시설 등 <strong className="text-white">6,521개소</strong> 소실</p>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-400 mb-6">🏛️ 주요 시설 피해</h3>
                <div className="space-y-3 text-xl text-gray-300">
                  <p>• 의성 고운사(Gounsa Temple) 전소</p>
                  <p>• 서산영덕고속도로 점곡휴게소 피해</p>
                  <p>• 고속도로 및 주요 국도(7번, 34번, 35번) 장시간 통제</p>
                </div>
              </div>
            </div>
          </section>

          {/* 주요 원인 */}
          <section className="mb-16 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-3xl p-12 border border-yellow-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">4. 주요 원인 및 확산 특징</h2>

            <div className="mb-8">
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">가. 직접 원인 (인재)</h3>
              <div className="space-y-3 text-xl text-gray-300">
                <p>• <strong className="text-white">안평면:</strong> 성묘객의 불법 소각 행위 (실화) 추정</p>
                <p>• <strong className="text-white">안계면:</strong> 농자재 소각 부주의</p>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">나. 확산 배경 (기후 및 환경)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-orange-400 mb-4">🌡️ 극심한 가뭄</h4>
                  <p className="text-gray-300">3월 강수량이 평년 동기 대비 <strong className="text-white">71.9%</strong> (경북 지역은 <strong className="text-white">65%</strong>) 수준에 불과한 고온건조한 환경</p>
                </div>
                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-orange-400 mb-4">💨 치명적인 강풍</h4>
                  <p className="text-gray-300">편서풍이 백두대간을 넘으며 발생한 고온건조한 강풍(국지풍). 영덕 최대순간풍속 <strong className="text-white">25.4m/s</strong>, 청송 <strong className="text-white">25.1m/s</strong> 기록</p>
                </div>
                <div className="bg-black/30 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-orange-400 mb-4">🌲 취약한 산림</h4>
                  <p className="text-gray-300">불에 잘 타는 <strong className="text-white">소나무 중심의 침엽수림</strong>이 경북 지역에 밀집되어 있어 급격한 연소 확대의 원인</p>
                </div>
              </div>
            </div>
          </section>

          {/* 대응 과정 및 문제점 */}
          <section className="mb-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg rounded-3xl p-12 border border-blue-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">5. 대응 과정 및 문제점</h2>
            <div className="space-y-6">
              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">🚨 초기 대응 실패</h3>
                <p className="text-xl text-gray-300">최초 발화 후 산불 3단계 격상까지 강풍으로 인한 확산 속도를 헬기 진화력이 따라잡지 못함</p>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">🌙 야간 진화 역량의 한계</h3>
                <p className="text-xl text-gray-300">주 진화 전력인 헬기가 일몰 및 강풍(기준 20m/s 이상)으로 이륙하지 못하면서, 야간 시간 동안 방어선 구축에 실패하고 화선이 수십 km 확산됨</p>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">⛰️ 지상 진화의 어려움</h3>
                <ul className="space-y-3 text-xl text-gray-300">
                  <li>• <strong className="text-white">지형:</strong> 험준한 산악 지형으로 지상 진화대 접근성 저하</li>
                  <li>• <strong className="text-white">우산 효과(Umbrella Effect):</strong> 굴참나무, 소나무, 조릿대가 고밀도로 얽혀 헬기 담수가 지표면에 도달하지 못하고 분산됨</li>
                  <li>• <strong className="text-white">장비 및 인력 문제:</strong> 노후화된 진화 헬기, 야간 특수 진화 장비 부족, 부족한 숙련 진화 인력 문제가 복합적으로 작용</li>
                </ul>
              </div>

              <div className="bg-black/30 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">📋 지휘 체계</h3>
                <p className="text-xl text-gray-300">초대형 산불 발생 시 산림청, 소방, 지자체 간의 유기적인 통합 지휘 및 자원 배분 효율성에 대한 문제점이 제기됨</p>
              </div>
            </div>
          </section>

          {/* 결론 및 시사점 */}
          <section className="mb-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg rounded-3xl p-12 border border-green-500/20">
            <h2 className="text-4xl font-bold text-white mb-8">6. 결론 및 시사점</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              2025년 의성발 산불은 <strong className="text-orange-400">'기후위기(고온·건조·강풍)'</strong>,
              <strong className="text-orange-400">'인간의 부주의(실화)'</strong>,
              <strong className="text-orange-400">'취약한 산림 구조'</strong>가 결합하여 발생한 최악의 복합 재난입니다.
              이 사례는 헬기 위주의 현행 진화 체계가 기후변화로 인한 극한의 기상 조건(특히 강풍과 야간) 앞에서 한계가 있음을 명확히 입증했습니다.
            </p>

            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-500/30">
              <h3 className="text-3xl font-bold text-white mb-6">향후 대응 과제</h3>
              <ul className="space-y-4 text-xl text-gray-300">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">야간 진화 헬기 및 드론 등 첨단 장비 도입</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">고성능 지상 진화차 중심의 기계화 진화 시스템 구축</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">산불 대응 지휘체계 일원화</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-4 text-2xl">▸</span>
                  <span><strong className="text-white">장기적인 내화수림대 조성 및 산림 경영 방식 개선</strong></span>
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
          <p className="text-sm">© 2024-2025 FIRE Platform | 데이터 출처: 산림청</p>
        </div>
      </footer>
    </div>
  );
};

export default CaseDetail;
