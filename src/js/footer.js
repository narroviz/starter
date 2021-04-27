const fallbackData = [
      {"image":"around_the_world","url":"html/around-the-world","hed":"Around the World"},
      {"image":"nba_season_history","url":"html/nba-season-history","hed":"NBA Season History"},
      {"image":"wnba_season_history","url":"html/wnba-season-history","hed":"WNBA Season History"},
    ]

let storyData = null;

function loadJS(src, cb) {
  const ref = document.getElementsByTagName("script")[0];
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);

  if (cb && typeof cb === "function") {
    script.onload = cb;
  }

  return script;
}


function loadStories(cb) {
  var request = new XMLHttpRequest();
  var v = Date.now();
  var url = "https://narro.design/assets/data/stories.json";
  request.open("GET", url, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      cb(data);
    } else cb(fallbackData);
  };

  request.onerror = function () {
    return cb(fallbackData);
  };

  request.send();
}

function createLink(d) {
  if (d.url !== " ") {
    return "\n\t<a class='footer-recirc__article' href='https://narro.design/".concat(d.url, "' target='_blank' rel='noopener'>\n\t\t<img class='article__img' src='./../assets/images/").concat(d.image, ".png' alt='").concat(d.hed, "'>\n\t\t<p class='article__headline'>").concat(d.hed, "</p>\n\t</a>\n\t");
  } else {
    return "\n\t<a class='footer-recirc__article' target='_blank' rel='noopener'>\n\t\t<img class='article__img'".concat("' alt='").concat(d.hed, "'>\n\t\t<p class='article__headline'>").concat(d.hed, "</p>\n\t</a>\n\t");
  }
}

function recircHTML(storyData) {
  var url = window.location.href;
  var html = storyData.filter(function (d) {
    return !url.includes(d.url);
  }).slice(0, 3).map(createLink).join("");
  d3.select(".narro-footer .footer-recirc__articles").html(html);
}

function init() {
  loadStories(data => {
    storyData = data;
    recircHTML(storyData);
  });
}

export default { init };
