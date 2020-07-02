$(function(){
  function buildHTML(message){
    
      // 「もしメッセージに画像が含まれていたら」という条件式
      if (message.image) {
        var html = `<div class="chat-main__new" data-message-id=${message.id}>
                      <div class="chat-main__new--name">
                        ${message.user_name}
                      </div>
                      <div class="chat-main__new--time">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="chat-main__tweet">
                        <img class="lower-message__image" src="${message.image}">
                      </div>
                    <div class="chat-main__tweet">
                      ${message.content}
                    </div>`

      
    } else {
      var html = `<div class="chat-main__new" data-message-id=${message.id}>
                    <div class="chat-main__new--name">
                      ${message.user_name}
                    </div>
                    <div class="chat-main__new--time">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="chat-main__tweet">
                    ${message.content}
                  </div>`
                
    }
    return html;
  }

  

  $(".new_message").on("submit",function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.chat-main__message').append(html);
      $('form')[0].reset();
      $('.form__submit').prop('disabled', false);
      $('.chat-main__message').animate({ scrollTop: $('.chat-main__message')[0].scrollHeight});
    })
    .fail(function(){
      alert('error');
    })
  })

  var reloadMessages = function() {

    var last_message_id = $('.chat-main__new:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message').append(insertHTML);
        $('.chat-main__message').animate({ scrollTop: $('.chat-main__message')[0].scrollHeight});
      }
    })
    .fail(function(){
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});

