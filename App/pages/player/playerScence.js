import React, { Component } from 'react'
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
  Slider,
  ActivityIndicator,
  Easing
} from 'react-native'
import Video from 'react-native-video'
import HttpMusic from '../../api/api'
import BlurImage from 'react-native-blur-image'
import {width,height, jumpPager} from '../../base/Utils'


var Buffer = require('buffer').Buffer;

var lyrObj = []; //用于存放歌词

var myAnimate;
export default class Play extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.navigate = this.props.navigation.state.params.data
    this.spinValue = new Animated.Value(0)
    this.state = {
      songs: [],   //歌曲id数据源
      playModel:1,  // 播放模式  1:列表循环    2:随机    3:单曲循环
      btnModel:require('../img/icon_mode.png'), //播放模式按钮背景图
      pic_small: '',    //小图
      pic_big: '',      //大图
      file_duration: '',    //歌曲长度
      song_id:'',     //歌曲id
      title:'',       //歌曲名字
      author:'',      //歌曲作者
      file_link: '',   //歌曲播放链接
      songLyr:[],     //当前歌词
      sliderValue: 0,    //Slide的value
      pause:false,       //歌曲播放/暂停
      currentTime: 0.0,   //当前时间
      duration: 0.0,     //歌曲时间
      currentIndex:0,    //当前第几首
      isplayBtn: require('../img/icon_pause.png'),  //播放/暂停按钮背景图
      imgRotate: new Animated.Value(0),
      currentShow: 'cd'
    }
    this.isGoing = false; //为真旋转
    this.myAnimate = Animated.timing(this.state.imgRotate, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.linear),
    });

    this.HttpMusic = new HttpMusic()
    this.bgColor = '#222'
  }

  componentDidMount() {
    this.stop()
    this.loadSongInfo(this.navigate.currentIndex)
  }
  componentWillUpdate(nextProps, nextState) {
    var itemAry = [];
    for (var i = 0; i < lyrObj.length; i++) {
      var item = lyrObj[i].txt
      if (nextState.currentTime && nextState.currentTime.toFixed(2) > lyrObj[i].total) {
        if (i < 5) {
          this._scrollView && this._scrollView.scrollTo({x: 0, y: 0, animated: false});
        } else {
          this._scrollView && this._scrollView.scrollTo({x: 0, y: (32 * (i - 4)), animated: false});
        }
      }
    }
  }
  imgMoving = () => {
    if (this.isGoing) {
      this.state.imgRotate.setValue(0);
      this.myAnimate.start(() => {
        this.imgMoving()
      })
    }
  }

  stop = () => {
    this.isGoing = !this.isGoing;

    if (this.isGoing) {
      this.myAnimate.start(() => {
        this.myAnimate = Animated.timing(this.state.imgRotate, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.linear),
        });
        this.imgMoving()
      })
    } else {
      this.state.imgRotate.stopAnimation((oneTimeRotate) => {
        //计算角度比例
        this.myAnimate = Animated.timing(this.state.imgRotate, {
          toValue: 1,
          duration: (1-oneTimeRotate) * 6000,
          easing: Easing.inOut(Easing.linear),
        });
      });

    }

  }

  loadSongInfo(index) {
    let reg = /(?=\:)/g
    let song = this.navigate.songs[index]
    this._getLyric(song.mid)

    this.setState({
      pic_small:song.image, //小图
      pic_big:song.image,  //大图
      title:song.name,     //歌曲名
      author:song.singer,   //歌手
      file_link:song.url.replace(reg, 's'),   //播放链接
      file_duration:song.duration //歌曲长度
    })
  }

  _getLyric(mid) {
    this.HttpMusic.getLyric(mid)
      .then((res) => {
        if(res.code === 0) {
          let lry = new Buffer(res.lyric, 'base64')
          let lryAry = lry.toString().split('\n')
          lryAry.forEach(function (val, index) {
            var obj = {}   //用于存放时间
            val = val.replace(/(^\s*)|(\s*$)/g, '')
            let indeofLastTime = val.indexOf(']')  // ]的下标
            let timeStr = val.substring(1, indeofLastTime) //把时间切出来 0:04.19
            let minSec = ''
            let timeMsIndex = timeStr.indexOf('.')  // .的下标
            if (timeMsIndex !== -1) {
              //存在毫秒 0:04.19
              minSec = timeStr.substring(1, val.indexOf('.'))  // 0:04.
              obj.ms = parseInt(timeStr.substring(timeMsIndex + 1, indeofLastTime))  //毫秒值 19
            } else {
              //不存在毫秒 0:04
              minSec = timeStr
              obj.ms = 0
            }

            let curTime = minSec.split(':')  // [0,04]
            obj.min = parseInt(curTime[0])   //分钟 0
            obj.sec = parseInt(curTime[1])   //秒钟 04
            obj.txt = val.substring(indeofLastTime + 1, val.length) //歌词文本: 留下唇印的嘴
            obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
            obj.dis = false
            obj.total = obj.min * 60 + obj.sec + obj.ms / 100   //总时间

            if (obj.txt.length > 0) {
              lyrObj.push(obj)
            }
          })
        }
      })
  }

  //播放器每隔250ms调用一次
  onProgress =(data) => {
    let val = parseInt(data.currentTime)
    this.setState({
      sliderValue: val,
      currentTime: data.currentTime
    })

    //如果当前歌曲播放完毕,需要开始下一首
    if(val === this.state.file_duration){
      if(this.state.playModel === 1){
        //列表 就播放下一首
        this.nextAction(this.state.currentIndex + 1)
      }else if(this.state.playModel === 2){
        let  last =  this.navigate.songs.length //json 中共有几首歌
        let random = Math.floor(Math.random() * last)  //取 0~last之间的随机整数
        this.nextAction(random) //播放
      }else{
        //单曲 就再次播放当前这首歌曲
        this.video.seek(0) //让video 重新播放
        this._scrollView.scrollTo({x: 0,y:0,animated:false});
      }
    }
  }

  //把秒数转换为时间类型
  formatTime(time) {
    // 71s -> 01:11
    let min = Math.floor(time / 60)
    let second = time - min * 60
    min = min >= 10 ? min : '0' + min
    second = second >= 10 ? second : '0' + second
    return min + ':' + second
  }

  //上一曲
  prevAction = (index) =>{
    this.recover()
    lyrObj = [];
    if(index === -1){
      index = this.navigate.songs.length - 1 // 如果是第一首就回到最后一首歌
    }
    this.setState({
      currentIndex:index  //更新数据
    })
    this.loadSongInfo(index)  //加载数据
  }

  //播放/暂停
  playAction =() => {
    this.stop()
    this.setState({
      pause: !this.state.pause
    })
    //判断按钮显示什么
    if(this.state.pause === true){
      this.setState({
        isplayBtn:require('../img/icon_pause.png')
      })
    }else {
      this.setState({
        isplayBtn:require('../img/icon_play.png')
      })
    }
  }

  //下一曲
  nextAction = (index) =>{
    this.recover()
    lyrObj = [];
    if(index === this.state.songs.length){
      index = 0 //如果是最后一首就回到第一首
    }
    this.setState({
      currentIndex:index,  //更新数据
    })
    this.loadSongInfo(index)   //加载数据
  }

  //换歌时恢复进度条 和起始时间
  recover = () =>{
    this.setState({
      sliderValue:0,
      currentTime: 0.0
    })
  }

  //旋转动画
  spin () {
    this.spinValue.setValue(0)
    myAnimate = Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear
      }
    ).start(() => this.spin())

  }

  // 播放器加载好时调用,其中有一些信息带过来
  onLoad = (data) => {
    this.setState({ duration: data.duration });
  }


  // 歌词
  renderItem() {
    // 数组
    var itemAry = [];
    for (var i = 0; i < lyrObj.length; i++) {
      var item = lyrObj[i].txt
      if (this.state.currentTime.toFixed(2) > lyrObj[i].total) {
        //正在唱的歌词
        if(lyrObj[i+1] && lyrObj[i+1].total && lyrObj[i+1].total < this.state.currentTime.toFixed(2)) {
          itemAry.push(
            <View key={i} style={styles.itemStyle}>
              <Text style={{ color: 'hsla(0,0%,100%,.5)', fontSize: 14 }}> {item} </Text>
            </View>
          );
        } else {
          itemAry.push(
            <View key={i} style={styles.itemStyle}>
              <Text style={{ color: 'white', fontSize: 14 }}> {item} </Text>
            </View>
          );
        }
      } else {
        //所有歌词
        itemAry.push(
          <View key={i} style={styles.itemStyle}>
            <Text style={{ color: 'hsla(0,0%,100%,.5)', fontSize: 14 }}> {item} </Text>
          </View>
        )
      }
    }

    return itemAry;
  }

  // 歌词唱片滚动
  _onScroll(event) {
    let {contentOffset} = event.nativeEvent
    // console.log(contentOffset)
    if(contentOffset.x >= width) {
      this.setState({
        currentShow: 'lyric'
      })
    } else {
      this.setState({
        currentShow: 'cd'
      })
    }
  }

  render() {
      if (this.state.file_link.length <= 0 ) {
        return(
          <ActivityIndicator
            animating={this.state.animating}
            style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}
            size="large" />
        )
      }else {
        const spin = this.spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })

        return (
          <View style={styles.container}>
            {/*背景大图*/}
            <BlurImage
              source={{uri: this.state.pic_big}}
              style={{flex: 1}}
              blurRadius={50}
            />

            {/*作者-歌名*/}
            <View style={styles.title_wrapper}>
              <Text numberOfLines={1} style={{color: '#fff', fontSize: 18, marginBottom: 10}}>{this.state.author}</Text>
              <Text numberOfLines={1} style={{color: '#fff', fontSize: 14}}>{this.state.title}</Text>
            </View>
            <ScrollView style = {styles.scrollView}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        scrollEventThrottle={20}
                        onScroll={(e) => {
                          this._onScroll(e)
                        }}>
              <View style={{width: width, flex: 1}}>
                {/*胶片光盘*/}
                <Image source={require('../img/胶片盘.png')} style={{width:260,height:260,alignSelf:'center'}}/>

                {/*旋转小图*/}
                <Animated.Image
                  ref = 'myAnimate'
                  style={{width:210,height:210,marginTop: -235,alignSelf:'center',borderRadius: 200*0.5,transform: [{rotate: this.state.imgRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }]}}
                  source={{uri: this.state.pic_small}}
                />
              </View>
              <View style={{width: width, flex: 1, alignItems:'center', paddingBottom: 46}}>
                <ScrollView style={{position:'relative'}}
                            showsVerticalScrollIndicator={false}
                            ref={(scrollView) => { this._scrollView = scrollView}}
                >
                  {this.renderItem()}
                </ScrollView>
              </View>
            </ScrollView>

            {/*播放器*/}
            {this.state.file_link && this.state.file_link.length>0 && <Video
              source={{uri: this.state.file_link}}
              ref={(ref) => {this.video = ref}}
              rate={1.0}
              volume={1.0}
              muted={false}
              paused={this.state.pause}
              onProgress={(e) => this.onProgress(e)}
              onLoad={(e) => this.onLoad(e)}
            /> }
            <View style={styles.bottom}>
              <View style={styles.dots}>
                <View style={[styles.dot, {width: this.state.currentShow === 'cd' ? 20 : 8}]} />
                <View style={[styles.dot, {width: this.state.currentShow === 'lyric' ? 20 : 8}]} />
              </View>
              {/*进度条*/}
              <View style={styles.progress}>
                <Text style={{color: '#fff'}}>{this.formatTime(Math.floor(this.state.currentTime))}</Text>
                <Slider
                  ref='slider'
                  style={{marginLeft: 5, marginRight: 5, flex: 1,}}
                  value={this.state.sliderValue}
                  maximumValue={this.state.file_duration}
                  step={1}
                  minimumTrackTintColor='#FFDB42'
                  onValueChange={(value) => {
                    this.setState({
                      currentTime: value
                    })
                  }
                  }
                  onSlidingComplete={(value) => {
                    this.video.seek(value)
                  }}
                />
                <Text style={{color: '#fff'}}>{this.formatTime(Math.floor(this.state.duration))}</Text>
              </View>
              {/*歌曲按钮*/}
              <View style = {{flexDirection:'row',width: width, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={()=>this.playModel(this.state.playModel)} style={{width: 0.2*width, alignItems: 'center'}}>
                  <Image source={this.state.btnModel} style={{width:30,height:30}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.prevAction(this.state.currentIndex - 1)} style={{width: 0.2*width, alignItems: 'center'}}>
                  <Image source={require('../img/icon_prev.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.playAction()} style={{width: 0.2*width, alignItems: 'center'}}>
                  <Image source={this.state.isplayBtn} style={{width:40,height:40}}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this.nextAction(this.state.currentIndex + 1)} style={{width: 0.2*width, alignItems: 'center'}}>
                  <Image source={require('../img/icon_next.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>

                <TouchableOpacity style={{width: 0.2*width, alignItems: 'center'}}>
                  <Image source={require('../img/icon_love.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>
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
  title_wrapper: {
    position: 'absolute',
    top: 30,
    width: width,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 25,
  },
  playingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  progress: {
    width: 0.9*width,
    marginLeft: 0.05*width,
    paddingTop: 15,
    paddingBottom: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  playingInfo: {
    flexDirection: 'row',
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
    height:32,
    justifyContent: 'center',
    backgroundColor:'rgba(255,255,255,0.0)',
    alignItems: 'center'
  },
  scrollView: {
    position:'absolute',
    top: 90,
    bottom: 170,
  },
  bottom: {
    position: 'absolute',
    bottom: 50,
    width: width,
  },
  dots: {
    width: width,
    height: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    width: 8,
    height: 8,
    marginLeft: 4,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: 'hsla(0,0%,100%,.8)',
  },
  active: {
    width: 20,
  }
})
