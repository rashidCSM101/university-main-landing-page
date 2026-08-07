import { useEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { Globe, BarChart3, Sparkles, MapPin, Thermometer, FolderGit2, CheckCircle2 } from 'lucide-react';

interface CountryProject {
  title: string;
  sector: string;
  status: string;
}

interface Hotspot {
  id: string;
  title: string;
  country: string;
  latitude: number;
  longitude: number;
  category: string;
  color: number;
  description: string;
  projectCount: number;
  projects: CountryProject[];
}

const climateHotspots: Hotspot[] = [
  {
    id: 'pk-hotspot',
    title: 'Indus Basin & HKH Cryosphere',
    country: 'Pakistan',
    latitude: 30.3753,
    longitude: 69.3451,
    category: 'Flood & GLOF Risk',
    color: 0x48b302,
    description: 'Monsoon convective extreme rainfall attribution, Indus flood modeling, and HKH glacial retreat monitoring.',
    projectCount: 5,
    projects: [
      { title: 'Indus Monsoon Extreme Rainfall Attribution', sector: 'Atmospheric Physics', status: 'Active' },
      { title: 'Hindu Kush Himalaya Glacial Lake Flood (GLOF) Alert System', sector: 'Cryosphere', status: 'Active' },
      { title: 'Thar & Sindh Urban Wet-Bulb Heat Telemetry', sector: 'Thermal Risk', status: 'Active' },
      { title: 'National Climate Vulnerability Assessment for NDMA', sector: 'Policy Governance', status: 'Active' },
      { title: 'Balochistan Solar Radiation & Clean Energy Mapping', sector: 'Renewable Energy', status: 'Active' },
    ],
  },
  {
    id: 'in-hotspot',
    title: 'Ganges Basin & Northern Plains',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    category: 'Hydro-Meteorology',
    color: 0x3B82F6,
    description: 'Ganges river basin flood reanalysis, agricultural drought modeling, and urban heat island telemetry.',
    projectCount: 4,
    projects: [
      { title: 'Ganges River Basin Hydro-meteorological Flood Reanalysis', sector: 'Hydrology', status: 'Active' },
      { title: 'Bay of Bengal Cyclonic Storm Surge Telemetry', sector: 'Coastal Risk', status: 'Active' },
      { title: 'North-Western Agricultural Drought & Moisture Mapping', sector: 'Agri-Climate', status: 'Active' },
      { title: 'Urban Heat Island & Thermal Comfort Telemetry', sector: 'Urban Heat', status: 'Active' },
    ],
  },
  {
    id: 'bd-hotspot',
    title: 'Meghna Delta & Coastal Bay',
    country: 'Bangladesh',
    latitude: 23.685,
    longitude: 90.3563,
    category: 'Coastal Resilience',
    color: 0x8B5CF6,
    description: 'Brahmaputra delta coastal erosion, cyclone inundation risk, and mangrove climate adaptation.',
    projectCount: 4,
    projects: [
      { title: 'Meghna & Brahmaputra Delta Coastal Erosion Telemetry', sector: 'Coastal Engineering', status: 'Active' },
      { title: 'Cyclonic Windfield Risk & Inundation Mapping', sector: 'Disaster Risk', status: 'Active' },
      { title: 'Sundarbans Mangrove Climate Resilience Assessment', sector: 'Ecosystems', status: 'Active' },
      { title: 'Salinity Intrusion Telemetry in Coastal Aquifers', sector: 'Water Security', status: 'Active' },
    ],
  },
  {
    id: 'np-hotspot',
    title: 'Himalayan High Altitude',
    country: 'Nepal',
    latitude: 28.3949,
    longitude: 84.124,
    category: 'Glacial & Mountain Risk',
    color: 0xF59E0B,
    description: 'High-altitude hydro-meteorological stations, Imja glacial lake hazard mapping, and orographic precipitation.',
    projectCount: 3,
    projects: [
      { title: 'Imja Glacial Lake Outburst Flood (GLOF) Modeling', sector: 'Glaciology', status: 'Active' },
      { title: 'Trans-Himalayan WRF Orographic Precipitation Dynamics', sector: 'Meteorology', status: 'Active' },
      { title: 'High-Altitude Hydro-Meteorological Station Telemetry', sector: 'Sensors', status: 'Active' },
    ],
  },
  {
    id: 'lk-hotspot',
    title: 'Indian Ocean Coastal Zone',
    country: 'Sri Lanka & Maldives',
    latitude: 7.8731,
    longitude: 80.7718,
    category: 'Marine & Ocean Risk',
    color: 0x10B981,
    description: 'South-west monsoon wave dynamics, island sea level rise risk assessment, and coral reef thermal telemetry.',
    projectCount: 3,
    projects: [
      { title: 'South-West Monsoon Coastal Wave Dynamics Modeling', sector: 'Oceanography', status: 'Active' },
      { title: 'Atoll Sea Level Rise Risk Assessment & Coral Protection', sector: 'Marine Science', status: 'Active' },
      { title: 'Tropical Cyclonic Rainfall Attribution & Forecasting', sector: 'Attribution', status: 'Active' },
    ],
  },
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

export const ClimateMapChart = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'chart'>('map');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const mapChartDivRef = useRef<HTMLDivElement>(null);
  const xyChartDivRef = useRef<HTMLDivElement>(null);

  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(climateHotspots[0]);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // ─── Initialize amCharts 5 Interactive World Map ───────────────────────────
  useEffect(() => {
    if (activeTab !== 'map' || !mapChartDivRef.current) return;

    const root = am5.Root.new(mapChartDivRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'rotateY',
        projection: am5map.geoOrthographic(),
        homeGeoPoint: { latitude: 25, longitude: 78 },
      })
    );

    // Ocean background polygon for realistic 3D Globe sphere
    const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x071328),
      fillOpacity: 0.95,
      strokeOpacity: 0,
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    // Continuous 3D Auto-Rotation Loop
    let rotationAnimation: any = null;
    const startAutoRotation = () => {
      rotationAnimation = chart.animate({
        key: 'rotationX',
        from: chart.get('rotationX', 0),
        to: chart.get('rotationX', 0) + 360,
        duration: 40000,
        loops: Infinity,
        easing: am5.ease.linear,
      });
    };
    startAutoRotation();

    // Pause on user interaction
    chart.chartContainer.events.on('pointerdown', () => {
      if (rotationAnimation) rotationAnimation.stop();
    });
    chart.chartContainer.events.on('globalpointerup', () => {
      startAutoRotation();
    });

    // Track pointer position globally on map canvas for instant popup alignment
    chart.chartContainer.events.on('globalpointermove', (ev) => {
      if (ev.point) {
        setTooltipPos({ x: ev.point.x, y: ev.point.y });
      } else if (ev.originalEvent) {
        const bounds = mapChartDivRef.current?.getBoundingClientRect();
        if (bounds) {
          setTooltipPos({
            x: ev.originalEvent.clientX - bounds.left,
            y: ev.originalEvent.clientY - bounds.top,
          });
        }
      }
    });

    // Map Polygon Series (Countries)
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x112240),
      stroke: am5.color(0x1E3A8A),
      strokeWidth: 0.8,
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0x48b302),
      fillOpacity: 0.45,
    });

    // Map country ISO codes and names to Hotspot data
    const countryMap: Record<string, Hotspot> = {
      PK: climateHotspots[0],
      Pakistan: climateHotspots[0],
      IN: climateHotspots[1],
      India: climateHotspots[1],
      BD: climateHotspots[2],
      Bangladesh: climateHotspots[2],
      NP: climateHotspots[3],
      Nepal: climateHotspots[3],
      LK: climateHotspots[4],
      'Sri Lanka': climateHotspots[4],
    };

    polygonSeries.mapPolygons.template.events.on('pointerover', (ev) => {
      const ctx = ev.target.dataItem?.dataContext as any;
      if (ctx && (countryMap[ctx.id] || countryMap[ctx.name])) {
        const matched = countryMap[ctx.id] || countryMap[ctx.name];
        setHoveredHotspot(matched);
        setSelectedHotspot(matched);
      } else {
        setHoveredHotspot(null);
      }
    });

    polygonSeries.mapPolygons.template.events.on('pointerout', () => {
      setHoveredHotspot(null);
    });

    // Point Series for Climate Hotspots & Projects
    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push((root, _series, dataItem) => {
      const data = dataItem.dataContext as Hotspot;

      const container = am5.Container.new(root, {
        cursorOverStyle: 'pointer',
      });

      const outerPulse = container.children.push(
        am5.Circle.new(root, {
          radius: 14,
          fill: am5.color(data ? data.color : 0x48b302),
          fillOpacity: 0.25,
        })
      );

      const circle = container.children.push(
        am5.Circle.new(root, {
          radius: 8,
          fill: am5.color(data ? data.color : 0x48b302),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
        })
      );

      // Pulse animation
      outerPulse.animate({
        key: 'scale',
        from: 1,
        to: 1.8,
        duration: 1800,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.cubic),
      });

      outerPulse.animate({
        key: 'opacity',
        from: 0.6,
        to: 0,
        duration: 1800,
        loops: Infinity,
        easing: am5.ease.out(am5.ease.cubic),
      });

      // Hover events to show IPCC-style floating callout card
      container.events.on('pointerover', () => {
        if (data) {
          setHoveredHotspot(data);
          setSelectedHotspot(data);
        }
      });

      container.events.on('pointerout', () => {
        setHoveredHotspot(null);
      });

      circle.events.on('click', () => {
        if (data) {
          setSelectedHotspot(data);
          setHoveredHotspot(data);
        }
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
        fill: am5.color(0x48b302),
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
      fill: am5.color(0x48b302),
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

  const displayHotspot = hoveredHotspot || selectedHotspot;

  return (
    <section className="py-24 bg-[#071328] text-white relative overflow-hidden border-y border-gray-800">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#48b302]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#48b302]/10 border border-[#48b302]/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-[#48b302]" />
              <span className="text-[#48b302] font-semibold text-xs uppercase tracking-wider">
                3D Interactive Project Hotspots
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">
              Global &amp; South Asian <span className="text-[#48b302]">Climate Telemetry</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg mt-3 max-w-2xl font-light">
              Explore our active climate attribution projects, regional flood monitoring, and high-resolution WRF modeling hubs across South Asia. Hover over any pin to view active projects.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex bg-gray-900/90 p-1.5 rounded-2xl border border-gray-800 self-start md:self-auto backdrop-blur-md">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-[#48b302] text-gray-950 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Interactive 3D Globe</span>
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'chart'
                  ? 'bg-[#48b302] text-gray-950 shadow-lg'
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
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 flex-shrink-0">
              Filter Region / Sector:
            </span>
            {['All', 'Flood & GLOF Risk', 'Hydro-Meteorology', 'Coastal Resilience', 'Glacial & Mountain Risk', 'Marine & Ocean Risk'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  const firstMatch = climateHotspots.find((h) => cat === 'All' || h.category === cat);
                  if (firstMatch) {
                    setSelectedHotspot(firstMatch);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#48b302] text-gray-950 shadow-md font-bold'
                    : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Main 3D Globe & Callout Sidebar Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* 3D Globe Canvas Container */}
          <div className="lg:col-span-8 bg-[#0B1E3D]/80 rounded-3xl border border-gray-800 p-6 shadow-2xl relative min-h-[500px]">
            {activeTab === 'map' ? (
              <div className="relative w-full h-full">
                <div ref={mapChartDivRef} className="w-full h-[470px] rounded-2xl overflow-hidden" />

                {/* IPCC-Style Hover Callout Speech Bubble (Auto-flips below pin if near top boundary) */}
                {hoveredHotspot && (
                  (() => {
                    const isNearTop = (tooltipPos?.y || 300) < 230;
                    return (
                      <div
                        className={`absolute z-50 pointer-events-none transform -translate-x-1/2 transition-all duration-150 ${
                          isNearTop ? 'mt-3' : '-translate-y-full mb-3'
                        }`}
                        style={{
                          left: tooltipPos ? Math.max(160, Math.min(tooltipPos.x, (mapChartDivRef.current?.clientWidth || 600) - 160)) : 300,
                          top: tooltipPos ? (isNearTop ? tooltipPos.y + 16 : tooltipPos.y - 12) : 220,
                        }}
                      >
                        <div className="relative bg-sky-600/95 text-white p-5 rounded-2xl shadow-2xl border border-sky-300/50 backdrop-blur-xl w-[320px]">
                          {/* Triangle Pointer Arrow (Flips dynamically) */}
                          {isNearTop ? (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-sky-600/95" />
                          ) : (
                            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-sky-600/95" />
                          )}

                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                              {hoveredHotspot.country}
                            </span>
                            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                              <FolderGit2 className="w-3.5 h-3.5" />
                              <span>{hoveredHotspot.projectCount} Active Projects</span>
                            </span>
                          </div>

                          <h4 className="font-heading font-bold text-base text-white mb-2 leading-snug">
                            {hoveredHotspot.title}
                          </h4>

                          <p className="text-xs text-sky-100 font-light leading-relaxed mb-3">
                            {hoveredHotspot.description}
                          </p>

                          <div className="border-t border-white/20 pt-2.5 space-y-1.5">
                            <div className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">Active Regional Projects:</div>
                            {hoveredHotspot.projects.slice(0, 3).map((p, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-white">
                                <CheckCircle2 className="w-3 h-3 text-emerald-300 flex-shrink-0 mt-0.5" />
                                <span className="truncate">{p.title}</span>
                              </div>
                            ))}
                            {hoveredHotspot.projects.length > 3 && (
                              <div className="text-[10px] text-sky-200 font-medium pt-0.5">
                                + {hoveredHotspot.projects.length - 3} more projects in {hoveredHotspot.country}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : (
              <div ref={xyChartDivRef} className="w-full h-[470px]" />
            )}
          </div>

          {/* Hotspot & Country Projects Detail Sidebar */}
          <div className="lg:col-span-4 bg-[#0B1E3D]/80 rounded-3xl border border-gray-800 p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2 text-[#48b302] font-semibold text-xs uppercase tracking-wider">
                  <FolderGit2 className="w-4 h-4 text-[#48b302]" />
                  <span>Country Projects Telemetry</span>
                </div>

                {displayHotspot && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#48b302]/20 text-[#48b302] border border-[#48b302]/40">
                    {displayHotspot.country} • {displayHotspot.projectCount} Projects
                  </span>
                )}
              </div>

              {displayHotspot ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{displayHotspot.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{displayHotspot.description}</p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Active Projects List ({displayHotspot.projects.length})</span>
                      <span className="text-[#48b302]">100% Operational</span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                      {displayHotspot.projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 hover:border-[#48b302]/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#48b302]">
                              {proj.sector}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300">
                              {proj.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-white leading-snug">{proj.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Hover over or click any marker on the globe to view active projects.</p>
              )}
            </div>

            {/* Bottom Coordinates & Telemetry Bar */}
            {displayHotspot && (
              <div className="mt-6 pt-5 border-t border-gray-800 grid grid-cols-2 gap-3">
                <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#48b302]" />
                  <div>
                    <div className="text-[10px] text-gray-400">Coordinates</div>
                    <div className="text-xs font-bold text-white">
                      {displayHotspot.latitude.toFixed(2)}°N, {displayHotspot.longitude.toFixed(2)}°E
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/80 p-3 rounded-2xl border border-gray-800 flex items-center gap-2.5">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-gray-400">Severity</div>
                    <div className="text-xs font-bold text-amber-400">High / Critical</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClimateMapChart;
