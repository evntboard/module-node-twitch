import { JSONRPCClient, JSONRPCServer, JSONRPCServerAndClient } from 'json-rpc-2.0'
import { v4 as uuid } from 'uuid'
import { StaticAuthProvider } from '@twurple/auth'
import { ApiClient } from '@twurple/api'
import { ChatClient } from '@twurple/chat'
import { PubSubClient } from '@twurple/pubsub'

import * as TwitchEventPub from './twitchEventPub.js'

import { MODULE_CODE, MODULE_NAME, TWITCH_SCOPES, START_ARGS } from './constant.js'
import {
  transformChatBitsBadgeUpgradeInfo,
  transformChatCommunityPayForwardInfo,
  transformChatCommunitySubInfo,
  transformChatMessage,
  transformChatPrimeCommunityGiftInfo,
  transformChatRaidInfo,
  transformChatRewardGiftInfo,
  transformChatRitualInfo,
  transformChatStandardPayForwardInfo, transformChatSubExtendInfo, transformChatSubGiftInfo,
  transformChatSubGiftUpgradeInfo,
  transformChatSubInfo,
  transformChatSubUpgradeInfo,
  transformClearChat,
  transformPubSubBitsMessage,
  transformPubSubRedemptionMessage,
  transformUserNotice, transformWhisper
} from './transform.js'

const connectTwitch = async (serverAndClient, twitchClientId, twitchAccessToken, twitchBotClientId, twitchBotAccessToken) => {
  let twitchApiInstance
  let twitchPubSubInstance
  let twitchChatInstance
  let twitchRedemptionListener
  let twitchBitsListener

  const authProvider = new StaticAuthProvider(twitchClientId, twitchAccessToken, TWITCH_SCOPES)
  let authBotProvider

  if (twitchBotClientId && twitchBotAccessToken) {
    authBotProvider = new StaticAuthProvider(twitchBotClientId, twitchBotAccessToken, TWITCH_SCOPES)
  }

  twitchApiInstance = new ApiClient({ authProvider })
  twitchPubSubInstance = new PubSubClient({ authProvider })

  const currentUser = await twitchApiInstance.getTokenInfo()

  twitchChatInstance = new ChatClient({
    channels: [currentUser.userName],
    isAlwaysMod: true,
    authProvider: authBotProvider ? authBotProvider :  authProvider
  })

  TwitchEventPub.listen(twitchApiInstance, currentUser, serverAndClient)

  // Fires when a user redeems channel points
  twitchRedemptionListener = await twitchPubSubInstance?.onRedemption(
    currentUser.userId,
    (msg) => {
      serverAndClient.notify('event.new', {
        name: `${MODULE_CODE}-channel-point`,
        payload: transformPubSubRedemptionMessage(msg)
      })
    }
  )

  twitchBitsListener = await twitchPubSubInstance?.onBits(
    currentUser.userId,
    (msg) => {
      serverAndClient.notify('event.new', {
        name: `${MODULE_CODE}-bits`,
        payload: transformPubSubBitsMessage(msg),
      })
    }
  )

  twitchChatInstance.onConnect(() => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-connected`
    })
  })

  // Fires when a user sends a message to a channel.
  twitchChatInstance?.onMessage((channel, _, message, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-message`,
      payload: transformChatMessage(message, msg),
    })
  })

  // Fires when a user sends an action (/me) to a channel.
  twitchChatInstance?.onAction((channel, _, message, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-action`,
      payload: transformChatMessage(message, msg),
    })
  })

  // Fires when a user is permanently banned from a channel.
  twitchChatInstance?.onBan((channel, user, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-ban`,
      payload: transformClearChat(user, msg),
    })
  })

  // Fires when a user upgrades their bits badge in a channel.
  twitchChatInstance?.onBitsBadgeUpgrade((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-bits-badge-upgrade`,
      payload: {
        user,
        info: transformChatBitsBadgeUpgradeInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when the chat of a channel is cleared.
  twitchChatInstance?.onChatClear((user, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-chat-clear`,
      payload: transformClearChat(user, msg),

    })
  })

  // Fires when a user pays forward a subscription that was gifted to them to the community.
  twitchChatInstance?.onCommunityPayForward((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-community-pay-forward`,
      payload: {
        user,
        info: transformChatCommunityPayForwardInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user gifts random subscriptions to the community of a channel.
  twitchChatInstance?.onCommunitySub((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-community-sub`,
      payload: {
        user,
        info: transformChatCommunitySubInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when emote-only mode is toggled in a channel.
  twitchChatInstance?.onEmoteOnly((channel, enabled) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-emote-only`,
      payload: { enabled },

    })
  })

  // Fires when followers-only mode is toggled in a channel.
  twitchChatInstance?.onFollowersOnly((channel, enabled, delay) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-follower-only`,
      payload: { enabled, delay },

    })
  })

  // Fires when a user upgrades their gift subscription to a paid subscription in a channel.
  twitchChatInstance?.onGiftPaidUpgrade((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-gift-paid-upgrade`,
      payload: {
        user,
        info: transformChatSubGiftUpgradeInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user joins a channel.
  twitchChatInstance?.onJoin((channel, user) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-join`,
      payload: { user },

    })
  })

  // Fires when a user sends a message to a channel.
  twitchChatInstance?.onPart((channel, user) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-part`,
      payload: { user },

    })
  })

  // Fires when a user gifts a Twitch Prime benefit to the channel.
  twitchChatInstance?.onPrimeCommunityGift((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-prime-community-gift`,
      payload: {
        user,
        info: transformChatPrimeCommunityGiftInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user upgrades their Prime subscription to a paid subscription in a channel.
  twitchChatInstance?.onPrimePaidUpgrade((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-prime-paid-upgrade`,
      payload: {
        user,
        info: transformChatSubUpgradeInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user raids a channel.
  twitchChatInstance?.onRaid((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-raid`,
      payload: {
        user,
        info: transformChatRaidInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user cancels a raid.
  twitchChatInstance?.onRaidCancel((channel, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-raid-cancel`,
      payload: {
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user resubscribes to a channel.
  twitchChatInstance?.onResub((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-resub`,
      payload: {
        user,
        info: transformChatSubInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user gifts rewards during a special event.
  twitchChatInstance?.onRewardGift((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-reward-gift`,
      payload: {
        user,
        info: transformChatRewardGiftInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user performs a "ritual" in a channel. WTF ?!
  twitchChatInstance?.onRitual((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-ritual`,
      payload: {
        user,
        info: transformChatRitualInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when slow mode is toggled in a channel.
  twitchChatInstance?.onSlow((channel, enabled, delay) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-slow`,
      payload: { enabled, delay },

    })
  })

  // Fires when a user pays forward a subscription that was gifted to them to a specific user.
  twitchChatInstance?.onStandardPayForward((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-standard-pay-forward`,
      payload: {
        user,
        info: transformChatStandardPayForwardInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user subscribes to a channel.
  twitchChatInstance?.onSub((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-sub`,
      payload: {
        user,
        info: transformChatSubInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user extends their subscription using a Sub Token.
  twitchChatInstance?.onSubExtend((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-sub-extend`,
      payload: {
        user,
        info: transformChatSubExtendInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when a user gifts a subscription to a channel to another user.
  twitchChatInstance?.onSubGift((channel, user, info, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-sub-gift`,
      payload: {
        user,
        info: transformChatSubGiftInfo(info),
        msg: transformUserNotice(msg)
      },
    })
  })

  // Fires when sub only mode is toggled in a channel.
  twitchChatInstance?.onSubsOnly((channel, enabled) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-sub-only`,
      payload: { enabled },

    })
  })

  // Fires when a user is timed out from a channel.
  twitchChatInstance?.onTimeout((channel, user, duration) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-timeout`,
      payload: { user, duration },

    })
  })

  // Fires when receiving a whisper from another user.
  twitchChatInstance?.onWhisper((user, message, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-whipser`,
      payload: { user, message, msg: transformWhisper(msg) }
    })
  })

  serverAndClient.addMethod('say', ({message, reply}) => twitchChatInstance?.say(currentUser.userName, message, { replyTo: reply }))
  serverAndClient.addMethod('me', ({message}) => twitchChatInstance?.action(currentUser.userName, message))
  serverAndClient.addMethod('addVip', ({user}) => twitchChatInstance?.addVip(currentUser.userName, user))
  serverAndClient.addMethod('clear', () => twitchChatInstance?.clear(currentUser.userName))
  serverAndClient.addMethod('getVips', () => twitchChatInstance?.getVips(currentUser.userName))
  serverAndClient.addMethod('host', ({channel}) => twitchChatInstance?.host(currentUser.userName, channel))
  serverAndClient.addMethod('mod', ({user}) => twitchChatInstance?.mod(currentUser.userName, user))
  serverAndClient.addMethod('removeVip', ({user}) => twitchChatInstance?.removeVip(currentUser.userName, user))
  serverAndClient.addMethod('timeout', ({user, duration, reason}) => twitchChatInstance?.timeout(currentUser.userName, user, duration, reason))

  // Bits
  serverAndClient.addMethod('bitsGetLeaderboard', (data) => twitchApiInstance?.bits.getLeaderboard(data))
  serverAndClient.addMethod('bitsGetCheermotes', ({channel}) => twitchApiInstance?.bits.getCheermotes(channel))

  // Channel
  serverAndClient.addMethod('channelGetChannelEditors', () => twitchApiInstance?.channels.getChannelEditors(currentUser.userId))
  serverAndClient.addMethod('channelUpdateTitle', ({title}) => twitchApiInstance?.channels.updateChannelInfo(currentUser.userId, { title }))
  serverAndClient.addMethod('channelUpdateGame', async ({game}) => {
    const gameObj = await twitchApiInstance.games.getGameByName(game)
    return await twitchApiInstance.channels.updateChannelInfo(
      currentUser.userId,
      {
        gameId: gameObj?.id || game
      }
    )
  })
  serverAndClient.addMethod('channelUpdateLanguage', ({language}) => twitchApiInstance?.channels.updateChannelInfo(currentUser.userId, { language }))
  serverAndClient.addMethod('channelStartCommercial', ({duration}) => twitchApiInstance?.channels.startChannelCommercial(currentUser.userId, duration))

  // ChannelPointsApi
  serverAndClient.addMethod('channelPointsGetCustomRewards', ({onlyManageable}) => twitchApiInstance?.channelPoints.getCustomRewards(currentUser.userId, onlyManageable))
  serverAndClient.addMethod('channelPointsGetCustomRewardsByIds', ({rewardIds}) => twitchApiInstance?.channelPoints.getCustomRewardsByIds(currentUser.userId, rewardIds))
  serverAndClient.addMethod('channelPointsGetCustomRewardById', ({rewardId}) => twitchApiInstance?.channelPoints.getCustomRewardById(currentUser.userId, rewardId))
  serverAndClient.addMethod('channelPointsCreateCustomReward', ({rewardData}) => twitchApiInstance?.channelPoints.createCustomReward(currentUser.userId, rewardData))
  serverAndClient.addMethod('channelPointsUpdateCustomReward', ({rewardId, rewardData}) => twitchApiInstance?.channelPoints.updateCustomReward(currentUser.userId, rewardId, rewardData))
  serverAndClient.addMethod('channelPointsDeleteCustomReward', ({rewardId}) => twitchApiInstance?.channelPoints.deleteCustomReward(currentUser.userId, rewardId))
  serverAndClient.addMethod('channelPointsGetRedemptionsByIds', ({rewardId, redemptionIds}) => twitchApiInstance?.channelPoints.getRedemptionsByIds(currentUser.userId, rewardId, redemptionIds))
  serverAndClient.addMethod('channelPointsGetRedemptionById', ({rewardId, redemptionIds}) => twitchApiInstance?.channelPoints.getRedemptionById(currentUser.userId, rewardId, redemptionIds))
  serverAndClient.addMethod('channelPointsGetRedemptionsForBroadcaster', ({rewardId, status, filter}) => twitchApiInstance?.channelPoints.getRedemptionsForBroadcaster(currentUser.userId, rewardId, status, filter))
  serverAndClient.addMethod('channelPointsGetRedemptionsForBroadcasterPaginated', ({rewardId, status, filter}) => twitchApiInstance?.channelPoints.getRedemptionsForBroadcasterPaginated(currentUser.userId, rewardId, status, filter))
  serverAndClient.addMethod('channelPointsUpdateRedemptionStatusByIds', ({rewardId, redemptionIds, status}) => twitchApiInstance?.channelPoints.updateRedemptionStatusByIds(currentUser.userId, rewardId, redemptionIds, status))

  // CLip
  serverAndClient.addMethod('clipGetClipsForBroadcaster', ({filter}) => twitchApiInstance?.clips.getClipsForBroadcaster(currentUser.userId, filter))
  serverAndClient.addMethod('getClipsForBroadcasterPaginated', ({filter}) => twitchApiInstance?.clips.getClipsForBroadcasterPaginated(currentUser.userId, filter))
  serverAndClient.addMethod('getClipsForGame', ({gameId, filter}) => twitchApiInstance?.clips.getClipsForGame(gameId, filter))
  serverAndClient.addMethod('getClipsForGamePaginated', ({gameId, filter}) => twitchApiInstance?.clips.getClipsForGamePaginated(gameId, filter))
  serverAndClient.addMethod('getClipsByIds', ({ids}) => twitchApiInstance?.clips.getClipsByIds(ids))
  serverAndClient.addMethod('getClipById', ({id}) => twitchApiInstance?.clips.getClipById(id))
  serverAndClient.addMethod('createClip', ({createAfterDelay}) => twitchApiInstance?.clips.createClip({
    channelId: currentUser.userId,
    createAfterDelay
  }))

  // Users
  serverAndClient.addMethod('usersGetUserByName', async ({user}) => {
    const data = await twitchApiInstance.users.getUserByName(user)
    return {
      broadcasterType: data.broadcasterType,
      creationDate: data.creationDate,
      description: data.description,
      displayName: data.displayName,
      id: data.id,
      name: data.name,
      offlinePlaceholderUrl: data.offlinePlaceholderUrl,
      profilePictureUrl: data.profilePictureUrl,
      type: data.type,
      views: data.views
    }
  })

  await twitchChatInstance.connect()
}

function onstart() {
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

  const wsUri = START_ARGS['host'] ?? 'ws://localhost:8080/module'
  ws = new WebSocket(wsUri)

  ws.onopen = async () => {
    const result = await serverAndClient.request('session.register', {
      code: MODULE_CODE,
      name: MODULE_NAME
    })

    let twitchClientId = result?.find((c) => c.key === 'clientId')?.value ?? undefined
    let twitchAccessToken = result?.find((c) => c.key === 'accessToken')?.value ?? undefined
    let twitchBotClientId = result?.find((c) => c.key === 'botClientId')?.value ?? undefined
    let twitchBotAccessToken = result?.find((c) => c.key === 'botAccessToken')?.value ?? undefined

    if (!twitchClientId || !twitchAccessToken) {
      console.error(`Twitch client ID and Access Token is missing :(`)
      return
    }

    connectTwitch(serverAndClient, twitchClientId, twitchAccessToken, twitchBotClientId, twitchBotAccessToken)
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

onstart()
