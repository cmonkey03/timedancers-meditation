# Background Behavior & Multitasking Improvements

## Audio & Notifications in Background

### Current Implementation

The app now properly handles audio and notifications when the app is closed or locked:

1. **Background Audio Support**

   - Configured with `playsInSilentMode: true` - audio plays even when device is in silent mode
   - `shouldPlayInBackground: true` - audio continues when app goes to background
   - iOS `UIBackgroundModes: ["audio", "fetch"]` - proper background modes configured
   - Android permissions for background execution

2. **Notification System**

   - Local notifications scheduled for all phase transitions and session completion
   - Works when app is closed, locked, or in background
   - Uses `expo-notifications` with proper iOS and Android channel configuration
   - High importance notifications with sound and vibration
   - Lockscreen visibility enabled for Android

3. **Cold Start Cleanup**

   - Removes stale notifications when app is restarted
   - Checks session end time and cancels expired notifications
   - Prevents notification spam after app crashes or device restart

## Keyboard Navigation Support

### Web Platform

Added comprehensive keyboard navigation for web users:

1. **Keyboard-Aware Components**

   - All buttons support Enter and Space key activation
   - Proper tab navigation order
   - Focus management hooks
   - Keyboard event handling

2. **Custom Hooks**

   - `useKeyboardNavigation()` - Global keyboard state and focus management
   - `useKeyboardAccessible()` - Easy keyboard support for components
   - Focus trapping for modals (can be extended)

3. **Accessibility Improvements**

   - All interactive elements have proper `accessibilityRole`
   - Keyboard activation works with screen readers
   - Focus indicators for keyboard navigation

## Multitasking Behavior

### App State Management

1. **Background Handler**

   - Detects when app goes to background during meditation
   - Automatically schedules notifications for remaining session
   - Cancels notifications when app returns to foreground
   - Proper cleanup of audio resources

2. **Memory Management**

   - Releases audio resources when app is backgrounded
   - Cleans up timers and intervals
   - Proper state restoration on foreground

3. **Platform-Specific Behavior**

   - **iOS**: Uses background audio mode, stays active during meditation
   - **Android**: Uses foreground service implications, proper notification channels
   - **Web**: Uses Page Visibility API for background detection

## Configuration Updates

### iOS Info.plist

```xml
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
  <string>fetch</string>
</array>
<key>UIRemoteNotificationTypes</key>
<array>
  <string>alert</string>
  <string>badge</string>
  <string>sound</string>
</array>
```

### Android Permissions

```xml
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>
```

## Testing Recommendations

### Background Audio Testing

1. Start a meditation session
2. Lock the device while timer is running
3. Verify chimes play at phase transitions
4. Check completion notification when session ends

### Background Notification Testing

1. Start a meditation session
2. Close the app completely
3. Wait for phase transition or completion
4. Verify notification appears with sound
5. Tap notification to return to app

### Keyboard Navigation Testing

1. Open app in web browser
2. Use Tab key to navigate between elements
3. Use Enter/Space to activate buttons
4. Test with screen reader enabled

### Multitasking Testing

1. Start meditation session
2. Switch to another app
3. Return to meditation app
4. Verify timer state is correct
5. Check notifications were handled properly

## Known Limitations

1. **iOS Background Audio Limitations**

   - iOS may kill background audio after extended periods
   - System sounds may interrupt meditation audio
   - Depends on user's background app refresh settings

2. **Android Doze Mode**

   - Some Android devices aggressively optimize battery
   - May affect background notification timing
   - Exact alarm permissions help but not guaranteed

3. **Web Platform**

   - Web browsers have different background policies
   - Audio may be paused by browser when tab is inactive
   - Notifications require user permission

## Future Enhancements

1. **Background Location** (if needed for outdoor meditation)

2. **Bluetooth Audio** - Better support for external speakers

3. **Widget Support** - Quick meditation start from home screen

4. **Watch Integration** - Apple Watch/Android Wear companion

5. **CarPlay/Android Auto** - Meditation while driving (as passenger)

## User Settings

Users can control background behavior in Settings:

- **Allow Background Alerts**: Toggle notification system
- **Alert Mode**: Choose between chime, vibration, or silent
- **Chime Volume**: Adjust volume for background alerts

The app respects user preferences and system settings for optimal experience.
