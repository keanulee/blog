---
layout: post
title: Extending the &lt;google-map> Element
tags: polymer web
---

<link rel="import" href="/bower_components/google-map/google-map.html">
<link rel="import" href="/bower_components/geojson-data/geojson-data.html">

<style>
google-map {
  display: block;
  height: 300px;
}
</style>

The [`<google-map>`] element is one of my favourite custom elements. Why? I think it's a great example of how powerful encapsulation is in the world of Web Components. If you wanted to include Google Maps on your website before, you would have to use the [JavaScript API](https://developers.google.com/maps/documentation/javascript/tutorial), which involves:

1. Creating an empty `<div>` element on the page
2. Loading the external script [https://maps.googleapis.com/maps/api/js](https://maps.googleapis.com/maps/api/js)
3. Writing a custom callback function to invoke once the script has loaded, and use this function to customize the map

Even the "simple example" they give uses no less than 9 lines of JavaScript, all for a basic map that is centered around a given coordiate.

With web components, the same effect can be accomplished with all HTML, no JavaScript. Here's the example on the [Polymer Project's hompage](https://www.polymer-project.org/):

{% highlight html %}
<!-- Polyfill Web Components support for older browsers -->
<script src="components/platform/platform.js"></script>

<!-- Import element -->
<link rel="import" href="google-map.html">

<!-- Use element -->
<google-map lat="37.790" long="-122.390"></google-map>
{% endhighlight %}

Demo:

<google-map lat="37.790" long="-122.390"></google-map>

You can even do fancy things, like setting the zoom level and adding a custom map marker, all declartively in HTML. This is an adapted example from the [`<google-map>`] repository:

{% highlight html %}
<google-map latitude="37.779" longitude="-122.3892" zoom="15">
  <google-map-marker latitude="37.779" longitude="-122.3892" title="Go Giants!">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/San_Francisco_Giants_Cap_Insignia.svg/200px-San_Francisco_Giants_Cap_Insignia.svg.png" />
  </google-map-marker>
</google-map>
{% endhighlight %}

Demo:

<google-map latitude="37.779" longitude="-122.3892" zoom="15">
  <google-map-marker latitude="37.779" longitude="-122.3892" title="Go Giants!">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/San_Francisco_Giants_Cap_Insignia.svg/200px-San_Francisco_Giants_Cap_Insignia.svg.png" />
  </google-map-marker>
</google-map>


## Drawing Regions

But what if you wanted to do more, like highlighting a particular country/province/state? There's a [JavaScript API](https://developers.google.com/maps/documentation/javascript/3.exp/reference#Data) to add [GeoJSON](http://geojson.org/) to the map, but what about declaratively with HTML?

With the [`<geojson-data>`] element, you can retrieve GeoJSON data for a particular country/province/state and bind it to a [`<google-map>`] element. You can even bind multiple data elements to one map to draw multiple regions.

{% highlight html %}
{% raw %}
<template is="auto-binding">
  <geojson-data country="CAN" region="AB" map="{{map}}" key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"></geojson-data>
  <geojson-data country="USA" region="CA" map="{{map}}" key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"></geojson-data>
  <geojson-data country="MEX" scale="110m" map="{{map}}" key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"></geojson-data>

  <google-map zoom="2" map="{{map}}"></google-map>
</template>
{% endraw %}
{% endhighlight %}

Demo:

{% raw %}
<template is="auto-binding">
  <geojson-data country="CAN" region="AB" map="{{map}}" key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"></geojson-data>
  <geojson-data country="USA" region="CA" map="{{map}}" key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"></geojson-data>
  <geojson-data country="MEX" scale="110m" map="{{map}}" key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"></geojson-data>

  <google-map zoom="2" map="{{map}}"></google-map>
</template>
{% endraw %}

The attributes are:

* `country` - The 3-letter ISO 3166-1 country code.
* `region` - (Optional) The 2-letter ISO ISO 3166-2 country subdivision code (A.K.A. the province/state abbreviation).
* `scale` - (Optional) The scale of the GeoJSON data to use. Can be '10m' (highest resolution), '50m', or '110m'. Defaults to '50m'.
* `map` - The map object to bind to.
* `key` - A [Fusion Tables API] key.

## Using the Fusion Tables API

At this point you might be wondering, "Why do I need a [Fusion Tables API] key?" Well, that's because the Google Maps API doesn't actually provide the GeoJSON data we need to highlight the map. One reliable source is the [Natural Earth Tables on Google Fusion Tables](https://www.google.com/fusiontables/DataSource?dsrcid=394713), which is accessible through the [Fusion Tables API].

To access the [Fusion Tables API], I created an intermediary [`<fusion-tables-data>`] element that acts like [`<core-ajax>`], but instead of a URL, it takes a Fusion Tables SQL query and an API key. Like [`<core-ajax>`], you can bind to the `response` attribute. I find that abstracting the specifics of building the URL and setting the headers provides cleaner looking code.

{% highlight html %}
{% raw %}
<fusion-tables-data
  query="SELECT * FROM <table_id>"
  key="AIzaSyAQuo91bcoB-KwWXaANroTrzpNZRFcNJ1k"
  response="{{response}}"></fusion-tables-data>
{% endraw %}
{% endhighlight %}

If you look at the [implementation of `<geojson-data>`](https://github.com/PolymerLabs/geojson-data/blob/master/geojson-data.html), you can see that it contains a [`<fusion-tables-data>`] element, and the `.responseChanged()` method sets the `.geojson` property and updates the map. It also contains the code to build the Fusion Tables SQL query.

**Note:** As with the [previous post]({{page.previous.url}}), the API key in the above examples is restricted to requests from this domain only. You can create your own public browser API key for the Fusion Tables API on the [Google Developers Console](https://console.developers.google.com).

[`<google-map>`]: https://github.com/GoogleWebComponents/google-map
[`<geojson-data>`]: https://github.com/polymerlabs/geojson-data
[Fusion Tables API]: https://developers.google.com/fusiontables/
[`<fusion-tables-data>`]: https://github.com/polymerlabs/fusion-tables-data
[`<core-ajax>`]: https://github.com/polymer/core-ajax
