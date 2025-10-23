import WildfireCharts from './WildfireCharts';

const Statistics = ({ wildfireData = [] }) => {
  const totalFires = wildfireData.length;
  const totalArea = wildfireData.reduce((sum, fire) => sum + (fire.area || 0), 0);
  const currentYear = new Date().getFullYear();
  const thisYearFires = wildfireData.filter(fire =>
    new Date(fire.date).getFullYear() === currentYear
  ).length;

  const causeStats = wildfireData.reduce((acc, fire) => {
    acc[fire.cause] = (acc[fire.cause] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">산불 통계</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <p className="text-sm text-gray-600">총 산불 건수</p>
          <p className="text-3xl font-bold text-red-600">{totalFires}건</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <p className="text-sm text-gray-600">총 피해면적</p>
          <p className="text-3xl font-bold text-orange-600">{totalArea.toFixed(1)}ha</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">올해 산불 건수</p>
          <p className="text-3xl font-bold text-yellow-600">{thisYearFires}건</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">원인별 통계</h3>
        <div className="space-y-2">
          {Object.entries(causeStats).map(([cause, count]) => (
            <div key={cause} className="flex justify-between items-center">
              <span className="text-gray-700">{cause}</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {count}건
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 차트 추가 */}
      <div className="mt-6">
        <WildfireCharts data={wildfireData} />
      </div>
    </div>
  );
};

export default Statistics;
