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



export function Save(rq) {
  return request({
    url: '/api/Common/Save',
    method: 'post',
    data: rq
  })
}

export function Remove(rq) {
  return request({
    url: '/api/Common/Remove',
    method: 'post',
    data: rq
  })
}


export function GetTables() {
  return request({
    url: '/api/Common/GetTables',
    method: 'post'
  })
}
