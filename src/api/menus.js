import request from '@/utils/request' 

export function GetSupperMenus() {
  return request({
    url: '/api/Menus/GetSupperMenus',
    method: 'post'
  })
}
export function GetParentMenus() {
  return request({
    url: '/api/Menus/GetParentMenus',
    method: 'post'
  })
}
export function GetCompanyMenus() {
  return request({
    url: '/api/Menus/GetCompanyMenus',
    method: 'post'
  })
}
