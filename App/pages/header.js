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

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import NavBarView from '../base/NavBarView'
import {jumpPager,width} from '../base/Utils'
import Recommend from './recommend'
import Singer from './singer'
import SingerL from './singerL'
import Rank from './rank'
import Search from './search'

export default class Header extends Component{
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props)
    this.state = {
      activeIndex: 0
    }
    this.bgColor = '#222'
    this.tabJson = require('../sources/json/nav.json')
  }
  
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated = {true}
          backgroundColor = {this.bgColor}
          barStyle = 'light-content'
        />
        <NavBarView backgroundColor={this.bgColor}/>
        <View style={styles.Mheader}>
          <Image style={styles.icon} source={require('../sources/images/logo.png')}/>
          <Text style={styles.headerText}>JMusic</Text>
        </View>
        <ScrollableTabView initialPage={0}
                           tabBarBackgroundColor="#222"
                           tabBarActiveTextColor="#ffcd32"
                           tabStyle={{borderWidth: 0,borderColor: 'red'}}
                           tabBarInactiveTextColor="hsla(0,0%,100%,.5)"
                           tabBarUnderlineStyle={{backgroundColor: '#ffcd32'}}
                           renderTabBar={() => <DefaultTabBar />}>
          <Recommend navigate={this.props.navigation.navigate} tabLabel='推荐'/>
          <SingerL navigate={this.props.navigation.navigate} tabLabel='歌手'/>
          <Rank navigate={this.props.navigation.navigate} tabLabel='排行'/>
          <Search navigate={this.props.navigation.navigate} tabLabel='搜索'/>
        </ScrollableTabView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222222'
  },
  Mheader: {
    height: 44,
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 30,
    height: 32,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#ffcd32',
  },
  tabNav: {
    width: width,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nav: {
    width: width/4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nav_tab: {
    paddingBottom:5,
    borderBottomColor: '#ffcd32',
  },
  navText: {
    fontSize: 14,
    color: '#ffcd32',
  }
})