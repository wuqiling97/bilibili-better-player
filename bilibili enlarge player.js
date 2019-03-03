// ==UserScript==
// @name         bilibili better player
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  解决B站新版播放器太小的问题
// @author       You
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/watchlater/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// ==/UserScript==


function setDanmuFontsize(size) {
    var s = JSON.parse(localStorage.bilibili_player_settings);
    s.setting_config.fontsize = size;
    localStorage.bilibili_player_settings = JSON.stringify(s);
}

function isint(n) {
    return parseFloat(n.toFixed(5)) === Math.round(n);
}

function isBigscreen() {
    return screen.width > 1500;
}

Math.clamp = function(val, l, h) {
    (val < l) && (val = l);
    (val > h) && (val = h);
    return val;
};

var isOld = document.querySelector('.bilibili-player-auxiliary-area');
// location: url相关
var isBangumi = location.pathname.indexOf('bangumi') !== -1;
var isWatchlater = location.pathname.indexOf('watchlater') !== -1;
var isNormal = !(isBangumi || isWatchlater);
var noNewplayer = isWatchlater;

if(!isOld && !noNewplayer) {
    // 新版
    var set = JSON.parse(localStorage.bilibili_player_settings);
    console.log('fontsize', set.setting_config.fontsize);
    var fontsize = set.setting_config.fontsize;
    setDanmuFontsize(0.6);
    // if(isBigscreen()) {
    //     setDanmuFontsize(0.8);
    // } else {
    //     setDanmuFontsize(0.6);
    // }

    /*
    高度数据：
    header 50
    标题上方margin 20
    标题 49.1 margin-bottom 16
    弹幕设置 46
    操作 28 padding+border bottom 13 margin-top 16
    up 40 margin: 16 12
    */

    // header, 播放器上方margin, 弹幕设置, 标题, 操作, up
    var eleHeight = [50, 20, 46, 49.1+16, 28+12, 40+16];
    var eleShow =   [1,  1,  1,  1,       1,       0];
    var eleTotHeight = 0;
    for(let i=0; i<eleShow.length; i++) {
        eleTotHeight += eleHeight[i] * eleShow[i];
    }

    if(isNormal) {
        window.setSize = function() {
            eleTotHeight = isBigscreen()? 230.1 : 221.1;

            var isWide = window.isWide
                , rcon_w = 350 // 右侧栏+左右栏margin 320+30
                , height = document.body.offsetHeight
                , width = document.body.offsetWidth
                , thh = parseInt(16 * (height - eleTotHeight) / 9) // 用height限制宽度
                , thw = width - 152 - rcon_w // 用width限制，实为margin+iswide限制
                , d = Math.min(thw, thh);
            d = Math.clamp(d, 638, 1280);
            var w = d + rcon_w
                , h = Math.round((d + (isWide ? rcon_w : 0)) * (9 / 16)) + 46
                , pad = "0 " + (width < w + 152 ? 76 : 0) // margin至少76
                , u = document.querySelector(".stardust-video .bili-wrapper")
                , vwrap = document.querySelector(".v-wrap")
                , bofqi = document.querySelector("#bofqi")
                , dmbox = document.querySelector("#danmukuBox")
                , pwrap = document.querySelector("#playerWrap");
            u && (u.style.width = w + "px", u.style.padding = pad + "px");
            vwrap && (vwrap.style.width = w + "px", vwrap.style.padding = pad + "px");
            bofqi && (bofqi.style.width = w - (isWide ? 0 : rcon_w) + "px", bofqi.style.height = h + "px");
            isWide ? (
                dmbox && (dmbox.style.height = h - 0 + "px"),
                pwrap && (pwrap.style.height = h - 0 + "px"),
                bofqi && (bofqi.style.position = "absolute")
            ) : (
                dmbox && (dmbox.style.height = "auto"),
                pwrap && (pwrap.style.height = "auto"),
                bofqi && (bofqi.style.position = "static")
            );
            document.querySelector('.l-con').style.width = 'auto';
            document.querySelector('.bilibili-player-video-danmaku').style.heigth = h-46-10 + 'px';
        }

        setSize();
        $('.bilibili-player-video').css('margin', '0px 0px');

        // 0.24.2 调整元素顺序
        function rearrange() {
            console.log('rearrange');
            $('.v-wrap').css('margin-top', '10px');

            let title = $('#viewbox_report');
            title.remove();
            title.css('margin-top', '8px');
            let pwrap = $('#playerWrap');
            pwrap.after(title);
        }

        // 等待页面加载完毕再rearrange
        function wrap() {
            if(document.querySelector('span.like').innerText === '--') {
                setTimeout(wrap, 500);
                return;
            }
            rearrange();
        }

        wrap();
    } else if(isBangumi) {
        $('#app').css('margin-top', '10px');
    }

} else {
    console.log('old player, scroll only');
    setDanmuFontsize(0.7);
    if(isBangumi) {
        scrollTo(0, 400);
    } else if(isWatchlater) {
        setTimeout(() => {
            scrollTo(0, 397);
        }, 200);
    } else {
        scrollTo(0, 423);
    }
}
