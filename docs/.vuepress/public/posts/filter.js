(function() {
  var queryString = location.search;
  var queries = queryString.slice(1).split('&');    
  for (var i = 0; i < queries.length; i++) {
    query = queries[i].split('=');
    if (query[0] === 'tag') {
      var tag = decodeURIComponent(query[1]);
      document.getElementById('activeTag').innerText = '#' + tag;
      document.querySelectorAll('.TAG_' + tag.replace(/ /g, '-')).forEach(element => {
        element.style.display = 'list-item';
      });
      return;
    }
  }
  document.querySelectorAll('.item').forEach(element => {
    element.style.display = 'list-item';
  });
})();
