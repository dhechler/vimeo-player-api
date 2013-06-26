//declaring variables
		var apiEndpoint = 'http://vimeo.com/api/v2/',
			oEmbedEndpoint = 'http://vimeo.com/api/oembed.json',
			oEmbedCallback = 'switchVideo',
			videosCallback = 'setupGallery',
			vimeoUsername = '8339534',
			userInfoCallback = 'userInfo';
		
		// Set up the URLs
		var userInfoUrl = 'http://vimeo.com/api/v2/' + vimeoUsername + '/info.json?callback=' + userInfoCallback;
		
				// This function loads the data from Vimeo
		function init() {
			var head = document.getElementsByTagName('head').item(0);
			
			var userJs = document.createElement('script');
			userJs.setAttribute('type', 'text/javascript');
			userJs.setAttribute('src', userInfoUrl);
			head.appendChild(userJs);
		};

		// Get the user's videos
		$(document).ready(function() {
			$.getScript(apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback);
		});

		function getVideo(_self, url, autoplay) {
			_self.addClass('current-video');
			$.getScript(oEmbedEndpoint + '?url=' + url + '&title=0&byline=0&portrait=0&width=900&height=686&api=1&player_id=vimeoplayer&callback=' + oEmbedCallback);
			initiateVimeoApi(false, autoplay);
		}

		function setupGallery(videos) {

			// Load the first video
			
			
			function titledesc(){
				var html = '<h2 class="rapper">' + videos[0].title + '</h2><br><h4>' + videos[0].description + '</h4>';
				$('#info').append(html);
			}
			titledesc();
			// Add the videos to the gallery
			for (var i = 0; i < videos.length; i++) {
				var html = '<li><a href="' + videos[i].url + '"><img src="' + videos[i].thumbnail_medium + '" class="" />';
				html += '<p>' + videos[i].title + '</p></a></li>';
				$('#l-archive ul').append(html);
			}
			
			getVideo($('#l-archive li:first-child'), videos[0].url, false);
			
			// Switch to the video when a thumbnail is clicked
			$('#l-archive a').click(function(event) {
				event.preventDefault();
				var _self = $(this).parent();
				getVideo(_self, this.href, true);
				
			});

		}

		function switchVideo(video) {
			$('#embed').html(function(){
				return unescape(video.html);
			});
			initiateVimeoApi(true, false);
		};
		
		function initiateVimeoApi(initiate, autoplay){
			if(initiate){
				$('iframe').attr('id','vimeoplayer');
				var iframe = $('#vimeoplayer')[0],
					player = $f(iframe);
				
				player.addEvent('ready', function() {
				    player.addEvent('finish', onFinish);
				});
			} else {
				if(autoplay){
					player.api('play');
				}
			}
		}

		function onFinish(){
			var nextVideo = $('li.current-video').next(),
				url = nextVideo.find('a').attr('href'),
				currentVideo = $('li.current-video');
			currentVideo.removeClass('current-video');
			getVideo(nextVideo, url, true);
		}
