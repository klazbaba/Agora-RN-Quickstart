import { ErrorCode, WarningCode } from 'react-native-agora';
import { Platform } from 'react-native';

export default class ErrorHandler extends Error {
  name = 'Custom Error';
  errorCode: ErrorCode | WarningCode = 0;
  message = this.getErrorMessage(this.errorCode) as string;

  getErrorMessage(errorCode: ErrorCode | WarningCode) {
    switch (errorCode) {
      case ErrorCode.Abort:
        return 'The SDK gave up the request due to too many requests.';
      case ErrorCode.AdmGeneralError:
        return 'Audio Device Module: A general error occurs in the Audio Device Module (the reason is not classified specifically). Check if the audio device is used by another app, or try rejoining the channel.';
      case ErrorCode.AdmInitLoopback:
        return 'Audio Device Module: An error occurs in initializing the loopback device.';
      case ErrorCode.AdmInitPlayout:
        return 'Audio Device Module: An error occurs in initializing the playback device.';
      case ErrorCode.AdmInitRecording:
        return 'Audio Device Module: An error occurs in initializing the recording device.';
      case ErrorCode.AdmJavaResource:
        return 'Audio Device Module: An error occurs in using the Java resources.';
      case ErrorCode.AdmNoPermission:
        return 'Audio Device Module: No recording permission.';
      case ErrorCode.AdmNoPlayoutDevice:
        return 'No playback device exists.';
      case ErrorCode.AdmNoRecordingDevice:
        return 'Audio Device Module: No recording device exists.';
      case ErrorCode.AdmPlayAbnormalFrequency:
        return 'Audio device module: The audio playback frequency is abnormal, which may cause audio freezes. This abnormality is caused by high CPU usage. Agora recommends stopping other apps.';
      case ErrorCode.AdmRecordAbnormalFrequency:
        return 'Audio device module: The audio recording frequency is abnormal, which may cause audio freezes. This abnormality is caused by high CPU usage. Agora recommends stopping other apps.';
      case ErrorCode.AdmRecordAudioFailed:
        return 'Audio Device Module: Fails to record.';
      case WarningCode.AdmCategoryNotPlayAndRecord:
        return 'During a call, AudioSessionCategory should be set to AVAudioSessionCategoryPlayAndRecord, and the SDK monitors this value. If the AudioSessionCategory is set to other values, this warning code is triggered and the SDK will forcefully set it back to AVAudioSessionCategoryPlayAndRecord.';
      case WarningCode.AdmGlitchState:
        return 'Audio Device Module: The device is in the glitch state.';
      case WarningCode.AdmInconsistentDevices:
        return 'Audio Device Module: The device is in the glitch state.';
      case WarningCode.AdmInterruption:
        return 'Audio Device Module: call is interrupted by system events such as phone call or siri etc.';
      case WarningCode.AdmNoDataReadyCallback:
        return 'Audio device module: An error occurs in the audio driver. Solutions: - Restart your audio device. - Restart your device where the app runs. - Upgrade the sound card drive.';
      case WarningCode.AdmPlaybackMalfunction:
        return 'Audio Device Module: a playback device fails.';
      default:
        'Go to this link to find out about this error: https://docs.agora.io/en/Video/error_rtc?platform=' +
          Platform.OS ===
        'android'
          ? 'Android'
          : 'iOS';
    }
  }
}
