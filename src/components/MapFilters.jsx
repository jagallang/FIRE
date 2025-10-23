import { useState, useEffect } from 'react';

const MapFilters = ({ wildfireData, onFilterChange }) => {
  // 전체 데이터에서 고유한 원인과 연도 추출
  const [causes, setCauses] = useState([]);
  const [years, setYears] = useState([]);

  // 선택된 필터
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  useEffect(() => {
    // 고유한 원인 추출
    const uniqueCauses = [...new Set(wildfireData.map(fire => fire.cause))];
    setCauses(uniqueCauses);

    // 고유한 연도 추출
    const uniqueYears = [...new Set(wildfireData.map(fire =>
      new Date(fire.date).getFullYear()
    ))].sort((a, b) => b - a);
    setYears(uniqueYears);

    // 초기에는 모든 필터 선택
    setSelectedCauses(uniqueCauses);
    setSelectedYears(uniqueYears);
  }, [wildfireData]);

  // 필터 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    const filtered = wildfireData.filter(fire => {
      const fireYear = new Date(fire.date).getFullYear();
      const causeMatch = selectedCauses.length === 0 || selectedCauses.includes(fire.cause);
      const yearMatch = selectedYears.length === 0 || selectedYears.includes(fireYear);
      return causeMatch && yearMatch;
    });
    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCauses, selectedYears, wildfireData]);

  // 원인 체크박스 토글
  const toggleCause = (cause) => {
    setSelectedCauses(prev =>
      prev.includes(cause)
        ? prev.filter(c => c !== cause)
        : [...prev, cause]
    );
  };

  // 연도 체크박스 토글
  const toggleYear = (year) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // 전체 선택/해제
  const selectAllCauses = () => {
    setSelectedCauses(causes);
  };

  const deselectAllCauses = () => {
    setSelectedCauses([]);
  };

  const selectAllYears = () => {
    setSelectedYears(years);
  };

  const deselectAllYears = () => {
    setSelectedYears([]);
  };

  return (
    <div className="filter-container bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🔍 데이터 필터</h3>

      <div className="filter-grid">
        {/* 원인별 필터 */}
        <div className="filter-section">
          <div className="filter-header">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">발생 원인</h4>
            <div className="filter-actions">
              <button onClick={selectAllCauses} className="filter-btn">전체 선택</button>
              <button onClick={deselectAllCauses} className="filter-btn">전체 해제</button>
            </div>
          </div>
          <div className="checkbox-group">
            {causes.map(cause => (
              <label key={cause} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedCauses.includes(cause)}
                  onChange={() => toggleCause(cause)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{cause}</span>
                <span className="checkbox-count">
                  ({wildfireData.filter(f => f.cause === cause).length})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 연도별 필터 */}
        <div className="filter-section">
          <div className="filter-header">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">발생 연도</h4>
            <div className="filter-actions">
              <button onClick={selectAllYears} className="filter-btn">전체 선택</button>
              <button onClick={deselectAllYears} className="filter-btn">전체 해제</button>
            </div>
          </div>
          <div className="checkbox-group">
            {years.map(year => (
              <label key={year} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={() => toggleYear(year)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">{year}년</span>
                <span className="checkbox-count">
                  ({wildfireData.filter(f => new Date(f.date).getFullYear() === year).length})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 필터 결과 요약 */}
        <div className="filter-summary">
          <div className="summary-card">
            <p className="text-sm text-gray-600">필터링된 결과</p>
            <p className="text-2xl font-bold text-blue-600">
              {wildfireData.filter(fire => {
                const fireYear = new Date(fire.date).getFullYear();
                return (selectedCauses.length === 0 || selectedCauses.includes(fire.cause)) &&
                       (selectedYears.length === 0 || selectedYears.includes(fireYear));
              }).length}건
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
