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
            fields: ["nickname","photo_50"]
        };
        VK.api('friends.get', param, function(response) {
            if (response.response) {
                resolve(response.response)
            } else {
                reject (new Error('Не удалось получить список друзей!'))
            }
        })

    });
}).catch(function (e) {
    alert('Ошибка ' + e.message);
}).then(function(response) {
    var source   = entrytemplate.innerHTML;
    var template = Handlebars.compile(source);
    var outHtml;
    response.forEach(function(friend) {

        outHtml = outHtml + template(friend)
;    })
    friends_group.innerHTML = outHtml;
}).catch(function (e) {
    alert('Ошибка ' + e.message);
});