import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Buffer } from 'buffer';

import Loader from '../assets/loader.gif';
import { setAvatarRoute } from '../utils/APIRoutes';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader {
        max-inline-size: 100%;
    }

    .title-container {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;

        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;

            img {
                height: 6rem;
            }
        }

        .selected {
            border: 0.4rem solid #4e0eff;
        }
    }

    .submit-btn {
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;

        &:hover {
            background-color: #4e0eff;
        }
    }
`;

function SetAvatar() {
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    };

    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
            navigate('/login');
        } else {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('chat-app-user'));

        if (user.avatarImage) {
            navigate('/');
        } else {
            setIsLoggedIn(true);
        }
    }, [navigate]);

    const setProfilePicture = async () => {
        // Kiểm tra xem đã chọn avatar chưa, chưa sẽ báo lỗi còn rồi sẽ lấy user từ local storage,
        // Gửi image lên server để server xử lí(sửa và cập nhật) rồi đi sửa lại user ở local
        // Đưa về trang home
        if (selectedAvatar === undefined) {
            toast.error('Please select an avatar', toastOptions);
        } else {
            if (!isLoggedIn) {
                return;
            }

            const user = await JSON.parse(localStorage.getItem('chat-app-user'));

            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            } else {
                toast.error('Error setting avatar. Please try again', toastOptions);
            }
        }
    };
    console.log(selectedAvatar);
    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const handleAvatar = async () => {
            // Lấy api hình ảnh chuyển sang mã base64
            // đưa vào mảng avatars và lấy xong sẽ hết loading
            // Sẽ có lỗi API khi truy cập quá nhiều
            try {
                const data = [];

                for (let i = 0; i < 4; i++) {
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                    const buffer = Buffer.from(image.data);
                    data.push(buffer.toString('base64'));
                }

                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        handleAvatar();
    }, [isLoggedIn, selectedAvatar]);

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={Loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`avatar ${
                                        selectedAvatar === index ? 'selected' : ''
                                    }`}
                                >
                                    {/* Nhúng SVG vào trang web */}
                                    <img
                                        src={`data:image/svg+xml;base64,${avatar}`}
                                        alt="avatar"
                                        onClick={() => setSelectedAvatar(index)}
                                        index={index}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button className="submit-btn" onClick={setProfilePicture}>
                        Set as Profile Picture
                    </button>
                    <ToastContainer />
                </Container>
            )}
        </>
    );
}

export default SetAvatar;
