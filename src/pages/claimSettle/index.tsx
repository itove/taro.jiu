import { Component, PropsWithChildren } from 'react'
import './index.scss'
import Taro from '@tarojs/taro'
import { Env } from '../../env/env'
import { Taxon } from '../../Taxon'
import { View, Text, Form, Input, Button, Icon } from '@tarojs/components'

export default class Claimsettle extends Component<PropsWithChildren> {
  oid: int
  uid: int
  otype: int
  type: string
  id: int
  user = {}
  instance = Taro.getCurrentInstance();
  state = {
    disabled: false,
    disabled2: false,
  }

  componentDidMount () {
    let params = this.instance.router.params
    this.id = params.id
    this.type = params.type


    Taro.getStorage({
      key: Env.storageKey
    }).then(res => {
      this.oid = res.data.org.id
      this.uid = res.data.id
      this.otype = res.data.org.type
      this.user = res.data
      Taro.request({
        url: Env.apiUrl + 'claims/' + this.id
      }).then((res) => {
        let claim = res.data
        this.setState({
          claim
        })
        let msg: string
        let action: string = 'cannot'
        if (this.otype !== 2 && ! this.user.roles.includes('ROLE_SALESMAN')) {
          msg = '您不能兑付奖品'
        } 

        switch (this.type) {
          case 'user':
            if (this.otype !== 2 && this.otype !== 3 && this.otype !== 12) {
              msg = '您不能兑付奖品'
            } else if (claim.bottle.box.pack.forRestaurant && this.otype !== 3) {
              msg = '只能在餐厅兑付该奖品'
            } else if (!claim.bottle.box.pack.forRestaurant && this.otype === 3) {
              msg = '只能在门店兑付该奖品'
            } else {
              switch (claim.status) {
                case 0:
                  msg = 'pending'
                  action = 'claim'
                  break
                case 1:
                  msg = '请勿重复兑奖'
                  break
                case 2:
                  msg = '该兑奖已过期'
                  break
              }
            }
            break
          case 'store':
            if (! this.user.roles.includes('ROLE_SALESMAN')) {
              msg = '您不能兑付奖品'
            } else {
              if (claim.storeSettled) {
                msg = '请勿重复兑付'
              } else {
                msg = '已兑付'
                action = 'settle'
              }
            }
            break
          case 'serveStore':
            if (! this.user.roles.includes('ROLE_SALESMAN')) {
              msg = '您不能兑付奖品'
            } else {
              if (claim.serveStoreSettled) {
                msg = '请勿重复兑付'
              } else {
                msg = '已兑付'
                action = 'settle'
              }
            }
            break
        }

        this.setState({
          msg,
          action
        })
      })
    })
  }

  done(){
    Taro.switchTab({ url: '/pages/me/index' })
  }

  setClaimed = () => {
    this.setState({disabled: true})
    let data = {}
    data.oid = this.oid
    data.id = this.id
    Taro.request({
      method: 'POST',
      data: data,
      url: Env.apiUrl + 'claim/done',
    })
    .then((res) => {
      if (res.data.code === 0)
        this.setState({
          msg: '恭喜你获得提现金额 ' + res.data.tip / 100 + ' 元',
          action: 'cannot'
        })
    })
  }

  settle = () => {
    this.setState({disabled2: true})
    let data = {}
    data.id = this.id
    data.type = this.type
    data.uid = this.uid
    Taro.request({
      method: 'POST',
      data: data,
      url: Env.apiUrl + 'claim/settle',
    })
    .then((res) => {
      let msg = ''
      let action = 'cannot'
      if (res.data.code === 0) {
        this.setState({
          msg: '恭喜你获得奖励 ' + res.data.tip / 100 + ' 元',
          action
        })
      }
    })
  }

  render () {
    return (
      <View className='claimSettle'>
        { this.state.action === 'cannot' &&
          <>
          <View className='msg'>{this.state.msg}</View>
          <Button className='btn' onClick={this.done}>确定</Button>
          </>
          ||
          <View className='msg'>
          <Text>{this.state.claim && this.state.claim.prize.name} x {this.state.claim && this.state.claim.value}</Text>
          </View>
        }
        { this.state.action === 'claim' &&
        <Button className='btn' onClick={this.setClaimed} disabled={this.state.disabled}>确定兑奖</Button>
        }
        { this.state.action === 'settle' &&
        <Button className='btn' onClick={this.settle} disabled={this.state.disabled2}>确定兑付</Button>
        }
      </View>
    )
  }
}
