new Promise(function (resolve) {
    if (document.readyState == 'complite') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(function () {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5384650
        });
        VK.Auth.login(function (response) {
            if (response.session) {
                resolve(response)
            } else {
                reject(new Error('Не удалось авторизироваться!'));
            }
        }, 2)
    })
}).then(function (response) {
    return new Promise(function (resolve, reject) {

        var param = {
            user_id: response.session.mid,
            fields: ["nickname", "photo_50"]
        };
        VK.api('friends.get', param, function (response) {
            if (response.response) {
                resolve(response.response)
            } else {
                reject(new Error('Не удалось получить список друзей!'))
            }
        })

    });
}).catch(function (e) {
    alert('Ошибка ' + e.message);
}).then(function (response) {
    var local = JSON.parse(localStorage.getItem('friends'));
    if (!local) local = []; else render(local, friends_group_right); // Если localStorage не пустой - рендерим его
    // Функция вывода списка друзей при помощи handlebars
    function render(data, block) {
        console.log(block.id);
        var source = entrytemplate.innerHTML;
        var template = Handlebars.compile(source);
        var outHtml = '';
        block.innerHTML = '';
        data.forEach(function (friend) {
            function hasIt() {
                var helper = true;
                local.forEach(function (e) {
                    if (e.uid == friend.uid) helper = false;
                });
                return helper;
            }

            if ((block.id == 'friends_group_left') && hasIt()) {
                friend.id = 'plus';
                friend.class = 'glyphicon glyphicon-plus';
                outHtml = outHtml + template(friend);
            } else if (block.id == 'friends_group_right') {
                friend.id = 'remove';
                friend.class = 'glyphicon glyphicon-remove';
                outHtml = outHtml + template(friend);
            }
        });
        block.innerHTML = outHtml;
    }
    // Функция перемещения с лева на право - работает для всех способов перемещения
    function moveRight(elem) {
        var tempresponse = response;
        for (var i = 0; i < response.length; i++) {
            if (response[i].uid == elem.dataset.uid) {
                tempresponse.splice(i, 1);
            }
        }
        response = tempresponse;
        elem.children[2].className = 'glyphicon glyphicon-remove';
        elem.children[2].id = 'remove';
        friends_group_right.appendChild(elem);
        local.push(elem.dataset);
    }
    // Функция перемещения с права на лево - работает для всех способов перемещения
    function moveLeft(elem) {
        var templocal = local;
        for (var i = 0; i < local.length; i++) {
            if (local[i].uid == elem.dataset.uid) {
                templocal.splice(i, 1);
            }
        }
        local = templocal;
        elem.children[2].className = 'glyphicon glyphicon-plus';
        elem.children[2].id = 'plus';
        friends_group_left.appendChild(elem);
        response.push(elem.dataset);
    }

    render(response, friends_group_left); // реддерим весь список друзей, кроме тех, которые есть в localStorage

    // Поиск
    main.addEventListener('keyup', function (e) {
        if (e.target.id == 'search_left') {
            var left_friend = [];
            response.forEach(function (e) {
                var full_name = e.first_name + ' ' + e.last_name;
                if (full_name.toLowerCase().indexOf(search_left.value.toLowerCase()) != -1) {
                    left_friend.push(e);
                }
            });
            render(left_friend, friends_group_left);
        }
        if (e.target.id == 'search_right') {
            var right_friend = [];
            local.forEach(function (e) {
                var full_name = e.first_name + ' ' + e.last_name;
                if (full_name.toLowerCase().indexOf(search_right.value.toLowerCase()) != -1) {
                    right_friend.push(e);
                }
            });
            render(right_friend, friends_group_right);
        }
    });
    // Обработка по кликам
    main.addEventListener('click', function (e) {
        if (e.target.id === 'plus') {
            var elem = e.target.closest('li');
            moveRight(elem);
            return true;
        }
        if (e.target.id === 'remove') {
            var elem = e.target.closest('li');
            moveLeft(elem);
            return true;
        }
        if (e.target.id === 'save') {
            e.preventDefault();
            localStorage.setItem('friends', JSON.stringify(local));
            alert('Данные сохранены!')
        }
    });
    // Обработка Drag and Drop
    var dragelems = main.querySelectorAll('.friend');
    [].forEach.call(dragelems, function (elem) {
        elem.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text', this.id);
            return true;
        });

    });
    var targ = document.getElementsByClassName('friends-popup__right')[0];
    targ.addEventListener('dragenter', function (e) {
        e.preventDefault();
        return true;
    });
    targ.addEventListener('dragover', function (e) {
        e.preventDefault();
        return true;
    });
    targ.addEventListener('drop', function (e) {
        var elem = e.dataTransfer.getData('text');
        moveRight(document.getElementById(elem));
    });
    var targ2 = document.getElementsByClassName('friends-popup__left')[0];
    targ2.addEventListener('dragenter', function (e) {
        e.preventDefault();
        return true;
    });
    targ2.addEventListener('dragover', function (e) {
        e.preventDefault();
        return true;
    });
    targ2.addEventListener('drop', function (e) {
        var elem = e.dataTransfer.getData('text');
        moveLeft(document.getElementById(elem));
    })
}).catch(function (e) {
    alert('Ошибка ' + e.message);
});