/**************************
 * junho bot for mypeople
 *
 **************************/
// junho85bot
var util = require("util");
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var formidable = require("formidable");
var sys = require('sys');
var logger = require('./log');

// server.....................
var PORT = 8080;
var ADDRESS = "127.0.0.1";

var callbackFunction = function(req, res){
	if (req.method == 'POST') {
		var data = "";

		req.on("data", function(chunk) {
			data += chunk;
		});

		req.on("end", function() {
			//util.log("raw: " + data);
			logger.log("raw: " + data);

			var json = querystring.parse(data);

			util.log("json: " + json);
			util.log("content="+json.content);
			util.log("buddyId="+json.buddyId);
			util.log("groupId="+json.groupId);
			util.log("action="+json.action);

			if (json.action == "sendFromMessage") {
				var content = "";

				if (!content && json.buddyId == "BU_kvORWVKrpaKmI_fu4kx..Q00") {
					content = getHashValue(json.content);
				}

				if (!content) {
					content = getBotResponse(json.content);
				}

				// send
				if (content) {
					sendBuddy(json.buddyId, content);
				}
			} else if (json.action == "sendFromGroup") {
				var content = "";
				content = getBotResponse(json.content);

				// send
				if (content) {
					sendGroup(json.groupId, content);
				}
			}
		});
	}
};

http.createServer(callbackFunction).listen(PORT, function () {
    console.log('Server running at http://' + ADDRESS + ':' + PORT + '/');
});



// send method............
var MYPEOPLE_BOT_APIKEY = process.env["MYPEOPLE_APIKEY"];
var post_domain = 'apis.daum.net';
var post_port = 80;

function sendBuddy(buddyId, msg) {
	var post_path = '/mypeople/buddy/send.xml';

	var querystring = require('querystring');
	var http = require('http');

	var post_data = querystring.stringify({
		'apikey' : MYPEOPLE_BOT_APIKEY,
		'buddyId' : buddyId,
		'content' : msg
	});

	var post_options = {
	  host: post_domain,
	  port: post_port,
	  path: post_path,
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length
	  }
	};

	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Response: ' + chunk);
		});
	});

	// write parameters to post body
	post_req.write(post_data);
	post_req.end();
}

function sendGroup(groupId, msg) {
	var post_path = '/mypeople/group/send.xml';

	var querystring = require('querystring');
	var http = require('http');

	var post_data = querystring.stringify({
		'apikey' : MYPEOPLE_BOT_APIKEY,
		'groupId' : groupId,
		'content' : msg
	});

	var post_options = {
	  host: post_domain,
	  port: post_port,
	  path: post_path,
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length
	  }
	};

	var post_req = http.request(post_options, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		console.log('Response: ' + chunk);
	  });
	});

	// write parameters to post body
	post_req.write(post_data);
	post_req.end();
}

function getBotResponse(msg) {
	var content = "";
	
	if (/^(?:랜덤).*/.test(msg)) {
		var args = msg.split(/\s+/);
		if (args.length == 1) {
			content = "인자가 부족합니다.\nusage: 랜덤 사과 딸기 바나나";

		} else {
			var random = Math.floor((Math.random()*(args.length-1)+1));
			var result = args[random];
			content = "랜덤 결과는 '" + result + "' 입니다.";
		}
	} else if (/.*(?:준호).*/.test(msg)) {
		content = talkAboutJunho(msg);
	}
	return content;
}

function talkAboutJunhoBot(msg) {
	var content = "";

}
function talkAboutJunho(msg) {
	var content = "";
	if (/.*(?:천재|병신|븅신|바보|멍청이).*/.test(msg)) {
		content = "김준호는 천재!";
	} else if (/.*(?:꺼져).*/.test(msg)) {
		content = "^^;";
	} else if (/.*(?:짜증남).*/.test(msg)) {
		content = "짜증내지 말아요~";
	}

	if (content == "") {
		return false;
	}

	return content;
}

function getHashValue(target) {
	var hashArray = new Array();
	// 사이트와 아이디
	hashArray['인터파크'] = "may20th/h******1";
	hashArray['11번가'] = "junho1985/H******";
	hashArray['11st'] = hashArray['11번가'];
	hashArray['해피머니'] = "junho85/H******2";
	// 주소
	hashArray['주소'] = "도로명주소: 서울특별시 중랑구 중랑천로2길 18 202호";
	hashArray['다음'] = "서울특별시 용산구 한남동 714번지 일신빌딩 다음커뮤니케이션 02-6718-1832";


	return hashArray[target];
}
