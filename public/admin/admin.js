// pusher-event-chat/public/admin/admin.js
(function() {

    'use strict';

    var pusher = new Pusher('YOUR_PUSHER_APP_KEY', {
        authEndpoint: '/pusher/auth',
        cluster: 'YOUR_PUSHER_APP_CLUSTER',
        forceTLS: true,
    });

    let chat = {
        subscribedUsers: [],
        currentParticipant: ''
    }

    var chatChannel = pusher.subscribe('presence-groupChat');
    const messageEventName = 'client-new-message'

    const chatBody = $(document)
    const participantsList = $('#participants')
    const chatMessage = $('#chatMessage')


    const helpers = {

        ClearChatMessages: () => $('#chat-msgs').html(''),

        DisplayChatMessage: (message) => {
            $('.response').show()
            $('#chat-msgs').prepend(
                `<tr>
                        <td>
                            <div class="sender">${message.sender} @ <span class="date">${message.createdAt}</span></div>
                            <div class="message">${message.text}</div>
                        </td>
                    </tr>`
            )
        },

        LoadParticipant: evt => {
            chat.currentParticipant = evt.target.dataset.roomId
            if (chat.currentParticipant !== undefined) {
                $('#participant-name').text(evt.target.dataset.roomId)

                chatBody.find('#warnParticipant').show()
                chatBody.find('#dismissParticipant').show()

                chatBody.find('#dismissParticipant').off('click').on('click', helpers.TerminateUserConnection)
                chatBody.find('#warnParticipant').off('click').on('click', helpers.SendWarning)
            }
            evt.preventDefault()
        },


        ChatMessage: evt => {
            evt.preventDefault()
            let createdAt = new Date()
            createdAt = createdAt.toLocaleString()
            const message = $('#chatMessage input').val().trim()
            chatChannel.trigger(messageEventName, {
                'sender': 'Admin',
                'text': message,
            });
            helpers.DisplayChatMessage({
                'sender': 'Admin',
                'text': message,
                'createdAt': createdAt
            })

            $('#chatMessage input').val('')
        },

        SendWarning: evt => {
            if (chat.currentParticipant !== undefined) {
                axios.post('/warn', {
                    "user_id": chat.currentParticipant
                }).then(response => {
                    console.log(chat.currentParticipant + ' warned')
                })
            }
            evt.preventDefault()
        },

        TerminateUserConnection: evt => {
            if (chat.currentParticipant !== undefined) {
                axios.post('/terminate', {
                    "user_id": chat.currentParticipant
                }).then(response => {
                    console.log(chat.currentParticipant + ' terminated')
                })

                chatBody.find('#warnParticipant').hide()
                chatBody.find('#dismissParticipant').hide()
                $('#participant-name').text('')
                chat.currentParticipant = ''
            }
            evt.preventDefault()
        },

        UpdateParticipantsList: (activeParticipants) => {
            let uniqueActiveParticipants = [...new Set(activeParticipants)];
            uniqueActiveParticipants.forEach(function(user) {
                $('#participants').append(
                    `<li class="nav-item"><a data-room-id="${user.id}" class="nav-link" href="#">${user.info.fullname}</a></li>`
                )
            })
        }
    }

    chatChannel.bind("pusher:member_added", (member) => {
        chat.subscribedUsers.push(member);
        $('#participants').html("");
        helpers.UpdateParticipantsList(chat.subscribedUsers)
    });

    chatChannel.bind("pusher:member_removed", (member) => {
        var remainingUsers = chat.subscribedUsers.filter(data => data.id != member.id);
        $('#participants').html("");
        chat.subscribedUsers = remainingUsers
        helpers.UpdateParticipantsList(remainingUsers)
    });

    chatChannel.bind(messageEventName, function(data) {
        helpers.DisplayChatMessage(data)
    })

    chatBody.find('#warnParticipant').hide()
    chatBody.find('#dismissParticipant').hide()

    chatMessage.on('submit', helpers.ChatMessage)
    participantsList.on('click', 'li', helpers.LoadParticipant)
}())