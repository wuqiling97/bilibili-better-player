// ==UserScript==
// @name         bilibili better player
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  解决B站新版播放器太小的问题
// @author       You
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/watchlater/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// ==/UserScript==
'use strict'

var $c = document.querySelector.bind(document);
window.$c = $c;

Math.clamp = function(val, l, h) {
    (val < l) && (val = l);
    (val > h) && (val = h);
    return val;
};

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

function isint(n) {
    return parseFloat(n.toFixed(5)) === Math.round(n);
}
function isclose(a, b) {
    var min = Math.min(a, b);
    return Math.abs(a-b) < min * 1e-7;
}

function isBigscreen() {
    return screen.width > 1500;
}

var isNew = !!$c('.has-stardust');
// location: url相关
var isBangumi = location.pathname.indexOf('bangumi') !== -1;
var isWatchlater = location.pathname.indexOf('watchlater') !== -1;
var isNormal = !(isBangumi || isWatchlater);
var noNewplayer = isWatchlater;

// 字号函数
var userFontSize = 0.6;
var newplayerFontSize = 0.8;
var ratio = userFontSize / newplayerFontSize;

var correctSize = [18, 25, 36].map(x => userFontSize*x);
var gmutationsList = [];
function isSizeCorrect(element) {
    var ori = parseFloat(element.style.fontSize.replace('px', ''));
    if(!correctSize.map(x => isclose(x, ori)).reduce((x, y) => x||y)) {
        log('字号错误!', ori+'px', element)
        console.log(gmutationsList);
        for(let list of gmutationsList) {
            console.log('mutation:')
            for(let mu of list) {
                if(mu.target.className === 'bilibili-danmaku') {
                    if(mu.addedNodes.length > 0) {
                        console.log('ADD', mu.addedNodes[0], mu);
                    } else {
                        console.log('RM', mu.removedNodes[0], mu);
                    }
                } else {
                    if(mu.addedNodes.length > 0) {
                        console.log('ADD', mu.addedNodes[0], mu);
                    } else {
                        console.log('RM', mu.removedNodes[0], mu);
                    }
                }
            }
        }
        // 判断是否暂停，并暂停视频
        if(!$c('.bilibili-player-area').className.includes('video-state-pause'))
            $c('.bilibili-player-iconfont.bilibili-player-iconfont-start').click();
        return false;
    }
    return true;
}
function changeFontSize(element) {
    var ori = parseFloat(element.style.fontSize.replace('px', ''));
    element.style.fontSize = ori * ratio + 'px';
    isSizeCorrect(element);
}

var mainObserver = null;

function fontSizeMain() {
    if(JSON.parse(localStorage.bilibili_player_settings).setting_config.type === 'div') {
        // 仅在css3渲染弹幕时能够自定义字号
        log('自定义字号:', userFontSize);
        setDanmuFontsize(newplayerFontSize);

        // 监控弹幕div的child变化，并修改fontsize
        mainObserver = new MutationObserver(function(mutationsList) {
            gmutationsList.push(mutationsList);
            if(gmutationsList.length > 3) {
                gmutationsList.shift();
            }
            var changedEle = [];
            for(let mutation of mutationsList) {
                if(mutation.addedNodes.length > 0) {
                    if(mutation.target.className === 'bilibili-danmaku') {
                        // 修改已有弹幕div的inner text
                        if(!changedEle.includes(mutation.target)) {
                            changeFontSize(mutation.target);
                            changedEle.push(mutation.target);
                        }
                    } else {
                        for(let dm of mutation.addedNodes) {
                            changeFontSize(dm);
                            changedEle.push(dm);
                        }
                    }
                }
            }
        })
        mainObserver.observe($c('.bilibili-player-video-danmaku'), {
            childList: true, subtree: true});
    }
}

function listenVideoPartChange() {
    var observer = new MutationObserver(function(mutationsList) {
        console.log('part', mutationsList);
        log('视频P改变');

        // 切换清晰度时也会触发事件，故disconnect之前的监听
        mainObserver.disconnect();
        mainObserver.observe($c('.bilibili-player-video-danmaku'), {
            childList: true, subtree: true});
        setTimeout(listenVideoPartChange, 0);
        observer.disconnect();
    });
    observer.observe($c('.bilibili-player-video'), {
        childList: true, 
        // subtree: true
    });
}
// 字号函数end

if(isNew && !noNewplayer) {
    // 新版
    /// 自定义字号
    log('fontsize', getDanmuFontsize());
    fontSizeMain();
    listenVideoPartChange();

    /// 扩大新版播放器，滚动旧版播放器到适合观看的位置
    if(isNormal) {
        window.setSize = function() {
            var isWide = window.isWide
                , rcon_w = 350 // 右侧栏+左右栏margin 320+30
                , height = $(window).height()
                , width = $(window).width()
                , thh = Math.round(16 * (height*0.68) / 9) // 用height限制宽度
                , thw = width - 152 - rcon_w // 用width限制，实为margin+iswide限制
                , videoW = Math.min(thw, thh);
            videoW = Math.clamp(videoW, 638, 1280);
            var w = videoW + rcon_w
                , h = Math.round((videoW + (isWide ? rcon_w : 0)) * (9 / 16)) + 46
                , pad = "0 " + (width < w + 152 ? 76 : 0) // margin至少76
                , u = $c(".stardust-video .bili-wrapper")
                , vwrap = $c(".v-wrap")
                , bofqi = $c("#bofqi")
                , dmbox = $c("#danmukuBox")
                , pwrap = $c("#playerWrap");
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
            $c('.l-con').style.width = 'auto';
            $c('.bilibili-player-video-danmaku').style.heigth = h-46-10 + 'px';
        } // setSize
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
        function wrap() {
            if($c('span.like').innerText === '--') {
                setTimeout(wrap, 500);
                return;
            }
            rearrange();
        }

        wrap();
    } else if(isBangumi) {
        window.setSize = function() {
            var maxW = md.specialCover ? 1070 : 1280
            , rcon_w = 350
            , height = $(window).height()
            , width = $(window).width()
            , thh = Math.round(md.specialCover ? 16 * (height - 264) / 9 - rcon_w : 16 * (0.68 * height) / 9)
            , thw = width - 152 - rcon_w
            , videoW = thw < thh ? thw : thh;
            videoW < 638 && (videoW = 638),
            maxW < videoW && (videoW = maxW);
            var appWidth = videoW + rcon_w
            , overflow = width < appWidth + 152;

            $(".main-container").css({
                width: overflow ? appWidth + 76 : appWidth,
                paddingLeft: (overflow ? 76 : 0) + "px",
                marginLeft: overflow ? "0" : "",
                marginRight: overflow ? "0" : ""
            })
            if (md.specialCover) {
                var _ = Math.round(9 * appWidth / 16 + 46);
                $("#player_module").css({
                    height: _,
                    width: appWidth,
                    paddingLeft: "",
                    left: overflow ? 76 : "",
                    transform: overflow ? "none" : "",
                    webkitTransform: overflow ? "none" : ""
                }),
                $(".special-cover").css({
                    height: _ + 218
                }),
                $(".plp-l").css({
                    paddingTop: _ + 24
                }),
                $(".plp-r").css({
                    marginTop: _ + 40
                }),
                $("#danmukuBox").css({
                    top: -(_ + 40)
                })
            } else {
                var p = Math.round(9/16 * (videoW + (window.isWide ? rcon_w : 0))) + 46 + (window.hasBlackSide && !window.isWide ? 96 : 0);
                $("#danmukuBox").css({
                    top: ""
                }),
                window.isWide ? ($("#player_module").css({
                    height: p - 0,
                    width: "",
                    paddingLeft: overflow ? 76 : "",
                    left: "",
                    transform: "",
                    webkitTransform: ""
                }),
                $(".plp-l").css({
                    paddingTop: p - 0
                }),
                $(".plp-r").css({
                    marginTop: p + 16
                })) : ($("#player_module").css({
                    height: p - 0,
                    width: "",
                    paddingLeft: "",
                    left: "",
                    transform: "",
                    webkitTransform: ""
                }),
                $(".plp-l, .plp-r").removeAttr("style"))
            }
        } // setSize
        setSize();
        $('#app').css('margin-top', '10px');
    }

} else {
    log('旧播放器，仅滚动');
    setDanmuFontsize(userFontSize);
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

// header, 播放器上方margin, 弹幕设置, 标题, 操作, up
// var eleHeight = [50, 20, 46, 49.1+16, 28+12, 40+16];
// var eleShow =   [1,  1,  1,  1,       1,       0];
// var eleTotHeight = 0;
// for(let i=0; i<eleShow.length; i++) {
//     eleTotHeight += eleHeight[i] * eleShow[i];
// }
// eleTotHeight = isBigscreen()? 230.1 : 221.1;