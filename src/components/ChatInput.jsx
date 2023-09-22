import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    background-color: #080420;
    padding: 0 2rem;
    padding-bottom: 0.3rem;

    .button-container {
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;

        .emoji {
            position: relative;

            svg {
                font-size: 1.5rem;
                color: #fff000c8;
                cursor: pointer;
            }

            .EmojiPickerReact {
                position: absolute;
                top: -460px;
                left: 30px;
                background-color: #080420;
                box-shadow: 0 5px 10px #9a86f3;
                border-color: #9a86f3;

                .epr-body::-webkit-scrollbar {
                    background-color: #080420;
                    width: 5px;

                    &-thumb {
                        background-color: #9a86f3;
                        border-radius: 4px;
                    }
                }

                .epr-search {
                    background-color: transparent;
                    border-color: #9a86f3;
                    color: white;
                }

                .epr-emoji-category-label {
                    background-color: #080420;
                }
            }
        }
    }

    .input-container {
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        background-color: #ffffff34;

        input {
            width: 90%;
            background-color: transparent;
            color: white;
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;

            &::selection {
                background-color: #9186f3;
            }

            &:focus {
                outline: none;
            }
        }

        button {
            padding: 0.4rem 1rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #9a86f3;
            border: none;
            cursor: pointer;

            svg {
                font-size: 1.2rem;
                color: white;
            }
        }
    }
`;

function ChatInput({ handleSendMsg }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState('');

    const inputRef = useRef(null);

    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event) => {
        setMsg((prevMessage) => prevMessage + event.emoji);
    };

    const sendChat = (e) => {
        e.preventDefault();

        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg('');
            inputRef.current.focus();
        }
    };

    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                    {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                </div>
            </div>
            <form className="input-container" onSubmit={(e) => sendChat(e)}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="type your message here"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button type="submit">
                    <IoMdSend />
                </button>
            </form>
        </Container>
    );
}

export default ChatInput;
