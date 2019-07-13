const toleranceInPx = 3;
const animationTImeForTileSwap = 250;
const animationTimeForTileArrangement = 120;
const animationTimeForTileRemoval = 300;
const animationTimeForAddingTile = 500;

var startingPosition,
    startingOffset,
    differenceX,
    differenceY,
    direction,
    selectedTile;

class Grid {
    constructor(container, engineInstance, swapTileCallback) {
        this.container = container;
        this.engineInstance = engineInstance;
        this.swapTileCallback = swapTileCallback;
        this.isfieldDrawn = false;
        this.clustersToRemove = [];
        this.baseTileImagesPath = 'img/tiles/';
    }

    drawField(tiles) {
        var _self = this;
        this.container.empty();
        this.clustersToRemove = [];

        for (var row = 0; row < tiles.length; row++) {
            var rowDiv = $('<div></div>').attr('data-row', row);
            for (var col = 0; col < tiles[row].length; col++) {
                var tile = tiles[row][col];

                var tileDiv = this._createTile(tile);

                var tileContainer = $('<div></div>')
                    .addClass('tileContainer')
                    .attr('data-col', col)
                    .draggable({
                        //revert: 'invalid',
                        start: this._onStartOfDraggingTile,
                        drag: this._onDragOfTile,
                        stop: function () {
                            _self._onStopOfDraggingTile.call(this, _self)
                        },
                        stack: 'div',
                        containment: this.container
                    })
                    .click({classInstance: _self}, this._onClickOfTile);

                tileContainer.append(tileDiv);
                rowDiv.append(tileContainer);
            }

            this.container.append(rowDiv);
        }

        this.isfieldDrawn = true;
    }

    swapTiles(row1, col1, row2, col2, callFromEngine) {
        if (!this.isfieldDrawn) {
            return;
        }

        var _self = this;

        var el1 = this._findElementContainerInGrid(row1, col1);
        var el2 = this._findElementContainerInGrid(row2, col2);

        el1.swap({
            target: el2, // Mandatory. The ID of the element we want to swap with
            //opacity: "0.9", // Optional. If set will give the swapping elements a translucent effect while in motion
            speed: animationTImeForTileSwap, // Optional. The time taken in milliseconds for the animation to occur
            callback: function () { // Optional. Callback function once the swap is complete
                _self._manipulateDOMData(el1, el2, col1, col2);

                if (!callFromEngine) {
                    _self.swapTileCallback.call(_self.engineInstance, row1, col1, row2, col2);
                }
            }
        });
    }

    arrangeTile(row1, col1, row2, col2) {
        return new Promise((resolve, reject) => {
            if (!this.isfieldDrawn) {
                return;
            }

            var _self = this;

            var el1 = this._findElementContainerInGrid(row1, col1);
            var el2 = this._findElementContainerInGrid(row2, col2);

            el1.swap({
                target: el2, // Mandatory. The ID of the element we want to swap with
                //opacity: "0.9", // Optional. If set will give the swapping elements a translucent effect while in motion
                speed: animationTimeForTileArrangement, // Optional. The time taken in milliseconds for the animation to occur
                callback: function () { // Optional. Callback function once the swap is complete
                    _self._manipulateDOMData(el1, el2, col1, col2);
                    resolve();
                }
            });

        });
    }

    addClusterToBeRemoved(cluster) {
        if (!this.isfieldDrawn) {
            return;
        }

        this.clustersToRemove.push(cluster);
    }

    removeClusters() {
        return new Promise((resolve, reject) => {
            var _self = this;

            if (!this.isfieldDrawn || this.clustersToRemove.length === 0) {
                resolve();
                return;
            }

            var clustersWithJqueryElements = this.clustersToRemove.map(function (cluster) {
                return cluster.map(function (tileParameters) {
                    var tileContainer = _self._findElementContainerInGrid(tileParameters.row, tileParameters.column);
                    return tileContainer.find('div[class="tile"]');
                });
            });

            var animationPromises = clustersWithJqueryElements.map(function (jQueryElementsFromCluster) {
                return $(jQueryElementsFromCluster)
                    .hide('explode', {'pieces': 9}, animationTimeForTileRemoval, function () {
                        $(this).remove();
                    })
                    .promise();
            });

            Promise.all(animationPromises).then(function () {
                _self.clustersToRemove = [];
                resolve();
            });
        })
    }

    addTile(row, col, tile) {
        return new Promise((resolve, reject) => {
            if (!this.isfieldDrawn) {
                return;
            }

            var container = this._findElementContainerInGrid(row, col);
            container.empty();

            var newElement = this._createTile(tile);
            newElement.css('display', 'none')
                .data('type', tile.type);

            container.append(newElement);
            newElement.show('blind', {}, animationTimeForAddingTile).promise().done(function () {
                resolve();
            })
        })
    }

    _onClickOfTile(event) {
        var clickedTile = $(this);

        if (!selectedTile) {
            selectedTile = clickedTile;
            selectedTile.children().first().addClass('selected')
        }
        else {
            if (clickedTile == selectedTile) {
                selectedTile = null;
            }
            else {
                var previousTileCoordinates = {
                    row: selectedTile.parent().data('row'),
                    col: selectedTile.data('col')
                };
                var currentTileCoordinates = {
                    row: clickedTile.parent().data('row'),
                    col: clickedTile.data('col')
                };

                if ((Math.abs(previousTileCoordinates.row - currentTileCoordinates.row) > 1) ||
                    (Math.abs(previousTileCoordinates.col - currentTileCoordinates.col) > 1)) {
                    selectedTile = clickedTile;
                    return;
                }

                event.data.classInstance.swapTiles(previousTileCoordinates.row,
                    previousTileCoordinates.col,
                    currentTileCoordinates.row,
                    currentTileCoordinates.col)
            }
        }

    }



    _onStartOfDraggingTile(event) {
        startingPosition = {
            x: event.originalEvent.pageX,
            y: event.originalEvent.pageY
        };
        startingOffset = $(this).offset();
        differenceX = null;
        differenceY = null;
        direction = null;
    }

    _onDragOfTile(event) {
        var position = {
            x: event.originalEvent.pageX,
            y: event.originalEvent.pageY
        };

        var axis = Math.abs(startingPosition.x - position.x) > Math.abs(startingPosition.y - position.y) ? "x" : "y";
        $(this).draggable('option', 'axis', axis);

        var moved = false;
        differenceX = startingPosition.x - position.x;
        differenceY = startingPosition.y - position.y;

        //left
        if (differenceX >= toleranceInPx) {
            moved = true;
            direction = 'left';
        }
        //right
        else if (differenceX <= -toleranceInPx) {
            moved = true;
            direction = 'right';
        }
        //up
        else if (differenceY >= toleranceInPx) {
            moved = true;
            direction = 'up';

        }
        //down
        else if (differenceY <= -toleranceInPx) {
            moved = true;
            direction = 'down';
        }

        if (moved) {
            return false;
        }
    }

    _onStopOfDraggingTile(classInstance) {
        var element = $(this);
        element.offset(startingOffset);

        var row2, col2;
        var row1 = row2 = element.parent().data('row');
        var col1 = col2 = element.data('col');

        switch (direction) {
            case 'left':
                col2 = col1 - 1;

                if (col2 < 0) {
                    return;
                }
                break;
            case 'right':
                col2 = col1 + 1;

                const numberofColumns = classInstance.container.find('div[data-row="' + row1 + '"]').children().length;
                if (col2 + 1 > numberofColumns) {
                    return;
                }
                break;
            case 'up':
                row2 = row1 - 1;

                if (row2 < 0) {
                    return;
                }
                break;
            case 'down':
                row2 = row1 + 1;

                const numberOfRows = classInstance.container.children().length;
                if (row2 + 1 > numberOfRows) {
                    return;
                }
                break;
        }

        classInstance.swapTiles(row1, col1, row2, col2);

        startingPosition = null;
        startingOffset = null;
    }

    _findElementContainerInGrid(row, col) {
        return this.container.find('div[data-row="' + row + '"] div[data-col="' + col + '"]');
    }

    _createTile(tileParameters) {
        var tileDiv = $('<div></div>')
            .attr('data-type', tileParameters.type)
            .addClass('tile');

        if (tileParameters.colors) {
            tileDiv.append($('<div></div>').css('background-color', this._rgb(tileParameters.colors)));
        }
        else if (tileParameters.imageSource) {
            tileDiv.append($('<img src="' + this.baseTileImagesPath + tileParameters.imageSource + '">'))
        }

        return tileDiv;
    }

    _manipulateDOMData(el1, el2, col1, col2) {
        el1.attr('data-col', col2 + 't');
        el1.data('col', col2 + 't');

        el2.attr('data-col', col1);
        el2.data('col', col1);

        el1.attr('data-col', col2);
        el1.data('col', col2);

        this._swapElementsInDOM(el1[0], el2[0]);
    }

    _swapElementsInDOM(elm1, elm2) {
        var parent1, next1,
            parent2, next2;

        parent1 = elm1.parentNode;
        next1 = elm1.nextSibling;
        parent2 = elm2.parentNode;
        next2 = elm2.nextSibling;

        parent1.insertBefore(elm2, next1);
        parent2.insertBefore(elm1, next2);
    }

    _rgb(values) {
        var joinedValues = values.join(', ');
        return 'rgb(' + joinedValues + ')';
    }

}



