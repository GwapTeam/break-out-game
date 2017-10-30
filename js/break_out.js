var blockWidth = 40;
var blockHeight = 60;
var paddleWidth = 100;
var paddleHeigth = 30;
var ballSize = 10;

phina.globalize();

phina.define("MainScene", {
    superClass: "DisplayScene",
    init: function(){
        this.superInit();
        this.backgroundColor = "brack";
        this.blockGroup = DisplayElement().addChildTo(this);
        this.screenRect = Rect(0, 0, 640, 960);

        var self = this;

        // ブロック表示
        for (i = 2 ; i < 15; i++) {
            for (j = 2; j < 6; j++){
                 Block().addChildTo(self.blockGroup).setPosition(self.gridX.span(i), self.gridY.span(j));
            }
        }

        var paddleY = this.gridY.span(14);
        var paddle = Paddle().addChildTo(this).setPosition(this.gridX.center(), paddleY);
        // タッチ移動時
        this.onpointmove = function(e) {
            paddle.setPosition(e.pointer.x | 0, paddleY);
        };
        // タッチ終了時
        this.onpointend = function() {
            if (self.status === "ready") {
                self.ball.vy = -self.ball.speed;
                self.status = "move";
            }
        };
        this.ball = Ball().addChildTo(this);
        this.paddle = paddle;
        this.status = "ready";
    },

    // 毎フレーム呼び出し
    update: function() {
        var ball = this.ball;
        var paddle = this.paddle;
        var screenRect = this.screenRect;

        // ボール停止時
        if (this.status == "ready") {
            ball.vx = ball.vy = 0;
            ball.x = paddle.x;
            ball.bottom = paddle.top;
        }
        // ボール移動時
        if (this.status == "move") {
            ball.moveBy(ball.vx, ball.vy);
            // 画面端当たり判定
            if (ball.top < screenRect.top) {
                ball.vy = -ball.vy;
            }
            if (ball.left < screenRect.left) {
                ball.vx = -ball.vx;
            }
            if (ball.right > screenRect.right) {
                ball.vx = -ball.vx;
            }

            var self = this;

            if (ball.top > screenRect.bottom) {
                // ゲームオーバー表示
                var label = Label({
                    text: 'GAME OVER',
                    fill: 'yellow',
                }).addChildTo(this);
                label.setPosition(this.gridX.center(), this.gridY.center());
            }
            // パドル当たり判定・反射角度
            if (ball.hitTestElement(paddle)) {
                ball.bottom = paddle.top;
                ball.vy = -ball.vy;
                var dx = paddle.x - ball.x;
                ball.vx = -dx / 5;
            }
        }
        // ブロック当たり判定
        this.blockGroup.children.some(function(block) {
            if (ball.hitTestElement(block)) {
                if (ball.top < block.top) {
                    ball.vy = -ball.vy;
                    block.remove();
                    return true;
                }
                if (ball.bottom > block.bottom) {
                    ball.vy = -ball.vy;
                    block.remove();
                    return true;
                }
                if (ball.left < block.left) {
                    ball.vx = -ball.vx;
                    block.remove();
                    return true;
                }
                if (block.right < ball.right) {
                    ball.vx = -ball.vx;
                    block.remove();
                    return true;
                }
            }
        });
        // クリア判定
        if (this.blockGroup.children.length == 0) {
            var label = Label({
                text: 'CLEAR',
                fill: 'yellow',
            }).addChildTo(this);
            label.setPosition(this.gridX.center(), this.gridY.center());
            this.status = "ready";
        }
    },
});

phina.define("Block",{
    superClass: "RectangleShape",
    init: function(){
        this.superInit({
            width: blockWidth,
            height: blockHeight,
            fill: "orange",
        });
    },
});

phina.define("Paddle", {
    superClass: "RectangleShape",
    init: function() {
        this.superInit({
            width: paddleWidth,
            height: paddleHeigth,
            fill: "white",
        });
    },
});

phina.define("Ball", {
    superClass: "CircleShape",
    init: function() {
        this.superInit({
            radius: ballSize,
            fill: "white",
        });
        this.speed = 10;
    },
});

phina.main(function() {
    var app = GameApp({
        title: "Break Out",
    });
    app.run();
});
