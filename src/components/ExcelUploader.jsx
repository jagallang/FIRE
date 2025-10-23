/**
 * Excel 파일 업로드 및 파싱 컴포넌트
 * 24년, 25년 산불 데이터 업로드
 */
import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelUploader = ({ onDataLoaded }) => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus('파일 읽는 중...');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // 첫 번째 시트 읽기
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // JSON으로 변환
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setStatus(`${jsonData.length}건의 데이터를 읽었습니다.`);

      // 데이터 변환 및 정규화
      const normalizedData = normalizeExcelData(jsonData);

      setStatus(`${normalizedData.length}건의 데이터를 변환했습니다.`);

      // 부모 컴포넌트로 전달
      if (onDataLoaded) {
        onDataLoaded(normalizedData, file.name);
      }

      setTimeout(() => {
        setStatus('');
        setUploading(false);
      }, 2000);

    } catch (error) {
      console.error('Excel 파일 처리 오류:', error);
      setStatus(`오류: ${error.message}`);
      setUploading(false);
    }
  };

  // Excel 데이터를 앱에서 사용하는 형식으로 변환
  const normalizeExcelData = (rawData) => {
    return rawData.map((row, index) => {
      // Excel 열 이름이 다를 수 있으므로 유연하게 매핑
      const date = row['발생일자'] || row['날짜'] || row['DATE'] || row['OCCU_DATE'] || '';
      const location = row['위치'] || row['주소'] || row['LOCATION'] || row['ADRES'] || '';
      const area = parseFloat(row['면적'] || row['피해면적'] || row['AREA'] || row['AR'] || 0);
      const cause = row['원인'] || row['발생원인'] || row['CAUSE'] || row['RESN'] || '';
      const amount = parseFloat(row['피해액'] || row['피해금액'] || row['AMOUNT'] || 0);

      return {
        id: `excel-${index + 1}`,
        date: formatDate(date),
        location: location,
        latitude: 37.5 + Math.random() * 2, // 임시 좌표
        longitude: 127 + Math.random() * 2, // 임시 좌표
        area: area,
        cause: cause || '원인 미상',
        casualties: null,
        amount: amount,
        occuYear: date ? date.toString().substring(0, 4) : new Date().getFullYear().toString()
      };
    });
  };

  // 날짜 형식 정규화
  const formatDate = (dateValue) => {
    if (!dateValue) return new Date().toISOString().split('T')[0];

    // Excel 날짜 형식 처리
    if (typeof dateValue === 'number') {
      // Excel의 숫자 날짜를 JavaScript Date로 변환
      const date = XLSX.SSF.parse_date_code(dateValue);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }

    // 문자열 날짜 처리
    const str = dateValue.toString();

    // YYYY-MM-DD 형식
    if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return str;
    }

    // YYYYMMDD 형식
    if (str.match(/^\d{8}$/)) {
      return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;
    }

    // YYYY.MM.DD 형식
    if (str.includes('.')) {
      return str.replace(/\./g, '-');
    }

    // YYYY/MM/DD 형식
    if (str.includes('/')) {
      return str.replace(/\//g, '-');
    }

    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📁 2024-2025년 엑셀 데이터 업로드
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            24년, 25년 산불 데이터 엑셀 파일을 업로드하세요.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          {uploading ? '처리 중...' : '파일 선택'}
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {status && (
          <div className="text-sm text-blue-800">
            {status}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-blue-600">
        💡 팁: Excel 파일은 '발생일자', '위치', '면적', '원인', '피해액' 열을 포함해야 합니다.
      </div>
    </div>
  );
};

export default ExcelUploader;
