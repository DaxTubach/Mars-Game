// data on entitites (omitting structures located in DB) to avoid excessive DB calls 
// (5) radar, watertank, habitat, plant, rover 

var radar = {
    id: "radar",
    name: "Aluminum Radiation Shielding", 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["generator", "radar-dish"],
    uses: {energy : -50},
};

var water_tank = {
    id: "water_tank",
    name: "Water Tank" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["generator", "radar-dish"],
    uses: {energy : -50},
};

var habitat = {
    id: "habitat",
    name: "Colonist Habitat" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["generator", "radar-dish"],
    uses: {energy : -50},
};


var plant = {
    id: "plant",
    name: "Martian Plant" , 
    w: 50,
    h: 50,
    info: "A radar dish allows communication between players",
    pre_reqs: ["generator", "radar-dish"],
    uses: {energy : -50},
};


var rover = {
    id: "rover",
    name: "Aluminum Radiation Shielding", 
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
    pre_reqs: ["generator", "med_supplies"],
    uses: {energy : -50},
};

var buildingArray = [
    radar,
    water_tank,
    habitat,
    plant,
    rover,
    med_bay
];