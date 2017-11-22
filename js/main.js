var levelWithTiles = {
    columns: 8,
    rows: 8,
    hardCodedTiles: [
        {
            row: 0,
            col: 0,
            type: 'speciale',
            colors: [0, 0, 0]
        }
    ],
    tileTypes: [
        {
            type: "red",
            colors: [255, 128, 128]
        },
        {
            type: "green",
            colors: [128, 255, 128]
        },
        {
            type: "darkBlue",
            colors: [128, 128, 255]
        },
        {
            type: "yellow",
            colors: [255, 255, 128]
        },
        {
            type: "purple",
            colors: [255, 128, 255]
        },
        {
            type: "lightBlue",
            colors: [128, 255, 255]
        },
        {
            type: "white",
            colors: [255, 255, 255]
        }
    ]
};

var levelWithBarbies = {
    columns: 8,
    rows: 8,
    hardCodedTiles: [
    ],
    tileTypes: [
        {
            type: "Barbie",
            imageSource: "tile_1.png"
        },
        {
            type: "BarbieHead",
            imageSource: "tile_2.jpg"
        },
        {
            type: 'BarbieMd',
            imageSource: "tile_3.jpg"
        }
    ]
};

var gameEngine = new Engine($("#grid"));
// gameEngine.createLevel(levelWithTiles);