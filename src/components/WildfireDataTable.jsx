/**
 * 산불 데이터 테이블 컴포넌트
 * 필터링, 정렬, 페이지네이션 기능 제공
 */
import { useState, useMemo } from 'react';

const WildfireDataTable = ({ data }) => {
  // 정렬 상태
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 필터
  const [filters, setFilters] = useState({
    searchText: '',
    minArea: '',
    maxArea: '',
    cause: 'all'
  });

  // 정렬 처리
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // 데이터 필터링 및 정렬
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // 검색 필터
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(fire =>
        fire.location?.toLowerCase().includes(searchLower)
      );
    }

    // 면적 필터
    if (filters.minArea !== '') {
      const min = parseFloat(filters.minArea);
      filtered = filtered.filter(fire => fire.area >= min);
    }
    if (filters.maxArea !== '') {
      const max = parseFloat(filters.maxArea);
      filtered = filtered.filter(fire => fire.area <= max);
    }

    // 원인 필터
    if (filters.cause !== 'all') {
      filtered = filtered.filter(fire => fire.cause === filters.cause);
    }

    // 정렬
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortColumn) {
        case 'date':
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case 'area':
          aVal = a.area || 0;
          bVal = b.area || 0;
          break;
        case 'amount':
          aVal = a.amount || 0;
          bVal = b.amount || 0;
          break;
        case 'location':
          aVal = a.location || '';
          bVal = b.location || '';
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, filters, sortColumn, sortDirection]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  // 원인 종류 추출
  const causeOptions = useMemo(() => {
    const causes = new Set(data.map(fire => fire.cause).filter(Boolean));
    return Array.from(causes).sort();
  }, [data]);

  // 정렬 아이콘
  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return <span className="text-gray-300">⇅</span>;
    return sortDirection === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">산불 발생 이력</h2>
        <p className="text-sm text-gray-600">
          총 {filteredAndSortedData.length.toLocaleString()}건 (전체 {data.length.toLocaleString()}건)
        </p>
      </div>

      {/* 필터 */}
      <div className="p-4 border-b bg-gray-50 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 검색 */}
          <input
            type="text"
            placeholder="주소 검색..."
            value={filters.searchText}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 최소 면적 */}
          <input
            type="number"
            placeholder="최소 면적 (ha)"
            value={filters.minArea}
            onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
          />

          {/* 최대 면적 */}
          <input
            type="number"
            placeholder="최대 면적 (ha)"
            value={filters.maxArea}
            onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
          />

          {/* 원인 */}
          <select
            value={filters.cause}
            onChange={(e) => setFilters({ ...filters, cause: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">모든 원인</option>
            {causeOptions.map(cause => (
              <option key={cause} value={cause}>{cause}</option>
            ))}
          </select>
        </div>

        {/* 필터 초기화 */}
        <button
          onClick={() => setFilters({ searchText: '', minArea: '', maxArea: '', cause: 'all' })}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          필터 초기화
        </button>
      </div>

      {/* 테이블 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                발생일자 <SortIcon column="date" />
              </th>
              <th
                onClick={() => handleSort('location')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                위치 <SortIcon column="location" />
              </th>
              <th
                onClick={() => handleSort('area')}
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                면적(ha) <SortIcon column="area" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                원인
              </th>
              <th
                onClick={() => handleSort('amount')}
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200"
              >
                피해액(천원) <SortIcon column="amount" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((fire, index) => (
              <tr
                key={fire.id}
                className={`border-b hover:bg-blue-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{fire.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{fire.location}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {fire.area ? fire.area.toFixed(2) : '0.00'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{fire.cause || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                  {fire.amount ? fire.amount.toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} / {filteredAndSortedData.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            이전
          </button>
          <span className="px-3 py-1">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default WildfireDataTable;
