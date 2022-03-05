import request from '@/utils/request'

export function SaveUserPermission(data) {
  return request({
    url: '/api/Permission/SaveUserPermission',
    method: 'post',
    data
  })
}
  
export function SaveRolePermission(data) {
  return request({
    url: '/api/Permission/SaveRolePermission',
    method: 'post',
    data
  })
}

export function SaveOrganizationPermission(data) {
  return request({
    url: '/api/Permission/SaveOrganizationPermission',
    method: 'post',
    data
  })
}
