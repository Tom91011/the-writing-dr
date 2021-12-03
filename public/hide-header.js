export default function hideHeader() {
  window.onscroll = () => {
  growShrinkLogo()
}


function growShrinkLogo() {
  const header = document.querySelector("header")
    const main = document.querySelector("main")

    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      header.classList.add("high-nav")
      header.classList.remove("on-load")
      header.classList.remove("low-nav")
    } else {
      header.classList.remove("high-nav")
      header.classList.add("low-nav")
    }
  }

}

hideHeader()
