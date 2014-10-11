---
layout: post
title: Setting up SSL on GitHub Pages
tags: infrastructure web
---

<link rel="import" href="/bower_components/paper-button/paper-button.html">

I use [GitHub Pages] to host this blog - it uses [Jekyll] which allows me to write posts in Markdown, and yet it's flexible enough so that I can embed <paper-button raised>custom HTML</paper-button> in my posts. Most importantly, it's powered by GitHub infrastructure and is FREE to use!

GitHub Pages are typically hosted on a subdomain of github.io, such as [https://keanulee.github.io](https://keanulee.github.io). You can also setup your own custom domain, which allows my blog to be hosted at [http://blog.keanulee.com](http://blog.keanulee.com).

## See the difference?

One disadvantage of using a custom domain is tha your page will no longer work over HTTPS. This is because the GitHub servers only has a SSL certificate that covers *.github.io domains, not keanulee.com or any of its subdomains.

Web developers should care about HTTPS. It protects the information submitted by users, it protects the website from man-in-the-middle attacks, and it can even [improve your search rankings](http://googlewebmastercentral.blogspot.com/2014/08/https-as-ranking-signal.html). Some APIs, such as the [Uber API](https://developer.uber.com/) I used in the [Welcome to Polymer]({% post_url 2014-10-01-welcome-to-polymer %}) post, require the origin to be an HTTPS site.

For those interested, this [Google I/O 2014 talk](https://www.youtube.com/watch?v=cBhZ6S0PFCY) explains why HTTPS is important.

## Hello CloudFlare

The observant reader should realize that this post is in fact served over HTTPS, so how did I make this work? [CloudFlare](https://www.cloudflare.com/), a DNS and CDN service provider, offers a feature called [Universal SSL](https://www.cloudflare.com/ssl) that secures the connection between your users and CloudFlare's user. You don't even need to purchase your own SSL certificate - CloudFlare will provide a wildcard certificate that works for all your subdomains.

## Instructions

1. [Sign up for CloudFlare](https://support.cloudflare.com/hc/en-us/articles/201720164-Sign-up-planning-guide) with your domain.
2. Go to your domain registar's website, and update your nameservers to point to the one provided by CloudFlare.
3. On CloudFlare, go to your domain's DNS settings and [create a CNAME record](https://support.cloudflare.com/hc/en-us/articles/200169046-How-do-I-add-a-CNAME-record-) that is an alias of "<user/org name>.github.io". For example, I have a CNAME record for "blog" that is an aliad of "keanulee.github.io". ([Instructions on GitHub](https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider))
4. On CloudFlare, go to your domain's ClouldFlare settings and set the SSL setting to Flexible SSL.
4. On the root of your GitHub repository, [create a file named "CNAME"](https://help.github.com/articles/adding-a-cname-file-to-your-repository/) that contains just the the your hostname. For example, the [CNAME file for this blog](https://github.com/keanulee/blog/blob/master/CNAME) contains:

{% highlight html %}
blog.keanulee.com
{% endhighlight %}

## Drawbacks

It's important to note that this setup is not fully secure - the connection between CloudFlare and GitHub pages is not secured. Since GitHub doesn't have a SSL certificate for your domain, Full SSL is not possible with a custom domain. However, this setup does provide some protection your users (e.g. from the hacker on the same unsecured Wi-Fi network), and it allows your site to behave as if it has SSL (e.g. for web crawlers, APIs).
