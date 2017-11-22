const minimumCombo = 3;
var _this;

class Engine {
    constructor(gridContainer) {
        _this = this;
        this.clusters = [];
        this.moves = [];
        this.grid = new Grid(gridContainer, this.onMouseSwapped);
        this.tiles = [];

        this.isFieldDrawn = false;
    }

    async createLevel(level) {
        this.level = level;
        var done = false;
        this.isFieldDrawn = false;

        for (var i = 0; i < level.columns; i++) {
            this.tiles[i] = [];
        }

        while (!done) {
            for (var i = 0; i < level.rows; i++) {
                for (var j = 0; j < level.columns; j++) {
                    this.tiles[i][j] = this._getRandomTile(level.tileTypes);
                }
            }

            await this.findAndResolveClusters();

            if (level.hardCodedTiles.length) {
                for (var i = 0; i < level.hardCodedTiles.length; i++) {
                    var parameters = level.hardCodedTiles[i];
                    var row = parameters.row;
                    var col = parameters.col;

                    this.tiles[row][col] = this._getTileByParameters(parameters)
                }
            }

            this._findMoves();
            if (this.moves.length > 0) {
                done = true;
            }
        }

        this.grid.drawField(this.tiles);
        this.isFieldDrawn = true;
    }

    async findAndResolveClusters() {
        // Check for clusters
        this._findClusters();

        // While there are clusters left
        while (this.clusters.length > 0) {
            await this._removeClustersAndRearrangeTiles();
            this._findClusters();
        }
    }

    async onMouseSwapped(row1, col1, row2, col2) {
        _this._swap(row1, col1, row2, col2);
        _this._findClusters();

        if (_this.clusters.length === 0) {
            _this._swap(row1, col1, row2, col2);
            _this.grid.swapTiles(row1, col1, row2, col2, true);
        } else {
            await _this.findAndResolveClusters();
        }
    }

    async _removeClustersAndRearrangeTiles() {
        await this._removeClusters();
        await this._rearrangeTiles();
        this.clusters = [];
    }

    async _removeClusters() {
        var _self = this;
        var currentIndex = 0;
        var clusterElements = [];

        this._loopClusters(function (index, row, column, cluster) {
            _self.tiles[row][column].type = -1;

            if (index == currentIndex) {
                clusterElements.push({row, column})
            } else {
                currentIndex = index;
                _self.grid.addClusterToBeRemoved(clusterElements);

                clusterElements = [];
                clusterElements.push({row, column});
            }
        });

        this.grid.addClusterToBeRemoved(clusterElements); //Add last cluster

        await this.grid.removeClusters();
    }

    async _rearrangeTiles() {
        for (var col = 0; col < this.level.columns; col++) {
            var shift = 0;

            for (var row = this.level.rows - 1; row >= 0; row--) {
                var currentTile = this.tiles[row][col];

                if (currentTile.type == "-1") {
                    shift++;
                }
                else {
                    if (shift > 0) {
                        this._swap(row, col, row + shift, col);
                        if (this.isFieldDrawn) {
                            await this.grid.arrangeTile(row, col, row + shift, col);
                        }
                    }
                }
            }

            for (var i = shift; i > 0; i--) {
                var randomTile = this._getRandomTile(levelWithTiles.tileTypes);
                this.tiles[i - 1][col] = randomTile;
                if (this.isFieldDrawn) {
                    this.grid.addTile(i - 1, col, randomTile);
                }
            }
        }
    }

    _findClusters() {
        this.clusters = [];

        this._findHorizontalClusters();
        this._findVerticalClusters();
    }

    _findHorizontalClusters() {
        var reachedMaxOfCurrentCombo = false;

        for (var row = 0; row < this.level.rows; row++) {
            var combo = 1;
            for (var col = 0; col < this.level.columns; col++) {
                if (col === this.level.columns - 1) {
                    reachedMaxOfCurrentCombo = true;
                }
                else {
                    if (this.tiles[row][col].type === this.tiles[row][col + 1].type) {
                        combo++;
                        reachedMaxOfCurrentCombo = false;
                    }
                    else {
                        reachedMaxOfCurrentCombo = true;
                    }
                }

                if (reachedMaxOfCurrentCombo) {
                    if (combo >= minimumCombo) {
                        this.clusters.push({row: row, col: (col + 1) - combo, combo: combo, type: "horizontal"})
                    }

                    combo = 1;
                }
            }
        }
    }

    _findVerticalClusters() {
        var reachedMaxOfCurrentCombo = false;

        for (var i = 0; i < this.level.rows; i++) {
            var combo = 1;
            for (var j = 0; j < this.level.columns; j++) {
                if (j === this.level.rows - 1) {
                    reachedMaxOfCurrentCombo = true;
                }
                else {
                    if (this.tiles[j][i].type === this.tiles[j + 1][i].type) {
                        combo++;
                        reachedMaxOfCurrentCombo = false;
                    }
                    else {
                        reachedMaxOfCurrentCombo = true;
                    }
                }

                if (reachedMaxOfCurrentCombo) {
                    if (combo >= minimumCombo) {
                        this.clusters.push({row: (j + 1) - combo, col: i, combo: combo, type: "vertical"})
                    }

                    combo = 1;
                }
            }
        }
    }

    _findMoves() {
        this.moves = [];

        this._findMovesByHorizontalSwaps();
        this._findMovesByVerticalSwaps();
    }

    _findMovesByHorizontalSwaps() {
        for (var row = 0; row < this.level.rows; row++) {
            for (var col = 0; col < this.level.columns - 1; col++) {
                this._swap(row, col, row, col + 1);
                this._findClusters();
                this._swap(row, col, row, col + 1);

                if (this.clusters.length > 0) {
                    this.moves.push({row1: row, col1: col, row2: row, col2: col + 1})
                }
            }
        }
    }

    _findMovesByVerticalSwaps() {
        for (var col = 0; col < this.level.columns; col++) {
            for (var row = 0; row < this.level.rows - 1; row++) {
                this._swap(row, col, row + 1, col);
                this._findClusters();
                this._swap(row, col, row + 1, col);

                if (this.clusters.length > 0) {
                    this.moves.push({row1: row, col1: col, row2: row + 1, col2: col})
                }
            }
        }
    }

    _swap(row1, col1, row2, col2) {
        var oldTile = Object.assign({}, this.tiles[row1][col1]);
        this.tiles[row1][col1] = Object.assign({}, this.tiles[row2][col2]);
        this.tiles[row2][col2] = oldTile;
    }

    _loopClusters(func) {
        for (var i = 0; i < this.clusters.length; i++) {
            var cluster = this.clusters[i];
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

    _getTileByParameters(parameters) {
        return {
            type: parameters.type,
            colors: parameters.colors
        };
    }

    _getRandomTile(tileTypes) {
        const tileType = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        return Object.assign({}, tileType);
    }
}