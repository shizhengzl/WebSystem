import request from '@/utils/request' 

export function GetSupperMenus(data) {
  return request({
    url: '/api/Menus/GetSupperMenus',
    method: 'post'
  })
}
