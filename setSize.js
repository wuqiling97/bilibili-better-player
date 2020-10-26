window.addEventListener("resize", setSize);
window.PlayerAgent = {
    player_widewin: function() {
        window.scrollTo(0, 55),
        window.isWide = true,
        setSize();
        console.log('haha');
    },
    player_fullwin: function(e) {
        window.scrollTo(0, 0),
        window.isWide = false,
        setSize()
    }
};

// 版本 0.21.3-98ac136
function setSize() {
    var e = window.isWide
      , t = 350
      , i = document.body.offsetHeight
      , o = document.body.offsetWidth
      , n = parseInt(16 * (.743 * i - 108.7) / 9)
      , r = o - 152 - t
      , d = r < n ? r : n;
    d < 638 && (d = 638),
    1280 < d && (d = 1280);
    var s, a = d + t;
    s = window.hasBlackSide && !window.isWide ? Math.round((d - 14 + (e ? t : 0)) * (9 / 16) + 46) + 96 : Math.round((d + (e ? t : 0)) * (9 / 16)) + 46;
    var l = "0 " + (o < a + 152 ? 76 : 0)
      , vwrap = document.querySelector(".v-wrap")
      , c = document.querySelector(".l-con")
      , u = document.querySelector("#bofqi")
      , y = document.querySelector("#danmukuBox")
      , h = document.querySelector("#playerWrap");
    vwrap && (vwrap.style.width = a + "px",
    vwrap.style.padding = l + "px"),
    u && (u.style.width = a - (e ? 0 : t) + "px",
    u.style.height = s + "px"),
    c && (c.style.width = a - t + "px"),
    e ? (y && (y.style.height = s - 0 + "px"),
    h && (h.style.height = s - 0 + "px"),
    u && (u.style.position = "absolute")) : (y && (y.style.height = "auto"),
    h && (h.style.height = "auto"),
    u && (u.style.position = "static"))
}

// 版本 0.24.2-67b484e
function setSize() {
    var e = window.isWide
      , t = 350
      , i = document.body.offsetHeight
      , o = document.body.offsetWidth
      , n = parseInt(16 * (.743 * i - 108.7) / 9) //根据height限制宽度
      , r = o - 152 - t
      , d = r < n ? r : n;
    d < 638 && (d = 638),
    1280 < d && (d = 1280);
    var s, a = d + t;
    // 有黑边，再加48x2给margin
    s = window.hasBlackSide && !window.isWide ? Math.round((d - 14 + (e ? t : 0)) * (9 / 16) + 46) + 96 : Math.round((d + (e ? t : 0)) * (9 / 16)) + 46;
    var l = "0 " + (o < a + 152 ? 76 : 0)
      , w = document.querySelector(".v-wrap")
      , c = document.querySelector(".l-con")
      , u = document.querySelector("#bofqi")
      , y = document.querySelector("#danmukuBox")
      , h = document.querySelector("#playerWrap");
    w && (w.style.width = a + "px",
    w.style.padding = l + "px"),
    u && (u.style.width = a - (e ? 0 : t) + "px",
    u.style.height = s + "px"),
    c && (c.style.width = a - t + "px"),
    e ? (y && (y.style.height = s - 0 + "px"),
    h && (h.style.height = s - 0 + "px"),
    u && (u.style.position = "absolute")) : (y && (y.style.height = "auto"),
    h && (h.style.height = "auto"),
    u && (u.style.position = "static"))
}

// ver 2.40.? 语义化
function setSizeNormal() {
    var isWide = window.isWide,
        pageH = window.innerHeight;
    var pageW = window.innerWidth,
        w1 = getHeightConstrain(pageH), // 用height限制宽度
        w2 = pageW - 2 * px.appMinPad - px.rconW, // 用width限制，实为margin+iswide限制
        videoW = Math.min(w1, w2);
    videoW = Math.clamp(videoW, 638, 1280); // 视频区非宽屏下的宽度
    var allW = videoW + px.rconW; // 视频+右栏部分宽度
    var videoH = px.dmBarH + (window.hasBlackSide && !isWide ?
        Math.round((videoW - px.blackSide2W + (isWide ? px.rconW : 0)) * (9 / 16)) + px.blackSide2H :
        Math.round((videoW + (isWide ? px.rconW : 0)) * (9 / 16)));
    var getcss = function(selector, css) {
        for (var pageH = selector + " {", keys = Object.keys(css), i = 0; i < keys.length; i++)
            pageH += keys[i] + ": " + css[keys[i]] + "!important;";
        return pageH + "}\n"
    }
    var a = getcss(".v-wrap", {
        width: allW + "px",
        padding: "0 " + (allW + 152 > pageW ? 76 : 0) + "px"
    }) + getcss(".l-con", {
        width: allW - px.rconW + "px"
    }) + getcss("#bofqi", {
        width: allW - (isWide ? 0 : px.rconW) + "px",
        height: videoH + "px",
        position: isWide ? "relative" : "static"
    }) + getcss("#danmukuBox", {
        "margin-top": isWide ? videoH + 28 + "px" : "0"
    }) + getcss("#playerWrap", {
        height: isWide ? videoH - 0 + "px" : "auto"
    });
    setSizeStyle.innerHTML = a
}

// ver 2.41.1
function setSize() {
    var i = window.isWide,
        e = 350,
        n = window.innerHeight;
    w = window.innerWidth,
        w1 = parseInt(16 * (.743 * n - 108.7) / 9),
        w2 = w - 152 - e,
        min = w1 > w2 ? w2 : w1,
        min < 638 && (min = 638),
        1630 < min && (min = 1630);
    var t, o = min + e;
    t = window.hasBlackSide && !window.isWide ? Math.round((min - 14 + (i ? e : 0)) * (9 / 16) + 46) + 96 : Math.round((min + (i ? e : 0)) * (9 / 16)) + 46;
    var r = function(i, e) {
            for (var n = i + " {", t = Object.keys(e), o = 0; o < t.length; o++)
                n += t[o] + ": " + e[t[o]] + "!important;";
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

// ver 2.43.0 去掉了important
function setSize() {
    var i = window.isWide
        , e = 350
        , n = window.innerHeight;
    w = window.innerWidth,
    w1 = parseInt(16 * (.743 * n - 108.7) / 9),
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
    }
        , a = r(".v-wrap", {
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

//番剧
// 有special cover(背景图): 你的名字 www.bilibili.com/bangumi/play/ss12176

// ver 0.24.2 语义化
function setSize() {
    var maxW = md.specialCover ? 1070 : 1280
      , rcon_w = 350
      , height = $(window).height()
      , width = $(window).width()
      , thh = Math.round(md.specialCover ? 16 * (height - 264) / 9 - rcon_w : 16 * (.743 * height - 108.7) / 9)
      , thw = width - 152 - rcon_w
      , videoW = thw < thh ? thw : thh;
    videoW < 638 && (videoW = 638),
    maxW < videoW && (videoW = maxW);
    var appWidth = videoW + rcon_w
      , overflow = width < appWidth + 152;
    if ($(".main-container").css({
        width: overflow ? appWidth + 76 : appWidth,
        paddingLeft: (overflow ? 76 : 0) + "px",
        marginLeft: overflow ? "0" : "",
        marginRight: overflow ? "0" : ""
    }),
    md.specialCover) {
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
        var p = parseInt(9 * (videoW + (window.isWide ? rcon_w : 0)) / 16) + 46 + (window.hasBlackSide && !window.isWide ? 96 : 0);
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
}

// ver 2.41.1
function setSize() {
    var e = md.specialCover ? 1070 : 1280
        , i = 350
        , t = window.innerHeight || document.documentElement.clientHeight
        , o = window.innerWidth || window.document.documentElement.clientWidth
        , n = Math.round(md.specialCover ? 16 * (t - 264) / 9 - i : 16 * (.743 * t - 108.7) / 9)
        , d = o - 152 - i
        , a = d < n ? d : n;
    a < 638 && (a = 638),
    e < a && (a = e);
    var s = a + i
        , r = o < s + 152
        , l = document.querySelector(".main-container");
    if (l.style.width = (r ? s + 76 : s) + "px",
    l.style.paddingLeft = (r ? 76 : 0) + "px",
    l.style.marginLeft = r ? "0" : "",
    l.style.marginRight = r ? "0" : "",
    md.specialCover) {
        var p = Math.round(9 * s / 16 + 46);
        (y = document.querySelector("#player_module")).style.height = p + "px",
        y.style.width = s + "px",
        y.style.paddingLeft = "",
        y.style.left = r ? "76px" : "",
        y.style.transform = r ? "none" : "",
        y.style.webkitTransform = r ? "none" : "";
        var _ = document.querySelector(".special-cover")
            , w = document.querySelector(".plp-l")
            , c = document.querySelector(".plp-r")
            , m = document.querySelector("#danmukuBox");
        _.style.height = p + 218 + "px",
        w.style.paddingTop = p + 24 + "px",
        c.style.marginTop = p + 40 + "px",
        window.isWide ? (m.style.top = "0px",
        m.style.position = "relative") : (m.style.top = -(p + 40) + "px",
        m.style.position = "absolute")
    } else {
        var u = parseInt(9 * (a + (window.isWide ? i : 0)) / 16) + 46 + (window.hasBlackSide && !window.isWide ? 96 : 0);
        if ((m = document.querySelector("#danmukuBox")).style.top = "",
        window.isWide) {
            (y = document.querySelector("#player_module")).style.height = u - 0 + "px",
            y.style.width = "",
            y.style.paddingLeft = r ? "76px" : "",
            y.style.left = "",
            y.style.transform = "",
            y.style.webkitTransform = "";
            w = document.querySelector(".plp-l"),
            c = document.querySelector(".plp-r");
            w.style.paddingTop = u - 0 + "px",
            c.style.marginTop = u + 16 + "px"
        } else {
            var y;
            (y = document.querySelector("#player_module")).style.height = u - 0 + "px",
            y.style.width = "",
            y.style.paddingLeft = "",
            y.style.left = "",
            y.style.transform = "",
            y.style.webkitTransform = "";
            w = document.querySelector(".plp-l"),
            c = document.querySelector(".plp-r");
            w.removeAttribute("style"),
            c.removeAttribute("style")
        }
    }
}