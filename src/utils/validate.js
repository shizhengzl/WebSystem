/**
 * Created by PanJiaChen on 16/11/18.
 */

import { valid } from "mockjs";

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return true;
  //const valid_map = ['admin', 'editor']
  //return valid_map.indexOf(str.trim()) >= 0
}


/* 是否手机号码*/
export function IsPhone(rule, value, callback) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!value) {
    callback();
  } else {
    if ((!reg.test(value)) && value) {
      callback(new Error('请输入正确的电话号码'));
    } else {
      callback();
    }
  }
}

/* 是否邮箱*/
export function IsEmail(rule, value, callback) {
  const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
  if (!value) {
    callback();
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  }
}
