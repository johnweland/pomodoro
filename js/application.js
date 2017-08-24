"use strict";

const AttemptKind = {"FOCUS": 1500000, "BREAK": 300000};

function Attempt(msg, kind)  {
	this.message 			= msg;
	this.kind 				= kind;
	this.time 				= null;

	this.setTime(kind);
	this.changeAttempt();
}

Attempt.prototype.setTime = function (kind) {
	return this.time = AttemptKind[kind]
}

Attempt.prototype.getMessage = function () {
	return this.message
}

Attempt.prototype.getKind = function () {
	return this.kind
}

Attempt.prototype.getTime = function () {
	return this.time;
}

Attempt.prototype.changeAttempt = function () {
	switch (this.kind) {
		case "FOCUS":
			$('body').removeClass('complete')
			$('body').removeClass('break')
			$('.time').html(parseTime(this.time));
			break;
		case "BREAK":
			$('body').removeClass('break')
			$('body').addClass('complete')
			$('.time').html(parseTime(this.time));
			break;
	}
}

function parseTime (time) {
	var minutes = Math.floor(time / 60000);
	var seconds = ((time % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
