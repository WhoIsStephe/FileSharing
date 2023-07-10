/*import{
Room

} from './DisplayedText.js';
*/
const term = new Terminal({
  cursorBlink: true,
  macOptionIsMeta: true,
  scrollback: true,
  allowProposedApi: true,
});
term.attachCustomKeyEventHandler(customKeyEventHandler);
// https://github.com/xtermjs/xterm.js/issues/2941
const fit = new FitAddon.FitAddon();
term.loadAddon(fit);

term.open(document.getElementById("terminal"));
fit.fit();
term.resize(15, 50);
console.log(`size: ${term.cols} columns, ${term.rows} rows`);
fit.fit();
term.writeln("You awake in a room not knowing where you are... strangely enough, you can't remember your own name");
//Below is where the room desc will be once I figure out how to import scripts properly. For whatever reason Import (variable name) from (script name) wont work
term.writeln('');
term.writeln('')
var count = 0
var input = '';
term.onData((data) => {
  input = (input + data);
  term.write(input);
  console.log("browser terminal received new data:", data);
  term.write(data);    
});

function fitToscreen() {
  fit.fit();
  const dims = { cols: term.cols, rows: term.rows };
  console.log("sending new dimensions to server's pty", dims);
}

function debounce(func, wait_ms) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait_ms);
  };
}

/*
Handle copy and paste events
 */
function customKeyEventHandler(e) {
  if (e.type !== "keydown") {
    return true;
  }
  if (e.ctrlKey && e.shiftKey) {
    const key = e.key.toLowerCase();
    if (key === "v") {
      // ctrl+shift+v: paste whatever is in the clipboard
      navigator.clipboard.readText().then((toPaste) => {
        term.writeText(toPaste);
      });
      return false;
    } else if (key === "c" || key === "x") {
      // ctrl+shift+x: copy whatever is highlighted to clipboard

      // 'x' is used as an alternate to 'c' because ctrl+c is taken
      // by the terminal (SIGINT) and ctrl+shift+c is taken by the browser
      // (open devtools).
      // I'm not aware of ctrl+shift+x being used by anything in the terminal
      // or browser
      const toCopy = term.getSelection();
      navigator.clipboard.writeText(toCopy);
      term.focus();
      return false;
    }
  }
  console.log(e.key);
  if(e.key === 'Enter'){
    term.write('\n');
  }
  console.log(e.key);
  if(e.key === 'Backspace'){
    term.write('\b \b')
  }
  return true;
}
//this code is copy pasted for testing
/*var input = "";
term.on("data", (data) => {
  const code = data.charCodeAt(0);
  if (code == 13) { // CR
    term.write("\r\nYou typed: '" + input + "'\r\n");
    term.write("~$ ");
    input = "";
  } else if (code < 32 || code == 127) { // Control
    return;
  } else { // Visible
    term.write(data);
    input += data;
  }
});
*/
//end of copy pasted code
const wait_ms = 50;
window.onresize = debounce(fitToscreen, wait_ms);

