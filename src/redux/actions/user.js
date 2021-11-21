import Axios from 'axios';
import { API_URL } from '../../constants/API';

export const registerHandler = ({ fullname, username, email, password } ) => {
    return (dispatch) => {
        Axios.post(`${API_URL}/users`, {
            fullname,
            username,
            email,
            password,
            role: "user"
        })
        .then((result) => {
            delete result.data.password;
            
            dispatch({
                type: "USER_LOGIN",
                payload: result.data
            })
            alert("Berhasil mendaftarkan user!");
        })
        .catch(() => {
            alert("Gagal mendaftarkan user!");
        })
    }
}

export const loginUser = ({ username, password }) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                username: username
            }
        })
        .then((result) => {
            if (result.data.length) {
                console.log(result.data[0])
                if (password === result.data[0].password) {
                    delete result.data[0].password;
                    localStorage.setItem("userData", JSON.stringify(result.data[0]));

                    dispatch({
                        type: "USER_LOGIN",
                        payload: result.data[0]
                    })
                } else {
                    // Handlle error password wrong
                    dispatch({
                        type: "USER_ERROR",
                        payload: "Wrong password!"
                    })
                }
            } else {
                // Handle error username not found
                dispatch({
                    type: "USER_ERROR",
                    payload: "User not found!"
                })
            }
        })
        .catch(error => console.log('error :', error))
    }
}

export const logoutUser = () => {
    localStorage.removeItem("userData");
    return {
        type: "USER_LOGOUT"
    }
}

export const userKeepLogin = (userData) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                id: userData.id
            }
        })
        .then((result) => {
            delete result.data[0].password;
            
            localStorage.setItem("userData", JSON.stringify(result.data[0]))

            dispatch({
                type: "USER_LOGIN",
                payload: result.data[0]
            })
        })
        .catch((error) => {
            alert("Terjadi kesalahan di server");
        })
    }
}

export const checkStorage = () => {
    return {
        type: "CHECK_STORAGE",
    }
}