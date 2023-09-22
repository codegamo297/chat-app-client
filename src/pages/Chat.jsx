import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { io } from 'socket.io-client';

import { allUserRoute, host } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Loader from '../assets/loader.gif';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #131324;

    .loader {
        max-inline-size: 100%;
    }

    .container {
        height: 85vh;
        width: 85vw;
        background-color: #00000076;
        display: grid;
        grid-template-columns: 25% 75%;

        @media screen and (min-width: 720px) and (max-width: 1024px) {
            grid-template-columns: 35% 65%;
        }
    }
`;

function Chat() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentChat, setCurrentChat] = useState(undefined);

    const socket = useRef();

    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        } else {
            setIsLoggedIn(true);
            setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
        }
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit('add-user', currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const handleGetCurrentUser = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const res = await axios.get(`${allUserRoute}/${currentUser._id}`);
                    setContacts(res.data);
                    setIsLoading(false);
                } else {
                    navigate('/setAvatar');
                }
            }
        };

        handleGetCurrentUser();
    }, [isLoggedIn, currentUser, navigate]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={Loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="container">
                        <Contacts
                            contacts={contacts}
                            currentUser={currentUser}
                            changeChat={handleChatChange}
                        />
                        {!isLoading && currentChat === undefined ? (
                            <Welcome currentUser={currentUser} />
                        ) : (
                            <ChatContainer
                                currentChat={currentChat}
                                currentUser={currentUser}
                                socket={socket}
                            />
                        )}
                    </div>
                </Container>
            )}
        </>
    );
}

export default Chat;
