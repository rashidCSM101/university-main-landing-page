import { useEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Globe, BarChart3, ShieldAlert, Sparkles, MapPin, Thermometer, CloudRain } from 'lucide-react';

interface Hotspot {
  title: string;
  latitude: number;
  longitude: number;
  category: string;
  color: number;
  description: string;
}

const climateHotspots: Hotspot[] = [
  { title: 'Indus Basin Flood Vulnerability Zone', latitude: 30.3753, longitude: 69.3451, category: 'Flood Risk', color: 0xEF4444, description: 'Monsoon convective extreme rainfall & flood attribution zone.' },
  { title: 'Hindu Kush Himalaya Glacial Melt', latitude: 35.9208, longitude: 74.308, category: 'Glacial Loss', color: 0x3B82F6, description: 'Rapid glacial retreat monitoring & GLOF hazard mapping.' },
  { title: 'Thar & Sindh Heatwave Corridor', latitude: 25.396, longitude: 68.3578, category: 'Extreme Heat', color: 0xF59E0B, description: 'Record-breaking summer heatwave & wet-bulb temp telemetry.' },
  { title: 'Ganges Delta Sea Level Monitoring', latitude: 22.5726, longitude: 88.3639, category: 'Coastal Risk', color: 0x8B5CF6, description: 'Cyclone storm surge & coastal erosion hazard assessment.' },
  { title: 'Balochistan Solar Energy Hub', latitude: 29.8304, longitude: 66.8906, category: 'Renewables', color: 0x10B981, description: 'High solar irradiance & clean energy feasibility mapping.' },
];

const climateAnomalyData = [
  { month: 'Jan', tempAnomaly: 1.2, precipitation: 45 },
  { month: 'Feb', tempAnomaly: 1.5, precipitation: 52 },
  { month: 'Mar', tempAnomaly: 2.1, precipitation: 38 },
  { month: 'Apr', tempAnomaly: 2.8, precipitation: 25 },
  { month: 'May', tempAnomaly: 3.4, precipitation: 18 },
  { month: 'Jun', tempAnomaly: 2.9, precipitation: 140 },
  { month: 'Jul', tempAnomaly: 2.6, precipitation: 310 },
  { month: 'Aug', tempAnomaly: 2.4, precipitation: 285 },
  { month: 'Sep', tempAnomaly: 2.2, precipitation: 165 },
  { month: 'Oct', tempAnomaly: 1.9, precipitation: 42 },
  { month: 'Nov', tempAnomaly: 1.4, precipitation: 22 },
  { month: 'Dec', tempAnomaly: 1.1, precipitation: 35 },
];

const ClimateMapChart = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'chart'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const mapChartDivRef = useRef<HTMLDivElement>(null);
  const xyChartDivRef  = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(climateHotspots[0]);

  // ─── Initialize amCharts 5 Interactive World Map ───────────────────────────
  useEffect(() => {
    if (activeTab !== 'map' || !mapChartDivRef.current) return;

    const root = am5.Root.new(mapChartDivRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'translateY',
        projection: am5map.geoMercator(),
        homeGeoPoint: { latitude: 28, longitude: 75 },
        homeZoomLevel: 3.5,
      })
    );

    // Map Polygon Series (Countries)
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x1E2A3B),
      stroke: am5.color(0x334155),
      strokeWidth: 0.8,
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0x0EA5E9),
    });

    // Point Series for Climate Hotspots
    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push((root, _series, dataItem) => {
      const data = dataItem.dataContext as Hotspot;

      const container = am5.Container.new(root, {
        cursorOverStyle: 'pointer',
      });

      const circle = container.children.push(
        am5.Circle.new(root, {
          radius: 8,
          fill: am5.color(data ? data.color : 0x0EA5E9),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          tooltipText: data ? `${data.title}\n[bold]${data.category}[/]\n${data.description}` : '',
        })
      );

      circle.events.on('click', () => {
        if (data) setSelectedHotspot(data);
      });

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Add hotspot data items
    climateHotspots.forEach((spot) => {
      pointSeries.pushDataItem({
        geometry: { type: 'Point', coordinates: [spot.longitude, spot.latitude] },
        dataContext: spot,
      } as any);
    });

    chart.set('zoomControl', am5map.ZoomControl.new(root, {}));
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [activeTab]);

  // ─── Initialize amCharts 5 Temperature & Anomaly Chart ─────────────────────
  useEffect(() => {
    if (activeTab !== 'chart' || !xyChartDivRef.current) return;

    const root = am5.Root.new(xyChartDivRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      })
    );

    const cursor = chart.set('cursor', am5xy.XYCursor.new(root, {}));
    cursor.lineY.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: 'month',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      })
    );
    xAxis.data.setAll(climateAnomalyData);

    const yAxisTemp = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );
    yAxisTemp.children.unshift(
      am5.Label.new(root, {
        text: 'Temp Anomaly (°C)',
        fill: am5.color(0xEF4444),
        fontWeight: '600',
        fontSize: 12,
      })
    );

    const yAxisRain = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
      })
    );
    yAxisRain.children.unshift(
      am5.Label.new(root, {
        text: 'Precipitation (mm)',
        fill: am5.color(0x0EA5E9),
        fontWeight: '600',
        fontSize: 12,
      })
    );

    const rainSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Precipitation (mm)',
        xAxis: xAxis,
        yAxis: yAxisRain,
        valueYField: 'precipitation',
        categoryXField: 'month',
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Rainfall: {valueY} mm',
        }),
      })
    );
    rainSeries.columns.template.setAll({
      fill: am5.color(0x0EA5E9),
      strokeOpacity: 0,
      cornerRadiusTL: 6,
      cornerRadiusTR: 6,
    });
    rainSeries.data.setAll(climateAnomalyData);

    const tempSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Temp Anomaly (°C)',
        xAxis: xAxis,
        yAxis: yAxisTemp,
        valueYField: 'tempAnomaly',
        categoryXField: 'month',
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Temp Anomaly: +{valueY}°C',
        }),
      })
    );
    tempSeries.strokes.template.setAll({
      strokeWidth: 3,
      stroke: am5.color(0xEF4444),
    });
    tempSeries.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: am5.color(0xEF4444),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
        }),
      })
    );
    tempSeries.data.setAll(climateAnomalyData);

    const legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [activeTab]);

  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden border-y border-gray-800">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 font-semibold text-xs uppercase tracking-wider">
                amCharts 5 Interactive Telemetry
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">
              Global &amp; South Asian <span className="text-teal-400">Climate Analytics</span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg mt-3 max-w-2xl">
              Explore real-time climate impact hotspots, monsoon telemetry, and temperature anomaly metrics powered by amCharts 5 visualization engine.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex bg-gray-800 p-1.5 rounded-xl border border-gray-700 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'map'
                  ? 'bg-teal-500 text-gray-950 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Interactive World Map</span>
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'chart'
                  ? 'bg-teal-500 text-gray-950 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Climate Anomaly Trends</span>
            </button>
          </div>
        </div>

        {/* Hazard Event Type Filter Tabs */}
        {activeTab === 'map' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex-shrink-0">
              Filter Hazards:
            </span>
            {['All', 'Flood Risk', 'Glacial Loss', 'Extreme Heat', 'Coastal Risk', 'Renewables'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const firstMatch = climateHotspots.find((h) => cat === 'All' || h.category === cat);
                  if (firstMatch) setSelectedHotspot(firstMatch);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-500 text-gray-950 shadow-md font-bold'
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Display Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Visualizer (amCharts 5 Canvas) */}
          <div className="lg:col-span-8 bg-gray-950/80 rounded-3xl border border-gray-800 p-6 shadow-2xl relative min-h-[480px]">
            {activeTab === 'map' ? (
              <div ref={mapChartDivRef} className="w-full h-[450px]" />
            ) : (
              <div ref={xyChartDivRef} className="w-full h-[450px]" />
            )}
          </div>

          {/* Hotspot & Telemetry Detail Sidebar */}
          <div className="lg:col-span-4 bg-gray-800/60 rounded-3xl border border-gray-700/80 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider mb-4">
                <ShieldAlert className="w-4 h-4" />
                <span>Hotspot Telemetry Details</span>
              </div>

              {selectedHotspot ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-white">{selectedHotspot.title}</h3>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex-shrink-0">
                      {selectedHotspot.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
                    {selectedHotspot.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-teal-400" />
                      <div>
                        <div className="text-[11px] text-gray-400">Coordinates</div>
                        <div className="text-xs font-bold text-white">
                          {selectedHotspot.latitude.toFixed(2)}°N, {selectedHotspot.longitude.toFixed(2)}°E
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 flex items-center gap-3">
                      <Thermometer className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-[11px] text-gray-400">Risk Severity</div>
                        <div className="text-xs font-bold text-amber-400">High / Critical</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Click any marker on the map to view detailed climate telemetry.</p>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-6 border-t border-gray-700/60">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Live Telemetry Feeds</div>
              <div className="flex items-center justify-between text-xs text-gray-300 bg-gray-900/60 px-4 py-3 rounded-xl border border-gray-800">
                <span className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-teal-400" />
                  <span>Monsoon Index</span>
                </span>
                <span className="font-bold text-teal-400">+14.2% Above Normal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClimateMapChart;
