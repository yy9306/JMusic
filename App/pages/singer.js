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
  ScrollView
} from 'react-native'

import HttpMusic from '../api/api'
import Header from './header'
import NavBarView from '../base/NavBarView'
import {width, height, jumpPager} from '../base/Utils'


const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
const TITLE_HEIGHT = 60
const LIST_HEIGHT = 80
export default class Singer extends Component{
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props)
    this.state = {
      Singerlist: [],
      singerData: [],
      activeIndex: 0
    }
    this.HttpMusic = new HttpMusic()
    this.listHeight = []
    this.getSinger()
    // this.singerList = require('../sources/json/singerList.json')
  }

  componentWillMount() {
    // setTimeout(() => {
    //   this.singerItem.measure((x,y,widht,height,left,top) => {
    //     console.log(x, y, width, height, left, top)
    //   })
    // })
   setTimeout(() => {
     this._normalizeSinger(this.state.singerData)
   }, 100)
    // this._normalizeSinger(this.state.singerData)
  }
  
  getSinger() {
    this.HttpMusic.getSingerDetail()
      .then((request) => {
        if(request.code === 0) {
          this.setState({singerData: request.data.list}, )
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  componentDidMount() {
    setTimeout(() => {
      this._calculateHeight.bind(this)()
    }, 100)
  }
  // 计算高度
  _calculateHeight() {
    const list = this.state.Singerlist;
    let height = 0;
    this.listHeight.push(height)
    for (let i = 0; i < list.length; i++) {
      let item = list[i].height
      height += item;
      this.listHeight.push(height)
    }
  }
  
  // 处理数据
  _normalizeSinger(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < HOT_SINGER_LEN) {
        map.hot.items.push({
          name: item.Fsinger_name,
          id: item.Fsinger_mid,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
        })
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.Fsinger_name,
        id: item.Fsinger_mid,
        avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
      })
    })
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    let hot = []
    let maxArr = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    
    let  retList = hot.concat(ret)
    // console.log(hot.concat(ret))
    for(let i = 0; i < retList.length; i++) {
      retList[i].height = retList[i].items.length * LIST_HEIGHT + TITLE_HEIGHT
    }
    console.dir(retList)
    this.setState({Singerlist: retList})
  }
  
  watchScroll(e) {
    const listHeight = this.listHeight
    let {contentOffset} = e.nativeEvent
    let newY = contentOffset.y
    if (newY < 0) {
      this.setState({activeIndex: 0})
      return
    }

    for (let i = 0; i < listHeight.length; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        this.setState({activeIndex: i})
        return
      }
    }
  }
  
  goToScreen(index) {
    let offsetY = this.listHeight[index]
    this.refs.scrollView.scrollToOffset({animated: false, offset: offsetY})
  }
  
  // _onLayout(event) {
  //   let {x, y, width, height} = event.nativeEvent.layout
  //   console.log(y, height)
  // }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.singer}>
          <FlatList ref="scrollView"
                    data={this.state.Singerlist}
                    keyExtractor={(item,index)=>index}
                    renderItem={({item}) => {
                      return (
                          <View style={styles.singer_items} ref={(singerItem) => {this.singerItem = singerItem}} >
                            <View style={styles.singer_titile} onLayout={this._onLayout}>
                              <Text style={styles.text}>{item.title}</Text>
                            </View>
                            <View style={styles.list_group}>
                              {item.items.map((item, index) => {
                                return (
                                  <TouchableOpacity key={index} onPress={() => {
                                    let list = item
                                    jumpPager(this.props.navigate, 'SingerDetail', {
                                      title: list.name,
                                      avatar: list.avatar
                                    })
                                  }}>
                                    <View style={styles.singer_group}>
                                      <Image style={styles.singer_avatar} source={{uri: item.avatar}}/>
                                      <Text style={styles.singer_name}>{item.name}</Text>
                                    </View>
                                  </TouchableOpacity>
                                )
                              })}
                            </View>
                          </View>
                      )
                    }}
                    onScroll={this.watchScroll.bind(this)}
                    showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.cube_list_view}>
          {this.state.Singerlist.map((item, index) => {
            let text = item.title.substr(0, 1)
            return (
              <TouchableOpacity key={index} onPress={this.goToScreen.bind(this, index)}>
                <View style={styles.cube_nav}>
                  <Text style={[styles.cube_nav_text, {color: index === this.state.activeIndex ?'#ffcd32': 'hsla(0,0%,100%,.5)'}]}>{text}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222'
  },
  singer: {
    width: width,
    flex: 1,
  },
  singer_items: {
    flex: 1,
    width: width,
    paddingBottom: 30,
  },
  singer_titile: {
    height: 30,
    width: width,
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingLeft: 20,
  },
  text: {
    fontSize: 14,
    color: 'hsla(0,0%,100%,.5)'
  },
  list_group: {
    flex: 1,
    width: width,
  },
  singer_group: {
    width: width,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 30,
  },
  singer_avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  singer_name: {
    fontSize: 14,
    color: 'hsla(0,0%,100%,.5)',
    marginLeft: 20,
  },
  cube_list_view: {
    position: 'absolute',
    zIndex: 10,
    right: 0,
    height: height-150,
    justifyContent: 'center',
    width: 44,
  },
  cube_nav: {
    width: 44,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  cube_nav_text: {
    fontSize: 14,
    color: 'hsla(0,0%,100%,.5)',
  }
})