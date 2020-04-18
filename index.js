#!/usr/bin/env node

const keypress = require('keypress');

let speed = 300;
let slot_number = 1;
let slot_numbers = [];
let slot_part = 1;
let score = 0;
var time_id;
const max = 9;

const StartSlot = function(){
    console.log(slot_number);
    slot_number ++;
    if (slot_number > max) {
        slot_number = 1;
    }
    time_id = setTimeout(function() {StartSlot();}, speed);
    if (slot_part == 4) {
        clearTimeout(time_id);
    }
};

function StopSlot() {
    let slot_time = slot_numbers.length + 1;
    console.log("Stop!");
    console.log(slot_time.toString() + "番目の数字:" + slot_number.toString());
    slot_numbers.push(slot_number);
    console.log(slot_numbers);
    if (slot_numbers.length == 3) {
        clearTimeout(time_id);
        GameScore();
        GameContinue();
    }
}

function EnterEvent() {
    process.stdin.removeAllListeners('keypress');
    process.stdin.on('keypress', function(ch, key) {
        if (key.name === 'enter') {
            StopSlot();
            time_id = null;
        }
    }); 
}

function GameContinue() {
    slot_numbers = [];
    if (slot_part == 4 ) {
        console.log("あなたの総合点数は" + score.toString() + "点です");
        if (score >= 150) {
            console.log("満点！！！あなたは最強のスロットマスターです。");
        } else if (score >= 50) {
            console.log("今日は良いことがあるかもしれません");
        } else if (score <= 0) {
            console.log("そういうこともありますよ。");
        }
        process.exit();
    } else {
        console.log("ゲーム再開(Spaceキーを押してからEnter)");
    }
    process.stdin.removeAllListeners('keypress');
    process.stdin.on('keypress', function(ch, key) {
        if (key.name === 'space') {
            if (slot_part <= 3) {
                StartSlot();
                EnterEvent();
            }
        }
    });
}

function GameScore() {
    slot_part += 1;
    let result_set = new Set(slot_numbers);
    let result = Array.from(result_set);
    if (result.length == 1) {
        console.log("すごい！おめでとう！");
        score += 50;
    } else if (result.length == 2) {
        console.log("惜しい！");
        score += 25;
    } else if (result.length == 3){
        console.log("残念");
        score += 0;
    }
}

console.log("ゲームスタート!!!!");
StartSlot();
keypress(process.stdin);
EnterEvent();
process.stdin.resume();
