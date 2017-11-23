var levelWithTiles = {
    columns: 8,
    rows: 8,
    hardCodedTiles: [
        {
            row: 0,
            col: 0,
            type: 'red',
            colors: [255, 128, 128]
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
    columns: 6,
    rows: 6,
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
        },
        {
            type: "MyLittlePony",
            imageSource: "tile_4.png"
        },
        {
            type: "LipStick",
            imageSource: "tile_5.jpg"
        },
        {
            type: "MinnieMouse",
            imageSource: "tile_6.gif"
        }
    ]
};

var gameEngine = new Engine($("#grid"));
// gameEngine.createLevel(levelWithTiles);
