(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$('a[data-pjax]').click(function(e){
	e.preventDefault();
	$(document).trigger('pjax:start');
	var url = $(this).prop('href');
	var content = $('.content');
	$.ajax({
		url: url,
		dataType:'json',
		success: function(data){
			content.html(data.html);
			history.pushState({}, null, url);
			$(document).trigger('pjax:done', data.locals);
		}
	});
});

$('.topbar .user').click(function(){
	$(this).toggleClass('active');
});

var master = {
	projectid: null,

	setprojectid: function(id){
		this.projectid = id;
	}
};

var body = $('body'); 

$(document).on('pjax:done', function(e, data){

	// TODO: If the project_id in the `e` variable is different from the one stored,
	// change the one stored AND update ALL links with a project ID in it to the latest.
	if(data.project && !body.hasClass('show-sidebar')){
		body.addClass('show-sidebar');
	}else if(!data.project && body.hasClass('show-sidebar')){
		body.removeClass('show-sidebar');
	}

	if(data.project && data.project._id != master.projectid){
		master.setprojectid(data.project._id);
	}else{
		master.setprojectid(null);
	}

});

var activeBar = $('.exception-detail .active-bar > div');
$(document).on('click', '.exception-detail a', function(e){
	width = $(this).width();
	move = (width / 2) + $(this).position().left - 110;
	activeBar.css({
		transform: "translate3d("+move+"px, 0, 0) scaleX("+width+")"
	});
	$('.exception-detail a').removeClass('active');
	$(this).addClass('active');
});
},{}]},{},[1]);
