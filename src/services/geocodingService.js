/**
 * Google Maps Geocoding Service
 * 주소 → WGS84 좌표 변환
 */

// 지오코딩 결과 캐시 (API 호출 최소화)
const geocodeCache = new Map();

/**
 * 주소를 WGS84 좌표로 변환
 * @param {string} address - 변환할 주소
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export async function geocodeAddress(address) {
  // 주소가 유효하지 않으면 null 반환
  if (!address || address === 'null' || address === '주소 정보 없음') {
    console.warn('Invalid address for geocoding:', address);
    return null;
  }

  // 캐시 확인
  if (geocodeCache.has(address)) {
    console.log('📍 Using cached coordinates for:', address);
    return geocodeCache.get(address);
  }

  try {
    // Google Maps Geocoding API 사용
    const geocoder = new window.google.maps.Geocoder();

    const result = await new Promise((resolve, reject) => {
      geocoder.geocode(
        {
          address: address,
          region: 'kr' // 한국으로 제한
        },
        (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            const location = results[0].geometry.location;
            const coords = {
              latitude: location.lat(),
              longitude: location.lng()
            };
            resolve(coords);
          } else if (status === 'ZERO_RESULTS') {
            console.warn('No results found for address:', address);
            resolve(null);
          } else if (status === 'OVER_QUERY_LIMIT') {
            console.error('Geocoding API quota exceeded');
            reject(new Error('OVER_QUERY_LIMIT'));
          } else {
            console.error('Geocoding failed:', status, address);
            resolve(null);
          }
        }
      );
    });

    // 캐시에 저장
    if (result) {
      geocodeCache.set(address, result);
      console.log('✓ Geocoded:', address, '→', result);
    }

    return result;
  } catch (error) {
    console.error('Error geocoding address:', address, error);
    return null;
  }
}

/**
 * 여러 주소를 배치로 지오코딩 (속도 제한 고려)
 * @param {Array<{id: number, address: string}>} addresses
 * @param {Function} progressCallback - 진행 상황 콜백
 * @returns {Promise<Map<number, {latitude: number, longitude: number}>>}
 */
export async function geocodeAddressesBatch(addresses, progressCallback) {
  const results = new Map();
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  for (let i = 0; i < addresses.length; i++) {
    const { id, address } = addresses[i];

    const coords = await geocodeAddress(address);
    if (coords) {
      results.set(id, coords);
    }

    // 진행 상황 업데이트
    if (progressCallback) {
      progressCallback({
        current: i + 1,
        total: addresses.length,
        percentage: Math.round(((i + 1) / addresses.length) * 100)
      });
    }

    // API 속도 제한 방지 (초당 최대 50건)
    if (i < addresses.length - 1) {
      await delay(25); // 25ms 지연 = 초당 40건
    }
  }

  return results;
}

/**
 * 로컬 스토리지에 캐시 저장
 */
export function saveGeocodeCache() {
  try {
    const cacheArray = Array.from(geocodeCache.entries());
    localStorage.setItem('geocodeCache', JSON.stringify(cacheArray));
    console.log(`💾 Saved ${cacheArray.length} geocoded addresses to cache`);
  } catch (error) {
    console.error('Error saving geocode cache:', error);
  }
}

/**
 * 로컬 스토리지에서 캐시 로드
 */
export function loadGeocodeCache() {
  try {
    const cached = localStorage.getItem('geocodeCache');
    if (cached) {
      const cacheArray = JSON.parse(cached);
      cacheArray.forEach(([address, coords]) => {
        geocodeCache.set(address, coords);
      });
      console.log(`📂 Loaded ${cacheArray.length} geocoded addresses from cache`);
    }
  } catch (error) {
    console.error('Error loading geocode cache:', error);
  }
}

/**
 * 캐시 초기화
 */
export function clearGeocodeCache() {
  geocodeCache.clear();
  localStorage.removeItem('geocodeCache');
  console.log('🗑️ Geocode cache cleared');
}

// 앱 시작 시 캐시 로드
if (typeof window !== 'undefined') {
  loadGeocodeCache();

  // 페이지 종료 시 캐시 저장
  window.addEventListener('beforeunload', saveGeocodeCache);
}
