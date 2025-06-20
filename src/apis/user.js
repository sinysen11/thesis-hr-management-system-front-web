import request from '@/services/request'
import { user } from '@/constants/apis'

export function getOneCustomer(data) {
    // jaccs.com.kh / api / application_number
    return request({
        url: `${user.getOneCustomer.url}/${data}`,
        method: user.getOneCustomer.method
    })
}
export function getAllExistingUsers() {
    return request({
        url: user.getAllExistingUsers.url,
        method: user.getAllExistingUsers.method
    })
}

export function getOneExistingUser(data) {
    return request({
        url: `${user.getOneExistingUser.url}/${data}`,
        method: user.getOneExistingUser.method
    })
}

export function getAllUserAD() {
    return request({
        url: user.getAllUserAD.url,
        method: user.getAllUserAD.method
    })
}

export function getOneUserAD(data) {
    return request({
        url: `${user.getOneExistingUser.url}/${data}`,
        method: user.getAllExistingUsers.method
    })
}

export function addOneUser(data) {
    return request({
        url: user.addOneUser.url,
        method: user.addOneUser.method,
        data
    })
}

export function updateOneExistingUser(data) {
    return request({
        url: user.updateOneExistingUser.url,
        method: user.updateOneExistingUser.method,
        data
    })
}

export function getAllCbcUser() {
    return request({
        url: user.getAllCbcUser.url,
        method: user.getAllCbcUser.method
    })
}

export function getOneCbcUser(data) {
    return request({
        url: `${user.getOneCbcUser.url}/${data}`,
        method: user.getOneCbcUser.method
    })
}

export function addOneCbcUser(data) {
    return request({
        url: user.addOneCbcUser.url,
        method: user.addOneCbcUser.method,
        data
    })
}

export function updateOneCbcUser(data) {
    return request({
        url: user.updateOneCbcUser.url,
        method: user.updateOneCbcUser.method,
        data
    })
}