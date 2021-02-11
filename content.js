/*
 * Check load state.
 */
window.onload = function() {

    /**
     * Public variables
     * @type {null}
     */
    var resetTime  = null,
        installApp = 0,
        refreshAt  = 0;

    /**
     * Load settings
     */
     var settings = new Settings("init");

    /**
     * Set urls for motoring tabs.
     * @type {{garants: string, helpers: string, profis: string, other: *}}
     */
    var otherUrl = settings.getStorage('otherUrl');
    console.log("start getting otherUrl: " + otherUrl);

    var urlArray = {
        'garants': 'https://forum.minecraft-galaxy.ru/hmembers/391',
        'helpers': 'https://forum.minecraft-galaxy.ru/hmembers/1',
        'profis' : 'https://forum.minecraft-galaxy.ru/hmembers/817',
        'other'  : otherUrl
    };

    /**
     * JS Global Events
     */
    document.body.onmouseover = document.body.onmouseout = mouseHandler;

    /**
     * Global vars
     */
    var pathImageLoading = '/img/loading.gif';
    var urlProfile, pathToClass, pathToId, oldSubClick, countUser, countSec, firstClick, selectFind,
        loadingStatus, internetConnected = 0;

    /**
     * CONTENT METHODS.
     */

    /**
     * @param needReset
     */
    function countSecond(needReset) {
        if (needReset === undefined) {
            if (countSec === undefined) {
                countSec = 1;
            } else {
                countSec = countSec + 1;
            }

            if (countSec !== undefined && countSec > (localStorage["resetTime"] * 10)) {
                countSec = 1;
            }
        } else {
            firstClick = undefined;
            countSec = 1;
        }
    }

    /**
     * @param event
     */
    function mouseHandler(event) {
        if (event.type === 'mouseover') {
            if (event.target.className === "saved") {
                event.target.title = 'Обновить'
            }
        }
    }
    /**
     * @param type integer
     */
    function setLoadingStatus(type) {
        var loadingJQTarget = $('#loading');
        if (type === "start") {
            loadingJQTarget.html('<img src="' + pathImageLoading + '"/>');
            loadingStatus = 1;
        } else if (type === "stop") {
            loadingJQTarget.text('');
            loadingStatus = 0;
        } else if (type === "get") {
            if (loadingStatus === undefined) {
                return true;
            }
            return loadingStatus;
        }

        if (loadingJQTarget.find('img').length !== 0) {
            if (loadingStatus === undefined) {
                loadingStatus = 1;
            } else {
                loadingStatus++;
            }
            return loadingStatus;
        }
        return false;
    }

    function refreshView() {
        loadingStatus = 0;
        $(".refresh img").attr("id", "");
        firstClick = 0;
    }


    function getPage() {
        var objectUse = 0, connectComplete = 0, thisPage = 0;
        countUser = 0;
        if (countSec >= (resetTime * 10) || firstClick !== 1) {
            if (firstClick !== 1) {
                //setInterval(sec, 5000);
            }
            if (selectFind !== null) {
                var findUrl = urlArray[selectFind];
                if (findUrl === undefined || findUrl === null) {
                    setErrorHtml("Не указана ссылка на мониторинг!");
                    setLoadingStatus('stop');
                }

                for (var i = 0; thisPage === 0; thisPage++) {
                    $.get({
                        url: findUrl + '/' + i,
                        success: function (data){

                            if (data.length !== 0) {
                                if (typeof data === "string") {
                                    internetConnected = true;
                                } else if (typeof data === "undefined") {
                                    internetConnected = false;
                                }

                                if (internetConnected === true) {

                                    if (data.indexOf("toHex") > 0) {
                                       setErrorHtml("Пожалуйста загрузите страницу на форуме, перейдя по ссылке \"<a href=\"https://forum.minecraft-galaxy.ru\" target=\"_blank\">https://forum.minecraft-galaxy.ru</a>\"");
                                        setLoadingStatus('stop');

                                        chrome.browserAction.onClicked.addListener(function(activeTab){
                                            var newURL = "https://forum.minecraft-galaxy.ru";
                                            chrome.tabs.create({ url: newURL });
                                        });
                                        return;
                                    }

                                    data = safeResponse.cleanDomString(data);

                                    objectUse = $(data).find('.topics').find('tr');

                                    if (objectUse.length < 0) {
                                        setErrorHtml("Пользователи не найдены или неверно указана ссылка</div>");
                                    }

                                    if (refreshAt.length === 0) {
                                        settings.setStorage("refreshAt", $(data).find('.profile-panel').find('.text').text());
                                    } else if (refreshAt !== $(data).find('.profile-panel').find('.text').text()) {
                                        settings.setStorage("refreshAt", $(data).find('.profile-panel').find('.text').text());
                                    }

                                    $("#view").css("text-align", "none");
                                    $("#view").text('');
                                    objectUse.each(function (i, elem) {
                                        var onlineStatus = $(elem).find('.vote-neg').text();
                                        if (onlineStatus !== 'offline') {
                                            onlineStatus = $(elem).find('.vote-pos').text();
                                            var elements = $(elem).find('.author-row').find('a');
                                            if (elements.length === 2 || elements.length === 3) {

                                                if (elements.attr('class') !== null || elements.attr('id') !== null || elements.attr('class') !== false) {
                                                    urlProfile = elements[0].href.split('/');
                                                    var profileId = parseInt(urlProfile[4]);
                                                    if (i === 0) {
                                                        countUser = countUser + 1;
                                                        $('#view').html(elements[0].text + profileId);
                                                    } else {
                                                        countUser = countUser + 1;
                                                        $("#view").html(
                                                            /* get previous html and set next */
                                                            $("#view").html() +
                                                            '<div class="user ' + elements.attr('class') + '">' +
                                                            '<a target="_blank" title="Открыть профиль" href="https://forum.minecraft-galaxy.ru/profilemain/' + profileId + '">' + elements[0].text + '</a>' +
                                                            '<div id="server" class="null">' + onlineStatus + '</div>' +
                                                            '</div>');
                                                    }
                                                }
                                            }
                                        }
                                        if ((objectUse.length - 1) === i) {
                                            setLoadingStatus('stop');
                                            connectComplete = 1;
                                            if (countUser === 0) {
                                                setErrorHtml('Нет пользователей онлайн!');
                                            }
                                        }
                                    });
                                    if (objectUse.length === 0) {
                                        connectComplete = 1;
                                    }

                                    if ($(data).find('.navigate').filter(" :first ").text().indexOf("2") !== -1) {
                                        thisPage = 0;
                                        //setInterval(sec, 2000);
                                    }
                                }
                            }
                        }});
                    i++;
                }
            }
        }
    }
        countSecond();
        setLoadingStatus();

        if (setLoadingStatus() > 100 && internetConnected === 0) {
            setLoadingStatus('stop');
            setErrorHtml('Ошибка соеденения с сервером Minecraft-Galaxy.Ru');
        }

        $('html').on('click', function (elem) {
            if (setLoadingStatus() !== 0 && setLoadingStatus() !== false) {
                return true;
            }
            var ViewTarget = $('html').find("#view");
            ViewTarget.css('text-align', 'left');

            if (elem.target.tagName.toLowerCase() === 'img') {
                pathToClass = $(elem.target).parent().attr('class');
            } else {
                pathToClass = $(elem).attr('class');
            }

            if (pathToClass === undefined || pathToClass === null) {
                pathToClass = elem.target.className;
            }

            if (pathToClass.indexOf(" ") > 1) {
                pathToClass = pathToClass.split(" ")[0];
            }

            pathToId = $(elem.target).attr('id');
            if (pathToId === undefined || pathToId === null) {
                pathToId = elem.target.id;
            }

            if (pathToClass === "garants" && oldSubClick !== "garants"
                || pathToClass === "helpers" && oldSubClick !== "helpers"
                || pathToClass === "profis" && oldSubClick !== "profis"
                || pathToClass === "other" && oldSubClick !== "other"
                || pathToClass === "skins" && oldSubClick !== "skins"
                || pathToClass === "map" && oldSubClick !== "map"
                || pathToClass === "settings" && oldSubClick !== "settings"
                || pathToClass === "events" && oldSubClick !== "events"
            ) {
                loadingStatus = 0;
                $("#view").text(' ');
                ViewTarget.removeAttr("style");
                $('#online').text('');
                setLoadingStatus('stop');
                countSecond(true);
                $(pathToClass).on('click', function (elem) {
                    pathToClass = $(elem.target).attr('class');
                });

                $('#main').children().attr('id', '');
                $('.' + pathToClass).attr('id', 'active');

                /**
                 * Module Skins
                 */
                if (pathToClass === "skins") {
                    $('#view').html($('#skinsBlock').html());
                    console.log("extract value in settings: " + settings.getStorage("other"));
                    $("#view").find("#otherUrl").val(otherUrl);
                }

                /**
                 * Module Settings
                 */
                if (pathToClass === "settings") {
                    $('#view').html($('#settingsBlock').html());
                    console.log("extract value in settings: " + settings.getStorage("other"));
                    $("#view").find("#otherUrl").val(otherUrl);
                }

                /**
                 * Module Events
                 */
                if (pathToClass === "events" && oldSubClick !== "events") {
                    $('#view').html($('#eventsBlock').html());
                    setLoadingStatus('start');

                    $.get({
                        url: "https://forum.minecraft-galaxy.ru/lastevents/0/newslist",
                        success: function(html){
                            if (html.length !== 0) {
                                html = safeResponse.cleanDomString(html);
                                var eventsData = $(html).find("div.text");
                                var eventsDate = $(html).find("div.date");
                                var eventsLength = eventsData.length;
                                var countWhileRepeats = 0, countNewEvents = 0;
                                while(countWhileRepeats < eventsLength) {
                                    var getTimeStamp   = dateHelper.getUtcFormat(eventsDate[countWhileRepeats].innerText);
                                    var dateDifference = dateHelper.getDifferenceDate(getTimeStamp);

                                    if (dateDifference < 2) {
                                        countNewEvents++;
                                        $('#view').append(
                                            "<br/><span class='new'>(new)</span> <b>" + eventsDate[countWhileRepeats].textContent
                                            + "</b>\n"
                                            + safeResponse.cleanDomString(eventsData[countWhileRepeats].outerHTML)
                                        );
                                    }
                                    countWhileRepeats++;
                                }
                                if (countNewEvents === 0) {
                                    setErrorHtml("Новых событий нет!");
                                }
                            } else {
                                $('#view').text("События не найдены!");
                            }
                            setLoadingStatus('stop');
                        }
                    });
                }

                /**
                 * Module Monitoring, tabs Garants/Helpers/Profies/Other.
                 */
                if (pathToClass === 'garants' || pathToClass === 'helpers' || pathToClass === 'profis' || pathToClass === 'other' && otherUrl !== null && otherUrl !== undefined && otherUrl !== "") {
                    if (setLoadingStatus('get') === 0) {
                        $("#view").removeAttr("style");
                        setLoadingStatus('start');
                        selectFind = pathToClass;
                        firstClick = 0;
                        setTimeout(getPage, 1200);
                    }
                }
                else if (pathToClass === 'other') {
                    //otherUrl = settings.getStorage("otherUrl");
                    if (otherUrl === null || otherUrl === undefined || otherUrl === "") {
                        setErrorHtml('Не верно указана ссылка');
                    }
                }

                /**
                 * Module "Fortes"
                 *
                 */
                if (pathToClass === "fortes" && oldSubClick !== "fortes") {
                    setLoadingStatus('stop');
                    $('#view').text('');
                    $(pathToClass).on('click', function (elem) {
                        pathToClass = $(elem.target).attr('class');
                    });
                    $('.' + pathToClass).attr('id', 'active');

                    $("#view").html(getFortes());
                }

                /**
                 * Module "Map"
                 */
                if (pathToClass === "map" && oldSubClick !== "map") {
                    $("#view").text('');
                }
            }

            if (pathToId !== "time" && pathToId !== "view" && elem.target.tagName !== "HR" && elem.target.tagName !== "BODY" && elem.target.tagName !== "HTML" && elem.target.tagName !== "INPUT") {

                if (oldSubClick === "settings") {
                    otherUrl = settings.getStorage("otherUrl");

                    console.log("settings get otherUrl: " + otherUrl);
                    if (otherUrl !== undefined) {
                        if ($('#otherUrl').val().length <= 0) {
                            $('#otherUrl').val(otherUrl);
                        }
                    }

                    if (resetTime !== undefined) {
                        var timeSelector = $('#time');
                        if (timeSelector.find('.active').text().length === 0) {
                            timeSelector.children().each(function (i, elem) {
                                if ($(elem).text() === resetTime) {
                                    $(elem).css("color", "black");
                                    $(elem).attr('class', 'active');
                                }
                            });
                        }
                    }

                    if ($(elem.target).attr('id') === "value") {
                        if ($(elem.target).text().parseInt !== resetTime) {
                            settings.setStorage("resetTime", $(elem.target).text());
                            $(elem.target).attr(
                                {
                                    'class' : 'settings',
                                    'style' : 'color: black;'
                                }
                            );
                            $("#value").attr('style', '');
                        }
                    }

                    if (pathToId === "saveBlock") {
                        var otherUrlSelector = $("#view").find("#otherUrl");
                        if (otherUrlSelector.length !== 0 && otherUrlSelector.text() !== otherUrl) {
                            settings.setStorage("otherUrl", otherUrlSelector.val());

                            console.log("saveBlock get otherUrl: " +  settings.setStorage("otherUrl"));
                        }
                    }
                }
            }

            if (pathToClass === "refresh" && oldSubClick !== 0 && oldSubClick !== "settings" && oldSubClick !== "events") {
                var mainActiveClass = $("#main").find("#active").attr("class");
                if (mainActiveClass !== undefined) {
                    if (setLoadingStatus('get') === 0) {
                        if (mainActiveClass !== null) {
                            oldSubClick = mainActiveClass;
                            if (oldSubClick.indexOf(" ") > 1) {
                                oldSubClick = oldSubClick.split(" ")[0];
                            }
                        }

                        if (oldSubClick === 'garants' || oldSubClick === 'helpers' || oldSubClick === 'profis' || oldSubClick === 'other' && otherUrl !== null && otherUrl !== undefined) {
                            $("#view").removeAttr("style");
                            $('.refresh img').attr('id', 'loader');
                            setTimeout(refreshView, 1500);
                            setLoadingStatus('start');
                            selectFind = oldSubClick;
                            setTimeout(getPage, 1500);
                        } else {
                            setErrorHtml('Не выбрана вкладка или обновление в ней невозможно!');
                        }
                    }
                }
            }

            if (pathToClass !== null && pathToClass !== undefined && pathToClass !== "") {
                oldSubClick = pathToClass;
            }
        });


    function setErrorHtml(errorValue) {
        var errorTarget = $('#view');
        errorTarget.css('text-align', 'center');
        errorTarget.html('<div id="status" class="error"><img src="/img/error.png"/><br/>' + errorValue + '</div>');
    }

    function getFortes() {
        $('#view').text('В разработке');
    }
};