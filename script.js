var logoState = true,
    state = "start",
    hash = window.location.hash?window.location.hash:undefined,
    delay = 0,
    count = 0,
    lastScroll = 0;
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
    $('#wrapper .replacable').hide().html( $('#'+state).html()).fadeIn();
    $('#bg').css('top','-'+$('#bg .'+state).position().top+'px');console.log('position changed');
    //history.pushState({}, '', '#'+state);
    console.log(state);
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
$(function(){
  $('.menu li').click(function(){
    console.log(state,'bfter click');
    state=$(this).data('target');
    setState(state);
  });
  $( window ).scroll(function() {
    count++;
    console.log('scroll',count);
  });
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
});
