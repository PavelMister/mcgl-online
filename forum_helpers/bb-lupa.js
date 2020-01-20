$('<span class="format-tool lupa" style="background: url(http://icons.hiasm.com/img/8/4568_icon144.ico) #CCC no-repeat scroll 2px 2px;"/>').insertAfter($("#formatTools"));

var $el_lupa = $('span.format-tool.lupa');

/*
 * Lupa bbcode module
 */
$el_lupa.click(function (e) {
    var changed = false;
    $('span').each(function (i, e) {
        var $e = $(e);
        var border = '2px solid red';
        if (+/\d+/.exec($e.css('font-size')) < 8) {
            changed = true;
            $e.css({
                'font-size': '10px',
                'border-left': border,
                'border-right': border
            });
        }
    });

    if (changed === false) {
        alert("Текст для увеличения не обнаружен!");
        return true;
    }
});