function init(){OpenLayers.IMAGE_RELOAD_ATTEMPTS=3,OpenLayers.Util.onImageLoadErrorColor="transparent";var e=new OpenLayers.Control.LayerSwitcher,a={projection:new OpenLayers.Projection("EPSG:900913"),displayProjection:new OpenLayers.Projection("EPSG:4326"),units:"m",numZoomLevels:20,maxResolution:156543.0339,maxExtent:new OpenLayers.Bounds(-20037508,-20037508,20037508,20037508.34),controls:[new OpenLayers.Control.Attribution,e,new OpenLayers.Control.Navigation,new OpenLayers.Control.PanZoomBar]};layerMap=new OpenLayers.Map("map",a),mapnik_lay1=mapnik.clone(),layerMap.addLayers([mapnik_lay1]),wmslayer=new OpenLayers.Layer.WMS("Layer"+layer_id,warpedwms_url,{format:"image/png",layers:"image"},{TRANSPARENT:"true",reproject:"true"},{gutter:15,buffer:0},{projection:"epsg:4326",units:"m"}),wmslayer.setIsBaseLayer(!1),wmslayer.visibility=!0,layerMap.addLayer(wmslayer),bounds_merc=new OpenLayers.Bounds,bounds_merc=warped_bounds.transform(layerMap.displayProjection,layerMap.projection),layerMap.zoomToExtent(bounds_merc),layerMap.updateSize(),layerMap.events.register("zoomend",mapnik_lay1,function(){this.map.getZoom()>18&&1==this.visibility&&(this.map.setBaseLayer(nyc_lay1),e.maximizeControl())});var r=(OpenLayers.Util.extend({strokeWidth:3},OpenLayers.Feature.Vector.style["default"]),OpenLayers.Util.extend({},OpenLayers.Feature.Vector.style.select)),n={fill:!0,strokeColor:"#FF0000",strokeWidth:3,fillOpacity:0},t=new OpenLayers.StyleMap({"default":n,select:r});mapIndexLayer=new OpenLayers.Layer.Vector("Map Outlines",{styleMap:t,visibility:!1}),mapIndexSelCtrl=new OpenLayers.Control.SelectFeature(mapIndexLayer,{hover:!1,onSelect:onFeatureSelect,onUnselect:onFeatureUnselect}),layerMap.addControl(mapIndexSelCtrl),mapIndexSelCtrl.activate(),layerMap.addLayer(mapIndexLayer),jQuery("#layer-slider").slider({value:100,range:"min",slide:function(e,a){wmslayer.setOpacity(a.value/100),OpenLayers.Util.getElement("opacity").value=a.value}}),loadMapFeatures(),jQuery("#view-maps-index-link").append("(<a href='javascript:toggleMapIndexLayer();'>Toggle map outlines on map above</a>)")}function toggleMapIndexLayer(){var e=mapIndexLayer.getVisibility();mapIndexLayer.setVisibility(!e)}function loadMapFeatures(){var e={format:"json"};OpenLayers.loadURL(mapLayersURL,e,this,loadItems,failMessage)}function loadItems(e){var a=new OpenLayers.Format.JSON;jobj=a.read(e.responseText),lmaps=jobj.items;for(var r=0;r<lmaps.length;r++){var n=lmaps[r];addMapToMapLayer(n)}}function failMessage(){alert("Sorry, something went wrong loading the items")}function addMapToMapLayer(e){var a=new OpenLayers.Feature.Vector(new OpenLayers.Bounds.fromString(e.bbox).transform(layerMap.displayProjection,layerMap.projection).toGeometry());a.mapTitle=e.title,a.mapId=e.id,mapIndexLayer.addFeatures([a])}function onPopupClose(){mapIndexSelCtrl.unselect(selectedFeature)}function onFeatureSelect(e){selectedFeature=e,popup=new OpenLayers.Popup.FramedCloud("amber_lamps",e.geometry.getBounds().getCenterLonLat(),null,"<div class='layermap-popup'> Map "+e.mapId+"<br /> <a href='"+mapBaseURL+"/"+e.mapId+"' target='_blank'>"+e.mapTitle+"</a><br /><img src='"+mapThumbBaseURL+e.mapId+"' height='80'><br /> <a href='"+mapBaseURL+"/"+e.mapId+"#Rectify_tab' target='_blank'>Edit this map</a></div>",null,!0,onPopupClose),popup.minSize=new OpenLayers.Size(180,150),e.popup=popup,layerMap.addPopup(popup)}function onFeatureUnselect(e){layerMap.removePopup(e.popup),e.popup.destroy(),e.popup=null}var layerMap,mapIndexLayer,mapIndexSelCtrl,selectedFeature;