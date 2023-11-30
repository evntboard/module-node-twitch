import {EventSubWsListener} from '@twurple/eventsub-ws'

import {TokenInfo} from "@twurple/auth";
import {JSONRPCServerAndClient} from "json-rpc-2.0";

import {MODULE_CODE} from '../constant'

export async function twitchEventSubListen(twitchEventSubListenerInstance: EventSubWsListener, currentUser: TokenInfo, serverAndClient: JSONRPCServerAndClient) {

  if (!currentUser?.userId) {
    throw new Error('Token have no userId set !')
  }

  // Fires when broadcast start
  twitchEventSubListenerInstance.onStreamOnline(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-stream-online`,
      payload: {
        id: msg.id,
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        startDate: msg.startDate.toISOString(),
        type: msg.type,
      }
    })
  })

  // Fires when broadcast stop
  twitchEventSubListenerInstance.onStreamOffline(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-stream-offline`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelUpdate(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-update`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        stream: {
          title: msg.streamTitle,
          language: msg.streamLanguage,
          isMature: msg.isMature
        },
        category: {
          id: msg.categoryId,
          name: msg.categoryName,
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelFollow(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-follow`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        followDate: msg.followDate.toISOString()
      }
    })
  })

  twitchEventSubListenerInstance.onChannelSubscription(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        isGift: msg.isGift,
        tier: msg.tier
      }
    })
  })

  twitchEventSubListenerInstance.onChannelSubscriptionGift(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription-gift`,
      payload: {
        gifter: {
          id: msg.gifterId,
          name: msg.gifterName,
          displayName: msg.gifterDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        isAnonymous: msg.isAnonymous,
        amount: msg.amount,
        cumulativeAmount: msg.cumulativeAmount,
        tier: msg.tier
      }
    })
  })

  twitchEventSubListenerInstance.onChannelSubscriptionMessage(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription-message`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        tier: msg.tier,
        cumulativeMonths: msg.cumulativeMonths,
        durationMonths: msg.durationMonths,
        streakMonths: msg.streakMonths,
        emoteOffsets: msg.emoteOffsets.entries(),
        messageText: msg.messageText,
      }
    })
  })

  twitchEventSubListenerInstance.onChannelSubscriptionEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription-end`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        tier: msg.tier,
        isGift: msg.isGift,
      }
    })
  })

  twitchEventSubListenerInstance.onChannelCheer(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-cheer`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        isAnonymous: msg.isAnonymous,
        message: msg.message,
        bits: msg.bits,
      }
    })
  })

  twitchEventSubListenerInstance.onChannelHypeTrainBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-hype-train-begin`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate.toISOString(),
        expiryDate: msg.expiryDate.toISOString(),
        level: msg.level,
        total: msg.total,
        progress: msg.progress,
        goal: msg.goal,
        lastContribution: {
          user: {
            id: msg.lastContribution.userId,
            name: msg.lastContribution.userName,
            displayName: msg.lastContribution.userDisplayName
          },
          type: msg.lastContribution.type,
          total: msg.lastContribution.total
        },
        topContributors: msg.topContributors
          .map((d) => ({
            user: {
              id: d.userId,
              name: d.userName,
              displayName: d.userDisplayName
            },
            type: d.type,
            total: d.total
          })),
      }
    })
  })

  twitchEventSubListenerInstance.onChannelHypeTrainProgress(currentUser.userId, (msg) => {
    const {} = msg
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-hype-train-progress`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate.toISOString(),
        expiryDate: msg.expiryDate.toISOString(),
        level: msg.level,
        total: msg.total,
        progress: msg.progress,
        goal: msg.goal,
        lastContribution: {
          user: {
            id: msg.lastContribution.userId,
            name: msg.lastContribution.userName,
            displayName: msg.lastContribution.userDisplayName
          },
          type: msg.lastContribution.type,
          total: msg.lastContribution.total
        },
        topContributors: msg.topContributors
          .map((d) => ({
            user: {
              id: d.userId,
              name: d.userName,
              displayName: d.userDisplayName
            },
            type: d.type,
            total: d.total
          })),
      }
    })
  })

  twitchEventSubListenerInstance.onChannelHypeTrainEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-hype-train-end`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate.toISOString(),
        cooldownEndDate: msg.cooldownEndDate.toISOString(),
        endDate: msg.endDate.toISOString(),
        level: msg.level,
        total: msg.total,
        topContributors: msg.topContributors
          .map((d) => ({
            user: {
              id: d.userId,
              name: d.userName,
              displayName: d.userDisplayName
            },
            type: d.type,
            total: d.total
          })),
      }
    })
  })

  twitchEventSubListenerInstance.onChannelBan(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-ban`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        moderator: {
          id: msg.moderatorId,
          name: msg.moderatorName,
          displayName: msg.moderatorDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        startDate: msg.startDate?.toISOString(),
        endDate: msg.endDate?.toISOString(),
        reason: msg.reason,
        isPermanent: msg.isPermanent
      }
    })
  })

  twitchEventSubListenerInstance.onChannelUnban(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-unban`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        moderator: {
          id: msg.moderatorId,
          name: msg.moderatorName,
          displayName: msg.moderatorDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelModeratorAdd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-moderator-add`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelModeratorRemove(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-moderator-remove`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPollBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-poll-begin`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate?.toISOString(),
        endDate: msg.endDate?.toISOString(),
        title: msg.title,
        choices: msg.choices.map((d) => ({id: d.id, title: d.title})),
        isBitsVotingEnabled: msg.isBitsVotingEnabled,
        bitsPerVote: msg.bitsPerVote,
        isChannelPointsVotingEnabled: msg.isChannelPointsVotingEnabled,
        channelPointsPerVote: msg.channelPointsPerVote,
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPollProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-poll-progress`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate?.toISOString(),
        endDate: msg.endDate?.toISOString(),
        title: msg.title,
        choices: msg.choices.map((d) => ({id: d.id, title: d.title})),
        isBitsVotingEnabled: msg.isBitsVotingEnabled,
        bitsPerVote: msg.bitsPerVote,
        isChannelPointsVotingEnabled: msg.isChannelPointsVotingEnabled,
        channelPointsPerVote: msg.channelPointsPerVote,
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPollEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-poll-end`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate?.toISOString(),
        endDate: msg.endDate?.toISOString(),
        title: msg.title,
        status: msg.status,
        choices: msg.choices.map((d) => ({id: d.id, title: d.title})),
        isBitsVotingEnabled: msg.isBitsVotingEnabled,
        bitsPerVote: msg.bitsPerVote,
        isChannelPointsVotingEnabled: msg.isChannelPointsVotingEnabled,
        channelPointsPerVote: msg.channelPointsPerVote,
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPredictionBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-begin`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate?.toISOString(),
        lockDate: msg.lockDate?.toISOString(),
        title: msg.title,
        outcomes: msg.outcomes.map((d) => ({
          id: d.id,
          title: d.title,
          color: d.color
        }))
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPredictionProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-progress`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        startDate: msg.startDate?.toISOString(),
        lockDate: msg.lockDate?.toISOString(),
        title: msg.title,
        outcomes: msg.outcomes.map((d) => ({
          id: d.id,
          title: d.title,
          color: d.color
        }))
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPredictionLock(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-lock`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        title: msg.title,
        startDate: msg.startDate?.toISOString(),
        lockDate: msg.lockDate?.toISOString(),
        outcomes: msg.outcomes.map((d) => ({
          id: d.id,
          title: d.title,
          color: d.color
        }))
      }
    })
  })

  twitchEventSubListenerInstance.onChannelPredictionEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-end`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        id: msg.id,
        title: msg.title,
        startDate: msg.startDate?.toISOString(),
        endDate: msg.endDate?.toISOString(),
        status: msg.status,
        winningOutcomeId: msg.winningOutcomeId,
        winningOutcome: {
          id: msg.winningOutcome?.id,
          title: msg.winningOutcome?.title,
          color: msg.winningOutcome?.color,
          users: msg.winningOutcome?.users,
          channelPoints: msg.winningOutcome?.channelPoints,
          topPredictors: msg.winningOutcome?.topPredictors?.map((d) => ({
            user: {
              id: d.userId,
              name: d.userName,
              displayName: d.userDisplayName,
              channelPointsUsed: d.channelPointsUsed,
              channelPointsWon: d.channelPointsWon,
            }
          })),
        },
        outcomes: msg.outcomes.map((d) => ({
          id: d.id,
          title: d.title,
          color: d.color
        }))
      }
    })
  })

  twitchEventSubListenerInstance.onChannelRaidFrom(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-raid-from`,
      payload: {
        raided: {
          id: msg.raidedBroadcasterId,
          name: msg.raidedBroadcasterName,
          displayName: msg.raidedBroadcasterDisplayName
        },
        raiding: {
          id: msg.raidingBroadcasterId,
          name: msg.raidingBroadcasterName,
          displayName: msg.raidingBroadcasterDisplayName,
        },
        viewers: msg.viewers
      }
    })
  })

  twitchEventSubListenerInstance.onChannelRaidTo(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-raid-to`,
      payload: {
        raided: {
          id: msg.raidedBroadcasterId,
          name: msg.raidedBroadcasterName,
          displayName: msg.raidedBroadcasterDisplayName
        },
        raiding: {
          id: msg.raidingBroadcasterId,
          name: msg.raidingBroadcasterName,
          displayName: msg.raidingBroadcasterDisplayName,
        },
        viewers: msg.viewers
      }
    })
  })

  twitchEventSubListenerInstance.onChannelRedemptionAdd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-redemption-add`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        redemption: {
          id: msg.id,
          input: msg.input,
          status: msg.status,
          date: msg.redemptionDate?.toISOString()
        },
        reward: {
          id: msg.rewardId,
          title: msg.rewardTitle,
          cost: msg.rewardCost,
          prompt: msg.rewardPrompt,
        },
      }
    })
  })

  // CANNOT onChannelRedemptionAddForReward cause it's linked to a rewardId

  twitchEventSubListenerInstance.onChannelRedemptionUpdate(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-redemption-update`,
      payload: {
        user: {
          id: msg.userId,
          name: msg.userName,
          displayName: msg.userDisplayName
        },
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        redemption: {
          id: msg.id,
          input: msg.input,
          status: msg.status,
          date: msg.redemptionDate?.toISOString()
        },
        reward: {
          id: msg.rewardId,
          title: msg.rewardTitle,
          cost: msg.rewardCost,
          prompt: msg.rewardPrompt,
        },
      }
    })
  })

  // CANNOT onChannelRedemptionUpdateForReward cause it's linked to a rewardId

  twitchEventSubListenerInstance.onChannelRewardAdd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-reward-add`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        reward: {
          id: msg.id,
          isEnabled: msg.isEnabled,
          isPaused: msg.isPaused,
          isInStock: msg.isInStock,
          title: msg.title,
          cost: msg.cost,
          prompt: msg.prompt,
          userInputRequired: msg.userInputRequired,
          backgroundColor: msg.backgroundColor,
          images: {
            url_1x: msg.getImageUrl(1),
            url_2x: msg.getImageUrl(2),
            url_4x: msg.getImageUrl(4),
          }
        },
        redemption: {
          autoApproved: msg.autoApproved,
          cooldownExpiryDate: msg.cooldownExpiryDate?.toISOString(),
          thisStream: msg.redemptionsThisStream,
          maxPerStream: msg.maxRedemptionsPerStream,
          maxPerUserPerStream: msg.maxRedemptionsPerUserPerStream,
          globalCooldown: msg.globalCooldown,
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelRewardRemove(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-reward-remove`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        reward: {
          id: msg.id,
          isEnabled: msg.isEnabled,
          isPaused: msg.isPaused,
          isInStock: msg.isInStock,
          title: msg.title,
          cost: msg.cost,
          prompt: msg.prompt,
          userInputRequired: msg.userInputRequired,
          backgroundColor: msg.backgroundColor,
          images: {
            url_1x: msg.getImageUrl(1),
            url_2x: msg.getImageUrl(2),
            url_4x: msg.getImageUrl(4),
          }
        },
        redemption: {
          autoApproved: msg.autoApproved,
          cooldownExpiryDate: msg.cooldownExpiryDate?.toISOString(),
          thisStream: msg.redemptionsThisStream,
          maxPerStream: msg.maxRedemptionsPerStream,
          maxPerUserPerStream: msg.maxRedemptionsPerUserPerStream,
          globalCooldown: msg.globalCooldown,
        }
      }
    })
  })

  // CANNOT onChannelRewardRemoveForReward cause it's linked to a rewardId

  twitchEventSubListenerInstance.onChannelRewardUpdate(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-reward-update`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        reward: {
          id: msg.id,
          isEnabled: msg.isEnabled,
          isPaused: msg.isPaused,
          isInStock: msg.isInStock,
          title: msg.title,
          cost: msg.cost,
          prompt: msg.prompt,
          userInputRequired: msg.userInputRequired,
          backgroundColor: msg.backgroundColor,
          images: {
            url_1x: msg.getImageUrl(1),
            url_2x: msg.getImageUrl(2),
            url_4x: msg.getImageUrl(4),
          }
        },
        redemption: {
          autoApproved: msg.autoApproved,
          cooldownExpiryDate: msg.cooldownExpiryDate?.toISOString(),
          thisStream: msg.redemptionsThisStream,
          maxPerStream: msg.maxRedemptionsPerStream,
          maxPerUserPerStream: msg.maxRedemptionsPerUserPerStream,
          globalCooldown: msg.globalCooldown,
        }
      }
    })
  })

  // CANNOT onChannelRewardUpdateForReward cause it's linked to a rewardId

  twitchEventSubListenerInstance.onChannelShoutoutCreate(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-shoutout-create`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        moderator: {
          id: msg.moderatorId,
          name: msg.moderatorName,
          displayName: msg.moderatorDisplayName
        },
        shoutedOutBroadcaster: {
          id: msg.shoutedOutBroadcasterId,
          name: msg.shoutedOutBroadcasterName,
          displayName: msg.shoutedOutBroadcasterDisplayName
        },
        shoutout: {
          viewerCount: msg.viewerCount,
          startDate: msg.startDate?.toISOString(),
          cooldownEndDate: msg.cooldownEndDate?.toISOString(),
          targetCooldownEndDate: msg.targetCooldownEndDate?.toISOString(),
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelShoutoutReceive(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-shoutout-receive`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        shoutingOutBroadcaster: {
          id: msg.shoutingOutBroadcasterId,
          name: msg.shoutingOutBroadcasterName,
          displayName: msg.shoutingOutBroadcasterDisplayName
        },
        shoutout: {
          viewerCount: msg.viewerCount,
          startDate: msg.startDate?.toISOString(),
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelCharityCampaignStart(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-campaign-start`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        charity: {
          name: msg.charityName,
          description: msg.charityDescription,
          logo: msg.charityLogo,
          website: msg.charityWebsite,
        },
        campaign: {
          id: msg.id,
          currentAmount: {
            value: msg.currentAmount.value,
            decimalPlaces: msg.currentAmount.decimalPlaces,
            localizedValue: msg.currentAmount.localizedValue,
            currency: msg.currentAmount.currency,
          },
          targetAmount: {
            value: msg.targetAmount.value,
            decimalPlaces: msg.targetAmount.decimalPlaces,
            localizedValue: msg.targetAmount.localizedValue,
            currency: msg.targetAmount.currency,
          },
          startDate: msg.startDate?.toISOString(),
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelCharityDonation(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-donation`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        charity: {
          name: msg.charityName,
          description: msg.charityDescription,
          logo: msg.charityLogo,
          website: msg.charityWebsite,
        },
        donor: {
          id: msg.donorId,
          name: msg.donorName,
          DisplayName: msg.donorDisplayName,
        },
        amount: {
          value: msg.amount.value,
          decimalPlaces: msg.amount.decimalPlaces,
          localizedValue: msg.amount.localizedValue,
          currency: msg.amount.currency,
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelCharityCampaignProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-campaign-progress`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        charity: {
          name: msg.charityName,
          description: msg.charityDescription,
          logo: msg.charityLogo,
          website: msg.charityWebsite,
        },
        campaign: {
          id: msg.id,
          currentAmount: {
            value: msg.currentAmount.value,
            decimalPlaces: msg.currentAmount.decimalPlaces,
            localizedValue: msg.currentAmount.localizedValue,
            currency: msg.currentAmount.currency,
          },
          targetAmount: {
            value: msg.targetAmount.value,
            decimalPlaces: msg.targetAmount.decimalPlaces,
            localizedValue: msg.targetAmount.localizedValue,
            currency: msg.targetAmount.currency,
          },
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelCharityCampaignStop(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-campaign-stop`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        charity: {
          name: msg.charityName,
          description: msg.charityDescription,
          logo: msg.charityLogo,
          website: msg.charityWebsite,
        },
        campaign: {
          id: msg.id,
          currentAmount: {
            value: msg.currentAmount.value,
            decimalPlaces: msg.currentAmount.decimalPlaces,
            localizedValue: msg.currentAmount.localizedValue,
            currency: msg.currentAmount.currency,
          },
          targetAmount: {
            value: msg.targetAmount.value,
            decimalPlaces: msg.targetAmount.decimalPlaces,
            localizedValue: msg.targetAmount.localizedValue,
            currency: msg.targetAmount.currency,
          },
          endDate: msg.endDate?.toISOString(),
        }
      }
    })
  })

  twitchEventSubListenerInstance.onChannelShieldModeBegin(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-shield-mode-begin`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        moderator: {
          id: msg.moderatorId,
          name: msg.moderatorName,
          displayName: msg.moderatorDisplayName
        },
        startDate: msg.startDate?.toISOString(),
      }
    })
  })

  twitchEventSubListenerInstance.onChannelShieldModeEnd(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-shield-mode-end`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        moderator: {
          id: msg.moderatorId,
          name: msg.moderatorName,
          displayName: msg.moderatorDisplayName
        },
        endDate: msg.endDate?.toISOString(),
      }
    })
  })

  twitchEventSubListenerInstance.onChannelGoalBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-goal-begin`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        goal: {
          id: msg.id,
          type: msg.type,
          description: msg.description,
          currentAmount: msg.currentAmount,
          targetAmount: msg.targetAmount,
          startDate: msg.startDate?.toISOString(),
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelGoalProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-goal-progress`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        goal: {
          id: msg.id,
          type: msg.type,
          description: msg.description,
          currentAmount: msg.currentAmount,
          targetAmount: msg.targetAmount,
          startDate: msg.startDate?.toISOString(),
        },
      }
    })
  })

  twitchEventSubListenerInstance.onChannelGoalEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-goal-end`,
      payload: {
        broadcaster: {
          id: msg.broadcasterId,
          name: msg.broadcasterName,
          displayName: msg.broadcasterDisplayName,
        },
        goal: {
          id: msg.id,
          type: msg.type,
          description: msg.description,
          currentAmount: msg.currentAmount,
          targetAmount: msg.targetAmount,
          startDate: msg.startDate?.toISOString(),
          endDate: msg.endDate?.toISOString(),
        },
      }
    })
  })
}
