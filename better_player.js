// ==UserScript==
// @name         bilibili better player
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  扩大新版播放器、更多弹幕字号、弹幕屏蔽一键同步
// @author       You
// @match        http*://www.bilibili.com/video/av*
// @match        http*://www.bilibili.com/video/BV*
// @match        http*://www.bilibili.com/video/bv*
// @match        http*://www.bilibili.com/watchlater/#/*
// @match        http*://www.bilibili.com/bangumi/play/*
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// ==/UserScript==
'use strict'

// 问题
// watchlater/#/* 无法匹配，但是 watchlater/* 能匹配

// 用户可设置的变量
const userFontSize = 0.7;

const $c = document.querySelector.bind(document);
window.$c = $c;
//$ 辅助函数
Math.clamp = function(val, l, h) {
    (val < l) && (val = l);
    (val > h) && (val = h);
    return val;
};
function isclose(a, b) {
    var min = Math.min(Math.abs(a), Math.abs(b));
    return Math.abs(a-b) < min * 1e-7;
}

function log(...data) {
    console.log('[TAMPER]', ...data);
}

function setDanmuFontsize(size) {
    var s = JSON.parse(localStorage.bilibili_player_settings);
    s.setting_config.fontsize = size;
    localStorage.bilibili_player_settings = JSON.stringify(s);
}
function getDanmuFontsize() {
    var s = JSON.parse(localStorage.bilibili_player_settings);
    return s.setting_config.fontsize;
}

// 对付延迟加载
function conditionExec(condition, task, interval) {
    if(!condition()) {
        setTimeout(() => conditionExec(condition, task, interval), interval);
    } else {
        task();
    }
}
//$ 辅助函数end


//$ 设置播放器大小的3函数
// 页面px常量
const px = {
    rconW: 350, // 右侧栏+左右栏margin 320+30
    appMinPad: 76, // 左右最小padding
    dmBarH: 46, // 弹幕发送条高度
    blackSide2H: 96,
    blackSide2W: 14,
    video_margin_top: 10,
    title_margin: 8
};

const sel = {
    title: '#viewbox_report', playerwrap: '#playerWrap',
    toubi: '#arc_toolbar_report'
};
// window.sel = sel;

function getHeightConstrain(pageH) {
    var toolH = 1e5;
    if(isNormal) {
        // 容纳标题+点赞的高度
        // var headerH = 0, header = $c('#internationalHeader');
        // if(header) {
        //     headerH = header.offsetHeight;
        // }
        // toolH = pageH - (headerH + px.video_margin_top + px.title_margin + px.dmBarH +
        //     $c(sel.title).offsetHeight + 16 + $c(sel.toubi).offsetHeight);
        toolH = pageH - (56 + px.video_margin_top + px.title_margin + px.dmBarH +
            50 + 16 + $c(sel.toubi).offsetHeight);
    }
    // var h = window.isWide ? (.743 * pageH - 108.7) : Math.min(0.68 * pageH, toolH);
    var h = (.743 * pageH - 108.7);
    return Math.round(h * 16/9)
}

function setSizeNormal() {
    var i = window.isWide,
        e = 350,
        n = window.innerHeight;
    w = window.innerWidth,
        w1 = getHeightConstrain(n),
        w2 = w - 152 - e,
        min = w1 > w2 ? w2 : w1,
        min < 638 && (min = 638),
        1630 < min && (min = 1630);
    var t, o = min + e;
    t = window.hasBlackSide && !window.isWide ? Math.round((min - 14 + (i ? e : 0)) * (9 / 16) + 46) + 96 : Math.round((min + (i ? e : 0)) * (9 / 16)) + 46;
    var r = function(i, e) {
            for (var n = i + " {", t = Object.keys(e), o = 0; o < t.length; o++)
                n += t[o] + ": " + e[t[o]] + ";";
            return n + "}\n"
        },
        a = r(".v-wrap", {
            width: o + "px",
            padding: "0 " + (o + 152 > w ? 76 : 0) + "px"
        }) + r(".l-con", {
            width: o - e + "px"
        }) + r("#bilibili-player", {
            width: o - (i ? 0 : e) + "px",
            height: t + "px",
            position: i ? "relative" : "static"
        }) + r("#danmukuBox", {
            "margin-top": i ? t + 28 + "px" : "0"
        }) + r("#playerWrap", {
            height: i ? t - 0 + "px" : "auto"
        });
    setSizeStyle.innerHTML = a
}

function setSizeBangumi() {
    // 有special cover(背景图): 你的名字 www.bilibili.com/bangumi/play/ss12176
    var maxW = md.specialCover ? 1070 : 1280
    , rcon_w = 350
    , pageH = $(window).height()
    , pageW = $(window).width()
    , thh = md.specialCover ? Math.round((pageH - 264) * 16 / 9 - rcon_w) : getHeightConstrain(pageH)
    , thw = pageW - 152 - rcon_w
    , videoW = Math.min(thw, thh);
    videoW = Math.clamp(videoW, 638, maxW);
    var appWidth = videoW + rcon_w
    , overflow = pageW < appWidth + 152;
    var isWide = window.isWide;

    $(".main-container").css({
        width: overflow ? appWidth + 76 : appWidth,
        paddingLeft: (overflow ? 76 : 0) + "px",
        marginLeft: overflow ? "0" : "",
        marginRight: overflow ? "0" : ""
    })
    if (md.specialCover) {
        var h = Math.round(9 * appWidth / 16 + 46);
        $("#player_module").css({
            height: h,
            width: appWidth,
            paddingLeft: "",
            left: overflow ? 76 : "",
            transform: overflow ? "none" : "",
            webkitTransform: overflow ? "none" : ""
        }),
        $(".special-cover").css({height: h + 218}),
        $(".plp-l").css({paddingTop: h + 24}),
        $(".plp-r").css({marginTop: h + 40}),
        $("#danmukuBox").css({top: -(h + 40)})
    } else {
        var h = 46 + (window.hasBlackSide && !isWide ?
            Math.round((videoW - 14 + (isWide ? rcon_w : 0)) * (9 / 16)) + 96 :
            Math.round((videoW + (isWide ? rcon_w : 0)) * (9 / 16)))
        $("#danmukuBox").css({top: ""});
        if(window.isWide) {
            $("#player_module").css({
                height: h,
                width: "",
                paddingLeft: overflow ? 76 : "",
                left: "",
                transform: "",
                webkitTransform: ""
            });
            $(".plp-l").css({paddingTop: h - 0})
            $(".plp-r").css({marginTop: h + 16})
            // scrollTo(0, 55)
        } else {
            $("#player_module").css({
                height: h - 0,
                width: "",
                paddingLeft: "",
                left: "",
                transform: "",
                webkitTransform: ""
            })
            $(".plp-l, .plp-r").removeAttr("style")
            // scrollTo(0, 0)
        }
    }
}

function setSizeMini() {
    const getwh = function(selector) {
        let w = 320 - 70 + parseFloat($(selector).css('margin-right').replace('px', ''));
        w = Math.clamp(w, 320, 410);
        return `width: ${w}px!important; height: ${(w*2/3).toFixed(2)}px!important;`;
    }

    var getcss = isBangumi?
    function() {
        let wh = getwh('#app');
        return `#bilibili-player.stardust-player.mini-player.report-wrap-module {
    ${wh}
}`
    } :
    function() {
        let wh = getwh('.v-wrap');
        return `#bilibili-player.mini-player, #bilibili-player.mini-player:before, #bilibili-player.mini-player .player {
    ${wh}
}`
    };

    var style = $("<style id='bbp-miniplayer' type='text/css'></style>");
    $('head').append(style)
    style.text(getcss());
    window.addEventListener('resize', function() {
        style.text(getcss());
    })
}

//$ 完善播放器
// location: url相关
const isBangumi = location.pathname.indexOf('bangumi') !== -1;
const isWatchlater = location.pathname.indexOf('watchlater') !== -1;
const isNormal = !(isBangumi || isWatchlater);
if(true) {
    // log('origin fontsize', getDanmuFontsize());

    // 修改mini player
    // if(!isWatchlater) {
    //     setSizeMini();
    // }
    // 修改播放器大小
    if(isNormal) {
        window.setSize = setSizeNormal; // setSize

        const css = `
.v-wrap .l-con,
.v-wrap .r-con {
    display: flex;
    flex-direction: column;
}
${sel.playerwrap} {
    order: -1;
    margin-top: ${px.video_margin_top}px;
}
${sel.title} {
    margin-top: ${px.title_margin}px !important;
    padding: 0 !important;
    height: auto !important;
}
/* .v-wrap .r-con .up-info {
    padding-top: 0 !important;
} */
.video-info .video-data .argue,
.video-info .video-data .copyright {
    overflow: hidden;
    text-overflow: ellipsis;
}`
        var style = $("<style id='bbp-player-on-top' type='text/css'></style>");
        $('head').append(style)
        style.text(css);
        
    } else if(isBangumi) {
        $(window).off('resize.stardust');
        window.setSize = setSizeBangumi; // setSize
        $(window).on('resize.stardust', setSize);
        setSize();
        if(!md.specialCover) {
            $('#app').css('margin-top', '10px');
        } else {
            let scrollY = parseFloat($('#app').css('margin-top').replace('px', '')) + 50 - 24;
            scrollTo(0, scrollY);
        }
    }
}


//$ 批量操作，弹幕屏蔽规则全部启用/禁用，全部同步开关
const ON = '启用', OFF = '关闭';
function toggleRuleState() {
    const rules = $('span.player-auxiliary-block-line-state'); //所有“启用”按钮
    var on = 0, off = 0;
    rules.each((idx, ele) => {
        switch(ele.innerText) {
            case OFF: off += 1; break;
            case ON: on += 1; break;
            default:
        }
    })
    const shouldon = on < off;

    rules.each((idx, ele) => {
        if(ele.innerText === ON && !shouldon ||
            ele.innerText === OFF && shouldon) {
            ele.click()
        }
    })
}

conditionExec(
    () => $c('div.player-auxiliary-block-list-function-state') && $c('div.player-auxiliary-block-list-function-sync'),
    () => {
        const css = {color: '#00a1d6', cursor: 'pointer'}
        const dmstate = $('div.player-auxiliary-block-list-function-state')
        const dmsync = $('div.player-auxiliary-block-list-function-sync')
        const dmdel = $('div.player-auxiliary-block-list-function-delete')
        dmstate.on('click', toggleRuleState)
        dmstate.css(css)
        dmsync.on('click', () => {
            $('span.player-auxiliary-block-line-sync.bp-icon.icon-player-sync').click()
        })
        dmsync.css(css)
        dmdel.on('click', () => {
            $('span.player-auxiliary-block-line-delete.bp-icon.icon-general-del').click();
        })
        dmdel.css(css)
    }, 700
)
