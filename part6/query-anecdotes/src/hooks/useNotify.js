import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotify = () => {
  return useContext(NotificationContext)
}