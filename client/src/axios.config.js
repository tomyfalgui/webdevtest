import axios from "axios"

const instance = axios.create({
  baseURL: "https://test-server-webdev.herokuapp.com"
})

export default instance
