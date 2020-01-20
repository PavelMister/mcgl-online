$('<span class="format-tool dir" style="background: url(//sinair.ru/plug/userdoc_small.png) #CCC no-repeat scroll 2px 2px;"/>').insertAfter($("#formatTools"));

var $dlg = "";
var $el_dir  = $('span.format-tool.dir');

/*
 * Dir bbcode elem
 */

var $dialogUserdoc = $('#dialog-userdoc');
if($dialogUserdoc.length === 0)
{
    $dlg = $('<div id="dialog-userdoc"/>');
    $('body').prepend($dlg);
}

var $last = $('#' + window.editControl).parent().find('.format-tool').last();
$el_dir.click(function(e){
    $dlg = $('#dialog-userdoc');
    $dlg.html('<img src="/img/ajax-loader.gif"/>');
    $dlg.dialog({
        title:"Выберите документ",
        modal: true,
        resizable: false,
        width: 400,
        height: 300,
        buttons: [
            {
                text: "Закрыть",
                click: function() {
                    $dlg.dialog("close");
                }
            }
        ]
    }).css("z-index", "9999");

    var profileId = $("html").html().match(/class\=\"profile-img\"\s+src\=\"\/img\/avatars\/([^\"]+)\"/g);
    profileId = profileId[1].match(/([\d]+)/)[1];

    $.get('/userdocs/' + profileId, function(data){
        $dlg.html('');
        var docs = data.match(/\<a[^>]+href="\/userdoc\/\d+"[^>]*>.*?<\/a>/g);
        docs.forEach(function(e, i){
            var $doc = $(e);
            var doc = $doc.attr('href');
            var docTitle = $doc.find('#edit-title').text();
            $doc.attr('href', '#');
            $doc.text(docTitle);

            $doc.click(function(e){
                $("textarea#message").append("[img]https://sinair.ru/plug/userdoc_small.png[/img][Документ] [url=" + doc + "]" + docTitle + "[/url]");
                $(".ui-widget-overlay").hide();
                $dlg.dialog('close');
                return false;
            });

            $dlg.append($doc);
            $dlg.append('<br>');
        });
    });

    $(".ui-widget-overlay").hide();
});

$last.before($el_dir);