/* ==========================================================================
   Gallery job sets — reusable {cover, images[], captions[]} structure.
   Illustrations are original line-art SVGs standing in for real jobsite
   photography; drop real photos into the `images` array later without
   touching the gallery/lightbox component.
   ========================================================================== */
(function(){

  function frame(accent, inner){
    return '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">'
      + '<rect width="400" height="300" fill="#0b1721"/>'
      + '<rect width="400" height="300" fill="url(#g)"/>'
      + '<defs><radialGradient id="g" cx="30%" cy="20%" r="80%">'
      + '<stop offset="0%" stop-color="'+accent+'" stop-opacity="0.16"/>'
      + '<stop offset="100%" stop-color="'+accent+'" stop-opacity="0"/>'
      + '</radialGradient></defs>'
      + inner
      + '</svg>';
  }

  var ICE = '#6fd8f4', STEEL = '#c3ccd2', GLACIER = '#8ff3d4', MIST='#3d5566', LINE='#5c7889';

  var scenes = {
    outdoorUnit: function(a){ return frame(a, '\
      <rect x="90" y="120" width="220" height="110" rx="10" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="150" cy="175" r="34" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="150" cy="175" r="4" fill="'+a+'"/>\
      <line x1="150" y1="175" x2="150" y2="145" stroke="'+a+'" stroke-width="1.6"/>\
      <line x1="150" y1="175" x2="176" y2="190" stroke="'+a+'" stroke-width="1.6"/>\
      <line x1="150" y1="175" x2="124" y2="190" stroke="'+a+'" stroke-width="1.6"/>\
      <rect x="210" y="150" width="80" height="60" rx="4" fill="none" stroke="'+MIST+'" stroke-width="1.5"/>\
      <line x1="220" y1="160" x2="280" y2="160" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="220" y1="170" x2="280" y2="170" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="220" y1="180" x2="280" y2="180" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="220" y1="190" x2="280" y2="190" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="60" y1="230" x2="340" y2="230" stroke="'+LINE+'" stroke-width="1"/>\
    '); },
    indoorUnit: function(a){ return frame(a, '\
      <rect x="80" y="90" width="240" height="46" rx="10" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <rect x="96" y="104" width="208" height="6" rx="3" fill="'+a+'" fill-opacity="0.5"/>\
      <path d="M100 140 Q120 175 100 210" stroke="'+a+'" stroke-width="1.6" fill="none"/>\
      <path d="M140 140 Q160 185 140 220" stroke="'+a+'" stroke-width="1.6" fill="none"/>\
      <path d="M180 140 Q200 190 180 228" stroke="'+a+'" stroke-width="1.6" fill="none"/>\
      <path d="M220 140 Q240 185 220 220" stroke="'+a+'" stroke-width="1.6" fill="none"/>\
      <path d="M260 140 Q280 175 260 210" stroke="'+a+'" stroke-width="1.6" fill="none"/>\
      <circle cx="300" cy="113" r="4" fill="'+a+'"/>\
    '); },
    technician: function(a){ return frame(a, '\
      <circle cx="150" cy="110" r="22" fill="none" stroke="'+MIST+'" stroke-width="2"/>\
      <path d="M110 220 Q112 160 150 155 Q188 160 190 220" fill="none" stroke="'+MIST+'" stroke-width="2"/>\
      <rect x="128" y="150" width="44" height="16" rx="4" fill="none" stroke="'+a+'" stroke-width="1.6"/>\
      <line x1="190" y1="190" x2="240" y2="165" stroke="'+MIST+'" stroke-width="2"/>\
      <rect x="235" y="150" width="34" height="14" rx="3" fill="none" stroke="'+a+'" stroke-width="1.6" transform="rotate(-20 252 157)"/>\
      <rect x="230" y="200" width="130" height="80" rx="8" fill="none" stroke="'+a+'" stroke-width="1.6"/>\
      <circle cx="260" cy="230" r="10" fill="none" stroke="'+a+'" stroke-width="1.4"/>\
      <line x1="285" y1="220" x2="345" y2="220" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="285" y1="235" x2="345" y2="235" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="285" y1="250" x2="345" y2="250" stroke="'+MIST+'" stroke-width="1.2"/>\
    '); },
    ductPlan: function(a){ return frame(a, '\
      <rect x="60" y="60" width="280" height="180" rx="6" fill="none" stroke="'+MIST+'" stroke-width="1.4" stroke-dasharray="4 5"/>\
      <path d="M100 100 H300 M100 100 V220 M300 100 V220" stroke="'+a+'" stroke-width="2" fill="none"/>\
      <rect x="90" y="90" width="20" height="20" fill="'+a+'" fill-opacity="0.6"/>\
      <rect x="190" y="90" width="20" height="20" fill="'+a+'" fill-opacity="0.6"/>\
      <rect x="290" y="90" width="20" height="20" fill="'+a+'" fill-opacity="0.6"/>\
      <rect x="90" y="210" width="20" height="20" fill="'+a+'" fill-opacity="0.6"/>\
      <rect x="290" y="210" width="20" height="20" fill="'+a+'" fill-opacity="0.6"/>\
    '); },
    ventInstall: function(a){ return frame(a, '\
      <rect x="120" y="120" width="160" height="60" rx="8" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <line x1="132" y1="135" x2="268" y2="135" stroke="'+a+'" stroke-width="1.4"/>\
      <line x1="132" y1="150" x2="268" y2="150" stroke="'+a+'" stroke-width="1.4"/>\
      <line x1="132" y1="165" x2="268" y2="165" stroke="'+a+'" stroke-width="1.4"/>\
      <path d="M200 180 V230" stroke="'+MIST+'" stroke-width="1.6" stroke-dasharray="3 4"/>\
      <circle cx="200" cy="240" r="6" fill="'+a+'"/>\
    '); },
    controlPanel: function(a){ return frame(a, '\
      <rect x="130" y="80" width="140" height="160" rx="14" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="200" cy="130" r="26" fill="none" stroke="'+a+'" stroke-width="1.6"/>\
      <text x="200" y="137" font-family="monospace" font-size="18" fill="'+a+'" text-anchor="middle">18°</text>\
      <rect x="152" y="175" width="30" height="10" rx="4" fill="'+a+'" fill-opacity="0.4"/>\
      <rect x="188" y="175" width="30" height="10" rx="4" fill="'+a+'" fill-opacity="0.7"/>\
      <rect x="224" y="175" width="30" height="10" rx="4" fill="'+a+'" fill-opacity="0.4"/>\
      <line x1="152" y1="200" x2="248" y2="200" stroke="'+MIST+'" stroke-width="1.2"/>\
      <line x1="152" y1="212" x2="220" y2="212" stroke="'+MIST+'" stroke-width="1.2"/>\
    '); },
    dashboard: function(a){ return frame(a, '\
      <path d="M40 220 Q200 140 360 220" fill="none" stroke="'+MIST+'" stroke-width="2"/>\
      <circle cx="140" cy="185" r="26" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="260" cy="185" r="26" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <rect x="180" y="165" width="40" height="26" rx="4" fill="none" stroke="'+a+'" stroke-width="1.6"/>\
      <line x1="192" y1="172" x2="208" y2="172" stroke="'+a+'" stroke-width="1.2"/>\
      <line x1="192" y1="180" x2="208" y2="180" stroke="'+a+'" stroke-width="1.2"/>\
      <path d="M120 185 L128 178 M152 185 L160 178 M240 185 L248 178 M272 185 L280 178" stroke="'+a+'" stroke-width="1.4"/>\
    '); },
    gauge: function(a){ return frame(a, '\
      <circle cx="140" cy="150" r="44" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="260" cy="150" r="44" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <line x1="140" y1="150" x2="160" y2="126" stroke="'+a+'" stroke-width="2"/>\
      <line x1="260" y1="150" x2="238" y2="130" stroke="'+a+'" stroke-width="2"/>\
      <path d="M180 150 H220" stroke="'+MIST+'" stroke-width="2"/>\
      <path d="M200 150 V210" stroke="'+MIST+'" stroke-width="1.6"/>\
      <circle cx="200" cy="220" r="8" fill="none" stroke="'+a+'" stroke-width="1.6"/>\
    '); },
    engineBay: function(a){ return frame(a, '\
      <path d="M60 220 L80 130 Q90 110 120 110 L280 110 Q310 110 320 130 L340 220 Z" fill="none" stroke="'+MIST+'" stroke-width="1.6"/>\
      <rect x="150" y="150" width="70" height="55" rx="6" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="185" cy="177" r="14" fill="none" stroke="'+a+'" stroke-width="1.6"/>\
      <line x1="220" y1="165" x2="260" y2="150" stroke="'+a+'" stroke-width="1.6"/>\
      <line x1="220" y1="190" x2="260" y2="200" stroke="'+a+'" stroke-width="1.6"/>\
    '); },
    roadTest: function(a){ return frame(a, '\
      <path d="M40 210 H360" stroke="'+MIST+'" stroke-width="1.4" stroke-dasharray="10 8"/>\
      <rect x="130" y="140" width="140" height="50" rx="14" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <path d="M150 140 L170 110 H230 L250 140" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="160" cy="192" r="14" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <circle cx="240" cy="192" r="14" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <line x1="272" y1="150" x2="300" y2="150" stroke="'+a+'" stroke-width="1.4"/>\
      <line x1="278" y1="160" x2="300" y2="160" stroke="'+a+'" stroke-width="1.4"/>\
    '); },
    chillerExterior: function(a){ return frame(a, '\
      <rect x="90" y="80" width="220" height="150" rx="10" fill="none" stroke="'+a+'" stroke-width="2"/>\
      <line x1="90" y1="120" x2="310" y2="120" stroke="'+a+'" stroke-width="1.2"/>\
      <line x1="90" y1="160" x2="310" y2="160" stroke="'+a+'" stroke-width="1.2"/>\
      <line x1="90" y1="200" x2="310" y2="200" stroke="'+a+'" stroke-width="1.2"/>\
      <circle cx="270" cy="100" r="8" fill="none" stroke="'+a+'" stroke-width="1.4"/>\
    '); },
    coilCloseup: function(a){ return frame(a, '\
      <path d="M60 150 Q100 100 140 150 Q180 200 220 150 Q260 100 300 150 Q320 175 340 150" fill="none" stroke="'+a+'" stroke-width="2.4"/>\
      <path d="M60 180 Q100 130 140 180 Q180 230 220 180 Q260 130 300 180 Q320 205 340 180" fill="none" stroke="'+a+'" stroke-width="1.4" stroke-opacity="0.6"/>\
    '); },
    fridgeUnit: function(a, broken){ return frame(a, '\
      <rect x="130" y="60" width="140" height="200" rx="10" fill="none" stroke="'+(broken?MIST:a)+'" stroke-width="2"/>\
      <line x1="130" y1="130" x2="270" y2="130" stroke="'+(broken?MIST:a)+'" stroke-width="1.4"/>\
      <circle cx="250" cy="95" r="5" fill="'+(broken?MIST:a)+'"/>\
      <circle cx="250" cy="165" r="5" fill="'+(broken?MIST:a)+'"/>\
      ' + (broken ? '<line x1="150" y1="150" x2="185" y2="200" stroke="#ff8686" stroke-width="2"/><line x1="185" y1="150" x2="150" y2="200" stroke="#ff8686" stroke-width="2"/>' : '<path d="M150 160 Q160 175 150 190" stroke="'+a+'" stroke-width="1.4" fill="none"/><path d="M170 160 Q180 178 170 196" stroke="'+a+'" stroke-width="1.4" fill="none"/>') + '\
    '); }
  };

  function set(title, sub, accent, cover, images, captions){
    return { title:title, sub:sub, accent:accent, cover:cover, images:images, captions:captions };
  }

  window.RAC_GALLERY_SETS = [
    set('Split System Install', 'Home · Vistabella', ICE,
      scenes.outdoorUnit(ICE),
      [scenes.outdoorUnit(ICE), scenes.indoorUnit(ICE), scenes.technician(ICE)],
      [
        'New 18,000 BTU Freair split system, outdoor condenser mounted on a vibration-dampened bracket.',
        'Indoor wall-mount head positioned for even airflow across the living area.',
        'Final commissioning: refrigerant charge checked, gas pressures logged, unit handed over under warranty.'
      ]
    ),
    set('Ducted Retrofit', 'Home & Business · San Fernando', ICE,
      scenes.ductPlan(ICE),
      [scenes.ductPlan(ICE), scenes.ventInstall(ICE), scenes.controlPanel(ICE)],
      [
        'Duct layout planned around the office floor plate for balanced zone cooling.',
        'Ceiling diffuser fitted and sealed, insulation checked around every joint.',
        'Digital zone controller commissioned so each room holds its own set temperature.'
      ]
    ),
    set('No Cold Air Diagnosis', 'Auto · Nissan AD Wagon', STEEL,
      scenes.dashboard(STEEL),
      [scenes.dashboard(STEEL), scenes.gauge(STEEL), scenes.engineBay(STEEL)],
      [
        'Customer reported warm air at the vents — dash controls and blower tested first.',
        'Manifold gauge set connected to check refrigerant pressures on both sides of the system.',
        'Low charge and a worn seal traced to the compressor clutch; scheduled for regas and reseal.'
      ]
    ),
    set('Compressor Replacement', 'Auto · Toyota Hilux', STEEL,
      scenes.engineBay(STEEL),
      [scenes.engineBay(STEEL), scenes.gauge(STEEL), scenes.roadTest(STEEL)],
      [
        'Failed A/C compressor removed from the engine bay after a full diagnostic.',
        'System evacuated, new compressor and drier fitted, then vacuum-tested for leaks.',
        'Recharged and road-tested — vents holding a steady 6°C on a hot afternoon.'
      ]
    ),
    set('Commercial Chiller Repair', 'Refrigeration · La Romain Supermarket', GLACIER,
      scenes.chillerExterior(GLACIER),
      [scenes.chillerExterior(GLACIER), scenes.coilCloseup(GLACIER), scenes.controlPanel(GLACIER)],
      [
        'Walk-in chiller losing temperature overnight — full unit inspection on site.',
        'Evaporator coil found iced over from a failing defrost timer; coil cleaned and timer replaced.',
        'Controller reprogrammed and monitored over 24 hours to confirm stable holding temperature.'
      ]
    ),
    set('Domestic Fridge Repair', 'Refrigeration · Marabella Residence', GLACIER,
      scenes.fridgeUnit(GLACIER, true),
      [scenes.fridgeUnit(GLACIER, true), scenes.coilCloseup(GLACIER), scenes.fridgeUnit(GLACIER, false)],
      [
        'Fridge not cooling and cycling constantly — compressor drawing high current on arrival.',
        'Compressor and start relay swapped, refrigerant lines flushed and recharged.',
        'Back to a clean, quiet cycle within spec — a 2-year parts warranty applied to the repair.'
      ]
    )
  ];

  window.RAC_BEFORE_AFTER = {
    before: scenes.fridgeUnit(MIST, true).replace('viewBox="0 0 400 300"','viewBox="0 0 400 300" class="ba-svg"'),
    after: scenes.outdoorUnit(ICE).replace('viewBox="0 0 400 300"','viewBox="0 0 400 300" class="ba-svg"')
  };

})();
