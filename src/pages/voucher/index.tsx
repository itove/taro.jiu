import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { AtList, AtListItem } from "taro-ui"
import { AtNavBar } from 'taro-ui'
import Taro from '@tarojs/taro'
import { Env } from '../../env/env'
import { Taxon } from '../../Taxon'
import { fmtDate } from '../../fmtDate'

export default class Voucher extends Component<PropsWithChildren> {
  query: string = '?page=1'
  uid: int
  otype: int
  state = {
    voucher: 0
  }

  componentDidMount () {
    Taro.getStorage({
      key: Env.storageKey,
      success: res => {
        this.uid = res.data.id
        this.otype = res.data.org.type
        const self = this;
        this.query = '?page=1&customer=' + this.uid
        Taro.request({
          url: Env.apiUrl + 'users/' + this.uid
        }).then((res) =>{
          this.setState({voucher: res.data.voucher})
        })
        Taro.request({
          url: Env.apiUrl + 'vouchers' + this.query
        }).then((res) =>{
          let records = res.data
          let list = []
          for (let i in records) {
            list.push(
              <AtListItem
              title={Taxon.voucherType[records[i].type]}
              note={fmtDate(records[i].date)}
              extraText={records[i].voucher / 100}
              // arrow='right'
              />
            )
          }
          this.setState({list: list})
        })
      },
      fail: res => {
        console.log('pls login');
        Taro.redirectTo({ url: '/pages/chooseLogin/index' })
      },
    });
  }

  render () {
    return (
      <View className='voucher'>

      <View className='at-row card'>
      <View className='at-col'>
      <View className='label'>代金券</View>
      <View className='number'>{this.state.voucher / 100}</View>
      </View>
      </View>

      <AtList className="list">
      {this.state.list}
      </AtList>
      </View>
    )
  }
}
