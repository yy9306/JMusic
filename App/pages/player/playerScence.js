import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Platform
} from 'react-native'

import NavBarView from '../../base/NavBarView'
import BlurImage from 'react-native-blur-image'
import {width,height, jumpPager} from '../../base/Utils'

export default class PlayerScence extends Component{
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props)
    this.bgColor = '#222'
  }
  
  render() {
    const offsetTop = Platform.os === 'ios' ? 20 : 0;
    return (
      <View style={styles.container}>
        <BlurImage source={{uri: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000004gfAkV4K4lBa.jpg?max_age=2592000'}}
                   style={{width: width, height: height, paddingTop: offsetTop,}}
                   blurRadius={30}
        />
        <TouchableOpacity style={{ position: 'absolute', left: 15, top: 30,width: 32, height: 17}} activeOpacity={0.5}>
          <Image style={{width: 32, height: 17, resizeMode: 'stretch'}} source={require('../img/back.png')}/>
        </TouchableOpacity>
        <View style={styles.normal_player}>
          <View style={styles.top}>
            <Text style={styles.top_title} numberOfLines={1}>狐狸</Text>
            <Text style={styles.sub_title} numberOfLines={1}>薛之谦</Text>
          </View>
          <View style={styles.middle}>
            <View style={styles.middle_l}>
              <Image style={{width: 4/5*width,height:4/5*width,borderRadius:2/5*width}} source={{uri: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000004gfAkV4K4lBa.jpg?max_age=2592000'}} />
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.progress_wrapper}>
            
            </View>
            <View style={styles.operators}>
              <TouchableOpacity>
                <Image style={{width: 30, height: 30}} source={require('../img/icon_mode.png')}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={{width: 30, height: 30}} source={require('../img/icon_prev.png')}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={{width: 40, height: 40}} source={require('../img/icon_play.png')}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={{width: 30, height: 30}} source={require('../img/icon_next.png')}/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image style={{width: 30, height: 30}} source={require('../img/icon_love.png')}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  normal_player: {
    position: 'absolute',
    left: 0,
    top: 20,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
  },
  top: {
    marginTop: 10,
    width: 7/10*width,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top_title: {
    fontSize: 18,
    color: '#fff',
  },
  sub_title: {
    marginTop: 5,
    fontSize: 14,
    color: '#fff',
  },
  middle: {
   position: 'absolute',
   top: 80,
   bottom: 170,
   width: width,
   alignItems: 'center',
  },
  middle_l: {
    width: 4/5*width+20,
    height: 4/5*width+20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderRadius:2/5*width+10,
    borderColor: 'hsla(0,0%,100%,.1)'
  },
  bottom: {
    position: 'absolute',
    bottom: 50,
    width: width,
    alignItems: 'center'
  },
  operators: {
    width: 4/5*width,
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})