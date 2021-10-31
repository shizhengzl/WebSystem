import request from '@/utils/request'

export function GetListHeader(tableName) {
  var data = { TableName: tableName };
  return request({
    url: '/api/Common/GetListHeader',
    method: 'post',
    data
  })
}

export function GetHeader(tableName) {
  var data = { TableName: tableName };
  return request({
    url: '/api/Common/GetHeader',
    method: 'post',
    data
  })
}

export function GetList(rq) { 
  return request({
    url: '/api/Common/GetList',
    method: 'post',
    data:rq
  })
}



export function Modify(rq) {
  return request({
    url: '/api/Common/Modify',
    method: 'post',
    data: rq
  })
}
