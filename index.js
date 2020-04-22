#!/usr/bin/env node

const keypress = require('keypress')

const speed = 300
const max = 9
let slotNumber = 1
let slotNumbers = []
let slotPart = 1
let score = 0
let timeId

function startSlot () {
  console.log(slotNumber)
  slotNumber++
  if (slotNumber > max) {
    slotNumber = 1
  }
  timeId = setTimeout(function () { startSlot() }, speed)
  if (slotPart === 4) {
    clearTimeout(timeId)
  }
};

function stopSlot () {
  const slotTime = slotNumbers.length + 1
  console.log('Stop!')
  console.log(`${slotTime}番目の数字: ${slotNumber}`)
  slotNumbers.push(slotNumber)
  console.log(slotNumbers)
  if (slotNumbers.length === 3) {
    clearTimeout(timeId)
    gameScore()
    gameContinue()
  }
}

function enterEvent () {
  process.stdin.removeAllListeners('keypress')
  process.stdin.on('keypress', function (ch, key) {
    if (key.name === 'enter') {
      stopSlot()
      timeId = null
    }
  })
}

function gameContinue () {
  slotNumbers = []
  if (slotPart === 4) {
    console.log(`あなたの総合点数は ${score} 点です`)
    if (score >= 150) {
      console.log('スロットマスターレベル: 3(MAX)')
      console.log('満点！！！あなたは最強のスロットマスターです。')
    } else if (score >= 100) {
      console.log('スロットマスターレベル: 2')
      console.log('後もう少しで最強のスロットマスターになれます！')
    } else if (score >= 50) {
      console.log('スロットマスターレベル: 1')
      console.log('スロットマスターへの一歩を踏み出しましたね。')
    } else {
      console.log('スロットマスターレベル: 0')
      console.log('そういうこともありますよ。')
    }
    process.exit()
  } else {
    console.log('ゲーム再開(Enterキーを入力)')
  }
  process.stdin.removeAllListeners('keypress')
  process.stdin.on('keypress', function (ch, key) {
    if (key.name === 'enter') {
      if (slotPart <= 3) {
        startSlot()
        enterEvent()
      }
    }
  })
}

function gameScore () {
  slotPart += 1
  const limiteCount = 4 - slotPart
  const resultSet = new Set(slotNumbers)
  const result = Array.from(resultSet)
  if (result.length === 1) {
    console.log('すごい！おめでとう！')
    score += 50
  } else if (result.length === 2) {
    console.log('惜しい！')
    score += 25
  } else if (result.length === 3) {
    console.log('残念')
    score += 0
  }
  if (slotPart !== 4) {
    console.log(`トータル点数: ${score} `)
    console.log(`残り${limiteCount}回遊べます`)
  }
}

function main () {
  console.log('スロットゲームの遊び方: 流れてくる数字をタイミングよくEnterを押して揃えましょう！！(Enterでゲーム開始)')
  console.log('最大3回まで遊べます。150点満点を目指して頑張りましょう！')
  keypress(process.stdin)
  process.stdin.on('keypress', function (ch, key) {
    if (key.name === 'enter') {
      console.log('ゲームスタート!!!!')
      startSlot()
      enterEvent()
    }
  })
  process.stdin.resume()
}

main()
