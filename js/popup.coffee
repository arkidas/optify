isValid = (str) ->
  /^\w+$/.test str
copyToClipboard = (text) ->
  copyDiv = document.createElement("div")
  copyDiv.contentEditable = true
  document.body.appendChild copyDiv
  copyDiv.innerHTML = text
  copyDiv.unselectable = "off"
  copyDiv.focus()
  document.execCommand "SelectAll"
  document.execCommand "Copy", false, null
  document.body.removeChild copyDiv
chrome.tabs.query
  active: true
  windowId: chrome.windows.WINDOW_ID_CURRENT
, (tabs) ->
  url = tabs[0].url
  url = url.slice(0, -1)
  if url.indexOf("?") != -1
    url = url.substring(0, url.indexOf("?"))
  document.getElementById("current-url").value = url

$("#shorten-url").click (e) ->
  e.preventDefault()
  originalUrl = $("#current-url").val()
  urlSource = $("#url-source").val()
  urlCampaign = $("#url-campaign").val()
  unless isValid(urlSource)
    unless isValid(urlCampaign)
      $('.url-source').addClass 'animated bounce'
      $('.url-campaign').addClass 'animated bounce'
      setTimeout (->
        $('.url-source').removeClass 'animated bounce'
        $('.url-campaign').removeClass 'animated bounce'
      ), 1000
    $('.url-source').addClass 'animated bounce'
    setTimeout (->
      $('.url-source').removeClass 'animated bounce'
    ), 1000
    return false

  unless isValid(urlCampaign)
    $('.url-campaign').addClass 'animated bounce'
    setTimeout (->
      $('.url-campaign').removeClass 'animated bounce'
    ), 1000
    return false

  fullUrl = originalUrl + "/?optify_r=" + urlSource + "&optify_rd=" + urlCampaign
  fullUrl = fullUrl.replace(" ", "-")

  #Just fill the generic_access_token variable with the value bitly gave you
  generic_access_token = "ca1a64bccf81d8f2298de69d024b7eeac16159f1"
  url_encoded = encodeURIComponent(fullUrl)
  json = ""
  bitly_json_req_url = "https://api-ssl.bitly.com/v3/shorten?access_token=" + generic_access_token + "&longUrl=" + url_encoded

  #more info here http://dev.bitly.com/links.html
  if window.XMLHttpRequest
    # code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest()
  else # code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  xmlhttp.onreadystatechange = ->
    if xmlhttp.readyState is 4 and xmlhttp.status is 200
      resp = JSON.parse(xmlhttp.responseText)
      $('#short-url > input').val(resp.data.url)
      copyToClipboard resp.data.url
      $('#shorten-url').hide()
      $('.loading').show()
      setTimeout (->
        $('.url-info-input input').attr('disabled')
        $('.loading').hide()
        $('#shorten-url').hide()
        $('#short-url').show()
        $('#short-url').addClass 'animated fadeIn'
      ), 1000


  xmlhttp.open "GET", bitly_json_req_url, true
  xmlhttp.send()
  $('#short-url input').select()
