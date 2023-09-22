import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuid4 } from 'uuid';

import Logout from './Logout';
import ChatInput from './ChatInput';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';

const Container = styled.div`
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 10% 80% 10%;
    gap: 0.1rem;
    overflow: hidden;

    @media screen and (min-width: 720px) and (max-width: 1024px) {
        grid-template-rows: 15% 70% 15%;
    }

    .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;

        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;

            .avatar {
                img {
                    height: 3rem;
                }
            }

            .username {
                h3 {
                    color: white;
                }
            }
        }
    }

    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }

        .message {
            display: flex;
            align-items: center;

            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
            }
        }

        .sender {
            justify-content: flex-end;

            .content {
                background-color: #4f04ff21;
            }
        }

        .receiver {
            justify-content: flex-start;

            .content {
                background-color: #e1c9f11f;
            }
        }
    }
`;

function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const scrollRef = useRef();

    useEffect(() => {
        const handleGetAllMessage = async () => {
            const res = await axios.post(getAllMessagesRoute, {
                from: currentUser._id,
                to: currentChat._id,
            });

            setMessages(res.data);
        };

        handleGetAllMessage();
    }, [currentChat, currentUser]);

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });

        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
        }
    }, [socket]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        console.log(scrollRef.current);
        scrollRef.current?.scrollIntoView({
            block: 'start',
            inline: 'nearest',
            behavior: 'smooth',
        });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        <img
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                            alt="avatar"
                        />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message) => (
                    <div ref={scrollRef} key={uuid4()}>
                        <div className={`message ${message.fromSelf ? 'sender' : 'receiver'}`}>
                            <div className="content ">
                                <p>{message.message}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
    );
}

export default ChatContainer;
