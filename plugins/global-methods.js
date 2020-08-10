export default ({ store, app }, inject) => {
  // /////////////////////////////////////////////////////////////////// Slugify
  // ----------------------- Options: 'dash', 'underscore', 'underscore-no-trim'
  inject('slugify', (text, type) => {
    if (type) {
      if (type === 'dash') {
        return text.toString().toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/[^\w-]+/g, '') // Remove all non-word chars
          .replace(/--+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
      } else if (type === 'underscore') {
        return text.toString().toLowerCase()
          .replace(/\s+/g, '_') // Replace spaces with _
          .replace(/[^\w_]+/g, '') // Remove all non-word chars
          .replace(/__+/g, '_') // Replace multiple _ with single _
          .replace(/^_+/, '') // Trim _ from start of text
          .replace(/_+$/, '') // Trim _ from end of text
      } else if (type === 'underscore-no-trim') {
        return text.toString().toLowerCase()
          .replace(/\s+/g, '_') // Replace spaces with _
          .replace(/[^\w_]+/g, '') // Remove all non-word chars
          .replace(/__+/g, '_') // Replace multiple _ with single _
      } else {
        return 'Incompatible "Type" specified. Must be type "dash", "underscore", or "underscore-no-trim". Default is "dash"'
      }
    } else {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
    }
  })
  // /////////////////////////////////////////////////////////////// Parse a URL
  // ----------------- https://www.abeautifulsite.net/parsing-urls-in-javascript
  inject('parseURL', (url) => {
    const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
    const urlBreakdown = {}
    let hostname = null
    let domain = null
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
      hostname = match[2]
    }
    const urlParts = hostname.split('.').reverse()
    if (urlParts != null && urlParts.length > 1) {
      domain = urlParts[1] + '.' + urlParts[0]
      if (hostname.toLowerCase().includes('.co.uk') !== -1 && urlParts.length > 2) {
        domain = urlParts[2] + '.' + domain
      }
    }
    urlBreakdown.hostname = hostname
    urlBreakdown.domain = domain
    return urlBreakdown
  })
  // ////////////////////////////////////////////////////// Throttle From Lodash
  // ---------------------------------------------------------------------------
  inject('throttle', (func, wait, options) => {
    let context
    let args
    let result
    let timeout = null
    let previous = 0
    if (!options) { options = {} }
    const later = function () {
      previous = options.leading === false ? 0 : Date.now()
      timeout = null
      result = func.apply(context, args)
      if (!timeout) { context = args = null }
    }
    return function () {
      const now = Date.now()
      if (!previous && options.leading === false) { previous = now }
      const remaining = wait - (now - previous)
      context = this
      args = arguments
      if (remaining <= 0 || remaining > wait) {
        if (timeout) { clearTimeout(timeout); timeout = null }
        previous = now
        result = func.apply(context, args)
        if (!timeout) { context = args = null }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining)
      } return result
    }
  })
  // ///////////////////////////////////////// Check if Element contains a class
  // ---------------------------------------------------------------------------
  inject('hasClass', (element, className) => {
    if (element.classList) { return element.classList.contains(className) }
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className)
  })
  // ///////////////////////////////////////////// If on iOS, return the version
  // ----------------------- supports iOS 2.0 and later -- https://bit.ly/TJjs1V
  inject('iOSversion', (element, className) => {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
      return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
    }
    return false
  })
  // ////////////////////////////// Add class to NodeList staggered sequentially
  // ---------------------------------------------------------------------------
  inject('staggeredAddClass', (elements, className, offset, next) => {
    const len = elements.length - 1
    let num = 0
    const interval = setInterval(() => {
      const item = elements[num] ? elements[num].$el || elements[num] : null
      if (!item) {
        clearInterval(interval)
        if (next) { return next() }
      } else {
        item.classList.add(className)
      }
      if (num === len) {
        clearInterval(interval)
        if (next) { return next() }
      }
      num++
    }, offset)
  })
  // ////////////////// Get the time from a timestamp in "22 seconds ago" format
  // ---------------------------------------------------------------------------
  inject('timeago', (timestamp) => {
    const now = new Date()
    const secondsPast = (now.getTime() - timestamp.getTime()) / 1000
    if (secondsPast === 1) { return Math.floor(parseInt(secondsPast)) + ' second ago' }
    if (secondsPast < 60) { return Math.floor(parseInt(secondsPast)) + ' seconds ago' }
    if (secondsPast === 60) { return Math.floor(parseInt(secondsPast / 60)) + ' minute ago' }
    if (secondsPast < 3600) { return Math.floor(parseInt(secondsPast / 60)) + ' minutes ago' }
    if (secondsPast === 3600) { return Math.floor(parseInt(secondsPast / 3600)) + ' hour ago' }
    if (secondsPast < 86400) { return Math.floor(parseInt(secondsPast / 3600)) + ' hours ago' }
    if (secondsPast < 172800) { return Math.floor(parseInt(secondsPast / 86400)) + ' day ago' }
    if (secondsPast > 86400) { return Math.floor(parseInt(secondsPast / 86400)) + ' days ago' }
    return timestamp
  })
  // /////////////////////////////////////////////////////////// Parse Video URL
  // ---------------------------------- https://gist.github.com/yangshun/9892961
  inject('parseVideoUrl', (url) => {
    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/)
    const parsed = new URL(url)
    let type = ''
    if (RegExp.$3.includes('youtu')) { type = 'youtube' }
    if (RegExp.$3.includes('vimeo')) { type = 'vimeo' }
    return { type, id: RegExp.$6, time: parsed.searchParams.get('t') }
  })
  // //////////////////////////////// Get the height of the entire page Document
  // ---------------------------------------------------------------------------
  inject('getDocHeight', () => {
    const D = document
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    )
  })
  // /////////////////////////////// Capitalize first letters of words in string
  // ---------------------------------------------------------------------------
  /**
    * Capitalizes .
    * @param {string} str String to be modified
    * @param {boolean=false} lower Whether all other letters should be lowercased
    * @return {string}
    * @usage
    *   capitalize('fix this string');     // -> 'Fix This String'
    *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
    *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
    */
  inject('capitalize', (str, lower = false) => {
    return (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
  })
}
