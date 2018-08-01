const axios = require('axios')
const iconv = require('iconv-lite')
const qs = require('qs')

// ----------------From qs-iconv-----------------------------
function encodeChar (char) {
  // From http://www.hjp.at/doc/rfc/rfc3986.html#sec_2.3
  //
  //  ... %41-%5A and %61-%7A), DIGIT (%30-%39), hyphen (%2D), period (%2E),
  //      underscore (%5F), or tilde (%7E) should not be created by URI
  //      producers and, when found in a URI, should be decoded to their
  //      corresponding unreserved characters by URI normalizers.
  if (
    (char >= 0x41 && char <= 0x5a) ||
    (char >= 0x61 && char <= 0x7a) ||
    (char >= 0x30 && char <= 0x39) ||
    char === 0x2d ||
    char === 0x2e ||
    char === 0x5f ||
    char === 0x7e
  ) {
    return String.fromCharCode(char)
  }
  if (char < 0x10) {
    return '%0' + char.toString(16).toUpperCase()
  }
  return '%' + char.toString(16).toUpperCase()
}

function encoder (codec) {
  return function (bufferOrString) {
    if (bufferOrString.length === 0) {
      return ''
    }
    var encodedBuffer = iconv.encode(bufferOrString, codec)
    var result = []
    for (var i = 0; i < encodedBuffer.length; i++) {
      result.push(encodeChar(encodedBuffer.readUInt8(i)))
    }
    return result.join('')
  }
}
// ---------------------------------------------

let patt1 = /<center[\s\S]*?\/center>/
let patt2 = /<tr bgcolor='.+?'>\s*<td align=center><font color="red">.+?<\/font>\s*<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>(.+?)<\/td>\s*<td align=center>.+?<\/td>/g
// id name gender university major elementary junior

function extractData (text) {
  text = patt1.exec(text)[0]
  let parts = []
  let r = true
  while (r) {
    parts.push(r)
    r = patt2.exec(text)
  }
  parts.splice(0, 1)
  return parts.map(p => ({
    id: p[1],
    name: p[2],
    gender: p[3],
    university: p[4],
    major: p[5],
    elementary: p[6],
    junior: p[7]
  }))
}

export default async function (topic, keyword) {
  let data = qs.stringify(
    { topic: topic.toString(), key: keyword, Submit2: '搜索' },
    { encoder: encoder('gbk') }
  )
  let resp = await axios.post(
    'http://go.dist.pub/gklq.ntzx.cn/find.asp',
    data,
    {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'arraybuffer'
    }
  )
  let text = iconv.decode(Buffer.from(resp.data), 'gbk')
  let rcs = extractData(text)
  rcs.forEach(cleanRecord)
  return rcs
}

var RecordPipes = []
function registerRecordPipe (fn) {
  RecordPipes.push(fn)
}

function cleanRecord (rc) {
  for (let fn of RecordPipes) {
    fn(rc)
  }
}

registerRecordPipe(rc => {
  let patt = /(^\s*)|(\s*$)/g
  for (let key in rc) {
    rc[key] = rc[key].replace(patt, '')
  }
})

registerRecordPipe(rc => {
  if (rc.gender !== '男' && rc.gender !== '女') {
    rc.gender = ''
  }
})

registerRecordPipe(rc => {
  if (rc.major === '1') {
    rc.major = ''
  }
})

registerRecordPipe(rc => {
  if (rc.elementary === '1' || rc.elementary === '55') {
    rc.elementary = ''
  }
})

registerRecordPipe(rc => {
  if (rc.junior === '1' || rc.junior === '55') {
    rc.junior = ''
  }
})
