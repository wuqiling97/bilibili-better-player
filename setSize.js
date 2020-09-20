function setSize() {
    var isWide = window.isWide
        , t = 350
        , height = document.body.offsetHeight
        , width = document.body.offsetWidth
        , n = parseInt(16 * (.743 * height - 108.7) / 9)
        , r = width - 152 - t
        , d = r < n ? r : n;
    d = Math.clamp(d, 638, 1280);
    var s = d + t
        , a = Math.round((d + (isWide ? t : 0)) * (9 / 16)) + 46
        , l = "0 " + (width < s + 152 ? 76 : 0)
        , u = document.querySelector(".stardust-video .bili-wrapper")
        , vwrap = document.querySelector(".v-wrap")
        , bofqi = document.querySelector("#bofqi")
        , dmbox = document.querySelector("#danmukuBox")
        , pwrap = document.querySelector("#playerWrap");
    u && (u.style.width = s + "px", u.style.padding = l + "px"),
    vwrap && (vwrap.style.width = s + "px", vwrap.style.padding = l + "px"),
    bofqi && (bofqi.style.width = s - (isWide ? 0 : t) + "px", bofqi.style.height = a + "px"),
    isWide ? (
        dmbox && (dmbox.style.height = a - 0 + "px"),
        pwrap && (pwrap.style.height = a - 0 + "px"),
        bofqi && (bofqi.style.position = "absolute")
    ) : (
        dmbox && (dmbox.style.height = "auto"),
        pwrap && (pwrap.style.height = "auto"),
        bofqi && (bofqi.style.position = "static")
    )
}

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
//番剧
//未知属性 specialCover
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

