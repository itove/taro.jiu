import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'
import { Env } from '../../env/env'
import { AtList, AtListItem, AtCard } from "taro-ui"

export default class Stock extends Component<PropsWithChildren> {
  role: int
  orgid: int
  state = {}

  navToDetail(id){
    Taro.navigateTo({url: '/pages/productDetail/index?id=' + id})
  }

  componentDidMount () {
    const self = this;
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        self.setState({data: res.data})
        this.orgid = res.data.org.id
        this.role = res.data.role
        Taro.request({
          url: Env.apiUrl + 'stocks?org=' + this.orgid,
        }).then((res) =>{
          console.log(res.data);
          let list = []
          for (let i in res.data) {
            list.push(
              <AtListItem
              onClick={() => this.navToDetail(res.data[i].id)}
              title={res.data[i].name}
              note={'规格: ' + res.data[i].spec + ' 库存: ' + res.data[i].stock}
              // extraText={'库存: ' + res.data[i].stock}
              arrow='right'
              thumb={Env.imgUrl + 'product/' + res.data[i].img}
          />
            )
          }
          this.setState({list: list})
        })
      }
    })
  }

  render () {
    return (
      <View className='product'>
      { this.role == 0 &&
      <Button className='new-btn' type='secondary' size='small' onClick={() => Taro.redirectTo({url: '/pages/productNew/index'})}>添加产品</Button>
      }
      <AtList>
      { this.state.list }
      </AtList>
      </View>
    )
  }
}