---
layout: post
title: Welcome to Polymer!
tags: polymer web
---

<link rel="import" href="/bower_components/polymer-chauffeur/polymer-chauffeur.html">
<link rel="import" href="/bower_components/paper-input/paper-input.html">

_Last month I started an internship with the [Polymer](https://www.polymer-project.org/) team at Google for my last [co-op term](https://uwaterloo.ca/hire/), and I'm starting a tech blog to showcase some of the things that I'm working on. Although I have already published to several changes to the [Polymer](https://github.com/Polymer) and [PolymerLabs](https://github.com/PolymerLabs) GitHub orgs, I am retroactively writing posts to cover some of the first Polymer elements I've created. This blog itself is a work in progress, so if you don't like the design, stick around and give me some suggestions!_

[Uber](https://www.uber.com/) recently released [an API](https://developer.uber.com/) that allows developers to integrate information about their products and offer time estimates. For this example app, I wanted to incorporate Google Maps so that users can get a list of Uber products and time estimates for a given map query.

The first component, [`<uber-products>`], displays a list of Uber products given the latitude and longitude specified in its attributes.

{% highlight html %}
<uber-products
  latitude="37.77493"
  longitude="-122.41942"
  servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
</uber-products>
{% endhighlight %}

Demo:

<uber-products
  latitude="37.77493"
  longitude="-122.41942"
  servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
</uber-products>

[`<uber-estimates-time>`] does a similar thing, but displays time estimates as well. I named the element uber-estimates-time since the URL endpoint for the API is [/estimates/time](https://developer.uber.com/v1/endpoints/#time-estimates), but now I realized it's a little backwards-sounding.

{% highlight html %}
<uber-estimates-time
  latitude="37.77493"
  longitude="-122.41942"
  servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
</uber-estimates-time>
{% endhighlight %}

Demo:

<uber-estimates-time
  latitude="37.77493"
  longitude="-122.41942"
  servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
</uber-estimates-time>

Now let's put these components together with a [`<google-map>`](https://github.com/GoogleWebComponents/google-map) element. With [Polymer's data binding](http://www.polymer-project.org/docs/polymer/databinding.html), you can combine several elements without needing to write JavaScript code. Here's an example:

{% highlight html %}
{% raw %}
<template is="auto-binding">
  <paper-input
    floatingLabel
    id="paper_input"
    label="Location"
    value="345 Spear St. San Francisco">
  </paper-input>

  <google-map-search
    map="{{map}}"
    query="{{$.paper_input.value}}"
    result="{{result}}">
  </google-map-search>

  <google-map
    block
    map="{{map}}"
    latitude="{{result.latitude}}"
    longitude="{{result.longitude}}"
    style="height: 200px">
    <google-map-marker
      latitude="{{result.latitude}}"
      longitude="{{result.longitude}}">
    </google-map-marker>
  </google-map>

  <uber-estimates-time
    latitude="{{result.latitude}}"
    longitude="{{result.longitude}}"
    servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
  </uber-estimates-time>
</template>
{% endraw %}
{% endhighlight %}

Demo:

{% raw %}
<template is="auto-binding">
  <paper-input
    floatingLabel
    id="paper_input"
    label="Location"
    value="345 Spear St. San Francisco">
  </paper-input>

  <google-map-search
    map="{{map}}"
    query="{{$.paper_input.value}}"
    result="{{result}}">
  </google-map-search>

  <google-map
    block
    map="{{map}}"
    latitude="{{result.latitude}}"
    longitude="{{result.longitude}}"
    style="height: 200px">
    <google-map-marker
      latitude="{{result.latitude}}"
      longitude="{{result.longitude}}">
    </google-map-marker>
  </google-map>

  <uber-estimates-time
    latitude="{{result.latitude}}"
    longitude="{{result.longitude}}"
    servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
  </uber-estimates-time>
</template>
{% endraw %}

The final component, [`<polymer-chauffeur>`](https://github.com/polymerlabs/polymer-chauffeur), uses all of these components and adds [`<paper-tabs>`](https://github.com/polymer/paper-tabs) and [`<core-pages>`](https://github.com/polymer/core-pages) to switch between [`<uber-products>`] and [`<uber-estimates-time>`].

{% highlight html %}
<polymer-chauffeur
  block
  style="height: 500px"
  servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
</polymer-chauffeur>
{% endhighlight %}

Demo:

<polymer-chauffeur
  block
  style="position:relative; height: 500px;"
  servertoken="l2DIhEmUbKH3j8Dn6-bFEDnFpkEcyj76HGfPUY8b">
</polymer-chauffeur>

That's it for this post. Next time I'll show you how to use [`<geojson-data>`](https://github.com/polymerlabs/geojson-data) to draw regions onto a [`<google-map>`](https://github.com/GoogleWebComponents/google-map) element.

**Note:** Don't try to use the server token in the above examples on your own site - it is restricted to requests from this domain only.

[`<uber-products>`]: https://github.com/PolymerLabs/uber-products
[`<uber-estimates-time>`]: https://github.com/PolymerLabs/uber-estimates-time
