const host = `http://api-messenger.web-srv.local`
const content = document.querySelector(".content")
var token = "";


function _post(params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', `${params.url}`)
    http_request.send(params.data)
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            callback(http_request.responseText)
        }
    }
}

function _get(params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('GET', `${params.url}`);
    http_request.send();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            callback(http_request.responseText)
        }
    };
}

function _delete(params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('DELETE', `${params.url}`);
    http_request.send();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            callback(http_request.responseText)
        }
    };
}

function _load(url, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('GET', url);
    http_request.send();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            callback(http_request.responseText)
        }
    };
}

_post({ url: '/modules/registr.html' }, function (response) {
    content.innerHTML = response;
    LoadPageChats()
    LoadPageAuth()
})

function _elem(selector) {
    return document.querySelector(selector)
}

/*Кнопка далее в регистрации*/
function LoadPageChats() {
    _elem('.registr').addEventListener('click', function () {
        let rdata = new FormData()
        let first_name = _elem('input[name="first_name"]').value
        let last_name = _elem('input[name="last_name"]').value
        let sur_name = _elem('input[name="sur_name"]').value
        let email = _elem('input[name="email"]').value
        let password = _elem('input[name="password"]').value
        rdata.append('name', first_name)
        rdata.append('fam', last_name)
        rdata.append('otch', sur_name)
        rdata.append('email', email)
        rdata.append('pass', password)

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${host}/user/`);
        xhr.send(rdata);
        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {
                OnLoadPageChats()
            } if (xhr.status == 422) {
                let response = JSON.parse(xhr.responseText)
                alert(response.message)
            }
        }
    })

}
/*Загруска страницы чата*/
function OnLoadPageChats() {
    _post({ url: '/modules/chat.html' }, function (response) {
        content.innerHTML = response;
        
    })
}

/*Кнопка автризация*/
function LoadPageAuth() {
    document.querySelector('.authorize').addEventListener('click', function PageAuth() {
        _post({ url: '/modules/author.html' }, function (response) {
        content.innerHTML = response;
        LoadPageChatsAuth()
        LoadPageReg()
       OnLoadPagelogout() 
    })
    })
}

_load('/modules/author.html',content,LoadPageChatsAuth)
/*кнопка далее в авторизации*/
function LoadPageChatsAuth() {
    _elem('.author').addEventListener('click', function () {
        _load('/modules/registr.html',content,LoadPageChats)

        let edata = new FormData()
        let email = _elem('input[name="email"]').value
        let password = _elem('input[name="password"]').value
        edata.append('email', email)
        edata.append('pass', password)

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${host}/auth/`);
        xhr.send(edata);
        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText)
             token = response.token
             console.log(token)
           OnLoadPageChats()
           } if (xhr.status == 401) {
                let response = JSON.parse(xhr.responseText)
                alert(response.message)
          _load('/modules/chat.html',content, OnLoadPageChats)
}

}
})
}

/*Кнопка регистрация*/
function LoadPageReg() {
    document.querySelector('.reg').addEventListener('click', function() {
        _post({ url: '/modules/registr.html' }, function (response) {
        content.innerHTML = response;
        LoadPageChats()
        LoadPageAuth()
    })
 })
}


/*кнопка выйти в чате*/
function OnLoadPagelogout() {
    document.querySelector('.exit-1').addEventListener('click', function() {
       
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${host}/auth/`);
        xhr.setRequestHeader( "Authorization", "Bearer " + token );
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {
                PageAuth()
            } if (xhr.status == 401) {
                let response = JSON.parse(xhr.responseText)
                alert(response.message)
            } 
        }
    })
}

function  OnLoadPageChats() {
        _post({ url: '/modules/chat.html' }, function (response) {
        content.innerHTML = response;
         OnLoadPagelogout() 
    })
}



 /*_load({ url: '/modules/chat.html' }, function (response) {
                 content.innerHTML = response;
                  OnLoadPagelogout();

               document.querySelector('.exit-1').addEventListener('click', function() {
               _post({ url: '/modules/author.html' }, function (response) {
               content.innerHTML = response;
            })
        })
    });*/


 /*_elem('.exit').addEventListener('click', function () {
        _exit({ url: `${host}/auth` }, function (response) {
            response = JSON.parse(response)
            console.log(response)
            token = ''

             _load('/modules/auth.html',content, LoadPageChatsAuth)
             _elem('.callback').innerHTML = 'Выход'

    })
 })*/





