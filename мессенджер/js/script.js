const host = `http://api-messenger.web-srv.local`
const content = document.querySelector(".content")
var token = "";
let user_id = null; 
let currentChatId = null; 



function _post(params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', `${params.url}`)
    http_request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem (token));
    http_request.send(params.data)
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            callback(http_request.responseText)
        }
    }
}

function _get(params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('GET', `${params}`);
    http_request.setRequestHeader('Authorization', 'Bearer ' + token);
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
     http_request.setRequestHeader('Authorization', 'Bearer ' + token);
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
     http_request.setRequestHeader('Authorization', 'Bearer ' + token);
    http_request.send();
    http_request.onreadystatechange = function () {
        if (http_request.readyState == 4) {
            if (typeof(callback) == "function")  {
                callback(http_request.responseText)
            }
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
//#region Регистрация
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
//#region Загруска страницы чата
function OnLoadPageChats() {

    _post({ url: '/modules/chat.html' }, function (response) {
        content.innerHTML = response;
        LoadPageLogout() 
        getCurrentUser();

        // LoadPageEditProfile();
        
        
    })
}

/*Кнопка автризация*/
//#region Кнопка автризация
function LoadPageAuth() {
    document.querySelector('.authorize').addEventListener('click', function PageAuth() {
        _post({ url: '/modules/author.html' }, function (response) {
        content.innerHTML = response;
        LoadPageChatsAuth()
        LoadPageReg()
    })
    })
}

_load('/modules/author.html',LoadPageChatsAuth)
/*кнопка далее в авторизации*/
//#region Авторизация
function LoadPageChatsAuth() {
    _elem('.author').addEventListener('click', function () {
       _load('/modules/registr.html',content,LoadPageChats)

        let edata = new FormData()
        let email = _elem('input[name="email"]').value
        let password = _elem('input[name="password"]').value
        edata.append('email', email)
        edata.append('pass', password)

        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${host}/auth`);
        xhr.send(edata);
        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {
                let response = JSON.parse(xhr.responseText)
                token = response["Data"]["token"]
                console.log(response)
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
//#region Кнопка регистрация
function LoadPageReg() {
    document.querySelector('.reg').addEventListener('click', function() {
        _post({ url: '/modules/registr.html' }, function (response) {
        content.innerHTML = response;
        LoadPageChats()
        LoadPageAuth()
      
    })
 })
}

//выход из чата 
//#region Страница с чатами
function LoadPageLogout() {
    const LogoutButton = _elem('.exit-1');
    if (LogoutButton) {
        LogoutButton.addEventListener('click', function (){
            token = "";
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `${host}/Logout/`)
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            xhr.send();

             _post({ url: '/modules/registr.html' }, function (response) {
                content.innerHTML = response;
                LoadPageChats(); 
                LoadPageAuth(); 
             });
        });
    }
    //списки чатов
    _get(`${host}/chats`, function(res){
        res = JSON.parse(res)
        console.log(res)
        res.forEach(element => {
            let chat = document.createElement('div')
            chat.classList.add('messages_1')
            chat.setAttribute('id', element.chat_id)
            chat.addEventListener('click', function(){
                 _get(`${host}/user`, function(response){
                    response = JSON.parse(response)
                    user_id = response.id;
                    console.log(user_id)
                })
                _get(`${host}/messages/?chat_id=${element.chat_id}`, function(res){
                    res = JSON.parse(res)
                    res.forEach(element => {
                        console.log(res)
                        if (user_id == element["sender"]["id"]){
                            console.log(1)
                        }else{
                            
                        }
                    })
                    
                })
            })

            let name_chat = document.createElement('p')
            name_chat.textContent = element.chat_name
            chat.append(name_chat)
            document.querySelector('.block_chats').append(chat)
        });
    })
}


function showMessages(chat_id){
    _get(`${host}/user`, function(response){
        response = JSON.parse(response)
        user_id = response.id;
        console.log(user_id)
       
    })
    _get(`${host}/messages/?chat_id=${chat_id}`, function(res){
        res = JSON.parse(res)
        res.forEach(element => {
            console.log(res)
            if (user_id == element["sender"]["id"]){
                console.log(1)
            }else{

            }
        })
        
    })
}


function createMessageBlock(messageText, isSender) {
    const messageDiv = document.createElement('div');
    if (isSender) {
        messageDiv.classList.add('message', 'message_companion1'); 
    } else {
        messageDiv.classList.add('message', 'message_companion2');
    }
    messageDiv.textContent = messageText;
    const messagesContainer = document.querySelector('.block_messages');
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
   /* createMessageBlock("Это мое сообщение", true);
    createMessageBlock("Это сообщение от собеседника", false);*/
}



/*let chats = [];
 const inputArea = document.getElementById('input-area');
 // Отправка сообщения
  inputArea.addEventListener('submit', e => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text || !currentChatId) return;

    const chat = chats.find(c => c.id === currentChatId);
    chat.messages.push({ user: currentUser, text });
    messageInput.value = '';
    renderMessages();
  });*/

//#endregion
//Создание нового чата
/*function  createChat(email) {
    const url = `${host}/chats/`;
    const data = JSON.stringify({email:email});
    const xhr = new XMLHttpRequest();
    xhr.open('POST',url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                alert(response.message);
                console.log('Создан чат:', response.Data);
            } else {
                alert('ошибка при создании чата:' + xhr.status);
            }
        }
    };
    xhr.send(data);
}*/



