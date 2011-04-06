/*
MIT Licence - English
Copyright (c) 2010 Lars Chr. Albrecht

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

MIT Licence - German
Copyright (c) 2010 Lars Chr. Albrecht

Hiermit wird unentgeltlich, jeder Person, die eine Kopie der Software und der zugehörigen Dokumentationen (die "Software") erhält, die Erlaubnis erteilt, 
uneingeschränkt zu benutzen, inklusive und ohne Ausnahme, dem Recht, sie zu verwenden, kopieren, ändern, fusionieren, verlegen, verbreiten, unterlizenzieren und/oder zu verkaufen, 
und Personen, die diese Software erhalten, diese Rechte zu geben, unter den folgenden Bedingungen:
Der obige Urheberrechtsvermerk und dieser Erlaubnisvermerk sind in allen Kopien oder Teilkopien der Software beizulegen.
DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT, EINSCHLIESSLICH DER GARANTIE ZUR BENUTZUNG FÜR DEN VORGESEHENEN ODER EINEM 
BESTIMMTEN ZWECK SOWIE JEGLICHER RECHTSVERLETZUNG, JEDOCH NICHT DARAUF BESCHRÄNKT. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR JEGLICHEN SCHADEN 
ODER SONSTIGE ANSPRÜCHE HAFTBAR ZU MACHEN, OB INFOLGE DER ERFÜLLUNG EINES VERTRAGES, EINES DELIKTES ODER ANDERS IM ZUSAMMENHANG MIT DER SOFTWARE ODER SONSTIGER 
VERWENDUNG DER SOFTWARE ENTSTANDEN.

*/
		// Main vars
		//var loaderUrl = 'http://lars-albrecht.com/geturl.html?url=';
        var loaderUrl = '/jdinter/geturl.php?url=';
		var rootUrl = 'http://192.168.178.25:10025/';
		
		// Status elements
		var infoElem = '#info';
		var infoElemSpeed = '#statusSpeed';
		
		var timeElem = '#time';
		var ipElem = '#ip';

		// Control elements
		var controlElemMaxSpeed = '#controlMaxSpeed';
		var controlElemMaxDownloads = '#controlMaxDownloads';
		var controlElemPremium = '#controlPremium';
		var controlElemReconnect = '#controlReconnect';
		
		// Menu elements
		var menuAllCountElem = '#menuAllCount';
		var menuCurrentCount = '#menuCurrentCount';
		var menuFinishedCount = '#menuFinishedCount';
		var menuGrabberCount = '#menuAllCount';
		
		// jQuery doc.ready
		$(document).ready(function() {
		var now = new Date();
			setInterval (loadInfos, 10000);
            loadInfos();
			$('#statusAjax').ajaxSend(function() {
				$(this).text('Loading...');
			});
			
			$('#statusAjax').ajaxError(function() {
				$(this).text('An error occured');
			});
			
			$('.menuItem').click(function(){
				loadContent($('#mainMenu .menuItem:first').attr('rel'), '#content', '#statusAjax', $('#mainMenu .menuItem:first').attr('title').length > 0 ? $('#mainMenu .menuItem:first').attr('title')  + ' loaded' : '');
			});
			
			$('.controlPadCell input:text').blur(function(){
				setValue($(this).attr('rel') + $(this).val(), '', '');
			});

			$('.controlPadCell input:checkbox').blur(function(){
				setValue($(this).attr('rel') + $(this).attr('checked'), '', '');
			});
			
			$('#openControlPad').click(function(){
				if($(this).hasClass('opened')){
					$(this).removeClass('opened');
				} else {
					$(this).addClass('opened');
				}
				$(this).next('#controlPad').animate({
					opacity: 'toggle',
					width: 'toggle'
					}, {
						duration: 500, 
						specialEasing: {
						width: 'linear',
					}, complete: function() {
					}
				});
			});
		});
	
/* BEGIN  */	
(function ($) {
  // custom css expression for a case-insensitive contains()
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };
  
  function listFilter(header, list) { // header is any element, list is an unordered list
    // create and add the filter form to the header
    var form = $("<form>").attr({"class":"filterform","action":"#"}),
        input = $("<input>").attr({"class":"filterinput","type":"text"});
    $(form).append(input).appendTo(header);

    $(input)
      .change( function () {
        var filter = $(this).val();
        if(filter) {
          // this finds all links in a list that contain the input,
          // and hide the ones not containing the input while showing the ones that do
          $(list).find("a:not(:Contains(" + filter + "))").parent().slideUp();
          $(list).find("a:Contains(" + filter + ")").parent().slideDown();
        } else {
          $(list).find("li").slideDown();
        }
        return false;
      })
    .keyup( function () {
        // fire the above change event after every letter
        $(this).change();
    });
  }


  //ondomready
  $(function () {
    listFilter($("#listFilter"), $("#list"));
  });
}(jQuery));

/* END */
		
		function bindDynamicEvents(){
			$('li.packageTitle').click(function(){
				if($(this).nextAll('li.fileTitle').css('display') == 'none'){
					$(this).nextAll('li.fileTitle').slideDown();
				} else {
					$(this).nextAll('li.fileTitle').slideUp();
				}
			
			});
		}
		
	function getStatus(){
  			$.get(loaderUrl + rootUrl + 'get/downloadstatus', function(data) {
				return data;
			});
	}
		
		function loadInfos(){
		
			$(timeElem).html(new Date);
		
			$.get(loaderUrl + rootUrl + 'get/speed', function(data) {
				$(infoElemSpeed + '1').html(data);
			});
			$.get(loaderUrl + rootUrl + 'get/speedlimit', function(data) {
				$(infoElemSpeed + '2').html(data);
				$(controlElemMaxSpeed).html(data);
			});
			$.get(loaderUrl + rootUrl + 'get/isreconnect', function(data){
				$(controlElemReconnect).attr('checked', data ? 'checked' : '');
			});
			// no known function to get premiumstatus
			$.get(loaderUrl + rootUrl + 'get/ip', function(data){
				$(ipElem).html(data);
			});
			$.get(loaderUrl + rootUrl + 'get/downloads/allcount', function(data){
				$(menuAllCountElem).html(data);
			});
			$.get(loaderUrl + rootUrl + 'get/downloads/currentcount', function(data){
				$(menuCurrentCount).html(data);
			});
			$.get(loaderUrl + rootUrl + 'get/downloads/finishedcount', function(data){
				$(menuFinishedCount).html(data);
			});
			$.get(loaderUrl + rootUrl + 'get/grabber/count', function(data){
				$(menuGrabberCount).html(data);
			});
			
			setStatus('... updated ...', '#statusAjax');
		}
		
		function doAction(url, statusElem, message){
		
		}
		
		function setValue(url, statusElem, message){
			$.get(loaderUrl + rootUrl + url, function(data) {
				
			});
		}
		
		function loadContent(url, contentElem, statusElem, message){
			$.get(loaderUrl + rootUrl + url, function(data) {
				var elemListFilter = '<div id="listFilter"></div>';
				writeToContent(elemListFilter + getPackageWithFiles(data), contentElem);
				setStatus(message, statusElem)
				bindDynamicEvents();
			});
		}
		
		function getPackageWithFiles(data){
			var xml = data;
			var list = {'items': {
				'packages': {}}
			}
			
			var i = 0;
			$(xml).find('package').each(function(){
				tempPackage = {'title' : $(this).attr('package_name'), 'files':{}};
				var j = 0;
				$(this).find('file').each(function(){
					tempFile = 	{
									'hoster': $(this).attr('file_hoster'),
									'title': $(this).attr('file_name'),
									'percent': $(this).attr('file_percent'),
									'status': $(this).attr('file_status')
								}
                                trace(tempFile);
					tempPackage.files[j] = tempFile;
					j++;
				});
				list.items.packages[i] = tempPackage;
				i++;
			});
			return list;
		}
		
		function writeToContent(data, elem){
			$(elem).html('');
			var newContent = '';
			if(data.items){
				$.each(data.items.packages, function(index, value) {
                    trace($(this));
					newContent += '<ul>';
					newContent += '<li class="packageTitle">Package: ' + value.title + '</li>';
					$.each(value.files, function(index, value) {
						newContent += '<li class="fileTitle">File: ' + value.title + ' - ' + value.status + '</li>';
					});
					newContent += '</ul>';
				});
				
			} else {
				newContent = '<p>No items found</p>';
			}
			
			$(elem).html(newContent);
		}
		
		function setStatus(data, elem){
			$(elem).html('<p>' + data + '</p>');
		}

        function trace(str){
            if(typeof(console.log) == 'function'){
                console.log(str);
            } else {
                alert(str);
            }
        }
		
		
