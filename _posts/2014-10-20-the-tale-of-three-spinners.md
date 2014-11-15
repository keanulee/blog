---
layout: post
title: The Tale of Three Spinners
tags: polymer web css animations
---

<link rel="import" href="/bower_components/paper-toggle-button/paper-toggle-button.html">
<link rel="import" href="/bower_components/paper-spinner/paper-spinner.html">
<link rel="import" href="/bower_components/core-animation/core-animation.html">
<link rel="import" href="/bower_components/core-animation/core-animation-group.html">
<link rel="import" href="/bower_components/core-animation/core-animation-group.html">

Last week I was tasked with improving [`<paper-spinner>`], a Polymer element that implements the so-called ["circular activity indicator"](http://www.google.com/design/spec/components/progress-activity.html) in Google's [Material Design spec](http://www.google.com/design/spec/material-design/introduction.html). It has a simple yet slick animation, and at first glance it may seem simple to create one of these spinners using purely web technologies (no GIFs allowed!). However, once you actually start trying to build one, you'll realize it's difficult to get all the growing/shrinking, rotating, and color animations to be on the right timing, not to mention making the spinner perform well, even when there's heavy JavaScript computation happening at the same time (you are displaying a spinner to show the user that something is happening, right?).

## Exhibit A - The Fancy, CSS-Animated SVG Spinner

[The first spinner](https://github.com/PolymerLabs/paper-spinner/tree/6e694de4bf598b1fa1c50f5abd0143ff51635437) was created by a colleague a while ago, and I used it as a starting point to build my spinner. It animates the `stroke-dashoffset` (i.e. where the dashed-border begins) of a custom SVG path for the growing/shrinking animation, and rotates the the entire path in step intervals to make it appear as if the arc starts growing from where it shrank to at the previous iteration. The path's stroke color is animated from blue to red to yellow to green, and the container `<span>` is rotated at a different rate to make the animation appear random. With [relatively little work](https://github.com/PolymerLabs/paper-spinner/compare/6e694de4bf598b1fa1c50f5abd0143ff51635437...5c1e741d854b984ef61f39bd22ee8c642dd463a9), I was able to get this spinner working on Chrome, Safari and Firefox.

<style>
path.dash-reset {
  stroke-dasharray: 58.9;
  stroke-dashoffset: 58.9;
}

path.fillunfill {
  -webkit-animation: fillunfill 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
  animation: fillunfill 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
}

path.steprotate {
  -webkit-animation: fillunfill 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite, rot 5332ms steps(4) infinite;
  animation: fillunfill 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite, rot 5332ms steps(4) infinite;
}

path.colors {
  -webkit-animation: fillunfill 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite, rot 5332ms steps(4) infinite, colors 5332ms linear infinite;
  animation: fillunfill 1333ms cubic-bezier(0.4, 0.0, 0.2, 1) infinite, rot 5332ms steps(4) infinite, colors 5332ms linear infinite;
}

span.spinner-container {
  display: inline-block;
  width: 28px;
  height: 28px;
}

span.rotate {
  -webkit-animation: rotate 1568.63ms linear infinite;
  animation: rotate 1568.63ms linear infinite;
}

/* Filling and unfilling the arc */
@-webkit-keyframes fillunfill {
  from {
    stroke-dashoffset: 175.13; /* 2*RADIUS*PI * ARCSIZE/360 * 3 - STROKEWIDTH/2 */
  }
  50% {
    stroke-dashoffset: 117.75; /* 2*RADIUS*PI * ARCSIZE/360 * 2 */
  }
  to {
    stroke-dashoffset: 60.38; /* 2*RADIUS*PI * ARCSIZE/360 + STROKEWIDTH/2 */
  }
}

@keyframes fillunfill {
  from {
    stroke-dashoffset: 175.13; /* 2*RADIUS*PI * ARCSIZE/360 * 3 - STROKEWIDTH/2 */
  }
  50% {
    stroke-dashoffset: 117.75; /* 2*RADIUS*PI * ARCSIZE/360 * 2 */
  }
  to {
    stroke-dashoffset: 60.38; /* 2*RADIUS*PI * ARCSIZE/360 + STROKEWIDTH/2 */
  }
}

/**
 * Since Firefox does not support transform-origin in SVG (see
 * https://bugzilla.mozilla.org/show_bug.cgi?id=923193), we translate
 * the path to the origin, rotate, and translate back instead.
 */
@-webkit-keyframes rot {
  from {
    -webkit-transform: translate(14px, 14px) rotate(0deg) translate(-14px, -14px);
    /* CONTAINERWIDTH/2, CONTAINERWIDTH/2 */
  }
  to {
    -webkit-transform: translate(14px, 14px) rotate(-360deg) translate(-14px, -14px);
    /* CONTAINERWIDTH/2, CONTAINERWIDTH/2 */
  }
}

@keyframes rot {
  from {
    transform: translate(14px, 14px) rotate(0deg) translate(-14px, -14px);
    /* CONTAINERWIDTH/2, CONTAINERWIDTH/2 */
  }
  to {
    transform: translate(14px, 14px) rotate(-360deg) translate(-14px, -14px);
    /* CONTAINERWIDTH/2, CONTAINERWIDTH/2 */
  }
}

@-webkit-keyframes colors {
  0% {
    stroke: #4285f4;
  }
  18% {
    stroke: #4285f4;
  }
  25% {
    stroke: #db4437;
  }
  43% {
    stroke: #db4437;
  }
  50% {
    stroke: #f4b400;
  }
  68% {
    stroke: #f4b400;
  }
  75% {
    stroke: #0f9d58;
  }
  93% {
    stroke: #0f9d58;
  }
  100% {
    stroke: #4285f4;
  }
}

@keyframes colors {
  0% {
    stroke: #4285f4;
  }
  18% {
    stroke: #4285f4;
  }
  25% {
    stroke: #db4437;
  }
  43% {
    stroke: #db4437;
  }
  50% {
    stroke: #f4b400;
  }
  68% {
    stroke: #f4b400;
  }
  75% {
    stroke: #0f9d58;
  }
  93% {
    stroke: #0f9d58;
  }
  100% {
    stroke: #4285f4;
  }
}

/* Rotating the whole thing */
@-webkit-keyframes rotate {
  from {-webkit-transform: rotate(0deg);}
  to {-webkit-transform: rotate(360deg);}
}

@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
</style>

<span class="spinner-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
    <path d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14"/>
  </svg>
</span>
<span class="spinner-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
    <path fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke="#4285f4" stroke-width="3" stroke-linecap="round"/>
  </svg>
</span>
<span class="spinner-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
    <path class="dash-reset fillunfill" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke="#4285f4" stroke-width="3" stroke-linecap="round"/>
  </svg>
</span>
<span class="spinner-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
    <path class="dash-reset steprotate" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke="#4285f4" stroke-width="3" stroke-linecap="round"/>
  </svg>
</span>
<span class="spinner-container">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
    <path class="dash-reset colors" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke="#4285f4" stroke-width="3" stroke-linecap="round"/>
  </svg>
</span>
<span class="spinner-container rotate">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
    <path class="dash-reset colors" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke="#4285f4" stroke-width="3" stroke-linecap="round"/>
  </svg>
</span>

This is a purely CSS animations - no JavaScript needed. However, this spinner does not work on Internet Explorer since IE does not support CSS animations for SVG elements. Also, some of the CSS properties that are animated, such as `stroke` and `stroke-dashoffset`, [are expensive to animate since they will trigger the browser to repaint](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/). This is especially apparent if you [Show paint rectangles](https://developer.chrome.com/devtools/docs/rendering-settings#show-paint rectangles) in Chrome DevTools, or use the toggle button below to do some heavy JavaScript computations:

{% raw %}
<blockquote>
  <template id="heavy" is="auto-binding">
    <paper-toggle-button id="toggle" on-change="{{change}}" style="float: left;"></paper-toggle-button>
    Do Heavy JavaScript (WARNING: may temporarily slow down your browser. Works best on Chrome/Firefox.)
  </template>
  <script>
    var heavy = document.querySelector('#heavy');
    heavy.change = function() {
      (function heavyStuff() {
        if (heavy.$.toggle.checked) {
          console.log('Doing Heavy JavaScript...');
          for (var i = 0; i < 99999999; i++) {
            Math.pow(i, i * i);
          }
          window.setTimeout(heavyStuff, 100);
        }
      })();
    }
  </script>
</blockquote>
{% endraw %}

Doing heavy JavaScript causes the repaints to block, which means the spinner will be much slower.

## Exhibit B - The IE-Compatible, JS-Animated SVG Spinner

To make the spinner compatible on Internet Explorer, I had to move to JavaScript animations. Using [`<core-animation>`](https://github.com/Polymer/core-animation) (which uses [web-animations-js](https://github.com/web-animations/web-animations-js/)), I was able to move _most_ of the animation declarations from CSS to HTML. The only exception was CSS `transform`, which IE does not support for SVG elements. So instead, I wrote a custom animation effect which sets the `transform` attribute on the `<path>` element (remember that SVG elements have this `transform` attribute, but not regular HTML elements).

{% highlight javascript %}
rotateSpinnerEffect: function(timeFraction, target, animation) {
  // IE does not support CSS transforms on SVG elements, so we use SVG transforms instead.
  target.setAttribute('transform',
    'translate(14, 14) rotate(-' + (timeFraction * 360) + ') translate(-14, -14)');
},
{% endhighlight %}

{% raw %}
<template id="cap" is="auto-binding">

  <core-animation-group id="spinAnimation">
    <!-- duration = 360 * ARCTIME / (ARCSTARTROT + (360-ARCSIZE)) -->
    <core-animation target="{{$.spinContainer}}" duration="1568.63" iterations="Infinity" easing="linear">
      <core-animation-keyframe>
        <core-animation-prop name="transform" value="rotate(0deg)">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="transform" value="rotate(360deg)">
        </core-animation-prop>
      </core-animation-keyframe>
    </core-animation>

    <!-- duration = ARCTIME -->
    <core-animation target="{{$.spinner}}" duration="1333" iterations="Infinity" easing="cubic-bezier(0.4, 0.0, 0.2, 1)">
      <core-animation-keyframe>
        <!-- value = 2*RADIUS*PI * ARCSIZE/360 * 3 - STROKEWIDTH/2 -->
        <core-animation-prop name="strokeDashoffset" value="175.13">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <!-- value = 2*RADIUS*PI * ARCSIZE/360 * 2 -->
        <core-animation-prop name="strokeDashoffset" value="117.75">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <!-- value = 2*RADIUS*PI * ARCSIZE/360 + STROKEWIDTH/2 -->
        <core-animation-prop name="strokeDashoffset" value="60.38">
        </core-animation-prop>
      </core-animation-keyframe>
    </core-animation>

    <!-- duration = 4*ARCTIME -->
    <core-animation id="rotateSpinnerAnimation" target="{{$.spinner}}" duration="5332" iterations="Infinity" easing="steps(4, end)" customEffect="{{rotateSpinnerEffect}}">
    </core-animation>

    <!-- duration = 4*ARCTIME -->
    <core-animation target="{{$.spinner}}" duration="5332" iterations="Infinity" easing="linear">
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0" value="#4285f4">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.18" value="#4285f4">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.25" value="#db4437">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.43" value="#db4437">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.5" value="#f4b400">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.68" value="#f4b400">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.75" value="#0f9d58">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="0.93" value="#0f9d58">
        </core-animation-prop>
      </core-animation-keyframe>
      <core-animation-keyframe>
        <core-animation-prop name="stroke" offset="1" value="#4285f4">
        </core-animation-prop>
      </core-animation-keyframe>
    </core-animation>
  </core-animation-group>

  <span id="spinContainer" class="spinner-container">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" height="28" width="28">
      <path id="spinner" class="dash-reset" fill="none" d="M 14,1.5 A 12.5,12.5 0 1 1 1.5,14" stroke-width="3" stroke-linecap="round"/>
    </svg>
  </span>
</template>
<script>
  var cap = document.querySelector('#cap');
  cap.rotateSpinnerEffect = function(timeFraction, target, animation) {
    // IE does not support CSS transforms on SVG elements, so we use SVG transforms instead.
    target.setAttribute('transform',
      'translate(14, 14) rotate(-' + (timeFraction * 360) + ') translate(-14, -14)');
  };
  cap.addEventListener('template-bound', function() {
    // HACK: Add support for CSS animations for select SVG properties needed for the demo.
    // Code derived from https://github.com/web-animations/web-animations-next.
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var context = canvas.getContext('2d');

    function parseColor(string) {
      string = string.trim();
      // The context ignores invalid colors
      context.fillStyle = '#000';
      context.fillStyle = string;
      var contextSerializedFillStyle = context.fillStyle;
      context.fillStyle = '#fff';
      context.fillStyle = string;
      if (contextSerializedFillStyle != context.fillStyle)
        return;
      context.fillRect(0, 0, 1, 1);
      var pixelColor = context.getImageData(0, 0, 1, 1).data;
      context.clearRect(0, 0, 1, 1);
      var alpha = pixelColor[3] / 255;
      return [pixelColor[0] * alpha, pixelColor[1] * alpha, pixelColor[2] * alpha, alpha];
    }

    function round(left, right) {
      return [left, right, Math.round];
    }

    webAnimationsMinifill.addPropertiesHandler(parseColor, webAnimationsMinifill.mergeColors,
      ['stroke']);
    webAnimationsMinifill.addPropertiesHandler(webAnimationsMinifill.parseNumber, round,
      ['stroke-dashoffset', 'stroke-width']);

    // HACK: "Polyfill" classList on the spinner SVG element (for IE).
    if (!this.$.spinner.classList) {
      this.$.spinner.classList = {
        add: function() {/* noop */},
        remove: function() {/* noop */}
      };
    }
    this.$.spinAnimation.play();
  });
</script>
{% endraw %}

Even though this spinner looks great on all the browsers, it's still not a great spinner. Why?
It's perhaps even worse than the first spinner in terms of performance, since JavaScript must be executed to perform the animation (try toggling the heavy JavaScipt button above again and look at this spinner).

## Exhibit C - The GPU-Accelerated, Clipped Semi-Circles Spinner

I needed a new way to animate the growing/shrinking arc, so I searched for ["animate circle filling css"](http://lmgtfy.com/?q=animate+circile+filling+css). I was inspired by [this example](http://examples.fromanegg.com/pure-css3-radial-progress-bar-examples.html), which simulated the effect by rotating semi-circles in and out of view. The semi-circles are just a `<div>` with `border-radius: 50%` and transparent bottom and left borders. However, this example does has some shortcomings:

* When the circle reaches halfway, the `clip` property is animated. This requires the browser to repaint.
* It uses the CSS `clip` property, [which is deprecated](https://developer.mozilla.org/en-US/docs/Web/CSS/clip). The successor, the [`clip-path` property](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path), is [not supported by IE](http://caniuse.com/#feat=css-clip-path).

Instead of using CSS `clip`, I decided to put the rotating circle into a `<div>` with `overflow: hidden`, which has the same effect and is cross-browser compatible. I also opted to animate the two semi-circles from the middle out, which means I don't have trigger any repaints.

To animate the color transitions, I created semi-circles for each of the four colors and animated the CSS `opacity` property for each one. That way, it can be GPU-accelerated.

<style shim-shadowdom>
paper-spinner.no-patch::shadow .gap-patch {
  display: none;
}

paper-spinner.container-frozen::shadow #spinnerContainer.active {
  -webkit-animation: none;
  animation: none;
}

paper-spinner.frozen::shadow .active .spinner-layer {
  -webkit-animation-play-state: paused, running;
  animation-play-state: paused, running;
}

paper-spinner.split-view {
  width: 56px;
}

paper-spinner.split-view::shadow .circle-clipper.right .circle {
  left: 0;
}

paper-spinner.split-view::shadow .circle-clipper .circle {
  width: 100%;
}

paper-spinner.alternate-colors::shadow .spinner-layer.blue .circle-clipper.right .circle,
paper-spinner.alternate-colors::shadow .spinner-layer.red .circle-clipper.left .circle,
paper-spinner.alternate-colors::shadow .spinner-layer.yellow .circle-clipper.right .circle,
paper-spinner.alternate-colors::shadow .spinner-layer.green .circle-clipper.left .circle {
  display: none;
}

paper-spinner.no-colors::shadow .spinner-layer.blue {
  opacity: 1;
}

paper-spinner.no-rotate::shadow .circle-clipper .circle {
  -webkit-transform: none;
  transform: none;
}

paper-spinner.cover-clipped::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 25%;
  right: 25%;
  background-color: #CCC;
  content: '';
}
</style>

<paper-spinner class="no-patch container-frozen frozen split-view no-colors no-rotate"></paper-spinner>
<paper-spinner class="no-patch container-frozen frozen split-view no-colors"></paper-spinner>
<paper-spinner active class="no-patch container-frozen frozen split-view alternate-colors"></paper-spinner>
<paper-spinner active class="no-patch container-frozen frozen split-view"></paper-spinner>
<paper-spinner active class="no-patch container-frozen frozen split-view cover-clipped"></paper-spinner>
<paper-spinner active class="no-patch container-frozen frozen"></paper-spinner>
<paper-spinner active class="no-patch container-frozen"></paper-spinner>
<paper-spinner active class="no-patch"></paper-spinner>

The end result? A spinner that is fast and doesn't trigger any repaints. Here's some examples of [`<paper-spinner>`] in use, and how it can be customized.

<style shim-shadowdom>
paper-spinner.big {
  width: 40px;
  height: 40px;
}

paper-spinner.thick::shadow .circle {
  border-width: 6px;
}

paper-spinner.thin::shadow .circle {
  border-width: 1px;
}

paper-spinner.color {
  background-color: #4285f4;
}

paper-spinner.color::shadow .circle {
  border-color: #FFF;
}
</style>

<paper-spinner active></paper-spinner>
<paper-spinner active class="big"></paper-spinner>
<paper-spinner active class="thick"></paper-spinner>
<paper-spinner active class="thin"></paper-spinner>
<paper-spinner active class="color"></paper-spinner>

**Update (Nov 14, 2014):** After the original implementation was published, observant readers have discovered that as the spinner was rotating, there is a small but noticable transparent gap in the middle of the arc. This is because in many browsers (including Chrome 38, Safari 7.1, and IE 11), the gap between two adjacent `display: inline-block; overflow: hidden;` elements is visible while the container is playing a rotation animation (Firefox is the only browser that doesn't have this issue).

To overcome this unfortunate rendering issue, I added a "patch" (another `div.circle`) to cover up the gap. The difference can be observed below (the spinner on the right has the patch).

<paper-spinner active class="no-patch"></paper-spinner>
<paper-spinner active></paper-spinner>

[`<paper-spinner>`]: https://github.com/Polymer/paper-spinner
