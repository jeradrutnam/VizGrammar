function checkConfig(config, metadata){

	if (config.title == null) {
		config.title = "table";
	}

	if (config.xTitle == null) {
		config.xTitle = config.x;
	}

	if (config.yTitle == null) {
		config.yTitle = config.y;
	}

	if (config.colorScale == null) {
		config.colorScale = "category10";
	}

	if (config.grid == null) {
		config.grid  = true; 
	}

	if (config.zero == null) {
		config.zero = false;
	}

	if (config.color == null) {
		config.color = -1;
	} else {
		config.color = metadata.names.indexOf(config.color);
	}

    if (config.mapType == null) {
        config.mapType = -1;
    }

    if (config.minColor == null) {
        config.minColor = -1;
    }

    if (config.maxColor == null) {
        config.maxColor = -1;
    }

    if (config.size == null) {
        config.size = -1;
    } else {
        config.size = metadata.names.indexOf(config.size);
    }

	if (config.maxLength == null) {
		config.maxLength = -1;
	}

	if (config.markColor == null) {
		config.markColor = "steelblue";
	}

	if (config.markSize == null) {
		config.markSize = 2;
	}

	if (config.fillOpacity == null) {
		config.fillOpacity = 1;
	}

	if (config.padding == null) {
        config.padding = {"top": 20, "left": 60, "bottom": 40, "right": 50};
	}

	config.x = metadata.names.indexOf(config.x);
    config.y = metadata.names.indexOf(config.y);

    return config;
}

function buildTable(datatable) {
	var chartDatatable = {};
	chartDatatable.metadata = datatable[0].metadata;
	chartDatatable.values = buildData(datatable[0].data, datatable[0].metadata);
	return chartDatatable;
}


function buildData(data, metadata) {
	chartData = [];
	for (i = 0; i < data.length; i++) {
		var row = {};
		for (x = 0; x < metadata.names.length; x++) {
			row[metadata.names[x]] = data[i][x];
		}
		chartData.push(row);
	}
	return chartData;
}

/*
	General function used to draw circle symbols graphs
*/
function getSymbolMark(config, metadata) {

  var fill;
  if (config.color != -1) { 
      fill =  {"scale": "color", "field": metadata.names[config.color]};
  } else {
      fill = {"value":config.markColor};
  }

var  mark = {
      "type": "symbol",
      "from": {"data": config.title},
      "properties": {
        "update": {
          "x": {"scale": "x", "field": metadata.names[config.x]},
          "y": {"scale": "y", "field": metadata.names[config.y]},
          "fill": fill,
          "size": {"value": config.markSize},
          "fillOpacity": {"value": config.fillOpacity}
        },
        "hover": {
          "fillOpacity": {"value": 0.5}
        }
      }
    }

    return mark;
}


