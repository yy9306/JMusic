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
  Platform,
  ActivityIndicator,
  Easing
} from 'react-native'

import Video from 'react-native-video'
// import NavBarView from '../../base/NavBarView'
import BlurImage from 'react-native-blur-image'
import {width,height, jumpPager} from '../../base/Utils'

export default class PlayerScence extends Component{
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props)
    this.spinValue = new Animated.Value(0)
    this.state = {
      songs: [],   //歌曲id数据源
      playModel:1,  // 播放模式  1:列表循环    2:随机    3:单曲循环
      btnModel:require('../img/列表循环.png'), //播放模式按钮背景图
      pic_small:'',    //小图
      pic_big:'',      //大图
      file_duration:0,    //歌曲长度
      song_id:'',     //歌曲id
      title:'',       //歌曲名字
      author:'',      //歌曲作者
      file_link:'',   //歌曲播放链接
      songLyr:[],     //当前歌词
      sliderValue: 0,    //Slide的value
      pause:false,       //歌曲播放/暂停
      currentTime: 0.0,   //当前时间
      duration: 0.0,     //歌曲时间
      currentIndex:0,    //当前第几首
      isplayBtn:"require('../img/播放.png')",  //播放/暂停按钮背景图
      imgRotate: new Animated.Value(0),
    }
    this.isGoing = false; //为真旋转
    this.myAnimate = Animated.timing(this.state.imgRotate, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.linear),
    });
    this.bgColor = '#222'
  }
  
  
  render() {
    //如果未加载出来数据 就一直加载
    if (this.state.file_link.length <= 0 ) {
      return(
        <ActivityIndicator
          animating={this.state.animating}
          style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}
          size="large" />
      )
    }else{
      const spin = this.spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      })
    
    
      //数据加载出来
      return (
        <View style={styles.container}>
        
          {/*背景大图*/}
          <Image source={{uri:this.state.pic_big}} style={{flex:1}}/>
          {/*背景白色透明遮罩*/}
          <View style = {{position:'absolute',width: width,height:height,backgroundColor:'white',opacity:0.8}}/>
        
          <View style = {{position:'absolute',width: width}}>
            {/*胶片光盘*/}
            <Image source={require('../img/胶片盘.png')} style={{width:220,height:220,alignSelf:'center'}}/>
          
            {/*旋转小图*/}
            <Animated.Image
              ref = 'myAnimate'
              style={{width:140,height:140,marginTop: -180,alignSelf:'center',borderRadius: 140*0.5,transform: [{rotate: this.state.imgRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]}}
              source={{uri: this.state.pic_small}}
            />
          
            {/*播放器*/}
            <Video
              source={{uri: this.state.file_link}}
              ref='video'
              volume={1.0}
              paused={this.state.pause}
              onProgress={(e) => this.onProgress(e)}
              onLoad={(e) => this.onLoad(e)}
              playInBackground={true}
            />
            {/*歌曲信息*/}
            <View style={styles.playingInfo}>
              {/*作者-歌名*/}
              <Text>{this.state.author} - {this.state.title}</Text>
              {/*时间*/}
              <Text>{this.formatTime(Math.floor(this.state.currentTime))} - {this.formatTime(Math.floor(this.state.duration))}</Text>
            </View>
            {/*播放模式*/}
            <View style = {{marginTop: 5,marginBottom:5,marginLeft: 20}}>
              <TouchableOpacity onPress={()=>this.playModel(this.state.playModel)}>
                <Image source={this.state.btnModel} style={{width:20,height:20}}/>
              </TouchableOpacity>
            </View>
            {/*进度条*/}
            <Slider
              ref='slider'
              style={{ marginLeft: 10, marginRight: 10}}
              value={this.state.sliderValue}
              maximumValue={this.state.file_duration}
              step={1}
              minimumTrackTintColor='#FFDB42'
              onValueChange={(value) => {
                this.setState({
                  currentTime:value
                })
              }
              }
              onSlidingComplete={(value) => {
                this.refs.video.seek(value)
              }}
            />
            {/*歌曲按钮*/}
            <View style = {{flexDirection:'row',justifyContent:'space-around'}}>
              <TouchableOpacity onPress={()=>this.prevAction(this.state.currentIndex - 1)}>
                <Image source={require('../img/上一首.png')} style={{width:30,height:30}}/>
              </TouchableOpacity>
            
              <TouchableOpacity onPress={()=>this.playAction()}>
                <Image source={this.state.isplayBtn} style={{width:30,height:30}}/>
              </TouchableOpacity>
            
              <TouchableOpacity onPress={()=>this.nextAction(this.state.currentIndex + 1)}>
                <Image source={require('../img/下一首.png')} style={{width:30,height:30}}/>
              </TouchableOpacity>
            </View>
          
            {/*歌词*/}
            <View style={{height:140,alignItems:'center'}}>
            
              <ScrollView style={{position:'relative'}}
                          ref={(scrollView) => { _scrollView = scrollView}}
              >
                {this.renderItem()}
              </ScrollView>
            </View>
          </View>
      
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1
  },
  playingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  playingInfo: {
    flexDirection: 'row',
    alignItems:'stretch',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'rgba(255,255,255,0.0)'
  },
  text: {
    color: "black",
    fontSize: 22
  },
  modal: {
    height: 300,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    paddingTop: 5,
    paddingBottom: 50
  },
  itemStyle: {
    paddingTop: 20,
    height:25,
    backgroundColor:'rgba(255,255,255,0.0)',
  }
})