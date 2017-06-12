function makeURLParser() {
  var parser = document.createElement('a');
  function hostname(url) {
    parser.href = url;
    return parser.hostname;
  };
  return hostname;
};

function chainComparators(fns) {
  function chained(x, y) {
    for (var i = 0; i < fns.length; i++) {
      result = fns[i](x, y);
      if (result !== 0)
        return result;
    }
    return 0;
  }
  return chained;
}

function makeComparator(f) {
  function comparator(x, y) {
    var fx = f(x), fy = f(y);
    if (fx < fy)
      return -1;
    if (fx > fy)
      return 1;
    return 0;
  }
  return comparator;
}

var getTabIndex = (t) => t.index,
    tabIndexComparator = makeComparator(getTabIndex);

var getTabTitle = (t) => t.title.toUpperCase(),
    tabTitleComparator = makeComparator(getTabTitle);

var getTabHostname = ( (parser) => ( (t) => parser(t.url).toUpperCase() ) )(makeURLParser()),
    tabHostnameComparator = makeComparator(getTabHostname);

var tabComparator = chainComparators([tabHostnameComparator, tabTitleComparator, tabIndexComparator]);

function main() {
  var sorted = false;

  function sortAndMove(tabs) {
    sorted = (tabs.length > 1);

    tabs.sort(tabComparator);
    chrome.tabs.move(tabs.map( (tab) => tab.id ), {index: -1});
  };

  chrome.tabs.query({highlighted: true, currentWindow: true},
    function(tabs) {
      sortAndMove(tabs);
      if (!sorted)
        chrome.tabs.query({currentWindow: true}, sortAndMove);
    }
  );
};

chrome.browserAction.onClicked.addListener(main);
