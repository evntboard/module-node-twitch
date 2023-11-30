import {JSONRPCServerAndClient} from "json-rpc-2.0";
import {TokenInfo} from "@twurple/auth";
import {ChatClient} from "@twurple/chat";

import {MODULE_CODE} from '../constant'
import {
  transformChatBitsBadgeUpgradeInfo,
  transformChatCommunityPayForwardInfo,
  transformChatCommunitySubInfo,
  transformChatMessage,
  transformChatPrimeCommunityGiftInfo,
  transformChatRaidInfo,
  transformChatRewardGiftInfo,
  transformChatRitualInfo,
  transformChatStandardPayForwardInfo,
  transformChatSubExtendInfo,
  transformChatSubGiftInfo,
  transformChatSubGiftUpgradeInfo,
  transformChatSubInfo,
  transformChatSubUpgradeInfo,
  transformClearChat,
  transformClearMsg,
  transformUserNotice,
  transformWhisper
} from '../transform'

export async function twitchChatListen(twitchChatInstance: ChatClient, currentUser: TokenInfo, serverAndClient: JSONRPCServerAndClient) {
  twitchChatInstance.onConnect(() => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-connect`
    })
  })

  twitchChatInstance.onDisconnect(() => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-disconnect`
    })
  })

  twitchChatInstance.onNoPermission((channel, text) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-no-permission`,
      payload: {
        text
      }
    })
  })

  // Fires when a user sends a message to a channel.
  twitchChatInstance?.onMessage((channel, user, text, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-message`,
      payload: transformChatMessage(text, msg),
    })
  })

  twitchChatInstance?.onMessageRemove((channel, messageId, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-message-remove`,
      payload: transformClearMsg(msg),
    })
  })

  twitchChatInstance?.onMessageRatelimit((channel, text) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-message-ratelimit`,
      payload: {
        text
      },
    })
  })

  twitchChatInstance?.onUniqueChat((channel, enabled) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-unique-chat`,
      payload: {
        enabled
      },
    })
  })

  twitchChatInstance?.onAnnouncement((channel, user, announcementInfo, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-announcement`,
      payload: {
        color: announcementInfo.color,
        ...transformUserNotice(msg),
      },
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
      payload: {enabled},

    })
  })

  // Fires when followers-only mode is toggled in a channel.
  twitchChatInstance?.onFollowersOnly((channel, enabled, delay) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-follower-only`,
      payload: {enabled, delay},

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
      payload: {user},

    })
  })

  // Fires when a user  fail joins a channel.
  twitchChatInstance?.onJoinFailure((channel, user) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-join-failure`,
      payload: {user},

    })
  })

  // Fires when a user sends a message to a channel.
  twitchChatInstance?.onPart((channel, user) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-part`,
      payload: {user},

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
      payload: {enabled, delay},

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
      payload: {enabled},

    })
  })

  // Fires when a user is timed out from a channel.
  twitchChatInstance?.onTimeout((channel, user, duration) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-timeout`,
      payload: {user, duration},

    })
  })

  // Fires when receiving a whisper from another user.
  twitchChatInstance?.onWhisper((user, message, msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-whipser`,
      payload: {user, message, msg: transformWhisper(msg)}
    })
  })
}

export async function twitchChatRegister(twitchChatInstance: ChatClient, currentUser: TokenInfo, serverAndClient: JSONRPCServerAndClient) {
  if (!currentUser?.userName) {
    throw new Error('Token have no userName set !')
  }

  serverAndClient.addMethod('say', ({
                                      message,
                                      reply
                                    }) => twitchChatInstance?.say(currentUser.userName as string, message, {replyTo: reply}))
  serverAndClient.addMethod('me', ({message}) => twitchChatInstance?.action(currentUser.userName as string, message))
}