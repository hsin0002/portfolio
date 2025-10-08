/*
	Stellar by HTML5 UP
	Modified for sticky top navbar with scroll active links
*/

(function($) {

	var $window = $(window),
	    $body = $('body'),
	    $main = $('#main'),
	    $nav = $('#nav');

	// Breakpoints
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px'  ],
		medium:   [ '737px',   '980px'   ],
		small:    [ '481px',   '736px'   ],
		xsmall:   [ '361px',   '480px'   ],
		xxsmall:  [ null,      '360px'   ]
	});

	// Play initial animations on page load
	$window.on('load', function() {
		setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Sticky Nav
	if ($nav.length > 0) {

		// 記錄 nav 原始偏移
		var navOffsetTop = $nav.offset().top;

		$window.on('scroll', function() {
			if ($window.scrollTop() > navOffsetTop) {
				$nav.addClass('fixed'); // 加上固定樣式
			} else {
				$nav.removeClass('fixed');
			}
		});

		// Nav Links
		var $nav_a = $nav.find('a');

		$nav_a.scrolly({
			speed: 1000,
			offset: function() { return $nav.outerHeight(); } // 考慮 nav 高度
		}).on('click', function() {

			var $this = $(this);

			// 外部連結? 直接返回
			if ($this.attr('href').charAt(0) != '#')
				return;

			// 解除所有 active / active-locked
			$nav_a.removeClass('active').removeClass('active-locked');

			// 鎖定點擊的 link
			$this.addClass('active').addClass('active-locked');
		});

		// Section scroll spy
		$nav_a.each(function() {
			var $this = $(this),
			    id = $this.attr('href'),
			    $section = $(id);

			if ($section.length < 1) return;

			$section.scrollex({
				mode: 'middle',
				initialize: function() {
					if (browser.canUse('transition'))
						$section.addClass('inactive');
				},
				enter: function() {
					$section.removeClass('inactive');

					if ($nav_a.filter('.active-locked').length === 0) {
						$nav_a.removeClass('active');
						$this.addClass('active');
					} else if ($this.hasClass('active-locked')) {
						$this.removeClass('active-locked');
					}
				}
			});
		});

	}

	// Smooth Scrolling
	$('.scrolly').scrolly({
		speed: 1000,
		offset: function() {
			return $nav.outerHeight();
		}
	});

})(jQuery);
