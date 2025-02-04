import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'
import styles from './index.module.less'

function Login() {
  const [uid, setUid] = useState('')
  const [token, setToken] = useState('')
  const [towerData, setTowerData] = useState('')
  const [towerRender, setTowerRender] = useState(false)


  const onFinish = () => {
    console.log('saveDataToBrowser');
    localStorage.setItem('uid', uid)
    localStorage.setItem('token', token)
    alert('保存成功，可以查询')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const fetchTest = async () => {
    const url = 'https://api.kurobbs.com/aki/roleBox/akiBox/towerIndex'
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
      "Accept": "application/json, text/plain, */*",
      "pragma": "no-cache",
      "cache-control": "no-cache",
      "sec-ch-ua": "\"Chromium\";v=\"124\", \"Android WebView\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
      "source": "h5",
      "devcode": "111.181.85.154, Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 Kuro/2.2.0 KuroGameBox/2.2.0",
      "sec-ch-ua-platform": "\"Android\"",
      "origin": "https://web-static.kurobbs.com",
      "x-requested-with": "com.kurogame.kjq",
      "sec-fetch-site": "same-site",
      "sec-fetch-mode": "cors",
      "sec-fetch-dest": "empty",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "priority": "u=1, i",
      "token": token ? token : localStorage.getItem('token'),
    }

    const formData = new URLSearchParams()
    formData.append('gameId', 3)
    formData.append('roleId', uid ? uid : localStorage.getItem('uid'))
    formData.append('serverId', '76402e5b20be2c39f095a152090afddc')
    formData.append('id', '1505')
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData,
      })

      if (!response.ok) {
        console.error('fetch error: ', response.status, response.statusText)
      }

      const rsp = await response.json()

      if (rsp.code === 200) {
        setTowerData(JSON.parse(rsp.data))
        setTowerRender(true)
        console.log(JSON.parse(rsp.data));
      } else {
        alert(rsp.msg)
        console.error('api error:', JSON.stringify(rsp))
      }
    } catch (error) {
      console.error('fetch error:', error)
    }
  }

  const tower = towerData.difficultyList && towerData.difficultyList[0]
  return (
    <div className={styles.wrapper}>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="UID"
          name="uid"
          rules={[{ required: true, message: 'Please input your UID!' }]}
        >
          <Input value={uid} defaultValue={localStorage.uid ? localStorage.uid : uid} onChange={(e) => setUid(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Token"
          name="token"
          rules={[{ required: true, message: 'Please input your token!' }]}
        >
          <Input value={token} defaultValue={localStorage.token ? localStorage.token : token} onChange={(e) => setToken(e.target.value)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <p>保存后token会保存在浏览器本地，token过期之前不用再填</p>
        </Form.Item>
      </Form>

      <button onClick={fetchTest}>查询</button>
      {towerRender && <div className={styles.tower}>

        <div className={styles.towerTitle}>{tower.difficultyName}</div>
        {tower.towerAreaList.map(area => {
          return <div key={area.areaId} className={styles.areaWrapper}>
            <div className={styles.areaTitle}>{area.areaName} 第{area.floorList[0].floor}层</div>
            <div className={styles.areaContent}>
              <div className={styles.star}>
                {area.floorList[0].star} ★
              </div>
              <div className={styles.char}>
                {area.floorList[0].roleList.map((role, idx) => {
                  return <div key={idx} className={styles.roleBox}>
                    {/* <div className={styles.roleName}>{role.roleName}</div> */}
                    <div className={styles.roleImg}><img src={role.iconUrl} /></div>
                  </div>
                })}
              </div>
            </div>
          </div>
        })}

      </div>}
    </div>
  )
}

export default Login
