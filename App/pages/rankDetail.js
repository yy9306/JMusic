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
  ScrollView, Animated
} from 'react-native'

const windowHeight = width * 0.7;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

import HttpMusic from '../api/api'
import {createSong} from '../common/song'
import {height, jumpPager, width} from '../base/Utils'

export default class RankDetail extends Component{
  constructor(props) {
    super(props)
    
    this.state = {
      scrollY: new Animated.Value(0),
      rankList: []
    }
    this.HttpMusic = new HttpMusic()
    this.dataId = this.props.navigation.state.params.data.id
    this.requestData(this.dataId)
  }
  
  requestData(id) {
    this.HttpMusic.getRankDetail(id)
      .then((request) => {
        if(request.code === 0) {
          this.title = request.topinfo.ListName
          this.setState({rankList: this._normalizeSongs(request.songlist)})
        }
      }).catch((error) => {
        console.log(error)
    })
  }
  
  _normalizeSongs(list) {
    let ret = []
    list.forEach((item) => {
      const musicData = item.data
      ret.push(createSong(musicData))
    })
    return ret.slice(0, 99)
  }
  
  _renderNumber(index) {
    switch (index) {
      case 0:
        return (
          <Image style={styles.icon} source={require('./img/first.png')}/>
        )
      case 1:
        return (
          <Image style={styles.icon} source={require('./img/second.png')}/>
        )
      case 2:
        return (
          <Image style={styles.icon} source={require('./img/third.png')}/>
        )
      default:
        return (
          <View style={styles.text}>
            <Text style={{fontSize: 18, color: '#ffcd32'}}>{index+1}</Text>
          </View>
        )
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {this.props.navigation.goBack()}} style={styles.back}>
          <Image style={{width: 26, height: 26}}  source={require('./img/icon_back.png')}/>
        </TouchableOpacity>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{this.title}</Text>
        </View>
        {this.state.rankList.length > 0 && <Animated.Image style={{
          resizeMode: 'cover',
          width: width,
          height: windowHeight,
          opacity: this.state.scrollY.interpolate({
            inputRange: [-windowHeight, 0, windowHeight / 1.2],
            outputRange: [1, 1, 0.4],
            extrapolate: 'clamp'
          }),
          transform: [{
            translateY: this.state.scrollY.interpolate({
              inputRange: [ -windowHeight, 0, windowHeight],
              outputRange: [windowHeight/2, 0, -50],
              extrapolate: 'clamp'
            })
          },{
            scale: this.state.scrollY.interpolate({
              inputRange: [ -windowHeight, 0, windowHeight],
              outputRange: [2, 1, 1]
            })
          }]
        }}  source={{uri: this.state.rankList[0].image}}/> }
        <Animated.View style={{
          flex: 1,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: windowHeight - 50,
          height: height,
          zIndex: 99,
          paddingTop: 20,
          paddingLeft: 30,
          paddingRight: 30,
          backgroundColor: '#222',
          transform: [{
            translateY: this.state.scrollY.interpolate({
              inputRange: [ -windowHeight, 0, windowHeight],
              outputRange: [windowHeight - 50, 0, -windowHeight + 110],
              extrapolate: 'clamp'
            })
          }]
        }} ref="list_wrapper">
          <AnimatedFlatList
            data={this.state.rankList}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={26}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
              {useNativeDriver: true}
            )}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity onPress={() => {
                  jumpPager(this.props.navigation.navigate, 'PlayerScence', {
                    songs: this.state.rankList,
                    currentIndex: index
                  })
                }}>
                  <View style={styles.listGroup}>
                    {this._renderNumber(index)}
                    <View>
                      <Text numberOfLines={1} style={styles.singer_name}>{item.name}</Text>
                      <Text numberOfLines={1} style={styles.singer_album}>{item.singer}-{item.album}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }}/>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  back: {
    position: 'absolute',
    left: 10,
    top: 25,
    zIndex: 10,
  },
  titleWrapper: {
    marginTop: 10,
    flex: 1,
    width: 0.8 * width,
    height: 50,
    position: 'absolute',
    left: 0.1 * width,
    justifyContent: 'center',
    zIndex: 101,
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  listGroup: {
    height:64,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  singer_name: {
    fontSize: 14,
    color: '#fff',
  },
  singer_album: {
    fontSize: 14,
    marginTop: 5,
    color: 'hsla(0,0%,100%,.3)'
  },
  icon: {
    marginRight: 30,
    width: 25,
    height: 24,
  },
  text: {
    marginRight: 30,
    width: 25,
    alignItems:'center'
  }
})