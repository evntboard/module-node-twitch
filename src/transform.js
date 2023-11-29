import { EventSubChannelBanEvent } from '@twurple/eventsub-base/lib/events/EventSubChannelBanEvent'

export const transformChatMessage = (message, data) => ({
  message,
  id: data?.id,
  date: data?.date,
  userInfo: transformChatUser(data?.userInfo),
  channelId: data?.channelId,
  isCheer: data?.isCheer,
  isRedemption: data?.isRedemption,
  rewardId: data?.rewardId,
  isFirst: data?.isFirst,
  isReturningChatter: data?.isReturningChatter,
  isHighlight: data?.isHighlight,
  isReply: data?.isReply,
  parentMessage: {
    id: data?.parentMessageId,
    text: data?.parentMessageText,
    userId: data?.parentMessageUserId,
    userName: data?.parentMessageUserName,
    userDisplayName: data?.parentMessageUserName,
  },
  threadMessage: {
    id: data?.threadMessageId,
    userId: data?.threadMessageUserId,
  },
  bits: data?.bits,
  emoteOffsets: Object.fromEntries(data?.emoteOffsets),
  isHypeChat: data?.isHypeChat,
  hypeChat: {
    amount: data?.hypeChatAmount,
    decimalPlaces: data?.hypeChatDecimalPlaces,
    localizedAmount: data?.hypeChatLocalizedAmount,
    currency: data?.hypeChatCurrency,
    level: data?.hypeChatLevel,
    isSystemMessage: data?.hypeChatIsSystemMessage,
  }
})

export const transformChatUser = (data) => ({
  userName: data?.userName,
  displayName: data?.displayName,
  color: data?.color,
  badges: Object.fromEntries(data?.badges),
  badgeInfo: Object.fromEntries(data?.badgeInfo),
  userId: data?.userId,
  userType: data?.userType,
  isBroadcaster: data?.isBroadcaster,
  isSubscriber: data?.isSubscriber,
  isFounder: data?.isFounder,
  isMod: data?.isMod,
  isVip: data?.isVip,
  isArtist: data?.isArtist,
})

export const transformPubSubBitsMessage = (data) => ({
  userId: data?.userId,
  userName: data?.userName,
  message: data?.message,
  bits: data?.bits,
  totalBits: data?.totalBits,
  isAnonymous: data?.isAnonymous,
})

export const transformPubSubRedemptionMessage = (data) => ({
  id: data?.id,
  userId: data?.userId,
  userName: data?.userName,
  userDisplayName: data?.userDisplayName,
  channelId: data?.channelId,
  redemptionDate: data?.redemptionDate,
  rewardId: data?.rewardId,
  rewardTitle: data?.rewardTitle,
  rewardPrompt: data?.rewardPrompt,
  rewardCost: data?.rewardCost,
  rewardIsQueued: data?.rewardIsQueued,
  rewardImage: {
    url_1x: data?.rewardImage?.url_1x,
    url_2x: data?.rewardImage?.url_2x,
    url_4x: data?.rewardImage?.url_4x,
  },
  defaultImage: {
    url_1x: data?.defaultImage?.url_1x,
    url_2x: data?.defaultImage?.url_2x,
    url_4x: data?.defaultImage?.url_4x,
  },
  message: data?.message,
  status: data?.status,
})

export const transformClearChat = (user, data) => ({
  user,
  date: data?.date,
  channelId: data?.channelId,
  targetUserId: data?.targetUserId,
})

export const transformChatBitsBadgeUpgradeInfo = (data) => ({
  displayName: data?.displayName,
  threshold: data?.threshold,
})

export const transformUserNotice = (data) => ({
  id: data?.id,
  date: data?.date,
  userInfo: transformChatUser(data?.userInfo),
  channelId: data?.channelId,
  emoteOffsets: Object.fromEntries(data?.emoteOffsets),
})

export const transformChatCommunityPayForwardInfo = (data) => ({
  userId: data?.userId,
  displayName: data?.displayName,
  originalGifterUserId: data?.originalGifterUserId,
  originalGifterDisplayName: data?.originalGifterDisplayName,
})

export const transformChatCommunitySubInfo = (data) => ({
  gifter: data?.gifter,
  gifterUserId: data?.gifterUserId,
  gifterDisplayName: data?.gifterDisplayName,
  gifterGiftCount: data?.gifterGiftCount,
  count: data?.count,
  plan: data?.plan,
})

export const transformChatSubGiftUpgradeInfo = (data) => ({
  userId: data?.userId,
  displayName: data?.displayName,
  gifter: data?.gifter,
  gifterDisplayName: data?.gifterDisplayName,
})

export const transformChatPrimeCommunityGiftInfo = (data) => ({
  name: data?.name,
  gifter: data?.gifter,
  gifterDisplayName: data?.gifterDisplayName,
})

export const transformChatSubUpgradeInfo = (data) => ({
  userId: data?.userId,
  displayName: data?.displayName,
  plan: data?.plan,
})

export const transformChatRaidInfo = (data) => ({
  displayName: data?.displayName,
  viewerCount: data?.viewerCount,
})

export const transformChatSubInfo = (data) => ({
  userId: data?.userId,
  displayName: data?.displayName,
  plan: data?.plan,
  planName: data?.planName,
  isPrime: data?.isPrime,
  months: data?.months,
  streak: data?.streak,
  message: data?.message,
  originalGiftInfo: transformChatSubOriginalGiftInfo(data?.originalGiftInfo),
})

export const transformChatSubOriginalGiftInfo = (data) => ({
  anonymous: data?.anonymous,
  userId: data?.userId,
  userName: data?.userName,
  userDisplayName: data?.userDisplayName,
  duration: data?.duration,
  redeemedMonth: data?.redeemedMonth,
})

export const transformChatRewardGiftInfo = (data) => ({
  domain: data?.domain,
  count: data?.count,
  gifterId: data?.gifterId,
  gifterDisplayName: data?.gifterDisplayName,
  gifterGiftCount: data?.gifterGiftCount,
  triggerType: data?.triggerType,
})

export const transformChatRitualInfo = (data) => ({
  ritualName: data?.ritualName,
  message: data?.message,
})

export const transformChatStandardPayForwardInfo = (data) => ({
  userId: data?.userId,
  displayName: data?.displayName,
  recipientUserId: data?.recipientUserId,
  recipientDisplayName: data?.recipientDisplayName,
  originalGifterUserId: data?.originalGifterUserId,
  originalGifterDisplayName: data?.originalGifterDisplayName,
})

export const transformChatSubExtendInfo = (data) => ({
  userId: data?.userId,
  displayName: data?.displayName,
  plan: data?.plan,
  months: data?.months,
  endMonth: data?.endMonth
})

export const transformChatSubGiftInfo = (data) => ({
  ...transformChatSubInfo(data),
  gifter: data?.gifter,
  gifterUserId: data?.gifterUserId,
  gifterDisplayName: data?.gifterDisplayName,
  gifterGiftCount: data?.gifterGiftCount,
  giftDuration: data?.giftDuration
})

export const transformWhisper = (data) => ({
  userInfo: transformChatUser(data?.userInfo),
  target: data?.target,
  text: data?.text,
  emoteOffsets: Object.fromEntries(data?.gifterGiftCount),
})

export const transformEventSubStreamOnlineEvent = (data) => {
  return ({
    id: data.id,
    startDate: data.startDate,
    type: data.type,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
  })
}

export const transformEventSubStreamOfflineEvent = (data) => {
  return ({
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
  })
}

export const transformEventSubChannelFollowEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    followDate: data.followDate?.toISOString(),
  })
}

export const transformEventSubChannelSubscriptionEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    tier: data.tier,
    isGift: data.isGift,
  })
}

export const transformEventSubChannelSubscriptionGiftEvent = (data) => {
  return ({
    gifterId: data.gifterId,
    gifterName: data.gifterName,
    gifterDisplayName: data.gifterDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    amount: data.amount,
    cumulativeAmount: data.cumulativeAmount,
    tier: data.tier,
    isAnonymous: data.isAnonymous,
  })
}

export const transformEventSubChannelSubscriptionMessageEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    tier: data.tier,
    cumulativeMonths: data.cumulativeMonths,
    streakMonths: data.streakMonths,
    durationMonths: data.durationMonths,
    messageText: data.messageText,
    emoteOffsets: data.emoteOffsets,
  })
}

export const transformEventSubChannelSubscriptionEndEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    tier: data.tier,
    isGift: data.isGift,
  })
}

export const transformEventSubChannelCheerEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    isAnonymous: data.isAnonymous,
    message: data.message,
    bits: data.bits,
  })
}

export const transformEventSubChannelHypeTrainBeginEvent = (data) => {
  return ({
    id: data.id,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    level: data.level,
    total: data.total,
    progress: data.progress,
    goal: data.goal,
    topContributors: data.topContributors,
    lastContribution: data.lastContribution,
    startDate: data.startDate?.toISOString(),
    expiryDate: data.expiryDate?.toISOString(),
  })
}

export const transformEventSubChannelHypeTrainProgressEvent = (data) => {
  return ({
    id: data.id,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    level: data.level,
    total: data.total,
    progress: data.progress,
    goal: data.goal,
    topContributors: data.topContributors,
    lastContribution: data.lastContribution,
    startDate: data.startDate?.toISOString(),
    expiryDate: data.expiryDate?.toISOString(),
  })
}

export const transformEventSubChannelHypeTrainEndEvent = (data) => {
  return ({
    id: data.id,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    level: data.level,
    total: data.total,
    topContributors: data.topContributors,
    startDate: data.startDate?.toISOString(),
    endDate: data.endDate?.toISOString(),
    cooldownEndDate: data.cooldownEndDate?.toISOString(),
  })
}

export const transformEventSubChannelBanEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    moderatorId: data.moderatorId,
    moderatorName: data.moderatorName,
    moderatorDisplayName: data.moderatorDisplayName,
    reason: data.reason,
    startDate: data.startDate?.toISOString(),
    endDate: data.endDate?.toISOString(),
    isPermanent: data.isPermanent,
  })
}

export const transformEventSubChannelUnbanEvent = (data) => {
  return ({
    userId: data.userId,
    userName: data.userName,
    userDisplayName: data.userDisplayName,
    broadcasterId: data.broadcasterId,
    broadcasterName: data.broadcasterName,
    broadcasterDisplayName: data.broadcasterDisplayName,
    moderatorId: data.moderatorId,
    moderatorName: data.moderatorName,
    moderatorDisplayName: data.moderatorDisplayName,
  })
}