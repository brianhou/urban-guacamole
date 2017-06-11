function makeURLParser() {
  var parser = document.createElement('a');
  function hostname(url) {
    parser.href = url;
    return parser.hostname;
  };
  return hostname;
};
  
function tabTitleComparator(t1, t2) {
  var s1 = t1.title.toUpperCase();
  var s2 = t2.title.toUpperCase();

  if (s1 < s2)
    return -1;
  if (s1 > s2)
    return 1;

  return t2.index - t1.index;
};

function tabURLHostnameComparator(t1, t2) {
  var hostnameParser = makeURLParser();
  var s1 = hostnameParser(t1.url).toUpperCase();
  var s2 = hostnameParser(t2.url).toUpperCase();

  if (s1 < s2)
    return -1;
  if (s1 > s2)
    return 1;

  return tabTitleComparator(t1, t2);
  // return 0;
};

function moveAll(tabs, i) {
  if (i >= tabs.length)
    return;

  chrome.tabs.move(
    tabs[i].id,
    {index: -1},
    function (e) { moveAll(tabs, i+1); }
  );
}

function main() {
  var sorted = false;

  function sortAndMove(tabs) {
    sorted = (tabs.length > 1);

    tabs.sort(tabURLHostnameComparator);
    moveAll(tabs, 0);
  };

  chrome.tabs.query({highlighted: true, currentWindow: true},
    function(tabs) {
      sortAndMove(tabs);
      if (!sorted)
        chrome.tabs.query({currentWindow: true}, sortAndMove);
    }
  );
};

document.addEventListener('DOMContentLoaded', main);
