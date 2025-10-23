import { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const containerStyle = {
  width: '100%',
  height: '600px'
};

// 대한민국 중심 좌표
const center = {
  lat: 37.5,
  lng: 127.5
};

const WildfireMap = ({ wildfireData = [] }) => {
  const [selectedFire, setSelectedFire] = useState(null);
  const [map, setMap] = useState(null);
  const [showAreas, setShowAreas] = useState(true); // 면적 표시 토글
  const [showClusters, setShowClusters] = useState(true); // 클러스터링 토글
  const markersRef = useRef([]);
  const clustererRef = useRef(null);

  // 디버깅: 받은 데이터 확인
  console.log(`🗺️ WildfireMap received ${wildfireData.length} markers`);
  if (wildfireData.length > 0) {
    console.log('🗺️ First marker:', wildfireData[0]);
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  // 면적(ha)을 반지름(m)으로 변환
  // 1 ha = 10,000 m²
  // 원의 면적 = π * r²
  // r = sqrt(면적 / π)
  const areaToRadius = (areaInHa) => {
    const areaInM2 = areaInHa * 10000;
    return Math.sqrt(areaInM2 / Math.PI);
  };

  // 피해면적에 따른 색상 결정
  const getColorByArea = (area) => {
    if (area > 1000) return '#b91c1c'; // 매우 큼 (1000ha 이상) - 진한 빨강
    if (area > 100) return '#dc2626';  // 큼 (100-1000ha) - 빨강
    if (area > 50) return '#f97316';   // 중간 (50-100ha) - 주황
    if (area > 10) return '#fbbf24';   // 작음 (10-50ha) - 노랑
    return '#10b981';                  // 매우 작음 (10ha 미만) - 초록
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    // 클러스터러 정리
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current = null;
    }
    setMap(null);
  }, []);

  // 마커 클러스터링 설정 - 일단 비활성화
  // useEffect(() => {
  //   if (!map || !showClusters || wildfireData.length === 0) {
  //     return;
  //   }

  //   // 기존 클러스터러 제거
  //   if (clustererRef.current) {
  //     clustererRef.current.clearMarkers();
  //   }

  //   // 새 클러스터러 생성
  //   clustererRef.current = new MarkerClusterer({
  //     map,
  //     markers: markersRef.current,
  //   });

  //   return () => {
  //     if (clustererRef.current) {
  //       clustererRef.current.clearMarkers();
  //     }
  //   };
  // }, [map, wildfireData, showClusters]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">⚠️ 지도를 로드할 수 없습니다</div>
          <div className="text-sm text-gray-600">
            <p>Google Maps API 키를 확인해주세요.</p>
            <p className="mt-2">에러: {loadError.message}</p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-left">
              <p className="font-semibold mb-2">설정 방법:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>.env 파일을 열어주세요</li>
                <li>VITE_GOOGLE_MAPS_API_KEY에 발급받은 API 키를 입력하세요</li>
                <li>개발 서버를 재시작하세요</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">지도 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      {/* 컨트롤 버튼들 */}
      <div className="map-controls">
        <button
          onClick={() => setShowAreas(!showAreas)}
          className="toggle-area-btn"
          style={{ marginRight: '10px' }}
        >
          {showAreas ? '🔴 면적 숨기기' : '⚪ 면적 표시'}
        </button>
        <button
          onClick={() => setShowClusters(!showClusters)}
          className="toggle-area-btn"
        >
          {showClusters ? '📍 클러스터 ON' : '📍 클러스터 OFF'}
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {/* 마커 렌더링 디버깅 */}
        {console.log(`Rendering ${wildfireData.length} markers on map`)}
        {/* 피해 면적 원 표시 */}
        {showAreas && wildfireData.map((fire) => (
          <Circle
            key={`circle-${fire.id}`}
            center={{ lat: fire.latitude, lng: fire.longitude }}
            radius={areaToRadius(fire.area)}
            options={{
              fillColor: getColorByArea(fire.area),
              fillOpacity: 0.3,
              strokeColor: getColorByArea(fire.area),
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: true,
            }}
            onClick={() => setSelectedFire(fire)}
          />
        ))}

        {/* 중심점 마커 - 현재 비활성화됨 */}
        {false && wildfireData.map((fire, index) => {
          // 좌표 유효성 검사
          const lat = Number(fire.latitude);
          const lng = Number(fire.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            if (index < 5) console.warn(`Invalid coordinates for fire ${fire.id}:`, { lat, lng });
            return null;
          }

          if (index < 5) {
            console.log(`Rendering marker ${index}:`, {
              id: fire.id,
              lat: lat.toFixed(6),
              lng: lng.toFixed(6)
            });
          }

          return (
            <Marker
              key={fire.id}
              position={{ lat, lng }}
              onClick={() => setSelectedFire(fire)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: getColorByArea(fire.area),
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
              onLoad={(marker) => {
                markersRef.current[index] = marker;
                if (index < 5) console.log(`Marker ${index} loaded on map`);
              }}
            />
          );
        })}

        {/* 정보 창 */}
        {selectedFire && (
          <InfoWindow
            position={{ lat: selectedFire.latitude, lng: selectedFire.longitude }}
            onCloseClick={() => setSelectedFire(null)}
          >
            <div className="info-window">
              <h3 className="font-bold text-lg mb-2" style={{ color: getColorByArea(selectedFire.area) }}>
                {selectedFire.location}
              </h3>
              <p><strong>발생일:</strong> {selectedFire.date}</p>
              <p><strong>피해면적:</strong> <span className="text-red-600 font-bold">{selectedFire.area.toLocaleString()}ha</span></p>
              <p><strong>원인:</strong> {selectedFire.cause}</p>
              {selectedFire.casualties && (
                <p><strong>인명피해:</strong> {selectedFire.casualties}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                반경: {Math.round(areaToRadius(selectedFire.area)).toLocaleString()}m
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* 범례 */}
      <div className="map-legend">
        <h4 className="legend-title">피해면적 범례</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#b91c1c' }}></div>
            <span>1000ha 이상</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#dc2626' }}></div>
            <span>100-1000ha</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
            <span>50-100ha</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
            <span>10-50ha</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
            <span>10ha 미만</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildfireMap;
