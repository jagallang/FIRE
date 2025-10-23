/**
 * 산불 데이터 시각화 차트 컴포넌트
 * 연도별, 월별 산불 발생 통계
 */
import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const WildfireCharts = ({ data }) => {
  // 연도별 데이터 집계
  const yearlyData = useMemo(() => {
    const yearMap = new Map();

    data.forEach(fire => {
      const year = fire.date.substring(0, 4);
      if (!yearMap.has(year)) {
        yearMap.set(year, {
          count: 0,
          totalArea: 0,
          totalAmount: 0
        });
      }

      const yearData = yearMap.get(year);
      yearData.count += 1;
      yearData.totalArea += fire.area || 0;
      yearData.totalAmount += fire.amount || 0;
    });

    // 정렬된 연도 배열
    const years = Array.from(yearMap.keys()).sort();
    const counts = years.map(year => yearMap.get(year).count);
    const areas = years.map(year => yearMap.get(year).totalArea.toFixed(2));
    const amounts = years.map(year => yearMap.get(year).totalAmount);

    return { years, counts, areas, amounts };
  }, [data]);

  // 월별 데이터 집계
  const monthlyData = useMemo(() => {
    const monthMap = new Map();

    // 1-12월 초기화
    for (let i = 1; i <= 12; i++) {
      monthMap.set(i, {
        count: 0,
        totalArea: 0
      });
    }

    data.forEach(fire => {
      const month = parseInt(fire.date.substring(5, 7));
      const monthData = monthMap.get(month);
      if (monthData) {
        monthData.count += 1;
        monthData.totalArea += fire.area || 0;
      }
    });

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const counts = Array.from({ length: 12 }, (_, i) => monthMap.get(i + 1).count);
    const areas = Array.from({ length: 12 }, (_, i) => monthMap.get(i + 1).totalArea.toFixed(2));

    return { months, counts, areas };
  }, [data]);

  // 원인별 데이터 집계
  const causeData = useMemo(() => {
    const causeMap = new Map();

    data.forEach(fire => {
      const cause = fire.cause || '원인 미상';
      causeMap.set(cause, (causeMap.get(cause) || 0) + 1);
    });

    // 상위 10개 원인만 표시
    const sortedCauses = Array.from(causeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const labels = sortedCauses.map(([cause]) => cause);
    const counts = sortedCauses.map(([, count]) => count);

    return { labels, counts };
  }, [data]);

  // 차트 색상
  const colors = {
    primary: 'rgba(239, 68, 68, 0.8)',      // red-500
    secondary: 'rgba(249, 115, 22, 0.8)',   // orange-500
    tertiary: 'rgba(234, 179, 8, 0.8)',     // yellow-500
    success: 'rgba(34, 197, 94, 0.8)',      // green-500
  };

  // 연도별 발생 건수 차트
  const yearlyCountChart = {
    labels: yearlyData.years,
    datasets: [
      {
        label: '산불 발생 건수',
        data: yearlyData.counts,
        backgroundColor: colors.primary,
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 연도별 피해 면적 차트
  const yearlyAreaChart = {
    labels: yearlyData.years,
    datasets: [
      {
        label: '피해 면적 (ha)',
        data: yearlyData.areas,
        backgroundColor: colors.secondary,
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // 월별 발생 건수 차트
  const monthlyCountChart = {
    labels: monthlyData.months,
    datasets: [
      {
        label: '산불 발생 건수',
        data: monthlyData.counts,
        backgroundColor: colors.primary,
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 월별 피해 면적 차트
  const monthlyAreaChart = {
    labels: monthlyData.months,
    datasets: [
      {
        label: '피해 면적 (ha)',
        data: monthlyData.areas,
        backgroundColor: colors.tertiary,
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  // 원인별 차트 (파이 차트)
  const causeChart = {
    labels: causeData.labels,
    datasets: [
      {
        label: '발생 건수',
        data: causeData.counts,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(249, 115, 22, 0.8)',  // orange
          'rgba(234, 179, 8, 0.8)',   // yellow
          'rgba(34, 197, 94, 0.8)',   // green
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(168, 85, 247, 0.8)',  // purple
          'rgba(236, 72, 153, 0.8)',  // pink
          'rgba(20, 184, 166, 0.8)',  // teal
          'rgba(245, 158, 11, 0.8)',  // amber
          'rgba(156, 163, 175, 0.8)', // gray
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: false,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* 연도별 통계 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📅 연도별 산불 통계</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">발생 건수</h4>
            <div style={{ height: '300px' }}>
              <Bar data={yearlyCountChart} options={chartOptions} />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">피해 면적</h4>
            <div style={{ height: '300px' }}>
              <Line data={yearlyAreaChart} options={lineChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* 월별 통계 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📆 월별 산불 통계</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">월별 발생 건수</h4>
            <div style={{ height: '300px' }}>
              <Bar data={monthlyCountChart} options={chartOptions} />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-700">월별 피해 면적</h4>
            <div style={{ height: '300px' }}>
              <Line data={monthlyAreaChart} options={lineChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* 원인별 통계 */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">🔍 원인별 산불 통계 (상위 10개)</h3>
        <div className="flex justify-center">
          <div style={{ height: '400px', width: '100%', maxWidth: '600px' }}>
            <Pie data={causeChart} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WildfireCharts;
