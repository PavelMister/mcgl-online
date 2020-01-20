/*
 * MCGL Helper functions.
 */
class McglHelper {

    constructor(name) {
        this.name = name;
    }


    /*
    function changeCoords() {
        $(".wrapper").attr("style", "top: 658px; left: 0px;");
        console.log("qq");
    }

    function getServerIdByName(name) {
        switch (name)
        {
            case "Main":
                return 1;
                break;
            case "Guest":
                return 2;
                break;
            case "DemoPlanet":
                return 3;
                break;
            case "Лапландия":
                return 4;
                break;
            case "Hunter":
                return 5;
                break;
            case "LittleBigPlanet":
                return 6;
                break;
            case "MinerPlanet":
                return 7;
                break;
            case "Clans":
                return 8;
                break;
            case "MiniGames":
                return 9;
                break;
            case "MonkeyPlanet":
                return 10;
                break;
            case "Pirate station":
                return 11;
                break;
            case "Nano":
                return 12;
                break;
            case "Rookie":
                return 13;
                break;
            case "Newbie":
                return 14;
                break;
            case "Build":
                return 15;
                break;
            case "Pacific":
                return 16;
                break;
            case "Enigma":
                return 18;
                break;
            case "Novice":
                return 19;
                break;
            case "Team":
                return 20;
                break;
            case "Farm":
                return 22;
                break;
            case "Prometeus":
                return 25;
                break;
            case "Laboratory":
                return 26;
                break;
            case "Zeus":
                return 28;
                break;
            case "Dragon nest":
                return 29;
                break;
            case "Atlantida":
                return 30;
                break;

            default:
                return 0;
        }
    }


    function getUserProfile() {
        var status;
        $.get("http://forum.minecraft-galaxy.ru/profilemain/", function (data) {
            data = $(data).find('span:contains("Статус в игре")').parent().children()[1];

            status = $(data).find("span.vote-pos")[0].innerHTML;
        });

        return status;
    }

    function getMap() {

        var server = getUserProfile();
        server = getServerIdByName(server)


        $("#view").html(
            '<iframe class="iframeData" src="http://map.minecraft-galaxy.ru/#0/1/' + server + '/0/12/"/>'
        );

        setTimeout(changeCoords, 2000);

    }
    */

}