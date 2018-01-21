import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation'

import Recommend from './pages/recommend'
// import Singer from './pages/singer'
import Header from './pages/header'
import SingerDetail from './pages/singerDetail'
import Rank from './pages/rank'
import Search from './pages/search'
import SingerL from './pages/singerL'
/*
* 实现跳转的栈
* */
const App = StackNavigator({

  Header: {screen: Header},
  Recommend: {screen: Recommend},
  SingerL: {screen: SingerL},
  // Singer: {screen: Singer},
  SingerDetail: {screen: SingerDetail},
  Rank: {screen: Rank},
  Search: {screen: Search}
},{
  navigationOptions: {
    gesturesEnabled: true,
  },
  headerMode: 'none'
})

export default App
