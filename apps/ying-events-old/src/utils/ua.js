import UAParser from 'ua-parser-js'
import { eq } from 'lodash'
export const getBrowserInfo = () =>
  new UAParser().setUA(navigator.userAgent).getResult()
export const getOsName = () => (getBrowserInfo()?.os?.name ?? '').toLowerCase()
export const getUaName = () => (getBrowserInfo()?.ua ?? '').toLowerCase()
export const getDeviceName = () =>
  (getBrowserInfo()?.device?.type ?? '').toLowerCase()

export const isIos = () => {
  return eq(getOsName(), 'ios')
}
