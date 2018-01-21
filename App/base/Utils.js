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

export {jumpPager,width,height}