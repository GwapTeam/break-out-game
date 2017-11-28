phina.globalize();

phina.define("MainScene", {
    superClass: "DisplayScene",
    init: function() {
        this.superInit();
        this.backgroundColor = "black";
    }
});

phina.main(function() {
    var app = GameApp({
        title: "Break Out",
    });
    app.run();
});
