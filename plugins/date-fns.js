import Vue from 'vue'

import format from 'date-fns/format'
import formatDistance from 'date-fns/formatDistance'
import formatDistanceStrict from 'date-fns/formatDistanceStrict'
import formatRelative from 'date-fns/formatRelative'
import parseISO from 'date-fns/parseISO'
import ja from 'date-fns/locale/ja'

const options = {
  locale: ja,
  addSuffix: true
}

Vue.filter('date', (date, fmt) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, fmt, options)
})

Vue.filter('dateDistance', (date, baseDate) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  baseDate = baseDate || new Date()
  return formatDistance(date, baseDate, options)
})

Vue.filter('dateDistanceStrict', (date, baseDate) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  baseDate = baseDate || new Date()
  return formatDistanceStrict(date, baseDate, options)
})

Vue.filter('dateRelative', (date, baseDate) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  baseDate = baseDate || new Date()
  return formatRelative(date, baseDate, options)
})
