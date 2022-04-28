function rplg_badge_init(el, name, root_class) {
    var btn = el.querySelector('.wp-' + name + '-badge'),
        form = el.querySelector('.wp-' + name + '-form');

    if (!btn || !form) return;

    var wpac = document.createElement('div');
    wpac.className = root_class + ' wpac';

    if (btn.className.indexOf('-fixed') > -1) {
        wpac.appendChild(btn);
    }
    wpac.appendChild(form);
    document.body.appendChild(wpac);

    btn.onclick = function() {
        rplg_load_imgs(wpac);
        form.style.display='block';
    };
}

function rplg_load_imgs(el) {
    var imgs = el.querySelectorAll('img.rplg-blazy[data-src]');
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].setAttribute('src', imgs[i].getAttribute('data-src'));
        imgs[i].removeAttribute('data-src');
    }
}

function rplg_next_reviews(name, pagin) {
    var parent = this.parentNode,
        selector = '.wp-' + name + '-review.wp-' + name + '-hide';
        reviews = parent.querySelectorAll(selector);
    for (var i = 0; i < pagin && i < reviews.length; i++) {
        if (reviews[i]) {
            reviews[i].className = reviews[i].className.replace('wp-' + name + '-hide', ' ');
            rplg_load_imgs(reviews[i]);
        }
    }
    reviews = parent.querySelectorAll(selector);
    if (reviews.length < 1) {
        parent.removeChild(this);
    }
    window.rplg_blazy && window.rplg_blazy.revalidate();
    return false;
}

function rplg_leave_review_window() {
    _rplg_popup(this.getAttribute('href'), 620, 500);
    return false;
}

function _rplg_lang() {
    var n = navigator;
    return (n.language || n.systemLanguage || n.userLanguage ||  'en').substr(0, 2).toLowerCase();
}

function _rplg_popup(url, width, height, prms, top, left) {
    top = top || (screen.height/2)-(height/2);
    left = left || (screen.width/2)-(width/2);
    return window.open(url, '', 'location=1,status=1,resizable=yes,width='+width+',height='+height+',top='+top+',left='+left);
}

function _rplg_timeago(els) {
    for (var i = 0; i < els.length; i++) {
        var clss = els[i].className, time;
        if (clss.indexOf('google') > -1) {
            time = parseInt(els[i].getAttribute('data-time'));
            time *= 1000;
        } else if (clss.indexOf('facebook') > -1) {
            time = new Date(els[i].getAttribute('data-time').replace(/\+\d+$/, '')).getTime();
        } else {
            time = new Date(els[i].getAttribute('data-time').replace(/ /, 'T')).getTime();
        }
        els[i].innerHTML = WPacTime.getTime(time, _rplg_lang(), 'ago');
    }
}

function _rplg_init_blazy(attempts) {
    if (!window.Blazy) {
        if (attempts > 0) {
            setTimeout(function() { _rplg_init_blazy(attempts - 1); }, 200);
        }
        return;
    }
    window.rplg_blazy = new Blazy({selector: 'img.rplg-blazy'});
}

function _rplg_read_more() {
    var read_more = document.querySelectorAll('.wp-more-toggle');
    for (var i = 0; i < read_more.length; i++) {
        (function(rm) {
        rm.onclick = function() {
            rm.parentNode.removeChild(rm.previousSibling.previousSibling);
            rm.previousSibling.className = '';
            rm.textContent = '';
        };
        })(read_more[i]);
    }
}

function _rplg_get_parent(el, cl) {
    cl = cl || 'rplg';
    if (el.className.split(' ').indexOf(cl) < 0) {
        // the last semicolon (;) without braces ({}) in empty loop makes error in WP Faster Cache
        //while ((el = el.parentElement) && el.className.split(' ').indexOf(cl) < 0);
        while ((el = el.parentElement) && el.className.split(' ').indexOf(cl) < 0){}
    }
    return el;
}

function _grw_init_slider(el) {
    el = _rplg_get_parent(el, 'wp-gr');

    const ROW_ELEM = el.querySelector('.grw-slider .grw-row'),
          REVIEWS_ELEM = el.querySelector('.grw-slider-reviews'),
          REVIEW_ELEMS = el.querySelectorAll('.grw-slider-review');

    var resizeTimout = null,
        swipeTimout = null;

    var init = function() {
        if (isVisible(el.querySelector('.grw-slider'))) {
            resize();
            _rplg_init_blazy(10);
            if (REVIEW_ELEMS.length) {
                setTimeout(swipe, 300);
            }
        } else {
            setTimeout(init, 300);
        }
    }
    init();

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimout);
        resizeTimout = setTimeout(function() { resize(); }, 150);
    });

    function resize() {
        if (ROW_ELEM.offsetWidth < 510) {
            ROW_ELEM.className = 'grw-row grw-row-xs';
        } else if (ROW_ELEM.offsetWidth < 750) {
            ROW_ELEM.className = 'grw-row grw-row-x';
        } else if (ROW_ELEM.offsetWidth < 1100) {
            ROW_ELEM.className = 'grw-row grw-row-s';
        } else if (ROW_ELEM.offsetWidth < 1450) {
            ROW_ELEM.className = 'grw-row grw-row-m';
        } else if (ROW_ELEM.offsetWidth < 1800) {
            ROW_ELEM.className = 'grw-row grw-row-l';
        } else {
            ROW_ELEM.className = 'grw-row grw-row-xl';
        }
        if (REVIEW_ELEMS.length) {
            setTimeout(dotsinit, 200);
        }
    }

    function dotsinit() {
        var t = REVIEW_ELEMS.length,
            v = REVIEWS_ELEM.offsetWidth / REVIEW_ELEMS[0].offsetWidth;

        var dots = Math.ceil(t/v),
            dotscnt = el.querySelector('.grw-slider-dots');

        dotscnt.innerHTML = '';
        for (var i = 0; i < dots; i++) {
            var dot = document.createElement('div');
            dot.className = 'grw-slider-dot';

            var revWidth = REVIEW_ELEMS[0].offsetWidth;
            var center = (REVIEWS_ELEM.scrollLeft + (REVIEWS_ELEM.scrollLeft + revWidth * v)) / 2;

            /*var x = Math.ceil( ((center * 100 / REVIEWS_ELEM.scrollWidth) * dots) / 100 );
            if (x == i + 1) dot.className = 'dot active';*/
            x = Math.ceil((center * dots) / REVIEWS_ELEM.scrollWidth);
            if (x == i + 1) dot.className = 'grw-slider-dot active';

            dot.setAttribute('data-index', i + 1);
            dot.setAttribute('data-visible', v);
            dotscnt.appendChild(dot);

            dot.onclick = function() {
                var curdot = el.querySelector('.grw-slider-dot.active'),
                    ii = parseInt(curdot.getAttribute('data-index')),
                    i = parseInt(this.getAttribute('data-index')),
                    v = parseInt(this.getAttribute('data-visible'));

                if (ii < i) {
                    scrollNext(v * Math.abs(i - ii));
                } else {
                    scrollPrev(v * Math.abs(i - ii));
                }

                el.querySelector('.grw-slider-dot.active').className = 'grw-slider-dot';
                this.className = 'grw-slider-dot active';

                if (swipeTimout) {
                    clearInterval(swipeTimout);
                }
            };
        }
    }

    function isVisible(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length) && window.getComputedStyle(elem).visibility !== 'hidden';
    }

    function isVisibleInParent(elem) {
        var elemRect = elem.getBoundingClientRect(),
            parentRect = elem.parentNode.getBoundingClientRect();

        return (Math.abs(parentRect.left - elemRect.left) < 2 || parentRect.left <= elemRect.left) && elemRect.left < parentRect.right &&
               (Math.abs(parentRect.right - elemRect.right) < 2 || parentRect.right >= elemRect.right) && elemRect.right > parentRect.left;
    }

    function scrollPrev(offset) {
        REVIEWS_ELEM.scrollBy(
            -REVIEW_ELEMS[0].offsetWidth * offset, 0
        );
    }

    function scrollNext(offset) {
        REVIEWS_ELEM.scrollBy(
            REVIEW_ELEMS[0].offsetWidth * offset, 0
        );
    }

    var prev = el.querySelector('.grw-slider-prev');
    if (prev) {
        prev.onclick = function() {
            scrollPrev(1);
            setTimeout(dotsinit, 200);
            if (swipeTimout) {
                clearInterval(swipeTimout);
            }
        };
    }

    var next = el.querySelector('.grw-slider-next');
    if (next) {
        next.onclick = function() {
            scrollNext(1);
            setTimeout(dotsinit, 200);
            if (swipeTimout) {
                clearInterval(swipeTimout);
            }
        };
    }

    function swipe() {
        var dt = 400;
        if (isVisibleInParent(el.querySelector('.grw-slider-review:last-child'))) {
            REVIEWS_ELEM.scrollBy(-REVIEWS_ELEM.scrollWidth, 0);
            dt = 700;
        } else {
            scrollNext(1);
        }
        setTimeout(dotsinit, dt);
        swipeTimout = setTimeout(swipe, 5000);
    }
}

function grw_init(el, layout) {
    _rplg_timeago(document.querySelectorAll('.wpac [data-time]'));
    _rplg_read_more();
    _rplg_init_blazy(10);
    if (el && layout == 'slider') {
        _grw_init_slider(el);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    grw_init();
});