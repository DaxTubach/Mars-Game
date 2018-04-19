// data on entitites (omitting structures located in DB) to avoid excessive DB calls 
// (5) radar, watertank, habitat, plant, rover 

var radar_array = {
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
    pre_reqs: ["generator", "radar-dish"],
    uses: {energy : -50},
};

var solar_panel_array = {
    id: "solar_panel_array",
    name: "Solar Panel" , 
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
    pre_reqs: ["generator", "surgical_equipment"],
    uses: {energy : -50},
};



var buildingArray = [
    radar_array,
    water_tank,
    habitat,
    plant,
    rover,
    med_bay,
    greenhouse,
    moxie_station,
    drill,
    nuclear_generator,
    solar_panel_array,
    power_storage,
    biodome
];

var equipmentIDArray = [
    "radar_array",
    "habitat",
    "plant",
    "rover",
    "med_bay",
    "moxie_station",
    "drill",
    "nuclear_generator",
    "solar_panel_array",
    "power_storage",
    "biodome",
];