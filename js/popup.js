// Generated by CoffeeScript 1.6.3
(function(){var e,t;t=function(e){return/^\w+$/.test(e)};e=function(e){var t;t=document.createElement("div");t.contentEditable=!0;document.body.appendChild(t);t.innerHTML=e;t.unselectable="off";t.focus();document.execCommand("SelectAll");document.execCommand("Copy",!1,null);return document.body.removeChild(t)};chrome.tabs.query({active:!0,windowId:chrome.windows.WINDOW_ID_CURRENT},function(e){var t;t=e[0].url;t=t.slice(0,-1);t.indexOf("?")!==-1&&(t=t.substring(0,t.indexOf("?")));return document.getElementById("current-url").value=t});$("#shorten-url").click(function(n){var r,i,s,o,u,a,f,l,c;n.preventDefault();u=$("#current-url").val();f=$("#url-source").val();a=$("#url-campaign").val();if(!t(f)){console.log("Source invalid!");return!1}if(!t(a)){console.log("Campaign invalid!");return!1}i=u+"/?optify_r="+f+"&optify_rd="+a;i=i.replace(" ","-");s="ca1a64bccf81d8f2298de69d024b7eeac16159f1";l=encodeURIComponent(i);o="";r="https://api-ssl.bitly.com/v3/shorten?access_token="+s+"&longUrl="+l;window.XMLHttpRequest?c=new XMLHttpRequest:c=new ActiveXObject("Microsoft.XMLHTTP");c.onreadystatechange=function(){var t;if(c.readyState===4&&c.status===200){t=JSON.parse(c.responseText);document.getElementById("short-url").innerHTML="URL copied to clipboard!";return e(t.data.url)}};c.open("GET",r,!0);return c.send()})}).call(this);