function setSize() {
    var isWide = window.isWide
        // , t = 400
        , t = 800
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