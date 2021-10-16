import request from '@/utils/request'

export function GetListHeader(data) {
  return request({
    url: '/api/Menus/GetListHeader',
    method: 'post'
  })
}

export function GetSupperMenus(data) {
  return request({
    url: '/api/Menus/GetSupperMenus',
    method: 'post'
  })
}
