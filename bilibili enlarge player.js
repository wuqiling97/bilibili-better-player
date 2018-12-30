// ==UserScript==
// @name         bilibili better player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决B站新版播放器太小的问题
// @author       You
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/watchlater/*
// @match        *://www.bilibili.com/bangumi/play/ep*
// @grant        none
// ==/UserScript==



function danmuFontsize(size) {
    var s = JSON.parse(localStorage.bilibili_player_settings);
    s.setting_config.fontsize = size;
    localStorage.bilibili_player_settings = JSON.stringify(s);
}

function isint(n) {
    return parseFloat(n.toFixed(5)) === Math.round(n);
}

var isOld = document.querySelector('.bilibili-player-auxiliary-area');
var isBangumi = location.pathname.indexOf('bangumi') !== -1;

if(!isOld && !isBangumi) {
    // 新版
    var set = JSON.parse(localStorage.bilibili_player_settings);
    console.log('fontsize', set.setting_config.fontsize);
    var fontsize = set.setting_config.fontsize;
    if(fontsize >= 1 || !isint(fontsize / 0.2)) {
        danmuFontsize(0.6);
    }

    Math.clamp = function(val, l, h) {
        (val < l) && (val = l);
        (val > h) && (val = h);
        return val;
    };

    /*
    高度数据：
    header 50
    播放器上方margin 20
    弹幕设置 46
    标题 49.1 margin 16
    操作 28+8+1 margin 12
    up 40 margin: 16 12
    */

    window.setSize = function() {
        // header, 播放器上方margin, 弹幕设置, 标题, 操作, up
        var eleHeight = [50, 20, 46, 49.1+16, 28+12, 40+16];
        var eleShow =   [1,  1,  1,  1,       1,       0];
        var eleTotHeight = 0;
        for(let i=0; i<eleShow.length; i++) {
            eleTotHeight += eleHeight[i] * eleShow[i];
        }
        var isWide = window.isWide
            , t = 350 // 右侧栏+margin 320+30
            , height = document.body.offsetHeight
            , width = document.body.offsetWidth
            // , n = parseInt(16 * (.743 * height - 108.7) / 9) // 用height限制宽度
            , n = parseInt(16 * (height - eleTotHeight) / 9)
            , r = width - 152 - t // 用width限制
            , d = Math.min(r, n);
        d = Math.clamp(d, 638, 1280);
        var w = d + t
            , h = Math.round((d + (isWide ? t : 0)) * (9 / 16)) + 46
            , pad = "0 " + (width < w + 152 ? 76 : 0)
            , u = document.querySelector(".stardust-video .bili-wrapper")
            , vwrap = document.querySelector(".v-wrap")
            , bofqi = document.querySelector("#bofqi")
            , dmbox = document.querySelector("#danmukuBox")
            , pwrap = document.querySelector("#playerWrap");
        u && (u.style.width = w + "px", u.style.padding = pad + "px");
        vwrap && (vwrap.style.width = w + "px", vwrap.style.padding = pad + "px");
        bofqi && (bofqi.style.width = w - (isWide ? 0 : t) + "px", bofqi.style.height = h + "px");
        isWide ? (
            dmbox && (dmbox.style.height = h - 0 + "px"),
            pwrap && (pwrap.style.height = h - 0 + "px"),
            bofqi && (bofqi.style.position = "absolute")
        ) : (
            dmbox && (dmbox.style.height = "auto"),
            pwrap && (pwrap.style.height = "auto"),
            bofqi && (bofqi.style.position = "static")
        );
    }

    // window.addEventListener("resize", setSize);
    // window.PlayerAgent = {
    //     player_widewin: function() {
    //         window.scrollTo(0, 55),
    //         window.isWide = true,
    //         setSize();
    //         console.log('haha');
    //     },
    //     player_fullwin: function(e) {
    //         window.scrollTo(0, 0),
    //         window.isWide = false,
    //         setSize()
    //     }
    // };

    setSize();
} else {
    console.log('old player, scroll only');
    danmuFontsize(0.7);
    if(isBangumi) {
        scrollTo(0, 400);
    } else {
        scrollTo(0, 423);
    }
}
