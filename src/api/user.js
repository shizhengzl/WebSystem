import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/Users/Login',
    method: 'post',
    data
  })
}

export function getInfo(token) { 
  return request({
    url: '/api/Users/GetUserInfo',//'/vue-admin-template/user/info',
    method: 'post',
     token  
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
