import 'dotenv/config'
import {JSONRPCClient, JSONRPCServer, JSONRPCServerAndClient} from 'json-rpc-2.0'
import {v4 as uuid} from 'uuid'
import {WebSocket} from 'ws'
import {StaticAuthProvider} from '@twurple/auth'
import {ApiClient} from '@twurple/api'
import {ChatClient} from '@twurple/chat'
import {EventSubWsListener} from "@twurple/eventsub-ws"

import {twitchChatListen, twitchChatRegister} from './twitch/twitchChat'
import {twitchEventSubListen} from './twitch/twitchEventSub'
import {twitchApiRegister} from './twitch/twitchApi'

import {EVNTBOARD_HOST, MODULE_CODE, MODULE_NAME, MODULE_TOKEN, TWITCH_SCOPES} from './constant'

const main = async () => {

  if (!EVNTBOARD_HOST) {
    throw new Error("EVNTBOARD_HOST not set")
  }

  if (!MODULE_NAME) {
    throw new Error("MODULE_NAME not set")
  }

  if (!MODULE_TOKEN) {
    throw new Error("MODULE_TOKEN not set")
  }

  let ws: WebSocket

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

  ws = new WebSocket(EVNTBOARD_HOST)

  ws.onopen = async () => {
    const result = await serverAndClient.request('session.register', {
      code: MODULE_CODE,
      name: MODULE_NAME,
      token: MODULE_TOKEN
    })

    let twitchClientId = result?.find((c: { key: string, value: string }) => c.key === 'clientId')?.value ?? undefined
    let twitchAccessToken = result?.find((c: {
      key: string,
      value: string
    }) => c.key === 'accessToken')?.value ?? undefined
    let twitchBotClientId = result?.find((c: {
      key: string,
      value: string
    }) => c.key === 'botClientId')?.value ?? undefined
    let twitchBotAccessToken = result?.find((c: {
      key: string,
      value: string
    }) => c.key === 'botAccessToken')?.value ?? undefined

    if (!twitchClientId || !twitchAccessToken) {
      console.error(`Twitch client ID and Access Token is missing :(`)
      return
    }

    const authProvider = new StaticAuthProvider(twitchClientId, twitchAccessToken, TWITCH_SCOPES)
    let authBotProvider

    if (twitchBotClientId && twitchBotAccessToken) {
      authBotProvider = new StaticAuthProvider(twitchBotClientId, twitchBotAccessToken, TWITCH_SCOPES)
    }

    const twitchApiInstance = new ApiClient({authProvider})

    const currentUser = await twitchApiInstance.getTokenInfo()

    if (!currentUser?.userName) {
      throw new Error('Token have no userName set !')
    }

    const twitchChatInstance = new ChatClient({
      channels: [currentUser.userName],
      isAlwaysMod: true,
      authProvider: authBotProvider ? authBotProvider : authProvider
    })

    const twitchEventSubInstance = new EventSubWsListener({apiClient: twitchApiInstance})

    twitchEventSubInstance.start()

    twitchChatInstance.connect()

    await twitchChatListen(twitchChatInstance, currentUser, serverAndClient)

    await twitchEventSubListen(twitchEventSubInstance, currentUser, serverAndClient)

    await twitchChatRegister(twitchChatInstance, currentUser, serverAndClient)

    await twitchApiRegister(twitchApiInstance, currentUser, serverAndClient)

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