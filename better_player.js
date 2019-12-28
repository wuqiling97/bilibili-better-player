// ==UserScript==
// @name         bilibili better player
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  扩大新版播放器、更多弹幕字号、弹幕屏蔽一键同步
// @author       You
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/watchlater/#/av*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// ==/UserScript==
'use strict'

// 用户可设置的变量
const userFontSize = 0.7;
function getHeightConstrain(pageH) {
    var h = window.isWide ? (.743 * pageH - 108.7) : 0.68 * pageH
    return Math.round(h * 16/9)
}

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
window.setDanmuFontsize = setDanmuFontsize;
window.getDanmuFontsize = getDanmuFontsize;

function isBigscreen() {
    return screen.width > 1500;
}

// 对付延迟加载
function conditionExec(condition, task, timeout) {
    if(!condition()) {
        // log('wait', timeout, 'for', task);
        setTimeout(() => conditionExec(condition, task, timeout), timeout);
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
    blackSide2W: 14
};

function setSizeNormal() {
    var isWide = window.isWide
        , pageH = $(window).height()
        , pageW = $(window).width()
        , thh = getHeightConstrain(pageH) // 用height限制宽度
        , thw = pageW - 2*px.appMinPad - px.rconW // 用width限制，实为margin+iswide限制
        , videoW = Math.min(thw, thh); // 非宽屏下的宽度
    videoW = Math.clamp(videoW, 638, 1280);
    var w = videoW + px.rconW; // 内容部分宽度
    // 视频+弹幕条的高度, 加window.可防止reference error
    var h = px.dmBarH + (window.hasBlackSide && !isWide ?
        Math.round((videoW - px.blackSide2W + (isWide ? px.rconW : 0)) * (9 / 16)) + px.blackSide2H :
        Math.round((videoW + (isWide ? px.rconW : 0)) * (9 / 16)))
    var pad = "0 " + (pageW < w + 2*px.appMinPad ? px.appMinPad : 0) // margin至少76
    var u = $c(".stardust-video .bili-wrapper")
        , vwrap = $c(".v-wrap")
        , bofqi = $c("#bofqi")
        , dmbox = $c("#danmukuBox")
        , pwrap = $c("#playerWrap")
        , lcon  = $c('.l-con');
    u && (u.style.width = w + "px", u.style.padding = pad + "px");
    vwrap && (vwrap.style.width = w + "px", vwrap.style.padding = pad + "px");
    bofqi && (bofqi.style.width = videoW + (isWide ? px.rconW : 0) + "px", bofqi.style.height = h + "px");
    isWide ? (
        dmbox && (dmbox.style.height = h - 0 + "px"),
        pwrap && (pwrap.style.height = h - 0 + "px"),
        bofqi && (bofqi.style.position = "absolute")
    ) : (
        dmbox && (dmbox.style.height = "auto"),
        pwrap && (pwrap.style.height = "auto"),
        bofqi && (bofqi.style.position = "static")
    );
    lcon && (lcon.style.width = videoW + 'px');
    // $c('.bilibili-player-video-danmaku').style.heigth = h-46-10 + 'px';
    // isWide && scrollTo(0, 55) // 滚动到合适位置
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
    var getcss = isBangumi?
    function() {
        let w = 320 - 70 + parseFloat($('#app').css('margin-right').replace('px', ''))
        return `#bofqi.stardust-player.mini-player.report-wrap-module {
  width: ${w}px!important;
  height: ${w*2/3}px!important;
}`
    } :
    function() {
        let w = 320 - 70 + parseFloat($('.v-wrap').css('margin-right').replace('px', ''))
        return `#bofqi.mini-player {
    width: ${w}px!important;
    height: ${w*2/3}px!important;
}
#bofqi.mini-player .player {
    width: ${w}px!important;
    height: ${w*2/3}px!important;
}`
    };

    var style = $("<style id='tamper' type='text/css'></style>");
    $('body').append(style)

    miniObs = new MutationObserver(function(mutationsList) {
        // console.log(mutationsList);
        for(let mutation of mutationsList) {
            if(mutation.attributeName === 'class') {
                let bofqi = $(mutation.target)
                if(bofqi.hasClass('mini-player')) {
                    style.text(getcss())
                    // log('mini player', w)
                } else {
                    style.text('')
                    // log('no mini')
                }
            }
        }
    })
    miniObs.observe($c('#bofqi'), {
        attributes: true, attributeOldValue: false, attributeFilter: ['class']
    })
}

//$ 完善播放器
// location: url相关
const isBangumi = location.pathname.indexOf('bangumi') !== -1;
const isWatchlater = location.pathname.indexOf('watchlater') !== -1;
const isNormal = !(isBangumi || isWatchlater);
if(true) {
    log('origin fontsize', getDanmuFontsize(), 'set to', userFontSize);
    setDanmuFontsize(userFontSize);

    // 修改mini player
    if(!isWatchlater) {
        setSizeMini();
    }
    // 修改播放器大小
    if(isNormal) {
        window.setSize = setSizeNormal; // setSize
        setSize();

        // 0.24.2 调整元素顺序
        function rearrange() {
            $('.v-wrap').css('margin-top', '10px');

            let title = $('#viewbox_report');
            let pwrap = $('#playerWrap');
            title.css('margin-top', '8px');
            title.insertAfter('#playerWrap');
        }

        // 等待页面加载完毕再rearrange
        conditionExec(
            () => $c('span.like').innerText !== '--',
            rearrange, 500
        );

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
    // console.log('on, off = ', on, off)
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
