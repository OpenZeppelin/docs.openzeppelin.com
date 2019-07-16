(function() {
  'use strict';

  var sidebar = document.querySelector(
    'main .article-wrapper > aside.toc-sidebar'
  );

  if (!sidebar) return;
  var doc;
  var headings;
  if (
    document.querySelector('.body.ui-toc') ||
    !(headings = find(
      'h1[id].sect0, .sect1 > h2[id]',
      (doc = document.querySelector('article.doc'))
    )).length
  ) {
    sidebar.parentNode.removeChild(sidebar);
    return;
  }
  var lastActiveFragment;
  var links = {};
  var menu;

  function findSubheadings(node) {
    var subheadings = find('h3', node);
    if (!subheadings.length) {
      return;
    }
    console.log(subheadings);
  }

  var list = headings.reduce(function(accum, heading) {
    var shds = toArray(find('h3', heading.parentNode));
    var $shdsList = document.createElement('ul');
    $shdsList.classList.add('subheading-list');

    shds.map((n) => {
      var $shdItem = document.createElement('li');
      $shdItem.classList.add('subheading-item');
      var $shdLink = document.createElement('a');
      $shdLink.innerText = n.innerText;
      $shdLink.href = '#' + n.id;
      $shdItem.appendChild($shdLink);
      $shdsList.appendChild($shdItem);

      links[($shdLink.href = '#' + n.id)] = $shdLink;
    });

    var link = toArray(heading.childNodes).reduce(function(target, child) {
      if (child.nodeName !== 'A') target.appendChild(child.cloneNode(true));
      return target;
    }, document.createElement('a'));

    links[(link.href = '#' + heading.id)] = link;

    var listItem = document.createElement('li');
    listItem.appendChild(link);

    if (shds.length) {
      listItem.appendChild($shdsList);
    }

    accum.appendChild(listItem);
    return accum;
  }, document.createElement('ul'));

  if (!(menu = sidebar && sidebar.querySelector('.toc-menu'))) {
    menu = document.createElement('div');
    menu.className = 'toc-menu';
  }

  var title = document.createElement('h3');
  // title.textContent = 'On This Page';
  var elTitle = document.querySelector('main .article-wrapper h1');
  title.textContent = elTitle.textContent;
  menu.appendChild(title);
  menu.appendChild(list);

  if (sidebar) {
    window.addEventListener('load', function() {
      onScroll();
      window.addEventListener('scroll', onScroll);
    });
  }

  var startOfContent = doc.querySelector('h1.page ~ :not(.labels)');
  if (startOfContent) {
    var embeddedToc = document.createElement('aside');
    embeddedToc.className = 'toc embedded';
    embeddedToc.appendChild(menu.cloneNode(true));
    doc.insertBefore(embeddedToc, startOfContent);
  }

  function onScroll() {
    // NOTE doc.parentNode.offsetTop ~= doc.parentNode.getBoundingClientRect().top + window.pageYOffset
    //var targetPosition = doc.parentNode.offsetTop
    // NOTE no need to compensate wheen using spacer above [id] elements

    var headings = find(
      'h1[id].sect0, .sect1 > h2[id], .sect2 > h3[id]',
      (doc = document.querySelector('article.doc'))
    );

    var targetPosition = 0;
    var activeFragment;
    headings.some(function(heading) {
      if (Math.floor(heading.getBoundingClientRect().top) <= targetPosition) {
        activeFragment = '#' + heading.id;
      } else {
        return true;
      }
    });
    if (activeFragment) {
      if (activeFragment !== lastActiveFragment) {
        if (lastActiveFragment) {
          links[lastActiveFragment].classList.remove('is-active');
        }
        var activeLink = links[activeFragment];
        activeLink.classList.add('is-active');
        if (menu.scrollHeight > menu.offsetHeight) {
          menu.scrollTop = Math.max(
            0,
            activeLink.offsetTop + activeLink.offsetHeight - menu.offsetHeight
          );
        }
        lastActiveFragment = activeFragment;
      }
    } else if (lastActiveFragment) {
      links[lastActiveFragment].classList.remove('is-active');
      lastActiveFragment = undefined;
    }
  }

  function find(selector, from) {
    return toArray((from || document).querySelectorAll(selector));
  }

  function toArray(collection) {
    return [].slice.call(collection);
  }
})();
