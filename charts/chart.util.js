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
	} else if (config.color != "*"){
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

    if (config.mode == null) {
        config.mode = "stack";
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

    if (config.renderer == null) {
        config.renderer = "canvas";
    }

    if (config.toolTip == null) {
        config.toolTip = {"height" : 35, "width" : 120, "color":"#e5f2ff", "x": 0, "y":-30};
    }

	if (config.padding == null) {
        config.padding = {"top": 50, "left": 60, "bottom": 40, "right": 150};
	}

	if (config.hoverType == null) {
		config.hoverType = "symbol";
	}

    if (config.tooltip == null) {
        config.tooltip = true;
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
        }
      }
    }

    return mark;
}



function getSignals(config, metadata){

    var signals = [{

            "name": "hover",
            "init": {},
            "streams": [
                {"type": config.hoverType+":mouseover", "expr": "datum"},
                {"type": config.hoverType+":mouseout", "expr": "{}"}
            ]
    }];

    return signals;

}

function bindTooltip(div,markType,eventObj, config, metaData, keyList){

    eventObj.on("mouseover", function(event, item) {

        if (item != null && item.status != "exit" && item.mark.marktype == markType) {
            var canvas = $(".marks")[0];
            if($("#wrapper #tip").length) {
                $tip.remove();
            }

            $(div).wrap( "<div id='wrapper' style='position: relative'></div>" );

            $("#wrapper").append("<div id='tip' class='tooltipClass' style='top:0; left: 0; position: absolute'></div>");
            $tip=$('#tip');
            $tip.empty();

            var dataObj = item.datum;
            var dynamicContent = "";
            for (var key in dataObj) {
                if (dataObj.hasOwnProperty(key)) {
                    if(keyList != undefined){
                        for(var z=0;z<keyList.length;z++){
                            for (var keyVal in config) {
                                if(keyVal == keyList[z] && metaData.names[config[keyVal]] == key){
                                    dynamicContent += "<p>"+keyList[z]+" ("+key+"):"+dataObj[key]+"</p>";
                                    break;
                                }
                            }
                        }
                    }else{
                        if(metaData.names[config.x] == key){
                            dynamicContent += "<p>X ("+key+"):"+dataObj[key]+"</p>";
                        }
                        if(metaData.names[config.y] == key){
                            dynamicContent += "<p>Y ("+key+"):"+dataObj[key]+"</p>";
                        }
                    }
                }
            }

            $tip.append(dynamicContent);

            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;

            var el = $('.marks[style*="width"]');

            if(el.length > 0){
                canvasWidth = parseFloat($(".marks")[0].style.width);
                canvasHeight = parseFloat($(".marks")[0].style.height);
            }
            var dynamicWidth = $tip.width();
            var dynamicHeight = $tip.height();

            var toolTipWidth = item.bounds.x2 + config.padding.left + dynamicWidth;
            var toolTipHeight = (canvasHeight - item.bounds.y2) - config.padding.top + dynamicHeight;
            var toolTipCalculatedXPosition;
            var toolTipCalculatedYPosition = ((item.bounds.y2 + config.padding.top) - dynamicHeight);

            if(toolTipWidth > canvasWidth){
                toolTipCalculatedXPosition = ((item.bounds.x2 + config.padding.left) - dynamicWidth);
            }else{
                toolTipCalculatedXPosition = (item.bounds.x2 + config.padding.left);
            }

            if(toolTipHeight > canvasHeight){
                toolTipCalculatedYPosition = item.bounds.y2 + config.padding.top;
            }

            $tip.css({left:toolTipCalculatedXPosition,top:toolTipCalculatedYPosition}).show();
        }else{

            if($("#wrapper #tip").length) {
                $tip.remove();
            }
            if($(div).closest("#wrapper").length) {
                $(div).unwrap();
            }
        }
    })
}




