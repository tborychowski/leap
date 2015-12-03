'use strict';

var cheerio = require('cheerio');
var needle = require('needle');

var USERNAME = '';
var PASSWORD = '';

var requestOptions = {
		follow_max: 10,
		follow_set_cookies: true,
		cookies: {}
	},
	requestData = {
		__VIEWSTATE: '',
		__VIEWSTATEENCRYPTED: '',
		__EVENTVALIDATION: '',
		_URLLocalization_Var001: 'False',
		ctl00$ContentPlaceHolder1$UserName: USERNAME,
		ctl00$ContentPlaceHolder1$Password: PASSWORD,
		ctl00$ContentPlaceHolder1$btnlogin: 'Login'
	};


function getCardDetails (resp) {
	var $ = cheerio.load(resp.body);
	var tab = $('#ContentPlaceHolder1_TabContainer2_MyCardsTabPanel_ContentPlaceHolder1_ctrlCardOverViewBODetails_CardDetails .fieldsetTop li');

	tab.each(function(i, row) {
		row = $(row);
		var label = row.find('label').text().trim();
		row.find('label,a').remove();
		var value = row.text().trim();
		if (!label || !value) return;

		console.log(label + '	: ' + value);
	});
}


function login () {
	needle.request('post', 'https://www.leapcard.ie/en/Login.aspx?AspxAutoDetectCookieSupport=1', requestData, requestOptions, function (err, resp) {
		if (err) return console.log('err: ', err);
		getCardDetails(resp);
	});
}

function start () {
	needle.request('get', 'https://www.leapcard.ie/en/Login.aspx?AspxAutoDetectCookieSupport=1', {}, requestOptions, function (err, resp) {
		if (err) return console.log('err: ', err);

		var $ = cheerio.load(resp.body);
		requestData.__VIEWSTATE = $('#__VIEWSTATE').val();
		requestData.__EVENTVALIDATION = $('#__EVENTVALIDATION').val();
		requestData.__PREVIOUSPAGE = $('#__PREVIOUSPAGE').val();
		requestOptions.cookies = Object.assign(requestOptions.cookies, resp.cookies);

		login();
	});
}

start();
