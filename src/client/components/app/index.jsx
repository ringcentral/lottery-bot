/**
 * check poll details
 * and poll records
 */

import { Component } from 'react'
import {
  Table,
  Spin,
  Typography,
  Button
} from 'antd'
import {
  getData
} from '../../common/apis'
import {
  GithubFilled,
  HighlightOutlined,
  LinkOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import downloadFile from '../../common/download'
import { format } from '../../common/constants'

const { Text } = Typography

export default class View extends Component {
  state = {
    loading: false,
    title: '',
    batchId: '',
    data: []
  }

  componentDidMount () {
    window.particleBg('#bg', {
      color: '#08c'
    })
    this.getData()
  }

  getData = async () => {
    this.setState({
      loading: true
    })
    const up = {
      loading: false
    }
    const info = await getData()
    if (info && info.data) {
      Object.assign(up, info)
    }
    this.setState(up)
  }

  createString = item => {
    return this.def.map((it) => {
      const {
        dataIndex,
        render
      } = it
      const s = item[dataIndex]
      const v = render
        ? render(s, item)
        : s
      return `"${v}"`
    }).join(',')
  }

  handleDownload = () => {
    const fileName = `${window.rc.id}.csv`
    const {
      data
    } = this.state
    const str = data.reduce((p, k) => {
      return p + '\n' + this.createString(k)
    }, this.def.map(d => `"${d.title}"`).join(','))
    downloadFile(fileName, str)
  }

  renderDown () {
    return (
      <div className='pd1y alignright'>
        <span className='mg1r'>Batch ID: {this.state.batchId}</span>
        <Button onClick={this.handleDownload}>
          Download as csv
        </Button>
      </div>
    )
  }

  def = [
    {
      title: 'Time',
      dataIndex: 'createTime',
      key: 'createTime',
      render: t => dayjs(t).format(format),
      sort: (a, b) => a.createTime - b.createTime
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sort: (a, b) => a.title > b.title ? 1 : -1
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (e, it) => `${it.firstName} ${it.lastName}`
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }
  ]

  renderList = () => {
    const {
      data
    } = this.state

    return (
      <div className='list pd1y'>
        {this.renderDown()}
        <Table
          bordered
          columns={this.def}
          dataSource={data}
        />
      </div>
    )
  }

  renderFooter = () => {
    return (
      <div className='pd3y'>
        <h2>
          <img src='https://raw.githubusercontent.com/ringcentral/lottery-bot/master/imgs/lottery-64.png' height={21} className='iblock mg1r' />
          <span className='iblock'>Lottery bot for RingCentral app</span>
        </h2>
        <p>
          <a
            href={window.rc.feedbackUrl}
            target='_blank'
            rel='noreferrer'
          >
            <HighlightOutlined /> Feedback
          </a>
          <a
            className='mg1l'
            href='https://github.com/ringcentral/lottery-bot'
            target='_blank'
            rel='noreferrer'
          >
            <GithubFilled /> GitHub repo
          </a>
          <a
            className='mg1l'
            href='https://www.ringcentral.com/apps/'
            target='_blank'
            rel='noreferrer'
          >
            <LinkOutlined /> RingCentral App gallery
          </a>
        </p>
        <div className='pd1y'>
          <Text type='secondary'>
            <div>
              <img src='//raw.githubusercontent.com/ringcentral/ringcentral-embeddable/master/src/assets/rc/icon.svg' className='iblock mg1r' alt='' />
              <span className='iblock bold pd1y'>RingCentral Labs</span>
            </div>
            <p>RingCentral Labs is a program that lets RingCentral engineers, platform product managers and other employees share RingCentral apps they've created with the customer community. RingCentral Labs apps are free to use, but are not official products, and should be considered community projects - these apps are not officially tested or documented. For help on any RingCentral Labs app please consult each project's GitHub Issues message boards - RingCentral support is not available for these applications.</p>
          </Text>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='wrap'>
        <div className='pd3y'>
          <Spin spinning={this.state.loading}>
            <h2>Lottery picking detail table</h2>
            {this.renderList()}
          </Spin>
        </div>
        {this.renderFooter()}
      </div>
    )
  }
}
