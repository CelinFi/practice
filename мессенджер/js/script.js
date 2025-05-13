const host = `http://api-messenger.web-srv.local`
const content = document.querySelector(".content")


function _post (params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('POST', `${params.url}`)
    http_request.send(params.data)
    http_request.onreadystatechange = function () {
        if(http_request.readyState ==4){
            callback(http_request.responseText)
        }
    }
}

function _get (params, callback) {
    let http_request = new XMLHttpRequest();
    http_request.open('GET',`${params.url}`);
    http_request.send();
    http_request.onreadystatechange = function (){
        if (http_request.readyState == 4){
            callback(http_request.responseText)
        }
    };
}
/*
_post({url:'/modules/registr.html'}, function(response){
    content.innerHTML = response;
    LoadPageChats()
})

function _elem(selector){
    return document.querySelector(selector)
}

/*Регистрация*/
/*function LoadPageChats() {
    _elem('.registr').addEventListener('click',function(){
    


    let rdata = new FormData()
    let first_name = _elem('input[name="first_name"]').value
     let last_name = _elem('input[name="last_name"]').value
      let sur_name = _elem('input[name="sur_name"]').value
       let email = _elem('input[name="email"]').value
        let password = _elem('input[name="password"]').value
        rdata.append('first_name',first_name)
         rdata.append('last_name',last_name)
          rdata.append('sur_name',sur_name)
           rdata.append('email',email)
            rdata.append('password',password)

            _post({url:`${host}/user/`, data: rdata}, function(response){
                response = JSON.parse(response)

                if (response.success) {
                    token = response.token
                    console.log(token)

                }
            })
})

}*/

   
_post({url:'/modules/chat.html'}, function(response){
    content.innerHTML = response;
    
})
