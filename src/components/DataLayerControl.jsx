import { useState, useEffect } from 'react';

/**
 * 지도 데이터 레이어 컨트롤 컴포넌트
 * 데이터 항목별로 체크박스로 표시/숨김 기능 제공
 */
const DataLayerControl = ({ wildfireData, onLayerChange }) => {
  // 데이터 수집 항목별 통계
  const [statistics, setStatistics] = useState({
    total: 0,
    byCause: {},
    byAreaRange: {},
    byYear: {}
  });

  // 주소 검색 상태
  const [searchText, setSearchText] = useState('');

  // 표시 레이어 상태
  const [visibleLayers, setVisibleLayers] = useState({
    // 원인별
    causes: {
      '입산자 실화': true,
      '논·밭두렁 소각': true,
      '담뱃불 실화': true,
      '고압선 단선': true,
      '전신주 스파크': true,
      '기타': true
    },
    // 피해 규모별
    areaRanges: {
      'verySmall': true,  // 10ha 미만
      'small': true,      // 10-50ha
      'medium': true,     // 50-100ha
      'large': true,      // 100-1000ha
      'veryLarge': true   // 1000ha 이상
    },
    // 연도별
    years: {}
  });

  // 데이터 통계 계산
  useEffect(() => {
    if (!wildfireData || wildfireData.length === 0) return;

    const stats = {
      total: wildfireData.length,
      byCause: {},
      byAreaRange: {
        'verySmall': 0,
        'small': 0,
        'medium': 0,
        'large': 0,
        'veryLarge': 0
      },
      byYear: {}
    };

    wildfireData.forEach(fire => {
      // 원인별 통계
      const cause = fire.cause || '기타';
      stats.byCause[cause] = (stats.byCause[cause] || 0) + 1;

      // 피해 규모별 통계
      const area = fire.area || 0;
      if (area < 10) stats.byAreaRange.verySmall++;
      else if (area < 50) stats.byAreaRange.small++;
      else if (area < 100) stats.byAreaRange.medium++;
      else if (area < 1000) stats.byAreaRange.large++;
      else stats.byAreaRange.veryLarge++;

      // 연도별 통계
      const year = new Date(fire.date).getFullYear();
      if (!isNaN(year)) {
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
      }
    });

    setStatistics(stats);

    // 초기 레이어 상태 설정
    const initialYears = {};
    Object.keys(stats.byYear).forEach(year => {
      initialYears[year] = true;
    });

    setVisibleLayers(prev => ({
      ...prev,
      years: initialYears
    }));

  }, [wildfireData]);

  // 필터링된 데이터 계산 및 부모에게 전달
  useEffect(() => {
    if (!wildfireData) return;

    const filtered = wildfireData.filter(fire => {
      // 주소 검색 필터
      if (searchText.trim()) {
        const location = fire.location || '';
        // 'null' 문자열도 체크
        const validLocation = location !== 'null' ? location : '';
        if (!validLocation.toLowerCase().includes(searchText.toLowerCase())) {
          return false;
        }
      }

      // 원인별 필터 - 체크박스에 없는 원인도 허용
      const cause = fire.cause || '기타';
      if (visibleLayers.causes[cause] !== undefined && !visibleLayers.causes[cause]) {
        return false;
      }

      // 피해 규모별 필터
      const area = fire.area || 0;
      let areaRange;
      if (area < 10) areaRange = 'verySmall';
      else if (area < 50) areaRange = 'small';
      else if (area < 100) areaRange = 'medium';
      else if (area < 1000) areaRange = 'large';
      else areaRange = 'veryLarge';

      if (!visibleLayers.areaRanges[areaRange]) return false;

      // 연도별 필터
      const year = new Date(fire.date).getFullYear();
      if (!isNaN(year) && visibleLayers.years[year] !== undefined) {
        if (!visibleLayers.years[year]) return false;
      }

      return true;
    });

    onLayerChange(filtered);
  }, [visibleLayers, wildfireData, onLayerChange, searchText]);

  // 원인별 토글
  const toggleCause = (cause) => {
    setVisibleLayers(prev => ({
      ...prev,
      causes: {
        ...prev.causes,
        [cause]: !prev.causes[cause]
      }
    }));
  };

  // 피해 규모별 토글
  const toggleAreaRange = (range) => {
    setVisibleLayers(prev => ({
      ...prev,
      areaRanges: {
        ...prev.areaRanges,
        [range]: !prev.areaRanges[range]
      }
    }));
  };

  // 연도별 토글
  const toggleYear = (year) => {
    setVisibleLayers(prev => ({
      ...prev,
      years: {
        ...prev.years,
        [year]: !prev.years[year]
      }
    }));
  };

  // 전체 선택/해제
  const toggleAllCauses = (value) => {
    const newCauses = {};
    Object.keys(visibleLayers.causes).forEach(cause => {
      newCauses[cause] = value;
    });
    setVisibleLayers(prev => ({ ...prev, causes: newCauses }));
  };

  const toggleAllAreaRanges = (value) => {
    const newRanges = {};
    Object.keys(visibleLayers.areaRanges).forEach(range => {
      newRanges[range] = value;
    });
    setVisibleLayers(prev => ({ ...prev, areaRanges: newRanges }));
  };

  const toggleAllYears = (value) => {
    const newYears = {};
    Object.keys(visibleLayers.years).forEach(year => {
      newYears[year] = value;
    });
    setVisibleLayers(prev => ({ ...prev, years: newYears }));
  };

  const areaRangeLabels = {
    'verySmall': '10ha 미만',
    'small': '10-50ha',
    'medium': '50-100ha',
    'large': '100-1000ha',
    'veryLarge': '1000ha 이상'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
        <span className="mr-2">🗂️</span>
        지도 레이어 컨트롤
        <span className="ml-auto text-sm font-normal text-gray-500">
          총 {statistics.total}건
        </span>
      </h3>

      {/* 주소 검색 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="주소로 검색... (예: 강원, 경북, 울진)"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        {searchText && (
          <div className="mt-2 text-sm text-gray-600">
            검색 결과: {wildfireData.filter(fire =>
              (fire.location || '').toLowerCase().includes(searchText.toLowerCase())
            ).length}건
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 원인별 레이어 */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700 text-sm">발생 원인</h4>
            <div className="space-x-1">
              <button
                onClick={() => toggleAllCauses(true)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                전체
              </button>
              <button
                onClick={() => toggleAllCauses(false)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                해제
              </button>
            </div>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(statistics.byCause).map(([cause, count]) => (
              <label key={cause} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={visibleLayers.causes[cause] || false}
                  onChange={() => toggleCause(cause)}
                  className="mr-2 w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm flex-1">{cause}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 피해 규모별 레이어 */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700 text-sm">피해 규모</h4>
            <div className="space-x-1">
              <button
                onClick={() => toggleAllAreaRanges(true)}
                className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
              >
                전체
              </button>
              <button
                onClick={() => toggleAllAreaRanges(false)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                해제
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {Object.entries(areaRangeLabels).map(([range, label]) => (
              <label key={range} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={visibleLayers.areaRanges[range]}
                  onChange={() => toggleAreaRange(range)}
                  className="mr-2 w-4 h-4 text-orange-600 rounded"
                />
                <span className="text-sm flex-1">{label}</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                  {statistics.byAreaRange[range] || 0}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 연도별 레이어 */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-700 text-sm">발생 연도</h4>
            <div className="space-x-1">
              <button
                onClick={() => toggleAllYears(true)}
                className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                전체
              </button>
              <button
                onClick={() => toggleAllYears(false)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                해제
              </button>
            </div>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(statistics.byYear)
              .sort(([a], [b]) => b - a) // 최신 연도부터
              .map(([year, count]) => (
                <label key={year} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={visibleLayers.years[year] || false}
                    onChange={() => toggleYear(year)}
                    className="mr-2 w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm flex-1">{year}년</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </label>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLayerControl;
