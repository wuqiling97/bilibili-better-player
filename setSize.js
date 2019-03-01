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
      , n = parseInt(16 * (.743 * i - 108.7) / 9)
      , r = o - 152 - t
      , d = r < n ? r : n;
    d < 638 && (d = 638),
    1280 < d && (d = 1280);
    var s, a = d + t;
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