import 'dotenv/config'
import prompts from 'prompts'
import { JSONRPCClient, JSONRPCServer, JSONRPCServerAndClient } from 'json-rpc-2.0'
import { v4 as uuid } from 'uuid'
import { WebSocket } from 'ws'
import { StaticAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'
import { ChatClient } from '@twurple/chat'
import { PubSubClient } from '@twurple/pubsub'

import { twitchChatListen, twitchChatRegister } from './twitch/twitchChat.js'
import { twitchEventSubListen } from './twitch/twitchEventSub.js'
import { twitchPubSubListen } from './twitch/twitchPubSub.js'
import { twitchApiRegister } from './twitch/twitchApi'

import { EVNTBOARD_HOST, MODULE_CODE, MODULE_NAME, MODULE_TOKEN, TWITCH_SCOPES } from './constant.js'

const main = async () => {
  const questions = []

  if (!EVNTBOARD_HOST) {
    questions.push({
      type: 'text',
      name: 'host',
      message: 'What is the EvntBoard host ?'
    })
  }

  if (!MODULE_NAME) {
    questions.push({
      type: 'text',
      name: 'name',
      message: 'What is your module name ?'
    })
  }

  if (!MODULE_TOKEN) {
    questions.push({
      type: 'text',
      name: 'token',
      message: 'What is your module token?'
    })
  }

  let { token, name, host } = await prompts(questions)

  const config = {
    host: host ?? EVNTBOARD_HOST,
    name: name ?? MODULE_NAME,
    token: token ?? MODULE_TOKEN,
  }

  let ws

  const serverAndClient = new JSONRPCServerAndClient(
    new JSONRPCServer(),
    new JSONRPCClient((request) => {
      try {
        ws.send(JSON.stringify(request))
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    }, () => uuid())
  )

  ws = new WebSocket(config.host)

  ws.onopen = async () => {
    const result = await serverAndClient.request('session.register', {
      code: MODULE_CODE,
      name: config.name,
      token: config.token
    })

    let twitchClientId = result?.find((c) => c.key === 'clientId')?.value ?? undefined
    let twitchAccessToken = result?.find((c) => c.key === 'accessToken')?.value ?? undefined
    let twitchBotClientId = result?.find((c) => c.key === 'botClientId')?.value ?? undefined
    let twitchBotAccessToken = result?.find((c) => c.key === 'botAccessToken')?.value ?? undefined

    if (!twitchClientId || !twitchAccessToken) {
      console.error(`Twitch client ID and Access Token is missing :(`)
      return
    }

    const authProvider = new StaticAuthProvider(twitchClientId, twitchAccessToken, TWITCH_SCOPES)
    let authBotProvider

    if (twitchBotClientId && twitchBotAccessToken) {
      authBotProvider = new StaticAuthProvider(twitchBotClientId, twitchBotAccessToken, TWITCH_SCOPES)
    }

    const twitchApiInstance = new ApiClient({ authProvider })

    const twitchPubSubInstance = new PubSubClient({ authProvider })

    const currentUser = await twitchApiInstance.getTokenInfo()

    const twitchChatInstance = new ChatClient({
      channels: [currentUser.userName],
      isAlwaysMod: true,
      authProvider: authBotProvider ? authBotProvider : authProvider
    })

    await twitchChatListen(twitchChatInstance, currentUser, serverAndClient)

    await twitchPubSubListen(twitchPubSubInstance, currentUser, serverAndClient)

    await twitchEventSubListen(twitchApiInstance, currentUser, serverAndClient)

    await twitchChatRegister(twitchChatInstance, currentUser, serverAndClient)

    await twitchApiRegister(twitchApiInstance, currentUser, serverAndClient)

    await twitchChatInstance.connect()
  }

  ws.onmessage = (event) => {
    serverAndClient.receiveAndSend(JSON.parse(event.data.toString()))
  }

  ws.onclose = (event) => {
    serverAndClient.rejectAllPendingRequests(`Connection is closed (${event.reason}).`)
  }

  ws.onerror = (event) => {
    console.error('error a', event)
  }
}

main()
  .catch((e) => {
    console.error(e)
  })