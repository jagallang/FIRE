/**
 * 산림청 산불발생이력 Open API 서비스
 */
import axios from 'axios';
import { tmToWgs84 } from '../utils/coordinateConverter';

const API_BASE_URL = '/api/wildfire';
const API_KEY = import.meta.env.VITE_WILDFIRE_API_KEY;

/**
 * XML을 파싱 (브라우저 DOMParser 사용)
 */
function parseXML(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // 파싱 에러 확인
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error: ' + parserError.textContent);
    }

    return xmlDoc;
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw error;
  }
}

/**
 * XML Element에서 텍스트 값 추출
 */
function getElementText(xmlDoc, tagName) {
  const element = xmlDoc.querySelector(tagName);
  return element ? element.textContent : null;
}

/**
 * XML에서 모든 item 요소 추출
 */
function extractItems(xmlDoc) {
  const items = xmlDoc.querySelectorAll('item');
  return Array.from(items).map(item => {
    const obj = {};
    Array.from(item.children).forEach(child => {
      obj[child.tagName] = child.textContent;
    });
    return obj;
  });
}

/**
 * 산불 발생 이력 데이터 조회
 * @param {Object} params - 요청 파라미터
 * @param {number} params.numOfRows - 한 페이지 결과 수 (기본: 100)
 * @param {number} params.pageNo - 페이지 번호 (기본: 1)
 * @param {string} params.dataType - 데이터 타입 (XML/JSON, 기본: XML)
 * @returns {Promise<Array>} 산불 발생 이력 데이터 배열
 */
export async function getWildfireData(params = {}) {
  const {
    numOfRows = 100,
    pageNo = 1,
    dataType = 'XML'
  } = params;

  try {
    console.log('Fetching wildfire data from API...');
    console.log('API Key:', API_KEY);

    const response = await axios.get(`${API_BASE_URL}/getFrfireSttusData.do`, {
      params: {
        serviceKey: API_KEY,
        numOfRows,
        pageNo,
        dataType
      },
      timeout: 10000, // 10초 타임아웃
      paramsSerializer: {
        encode: (value) => {
          // serviceKey는 인코딩하지 않고 그대로 전달
          return value;
        }
      }
    });

    console.log('API Response received:', response.status);
    console.log('Request URL:', response.config.url);

    // XML 파싱
    const xmlDoc = parseXML(response.data);

    // 응답 구조 확인 및 에러 체크
    const resultCode = getElementText(xmlDoc, 'resultCode');
    const resultMsg = getElementText(xmlDoc, 'resultMsg');

    if (resultCode && resultCode !== '00') {
      throw new Error(resultMsg || 'API Error: ' + resultCode);
    }

    // 데이터 추출
    const items = extractItems(xmlDoc);

    if (!items || items.length === 0) {
      console.warn('No items found in API response');
      return [];
    }

    console.log(`Found ${items.length} wildfire records`);

    // 첫 번째 아이템 샘플 출력 - 주소 확인
    if (items.length > 0) {
      console.log('First item sample:', items[0]);
      console.log('주소 확인:', {
        도로명주소: items[0].RN_ADRES,
        지번주소: items[0].ADRES,
        X좌표: items[0].X,
        Y좌표: items[0].Y,
        시도코드: items[0].CTPRVN_CD,
        시군구코드: items[0].SGG_CD
      });
    }

    // 데이터 매핑 및 좌표 변환
    const wildfireData = items.map((item, index) => {
      try {
        // API 좌표 → TM 좌표계 변환 사용
        const xRaw = parseFloat(item.X);
        const yRaw = parseFloat(item.Y);

        // TM 좌표계 → WGS84 변환
        const { latitude, longitude } = tmToWgs84(xRaw, yRaw);

        // 모든 아이템의 좌표 변환 결과 출력 (처음 10개만)
        if (index < 10) {
          console.log(`🔍 Item ${index} conversion:`, {
            '원본 X': xRaw,
            '원본 Y': yRaw,
            'longitude': longitude.toFixed(6),
            'latitude': latitude.toFixed(6),
            '한국 범위 내': latitude >= 33 && latitude <= 43 && longitude >= 124 && longitude <= 132,
            '위치': item.RN_ADRES || item.ADRES
          });
        }

        // 전체 통계
        if (index === items.length - 1) {
          console.log(`📊 총 ${items.length}개 데이터 로드 완료`);
        }

        // 발생일자 포맷팅
        const occuDate = item.OCCU_DATE || '';
        const formattedDate = occuDate.length === 8
          ? `${occuDate.substring(0, 4)}-${occuDate.substring(4, 6)}-${occuDate.substring(6, 8)}`
          : occuDate;

        // 주소 선택 (도로명 주소 우선, 없으면 지번 주소)
        // 'null' 문자열도 체크
        const roadAddress = item.RN_ADRES && item.RN_ADRES !== 'null' ? item.RN_ADRES : '';
        const jibunAddress = item.ADRES && item.ADRES !== 'null' ? item.ADRES : '';
        const address = roadAddress || jibunAddress || '주소 정보 없음';

        return {
          id: parseInt(item.OBJT_ID) || Math.random(),
          location: address,
          latitude,
          longitude,
          date: formattedDate,
          area: parseFloat(item.AR) || 0,
          cause: item.RESN || '원인 미상',
          casualties: null, // API에서 제공하지 않음
          // 추가 정보
          amount: parseFloat(item.AMOUNT) || 0, // 피해금액
          occuYear: item.OCCU_YEAR,
          occuMonth: item.OCCU_MT,
          occuDay: item.OCCU_DE,
          occuTime: item.OCCU_TM,
          endYear: item.END_YEAR,
          endMonth: item.END_MT,
          endDay: item.END_DE,
          endTime: item.END_TM,
          cityCode: item.CTPRVN_CD,
          districtCode: item.SGG_CD,
          // 원본 좌표 (디버깅용)
          originalX: longitude,
          originalY: latitude
        };
      } catch (error) {
        console.error('Error processing item:', error, item);
        return null;
      }
    }).filter(item => item !== null); // null 제거

    return wildfireData;

  } catch (error) {
    console.error('Error fetching wildfire data:', error);

    if (error.response) {
      // 서버 응답이 있는 경우
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      console.error('No response received:', error.request);
    } else {
      // 요청 설정 중 에러
      console.error('Error message:', error.message);
    }

    throw error;
  }
}

/**
 * 여러 페이지의 데이터를 모두 가져오기
 * @param {number} maxPages - 최대 페이지 수
 * @returns {Promise<Array>} 전체 산불 발생 이력 데이터
 */
export async function getAllWildfireData(maxPages = 5) {
  try {
    const allData = [];

    for (let page = 1; page <= maxPages; page++) {
      const data = await getWildfireData({ pageNo: page, numOfRows: 100 });

      if (data.length === 0) {
        // 더 이상 데이터가 없으면 중단
        break;
      }

      allData.push(...data);
    }

    console.log(`Total wildfire records fetched: ${allData.length}`);
    return allData;

  } catch (error) {
    console.error('Error fetching all wildfire data:', error);
    throw error;
  }
}

/**
 * 최근 산불 데이터만 가져오기 (연도별로 직접 요청)
 * @param {number} years - 최근 몇 년 (기본: 5년)
 * @returns {Promise<Array>} 최근 산불 데이터
 */
export async function getRecentWildfireData(years = 5) {
  try {
    const currentYear = new Date().getFullYear();
    const allData = [];

    console.log(`🔍 Fetching recent ${years} years data (${currentYear - years + 1}-${currentYear})`);

    // 최근 n년 동안 연도별로 데이터 요청
    for (let year = currentYear; year >= currentYear - years + 1; year--) {
      console.log(`📅 Fetching data for year ${year}...`);

      try {
        // 해당 연도의 모든 페이지 데이터 가져오기
        const yearData = await getWildfireDataByYear(year);
        console.log(`   ✓ ${year}: ${yearData.length}건`);
        allData.push(...yearData);
      } catch (error) {
        console.warn(`   ⚠️ ${year}: 데이터 없음 또는 오류`);
        // 해당 연도 데이터가 없어도 계속 진행
      }
    }

    console.log(`📊 Total recent wildfire records: ${allData.length}건`);

    // 최근 데이터가 없으면 전체 데이터 가져오기
    if (allData.length === 0) {
      console.warn('⚠️ No recent data found, fetching all available data...');
      return await getAllWildfireData(10); // 페이지 범위 확대
    }

    return allData;

  } catch (error) {
    console.error('Error fetching recent wildfire data:', error);
    throw error;
  }
}

/**
 * 특정 연도의 산불 데이터 가져오기
 * @param {number} year - 연도
 * @returns {Promise<Array>} 해당 연도 산불 데이터
 */
async function getWildfireDataByYear(year) {
  const yearData = [];

  // 해당 연도의 데이터를 페이지별로 가져오기 (최대 10페이지)
  for (let page = 1; page <= 10; page++) {
    try {
      const data = await getWildfireData({
        pageNo: page,
        numOfRows: 100,
        occuYear: year.toString() // 연도 필터 추가
      });

      if (data.length === 0) {
        // 더 이상 데이터가 없으면 중단
        break;
      }

      yearData.push(...data);
    } catch (error) {
      console.warn(`Error fetching page ${page} for year ${year}:`, error.message);
      break;
    }
  }

  return yearData;
}
