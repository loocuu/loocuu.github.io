var logoState = true,
    state = "start",
    hash = window.location.hash?window.location.hash:undefined,
    delay = 0,
    count = 0,
    lastScroll = 0,
    map;
function closeLoader(){
  $('.loader').fadeOut();
  $('#wrapper').addClass('main').show();
  $('#bg').css('top','-'+$('#bg .main').position().top+'px');
}

$(window).load(function(){
  console.log(hash);
  var loadTime = (Date.now()-timerStart);
  console.log('loaded',loadTime);
  setTimeout(initPage,delay-loadTime);

})

function hideLogo(){
  $('#wrapper .logo').css('marginTop','-'+$('.logo').height()+'px'); $('.menu').removeClass('white');$('#wrapper .arrow').hide(); $('#wrapper .content').fadeIn();
  logoState=false;
}
function setState(state){
  if(state!==undefined){
    $('.menu li').removeClass('active');
    if(logoState) hideLogo();
    document.getElementById("wrapper").className = state;
    $('#wrapper .replacable').hide().empty().append( $('#'+state).clone()).fadeIn();
    $('#bg').css('top','-'+$('#bg .'+state).position().top+'px');console.log('position changed');
    //history.pushState({}, '', '#'+state);
    console.log(state);
    if(state=='location'){initializeMap()};
      $('.menu li[data-target="'+state+'"]').addClass('active');
  }
}
function setNextState(){
  setState(  $('.menu li.active').next().data('target') ) ;
}
function setPrevState(){
  setState(  $('.menu li.active').prev().data('target') ) ;
}
function initPage(){
  closeLoader();
  if(hash !== undefined){
    state=hash.split('#')[1];
    setState(state);
  }
}
//map initailize function
function initializeMap() {
	var TILE_SIZE = 256;
	var wegrzce = new google.maps.LatLng(50.115633,19.96635);
	//var center = new google.maps.LatLng(50.119106,19.96736);
	var center = new google.maps.LatLng(50.096418, 19.921529);
  var mapOptions = {
	    zoom: 13,
		scrollwheel: false,
		styles:mapBlue2,
	    center: center
  	};

  	map = new google.maps.Map(document.getElementById('mapContainer'),mapOptions);
	  //var coordInfoWindow = new google.maps.InfoWindow();
  	var contentString='FORTRESS Gaming Technologies S.A<br>';
  	var request = {
    	reference: 'CpQBgQAAAJD9r9sejF9g5UddNHMS2AVaoN_eRmZvtQwsv4E_S1dp7R-gJskWbmgnPZE8vWo1IJB_OtZExLoe9ViJSh65FBHWmE-svJA4Y7cCUezB7PMGMAwPcBVRKbFPkHzjVzh6_uP9DvcHDSp1ID_vh_qhCFymt7dnQaNoh-LaHT0VlVo2VwwvYubdmkOS9Y4nX1i2EBIQRzlORre2nQX1PLmTbG5bGhoUzimKXqW1UrFZ52ihxb3hkzAZxuM'
  	};
   	var request2 = {
	    location: wegrzce,
	    radius: '900',
	    query: 'fortress gaming technologies'
  	};

  	infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		position: wegrzce,
		map: map,
		title: 'FGT S.A.',
		labelContent: "test",
    icon:'images/marker.png',
	});
   	var service = new google.maps.places.PlacesService(map);
   	service.textSearch(request2,function (results, status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
      		place = results[0];
	  		contentString="<div id='infoWindow'><h4>FORTRESS Gaming Technologies S.A.</h4><p>Fort 47A, ul. Forteczna 5</p><p>32-086 Węgrzce</p><br/>"+
                    "<p><i class='fa fa-location-arrow'></i> <b>GPS:</b> 50° 6' 55.89\" N 19° 57' 59.9\" E</p>"+
	                   "</div>";
      		infowindow.setContent(contentString);

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(contentString);
			infowindow.open(map,marker);
		});
	//	infowindow.open(map,marker);
  		}
	});
	google.maps.event.addDomListener(window, 'resize', function() {
		map.setCenter(center);
  	});
}

//map styles
var mapGrayscale =[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
var mapBlue2 = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}];
$(function(){
  //handle menu navigation
  $('.menu li').click(function(){
    state=$(this).data('target');
    setState(state);
  });

  //handle mousewheel
  $(window).bind('mousewheel', function(event) {
    if(event.timeStamp-lastScroll>200){
      lastScroll=event.timeStamp;
      if(event,event.originalEvent.deltaY>0){
        setNextState();
      } else{
        setPrevState();
      };
    }
   });
   //start map when page loaded
   //google.maps.event.addDomListener(window, 'load', initializeMap);
});
