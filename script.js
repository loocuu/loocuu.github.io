var logoState = true,
    pageState = "start",
    hash = window.location.hash?window.location.hash:undefined,
    delay = 100,
    count = 0,
    lastScroll = 0,
    map,
    dragIgnore = 50;
    //map styles
var mapGrayscale =[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
var mapBlue2 = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}];

function closeLoader(){
  $('.loader').fadeOut();
  $('#wrapper').show();
  $('#bg').css('top','-'+$('#bg .start').position().top+'px');
}
//initPage();
$(window).load(function(){
  console.log(hash);
  var loadTime = (Date.now()-timerStart);
  console.log('loaded',loadTime);
  setTimeout(initPage,delay-loadTime);
  initializeMap();
})
function hideLogo(){
  //$('#wrapper .logo').css('marginTop','-'+$('.logo').height()+'px');
  $('.menu').removeClass('white');
  $('#wrapper .content').fadeIn();
  logoState=false;
}
function setState(state){
  if(state!==undefined){
    pageState=state;
    $('.menu li').removeClass('active');
    if(logoState) hideLogo();
    //document.getElementById("wrapper").className = pageState;
    //$('#wrapper .replacable').hide().empty().append( $('#'+pageState).clone(true)).fadeIn();
    //if(state=='location'){initializeMap()};
    $('#bg').css('top','-'+($('#bg .'+pageState).position().top)+'px');
    history.pushState({}, '', '#'+pageState);
    $('.menu li[data-target="'+pageState+'"]').addClass('active');
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

    setState(hash.split('#')[1]);
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

//document ready
$(function(){
  //set map container height
  $('#mapContainer').css('height',$('#wrapper').outerHeight(true)-$('.logo-locaction').outerHeight(true)-$('.footer').outerHeight());
  //handle menu navigation
  $('.menu li').click(function(){
    if($(this).data('target')!==pageState){
      setState($(this).data('target'));
    }
  });
  //handle window resize
  $( window ).resize(function() {
      $('#bg').css('top','-'+($('#bg .'+pageState).position().top)+'px');
  });
  //handle mousewheel
  $(window).bind('wheel', function(event) {
    if(event.timeStamp-lastScroll>200){
      lastScroll=event.timeStamp;
      if(event.originalEvent.deltaY>0){
        setNextState();
      } else{
        setPrevState();
      };
    }
   });
   var mD = 0;//mousedown position
   $('body').on('touchstart mousedown', function(event){
      //console.log(event.originalEvent.touches[0].clientY,event.type);
      if(event.type==="touchstart"){
        mD=event.originalEvent.touches[0].clientY;
      }else{
        mD=event.clientY;
      }
    });

    var prevent = false;//prevent draging on map to change elements
    $('#mapContainer').on('mouseup touchend',function(event){
      prevent=true;
      console.log('map touch');
    });
    $('#bg .location').on('mouseup touchend',function(event){
      if(prevent===true){
        event.stopPropagation();
      }
      prevent=false;
      console.log('map touc2h');
    })

   $('body').on('touchend mouseup', function(event){
      var currentY = event.type==="touchend"?event.originalEvent.changedTouches[0].clientY:event.clientY;
      var diff = currentY - mD;
      if(Math.abs(diff)>dragIgnore){
        if(diff<0){
          setNextState();
        }else{
          setPrevState();
        }
      }
    });
   //start map when page loaded

   //google.maps.event.addDomListener(window, 'load', initializeMap);
});
