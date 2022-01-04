import request from '@/utils/request'

export function GetHeader(rq) { 
  return request({
    url: '/api/Common/GetHeader',
    method: 'post',
    data: rq
  })
}

export function GetList(rq) { 
  return request({
    url: '/api/Common/GetList',
    method: 'post',
    data:rq
  })
}


export function GetTreeList(rq) {
  return request({
    url: '/api/Common/GetTreeList',
    method: 'post',
    data: rq
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



export function GetALLConnections() {
  return request({
    url: '/api/Common/GetALLConnections',
    method: 'post'
  })
}


export function GetColumns(rq) {
  return request({
    url: '/api/Common/GetColumns',
    method: 'post',
    data: rq
  })
}

export function GetCurrentColumns(rq) {
  return request({
    url: '/api/Common/GetCurrentColumns',
    method: 'post',
    data: rq
  })
}


export function AddExtendedproperty(rq) {
  return request({
    url: '/api/Common/AddExtendedproperty',
    method: 'post',
    data: rq
  })
}

export function ModifyExtendedproperty(rq) {
  return request({
    url: '/api/Common/ModifyExtendedproperty',
    method: 'post',
    data: rq
  })
}

export function AddTableExtendedproperty(rq) {
  return request({
    url: '/api/Common/AddTableExtendedproperty',
    method: 'post',
    data: rq
  })
}

export function ModifyTableExtendedproperty(rq) {
  return request({
    url: '/api/Common/ModifyTableExtendedproperty',
    method: 'post',
    data: rq
  })
}


export function GetEnums(rq) {
  return request({
    url: '/api/Common/GetEnums',
    method: 'post',
    data: rq
  })
}

export function GetEnum(rq) {
  return request({
    url: '/api/Common/GetEnum',
    method: 'post',
    data: rq
  })
}
