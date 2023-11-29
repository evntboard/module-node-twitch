import { MODULE_CODE } from '../constant'
import { transformPubSubBitsMessage, transformPubSubRedemptionMessage } from '../transform'

export async function twitchPubSubListen(twitchPubSubInstance, currentUser, serverAndClient) {

  // Fires when a user redeems channel points
  await twitchPubSubInstance?.onRedemption(
    currentUser.userId,
    (msg) => {
      serverAndClient.notify('event.new', {
        name: `${MODULE_CODE}-channel-point`,
        payload: transformPubSubRedemptionMessage(msg)
      })
    }
  )

  await twitchPubSubInstance?.onBits(
    currentUser.userId,
    (msg) => {
      serverAndClient.notify('event.new', {
        name: `${MODULE_CODE}-bits`,
        payload: transformPubSubBitsMessage(msg),
      })
    }
  )

}