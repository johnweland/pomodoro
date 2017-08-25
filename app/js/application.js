"use strict";
const {remote} = require('electron')

let win = remote.getCurrentWindow()

/*
 * Global variables
 */
const AttemptKind = {"FOCUS": 1500000, "BREAK": 300000};
let breaker = 0; // 0 = go, 1 = paused, 2 = stopped
let counter = null;
let attempt = null;

/*
 * Pomodoro Attempt "class"
 */
function Attempt(msg, kind)  {
	this.message 			= msg
	this.kind 				= kind
	this.nextKind			= null
	this.time 				= null
	this.remainingTime 		= null

	this.setTime(kind);
	this.setAttempt();
	this.setNextKind(kind)
}

Attempt.prototype.setTime = function (kind) {
	return this.time = AttemptKind[kind], this.remainingTime = AttemptKind[kind]
}

Attempt.prototype.getMessage = function () {
	return this.message
}

Attempt.prototype.getKind = function () {
	return this.kind
}

Attempt.prototype.setNextKind = function(kind) {
	if (kind === "FOCUS") {
		this.nextKind = "BREAK"
	} else {
		this.nextKind = "FOCUS"
	}
}

Attempt.prototype.getTime = function () {
	return this.time
}

Attempt.prototype.getRemainingTime = function() {
	return this.remainingTime
}

Attempt.prototype.countdown = function() {
	let time = this.getRemainingTime()
	if (counter && breaker === 2) clearInterval(counter) // if the counter is set && breaker == stop (2), kill setInterval()
			counter = setInterval(function() {
		if (time <= 1000) { // not 0! This function fires before time is updated a time check of 0 run until -1000 || -1s
			clearInterval(counter)
			$('.time').html(parseTime(0))
			toggleButtons('done')
		}
		if (breaker === 1) return
		time = time - 1000
		attempt.remainingTime = time;
		$('.time').html(parseTime(time))
	}, 1000)
}


Attempt.prototype.start = function () {
	if (this.remainingTime == this.time) {
		breaker = 2
		this.countdown();
	} else {
		console.log("error: you are in the middle of a sprint")
	}
}

Attempt.prototype.pause = function(){
	breaker = 1
}

Attempt.prototype.resume = function(){
	breaker = 0
}

Attempt.prototype.restart = function(){
	breaker = 0
	this.pause()
	attempt = new Attempt('', this.kind)
}

Attempt.prototype.setAttempt = function () {
	switch (this.kind) {
		case "FOCUS":
			$('#header').text('Focus Time')
			$('body').removeClass('complete')
			$('body').removeClass('break')
			$('.time').html(parseTime(this.getTime()))
			break;
		case "BREAK":
			$('#header').text('Break Time')
			$('body').removeClass('complete')
			$('body').addClass('break')
			$('.time').html(parseTime(this.getTime()))
			break;
	}
}

/*
 * Generic funtions
 */
function parseTime (time) {
	var minutes = Math.floor(time / 60000)
	var seconds = ((time % 60000) / 1000).toFixed(0)
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

function  toggleButtons (state) {
	switch (state) {
		case 'start':
			$('#start').hide()
			$('#pause').show()
			$('#resume').hide()
			break;
		case 'pause':
			$('#start').hide()
			$('#pause').hide()
			$('#resume').show()
			break;
		case 'resume':
			$('#start').hide()
			$('#pause').show()
			$('#resume').hide()
			break;
		case 'done':
			$('body').removeClass('break')
			$('body').addClass('complete')
			$('#header').append('\nCOMPLETED!!')
			$('#start').show()
			$('#pause').hide()
			$('#resume').hide()
			break;
	}
}

/*
 * Page Setup on load
 */
$(document).ready(function(){
	var msg = $('#message').val();
	attempt = new Attempt(msg, "FOCUS");
	$('#resume').hide()
	$('#pause').hide()

	
	$('body').on('click', '#minimize', () => {
		win.minimize()
	})

	$('body').on('click', '#close', () => {
		win.close()
	})

	$('body').on('click', '#start', function(){
		if(attempt.remainingTime <= 0) {
			attempt = new Attempt('', attempt.nextKind)
		}
		attempt.start()
		toggleButtons('start');
	})

	$('body').on('click', '#pause', function(){
		attempt.pause()
		toggleButtons('pause');
	})

	$('body').on('click', '#resume', function(){
		attempt.resume()
		toggleButtons('resume');
	})

	$('body').on('click', '#restart', function(){
		attempt.restart()
		toggleButtons('done');
	})
});
