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
    response.forEach(function(friend) {
        console.log(friend);
    })

}).catch(function (e) {
    alert('Ошибка ' + e.message);
});