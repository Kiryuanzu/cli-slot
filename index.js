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
  console.log(slotTime.toString() + '番目の数字:' + slotNumber.toString())
  slotNumbers.push(slotNumber)
  console.log(slotNumber)
  if (slotNumbers.length === 3) {
    clearTimeout(timeId)
    gameScore()
    gameContinue()
  }
}

function enterEvent () {
  process.stdin.removeAllListeners('keypress')
  process.stdin.on('keypress', function (ch, key) {
    if (key !== undefined) {
      if (key.name === 'enter') {
        stopSlot()
        timeId = null
      }
    } else {
      console.log('半角で入力してください')
    }
  })
}

function gameContinue () {
  slotNumbers = []
  if (slotPart === 4) {
    console.log('あなたの総合点数は' + score.toString() + '点です')
    if (score >= 150) {
      console.log('満点！！！あなたは最強のスロットマスターです。')
    } else if (score >= 100) {
      console.log('後もう少しで最強のスロットマスターになれます！')
    } else if (score >= 50) {
      console.log('今日は良いことがあるかもしれません')
    } else if (score <= 0) {
      console.log('そういうこともありますよ。')
    }
    process.exit()
  } else {
    console.log('ゲーム再開(Spaceキーを押してからEnter)')
  }
  process.stdin.removeAllListeners('keypress')
  process.stdin.on('keypress', function (ch, key) {
    if (key !== undefined) {
      if (key.name === 'space') {
        if (slotPart <= 3) {
          startSlot()
          enterEvent()
        }
      }
    } else {
      console.log('半角で入力してください')
    }
  })
}

function gameScore () {
  slotPart += 1
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
}

console.log('スロットゲームの遊び方: 流れてくる数字をタイミングよくEnterを押して揃えましょう！！')
keypress(process.stdin)
process.stdin.on('keypress', function (ch, key) {
  if (key !== undefined) {
    if (key.name === 'enter') {
      console.log('ゲームスタート!!!!')
      startSlot()
      enterEvent()
    }
  } else {
    console.log('半角で入力してください')
  }
})
process.stdin.resume()
