"use strict";

var logoState = true,
    pageState = "start",
    hash = window.location.hash?window.location.hash:undefined,
    delay = 1000,
    count = 0,
    lastScroll = 0,
    map,
    pId=0,
    scrolling=false,
    scrollSpeed=500,
    pCount=4,
    dragIgnore = 50,
    offers = undefined,
    dbg=false,
    vertical=window.innerWidth<window.innerHeight,
    mac= /mac/i.test(navigator.platform);
    //map styles
var mapGrayscale =[{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
var mapBlue2 = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}];
if(mac) scrollSpeed=1000;
function closeLoader(){
  $('.loader').fadeOut(1000);
  //$('#wrapper').fadeIn();
  //$('#bg').css('top','-'+$('#bg .start').position().top+'px');
}
//initPage();
document.getElementById('wrapper').scrollTop=0;
var gallery =document.getElementById('galleryContainer');
for(var i=1;i<=pCount;i++){
  $(gallery).append('<div id="p'+i+'"></div>');
}
$(window).load(function(){
  var loadTime = (Date.now()-timerStart);
  clog('loaded',loadTime);
  setTimeout(initPage,delay-loadTime);

})
function hideLogo(){
  $('#wrapper .logo').css('marginTop','-'+$('.logo').height()+'px');
  $('.menu').addClass('fixed').animate({
    top: 0
  }).removeClass('white');
$('.arrow.down').fadeOut();
  $('.main').fadeIn();
  $('.main .content').show();
  logoState=false;

}
function clog(log){
  if(dbg){console.log(log)}
}
function loadOffers(){
  $.getJSON( "offers2.json", function( data ) {
    clog(data.offers);
    offers = data.offers;
    addOffers();
	});

}
function addOffers(){
  for (var i = 0, len = offers.length; i < len; i++) {
    $('#offersList').append('<li id="offer-'+i+'">'+offers[i].title+"</li>");
  }
  $('#offersList li').click(loadOffer);
}
function loadOffer(element){
  var eId = element.target.id.split('-')[1];
  $('#offerContainer h2').text(offers[eId].title);
  fillOfferList('offerResponsibilities',offers[eId].responsibilities);
  fillOfferList('offerRequirements',offers[eId].basic_requirements);
  fillOfferList('offerNicetohave',offers[eId].nice_to_have);
  $('#offerContainer .offerForm').text(offers[eId].form);
  fillOfferList('offerBenefits',offers[eId].benefits);
  $('.careers .offer').addClass('active');
 }
function fillOfferList(elementClass, target){
  $('#offerContainer .'+elementClass).html('').append('<ul></ul>');
  for (var i = 0, len = target.length; i < len; i++) {
    $('#offerContainer .'+elementClass+' ul').append("<li>"+target[i]+"</li>");
  }
}
function setState(state){
  if(state!==undefined){
    pageState=state;
    $('.menu li').removeClass('active');
    if(logoState) hideLogo();
    //document.getElementById("wrapper").className = pageState;
    //$('#wrapper .replacable').hide().empty().append( $('#'+pageState).clone(true)).fadeIn();
    //if(state=='location'){initializeMap()};
    //$('#bg').css('top','-'+($('#bg .'+pageState).position().top)+'px');
    scrolling=true;
    $('#wrapper').stop().animate({
      scrollTop: $('#bg .'+pageState).position().top,
    },scrollSpeed,function(){scrolling=false;});

    $('.menu li[data-target="'+pageState+'"]').addClass('active');
  }
}
function setNextState(){
  setState(  $('.menu li.active').next().data('target') ) ;
}
function setPrevState(){
  setState(  $('.menu li.active').prev().data('target') ) ;
}
function nextPhoto(){
  if(!$('.navigation .arrow.right').hasClass('disabled')&&pageState=='workspace'){
    pId++;
    if(pId<pCount){
      $('.navigation .arrow.left').removeClass('disabled');
    } else{
      $('.navigation .arrow.right').addClass('disabled');
    }
    var calcWidth = - pId*$('.gallery').outerWidth(true);
    $('.workspaceContent ').css('marginLeft',calcWidth+'px')

  }

}
function galleryState(){
    if($('.workspaceContent ').css('marginLeft')!='0px') $('.gallery').addClass('active'); else $('.gallery').removeClass('active');
}
function prevPhoto(){
  if(!$('.navigation .arrow.left').hasClass('disabled')&&pageState=='workspace'){
    pId--;
    if(pId>0){
        $('.navigation .arrow.right').removeClass('disabled');
    }else{
      $('.navigation .arrow.left').addClass('disabled');
    }
    var calcWidth = - pId*$('.gallery').outerWidth(true);
    $('.workspaceContent ').css('marginLeft',calcWidth+'px')

  }

}
function initPage(){
  closeLoader();
  if(hash !== undefined){
    setState(hash.split('#')[1]);
  }
  initializeMap();
}
//map initailize function
function initializeMap() {
	var TILE_SIZE = 256,
  mapZoom = 12,
	wegrzce = new google.maps.LatLng(50.115983,19.96605),
	center = new google.maps.LatLng(50.081023, 19.793093);
  if(vertical){
    center = new google.maps.LatLng(50.060475, 19.918363);
    mapZoom= 13;
  }
  var mapOptions = {
	    zoom: mapZoom,
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

  	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		position: wegrzce,
		map: map,
		title: 'FGT S.A.',
		labelContent: "test",
    icon:'images/marker2.png',
	});
   	var service = new google.maps.places.PlacesService(map);
   	service.textSearch(request2,function (results, status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
      		var place = results[0];
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
      //history.pushState({}, '', '#'+pageState);
    }
  });
  //handle window resize
  $( window ).resize(function() {
      $('#wrapper').scrollTop($('#bg .'+pageState).position().top);
      $('#mapContainer').css('height',$('#wrapper').outerHeight(true)-$('.logo-locaction').outerHeight(true)-$('.footer').outerHeight());
  });
  //loadOffers();
  //handle mousewheel

/*  if(mac){
    (function oneWheel(){

		$(window).one('wheel',function(event, delta) {
			event.preventDefault();
			if(event.originalEvent.deltaY>0){
				setNextState();
      }
			else{
				setPrevState();
      }
			setTimeout(oneWheel,1000)
			return false
		})
	})();

  }else{
*/
    $(window).on('wheel', function(event) {
      //if(event.timeStamp-lastScroll>200){
      if(!scrolling){
        //lastScroll=event.timeStamp;
        if(event.originalEvent.deltaY>0){
          setNextState();
        } else{
          setPrevState();
        };
      }
     });
  // }
   //handle arrow keys
   $(window).keyup(function(e) {
     switch (e.which) {
       case 37: prevPhoto();break;
       case 38: setPrevState();break;
       case 39: nextPhoto();break;
       case 40: setNextState();break;
       default:
     };
   });

   //handle dragging page
   var mD = 0;//mousedown position
   $('body').on('touchstart mousedown', function(event){
      //clog(event.originalEvent.touches[0].clientY,event.type);
      if(event.type==="touchstart"){
        mD=event.originalEvent.touches[0].clientY;
      }else{
        mD=event.clientY;
      }
    });

    var preventMapDrag = false;//prevent draging on map to change elements
    $('#mapContainer').on('mouseup touchend',function(event){
      preventMapDrag=true;
    });
    $('#bg .location').on('mouseup touchend',function(event){
      if(preventMapDrag===true){
        event.stopPropagation();
      }
      preventMapDrag=false;
    })

   $('body').on('touchend mouseup', function(event){
      var currentY = event.type==="touchend"?event.originalEvent.changedTouches[0].clientY:event.clientY;
      var diff = currentY - mD;
      clog(window.getSelection());
      if(Math.abs(diff)>dragIgnore && window.getSelection().isCollapsed){
        if(diff<0){
          setNextState();
        }else{
          setPrevState();
        }
      }
    });
    //handle dragging page end

    //handle navigation gallery with arrows
    $('.navigation .arrow').click(function(){
        if($(this).hasClass('right')){
          nextPhoto();
        }else{
          prevPhoto();
        }
    });

    //tabs in location
    $('.tab-nav .tab').click(function(){
      $('.tabs .tab.active, .tab-nav .tab.active').removeClass('active');
      $('#'+$(this).data('target')).addClass('active');
      $(this).addClass('active');
    })
    /*
    $('.careers ul li').click(function(){
      //load offer data

    });
    */
});
console.log('\n' +
'███████╗ ██████╗████████╗    ███████╗    █████╗    \n' +
'██╔════╝██╔════╝╚══██╔══╝    ██╔════╝   ██╔══██╗   \n' +
'█████╗  ██║  ███╗  ██║       ███████╗   ███████║   \n' +
'██╔══╝  ██║   ██║  ██║       ╚════██║   ██╔══██║  \n' +
'██║     ╚██████╔╝  ██║       ███████║██╗██║  ██║██╗\n' +
'╚═╝      ╚═════╝   ╚═╝       ╚══════╝╚═╝╚═╝  ╚═╝╚═╝    \n\n' +
    'We are looking for experienced developers.\n\n'
);
