function getMIW() {
	var http = require('http');

	http.get({
		host: 'blog.rss.naver.com',
		path: '/masaruchi.xml'
	}, function (response) {
		var content = "";
		response.setEncoding('utf8');
		response.on('data', function (data) {
			content += data;
		}).on('end', function() {
			//console.log(content);
			var matched;
			//<![CDATA[ 맨인더윈도우 ]]>
			//matched = content.match(/<item>\W맨인더윈도우\W<\/item>/g);
			matched = content.match(/<item[^>]*>[\s\S]+?<\/item>/g);
			//matched = content.match(/<item[^>]*>[\s\S]+?맨인더윈도우[\s\S]+?<\/item>/g);
			if (matched) {
				matched.forEach(function (item, index, matched) {
					if (item.match(/<category>[\s\S]+?맨인더윈도우[\s\S]+?<\/category>/)) {
						//console.log("item:" + item);
						var title = getContent(item, "title");
						var link = getContent(item, "link");
						var pubDate = getContent(item, "pubDate");

						console.log(title);
						console.log(link);
						console.log(pubDate);

						//var test = item.match(/(^<title>[\s\S]+?<\/title>)/);
						//console.log("test:" + test);
						
						//console.log(item + ":" + index);
					}
				});
			}
		});
	});

	function getContent(item, tag) {
		var start = item.indexOf(tag) + tag.length + 1;
		var end = item.indexOf("/" + tag) - 1;
		var content = item.substr(start, end-start);

		// remove CDATA
		if (content.match(/^<!\[CDATA\[/)) {
			//<![CDATA[맨 인더 윈도우 64화]]>
			content = content.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
		}
		return content;
	}
}
getMIW();
