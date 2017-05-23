require([
  "esri/Map", 
  "esri/views/MapView",
  "esri/widgets/Home",
  "esri/widgets/Locate",
  "esri/layers/GraphicsLayer", 
  "esri/widgets/Search",
  "esri/widgets/BasemapToggle",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/renderers/SimpleRenderer",
  "dojo/domReady!", 
], function(Map, MapView, Home, Locate, GraphicsLayer, Search, BasemapToggle, FeatureLayer, SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer) {

	var map; 
	var mapView;
	var homeButton;
	var toggle;
	var searchBar;
	var locate;
	var capaDepartamentos;
	var capaCentros;
	var popupTemplate;
	var fillSymbol;;
	var mapRenderer;

	preparaEstilos();
	popupTemplate();
	preparaCapas();
	preparaMapa();
	preparaWigets();
	anadeWigets();

	/*Crea los estilos asociados a la capa de departamentos*/
	function preparaEstilos(){
		fillSymbol = new SimpleFillSymbol({
		color : "red",		
		outline : {
			color : "white", 
			width : 1
		}
	});

	mapRenderer = new SimpleRenderer({
		symbol : fillSymbol
	});
	};

	/*Crea la plantilla del PopUp de información de departamentos*/
	function popupTemplate(){
		popupTemplate = {
			title : "{DPTO}",
			content : "<p>Código DANE: {DPTO_DPTO_}</p>"
		}
	};

	/*Se encarga de crear las capas que se agregarán al mapa*/
	function preparaCapas(){
		//Creamos la capa con la información de centros poblados. 
		capaCentros = new FeatureLayer({
			url: "http://54.187.22.10:6080/arcgis/rest/services/COLOMBIA/MapServer/0",
			opacity: 0.5
			
		});

		//Creamos la capa con la información departamental. 
		capaDepartamentos = new FeatureLayer({
			url: "http://54.187.22.10:6080/arcgis/rest/services/COLOMBIA/MapServer/2",
			renderer: mapRenderer,
			opacity: 0.5, 
			outFields : ["DPTO", "DPTO_DPTO_"],
			popupTemplate : popupTemplate
		});
	};

	/*Se crear el mapa que se mostrará en pantalla con sus respectivas capas*/
	function preparaMapa(){
		//Creamos el mapa 
		map = new Map({
			basemap : "streets", 
			layers: [capaCentros, capaDepartamentos]
		});

		mapView = new MapView({
			container: "viewDiv",
			map: map, 
			//Coordenadas de Colombia
			center : [-74.2973, 4.5709], 
			zoom : 5
		});
	}

	/*Crea los wigets que se añadirán al mapa*/
	function preparaWigets(){
		//Creando botón de inicio
		homeButton = new Home({
			view : mapView
		});

		//Creando botón de ubicación
		var gl = new GraphicsLayer();
		map.add(gl);

		locate = new Locate({
	  		view: mapView,   
	  		graphicsLayer: gl  
		});

		//Creando barra de búsqueda
		searchBar= new Search({
			view: mapView
		});

		//Mapa Toggle 	
		toggle = new BasemapToggle({
	  	view: mapView,  
	  	nextBasemap: "hybrid"  
		});
	}

	/*Añade los Widgets al Mapa*/
	function anadeWigets(){
		mapView.ui.add(searchBar, {position: "top-left", index: 0});
		mapView.ui.add(locate, "top-left");	
		mapView.ui.add(homeButton, "top-left");
		mapView.ui.add(toggle, "top-right");
	}
	
});