/**
 * @file: types.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

// note(eric): types definition mimics firebase messaging for react-native:
// https://rnfirebase.io/reference/messaging/remotemessage

/**
 * The `RemoteMessage` interface describes an outgoing & incoming message from the remote FCM server.
 */
export interface RemoteMessage {
  /**
   * The collapse key a message was sent with. Used to override existing messages with the same
   * key.
   */
  collapseKey?: string;

  /**
   * A unique ID assigned to every message.
   *
   * If not provided, a random unique ID is generated.
   */
  messageId?: string;

  /**
   * The message type of the message.
   */
  messageType?: string;
  /**
   * The topic name or message identifier.
   */
  from?: string;
  /**
   * The address for the message.
   */
  to?: string;

  /**
   * The time to live for the message in seconds.
   *
   * Defaults to 3600.
   */
  ttl?: number;

  /**
   * The time the message was sent, in milliseconds since the start of unix epoch
   */
  sentTime?: number;

  /**
   * Any additional data sent with the message.
   */
  data?: { [key: string]: string };

  /**
   * Additional Notification data sent with the message
   */
  notification?: Notification;

  /**
   * Whether the iOS APNs message was configured as a background update notification.
   *
   * @platform ios iOS
   */
  contentAvailable?: boolean;

  /**
   * Whether the iOS APNs `mutable-content` property on the message was set
   * allowing the app to modify the notification via app extensions.
   *
   * @platform ios iOS
   */
  mutableContent?: boolean;

  /**
   * The iOS category this notification is assigned to.
   *
   * @platform ios iOS
   */
  category?: string;

  /**
   * An iOS app specific identifier used for notification grouping.
   */
  threadId?: string;
}

export interface Notification {
  /**
   * The notification title.
   */
  title?: string;

  /**
   * The native localization key for the notification title.
   */
  titleLocKey?: string;

  /**
   * Any arguments that should be formatted into the resource specified by titleLocKey.
   */
  titleLocArgs?: string[];

  /**
   * The notification body content.
   */
  body?: string;

  /**
   * The native localization key for the notification body content.
   */
  bodyLocKey?: string;

  /**
   * Any arguments that should be formatted into the resource specified by bodyLocKey.
   */
  bodyLocArgs?: string[];

  ios?: {
    /**
     * The notification's subtitle.
     */
    subtitle?: string;

    /**
     * The native localization key for the notification's subtitle.
     */
    subtitleLocKey?: string;

    /**
     * Any arguments that should be formatted into the resource specified by subtitleLocKey.
     */
    subtitleLocArgs?: string[];

    /**
     * The value of the badge on the home screen app icon.
     * If not specified, the badge is not changed.
     * If set to 0, the badge has been removed.
     */
    badge?: string;

    /**
     * The sound played when the notification was delivered on the device (if permissions permit).
     */
    sound?: string | NotificationIOSCriticalSound;
  };

  /**
   * Additional Android specific properties set on the notification.
   */
  android?: {
    /**
     * The sound played when the notification was delivered on the device (channel settings permitted).
     *
     * Set as "default" if the default device notification sound was used.
     */
    sound?: string;

    /**
     * The channel ID set on the notification. If not set, the notification uses the default
     * "Miscellaneous" channel set by FCM.
     */
    channelId?: string;

    /**
     * The custom color used to tint the notification content.
     */
    color?: string;

    /**
     * The custom small icon used to display on the notification. If not set, uses the default
     * application icon defined in the AndroidManifest file.
     */
    smallIcon?: string;

    /**
     * The custom image was provided and displayed in the notification body.
     */
    imageUrl?: string;

    /**
     * Deep link URL provided to the notification.
     */
    link?: string;

    /**
     * The current unread notification count for this application, managed by the device.
     */
    count?: number;

    /**
     * Name of the click action set on the notification.
     */
    clickAction?: string;

    /**
     * The notification priority.
     *
     * Note; on devices which have channel support (Android 8.0 (API level 26) +),
     * this value will be ignored. Instead, the channel "importance" level is used.
     */
    priority?: NotificationAndroidPriority;

    /**
     * Ticker text set on the notification.
     *
     * Ticker text is used for devices with accessibility enabled (e.g. to read out the message).
     */
    ticker?: string;

    /**
     * The visibility of a notification. This value determines how the notification is shown on the users
     * devices (e.g. on the lock-screen).
     */
    visibility?: NotificationAndroidVisibility;
  };
}

/**
 * Represents a critical sound configuration that can be included in the
 * `aps` dictionary of an APNs payload.
 */
export interface NotificationIOSCriticalSound {
  /**
   * The critical alert flag. Set to `true` to enable the critical alert.
   */
  critical?: boolean;

  /**
   * The name of a sound file in the app's main bundle or in the `Library/Sounds`
   * folder of the app's container directory. Specify the string "default" to play
   * the system sound.
   */
  name: string;

  /**
   * The volume for the critical alert's sound. Must be a value between 0.0
   * (silent) and 1.0 (full volume).
   */
  volume?: number;
}

/**
 * The enum representing a notification priority.
 *
 * Note; on devices which have channel support (Android 8.0 (API level 26) +),
 * this value will be ignored. Instead, the channel "importance" level is used.
 *
 * Example:
 *
 * ```js
 * firebase.messaging.NotificationAndroidPriority.PRIORITY_MIN;
 * ```
 */
export enum NotificationAndroidPriority {
  /**
     The application small icon will not show up in the status bar, or alert the user. The notification
     will be in a collapsed state in the notification shade and placed at the bottom of the list.
     */
  PRIORITY_MIN = -2,

  /**
   * The application small icon will show in the device status bar, however the notification will
   * not alert the user (no sound or vibration). The notification will show in it's expanded state
   * when the notification shade is pulled down.
   */
  PRIORITY_LOW = -1,

  /**
   * When a notification is received, the device smallIcon will appear in the notification shade.
   * When the user pulls down the notification shade, the content of the notification will be shown
   * in it's expanded state.
   */
  PRIORITY_DEFAULT = 0,

  /**
   * Notifications will appear on-top of applications, allowing direct interaction without pulling
   * own the notification shade. This level is used for urgent notifications, such as
   * incoming phone calls, messages etc, which require immediate attention.
   */
  PRIORITY_HIGH = 1,

  /**
   * The priority highest level a notification can be set at.
   */
  PRIORITY_MAX = 2,
}

/**
 * The enum representing the visibility of a notification.
 *
 * Example:
 *
 * ```js
 * firebase.messaging.NotificationAndroidVisibility.VISIBILITY_SECRET;
 * ```
 */
export enum NotificationAndroidVisibility {
  /**
   * Do not reveal any part of this notification on a secure lock-screen.
   */
  VISIBILITY_SECRET = -1,

  /**
   * Show this notification on all lock-screens, but conceal sensitive or private information on secure lock-screens.
   */
  VISIBILITY_PRIVATE = 0,

  /**
   * Show this notification in its entirety on all lock-screens.
   */
  VISIBILITY_PUBLIC = 1,
}
