chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
      var url = tabs[0].url;
      url = url.slice(0, -1)
      url = url.substring(0, url.indexOf('?'));
      document.getElementById('current-url').value = url;
   }
);

function isValid(str) {
  return /^\w+$/.test(str);
}

function copyToClipboard(text) {
  var copyDiv = document.createElement('div');
  copyDiv.contentEditable = true;
  document.body.appendChild(copyDiv);
  copyDiv.innerHTML = text;
  copyDiv.unselectable = "off";
  copyDiv.focus();
  document.execCommand('SelectAll');
  document.execCommand("Copy", false, null);
  document.body.removeChild(copyDiv);
}

$('#shorten-url').click(function(e) {
  e.preventDefault();
  var originalUrl = $('#current-url').val();
  var urlSource = $('#url-source').val();
  var urlCampaign = $('#url-campaign').val();
  if (!isValid(urlSource)) {
    alert("Source invalid!");
    return false;
  } else if (!isValid(urlCampaign)) {
    alert("Campaign invalid!");
    return false;
  }
  var fullUrl = originalUrl + '/?optify_r=' + urlSource + '&optify_rd=' + urlCampaign;
  fullUrl = fullUrl.replace(' ', '-');
  //Just fill the generic_access_token variable with the value bitly gave you
  var generic_access_token = 'ca1a64bccf81d8f2298de69d024b7eeac16159f1';

  var url_encoded = encodeURIComponent(fullUrl);
  var json = "";
  var bitly_json_req_url = "https://api-ssl.bitly.com/v3/shorten?access_token=" +
  generic_access_token + "&longUrl="+url_encoded;

  //more info here http://dev.bitly.com/links.html

  if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function()
  {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
          resp = JSON.parse(xmlhttp.responseText);
          document.getElementById("short-url").innerHTML="URL copied to clipboard!";
          copyToClipboard(resp.data.url);
      }
  }

  xmlhttp.open("GET",bitly_json_req_url,true);
  xmlhttp.send();
});
