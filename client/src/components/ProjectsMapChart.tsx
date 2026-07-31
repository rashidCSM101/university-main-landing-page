import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import {
  Globe2,
  FolderKanban,
  Building2,
  Calendar,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export interface CountryProjectData {
  id: string;
  countryName: string;
  isoCode: string;
  flagEmoji: string;
  projectCount: number;
  exposureRating: 'Extreme' | 'High' | 'Moderate';
  primaryFocus: string;
  leadPartner: string;
  projects: {
    id: string;
    title: string;
    funder: string;
    status: 'active' | 'completed' | 'upcoming';
    dates: string;
    description: string;
    keyDeliverable: string;
  }[];
}

const countryProjectsRegistry: Record<string, CountryProjectData> = {
  PK: {
    id: 'PK',
    countryName: 'Pakistan',
    isoCode: 'PK',
    flagEmoji: '🇵🇰',
    projectCount: 5,
    exposureRating: 'Extreme',
    primaryFocus: 'Indus Basin Flood Attribution & GLOF Early Warning',
    leadPartner: 'National Disaster Management Authority (NDMA) & PMD',
    projects: [
      {
        id: 'pk-1',
        title: 'Indus Basin Monsoon Extreme Precipitation & Flood Attribution',
        funder: 'Asian Development Bank (ADB) & EU',
        status: 'active',
        dates: '2025 – 2027',
        description: 'Attributing climate change drivers to extreme monsoon convective rainfall over upper and lower Indus catchments.',
        keyDeliverable: 'High-resolution flood hazard mapping & policy response framework.',
      },
      {
        id: 'pk-2',
        title: 'Hindu Kush Himalaya Glacial Retreat & GLOF Risk Mapping',
        funder: 'World Climate Research Programme (WCRP)',
        status: 'active',
        dates: '2024 – 2027',
        description: 'Remote sensing satellite telemetry monitoring 3,000+ glacial lakes across Gilgit-Baltistan & KPK.',
        keyDeliverable: 'Real-time GLOF outburst risk hydrographs for mountain valleys.',
      },
      {
        id: 'pk-3',
        title: 'Urban Heatwave Vulnerability & Wet-Bulb Stress Index in Sindh',
        funder: 'NDMA & PMD Pakistan',
        status: 'completed',
        dates: '2024 – 2025',
        description: 'Quantifying humid heatwave wet-bulb temperature thresholds in Karachi, Hyderabad, and Larkana.',
        keyDeliverable: 'Municipal heat emergency response protocols & green canopy targets.',
      },
      {
        id: 'pk-4',
        title: 'Balochistan Wind & Solar Irradiance Clean Energy Atlas',
        funder: 'ADB Clean Energy Fund',
        status: 'upcoming',
        dates: '2026 – 2028',
        description: 'Mapping atmospheric renewable energy potential and wind/solar grid integration limits.',
        keyDeliverable: 'Open-access clean energy GIS atlas for power grid developers.',
      },
    ],
  },
  BD: {
    id: 'BD',
    countryName: 'Bangladesh',
    isoCode: 'BD',
    flagEmoji: '🇧🇩',
    projectCount: 2,
    exposureRating: 'Extreme',
    primaryFocus: 'Ganges Delta Storm Surge & Coastal Resilience',
    leadPartner: 'Bangladesh Meteorological Department (BMD)',
    projects: [
      {
        id: 'bd-1',
        title: 'Ganges-Brahmaputra Coastal Storm Surge Telemetry',
        funder: 'European Union Climate Action',
        status: 'active',
        dates: '2024 – 2026',
        description: 'High-resolution hydrodynamic modeling of tropical cyclone storm surges along the Bay of Bengal coastline.',
        keyDeliverable: 'Early warning coastal inundation maps for mangrove delta zones.',
      },
      {
        id: 'bd-2',
        title: 'Sundarbans Salinity Intrusion & Agricultural Adaptation',
        funder: 'Global Environment Facility (GEF)',
        status: 'completed',
        dates: '2023 – 2025',
        description: 'Assessing sea level rise impact on soil salinity and salt-tolerant rice crop cultivars.',
        keyDeliverable: 'Community adaptive farming toolkits and salinity sensor networks.',
      },
    ],
  },
  NP: {
    id: 'NP',
    countryName: 'Nepal',
    isoCode: 'NP',
    flagEmoji: '🇳🇵',
    projectCount: 2,
    exposureRating: 'High',
    primaryFocus: 'High-Altitude Hydrological Telemetry & Transboundary Rivers',
    leadPartner: 'ICIMOD & Department of Hydrology Nepal',
    projects: [
      {
        id: 'np-1',
        title: 'Transboundary Koshi & Gandaki River Basin Telemetry',
        funder: 'ICIMOD & Swiss Development Cooperation',
        status: 'active',
        dates: '2025 – 2027',
        description: 'Installing real-time streamflow gauges and precipitation telemetry across high Himalayan river headwaters.',
        keyDeliverable: 'Cross-border flash flood early warning communication protocol.',
      },
    ],
  },
  LK: {
    id: 'LK',
    countryName: 'Sri Lanka',
    isoCode: 'LK',
    flagEmoji: '🇱🇰',
    projectCount: 1,
    exposureRating: 'High',
    primaryFocus: 'Indian Ocean Tropical Cyclone & Marine Climate Impact',
    leadPartner: 'Department of Meteorology Sri Lanka',
    projects: [
      {
        id: 'lk-1',
        title: 'South Asian Coastal Ecosystem Risk & Coral Bleaching',
        funder: 'UN Environment Programme (UNEP)',
        status: 'active',
        dates: '2024 – 2026',
        description: 'Monitoring sea surface temperature anomalies and coral bleaching alerts in the southern Indian Ocean.',
        keyDeliverable: 'Marine heatwave alert telemetry & coral reef protection atlas.',
      },
    ],
  },
  DE: {
    id: 'DE',
    countryName: 'Germany',
    isoCode: 'DE',
    flagEmoji: '🇩🇪',
    projectCount: 1,
    exposureRating: 'Moderate',
    primaryFocus: 'Global Climate Modeling & Supercomputing Exchange',
    leadPartner: 'Potsdam Institute for Climate Impact Research (PIK)',
    projects: [
      {
        id: 'de-1',
        title: 'German-Pakistan Atmospheric Physics & Supercomputing Exchange',
        funder: 'German Academic Exchange Service (DAAD) & DFG',
        status: 'active',
        dates: '2024 – 2027',
        description: 'Joint high-resolution Earth System Model (ESM) atmospheric simulations for South Asian monsoon dynamics.',
        keyDeliverable: 'High-performance computing cluster data pipeline & visiting scientist program.',
      },
    ],
  },
  GB: {
    id: 'GB',
    countryName: 'United Kingdom',
    isoCode: 'GB',
    flagEmoji: '🇬🇧',
    projectCount: 1,
    exposureRating: 'Moderate',
    primaryFocus: 'World Weather Attribution Science Partnership',
    leadPartner: 'UK Met Office & Imperial College London',
    projects: [
      {
        id: 'gb-1',
        title: 'Rapid Extreme Event Attribution Science Protocol',
        funder: 'UK Foreign, Commonwealth & Development Office (FCDO)',
        status: 'active',
        dates: '2023 – 2026',
        description: 'Rapid attribution analysis within 7 days of extreme heatwave or flood events in South Asia.',
        keyDeliverable: 'Peer-reviewed rapid attribution studies and climate communication briefs.',
      },
    ],
  },
  US: {
    id: 'US',
    countryName: 'United States',
    isoCode: 'US',
    flagEmoji: '🇺🇸',
    projectCount: 1,
    exposureRating: 'Moderate',
    primaryFocus: 'NASA & NOAA Earth Observation Satellite Integration',
    leadPartner: 'NASA SERVIR & NOAA Earth System Research Lab',
    projects: [
      {
        id: 'us-1',
        title: 'NASA Earth Observation Telemetry & MODIS Vegetation Health',
        funder: 'NASA SERVIR Global Initiative',
        status: 'active',
        dates: '2024 – 2027',
        description: 'Ingesting NASA TERRA/AQUA satellite data streams for Indus Basin drought and soil moisture monitoring.',
        keyDeliverable: 'Daily satellite vegetation health index and drought risk telemetry API.',
      },
    ],
  },
};

const ProjectsMapChart = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryProjectData>(countryProjectsRegistry['PK']);

  useEffect(() => {
    if (!mapDivRef.current) return;

    // Create root element
    const root = am5.Root.new(mapDivRef.current);
    root._logo?.dispose();
    root.setThemes([am5themes_Animated.new(root)]);

    // Create Map Chart
    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'translateY',
        projection: am5map.geoMercator(),
        homeGeoPoint: { latitude: 25, longitude: 70 },
        homeZoomLevel: 3,
        minZoomLevel: 1,
        maxZoomLevel: 12,
      })
    );

    // Create Polygon Series for World Map
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ'], // Exclude Antarctica for cleaner presentation
      })
    );

    // Configure polygon template (countries)
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.setAll({
      tooltipText: '{name}',
      interactive: true,
      fill: am5.color(0x1e3a5f),
      stroke: am5.color(0x2e5b88),
      strokeWidth: 0.8,
    });

    // Custom coloring for countries with active projects
    polygonSeries.mapPolygons.template.adapters.add('fill', (fill, target) => {
      const dataItem = target.dataItem;
      if (dataItem) {
        const id = (dataItem.dataContext as { id?: string })?.id;
        if (id && countryProjectsRegistry[id]) {
          return am5.color(0x00c8c8); // Electric Azure Teal for active project countries
        }
      }
      return fill;
    });

    // Hover state styling
    polygonTemplate.states.create('hover', {
      fill: am5.color(0x00e5e5),
      stroke: am5.color(0xffffff),
      strokeWidth: 1.5,
    });

    // Event listener on country hover / click
    polygonTemplate.events.on('pointerover', (ev) => {
      const dataContext = ev.target.dataItem?.dataContext as { id?: string };
      if (dataContext && dataContext.id && countryProjectsRegistry[dataContext.id]) {
        setSelectedCountry(countryProjectsRegistry[dataContext.id]);
      }
    });

    polygonTemplate.events.on('click', (ev) => {
      const dataContext = ev.target.dataItem?.dataContext as { id?: string };
      if (dataContext && dataContext.id && countryProjectsRegistry[dataContext.id]) {
        setSelectedCountry(countryProjectsRegistry[dataContext.id]);
      }
    });

    // Add Zoom Control UI
    const zoomControl = chart.set('zoomControl', am5map.ZoomControl.new(root, {}));
    zoomControl.homeButton.set('visible', true);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-gray-900 py-16 flex flex-col justify-center overflow-hidden border-t border-b border-gray-800">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00C8C8]/10 border border-[#00C8C8]/30 rounded-full px-4 py-1.5 mb-3">
            <Globe2 className="w-4 h-4 text-[#00C8C8]" />
            <span className="text-[#00C8C8] font-bold text-xs uppercase tracking-widest">
              Global Impact &amp; Regional Reach
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3">
            Interactive Climate <span className="text-[#00C8C8]">Projects Map</span>
          </h2>
          <p className="text-sm md:text-base text-gray-300">
            Hover over highlighted countries on the vector map to inspect active climate adaptation research, partner organizations, and regional findings.
          </p>
        </div>

        {/* ─── 3-Column Dashboard Layout (Left Info Box — Center Map — Right Projects Box) ─── */}
        <div className="grid lg:grid-cols-12 gap-6 items-center flex-1">
          {/* ── LEFT BOX: Country Overview & Telemetry ── */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-[540px]">
            <div>
              {/* Country Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCountry.flagEmoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white font-heading">{selectedCountry.countryName}</h3>
                    <span className="text-xs text-[#00C8C8] font-mono">ISO: {selectedCountry.isoCode}</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#00C8C8]/20 text-[#00C8C8] border border-[#00C8C8]/30">
                  {selectedCountry.projectCount} {selectedCountry.projectCount === 1 ? 'Project' : 'Projects'}
                </span>
              </div>

              {/* Exposure Rating Pill */}
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Climate Risk Vulnerability:</span>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-lg border ${
                      selectedCountry.exposureRating === 'Extreme'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : selectedCountry.exposureRating === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    ● {selectedCountry.exposureRating} Exposure Rating
                  </span>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-1">Primary Science Focus:</span>
                  <p className="text-sm font-semibold text-white leading-snug">{selectedCountry.primaryFocus}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-1">Lead Institutional Partner:</span>
                  <div className="flex items-center gap-2 text-xs text-gray-200">
                    <Building2 className="w-4 h-4 text-[#00C8C8] flex-shrink-0" />
                    <span>{selectedCountry.leadPartner}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Country Legend */}
            <div className="pt-4 border-t border-white/10 text-xs text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C8C8] animate-ping" />
                <span className="text-gray-300">Active Node</span>
              </span>
              <span className="text-gray-500">amCharts 5 Engine</span>
            </div>
          </div>

          {/* ── CENTER: Full Screen amCharts Vector Map Canvas ── */}
          <div className="lg:col-span-6 relative bg-gray-950/80 rounded-3xl border border-white/10 shadow-2xl h-[540px] overflow-hidden flex flex-col">
            <div ref={mapDivRef} className="w-full h-full min-h-[500px]" />
            <div className="absolute bottom-3 left-4 pointer-events-none bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-gray-400">
              💡 Hover or click any highlighted teal country to load project details
            </div>
          </div>

          {/* ── RIGHT BOX: Projects Details List ── */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between h-[540px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <FolderKanban className="w-4 h-4 text-[#00C8C8]" />
                  <span>Projects in {selectedCountry.countryName}</span>
                </div>
                <span className="text-xs text-gray-400">{selectedCountry.projects.length} Total</span>
              </div>

              {/* Scrollable List of Projects */}
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
                {selectedCountry.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00C8C8]/20 text-[#00C8C8] border border-[#00C8C8]/30">
                        {proj.funder}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {proj.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#00C8C8] transition-colors leading-snug mb-2">
                      {proj.title}
                    </h4>
                    <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-2">
                      {proj.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#00C8C8]" />
                        <span>{proj.dates}</span>
                      </span>
                      <Link
                        to={`/projects/${proj.id}`}
                        className="text-[#00C8C8] hover:text-white font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="pt-3 border-t border-white/10">
              <a
                href="#projects-catalog"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#00C8C8] text-[#0A2540] font-bold rounded-xl hover:bg-teal-300 transition-colors text-xs shadow-md"
              >
                <span>View Full Catalog Below</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsMapChart;
