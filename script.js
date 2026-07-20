/* ==========================================================================
   RELIABLE AIR CONDITIONING — interactivity
   ========================================================================== */
(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var WA = { primary:'18687255555', secondary:'18687259998' };

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    var isMobile = window.innerWidth < 860;
    if(isMobile){
      setupWelcome(initRest);
    } else {
      setupWelcome();
      initRest();
    }
  }

  function initRest(){
    setupHeader();
    setupBanner();
    setupCursor();
    setupLiquidIce();
    setupForkCards();
    setupTilt();
    setupCounters();
    setupServiceTabs();
    setupIntake();
    setupGallery();
    setupBeforeAfter();
    setupFaq();
    setupReveal();
    setupStickyWhatsapp();
    setupYear();
  }

  /* ---------------- Welcome intro video ---------------- */
  function setupWelcome(onDone){
    var welcome = document.getElementById('welcome');
    if(!welcome) { if(onDone) onDone(); return; }

    var video = welcome.querySelector('video');
    var skipBtn = welcome.querySelector('.skip-btn');
    var fallback = welcome.querySelector('.poster-fallback');
    var done = false;

    // Android Chrome can misreport the visible viewport for fixed-position
    // overlays while the address bar animates, making #welcome render larger
    // than what's actually on screen (video looks "zoomed" until the user
    // manually pinch-zooms, which forces a recalculation). Explicitly size
    // the overlay to the real, current viewport instead of relying on
    // inset:0 alone.
    function sizeWelcome(){
      welcome.style.width = window.innerWidth + 'px';
      welcome.style.height = window.innerHeight + 'px';
    }
    sizeWelcome();
    window.addEventListener('resize', sizeWelcome);
    window.addEventListener('orientationchange', sizeWelcome);

    function finish(){
      if(!done){ done = true; if(onDone) onDone(); }
      if(welcome.classList.contains('hide')) return;
      welcome.classList.add('hide');
      window.removeEventListener('resize', sizeWelcome);
      window.removeEventListener('orientationchange', sizeWelcome);
      setTimeout(function(){ if(welcome.parentNode) welcome.remove(); }, 950);
    }

    if(reduceMotion || !video){
      if(video) video.remove();
      finish();
      return;
    }

    var src = 'assets/welcome.mp4';
    var source = document.createElement('source');
    source.src = src;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.muted = true;
    video.setAttribute('muted','');
    video.playsInline = true;
    video.setAttribute('playsinline','');
    video.load();

    var failed = false;
    video.addEventListener('error', function(){ failed = true; finish(); });
    video.addEventListener('ended', finish);

    setTimeout(function(){ if(!failed) skipBtn.classList.add('show'); }, 1000);
    skipBtn.addEventListener('click', finish);
    welcome.addEventListener('click', function(e){
      if(skipBtn.classList.contains('show')) finish();
    });

    var playPromise = video.play();
    if(playPromise && playPromise.catch){
      playPromise.catch(function(){ finish(); });
    }
    // safety timeout in case metadata never loads
    setTimeout(function(){ if(video.readyState === 0) finish(); }, 4000);
  }

  /* ---------------- Header ---------------- */
  function setupHeader(){
    var header = document.querySelector('.site-header');
    if(!header) return;
    function onScroll(){
      if(window.scrollY > 30) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });

    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if(toggle && nav){
      toggle.addEventListener('click', function(){
        nav.classList.toggle('open');
      });
      nav.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){ nav.classList.remove('open'); });
      });
    }

    // Keep --topbar-h in sync with the real fixed banner+header height so
    // page content never renders underneath/behind it, on any screen size
    // or text-wrap state.
    var bar = document.querySelector('.top-bar-fixed');
    if(bar){
      function syncTopbarHeight(){
        document.documentElement.style.setProperty('--topbar-h', bar.offsetHeight + 'px');
      }
      syncTopbarHeight();
      if(window.ResizeObserver){
        new ResizeObserver(syncTopbarHeight).observe(bar);
      } else {
        window.addEventListener('resize', syncTopbarHeight);
        window.addEventListener('orientationchange', syncTopbarHeight);
      }
    }
  }

  /* ---------------- Urgent banner ---------------- */
  function setupBanner(){
    var banner = document.querySelector('.urgent-banner');
    if(!banner) return;
    if(sessionStorage.getItem('rac_banner_dismissed')){ banner.classList.add('dismissed'); return; }
    var closeBtn = banner.querySelector('.banner-close');
    if(closeBtn){
      closeBtn.addEventListener('click', function(){
        banner.classList.add('dismissed');
        sessionStorage.setItem('rac_banner_dismissed','1');
      });
    }
  }

  /* ---------------- Custom cursor (desktop only) ---------------- */
  function setupCursor(){
    if(isTouch || reduceMotion) { document.body.classList.add('no-custom-cursor'); return; }
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('custom-cursor-active');

    var mx=0,my=0, rx=0, ry=0;
    window.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
    }, { passive:true });
    function loop(){
      rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
      ring.style.transform = 'translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    loop();

    var hoverables = 'a, button, input, select, textarea, .fork-card, .gallery-item, .ba-slider, [data-tilt]';
    document.addEventListener('mouseover', function(e){
      if(e.target.closest && e.target.closest(hoverables)) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', function(e){
      if(e.target.closest && e.target.closest(hoverables)) ring.classList.remove('hovering');
    });
  }

  /* ---------------- Liquid ice background: parallax + mouse pull ---------------- */
  function setupLiquidIce(){
    var blobs = document.querySelectorAll('.liquid-ice .blob');
    if(!blobs.length) return;
    if(reduceMotion) return;

    var mx=0.5, my=0.5, sy=0;
    var targetMx=0.5, targetMy=0.5;

    window.addEventListener('mousemove', function(e){
      targetMx = e.clientX / window.innerWidth;
      targetMy = e.clientY / window.innerHeight;
    }, { passive:true });

    window.addEventListener('scroll', function(){ sy = window.scrollY; }, { passive:true });

    var speeds = [0.04, 0.07, 0.1, 0.13, 0.16, 0.19];
    var pulls  = [18, -14, 22, -20, 16, -18];

    function loop(){
      mx += (targetMx-mx)*0.04;
      my += (targetMy-my)*0.04;
      blobs.forEach(function(b, i){
        var speed = speeds[i % speeds.length];
        var pull = pulls[i % pulls.length];
        var py = -sy * speed;
        var px = (mx-0.5) * pull;
        var pyM = (my-0.5) * pull * 0.6;
        b.style.transform = 'translate3d('+px+'px,'+(py+pyM)+'px,0)';
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------------- Fork cards -> scroll + pre-select ---------------- */
  function setupForkCards(){
    document.querySelectorAll('.fork-card').forEach(function(card){
      card.addEventListener('click', function(){
        var track = card.getAttribute('data-track');
        var target = document.getElementById('intake');
        if(target){
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
          selectTrack(track);
        }
      });
    });
  }

  function selectTrack(track){
    document.querySelectorAll('.track-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-form') === track);
    });
    document.querySelectorAll('.form-panel').forEach(function(panel){
      panel.classList.toggle('active', panel.getAttribute('data-panel') === track);
    });
    document.querySelectorAll('.stab').forEach(function(t){
      t.classList.toggle('active', t.getAttribute('data-tab') === track);
    });
    document.querySelectorAll('.service-panel').forEach(function(p){
      p.classList.toggle('active', p.getAttribute('data-panel') === track);
    });
    var root = document.documentElement;
    var map = {
      home:  { a:'#6fd8f4', b:'#2fa4cf', g:'rgba(111,216,244,0.35)' },
      auto:  { a:'#c3ccd2', b:'#85929c', g:'rgba(195,204,210,0.28)' },
      fridge:{ a:'#8ff3d4', b:'#45c79f', g:'rgba(143,243,212,0.32)' }
    };
  }

  /* ---------------- 3D tilt (desktop only) ---------------- */
  function setupTilt(){
    if(isTouch || reduceMotion) return;
    var els = document.querySelectorAll('.fork-card, [data-tilt]');
    els.forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - 0.5;
        var py = (e.clientY - r.top)/r.height - 0.5;
        var rx = (-py * 8).toFixed(2);
        var ry = (px * 10).toFixed(2);
        el.style.transform = 'perspective(1000px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------------- Animated stat counters ---------------- */
  function setupCounters(){
    var items = document.querySelectorAll('.stat[data-count]');
    if(!items.length) return;
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    items.forEach(function(el){ obs.observe(el); });
  }

  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffixEl = el.querySelector('.suffix');
    var numEl = el.querySelector('.num');
    if(reduceMotion){ numEl.textContent = target; return; }
    var dur = 1600, start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-progress, 3);
      var val = Math.round(target * eased);
      numEl.textContent = val;
      if(progress < 1) requestAnimationFrame(step);
      else numEl.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------------- Services tabs ---------------- */
  function setupServiceTabs(){
    document.querySelectorAll('.stab').forEach(function(tab){
      tab.addEventListener('click', function(){
        var t = tab.getAttribute('data-tab');
        document.querySelectorAll('.stab').forEach(function(x){ x.classList.toggle('active', x===tab); });
        document.querySelectorAll('.service-panel').forEach(function(p){
          p.classList.toggle('active', p.getAttribute('data-panel')===t);
        });
      });
    });
  }

  /* ---------------- Intake forms ---------------- */
  function setupIntake(){
    document.querySelectorAll('.track-btn').forEach(function(btn){
      btn.addEventListener('click', function(){ selectTrack(btn.getAttribute('data-form')); });
    });

    document.querySelectorAll('.radio-chip').forEach(function(chip){
      chip.addEventListener('click', function(){
        var group = chip.closest('.radio-group');
        group.querySelectorAll('.radio-chip').forEach(function(c){ c.classList.remove('checked'); });
        chip.classList.add('checked');
        chip.querySelector('input').checked = true;
      });
    });

    document.querySelectorAll('.intake-form').forEach(function(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!validateForm(form)) return;
        submitForm(form);
      });
    });

    document.querySelectorAll('.reset-form').forEach(function(btn){
      btn.addEventListener('click', function(){
        var panel = btn.closest('.form-panel');
        panel.querySelector('.intake-form').style.display = '';
        panel.querySelector('.success-state').classList.remove('show');
        panel.querySelector('.intake-form').reset();
        panel.querySelectorAll('.radio-chip').forEach(function(c){ c.classList.remove('checked'); });
      });
    });
  }

  function validateForm(form){
    var valid = true;
    form.querySelectorAll('input[data-required], select[data-required], textarea[data-required]').forEach(function(field){
      var wrap = field.closest('.field');
      var value = field.value ? field.value.trim() : '';
      if(field.type === 'radio'){ return; }
      if(!value){
        wrap.classList.add('error');
        wrap.querySelector('.err-msg').textContent = 'This field is required.';
        valid = false;
      } else {
        wrap.classList.remove('error');
        wrap.querySelector('.err-msg').textContent = '';
      }
    });
    form.querySelectorAll('.radio-group[data-required]').forEach(function(group){
      var checked = group.querySelector('input:checked');
      var wrap = group.closest('.field');
      if(!checked){
        wrap.classList.add('error');
        wrap.querySelector('.err-msg').textContent = 'Please choose one.';
        valid = false;
      } else {
        wrap.classList.remove('error');
        wrap.querySelector('.err-msg').textContent = '';
      }
    });
    var phoneField = form.querySelector('input[name="phone"]');
    if(phoneField && phoneField.value.trim()){
      var digits = phoneField.value.replace(/\D/g,'');
      if(digits.length < 7){
        var wrap = phoneField.closest('.field');
        wrap.classList.add('error');
        wrap.querySelector('.err-msg').textContent = 'Enter a valid phone number.';
        valid = false;
      }
    }
    return valid;
  }

  function submitForm(form){
    var panel = form.closest('.form-panel');
    var track = panel.getAttribute('data-panel');
    var labels = {
      home: 'Home & Business A/C',
      auto: 'Auto A/C',
      fridge: 'Refrigerator & Chiller Repair'
    };
    var lines = ['New enquiry — ' + labels[track], ''];
    var fd = new FormData(form);
    var seen = {};
    form.querySelectorAll('[data-summary-label]').forEach(function(field){
      var name = field.name;
      if(seen[name]) return;
      var label = field.getAttribute('data-summary-label');
      var val = '';
      if(field.type === 'radio'){
        var checked = form.querySelector('input[name="'+name+'"]:checked');
        val = checked ? checked.value : '';
        seen[name] = true;
      } else {
        val = fd.get(name) || '';
      }
      if(val) lines.push(label + ': ' + val);
    });

    var waNumber = fd.get('contactNumber') === 'secondary' ? WA.secondary : WA.primary;
    var message = lines.join('\n');
    var waLink = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message);
    var telLink = 'tel:+' + waNumber;

    form.style.display = 'none';
    var success = panel.querySelector('.success-state');
    success.classList.add('show');
    var waBtn = success.querySelector('.wa-send');
    var callBtn = success.querySelector('.call-now');
    var summaryBox = success.querySelector('.summary-box');
    if(waBtn) waBtn.setAttribute('href', waLink);
    if(callBtn) callBtn.setAttribute('href', telLink);
    if(summaryBox) summaryBox.textContent = message;

    // Open WhatsApp right away — the success panel + its own link remain
    // as a fallback in case the browser blocks this popup.
    window.open(waLink, '_blank', 'noopener');
  }

  /* ---------------- Gallery + lightbox ---------------- */
  var GALLERY_SETS = window.RAC_GALLERY_SETS || [];
  var currentSet = null, currentIndex = 0;

  function setupGallery(){
    var grid = document.querySelector('.gallery-grid');
    if(!grid) return;

    GALLERY_SETS.forEach(function(set, idx){
      var item = document.createElement('div');
      item.className = 'gallery-item reveal';
      item.setAttribute('tabindex','0');
      item.setAttribute('role','button');
      item.setAttribute('aria-label','Open photo set: ' + set.title);
      item.innerHTML =
        '<div class="gi-media">'+set.cover+'</div>'+
        '<span class="gi-count">'+set.images.length+' photos</span>'+
        '<div class="gi-overlay"><h4>'+set.title+'</h4><span>'+set.sub+'</span></div>';
      item.addEventListener('click', function(){ openLightbox(idx); });
      item.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLightbox(idx); }
      });
      grid.appendChild(item);
    });

    var lb = document.querySelector('.lightbox');
    if(!lb) return;
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lb.addEventListener('click', function(e){ if(e.target === lb) closeLightbox(); });
    lb.querySelector('.lightbox-nav.prev').addEventListener('click', function(){ stepLightbox(-1); });
    lb.querySelector('.lightbox-nav.next').addEventListener('click', function(){ stepLightbox(1); });

    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') stepLightbox(1);
      if(e.key === 'ArrowLeft') stepLightbox(-1);
    });

    // swipe
    var touchX = null;
    var stage = lb.querySelector('.lightbox-stage');
    stage.addEventListener('touchstart', function(e){ touchX = e.touches[0].clientX; }, {passive:true});
    stage.addEventListener('touchend', function(e){
      if(touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if(Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
      touchX = null;
    }, {passive:true});
  }

  function openLightbox(setIdx){
    currentSet = GALLERY_SETS[setIdx];
    currentIndex = 0;
    if(!currentSet) return;
    renderLightbox();
    document.querySelector('.lightbox').classList.add('open');
  }
  function closeLightbox(){
    document.querySelector('.lightbox').classList.remove('open');
  }
  function stepLightbox(dir){
    if(!currentSet) return;
    currentIndex = (currentIndex + dir + currentSet.images.length) % currentSet.images.length;
    renderLightbox();
  }
  function renderLightbox(){
    var lb = document.querySelector('.lightbox');
    var stage = lb.querySelector('.lightbox-stage');
    stage.innerHTML = currentSet.images[currentIndex];
    lb.querySelector('.lightbox-caption h4').textContent = currentSet.title;
    lb.querySelector('.lightbox-caption p').textContent = currentSet.captions[currentIndex];
    var dots = lb.querySelector('.lightbox-dots');
    dots.innerHTML = '';
    currentSet.images.forEach(function(_, i){
      var b = document.createElement('button');
      if(i === currentIndex) b.className = 'active';
      b.addEventListener('click', function(){ currentIndex = i; renderLightbox(); });
      dots.appendChild(b);
    });
  }

  /* ---------------- Before / after slider ---------------- */
  function setupBeforeAfter(){
    var sliders = document.querySelectorAll('.ba-slider');
    var BA = window.RAC_BEFORE_AFTER;
    sliders.forEach(function(slider){
      var beforeEl = slider.querySelector('.ba-before');
      var after = slider.querySelector('.ba-after');
      if(BA && beforeEl) beforeEl.innerHTML = BA.before;
      if(BA && after) after.innerHTML = BA.after;
      var divider = slider.querySelector('.ba-divider');
      var handle = slider.querySelector('.ba-handle');
      var dragging = false;

      function setPos(clientX){
        var r = slider.getBoundingClientRect();
        var pct = Math.min(100, Math.max(0, ((clientX - r.left)/r.width)*100));
        after.style.clipPath = 'inset(0 0 0 '+pct+'%)';
        divider.style.left = pct+'%';
        handle.style.left = pct+'%';
      }
      function start(e){ dragging = true; }
      function move(e){
        if(!dragging) return;
        var x = e.touches ? e.touches[0].clientX : e.clientX;
        setPos(x);
      }
      function end(){ dragging = false; }

      handle.addEventListener('mousedown', start);
      divider.addEventListener('mousedown', start);
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', end);
      handle.addEventListener('touchstart', start, {passive:true});
      divider.addEventListener('touchstart', start, {passive:true});
      slider.addEventListener('touchmove', move, {passive:true});
      window.addEventListener('touchend', end);

      slider.addEventListener('click', function(e){
        if(e.target === handle) return;
        setPos(e.clientX);
      });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  function setupFaq(){
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function(other){
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        });
        if(!isOpen){
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function setupReveal(){
    var els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    if(reduceMotion){ els.forEach(function(el){ el.classList.add('in'); }); return; }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function(el){ obs.observe(el); });
  }

  /* ---------------- Sticky WhatsApp visibility ---------------- */
  function setupStickyWhatsapp(){
    var btn = document.querySelector('.sticky-whatsapp');
    if(!btn) return;
    function onScroll(){
      if(window.scrollY > window.innerHeight * 0.6) btn.classList.add('show');
      else btn.classList.remove('show');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  function setupYear(){
    var el = document.getElementById('year');
    if(el) el.textContent = new Date().getFullYear();
  }

})();
