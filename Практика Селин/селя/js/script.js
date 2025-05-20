const host = `http://api-messenger.web-srv.local`
const content = document.querySelector(".content")

function _post(params, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${params.url}`)
    xhr.send(params.data)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4){
            callback(xhr.responseText)

        }
        
    }
}

function _get(params, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${params.url}`)
    xhr.send(params.data)
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4){
            callback(xhr.responseText)

        }
        
    }
}

_post({ url: '/modules/registr.html'}, function(response){
    content.innerHTML = response;
    LoadPageChats()
    LoadPageAuth()  
})

function _elem(selector) {
    return document.querySelector(selector)
}

/*Кнопка регистрация*/
function LoadPageChats() {
    _elem('.registr').addEventListener('click', function (){
        let rdata = new FormData()
        rdata.append('fam', document.querySelector('input[name="fam"]').value)
        rdata.append('name', document.querySelector('input[name="name"]').value)
        rdata.append('otch', document.querySelector('input[name="otch"]').value)
        rdata.append('email', document.querySelector('input[name="email"]').value)
        rdata.append('pass', document.querySelector('input[name="pass"]').value)

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


function OnLoadPageChats() {
    _post({ url: '/modules/chat.html'}, function(response){
    content.innerHTML = response;
})
}

/*кнопка авторизация*/
function LoadPageAuth() {
    document.querySelector('.authorize').addEventListener('click', function(){
        _post({ url:'/modules/author.html'}, function(response){
            content.innerHTML = response;
            LoadPageReg()
            LoadPageChatsAuth()

        })
    })
}
/*Кнопка регистрации в авторизации*/
function LoadPageReg() {
    document.querySelector('.author_1').addEventListener('click', function(){
        _post({ url:'/modules/registr.html'}, function(response){
            content.innerHTML = response;
            LoadPageChats()
            LoadPageAuth()

        })
    })
}

/*Кнопка авторизации в авторизации*/
function LoadPageChatsAuth() {
    _elem('.author').addEventListener('click', function (){
        let rdata = new FormData()
        rdata.append('email', document.querySelector('input[name="email"]').value)
        rdata.append('pass', document.querySelector('input[name="pass"]').value)

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${host}/auth/`);
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