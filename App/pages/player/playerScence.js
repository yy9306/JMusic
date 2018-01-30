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
  Slider,
  ActivityIndicator,
  Easing
} from 'react-native'

// import Video from '../../common/Video'
import Video from 'react-native-video'
import BlurImage from 'react-native-blur-image'
import {width,height, jumpPager} from '../../base/Utils'

var myAnimate;
export default class PlayerScence extends Component{
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
      btnModel:require('../img/列表循环.png'), //播放模式按钮背景图
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
      isplayBtn: require('../img/播放.png'),  //播放/暂停按钮背景图
      imgRotate: new Animated.Value(0),
    }
    this.isGoing = false; //为真旋转
    this.myAnimate = Animated.timing(this.state.imgRotate, {
      toValue: 1,
      duration: 6000,
      easing: Easing.inOut(Easing.linear),
    });
    console.log(this.navigate)
    this.bgColor = '#222'
  }
  
  componentDidMount() {
    this.stop()
    this.loadSongInfo(this.navigate.currentIndex)
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
    
  };
  
  loadSongInfo(index) {
    this.setState({
      pic_small:this.navigate.songs[index].image, //小图
      pic_big:this.navigate.songs[index].image,  //大图
      title:this.navigate.songs[index].name,     //歌曲名
      author:this.navigate.songs[index].singer,   //歌手
      file_link:this.navigate.songs[index].url,   //播放链接
      file_duration:this.navigate.songs[index].duration //歌曲长度
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
        this.refs.video.seek(0) //让video 重新播放
        _scrollView.scrollTo({x: 0,y:0,animated:false});
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
    // lyrObj = [];
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
        isplayBtn:require('../img/播放.png')
      })
    }else {
      this.setState({
        isplayBtn:require('../img/暂停.png')
      })
    }
    
  }
  
  //下一曲
  nextAction = (index) =>{
    this.recover()
    lyrObj = [];
    if(index === 10){
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
          <BlurImage
            source={{ uri:this.state.pic_big }}
            style={{flex:1}}
            blurRadius={50}
          />
          {/*作者-歌名*/}
          <View style={styles.title_wrapper}>
            <Text numberOfLines={1} style={{color: '#fff', fontSize: 18, marginBottom: 10}}>{this.state.author}</Text>
            <Text numberOfLines={1} style={{color: '#fff', fontSize: 14}}>{this.state.title}</Text>
          </View>
          
          <View style = {{position:'absolute', top: 90, bottom: 170, width: width}}>
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
            <View style={styles.bottom}>
              {/*播放模式*/}
              {/*<View style = {{marginTop: 5,marginBottom:5,marginLeft: 20}}>*/}
                {/*<TouchableOpacity onPress={()=>this.playModel(this.state.playModel)}>*/}
                  {/*<Image source={this.state.btnModel} style={{width:20,height:20}}/>*/}
                {/*</TouchableOpacity>*/}
              {/*</View>*/}
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
                    this.refs.video.seek(value)
                  }}
                />
                <Text style={{color: '#fff'}}>{this.formatTime(Math.floor(this.state.duration))}</Text>
              </View>
              {/*歌曲按钮*/}
              <View style = {{flexDirection:'row',width: width, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={()=>this.playModel(this.state.playModel)} style={{width: 0.25*width, alignItems: 'center'}}>
                  <Image source={this.state.btnModel} style={{width:20,height:20}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.prevAction(this.state.currentIndex - 1)} style={{width: 0.25*width, alignItems: 'center'}}>
                  <Image source={require('../img/上一首.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={()=>this.playAction()} style={{width: 0.25*width, alignItems: 'center'}}>
                  <Image source={this.state.isplayBtn} style={{width:30,height:30}}/>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={()=>this.nextAction(this.state.currentIndex + 1)} style={{width: 0.25*width, alignItems: 'center'}}>
                  <Image source={require('../img/下一首.png')} style={{width:30,height:30}}/>
                </TouchableOpacity>
              </View>
            </View>
          
            {/*歌词*/}
            {/*<View style={{height:140,alignItems:'center'}}>*/}
            
              {/*<ScrollView style={{position:'relative'}}*/}
                          {/*ref={(scrollView) => { _scrollView = scrollView}}*/}
              {/*>*/}
                {/*{this.renderItem()}*/}
              {/*</ScrollView>*/}
            {/*</View>*/}
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
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  playingInfo: {
    flexDirection: 'row',
    // alignItems:'stretch',
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
  },
  bottom: {
    position: 'absolute',
    top: height-300,
    bottom: 0,
    width: width,
  }
})