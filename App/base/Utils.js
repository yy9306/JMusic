import React from 'react'
import {
  Image,
  Dimensions
} from 'react-native'

const {width,height} = Dimensions.get('window');

const jumpPager = (navigate,page,params) => {
  if (params != null) {
    navigate(page,{
      data:params
    })
  } else {
    navigate(page)
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(arr) {
  const _arr = arr.slice()
  for(let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export {jumpPager,width,height, getRandomInt}
