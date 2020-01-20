/*
 * Invite bbcode elem
 */
if (window.location.pathname.match(/^\/hpost\//) !== false){
    var $pt = $('.posts .post-header .post-tools');

    if ($pt.length > 0){
        if ($pt.find(":contains('правка')")[0] !== undefined) {
            $pt.append(' | <a href="#" class="plug-btn-invite">пригласить в сообщество</a>');
            $(document).on('click', '.plug-btn-invite', function (e) {
                var $me = $(this);
                var login = $me.parents('tr').find('.author-row .login a').text();
                var commstr = $($('.main-div .tb-panel .tb-btn')[0]).attr('href');
                var commarr = commstr.split('/');

                if (commarr[1] === 'hmain') {
                    $.get({
                        type: 'post',
                        url: '/hmembers/' + commarr[2],
                        data: {
                            form: '',
                            invite: '',
                            user: login,
                        },

                        success: function (data) {
                            var m = data.match(/отправлено приглашение для вступления в сообщество/);
                            if (m === null) {
                                alert('Вы не имеете права приглашать/Игрок уже приглашен или состоит в сообществе');
                            } else {
                                alert('Игрок успешно приглашен');
                            }
                        },

                        error: function () {
                            alert('Ошибка работы с сервером');
                        }
                    });
                } else {
                    alert('Вы не находитесь на странице сообщества!');
                }

                return false;
            });
        }
    }
}