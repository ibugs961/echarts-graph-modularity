var modularity = require('./modularity');
var echarts = require('echarts');

echarts.registerVisual(echarts.PRIORITY.VISUAL.CHART + 1, function (ecModel, api) {
    var paletteScope = {};
    ecModel.eachSeriesByType('graph', function (seriesModel) {
        var modularityOpt = seriesModel.get('modularity');
        if (modularityOpt) {
            var graph = seriesModel.getGraph();
            var nodeDataArr = graph.data.mapArray(function (idx) {
                var node = graph.getNodeByIndex(idx);
                return node.id;
            });
            var edgeDataArr = graph.edgeData.mapArray('value', function (val, idx) {
                var edge = graph.getEdgeByIndex(idx);
                return {
                    source: edge.node1.id,
                    target: edge.node2.id,
                    value: val
                };
            });

            var community = modularity().nodes(nodeDataArr).edges(edgeDataArr).partition_init();
            var result = community();

            for (var id in result) {
                var comm = result[id];
                graph.data.setItemVisual(+id, 'color', seriesModel.getColorFromPalette(comm, paletteScope));
            }
        }
    });
});