
function outf(text) {
    addCmd(text.replace("\n", ""))
    console.log(text)
}

function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function runit() {
    /*let lines = editor.getValue().split("\n").length
    if (lines > 10) {
        alert("Koodi on liian pitkä!")
        return
    }*/

    var prog = `
class _Entity:
    def __init__(self, x, y, sprite):
        self.x=x
        self.y=y
        self.id=str(id(self))
        print(f"addEntity:{self.id},{x},{y},{sprite}")
    def move(self, dir):
        print(f"move:{self.id},{dir}")
    def say(self, text):
        print(f"say:{self.id},{text}")
    def liiku(self, dir):
        if dir == "ylös": dir = "up"
        if dir == "alas": dir = "down"
        if dir == "vasen": dir = "left"
        if dir == "oikea": dir = "right"
        print(f"move:{self.id},{dir}")

class Bunny(_Entity):
    def __init__(self, x, y):
        super().__init__(x, y, "bunny")
class Cat(_Entity):
    def __init__(self, x, y):
        super().__init__(x, y, "cat")
class Pupu(_Entity):
    def __init__(self):
        super().__init__(0, 0, "bunny")

pallero = Pupu()\n` + editor.getValue();
    Sk.configure({
        output: outf,
        read: builtinRead,
        execLimit: 5000,
    });
    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function (mod) {
        console.log('success');
    },
        function (err) {
            let offset = 29
            let parts = err.toString().split(" ")
            let count = parts.length
            parts[count-1] -= offset
            alert(parts.join(" "));
            console.log(err.toString());
        });
}
