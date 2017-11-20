phina.globalize();

phina.define("MainScene", {
    superClass: "DisplayScene",
    init: function() {
        this.superInit();
        this.backgroundColor = "black";
        this.blockGroup = DisplayElement().addChildTo(this);
        this.screenRect = Rect(0, 0, 640, 960);

        // ブロック表示
        for (var y = 2 ; y < 6; y++) {
            for (var x = 2; x < 15; x++) {
                 Block().addChildTo(this.blockGroup).setPosition(this.gridX.span(x), this.gridY.span(y));
            }
        }

        var paddleY = this.gridY.span(14);
        var paddle = Paddle().addChildTo(this).setPosition(this.gridX.center(), paddleY);
        // タッチ移動時
        this.onpointmove = function(e) {
            paddle.setPosition(e.pointer.x , paddleY);
        };
        // タッチ終了時
        this.onpointend = function() {
            if(this.status === "ready") {
                this.ball.vy = -10;
                this.status = "move";
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
        if(this.status == "ready") {
            ball.vx = 0;
            ball.vy = 0;
            ball.x = paddle.x;
            ball.bottom = paddle.top;
            // ボール移動時
        } else if(this.status == "move") {
            ball.moveBy(ball.vx, ball.vy);
            // 画面端当たり判定
            if(ball.top < screenRect.top) {
                ball.vy = -ball.vy;
            }
            if(ball.left < screenRect.left || ball.right > screenRect.right) {
                ball.vx = -ball.vx;
            }

            if(ball.top > screenRect.bottom) {
                // ゲームオーバー表示
                Label({text: 'GAME OVER', fill: 'yellow'})
                    .addChildTo(this)
                    .setPosition(this.gridX.center(), this.gridY.center());
            }
            // パドル当たり判定・反射角度
            if(ball.hitTestElement(paddle)) {
                ball.bottom = paddle.top;
                ball.vy = -ball.vy;
                var dx = paddle.x - ball.x;
                ball.vx = -dx / 5;
            }

            // ブロック当たり判定
            for(var i = 0; i < this.blockGroup.children.length; i++) {
                var block = this.blockGroup.children[i]

                if(ball.hitTestElement(block)) {
                    if(ball.top < block.top || ball.bottom > block.bottom) {
                        ball.vy = -ball.vy;
                    } else if(ball.left < block.left || block.right < ball.right) {
                        ball.vx = -ball.vx;
                    }
                    block.remove();
                }
            }

            // クリア判定
            if(this.blockGroup.children.length == 0) {
                Label({text: 'CLEAR', fill: 'yellow'})
                    .addChildTo(this)
                    .setPosition(this.gridX.center(), this.gridY.center());
                this.status = "ready";
            }

        }
    }
});

phina.define("Block",{
    superClass: "RectangleShape",
    init: function(){
        this.superInit({
            width: 40,
            height: 60,
            fill: "orange",
        });
    },
});

phina.define("Paddle", {
    superClass: "RectangleShape",
    init: function() {
        this.superInit({
            width: 100,
            height: 30,
            fill: "white",
        });
    },
});

phina.define("Ball", {
    superClass: "CircleShape",
    init: function() {
        this.superInit({
            radius: 10,
            fill: "white",
        });
    },
});

phina.main(function() {
    var app = GameApp({
        title: "Break Out",
    });
    app.run();
});
