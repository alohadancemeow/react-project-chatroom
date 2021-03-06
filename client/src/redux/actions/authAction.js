import axios from 'axios'
import { returnErrors, clearErrors } from './errorAction'
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from './types'

// # api url
const API_URL = 'https://chatroom-app-backend.herokuapp.com/api/users'


// # Check token and load user
export const loadUser = () => async (dispatch, getState) => {

    // User loading
    dispatch({
        type: USER_LOADING
    })

    // Call api
    await axios.get(`${API_URL}/user`, tokenConfig(getState))
        .then((res) => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch((err) => {
            dispatch(returnErrors(
                err.response.data,
                err.response.status
            ))

            dispatch({
                type: AUTH_ERROR
            })
        })
}

// # Register user
export const register = ({ name, email, password }) => async (dispatch) => {

    //  Set header
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ name, email, password })

    // Call api -> server
    await axios.post(`${API_URL}/register`, body, config)
        .then((res) => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data // token, user
            })

            // After register success, clear error
            dispatch(clearErrors())
        })
        .catch((err) => {
            dispatch(returnErrors(
                err.response.data,
                err.response.status,
                REGISTER_FAIL
            ))

            dispatch({
                type: REGISTER_FAIL
            })
        })

}

// # Sign in user
export const signin = ({ email, password }) => async (dispatch) => {

    // Set headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }

    // Request body
    const body = JSON.stringify({ email, password })

    // Call api
    await axios.post(`${API_URL}/signin`, body, config)
        .then((res) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })

            // After login success, clear error
            dispatch(clearErrors())
        })
        .catch((err) => {
            dispatch(returnErrors(
                err.response.data, // msg
                err.response.status, // status
                LOGIN_FAIL // id
            ))

            // send to reducer to change state
            dispatch({
                type: LOGIN_FAIL
            })
        })

}

// # Sign out user
export const signout = () => (dispatch) => {

    // No need to call api,
    // Just remove 'token' from localStorage.
    dispatch({ type: LOGOUT_SUCCESS })

}


// # Setup config/headers and token
export const tokenConfig = (getState) => {

    // Get token from localStorage
    const token = getState().auth.token

    // Headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // If token, add to header['x-auth-token']
    if (token) {
        config.headers['x-auth-token'] = token
    }

    return config
}