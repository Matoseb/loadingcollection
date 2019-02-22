__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', { value: !0 });
    var t = -1,
        n = i(d[0])(1, .25, 1, .25),
        s = 'ANIM_MODE_SOLID',
        o = 'ANIM_MODE_SPINNING',
        h = 'ANIM_MODE_STOPPING',
        u = (function() {
            function u(t) { this.animStartTime = 0, this.lastFrameStartTime = 0, this.animMode = s, this.segments = [], this.invalidated = !1, this.onInvalidate = t }
            var p = u.prototype;
            return p.invalidate = function() { this.invalidated || (this.invalidated = !0, this.onInvalidate()) }, p.setAnimMode = function(t) { t !== this.animMode && (this.animMode = t, this.invalidate()) }, p.startSpinning = function(n) {
                var s = (void 0 === n ? {} : n).count,
                    h = void 0 === s ? t : s;
                this.createSegmentsForSpinning({ spinCount: h }), this.animStartTime = this.lastFrameStartTime = Date.now(), this.setAnimMode(o)
            }, p.stopSpinning = function() { this.animMode !== s && this.animMode !== h && this.setAnimMode(h) }, p.spinOnce = function() { this.startSpinning({ count: 1 }) }, p.spinOnceIntoFullRing = function() { this.createSegmentsForSpinning({ spinCount: 1 }), this.animStartTime = this.lastFrameStartTime = Date.now() - 1e3, this.setAnimMode(o) }, p.draw = function(t, n) {
                var u = n.bounds,
                    l = n.lineWidth,
                    p = Date.now() - this.lastFrameStartTime;
                switch (this.lastFrameStartTime = Date.now(), this.invalidated = !1, t.clearRect(-1, -1, u.width + 2, u.height + 2), this.animMode) {
                    case o:
                        var c = p / 2e3;
                        this.updateAndDrawSegmentsForSpinning(t, { bounds: u, progressAmount: c, lineWidth: l });
                        break;
                    case h:
                        var v = p / 2e3;
                        this.updateAndDrawSegmentsForStopping(t, { bounds: u, progressAmount: v, lineWidth: l });
                        break;
                    case s:
                        this.drawSolidCircle(t, { bounds: u, lineWidth: l });
                        break;
                    default:
                        i(d[1])('unexpected animMode')
                }
            }, p.drawSolidCircle = function(t, n) {
                var s = n.bounds;
                n.lineWidth;
                t.save(), t.beginPath(), t.arc(s.centerX, s.centerY, s.radius, 0, 2 * Math.PI), t.stroke(), t.restore()
            }, p.createSegmentsForSpinning = function(t) {
                var n = t.spinCount;
                this.createSegments({ spinCount: n, delayIncrement: .03333333333333333, useIterpolator: !0 })
            }, p.createSegmentsForHighlighting = function() { this.createSegments({ spinCount: t, delayIncrement: .016666666666666666, useIterpolator: !0 }) }, p.createSegments = function(t) {
                for (var s = t.spinCount, o = t.delayIncrement, h = t.useIterpolator, u = void 0 === h || h, p = [], c = 30; --c >= 0;) {
                    var v = u ? n(o * c) : o * c;
                    p.push(new l({ segmentIndex: c, startDelay: -v, maxIterations: s }))
                }
                this.segments = p
            }, p.updateAndDrawSegmentsForSpinning = function(t, n) {
                var s = n.bounds,
                    o = n.progressAmount,
                    h = n.lineWidth;
                this.updateAndDrawSegments(t, { bounds: s, gradientRotationDuration: 8e3, progressAmount: o, ringRotationDuration: 8e3, lineWidth: h })
            }, p.updateAndDrawSegmentsForStopping = function(t, n) {
                var o = n.bounds,
                    h = n.progressAmount,
                    u = n.lineWidth;
                t.save(), t.beginPath();
                var l = (Date.now() - this.animStartTime) / 8e3 * 360 % 360,
                    p = !1,
                    c = !0,
                    v = !1,
                    S = void 0;
                try {
                    for (var f, D = this.segments[Symbol.iterator](); !(c = (f = D.next()).done); c = !0) {
                        var w = f.value;
                        w.updateAndDrawForStopping(t, { bounds: o, progressAmount: h, ringRotation: l, lineWidth: u }), 1 !== w.progress && (p = !0)
                    }
                } catch (t) { v = !0, S = t } finally { try { c || null == D.return || D.return() } finally { if (v) throw S } } p || this.setAnimMode(s), t.stroke(), t.restore(), this.invalidate()
            }, p.updateAndDrawSegments = function(t, n) {
                var s = n.bounds,
                    h = (n.gradientRotationDuration, n.progressAmount),
                    u = n.ringRotationDuration,
                    l = n.lineWidth;
                t.save(), t.beginPath();
                var p = (Date.now() - this.animStartTime) / u * 360 % 360,
                    c = !1,
                    v = !0,
                    S = !1,
                    f = void 0;
                try {
                    for (var D, w = this.segments[Symbol.iterator](); !(v = (D = w.next()).done); v = !0) {
                        var I = D.value;
                        switch (this.animMode) {
                            case o:
                                I.updateAndDrawForSpinning(t, { bounds: s, progressAmount: h, ringRotation: p, lineWidth: l });
                                break;
                            default:
                                i(d[1])('unexpected animMode')
                        }
                        I.isTerminated() || (c = !0)
                    }
                } catch (t) { S = !0, f = t } finally { try { v || null == w.return || w.return() } finally { if (S) throw f } } c || this.stopSpinning(), t.stroke(), t.restore(), this.invalidate()
            }, u
        })(),
        l = (function() {
            function s(n) {
                var s = n.segmentIndex,
                    o = n.startDelay,
                    h = n.maxIterations,
                    u = void 0 === h ? t : h;
                this.progress = 0, this.segmentIndex = s, this.startDelay = o, this.maxIterations = u
            }
            var o = s.prototype;
            return o.isTerminated = function() { return 0 === this.maxIterations && 1 === this.progress }, o.updateAndDrawForSpinning = function(t, s) {
                var o = s.bounds,
                    h = s.progressAmount,
                    u = s.ringRotation,
                    l = s.lineWidth;
                this.startDelay < 0 && (this.startDelay += h), this.startDelay > 0 ? (this.progress += this.startDelay, this.startDelay = 0) : 0 === this.startDelay && (this.progress += h), this.progress > 1 && (this.maxIterations > 0 && this.maxIterations--, 0 !== this.maxIterations ? this.progress = this.progress % 1 : this.progress = 1);
                var p;
                this.progress < 0 ? p = 0 : this.progress < .5 ? (p = 2 * this.progress, p = 1 - n(1 - p)) : (p = 2 * this.progress - 1, p = n(p = 1 - p)), this.drawSegment(t, { allowShrinkToZero: !0, bounds: o, ringRotation: u, segmentSizeProgress: p, activeStrokeWidth: l })
            }, o.updateAndDrawForStopping = function(t, s) {
                var o = s.bounds,
                    h = s.progressAmount,
                    u = s.ringRotation,
                    l = s.lineWidth;
                this.progress < .5 && (this.progress = 1 - this.progress), this.progress += h, this.progress > 1 && (this.progress = 1);
                var p = 2 * this.progress - 1;
                p = n(p = 1 - p), this.drawSegment(t, { allowShrinkToZero: !0, bounds: o, ringRotation: u, segmentSizeProgress: p, activeStrokeWidth: l })
            }, o.drawSegment = function(t, n) {
                var s = n.activeStrokeWidth,
                    o = n.allowShrinkToZero,
                    h = n.bounds,
                    u = n.ringRotation,
                    l = n.segmentSizeProgress;
                t.save();
                var p = 12 * (1 - l);
                o || (p = Math.max(p, .1));
                var c = u + (270 + 12 * this.segmentIndex - 6 - p / 2);
                if (o) {
                    var v = 2 * Math.PI * h.radius * p / 360;
                    t.lineWidth = v < s ? v : s
                }
                t.lineWidth !== s && (t.stroke(), t.beginPath());
                var S = 2 * c * Math.PI / 360,
                    f = 2 * p * Math.PI / 360;
                t.moveTo(h.centerX + Math.cos(S) * h.radius, h.centerY + Math.sin(S) * h.radius), t.arc(h.centerX, h.centerY, h.radius, S, S + f), t.lineWidth !== s && (t.stroke(), t.beginPath()), t.restore()
            }, s
        })(),
        p = u;
    e.default = p
}, 917915, [917916, 6029420]);