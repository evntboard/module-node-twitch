export const transformChatMessage = (message: any, data: any) => ({
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

export const transformChatUser = (data: any): any => ({
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

export const transformPubSubBitsMessage = (data: any): any => ({
  userId: data?.userId,
  userName: data?.userName,
  message: data?.message,
  bits: data?.bits,
  totalBits: data?.totalBits,
  isAnonymous: data?.isAnonymous,
})

export const transformPubSubRedemptionMessage = (data: any): any => ({
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

export const transformClearChat = (user: any, data: any): any => ({
  user,
  date: data?.date,
  channelId: data?.channelId,
  targetUserId: data?.targetUserId,
})

export const transformChatBitsBadgeUpgradeInfo = (data: any): any => ({
  displayName: data?.displayName,
  threshold: data?.threshold,
})

export const transformUserNotice = (data: any): any => ({
  id: data?.id,
  date: data?.date,
  userInfo: transformChatUser(data?.userInfo),
  channelId: data?.channelId,
  emoteOffsets: Object.fromEntries(data?.emoteOffsets),
})

export const transformChatCommunityPayForwardInfo = (data: any): any => ({
  userId: data?.userId,
  displayName: data?.displayName,
  originalGifterUserId: data?.originalGifterUserId,
  originalGifterDisplayName: data?.originalGifterDisplayName,
})

export const transformChatCommunitySubInfo = (data: any): any => ({
  gifter: data?.gifter,
  gifterUserId: data?.gifterUserId,
  gifterDisplayName: data?.gifterDisplayName,
  gifterGiftCount: data?.gifterGiftCount,
  count: data?.count,
  plan: data?.plan,
})

export const transformChatSubGiftUpgradeInfo = (data: any): any => ({
  userId: data?.userId,
  displayName: data?.displayName,
  gifter: data?.gifter,
  gifterDisplayName: data?.gifterDisplayName,
})

export const transformChatPrimeCommunityGiftInfo = (data: any): any => ({
  name: data?.name,
  gifter: data?.gifter,
  gifterDisplayName: data?.gifterDisplayName,
})

export const transformChatSubUpgradeInfo = (data: any): any => ({
  userId: data?.userId,
  displayName: data?.displayName,
  plan: data?.plan,
})

export const transformChatRaidInfo = (data: any): any => ({
  displayName: data?.displayName,
  viewerCount: data?.viewerCount,
})

export const transformChatSubInfo = (data: any): any => ({
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

export const transformChatSubOriginalGiftInfo = (data: any): any => ({
  anonymous: data?.anonymous,
  userId: data?.userId,
  userName: data?.userName,
  userDisplayName: data?.userDisplayName,
  duration: data?.duration,
  redeemedMonth: data?.redeemedMonth,
})

export const transformChatRewardGiftInfo = (data: any): any => ({
  domain: data?.domain,
  count: data?.count,
  gifterId: data?.gifterId,
  gifterDisplayName: data?.gifterDisplayName,
  gifterGiftCount: data?.gifterGiftCount,
  triggerType: data?.triggerType,
})

export const transformChatRitualInfo = (data: any): any => ({
  ritualName: data?.ritualName,
  message: data?.message,
})

export const transformChatStandardPayForwardInfo = (data: any): any => ({
  userId: data?.userId,
  displayName: data?.displayName,
  recipientUserId: data?.recipientUserId,
  recipientDisplayName: data?.recipientDisplayName,
  originalGifterUserId: data?.originalGifterUserId,
  originalGifterDisplayName: data?.originalGifterDisplayName,
})

export const transformChatSubExtendInfo = (data: any): any => ({
  userId: data?.userId,
  displayName: data?.displayName,
  plan: data?.plan,
  months: data?.months,
  endMonth: data?.endMonth
})

export const transformChatSubGiftInfo = (data: any): any => ({
  ...transformChatSubInfo(data),
  gifter: data?.gifter,
  gifterUserId: data?.gifterUserId,
  gifterDisplayName: data?.gifterDisplayName,
  gifterGiftCount: data?.gifterGiftCount,
  giftDuration: data?.giftDuration
})

export const transformWhisper = (data: any): any => ({
  userInfo: transformChatUser(data?.userInfo),
  target: data?.target,
  text: data?.text,
  emoteOffsets: Object.fromEntries(data?.gifterGiftCount),
})

export const transformClearMsg = (data: any): any => ({
  date: data?.date?.toISOString(),
  userName: data?.userName,
  channelId: data?.channelId,
  targetMessageId: data?.targetMessageId,
})