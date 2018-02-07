import React, {Component} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
const TITLE_HEIGHT = 60
const LIST_HEIGHT = 80
import HttpMusic from '../api/api'
import { LargeList } from "react-native-largelist";
import singer from '../common/singer.js'
import {width, height, jumpPager} from '../base/Utils'


export default class SingerL extends Component {
  selectedIndex: number = 0;
  listRef: LargeList;
  indexes: LargeList;

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
  }

  getSinger() {
    this.HttpMusic.getSinger()
      .then((request) => {
        if(request.code === 0) {
          this.setState({singerData: request.data.list}, () => {
            this._normalizeSinger(this.state.singerData)
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
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
        map.hot.items.push(new singer({id: item.Fsinger_mid, name: item.Fsinger_name}))
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new singer({id: item.Fsinger_mid, name: item.Fsinger_name}))
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
    for(let i = 0; i < retList.length; i++) {
      retList[i].height = retList[i].items.length * LIST_HEIGHT + TITLE_HEIGHT
    }
    retList[0].selected = true;
    this.setState({Singerlist: retList})
  }
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.Singerlist && this.state.Singerlist.length > 0 && <LargeList
          ref={ref => (this.listRef = ref)}
          style={{ flex: 1, backgroundColor: '#222' }}
          numberOfSections={()=>this.state.Singerlist.length}
          numberOfRowsInSection={section => this.state.Singerlist[section].items.length}
          heightForSection={() => 36}
          renderSection={this.renderSection.bind(this)}
          heightForCell={() => 80}
          renderCell={this.renderItem.bind(this)}
          onSectionDidHangOnTop={this.onSectionChange.bind(this)}
          renderItemSeparator={() => null}
        />}

        {this.state.Singerlist && this.state.Singerlist.length > 0 && <LargeList
          style={{position: 'absolute',backgroundColor: 'transparent', right: 0, width: 44,}}
          ref={ref => (this.indexes = ref)}
          numberOfRowsInSection={() => this.state.Singerlist.length}
          heightForCell={() => 18}
          renderCell={this.renderIndexes.bind(this)}
          showsVerticalScrollIndicator={false}
          bounces={false}
          renderItemSeparator={() => null}
        />}
      </View>
    );
  }

  renderIndexes(section: number, row: number) {
    let selected = this.state.Singerlist[row].selected;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 30,
          justifyContent: "center",
          alignItems: "center"
        }}
        onPress={() => {
          this.listRef.scrollToIndexPath({ section: row, row: 0 });
        }}
      >
        <Text style={{ fontSize: 12, color: selected ? "#ffcd32" : "hsla(0,0%,100%,.5)" }}>
          {this.state.Singerlist[row].title.substr(0, 1)}
        </Text>
      </TouchableOpacity>
    )
  }

  renderSection(section: number) {
    return (
      <View
        style={{ flex: 1,backgroundColor: "#333", justifyContent: "center" }}
      >
        <Text style={{ marginLeft: 20, fontSize: 14, color: 'hsla(0,0%,100%,.5)' }}>
          {this.state.Singerlist[section].title}
        </Text>
      </View>
    );
  }

  renderItem(section: number, row: number) {
    let singer = this.state.Singerlist[section].items[row];
    return (
      <TouchableOpacity style={{flex: 1}}
                        onPress={() => {
                          jumpPager(this.props.navigate, 'SingerDetail', {
                            title: singer.name,
                            avatar: singer.avatar,
                            id: singer.id
                          })
                        }}
      >
        <View style={{flex: 1, paddingLeft: 20, flexDirection: 'row', alignItems: 'center'}}>
          <Image style={{width: 50, height: 50, borderRadius: 25, marginRight: 20}} source={{uri: singer.avatar}}/>
          <Text style={{color: 'hsla(0,0%,100%,.5)'}}>
            {singer.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  onSectionChange(section:number){
    this.state.Singerlist[this.selectedIndex].selected = false;
    this.state.Singerlist[section].selected = true;
    // 使用局部更新
    this.indexes.reloadIndexPaths([
      { section: 0, row: this.selectedIndex },
      { section: 0, row: section }
    ]);
    this.selectedIndex = section;
    // 使用更新所有数据源
    // this.indexes.reloadData();

    let bFind = false;
    this.indexes.visibleIndexPaths().forEach(indexPath=>{
      if (indexPath.row===section) {
        bFind = true;
      }
    });
    if (!bFind) {
      this.indexes.scrollToIndexPath({section:0,row:section});
    }
  }
}
