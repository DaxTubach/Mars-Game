// data on entitites (omitting structures located in DB) to avoid excessive DB calls 
// (5) radar, watertank, habitat, plant, rover 

//Structures
var radararray = {
    id: "radar_array",
    name: "Radar Array", 
    w: 50,
    h: 50,
    info: "A radar dish array allows communication between players",
    pre_reqs: ["radar_dish"],
    uses: {energy : -50},
};

var greenhouse = {
    id: "greenhouse",
    name: "Greenhouse", 
    w: 50,
    h: 50,
    info: "A radar dish array allows communication between players",
    pre_reqs: ["plant_seeds", "hydroponics", "uv_lights"],
    uses: {energy : -50},
};

var water_tank = {
    id: "water_tank",
    name: "Water Tank" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["storage_container"],
    uses: {},
};

var habitat = {
    id: "habitat",
    name: "Colonist Habitat" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["co2_scrubber",],
    uses: {energy : -50},
};

var biodome = {
    id: "biodome",
    name: "Biodome" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["grown_plants"],
    uses: {energy : -50},
};

var power_storage = {
    id: "power_storage",
    name: "Power Storage" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["batteries"],
    uses: {energy : -50},
};

var solar_panel_array = {
    id: "solar_array",
    name: "Solar Array" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["solar_panel"],
    uses: {energy : -50},
};


var nuclear_generator = {
    id: "nuclear_generator",
    name: "Nuclear generator" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["nuclear_reactor"],
    uses: {energy : -50},
};

var research_lab = {
    id: "research_lab",
    name: "Research Lab" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["research_equipment"],
    uses: {energy : -50},
};

var drill = {
    id: "drill",
    name: "Drill" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["auger"],
    uses: {energy : -50},
};

var moxie_station = {
    id: "moxie_station",
    name: "MOXIE Station", 
    w: 50,
    h: 50,
    info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare massa elit, quis semper nisl interdum sit amet.",
    pre_reqs: ["generator", "surgical_equipment"],
    uses: {energy : -50},
};

var rover = {
    id: "rover",
    name: "Rover", 
    w: 50,
    h: 50,
    info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare massa elit, quis semper nisl interdum sit amet.",
    pre_reqs: ["generator", "radar-dish"],
    uses: {energy : -50},
};

var med_bay = {
    id: "med_bay",
    name: "Aluminum Radiation Shielding", 
    w: 50,
    h: 50,
    info: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare massa elit, quis semper nisl interdum sit amet.",
    pre_reqs: ["surgical_equipment"],
    uses: {energy : -50},
};


var buildingArray = [
    radararray,
    water_tank,
    habitat,
    rover,
    med_bay,
    greenhouse,
    moxie_station,
    drill,
    nuclear_generator,
    solar_panel_array,
    power_storage,
    biodome,
    research_lab
];

// Equipment Objects
var Radar_Dish = {
    name: 'Radar Dish',
    id: 'radar_dish',
    icon: 'images/radar-dish-icon.png'
  }

  var HydroponicsEquipment = {
    name: 'Hydroponics Equipment',
    id: 'hydroponics_equipment',
    icon: 'images/hydroponics-equipment-icon.png'
  }

  var FirstAidSupplies = {
    name: 'First Aid Supplies',
    id: 'first_aid_supplies',
    icon: 'images/medical-icon.png'
  }

  var MoxieEquipment = {
    name: 'Moxie Equipment',
    id: 'moxie_equipment',
    icon: 'images/moxie-equipment-icon.png'
  }

  var Auger = {
    name: 'Auger',
    id: 'auger',
    icon: 'images/auger-icon.png'
  }

  var WaterStorage = {
    name: 'Water Storage',
    id: 'water_storage',
    icon: 'images/water-storage-icon.png'
  }

  var SolarPanel = {
    name: 'Solar Panel',
    id: 'solar_panel',
    icon: 'images/solar-panel-icon.png'
  }

  var PlantSeeds = {
    name: 'Plant Seeds',
    id: 'plant_seeds',
    icon: 'images/plant-seeds-icon.png'
  }

  var Battery = {
    name: 'Battery',
    id: 'battery',
    icon: 'images/battery-icon.png'
  }

  var ResearchEquipment = {
    name: 'Research Equipment',
    id: 'research_equipment',
    icon: 'images/research-equipment-icon.png'
  }

  var NuclearReactor = {
    name: 'Nuclear Reactor',
    id: 'nuclear_reactor',
    icon: 'images/nuclear-icon.png'
  }

  var PressurizedAirlockEquipment = {
    name: 'Pressurized Airlock Equipment',
    id: 'pressurized_airlock_equipment',
    icon: 'images/airlock-equipment-icon.png'
  }

  var UvLights = {
    name: 'UV Lights',
    id: 'uv_lights',
    icon: 'images/uv-lights-icon.png'
  }

  var EntertainmentSystem = {
    name: 'Entertainment System',
    id: 'entertainment_system',
    icon: 'images/entertainment-icon.png'
  }

  var LifeSupport = {
    name: 'Life Support',
    id: 'life_support',
    icon: 'images/life-support-icon.png'
  }

  var GrownPlants = {
    name: 'Grown Plants',
    id: 'grown_plants',
    icon: 'images/grown-plants-icon.png'
  }

  var StorageTanks = {
    name: 'Storage Tanks',
    id: 'storage_tanks',
    icon: 'images/storage-icon.png'
  }

  var SurgicalEquipment = {
    name: 'Surgical Equipment',
    id: 'surgical_equipment',
    icon: 'images/surgical-equipment-icon.png'
  }

  

  var equipmentArray = [
    Radar_Dish,
    HydroponicsEquipment,
    FirstAidSupplies,
    MoxieEquipment,
    Auger,
    WaterStorage,
    SolarPanel,
    PlantSeeds,
    Battery,
    ResearchEquipment,
    NuclearReactor,
    PressurizedAirlockEquipment,
    UvLights,
    EntertainmentSystem,
    LifeSupport,
    GrownPlants,
    StorageTanks,
    SurgicalEquipment
  ];