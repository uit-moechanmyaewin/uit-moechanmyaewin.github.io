/* ============================================
   PHYOE DHANA - Portrait 3D Scene
   Lightweight Three.js: textured plate + orbiting red star
   Lazy-loaded, DPR-capped, pauses off-screen.
   Falls back silently to the static photo.
   ============================================ */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var wrapper = document.querySelector('.about-image-wrapper');
    var aboutImage = document.querySelector('.about-image');
    var photo = document.querySelector('.profile-photo');
    if (!wrapper || !aboutImage || !photo) return;

    var THREE_CDNS = [
        'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.min.js',
        'https://unpkg.com/three@0.161.0/build/three.module.min.js'
    ];

    var started = false;

    function loadThree(i) {
        i = i || 0;
        if (i >= THREE_CDNS.length) return Promise.reject(new Error('three cdn unavailable'));
        return import(THREE_CDNS[i]).catch(function () { return loadThree(i + 1); });
    }

    // Lazy init only when the About section approaches the viewport.
    // On failure (e.g. transient CDN error) the static photo stays and the
    // next intersection retries.
    var lazyObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !started) {
                started = true;
                loadThree().then(function (THREE) {
                    lazyObserver.disconnect();
                    init(THREE);
                }).catch(function (err) {
                    started = false;
                    if (window.console && console.warn) console.warn('portrait3d: three.js unavailable', err);
                });
            }
        });
    }, { rootMargin: '600px 0px', threshold: 0 });
    lazyObserver.observe(wrapper);

    function init(THREE) {
        var isMobile = window.innerWidth <= 768;

        var canvas = document.createElement('canvas');
        canvas.className = 'portrait3d-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        wrapper.appendChild(canvas);

        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: window.devicePixelRatio < 1.8,
                powerPreference: 'low-power'
            });
        } catch (e) {
            canvas.remove();
            return;
        }
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(35, 1, 1, 5000);

        var group = new THREE.Group();
        scene.add(group);

        // --- Photo plane (unlit so the portrait stays true to the original) ---
        var texLoader = new THREE.TextureLoader();
        var photoMat = new THREE.MeshBasicMaterial({ transparent: false });
        var photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), photoMat);
        group.add(photoPlane);

        // --- Backing plates: charcoal plate + thin gold plate behind it ---
        var plateMat = new THREE.MeshStandardMaterial({
            color: 0x191613, roughness: 0.55, metalness: 0.35
        });
        var goldMat = new THREE.MeshStandardMaterial({
            color: 0xc9a227, roughness: 0.3, metalness: 0.85
        });
        var plate = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), plateMat);
        var goldPlate = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), goldMat);
        group.add(plate);
        group.add(goldPlate);

        // --- Cute red star (5-point, extruded with bevel) ---
        function starShape(outer, inner) {
            var shape = new THREE.Shape();
            for (var i = 0; i < 10; i++) {
                var r = (i % 2 === 0) ? outer : inner;
                var a = Math.PI / 2 + (i * Math.PI) / 5;
                var x = Math.cos(a) * r, y = Math.sin(a) * r;
                if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
            }
            shape.closePath();
            return shape;
        }
        var starMat = new THREE.MeshStandardMaterial({
            color: 0xd92b2b, roughness: 0.35, metalness: 0.15
        });
        var star = null; // built in layout() once we know the scale

        // --- Lights (cheap: 1 ambient, 1 key, 1 warm rim) ---
        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        var key = new THREE.DirectionalLight(0xfff4e0, 1.4);
        key.position.set(-200, 260, 400);
        scene.add(key);
        var rim = new THREE.PointLight(0xc9a227, 1.1, 0, 1.6);
        rim.position.set(180, -120, -160);
        scene.add(rim);

        // --- Layout: match photo plane to the on-screen .about-image rect ---
        var pw = 1, ph = 1, ox = 0, oy = 0, starR = 30;

        function layout() {
            var cRect = canvas.getBoundingClientRect();
            var iRect = aboutImage.getBoundingClientRect();
            var cw = Math.max(1, Math.round(cRect.width));
            var ch = Math.max(1, Math.round(cRect.height));

            renderer.setSize(cw, ch, false);
            camera.aspect = cw / ch;
            camera.position.z = (ch / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            camera.updateProjectionMatrix();

            pw = iRect.width;
            ph = iRect.height;
            ox = (iRect.left + iRect.width / 2) - (cRect.left + cRect.width / 2);
            oy = (iRect.top + iRect.height / 2) - (cRect.top + cRect.height / 2);

            photoPlane.scale.set(pw, ph, 1);
            photoPlane.position.set(ox, -oy, 0);

            plate.scale.set(pw + 16, ph + 16, 12);
            plate.position.set(ox, -oy, -8);
            goldPlate.scale.set(pw + 30, ph + 30, 5);
            goldPlate.position.set(ox + 10, -oy - 10, -16);

            starR = Math.max(20, Math.min(34, pw * 0.085));
            if (star) { star.parent.remove(star); star.geometry.dispose(); }
            var geo = new THREE.ExtrudeGeometry(starShape(starR, starR * 0.45), {
                depth: starR * 0.38, bevelEnabled: true,
                bevelThickness: starR * 0.1, bevelSize: starR * 0.08, bevelSegments: 2
            });
            geo.center();
            star = new THREE.Mesh(geo, starMat);
            group.add(star);
        }

        // --- Pointer parallax (desktop) / idle sway (mobile) ---
        var targetRX = 0, targetRY = 0;
        if (!isMobile) {
            window.addEventListener('pointermove', function (e) {
                var nx = (e.clientX / window.innerWidth) * 2 - 1;
                var ny = (e.clientY / window.innerHeight) * 2 - 1;
                targetRY = nx * 0.14;
                targetRX = -ny * 0.09;
            }, { passive: true });
        }

        // --- Animation ---
        var t = 0, last = 0, running = false, revealed = false;

        function frame(now) {
            if (!running) return;
            requestAnimationFrame(frame);
            var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
            last = now;
            t += dt;

            if (isMobile) {
                targetRY = Math.sin(t * 0.5) * 0.06;
                targetRX = Math.cos(t * 0.4) * 0.04;
            }
            group.rotation.y += (targetRY - group.rotation.y) * 0.06;
            group.rotation.x += (targetRX - group.rotation.x) * 0.06;

            if (star) {
                // Inclined orbit around the portrait: in front at the bottom,
                // behind the plate at the top — with a cute bounce + spin.
                var a = t * 0.7;
                var bounce = Math.abs(Math.sin(t * 2.2)) * starR * 0.45;
                star.position.set(
                    ox + Math.cos(a) * (pw * 0.62),
                    -oy + Math.sin(a) * (ph * 0.58) + bounce,
                    Math.sin(a) * 120 + 40
                );
                star.rotation.y = t * 1.1;
                star.rotation.z = Math.sin(t * 2.6) * 0.18;
                var squash = 1 + Math.sin(t * 4.4) * 0.06;
                star.scale.set(1, squash, 1);
            }

            renderer.render(scene, camera);
        }

        function setRunning(on) {
            if (on === running) return;
            running = on;
            if (on) { last = performance.now(); requestAnimationFrame(frame); }
        }

        // Pause when off-screen or tab hidden
        var visObserver = new IntersectionObserver(function (entries) {
            setRunning(entries[0].isIntersecting && !document.hidden && revealed);
        }, { rootMargin: '100px 0px' });
        visObserver.observe(wrapper);
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) setRunning(false);
            else if (revealed) setRunning(wrapper.getBoundingClientRect().bottom > -100 &&
                wrapper.getBoundingClientRect().top < window.innerHeight + 100);
        });

        var ro = new ResizeObserver(function () { layout(); });
        ro.observe(wrapper);
        window.addEventListener('resize', function () {
            isMobile = window.innerWidth <= 768;
            layout();
        }, { passive: true });

        // Reveal only after the portrait texture is ready (no flash of empty plate)
        texLoader.load(
            photo.currentSrc || photo.src,
            function (tex) {
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
                photoMat.map = tex;
                photoMat.needsUpdate = true;
                layout();
                renderer.render(scene, camera);
                revealed = true;
                wrapper.classList.add('p3d-active');
                setRunning(true);
            },
            undefined,
            function () { canvas.remove(); } // texture failed: keep static photo
        );
    }
})();
