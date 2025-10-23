/**
 * 좌표 변환 유틸리티 (proj4 라이브러리 사용)
 * 산림청 API 좌표계 → WGS84 (위도/경도)
 *
 * 참고: 산림청 API는 다양한 TM 좌표계를 사용할 수 있음
 * Google Maps는 WGS84 좌표계(EPSG:4326)를 사용
 */
import proj4 from 'proj4';

// 다양한 한국 좌표계 정의
proj4.defs([
  // Custom: 산림청 API 좌표계 (실제 데이터 기반 역산)
  // 군산(126.71°E, 35.97°N) 기준으로 중심점 조정
  // 변환 결과: 128.99°E, 40.61°N → 목표: 126.71°E, 35.97°N
  // 차이: 경도 -2.28°, 위도 -4.64°
  ['CUSTOM:KFS_ADJUSTED', '+proj=tmerc +lat_0=32.8 +lon_0=125.2 +k=1 +x_0=14000000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs'],

  // EPSG:5179 센티미터 단위 (10배 확대)
  ['EPSG:5179-CM', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=10000000 +y_0=20000000 +ellps=GRS80 +units=cm +no_defs'],

  // EPSG:5179 - Korea 2000 / Unified CS (가장 일반적)
  ['EPSG:5179', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs'],

  // EPSG:5186 - Korea 2000 / Central Belt 2010
  ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs'],

  // EPSG:5174 - Korea 2000 / Central Belt (구)
  ['EPSG:5174', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43'],

  // Custom: 직접 계산된 offset 좌표계
  ['CUSTOM:KFS1', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=14000000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs'],

  // Custom: EPSG:5179 기반 센티미터 변형
  ['CUSTOM:KFS2', '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=14000000 +y_0=4000000 +ellps=GRS80 +units=m +no_defs'],
]);

// WGS84 좌표계
const WGS84 = 'EPSG:4326';

/**
 * 다양한 좌표계로 변환을 시도하고 가장 적합한 결과를 반환
 * @param {number} x - X 좌표
 * @param {number} y - Y 좌표
 * @returns {{latitude: number, longitude: number}} WGS84 경위도
 */
export function tmToWgs84(x, y) {
  console.log('🔄 tmToWgs84 호출됨:', { x, y });

  // 좌표가 유효하지 않으면 기본 좌표 반환
  if (!x || !y || isNaN(x) || isNaN(y)) {
    console.warn('❌ Invalid coordinates:', { x, y });
    return { latitude: 36.5, longitude: 127.5 }; // 대한민국 중심
  }

  try {
    // 시도할 좌표계 목록 (우선순위 순)
    const projections = [
      { name: 'CUSTOM:KFS_ADJUSTED', desc: '산림청 API (조정됨)' },
      { name: 'CUSTOM:KFS1', desc: 'Custom offset (x_0=14M, y_0=4M)' },
      { name: 'CUSTOM:KFS2', desc: 'EPSG:5179 변형 (x_0=14M, y_0=4M)' },
      { name: 'EPSG:5179-CM', desc: 'EPSG:5179 센티미터 단위' },
      { name: 'EPSG:5179', desc: 'Korea 2000 Unified CS' },
      { name: 'EPSG:5186', desc: 'Korea 2000 Central Belt 2010' },
      { name: 'EPSG:5174', desc: 'Korea 2000 Central Belt (old)' },
    ];

    let bestResult = null;
    let bestProjection = null;
    const results = [];

    for (const projection of projections) {
      try {
        const result = proj4(projection.name, WGS84, [x, y]);
        const [longitude, latitude] = result;

        // 결과 저장 (디버깅용)
        results.push({
          projection: projection.desc,
          latitude,
          longitude,
          valid: latitude >= 33 && latitude <= 43 && longitude >= 124 && longitude <= 132
        });

        // 대한민국 영역 내에 있는지 확인 (33~43°N, 124~132°E)
        if (latitude >= 33 && latitude <= 43 && longitude >= 124 && longitude <= 132) {
          bestResult = { latitude, longitude };
          bestProjection = projection;
          break; // 첫 번째로 유효한 결과 사용
        }
      } catch (error) {
        // 이 좌표계로는 변환 실패, 다음 시도
        results.push({
          projection: projection.desc,
          error: error.message
        });
        continue;
      }
    }

    if (bestResult) {
      console.log(`✓ 좌표 변환 성공 (${bestProjection.desc}):`, {
        input: { x, y },
        output: bestResult
      });
      return bestResult;
    }

    // 모든 좌표계로 변환 실패 시, 결과 출력하고 기본값 반환
    console.warn('⚠️ 좌표 변환 실패 - 모든 변환 결과:', {
      input: { x, y },
      results
    });
    return { latitude: 36.5, longitude: 127.5 };

  } catch (error) {
    console.error('좌표 변환 오류:', error);
    return { latitude: 36.5, longitude: 127.5 };
  }
}

/**
 * 여러 TM 좌표를 WGS84로 변환
 */
export function convertBatchTmToWgs84(coordinates) {
  return coordinates.map(({ x, y, ...rest }) => ({
    ...rest,
    ...tmToWgs84(x, y)
  }));
}
