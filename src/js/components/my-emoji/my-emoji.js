/**
 * The my-emoji web component module.
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    .emoji-container {
        width: 100px;
        height: 100px;
        margin: auto;
    }

    .emoji-list {
        background-color: #fff;
        width: 100%;
        height: 100px;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        border-radius: 5px;
        padding: 10px;
    }

    .emoji {
        position: relative;
        font-size: 15px;
        width: 20px;
        height: 20px;
        margin: 3px auto;
    }

    .emoji:hover {
        transform: scale(1.3);
    }
  
</style>
<div id="container-emoji">
    <div id="emoji-list">
        <div id="emoji">🙂</div>
        <div id="emoji">😂</div>
        <div id="emoji">😍</div>
        <div id="emoji">😎</div>
        <div id="emoji">☹️</div>
        <div id="emoji">😡</div>
    </div>
</div>
`
