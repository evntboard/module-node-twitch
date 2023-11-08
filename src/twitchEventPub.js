import { EventSubWsListener } from '@twurple/eventsub-ws'

export function listen(twitchApiInstance, currentUser) {
  const eventSubListener = new EventSubWsListener({ twitchApiInstance });
  eventSubListener.start();

  // Fires when broadcast start
  eventSubListener.onStreamOnline(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-stream-online`,
      payload: msg
    })
  });

    // Fires when broadcast stop
  eventSubListener.onStreamOffline(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-stream-offline`,
      payload: msg
    })
  });

  eventSubListener.onChannelFollow(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-follow`,
      payload: msg
    })
  })

  eventSubListener.onChannelSubscription(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription`,
      payload: msg
    })
  })

  eventSubListener.onChannelSubscriptionGift(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription-gift`,
      payload: msg
    })
  })

  eventSubListener.onChannelSubscriptionMessage(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription-message`,
      payload: msg
    })
  })

  eventSubListener.onChannelSubscriptionEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-subscription-end`,
      payload: msg
    })
  })

  eventSubListener.onChannelCheer(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-cheer`,
      payload: msg
    })
  })

  eventSubListener.onChannelHypeTrainBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-hype-train-begin`,
      payload: msg
    })
  })

  eventSubListener.onChannelHypeTrainProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-hype-train-progress`,
      payload: msg
    })
  })

  eventSubListener.onChannelHypeTrainEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-hype-train-end`,
      payload: msg
    })
  })

  eventSubListener.onChannelBan(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-ban`,
      payload: msg
    })
  })

  eventSubListener.onChannelUnban(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-unban`,
      payload: msg
    })
  })

  eventSubListener.onChannelModeratorAdd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-moderator-add`,
      payload: msg
    })
  })

  eventSubListener.onChannelModeratorRemove(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-moderator-remove`,
      payload: msg
    })
  })

  eventSubListener.onChannelPollBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-poll-begin`,
      payload: msg
    })
  })

  eventSubListener.onChannelPollProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-poll-progress`,
      payload: msg
    })
  })

  eventSubListener.onChannelPollEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-poll-end`,
      payload: msg
    })
  })

  eventSubListener.onChannelPredictionBegin(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-begin`,
      payload: msg
    })
  })

  eventSubListener.onChannelPredictionProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-progress`,
      payload: msg
    })
  })

  eventSubListener.onChannelPredictionLock(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-lock`,
      payload: msg
    })
  })

  eventSubListener.onChannelPredictionEnd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-prediction-end`,
      payload: msg
    })
  })

  eventSubListener.onChannelRaidFrom(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-raid-from`,
      payload: msg
    })
  })

  eventSubListener.onChannelRaidTo(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-raid-to`,
      payload: msg
    })
  })

  eventSubListener.onChannelRedemptionAdd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-redemption-add`,
      payload: msg
    })
  })

  eventSubListener.onChannelRedemptionUpdate(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-redemption-update`,
      payload: msg
    })
  })

  eventSubListener.onChannelRewardAdd(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-reward-add`,
      payload: msg
    })
  })

  eventSubListener.onChannelRewardRemove(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-reward-remove`,
      payload: msg
    })
  })

  eventSubListener.onChannelRewardUpdate(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-reward-update`,
      payload: msg
    })
  })

  eventSubListener.onChannelShoutoutCreate(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-shoutout-create`,
      payload: msg
    })
  })

  eventSubListener.onChannelShoutoutReceive(currentUser.userId, currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-shoutout-receive`,
      payload: msg
    })
  })

  eventSubListener.onChannelCharityCampaignStart(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-campaign-start`,
      payload: msg
    })
  })

  eventSubListener.onChannelCharityDonation(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-donation`,
      payload: msg
    })
  })

  eventSubListener.onChannelCharityCampaignProgress(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-campaign-progress`,
      payload: msg
    })
  })

  eventSubListener.onChannelCharityCampaignStop(currentUser.userId, (msg) => {
    serverAndClient.notify('event.new', {
      name: `${MODULE_CODE}-channel-charity-campaign-stop`,
      payload: msg
    })
  })

}
