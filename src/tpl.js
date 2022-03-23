export default `
<style>
  .pinyin-it-app {
    position: fixed;
    background-color: #FFFFFF;
    padding: 5px;
    visibility: hidden;
    border-radius: 3px;
    border: 1px solid #E03F44;
    box-shadow: 0px 2px 5px -1px rgba(0,0,0,0.75);
    z-index: 99999;
  }

  .pinyin-it-app ruby {
    display: flex;
    flex-flow: column-reverse nowrap;
    justify-content: center;
    align-items: center;
  }
  .pinyin-it-app span {
    font-size: 16px;
    display: block;
    padding: 0 0.2em 0.4em 0.2em;
  }

  .pinyin-it-app rt {
    font-size: 16px;
    padding: 0.4em;
  }
  .pinyin-it-app.show {
    visibility: visible;
  }
</style>
<div class="pinyin-it-app">
  <div class="pinyin-container">
    <ruby>
      <span class="char"></span>
      <rt class="pinyin"></rt>
    </ruby>
  </div>
</div>
`
