var level = {
    columns: 8,     // Number of tile columns
    rows: 8,        // Number of tile rows
    tiles: [],      // The two-dimensional tile array
};

// All of the different tile colors in RGB
var tileTypes = [
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
    },
    {
        type: "Marti",
        colors: [255, 105, 180]
    }
];

var clusters = [];
var moves = [];
var grid;

const minimumCombo = 3;

async function createLevel() {
    grid = new Grid($("#grid"), mouseSwapped);

    for (var i = 0; i < level.columns; i++) {
        level.tiles[i] = [];
    }

    var done = false;

    while (!done) {
        for (var i = 0; i < level.rows; i++) {
            for (var j = 0; j < level.columns; j++) {
                level.tiles[i][j] = getRandomTile();
            }
        }

        await resolveClusters();

        findMoves();
        if (moves.length > 0) {
            done = true;
        }
    }

    grid.drawField(level.tiles);
}

async function resolveClusters(changeInUI) {
    // Check for clusters
    findClusters();

    // While there are clusters left
    while (clusters.length > 0) {
        await removeClustersAndRearrangeTiles(changeInUI);
        findClusters();
    }
}

function findMoves() {
    moves = [];

    //Horizontal swaps
    for (var row = 0; row < level.rows; row++) {
        for (var col = 0; col < level.columns - 1; col++) {
            swap(row, col, row, col + 1);
            findClusters();
            swap(row, col, row, col + 1);

            if (clusters.length > 0) {
                moves.push({row1: row, col1: col, row2: row, col2: col + 1})
            }
        }
    }

    //Vertical swaps
    for (var col = 0; col < level.columns; col++) {
        for (var row = 0; row < level.rows - 1; row++) {
            swap(row, col, row + 1, col);
            findClusters();
            swap(row, col, row + 1, col);

            if (clusters.length > 0) {
                moves.push({row1: row, col1: col, row2: row + 1, col2: col})
            }
        }
    }
}

function findClusters() {
    clusters = [];
    var reachedMaxOfCurrentCombo = false;

    findHorizontalClusters();
    findVerticalClusters();

    function findHorizontalClusters() {
        for (var row = 0; row < level.rows; row++) {
            var combo = 1;
            for (var col = 0; col < level.columns; col++) {
                if (col === level.columns - 1) {
                    reachedMaxOfCurrentCombo = true;
                }
                else {
                    if (level.tiles[row][col].type === level.tiles[row][col + 1].type) {
                        combo++;
                        reachedMaxOfCurrentCombo = false;
                    }
                    else {
                        reachedMaxOfCurrentCombo = true;
                    }
                }

                if (reachedMaxOfCurrentCombo) {
                    if (combo >= minimumCombo) {
                        clusters.push({row: row, col: (col + 1) - combo, combo: combo, type: "horizontal"})
                    }

                    combo = 1;
                }
            }
        }
    }

    function findVerticalClusters() {
        for (var i = 0; i < level.rows; i++) {
            var combo = 1;
            for (var j = 0; j < level.columns; j++) {
                if (j === level.rows - 1) {
                    reachedMaxOfCurrentCombo = true;
                }
                else {
                    if (level.tiles[j][i].type === level.tiles[j + 1][i].type) {
                        combo++;
                        reachedMaxOfCurrentCombo = false;
                    }
                    else {
                        reachedMaxOfCurrentCombo = true;
                    }
                }

                if (reachedMaxOfCurrentCombo) {
                    if (combo >= minimumCombo) {
                        clusters.push({row: (j + 1) - combo, col: i, combo: combo, type: "vertical"})
                    }

                    combo = 1;
                }
            }
        }
    }
}

async function removeClustersAndRearrangeTiles(changeInUI) {
    await removeClusters();
    await rearrangeTiles(changeInUI);
    clusters = [];

    async function removeClusters() {
        var currentIndex = 0;
        var clusterElements = [];

        loopClusters(function (index, row, column, cluster) {
            level.tiles[row][column].type = -1;

            if (index == currentIndex) {
                clusterElements.push({row, column})
            } else {
                currentIndex = index;
                grid.addClusterToBeRemoved(clusterElements);

                clusterElements = [];
                clusterElements.push({row, column});
            }
        });

        grid.addClusterToBeRemoved(clusterElements); //Add last cluster

        await grid.removeClusters();
    }

    async function rearrangeTiles(changeInUI) {
        for (var col = 0; col < level.columns; col++) {
            var shift = 0;

            for (var row = level.rows - 1; row >= 0; row--) {
                var currentTile = level.tiles[row][col];

                if (currentTile.type == "-1") {
                    shift++;
                }
                else {
                    if (shift > 0) {
                        swap(row, col, row + shift, col);
                        if (changeInUI) {
                            await grid.arrangeTile(row, col, row + shift, col);
                        }
                    }
                }
            }

            for (var i = shift; i > 0; i--) {
                var randomTile = getRandomTile();
                level.tiles[i - 1][col] = randomTile;
                if (changeInUI) {
                    grid.addTile(i - 1, col, randomTile);
                }
            }
        }
    }
}

function mouseSwapped(row1, col1, row2, col2) {
    swap(row1, col1, row2, col2);
    findClusters();

    if (clusters.length === 0) {
        swap(row1, col1, row2, col2);
        grid.swapTiles(row1, col1, row2, col2, true);
    } else {
        resolveClusters(true);
    }
}

function loopClusters(func) {
    for (var i = 0; i < clusters.length; i++) {
        var cluster = clusters[i];
        var coffset = 0;
        var roffset = 0;
        for (var j = 0; j < cluster.combo; j++) {
            func(i, cluster.row + roffset, cluster.col + coffset, cluster);

            if (cluster.type === "horizontal") {
                coffset++;
            } else {
                roffset++;
            }
        }
    }
}

function swap(row1, col1, row2, col2) {
    var oldTile = Object.assign({}, level.tiles[row1][col1]);
    level.tiles[row1][col1] = Object.assign({}, level.tiles[row2][col2]);
    level.tiles[row2][col2] = oldTile;
}

function getRandomTile() {
    const tileType = tileTypes[Math.floor(Math.random() * tileTypes.length)];
    return Object.assign({}, tileType);
}
