document.addEventListener('DOMContentLoaded', function() {
  var cap = document.querySelector('core-animated-pages');

  function openSection(section) {
    cap.selectedItem = section;
    document.title = section.getAttribute('pagetitle');
  }

  function usingModifierKeys(event) {
    return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  }

  function isRelativeLinkElement(elem) {
    return elem.nodeType === 1 &&
      elem.nodeName.toLowerCase() === 'a' &&
      elem.getAttribute('href')[0] === '/';
  }

  document.addEventListener('click', function(event) {
    if (!usingModifierKeys(event) && isRelativeLinkElement(event.target)) {
      event.preventDefault();

      var pathname = event.target.getAttribute('href').replace('index.html', '');
      var section = document.getElementById(pathname);
      if (section) {
        window.history.pushState({}, '', pathname);
        openSection(section);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          var section = this.response.querySelector('core-animated-pages section');
          if (section) {
            cap.appendChild(section);

            // HACK: Chrome won't recognize custom elements in the appended section's children.
            // This forces that to happen.
            section.innerHTML = section.innerHTML;

            window.setTimeout(function() {
              window.history.pushState({}, '', pathname);
              openSection(section);
            }, 100);
          } else {
            // This wasn't an animatable page, so just go there.
            window.location.href = pathname;
          }
        };
        xhr.open('GET', pathname);
        xhr.responseType = 'document';
        xhr.send();
      }
    }
  });

  window.addEventListener('popstate', function() {
    openSection(document.getElementById(window.location.pathname));
  });

  cap.addEventListener('core-animated-pages-transition-prepare', function() {
    cap.classList.add('animating');
  });

  cap.addEventListener('core-animated-pages-transition-end', function() {
    cap.classList.remove('animating');
  });
});
