// pusher-event-chat/public/landing/app.js
(function() {

    'use strict';

    var pusher = new Pusher("YOUR_PUSHER_APP_KEY", {
        userAuthentication: {
            endpoint: "/pusher/user-auth",
        },
        channelAuthorization: {
            endpoint: "/pusher/auth",
        },
        cluster: 'YOUR_PUSHER_APP_CLUSTER',
        forceTLS: true,
    });

    let chat = {
        owner: undefined,
    }

    const messageEventName = 'client-new-message'
    const chatChannelName = 'presence-groupChat'
    const warningEvent = 'client-warn-user'
    const terminateEvent = 'client-terminate-user'

    const chatPage = $(document)
    const chatWindow = $('.chatbubble')
    const chatHeader = chatWindow.find('.unexpanded')
    const chatBody = chatWindow.find('.chat-window')


    let helpers = {
        ToggleChatWindow: function() {
            chatWindow.toggleClass('opened')
            chatHeader.find('.title').text(
                chatWindow.hasClass('opened') ? 'Minimize Chat Window' : 'Chat with other participants'
            )
        },

        ShowAppropriateChatDisplay: function() {
            (chat.owner) ? helpers.ShowChatRoomDisplay(): helpers.ShowChatInitiationDisplay()
        },

        ShowChatInitiationDisplay: function() {
            chatBody.find('.chats').removeClass('active')
            chatBody.find('.join-screen').addClass('active')
        },

        ShowChatRoomDisplay: function() {
            chatBody.find('.chats').addClass('active')
            chatBody.find('.join-screen').removeClass('active')
            setTimeout(function() {
                chatBody.find('.loader-wrapper').hide()
                chatBody.find('.input, .messages').show()
            }, 2000)
        },

        NewChatMessage: function(message) {
            if (message !== undefined) {
                const messageClass = message.sender !== chat.owner ? 'reply' : 'user'
                chatBody.find('ul.messages').append(
                    `<li class="clearfix message ${messageClass}">
                        <div class="sender">${message.sender}</div>
                        <div class="message">${message.text}</div>
                    </li>`
                )

                chatBody.scrollTop(chatBody[0].scrollHeight)
            }
        },

        SendMessageToOthers: function(evt) {
            evt.preventDefault()
            let createdAt = new Date()
            createdAt = createdAt.toLocaleString()
            const message = $('#newMessage').val().trim()

            var channel = pusher.channel(chatChannelName);
            channel.trigger(messageEventName, {
                'sender': chat.owner,
                'text': message,
                'createdAt': createdAt
            });

            helpers.NewChatMessage({
                'text': message,
                'name': chat.owner,
                'sender': chat.owner
            })

            console.log("Message added!")
            $('#newMessage').val('')
        },

        JoinChatSession: function() {
            chatBody.find('#joinScreenForm button').attr('disabled', true)
            pusher.signin();

            const channel = pusher.subscribe(chatChannelName);
            channel.bind('pusher:subscription_succeeded', () => {
                let me = channel.members.me
                chat.owner = me.info.fullname
                helpers.ShowAppropriateChatDisplay()
            });

            helpers.Listen()
        },

        Listen() {
            const channel = pusher.channel(chatChannelName);
            channel.bind(messageEventName, (data) => {
                helpers.NewChatMessage(data)
            })

            pusher.user.bind(warningEvent, function(data) {
                alert(JSON.stringify(data.message));
            });

            pusher.user.bind(terminateEvent, function(data) {
                alert(JSON.stringify(data.message));
                chat.owner = '';
                helpers.ShowAppropriateChatDisplay()
            });
        }
    }

    chatPage.ready(helpers.ShowAppropriateChatDisplay)
    chatHeader.on('click', helpers.ToggleChatWindow)
    chatBody.find('#joinScreenForm').on('click', helpers.JoinChatSession)
    chatBody.find('#messageOthers').on('submit', helpers.SendMessageToOthers)
}());