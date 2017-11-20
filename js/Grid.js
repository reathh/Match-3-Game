class Grid {
    constructor(container, swapTileCallback) {
        this._container = container;
        this._swapTileCallback = swapTileCallback;
        this._isfieldDrawn = false;
        this._clustersToRemove = [];
    }

    drawField(tiles) {
        var _self = this;

        for (var row = 0; row < tiles.length; row++) {
            var rowDiv = $('<div></div>').attr('data-row', row);
            for (var col = 0; col < tiles[row].length; col++) {
                var tile = tiles[row][col];

                var tileDiv = $('<div></div>')
                    .attr('data-type', tile.type)
                    .css('background-color', rgb(tile.colors))
                    .addClass('tile');

                var tileContainer = $('<div></div>')
                    .addClass('tileContainer')
                    .attr('data-col', col)
                    .draggable({
                        //revert: 'invalid',
                        start: onStartOfDraggingTile,
                        drag: onDragOfTile,
                        stop: function (event, ui) {
                            onStopOfDraggingTile.call(this, _self);
                        },
                        stack: 'div',
                        containment: this._container
                    });

                tileContainer.append(tileDiv);
                rowDiv.append(tileContainer);
            }

            this._container.append(rowDiv);
        }

        this._isfieldDrawn = true;
    }

    swapTiles(row1, col1, row2, col2, callFromEngine) {
        if (!this._isfieldDrawn) {
            return;
        }

        var _self = this;

        var el1 = findElementContainerInGrid.call(this, row1, col1);
        var el2 = findElementContainerInGrid.call(this, row2, col2);

        el1.swap({
            target: el2, // Mandatory. The ID of the element we want to swap with
            //opacity: "0.9", // Optional. If set will give the swapping elements a translucent effect while in motion
            speed: 250, // Optional. The time taken in milliseconds for the animation to occur
            callback: function () { // Optional. Callback function once the swap is complete
                manipulateDOMData(el1, el2, col1, col2);

                if (!callFromEngine) {
                    _self._swapTileCallback(row1, col1, row2, col2);
                }
            }
        });
    }

    arrangeTile(row1, col1, row2, col2) {
        return new Promise((resolve, reject) => {
            if (!this._isfieldDrawn) {
                return;
            }

            var _self = this;

            var el1 = findElementContainerInGrid.call(this, row1, col1);
            var el2 = findElementContainerInGrid.call(this, row2, col2);

            el1.swap({
                target: el2, // Mandatory. The ID of the element we want to swap with
                //opacity: "0.9", // Optional. If set will give the swapping elements a translucent effect while in motion
                speed: animationTimeForTileArrangement, // Optional. The time taken in milliseconds for the animation to occur
                callback: function () { // Optional. Callback function once the swap is complete
                    manipulateDOMData(el1, el2, col1, col2);
                    resolve();
                }
            });

        });
    }

    addClusterToBeRemoved(cluster) {
        if (!this._isfieldDrawn) {
            return;
        }

        this._clustersToRemove.push(cluster);
    }

    removeClusters() {
        return new Promise((resolve, reject) => {
            if (!this._isfieldDrawn || this._clustersToRemove.length === 0) {
                resolve();
                return;
            }

            var _self = this;
            var clustersWithJqueryElements = this._clustersToRemove.map(function (cluster) {
                return cluster.map(function (tileParameters) {
                    var tileContainer = findElementContainerInGrid.call(_self, tileParameters.row, tileParameters.column);
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
                _self._clustersToRemove = [];
                resolve();
            });
        })
    }

    addTile(row, col, tile) {
        return new Promise((resolve, reject) => {
            if (!this._isfieldDrawn) {
                return;
            }

            var container = findElementContainerInGrid.call(this, row, col);
            container.empty();
            var newElement = $('<div></div>')
                .addClass('tile')
                .attr('data-type', tile.type)
                .css('background-color', rgb(tile.colors))
                .css('display', 'none')
                .data('type', tile.type);

            container.append(newElement);
            newElement.show('blind', {}, animationTimeForAddingTile).promise().done(function () {
                resolve();
            })
        })
    }
}

const toleranceInPx = 3;
const animationTimeForTileArrangement = 120;
const animationTimeForTileRemoval = 300;
const animationTimeForAddingTile = 500;

var startingPosition,
    startingOffset,
    differenceX,
    differenceY,
    direction;

function onStartOfDraggingTile(event) {
    startingPosition = {
        x: event.originalEvent.pageX,
        y: event.originalEvent.pageY
    };
    startingOffset = $(this).offset();
    differenceX = null;
    differenceY = null;
    direction = null;
}

function onDragOfTile(event) {
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

function onStopOfDraggingTile(classInstance) {
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

            const numberofColumns = classInstance._container.find('div[data-row="' + row1 + '"]').children().length;
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

            const numberOfRows = classInstance._container.children().length;
            if (row2 + 1 > numberOfRows) {
                return;
            }
            break;
    }

    classInstance.swapTiles(row1, col1, row2, col2);

    startingPosition = null;
    startingOffset = null;
}

function rgb(values) {
    var joinedValues = values.join(', ');
    return 'rgb(' + joinedValues + ')';
}

function manipulateDOMData(el1, el2, col1, col2) {
    el1.attr('data-col', col2 + 't');
    el1.data('col', col2 + 't');

    el2.attr('data-col', col1);
    el2.data('col', col1);

    el1.attr('data-col', col2);
    el1.data('col', col2);

    swapElementsInDOM(el1[0], el2[0]);
}

function swapElementsInDOM(elm1, elm2) {
    var parent1, next1,
        parent2, next2;

    parent1 = elm1.parentNode;
    next1 = elm1.nextSibling;
    parent2 = elm2.parentNode;
    next2 = elm2.nextSibling;

    parent1.insertBefore(elm2, next1);
    parent2.insertBefore(elm1, next2);
}

function findElementContainerInGrid(row, col) {
    return this._container.find('div[data-row="' + row + '"] div[data-col="' + col + '"]');
}